// Property and fuzz coverage for the two parsers that turn untrusted bytes into figures
// the page states as fact: the hex block height, and the uint256 -> token-units conversion
// behind TVL.
//
// No property-testing dependency is added. The generator below is a seeded mulberry32, so
// every run draws the SAME inputs: a failure here is reproducible from the printed case
// rather than "it went red on CI once". Randomised-but-undeterministic fuzzing would break
// the project's determinism rule for no extra signal at this size.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { blockHeight, bridgeTvl, resetNetworkStats } from '../src/lib/network';
import { BRIDGE_TOKENS } from '../src/lib/content/site';
import { LOCALES } from '../src/stores/locale';

const SEED = 0x5ecf00d;

/** Deterministic PRNG: same seed, same sequence, every machine and every run. */
const rng = (seed: number) => (): number =>
{
    seed = (seed + 0x6d2b79f5) | 0;

    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const ok = (body: unknown): Response => ({ ok: true, json: async () => body }) as unknown as Response;
const word = (value: bigint): string => `0x${ value.toString(16).padStart(64, '0') }`;

const heightReply = (result: unknown): void =>
{
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ jsonrpc: '2.0', id: 1, result })));
};

beforeEach(() =>
{
    resetNetworkStats();
});

afterEach(() =>
{
    vi.unstubAllGlobals();
});

describe('blockHeight: hex quantity parsing', () =>
{
    it('round-trips every well-formed quantity it is given', async () =>
    {
        const next = rng(SEED);

        for (let run = 0; run < 300; run += 1)
        {
            // Heights up to 2^40 - far past anything reachable, still exactly representable.
            const value = Math.floor(next() * 2 ** 40);
            const hex = `0x${ value.toString(16) }`;

            resetNetworkStats();
            heightReply(hex);

            await expect(blockHeight(), hex).resolves.toBe(value);
        }
    });

    it('accepts either case of hex digit', async () =>
    {
        for (const hex of ['0xDEADBEEF', '0xdeadbeef', '0xDeAdBeEf'])
        {
            resetNetworkStats();
            heightReply(hex);

            await expect(blockHeight(), hex).resolves.toBe(3735928559);
        }
    });

    it('accepts a zero height', async () =>
    {
        heightReply('0x0');

        await expect(blockHeight()).resolves.toBe(0);
    });

    /**
     * Regression. `Number.parseInt` stops at the first unreadable character and returns
     * what it managed: "0x11zz" came back as 17, which is finite, plausible and WRONG, so
     * the guard on `Number.isFinite` waved it through and the tile stated a false height.
     * Every case below used to resolve to a number; all of them must now reject.
     */
    it('rejects a truncated or corrupted quantity instead of parsing its prefix', async () =>
    {
        const CORRUPT = [
            '0x11zz',
            '0x1148 truncated',
            '0xdeadbeefXYZ',
            '0x1148\n\r junk',
            '0x1148,0x1149',
            '0x1148px',
            '0x 1148'
        ];

        for (const result of CORRUPT)
        {
            resetNetworkStats();
            heightReply(result);

            await expect(blockHeight(), `${ result } must not parse`).rejects.toThrow(/unreadable height/u);
        }
    });

    it('rejects anything that is not a 0x-prefixed quantity', async () =>
    {
        const MALFORMED: unknown[] = [
            '', '0x', 'not-hex', '1148', '#1148', '-0x10', '0X1148 ', ' 0x1148',
            null, undefined, 42, true, {}, [], '0b1010', 'Infinity', 'NaN'
        ];

        for (const result of MALFORMED)
        {
            resetNetworkStats();
            heightReply(result);

            await expect(blockHeight(), `${ String(result) } must not parse`).rejects.toThrow();
        }
    });

    // Past 2^53 the figure would silently round, so it is refused rather than displayed.
    it('rejects a quantity too large to survive as a JS number', async () =>
    {
        for (const hex of [`0x${ (2n ** 53n).toString(16) }`, `0x${ (2n ** 200n).toString(16) }`, word(2n ** 255n)])
        {
            resetNetworkStats();
            heightReply(hex);

            await expect(blockHeight(), hex).rejects.toThrow(/out-of-range|unreadable/u);
        }
    });

    // The whole point of the guard: whatever arrives, the tile never renders NaN.
    it('never resolves to a non-finite number, for any generated input', async () =>
    {
        const next = rng(SEED ^ 0xabcd);
        const ALPHABET = '0123456789abcdefABCDEFxX +-.,\n\t#zZ';

        for (let run = 0; run < 300; run += 1)
        {
            const length = 1 + Math.floor(next() * 12);
            let candidate = '';

            for (let index = 0; index < length; index += 1)
            {
                candidate += ALPHABET[Math.floor(next() * ALPHABET.length)];
            }

            resetNetworkStats();
            heightReply(candidate);

            const settled = await blockHeight().then(
                (value) => ({ ok: true as const, value }),
                () => ({ ok: false as const, value: 0 })
            );

            if (settled.ok)
            {
                expect(Number.isSafeInteger(settled.value), `${ candidate } resolved to ${ settled.value }`).toBe(true);
                expect(settled.value, candidate).toBeGreaterThanOrEqual(0);
            }
        }
    });
});

describe('bridgeTvl: uint256 to token units', () =>
{
    const supplyReply = (entries: { id: number; value: bigint }[], prices: Record<string, { usd: number }>): void =>
    {
        vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? ok(prices)
                : ok(entries.map(({ id, value }) => ({ jsonrpc: '2.0', id, result: word(value) }))))));
    };

    const PRICES = { binancecoin: { usd: 1 }, tether: { usd: 1 } };

    it('scales any supply by any sane decimals without losing the integer part', async () =>
    {
        const next = rng(SEED ^ 0x1234);

        for (let run = 0; run < 120; run += 1)
        {
            const decimals = Math.floor(next() * 19);
            const whole = BigInt(Math.floor(next() * 1_000_000));
            const raw = whole * 10n ** BigInt(decimals);

            resetNetworkStats();
            supplyReply([
                { id: 0, value: raw }, { id: 1, value: BigInt(decimals) },
                { id: 2, value: 0n }, { id: 3, value: 18n }
            ], PRICES);

            const { parts } = await bridgeTvl();

            expect(parts[0].units, `${ raw } @ ${ decimals }dp`).toBe(Number(whole));
        }
    });

    // The documented reason the division happens in BigInt first: a supply large enough to
    // matter would lose its integer part to float precision if converted before dividing.
    it('keeps precision on supplies far beyond Number.MAX_SAFE_INTEGER', async () =>
    {
        const raw = 123_456_789n * 10n ** 18n;

        supplyReply([
            { id: 0, value: raw }, { id: 1, value: 18n },
            { id: 2, value: 0n }, { id: 3, value: 18n }
        ], PRICES);

        const { parts } = await bridgeTvl();

        expect(parts[0].units).toBe(123_456_789);
    });

    it('never produces NaN or Infinity for any supply and decimals pair', async () =>
    {
        const next = rng(SEED ^ 0x99);

        for (let run = 0; run < 120; run += 1)
        {
            const decimals = Math.floor(next() * 78);
            const raw = BigInt(Math.floor(next() * Number.MAX_SAFE_INTEGER)) * 10n ** BigInt(Math.floor(next() * 20));

            resetNetworkStats();
            supplyReply([
                { id: 0, value: raw }, { id: 1, value: BigInt(decimals) },
                { id: 2, value: 0n }, { id: 3, value: 18n }
            ], PRICES);

            const { usd, parts } = await bridgeTvl();

            expect(Number.isFinite(usd), `${ raw } @ ${ decimals }dp gave ${ usd }`).toBe(true);

            for (const part of parts)
            {
                expect(Number.isFinite(part.units), `${ raw } @ ${ decimals }dp`).toBe(true);
                expect(part.units, `${ raw } @ ${ decimals }dp`).toBeGreaterThanOrEqual(0);
            }
        }
    });

    it('reports a zero supply as zero rather than as missing', async () =>
    {
        supplyReply([
            { id: 0, value: 0n }, { id: 1, value: 18n },
            { id: 2, value: 0n }, { id: 3, value: 18n }
        ], PRICES);

        const { usd, parts } = await bridgeTvl();

        expect(usd).toBe(0);
        expect(parts).toHaveLength(BRIDGE_TOKENS.length);
    });

    // "0x" is what a node returns for a call to an address with no code - a wrong network,
    // or a contract that was never deployed. It must fail, not decode to zero, because zero
    // is a claim about the bridge and "we cannot read it" is not.
    it('rejects an empty eth_call result instead of reading it as zero', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok([
            { jsonrpc: '2.0', id: 0, result: '0x' }, { jsonrpc: '2.0', id: 1, result: word(18n) },
            { jsonrpc: '2.0', id: 2, result: word(0n) }, { jsonrpc: '2.0', id: 3, result: word(18n) }
        ])));

        await expect(bridgeTvl()).rejects.toThrow();
    });

    it('rejects a batch that is missing a reply entirely', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok([
            { jsonrpc: '2.0', id: 0, result: word(1n) }
        ])));

        await expect(bridgeTvl()).rejects.toThrow(/no result for call/u);
    });

    it('rejects a batch answered with an object instead of an array', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ jsonrpc: '2.0', id: 0, result: word(1n) })));

        await expect(bridgeTvl()).rejects.toThrow(/did not answer the batch with an array/u);
    });
});

/**
 * Every figure on the page is rendered through `Intl.NumberFormat(locale)`. A locale tag
 * that Intl rejects throws at render time and blanks the whole section, so each supported
 * tag is checked against the three format shapes the site actually uses.
 */
describe('locale-aware number formatting', () =>
{
    it('formats plain, currency and percent figures in every supported locale', () =>
    {
        const next = rng(SEED ^ 0x77);

        for (const locale of LOCALES)
        {
            expect(() => new Intl.NumberFormat(locale), locale).not.toThrow();

            for (let run = 0; run < 20; run += 1)
            {
                const value = next() * 10 ** Math.floor(next() * 12);

                for (const format of [
                    new Intl.NumberFormat(locale),
                    new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: value >= 1000 ? 0 : 2 }),
                    new Intl.NumberFormat(locale, { maximumFractionDigits: 6 })
                ])
                {
                    const text = format.format(value);

                    expect(text, `${ locale } / ${ value }`).toBeTruthy();
                    expect(text, `${ locale } / ${ value }`).not.toContain('NaN');
                }
            }

            expect(new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(0.4)).toBeTruthy();
        }
    });

    it('renders the extremes the tiles can legitimately reach', () =>
    {
        for (const locale of LOCALES)
        {
            for (const value of [0, 1, -0, 0.000001, Number.MAX_SAFE_INTEGER])
            {
                expect(new Intl.NumberFormat(locale).format(value), `${ locale } / ${ value }`).toBeTruthy();
            }
        }
    });
});
