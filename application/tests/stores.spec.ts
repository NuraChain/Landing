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

    /*
     * The locale store reads the DOCUMENT now, and the document is shared by the whole file.
     *
     * `<html lang>` is what the server stamped and what the store reports, so a test that
     * switches language leaves the next one reading its choice - the same trap the old
     * localStorage-backed store set, one element over. The cookie goes too: it is where a
     * choice is remembered, and a stale one would outlive the test that made it.
     */
    document.documentElement.lang = 'en';
    document.documentElement.removeAttribute('dir');

    for (const entry of document.cookie.split(';'))
    {
        const name = entry.split('=')[0]?.trim();

        if (name !== undefined && name !== '')
        {
            document.cookie = `${ name }=; path=/; max-age=0`;
        }
    }
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
        // The OS asks for light; the visitor asked for dark last time and that stands.
        stubMatchMedia(true);
        stubStorage().set('nura.theme', 'dark');

        expect((await freshTheme()).theme()).toBe('dark');
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
    it('cycles dark to light and back', async () =>
    {
        stubMatchMedia(false);
        stubStorage();

        const { theme, cycle } = await freshTheme();
        const seen: Theme[] = [theme()];

        for (let step = 0; step < 2; step += 1)
        {
            cycle();
            seen.push(theme());
        }

        expect(seen).toEqual(['dark', 'light', 'dark']);
    });

    it('persists the chosen theme', async () =>
    {
        stubMatchMedia(false);

        const data = stubStorage();
        const { choose } = await freshTheme();

        choose('light');

        expect(data.get('nura.theme')).toBe('light');
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

describe('locale store: what the document says', () =>
{
    /*
     * There is no detection left in this store, and that is the assertion.
     *
     * The SERVER decides the language - the reader's `locale` cookie, then `Accept-Language`
     * in preference order, then English - and stamps it on `<html lang>` before the first
     * byte leaves. The store reads that stamp, so a hydrating page cannot disagree with the
     * markup it is adopting. The old `navigator.languages` walk lived here and in the
     * pre-paint script, resolved a language a frame after paint, and was invisible to a
     * crawler; those cases moved to the server, where `negotiateLocale` owns them.
     */
    it('reports the language the document was served in', async () =>
    {
        document.documentElement.lang = 'tr';

        expect((await freshLocale()).locale()).toBe('tr');
    });

    it('falls back to English for a tag the string table does not hold', async () =>
    {
        // The kit only ever stamps a supported tag, so this is the belt to that pair of
        // braces - but indexing the table with an unknown key would be a blank page.
        document.documentElement.lang = 'klingon';

        expect((await freshLocale()).locale()).toBe('en');
    });

    it('never reads navigator.languages', async () =>
    {
        // The browser's guess is the SERVER's input now, through Accept-Language. A store
        // that still consulted it would answer one language while the document declared
        // another - which is the hydration mismatch this whole arrangement removes.
        document.documentElement.lang = 'es';
        vi.stubGlobal('navigator', { ...navigator, languages: ['fa-IR'], clipboard: navigator.clipboard });

        expect((await freshLocale()).locale()).toBe('es');
    });
});

describe('locale store: a choice made before the cookie existed', () =>
{
    it('replays a stored choice into the cookie once, then forgets the key', async () =>
    {
        // Readers who picked a language under the old store have it in localStorage, where no
        // server can see it - so without this their next visit silently forgets what they
        // chose. The key is removed either way, so the replay cannot fight a later choice.
        const data = stubStorage();

        data.set('nura.locale', 'hi');
        document.documentElement.lang = 'en';

        const { migrateLegacyChoice } = await import('../src/stores/locale');

        migrateLegacyChoice();

        expect(document.documentElement.lang).toBe('hi');
        expect(document.cookie).toContain('locale=hi');
        expect(data.get('nura.locale')).toBeUndefined();
    });

    it('ignores a stored value that is not a supported locale', async () =>
    {
        const data = stubStorage();

        data.set('nura.locale', 'klingon');
        document.documentElement.lang = 'en';

        const { migrateLegacyChoice } = await import('../src/stores/locale');

        migrateLegacyChoice();

        expect(document.documentElement.lang).toBe('en');
        expect(data.get('nura.locale')).toBeUndefined();
    });

    it('does nothing at all when there is nothing stored, and survives a blocked store', async () =>
    {
        stubStorage({ readThrows: true });
        document.documentElement.lang = 'fr';

        const { migrateLegacyChoice } = await import('../src/stores/locale');

        expect(() => migrateLegacyChoice()).not.toThrow();
        expect(document.documentElement.lang).toBe('fr');
    });
});

describe('locale store: choosing', () =>
{
    it('remembers the choice where the SERVER can read it', async () =>
    {
        // A cookie, not localStorage, and that is the whole point of the move: the next
        // request arrives already knowing the language, so its HTML is rendered in that
        // language rather than corrected after it lands.
        const { choose } = await freshLocale();

        choose('hi');

        expect(document.cookie).toContain('locale=hi');
        expect(document.documentElement.lang).toBe('hi');
    });

    it('refuses a tag that is not a language tag', async () =>
    {
        // `setLocale` validates before it writes anything, because under a url prefix a tag
        // becomes part of a url. Nothing is written and nothing is navigated.
        const { choose } = await freshLocale();

        expect(() => choose('/evil.example' as Locale)).toThrow();
    });

    it('reports direction and isRtl consistently for every locale', async () =>
    {
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
        const { choose } = await freshLocale();

        choose('ar');
        expect(document.documentElement.lang).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');

        choose('fr');
        expect(document.documentElement.lang).toBe('fr');
        expect(document.documentElement.dir).toBe('ltr');
    });
});
