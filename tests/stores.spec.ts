// The two stores, including the branches that only run once at module load.
//
// `createStore` memoises, so `initial()` and the saved-theme read happen exactly once per
// module instance. Testing them therefore means `vi.resetModules()` plus a fresh dynamic
// import per case - importing the module normally would only ever exercise whichever
// environment the first test in the file happened to set up.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import type { Locale } from '../src/stores/locale';
import type { Theme } from '../src/stores/theme';

type MediaListener = () => void;

/**
 * A `matchMedia` whose match state can be flipped, so "the visitor changed their OS theme
 * mid-visit" is a thing a test can actually do rather than approximate.
 */
const stubMatchMedia = (initiallyLight: boolean) =>
{
    const listeners = new Set<MediaListener>();
    const query = {
        matches: initiallyLight,
        addEventListener: (_: string, listener: MediaListener) =>
        {
            listeners.add(listener);
        },
        removeEventListener: (_: string, listener: MediaListener) =>
        {
            listeners.delete(listener);
        }
    };

    vi.stubGlobal('matchMedia', vi.fn(() => query));

    return {
        query,
        listenerCount: (): number => listeners.size,
        setLight: (light: boolean): void =>
        {
            query.matches = light;
            for (const listener of [...listeners])
            {
                listener();
            }
        }
    };
};

/** A localStorage whose reads and/or writes throw, the way a blocked store does. */
const stubStorage = (options: { readThrows?: boolean; writeThrows?: boolean } = {}) =>
{
    const data = new Map<string, string>();

    vi.stubGlobal('localStorage', {
        getItem: (key: string): string | null =>
        {
            if (options.readThrows === true)
            {
                throw new Error('storage blocked');
            }

            return data.get(key) ?? null;
        },
        setItem: (key: string, value: string): void =>
        {
            if (options.writeThrows === true)
            {
                throw new Error('storage blocked');
            }

            data.set(key, value);
        },
        removeItem: (key: string): void =>
        {
            data.delete(key);
        },
        clear: (): void => data.clear()
    });

    return data;
};

const freshTheme = async () => (await import('../src/stores/theme')).useTheme();
const freshLocale = async () => (await import('../src/stores/locale')).useLocale();

beforeEach(() =>
{
    vi.resetModules();
});

afterEach(() =>
{
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
});

describe('theme store: resolution at startup', () =>
{
    it('follows the OS when nothing has been chosen', async () =>
    {
        stubMatchMedia(true);
        stubStorage();

        expect((await freshTheme()).theme()).toBe('light');
    });

    it('defaults to dark when the OS does not ask for light', async () =>
    {
        stubMatchMedia(false);
        stubStorage();

        expect((await freshTheme()).theme()).toBe('dark');
    });

    it('restores a previously chosen theme over the OS preference', async () =>
    {
        stubMatchMedia(true);
        stubStorage().set('nura.theme', 'contrast');

        expect((await freshTheme()).theme()).toBe('contrast');
    });

    // A stored value can be anything: a stale key from an older release, or a user editing
    // devtools. Treating garbage as a theme would set `data-theme="banana"` and drop every
    // colour token on the page.
    it('ignores a stored value that is not a theme', async () =>
    {
        stubMatchMedia(false);
        stubStorage().set('nura.theme', 'banana');

        expect((await freshTheme()).theme()).toBe('dark');
    });

    it('survives a storage that throws on read', async () =>
    {
        stubMatchMedia(true);
        stubStorage({ readThrows: true });

        expect((await freshTheme()).theme()).toBe('light');
    });
});

describe('theme store: choosing and cycling', () =>
{
    it('cycles dark to light to contrast and back', async () =>
    {
        stubMatchMedia(false);
        stubStorage();

        const { theme, cycle } = await freshTheme();
        const seen: Theme[] = [theme()];

        for (let step = 0; step < 3; step += 1)
        {
            cycle();
            seen.push(theme());
        }

        expect(seen).toEqual(['dark', 'light', 'contrast', 'dark']);
    });

    it('persists the chosen theme', async () =>
    {
        stubMatchMedia(false);

        const data = stubStorage();
        const { choose } = await freshTheme();

        choose('contrast');

        expect(data.get('nura.theme')).toBe('contrast');
    });

    // The theme must still apply for this visit; only the memory of it is lost.
    it('still applies the theme when the write throws', async () =>
    {
        stubMatchMedia(false);
        stubStorage({ writeThrows: true });

        const { theme, choose } = await freshTheme();

        expect(() => choose('light')).not.toThrow();
        expect(theme()).toBe('light');
    });

    it('reflects the theme on the document element', async () =>
    {
        stubMatchMedia(false);
        stubStorage();

        const { choose } = await freshTheme();

        choose('contrast');
        expect(document.documentElement.dataset.theme).toBe('contrast');

        choose('light');
        expect(document.documentElement.dataset.theme).toBe('light');
    });
});

describe('theme store: following the system', () =>
{
    it('tracks an OS change while the visitor has not chosen', async () =>
    {
        const media = stubMatchMedia(false);

        stubStorage();

        const { theme } = await freshTheme();

        expect(theme()).toBe('dark');

        media.setLight(true);

        expect(theme()).toBe('light');
    });

    // Once someone picks a theme the OS stops leading, or the site would silently override
    // an explicit choice the next time the system flipped.
    it('stops tracking the OS after an explicit choice', async () =>
    {
        const media = stubMatchMedia(false);

        stubStorage();

        const { theme, choose } = await freshTheme();

        choose('contrast');
        media.setLight(true);

        expect(theme()).toBe('contrast');
    });

    it('does not follow the system at all when a theme was already saved', async () =>
    {
        const media = stubMatchMedia(false);

        stubStorage().set('nura.theme', 'dark');

        const { theme } = await freshTheme();

        media.setLight(true);

        expect(theme()).toBe('dark');
    });

    // The effect registers a listener; leaking one per store instance would keep dead
    // closures alive for the life of the page.
    it('registers exactly one system listener while following', async () =>
    {
        const media = stubMatchMedia(false);

        stubStorage();

        await freshTheme();

        expect(media.listenerCount()).toBeLessThanOrEqual(1);
    });
});

describe('locale store: resolution at startup', () =>
{
    const withLanguages = (languages: string[]): void =>
    {
        vi.stubGlobal('navigator', { ...navigator, languages, clipboard: navigator.clipboard });
    };

    it('restores a previously chosen locale', async () =>
    {
        stubStorage().set('nura.locale', 'tr');
        withLanguages(['en-US']);

        expect((await freshLocale()).locale()).toBe('tr');
    });

    it('ignores a stored value that is not a supported locale', async () =>
    {
        stubStorage().set('nura.locale', 'klingon');
        withLanguages(['fr-FR']);

        expect((await freshLocale()).locale()).toBe('fr');
    });

    // Walking the browser's order rather than ours is the whole point: a visitor who lists
    // Persian first should get Persian, not whichever supported language we happen to
    // declare first.
    it('walks navigator.languages in the browser order, not ours', async () =>
    {
        stubStorage();
        withLanguages(['fa-IR', 'en-US']);

        expect((await freshLocale()).locale()).toBe('fa');
    });

    it('skips unsupported entries and takes the first supported one', async () =>
    {
        stubStorage();
        withLanguages(['ja-JP', 'ko-KR', 'ru-RU', 'en-US']);

        expect((await freshLocale()).locale()).toBe('ru');
    });

    it('matches on the primary subtag, so a region tag still resolves', async () =>
    {
        stubStorage();
        withLanguages(['pt-BR']);

        expect((await freshLocale()).locale()).toBe('pt');
    });

    it('matches case-insensitively', async () =>
    {
        stubStorage();
        withLanguages(['ZH-Hans-CN']);

        expect((await freshLocale()).locale()).toBe('zh');
    });

    it('falls back to English when nothing matches', async () =>
    {
        stubStorage();
        withLanguages(['ja-JP', 'ko-KR']);

        expect((await freshLocale()).locale()).toBe('en');
    });

    it('falls back to English when the browser reports no languages at all', async () =>
    {
        stubStorage();
        vi.stubGlobal('navigator', { ...navigator, languages: undefined, clipboard: navigator.clipboard });

        expect((await freshLocale()).locale()).toBe('en');
    });

    it('still resolves a locale when storage reads throw', async () =>
    {
        stubStorage({ readThrows: true });
        withLanguages(['es-ES']);

        expect((await freshLocale()).locale()).toBe('es');
    });
});

describe('locale store: choosing', () =>
{
    it('persists the chosen locale', async () =>
    {
        const data = stubStorage();
        const { choose } = await freshLocale();

        choose('hi');

        expect(data.get('nura.locale')).toBe('hi');
    });

    it('still switches when the write throws', async () =>
    {
        stubStorage({ writeThrows: true });

        const { locale, choose } = await freshLocale();

        expect(() => choose('ar')).not.toThrow();
        expect(locale()).toBe('ar');
    });

    it('reports direction and isRtl consistently for every locale', async () =>
    {
        stubStorage();

        const { LOCALES } = await import('../src/stores/locale');
        const { choose, direction, isRtl } = await freshLocale();

        for (const locale of LOCALES as readonly Locale[])
        {
            choose(locale);
            expect(direction() === 'rtl', locale).toBe(isRtl());
        }
    });

    it('swaps the whole string table, not just a few keys', async () =>
    {
        stubStorage();

        const { choose, t } = await freshLocale();

        choose('en');
        const english = t();

        choose('fa');
        const persian = t();

        expect(persian.languageName).toBe('فارسی');
        expect(persian.hero.headline).not.toBe(english.hero.headline);
        expect(Object.keys(persian)).toEqual(Object.keys(english));
    });

    it('mirrors the locale onto the document element', async () =>
    {
        stubStorage();

        const { choose } = await freshLocale();

        choose('ar');
        expect(document.documentElement.lang).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');

        choose('fr');
        expect(document.documentElement.lang).toBe('fr');
        expect(document.documentElement.dir).toBe('ltr');
    });
});
