// Ten string tables that must stay the same shape.
//
// `types.ts` already makes a MISSING key a compile error, which is most of the job. What it
// cannot catch is a key that exists and is empty, a table that quietly grew a key the others
// do not have, or a locale file that shipped with English copy still in it - so those are
// what these cover.
import { describe, it, expect } from 'vitest';

import { LOCALES, nativeName } from '../src/stores/locale';
import type { Locale } from '../src/stores/locale';
import { ALLOCATIONS } from '../src/lib/content/site';
import { en } from '../src/lib/i18n/en';
import type { Strings } from '../src/lib/i18n/types';

const TABLES = Object.fromEntries(
    await Promise.all(LOCALES.map(async (locale) =>
        [locale, (await import(`../src/lib/i18n/${ locale }.ts`) as Record<string, Strings>)[locale]] as const))
) as Record<Locale, Strings>;

/** Every leaf string in a table, keyed by its dotted path. */
const leaves = (value: unknown, path = ''): [string, string][] =>
    typeof value === 'string'
        ? [[path, value]]
        : Object.entries(value as Record<string, unknown>)
            .flatMap(([key, child]) => leaves(child, path === '' ? key : `${ path }.${ key }`));

const PATHS = leaves(en).map(([path]) => path).sort();

describe('string tables', () =>
{
    it('covers every locale the switcher offers', () =>
    {
        for (const locale of LOCALES)
        {
            expect(TABLES[locale], locale).toBeDefined();
        }

        expect(Object.keys(TABLES).sort()).toEqual([...LOCALES].sort());
    });

    // A table with an EXTRA key is invisible to the type system (excess properties on an
    // annotated const are checked, but a widened object or a later edit can slip past) and
    // usually means a key was renamed in one file only.
    it('gives every locale exactly the keys English has - no more, no fewer', () =>
    {
        for (const locale of LOCALES)
        {
            expect(leaves(TABLES[locale]).map(([path]) => path).sort(), locale).toEqual(PATHS);
        }
    });

    it('never ships an empty or whitespace-only string', () =>
    {
        for (const locale of LOCALES)
        {
            for (const [path, text] of leaves(TABLES[locale]))
            {
                expect(text.trim(), `${ locale }.${ path }`).not.toBe('');
            }
        }
    });

    // Copy that still reads as a template is worse than a missing translation, because
    // nothing flags it. The code markers are matched case-SENSITIVELY: "TODO" is a
    // placeholder, but "Todo lo que necesitas" is just Spanish.
    it('leaves no placeholder markers in the copy', () =>
    {
        for (const locale of LOCALES)
        {
            for (const [path, text] of leaves(TABLES[locale]))
            {
                expect(text, `${ locale }.${ path }`).not.toMatch(/\{\{|\}\}|TODO|FIXME|XXX/u);
                expect(text, `${ locale }.${ path }`).not.toMatch(/lorem ipsum|\$\{/iu);
            }
        }
    });
});

describe('language names', () =>
{
    // The switcher's whole premise: a Persian speaker hunting through an English page
    // should meet "فارسی", not "Persian".
    it('names every language in itself, and never twice', () =>
    {
        const names = LOCALES.map((locale) => nativeName(locale));

        expect(new Set(names).size).toBe(names.length);

        for (const locale of LOCALES)
        {
            expect(nativeName(locale)).toBe(TABLES[locale].languageName);
            expect(nativeName(locale).trim()).not.toBe('');
        }
    });

    it('writes the non-Latin languages in their own script', () =>
    {
        const SCRIPTS: Partial<Record<Locale, RegExp>> = {
            fa: /[؀-ۿ]/u,
            ar: /[؀-ۿ]/u,
            zh: /[一-鿿]/u,
            hi: /[ऀ-ॿ]/u,
            ru: /[Ѐ-ӿ]/u
        };

        for (const [locale, script] of Object.entries(SCRIPTS) as [Locale, RegExp][])
        {
            expect(nativeName(locale), locale).toMatch(script);
        }
    });
});

describe('translation completeness', () =>
{
    /**
     * Prose that no locale could legitimately leave in English. Deliberately a curated list
     * rather than "every string differs": a handful genuinely coincide across languages -
     * "RPC" is "RPC" everywhere, and several Latin-script locales share short words - so a
     * blanket rule would be noise. These six are full sentences or distinctive nouns.
     */
    const MUST_DIFFER: ((table: Strings) => string)[] = [
        (table) => table.hero.headline,
        (table) => table.hero.subhead,
        (table) => table.wallet.subtitle,
        (table) => table.footer.tagline,
        (table) => table.network.subtitle,
        (table) => table.tokenomics.notes.locked
    ];

    it('translates the prose in every non-English locale', () =>
    {
        for (const locale of LOCALES.filter((id) => id !== 'en'))
        {
            for (const read of MUST_DIFFER)
            {
                expect(read(TABLES[locale]), `${ locale } still carries the English string`)
                    .not.toBe(read(en));
            }
        }
    });

    it('keeps a note and a label for every allocation the chart paints', () =>
    {
        for (const locale of LOCALES)
        {
            for (const slice of ALLOCATIONS)
            {
                expect(TABLES[locale].tokenomics.allocations[slice.key], `${ locale }/${ slice.key }`).toBeTruthy();
                expect(TABLES[locale].tokenomics.notes[slice.key], `${ locale }/${ slice.key }`).toBeTruthy();
            }
        }
    });

    // The three add-chain strings swap in as the SAME button's label, so a translation that
    // runs long reflows the control mid-interaction.
    it('keeps the add-chain labels short enough to live inside a button', () =>
    {
        for (const locale of LOCALES)
        {
            const { cta, done, failed } = TABLES[locale].addChain;

            for (const [name, text] of Object.entries({ cta, done, failed }))
            {
                expect(text.length, `${ locale }.addChain.${ name } is ${ text.length } chars`).toBeLessThanOrEqual(48);
            }
        }
    });

    it('gives every navigation entry the header renders a label', () =>
    {
        const SECTIONS = ['wallet', 'tokenomics', 'chain', 'explorer', 'social'] as const;

        for (const locale of LOCALES)
        {
            for (const section of SECTIONS)
            {
                expect(TABLES[locale].nav[section], `${ locale }.nav.${ section }`).toBeTruthy();
            }
        }
    });
});
