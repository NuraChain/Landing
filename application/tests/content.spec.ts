// Invariants over the single file that holds every fact this site states.
//
// These are not unit tests of a function - there is barely a function here. They are the
// checks that stop a one-line edit to a constant from silently making the page lie. The
// file's own header says the whole point is that "when the real tokenomics and chain
// constants land, they land HERE"; that is exactly the edit these guard.
import { describe, it, expect } from 'vitest';

import {
    ADD_CHAIN_PARAMS,
    ALLOCATIONS,
    BRIDGE_HOLDER,
    BRIDGE_HOLDER_BSC_URL,
    BRIDGE_TOKENS,
    CHAIN,
    CHAIN_ID,
    DOWNLOADS,
    EXPLORER_URL,
    RELEASES_URL,
    RPC_URL,
    SOCIALS,
    SUPPLY,
    SWAP_URL
} from '../src/lib/content/site';
import { LOCALES } from '../src/stores/locale';
import { en } from '../src/lib/i18n/en';
import type { Strings } from '../src/lib/i18n/types';

const TABLES: Record<string, Strings> = Object.fromEntries(
    await Promise.all(LOCALES.map(async (locale) =>
        [locale, (await import(`../src/lib/i18n/${ locale }.ts`) as Record<string, Strings>)[locale]] as const))
);

describe('token allocation', () =>
{
    // The bar renders `flex: percent` per slice, so a table summing to 90 would still paint
    // a full-width bar and look perfectly correct while being wrong.
    it('sums to exactly 100 percent', () =>
    {
        expect(ALLOCATIONS.reduce((sum, slice) => sum + slice.percent, 0)).toBe(100);
    });

    it('gives every slice a positive share', () =>
    {
        for (const slice of ALLOCATIONS)
        {
            expect(slice.percent).toBeGreaterThan(0);
            expect(Number.isFinite(slice.percent)).toBe(true);
        }
    });

    it('names each slice once, so no hue is painted twice', () =>
    {
        const keys = ALLOCATIONS.map((slice) => slice.key);

        expect(new Set(keys).size).toBe(keys.length);
    });

    // The legend direct-labels every segment, and the colour palette is only legal BECAUSE
    // of those labels (the teal measures 2.94:1 on white, under the 3:1 floor). A slice
    // with no label would take the palette below what the comment in the section promises.
    it('has a translated label for every slice in every locale', () =>
    {
        for (const [locale, table] of Object.entries(TABLES))
        {
            for (const slice of ALLOCATIONS)
            {
                const label = table.tokenomics.allocations[slice.key];

                expect(label, `${ locale }.tokenomics.allocations.${ slice.key }`).toBeTruthy();
                expect(label.trim(), `${ locale }.tokenomics.allocations.${ slice.key }`).not.toBe('');
            }
        }
    });
});

describe('supply', () =>
{
    it('keeps circulating at or below total', () =>
    {
        expect(SUPPLY.circulating).toBeLessThanOrEqual(SUPPLY.total);
    });

    it('states both figures as positive whole coins', () =>
    {
        for (const value of [SUPPLY.total, SUPPLY.circulating])
        {
            expect(Number.isInteger(value)).toBe(true);
            expect(value).toBeGreaterThan(0);
            // Beyond this the tile would lose precision as a JS number.
            expect(value).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER);
        }
    });
});

/**
 * Digits, group separators and decimal marks differ per locale, so the notes are compared
 * as NUMBERS rather than as strings.
 *
 * The separators are asked of `Intl` for each locale rather than hard-coded, which is both
 * more correct and keeps this file free of the invisible characters involved - French
 * groups with a narrow no-break space and Arabic with U+066C, neither of which survives a
 * copy-paste or reads as anything in a diff.
 */
const ASCII_DIGITS = (text: string): string =>
    text.replace(/[٠-٩]/gu, (d) => String(d.codePointAt(0)! - 0x0660))
        .replace(/[۰-۹]/gu, (d) => String(d.codePointAt(0)! - 0x06f0))
        .replace(/[०-९]/gu, (d) => String(d.codePointAt(0)! - 0x0966));

/**
 * The decimal marks a locale's copy might legitimately use.
 *
 * Both the default numbering system AND the Arabic-Indic ones are consulted, because the
 * two can disagree: Node's ICU hands `ar` the Latin comma and full stop, while the Arabic
 * copy in this repository is written with U+066C and U+066B. Taking the union is safe -
 * no locale ends up with both "." and "," in its set, so nothing becomes ambiguous.
 */
const decimalMarks = (locale: string): Set<string> =>
{
    const marks = new Set<string>();

    for (const numberingSystem of [undefined, 'arab', 'arabext'])
    {
        try
        {
            const options = numberingSystem === undefined ? {} : { numberingSystem };
            const decimal = new Intl.NumberFormat(locale, options)
                .formatToParts(1.5)
                .find((part) => part.type === 'decimal')?.value;

            if (decimal !== undefined)
            {
                marks.add(decimal);
            }
        }
        catch
        {
            // That numbering system is not available for this locale; the others still are.
        }
    }

    return marks;
};

const numbersIn = (text: string, locale: string): number[] =>
{
    // Only the DECIMAL marks have to be known. Every other character sitting between two
    // digits is a grouping separator by definition, whatever it happens to be - which
    // covers the ASCII comma, the French narrow no-break space and the Arabic U+066C
    // without this file having to name any of them.
    const decimals = decimalMarks(locale);

    const characters = [...ASCII_DIGITS(text)];
    const isDigit = (value: string | undefined): boolean => value !== undefined && value >= '0' && value <= '9';

    const normalised = characters
        .map((character, index) =>
        {
            if (isDigit(character))
            {
                return character;
            }

            if (isDigit(characters[index - 1]) && isDigit(characters[index + 1]))
            {
                return decimals.has(character) ? '.' : '';
            }

            return ' ';
        })
        .join('');

    return [...normalised.matchAll(/[0-9]+(?:[.][0-9]+)?/gu)].map((match) => Number(match[0]));
};

describe('public sale price', () =>
{
    // Recorded in site.ts: "$24,000 over the 10% of THIS number. Move it and that price
    // silently becomes wrong, so move the note with it." Ten locale files repeat these
    // three numbers in prose, so the coupling is real and entirely invisible at the call
    // site. This is the test that makes moving `SUPPLY.total` fail loudly.
    const RAISE_USD = 24_000;
    const share = ALLOCATIONS.find((slice) => slice.key === 'publicSale')!;

    it('derives a unit price that matches the arithmetic', () =>
    {
        const tokens = SUPPLY.total * (share.percent / 100);

        expect(tokens).toBe(100_000_000);
        expect(RAISE_USD / tokens).toBeCloseTo(0.00024, 10);
    });

    it('quotes the same raise, share size and unit price in every locale', () =>
    {
        const tokens = SUPPLY.total * (share.percent / 100);
        const unit = RAISE_USD / tokens;

        for (const [locale, table] of Object.entries(TABLES))
        {
            const found = numbersIn(table.tokenomics.notes.publicSale, locale);

            expect(found, `${ locale } public sale note must state the ${ share.percent }% share`).toContain(share.percent);
            expect(found, `${ locale } public sale note must state the $${ RAISE_USD } raise`).toContain(RAISE_USD);
            expect(found, `${ locale } public sale note must state ${ tokens } tokens`).toContain(tokens);
            expect(found, `${ locale } public sale note must state the ${ unit } unit price`).toContain(unit);
        }
    });
});

/** 0x plus 40 hex characters. Anything else is not an address a wallet will accept. */
const ADDRESS = /^0x[0-9a-fA-F]{40}$/u;

describe('bridge tokens', () =>
{
    it('lists well-formed contract addresses', () =>
    {
        for (const token of BRIDGE_TOKENS)
        {
            expect(token.address, token.symbol).toMatch(ADDRESS);
        }
    });

    it('never points two entries at one contract or one ticker', () =>
    {
        const addresses = BRIDGE_TOKENS.map((token) => token.address.toLowerCase());
        const symbols = BRIDGE_TOKENS.map((token) => token.symbol);

        expect(new Set(addresses).size).toBe(addresses.length);
        expect(new Set(symbols).size).toBe(symbols.length);
    });

    it('gives every token a price id, since TVL cannot be priced without one', () =>
    {
        for (const token of BRIDGE_TOKENS)
        {
            expect(token.priceId.trim()).not.toBe('');
            // Goes into a query string unencoded, so it must not carry delimiters.
            expect(token.priceId).toMatch(/^[a-z0-9-]+$/u);
        }
    });

    it('uses a well-formed holder address, linked on the chain it actually holds on', () =>
    {
        expect(BRIDGE_HOLDER).toMatch(ADDRESS);
        expect(BRIDGE_HOLDER_BSC_URL).toContain(BRIDGE_HOLDER);
        expect(() => new URL(BRIDGE_HOLDER_BSC_URL)).not.toThrow();
    });
});

describe('outbound links', () =>
{
    const EXTERNAL = { RPC_URL, EXPLORER_URL, SWAP_URL, RELEASES_URL, BRIDGE_HOLDER_BSC_URL };

    it('parses as absolute URLs', () =>
    {
        for (const [name, url] of Object.entries(EXTERNAL))
        {
            expect(() => new URL(url), name).not.toThrow();
        }
    });

    // Regression: SWAP_URL shipped as plain http. The origin 301s to TLS anyway, so the
    // plaintext hop bought nothing except a redirect an on-path attacker can strip - on the
    // one link that leads to connecting a wallet and moving funds.
    it('never downgrades to plaintext http', () =>
    {
        for (const [name, url] of Object.entries(EXTERNAL))
        {
            expect(new URL(url).protocol, `${ name } must be https`).toBe('https:');
        }

        for (const social of SOCIALS)
        {
            expect(new URL(social.url).protocol, `${ social.id } must be https`).toBe('https:');
        }

        for (const entry of DOWNLOADS)
        {
            if (entry.url !== null)
            {
                expect(new URL(entry.url).protocol, `${ entry.id } must be https`).toBe('https:');
            }
        }
    });

    it('points the download tiles at release assets, not at a bare repo page', () =>
    {
        for (const entry of DOWNLOADS.filter((download) => download.url !== null))
        {
            expect(entry.url, entry.id).toMatch(/^https:\/\/(github\.com|play\.google\.com)\//u);
        }
    });
});

describe('download tiles', () =>
{
    it('names each platform once', () =>
    {
        const ids = DOWNLOADS.map((entry) => entry.id);

        expect(new Set(ids).size).toBe(ids.length);
    });

    it('gives every tile a label and an architecture note', () =>
    {
        for (const entry of DOWNLOADS)
        {
            expect(entry.label.trim(), entry.id).not.toBe('');
            expect(entry.note.trim(), entry.id).not.toBe('');
        }
    });

    // A tile with no url renders disabled and shows translated "coming soon" copy instead
    // of its note; a tile with an empty-string url would render as a live link to nowhere.
    it('uses null, never an empty string, for a build that does not exist yet', () =>
    {
        for (const entry of DOWNLOADS)
        {
            expect(entry.url === null || entry.url.length > 0, entry.id).toBe(true);
        }
    });
});

describe('social links', () =>
{
    it('lists each platform once with a label', () =>
    {
        const ids = SOCIALS.map((social) => social.id);

        expect(new Set(ids).size).toBe(ids.length);

        for (const social of SOCIALS)
        {
            expect(social.label.trim(), social.id).not.toBe('');
        }
    });
});

describe('chain reference card', () =>
{
    it('labels every fact through the string table', () =>
    {
        for (const fact of CHAIN)
        {
            expect(en.chain[fact.key], fact.key).toBeTruthy();
        }
    });

    it('states a non-empty value for every fact', () =>
    {
        for (const fact of CHAIN)
        {
            expect(fact.value.trim(), fact.key).not.toBe('');
        }
    });

    it('agrees with the constants the one-click button sends', () =>
    {
        const value = (key: string): string => CHAIN.find((fact) => fact.key === key)!.value;

        expect(value('chainId')).toBe(String(CHAIN_ID));
        expect(value('rpcUrl')).toBe(RPC_URL);
        expect(value('explorerUrl')).toBe(EXPLORER_URL);
        expect(Number.parseInt(ADD_CHAIN_PARAMS.chainId, 16)).toBe(Number(value('chainId')));
    });

    // Documented in site.ts: the RPC answers POST from a wallet, so linking it would send a
    // visitor to an error page and make them doubt a value that is in fact correct.
    it('links only the values a browser can usefully open', () =>
    {
        for (const fact of CHAIN.filter((entry) => entry.link === true))
        {
            expect(fact.value, fact.key).toMatch(/^https:\/\//u);
        }

        expect(CHAIN.find((fact) => fact.key === 'rpcUrl')?.link).not.toBe(true);
    });

    it('offers copy on the values worth copying and not on the prose ones', () =>
    {
        const copyable = CHAIN.filter((fact) => fact.copyable).map((fact) => fact.key);

        expect(copyable).toContain('chainId');
        expect(copyable).toContain('rpcUrl');
        expect(copyable).toContain('explorerUrl');
        // Nobody copies a block time.
        expect(copyable).not.toContain('blockTime');
    });
});
