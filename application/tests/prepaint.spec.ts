// The inline script in index.html duplicates three lists that live in TypeScript modules,
// and both copies have to agree.
//
// This is the one duplication the codebase accepts on purpose: the script has to run before
// first paint, so it cannot import anything, and both `src/stores/theme.ts` and
// `src/stores/locale.ts` carry comments saying their lists "must stay in step" with it. The
// failure mode is nasty and silent - add an eleventh language, forget the script, and that
// language paints English LTR for a frame and then snaps to its real direction on hydration.
// Nothing throws; it just looks broken on the slowest connections, which is where it is
// least likely to be noticed.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { LOCALES, useLocale } from '../src/stores/locale';
import { THEMES, THEME_KEY, useTheme } from '../src/stores/theme';

// Resolved from the project root rather than from `import.meta.url`: under the happy-dom
// environment that URL is an http:// one, which `fileURLToPath` refuses.
const HTML = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

/** Pulls `var name = ['a', 'b'];` out of the inline script as a real array. */
const arrayLiteral = (name: string): string[] =>
{
    const match = new RegExp(`var\\s+${ name }\\s*=\\s*\\[([^\\]]*)\\]`, 'u').exec(HTML);

    expect(match, `index.html should declare a "${ name }" array in its pre-paint script`).not.toBeNull();

    return [...match![1].matchAll(/'([^']*)'/gu)].map((entry) => entry[1]);
};

describe('pre-paint script', () =>
{
    it('lists exactly the locales the store supports, in the same order', () =>
    {
        expect(arrayLiteral('locales')).toEqual([...LOCALES]);
    });

    it('lists exactly the themes the store supports', () =>
    {
        expect(arrayLiteral('themes')).toEqual([...THEMES]);
    });

    // Derived by driving the store rather than by re-declaring the set here, so this asserts
    // against real behaviour instead of against a second copy of the same list.
    it('marks the same locales as RTL that the store treats as RTL', () =>
    {
        const { choose, isRtl } = useLocale();
        const fromStore = LOCALES.filter((locale) =>
        {
            choose(locale);

            return isRtl();
        });

        expect(arrayLiteral('rtl')).toEqual(fromStore);
    });

    it('reads the same storage keys the stores write', () =>
    {
        expect(HTML).toContain(`localStorage.getItem('${ THEME_KEY }')`);

        // The locale key is private to the store, so it is discovered by watching a write
        // rather than by importing it.
        localStorage.clear();
        useLocale().choose('fr');

        const written = Object.keys(localStorage).find((key) => localStorage.getItem(key) === 'fr');

        expect(written, 'choosing a locale should persist it under some key').toBeDefined();
        expect(HTML).toContain(`localStorage.getItem('${ written! }')`);
    });

    it('sets direction and language on the same element the store does', () =>
    {
        expect(HTML).toMatch(/document\.documentElement\.lang\s*=/u);
        expect(HTML).toMatch(/document\.documentElement\.dir\s*=/u);
        expect(HTML).toMatch(/document\.documentElement\.dataset\.theme\s*=/u);
    });

    it('ships the document defaulting to English LTR before the script runs', () =>
    {
        expect(HTML).toMatch(/<html[^>]*\blang="en"/u);
    });

    // A throwing pre-paint script would leave the page unstyled, so it is wrapped in
    // try/catch with a theme fallback. Without the catch, a browser with localStorage
    // disabled (Safari private mode historically) would render an unthemed page.
    it('degrades to a themed page when storage access throws', () =>
    {
        expect(HTML).toMatch(/catch\s*\(/u);
        expect(HTML).toMatch(/catch[\s\S]{0,200}dataset\.theme\s*=\s*'dark'/u);
    });
});

/**
 * The behaviour the script re-implements, checked against the store that owns it. If these
 * two ever disagree the page resolves one thing before paint and another after hydration -
 * which is the exact flash the arrangement exists to prevent.
 */
describe('store and script agree on resolution', () =>
{
    beforeEach(() =>
    {
        localStorage.clear();
    });

    afterEach(() =>
    {
        localStorage.clear();
        useLocale().choose('en');
        useTheme().choose('dark');
    });

    it('resolves every supported locale to a direction, and only fa/ar to rtl', () =>
    {
        const { choose, direction } = useLocale();

        for (const locale of LOCALES)
        {
            choose(locale);
            expect(['ltr', 'rtl'], locale).toContain(direction());
        }

        choose('fa');
        expect(direction()).toBe('rtl');
        choose('ar');
        expect(direction()).toBe('rtl');
        choose('en');
        expect(direction()).toBe('ltr');
    });

    it('applies the chosen theme to the same data attribute the script primes', () =>
    {
        const { choose } = useTheme();

        for (const theme of THEMES)
        {
            choose(theme);
            expect(document.documentElement.dataset.theme).toBe(theme);
        }
    });
});
