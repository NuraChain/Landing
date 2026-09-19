// The inline script in index.html duplicates ONE list that lives in a TypeScript module.
//
// This is the one duplication the codebase accepts on purpose: the script has to run before
// first paint, so it cannot import anything, and `src/stores/theme.ts` carries a comment
// saying its list "must stay in step" with it. The failure mode is silent - add a third theme,
// forget the script, and that theme paints as dark for a frame and then snaps on hydration.
//
// The LANGUAGE used to be settled here too, and those tests are gone with the code they
// covered. The server negotiates it per request and stamps `lang` and `dir` on the response,
// so there is no second implementation left to drift from - which is why the one test below
// asserts that this script does NOT touch either attribute. `tests/stores.spec.ts` covers the
// store's side of it and `server/tests/app.spec.ts` covers the negotiation itself.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

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
    it('lists exactly the themes the store supports', () =>
    {
        expect(arrayLiteral('themes')).toEqual([...THEMES]);
    });

    it('reads the same storage key the theme store writes', () =>
    {
        expect(HTML).toContain(`localStorage.getItem('${ THEME_KEY }')`);
    });

    it('settles the theme, and leaves the language to the server', () =>
    {
        expect(HTML).toMatch(/document\.documentElement\.dataset\.theme\s*=/u);

        /*
         * The negative half, and it is the one worth pinning.
         *
         * The kit stamps `lang` and `dir` from the language it negotiated for this reader.
         * A script overwriting them a moment later would put the document into a language
         * the markup was not rendered in - a mirrored page full of English, or the reverse -
         * and it would do it only in browsers, so nothing on the server could see it.
         */
        expect(HTML).not.toMatch(/document\.documentElement\.lang\s*=/u);
        expect(HTML).not.toMatch(/document\.documentElement\.dir\s*=/u);
        expect(HTML).not.toContain('navigator.languages');
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
 * The theme the script resolves, and the store that owns it, must agree.
 *
 * If these two disagree the page resolves one thing before paint and another after
 * hydration - which is the exact flash the arrangement exists to prevent.
 */
describe('store and script agree on the theme', () =>
{
    beforeEach(() =>
    {
        localStorage.clear();
    });

    afterEach(() =>
    {
        localStorage.clear();
        useTheme().choose('dark');
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
