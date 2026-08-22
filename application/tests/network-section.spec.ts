// The live-figures section: component -> network module -> fetch.
//
// Four tiles fed by four sources that fail independently, which is the whole reason the
// section holds four separate flags instead of one. These tests drive the real network
// module (only `fetch` is stubbed) so the caching and the tile states are exercised
// together rather than in isolation.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import NetworkSection from '../src/sections/network.section.azeroth';
import { resetNetworkStats } from '../src/lib/network';
import { useLocale } from '../src/stores/locale';
import { en } from '../src/lib/i18n/en';

const ok = (body: unknown): Response => ({ ok: true, json: async () => body }) as unknown as Response;
const word = (value: bigint): string => `0x${ value.toString(16).padStart(64, '0') }`;

interface Sources
{
    height?: () => Promise<Response>;
    explorer?: () => Promise<Response>;
    supplies?: () => Promise<Response>;
    prices?: () => Promise<Response>;
    /** Our own server's price relay - see `nuraPrice` for why it is not the swap itself. */
    price?: () => Promise<Response>;
}

/** A fixed moment, so the "last read" line is assertable without a clock in the way. */
const READ_AT = '2026-08-22T09:30:00.000Z';

/** Routes a stubbed fetch by destination, since four sources share one function. */
const routeFetch = (sources: Sources): ReturnType<typeof vi.fn> =>
{
    const fetchMock = vi.fn().mockImplementation((url: string, init?: { body?: string }) =>
    {
        const target = String(url);

        if (target.includes('/api/market/price'))
        {
            return (sources.price ?? (() => Promise.resolve(ok({ usd: 0.00027838, at: READ_AT }))))();
        }

        if (target.includes('coingecko'))
        {
            return (sources.prices ?? (() => Promise.resolve(ok({ binancecoin: { usd: 600 }, tether: { usd: 1 } }))))();
        }

        if (target.includes('explorer'))
        {
            return (sources.explorer ?? (() => Promise.resolve(ok({ indexed: { transactions: 42 } }))))();
        }

        // The TVL reader posts a JSON ARRAY to the same RPC url the height reader uses.
        if ((init?.body ?? '').trimStart().startsWith('['))
        {
            return (sources.supplies ?? (() => Promise.resolve(ok([
                { id: 0, result: word(0n) }, { id: 1, result: word(18n) },
                { id: 2, result: word(0n) }, { id: 3, result: word(18n) }
            ]))))();
        }

        return (sources.height ?? (() => Promise.resolve(ok({ jsonrpc: '2.0', id: 1, result: '0x1148' }))))();
    });

    vi.stubGlobal('fetch', fetchMock);

    return fetchMock;
};

/**
 * The four headline figures, in the order the grid lays them out.
 *
 * `.text-2xl` narrows this to the tile figures. A bare `.font-mono` also collects the TVL
 * breakdown amounts, the holder addresses and the price note's timestamp - so every index
 * here shifted the day a tile gained a panel, and the assertions that broke were the ones
 * about entirely unrelated tiles.
 */
const figures = (container: Element): string[] =>
    [...container.querySelectorAll('.font-mono.text-2xl')].map((el) => el.textContent!.trim());

const ORDER = ['price', 'height', 'transactions', 'tvl'] as const;

/**
 * One figure, by name.
 *
 * Named rather than indexed for the reason above: inserting a tile should be one edit to
 * `ORDER`, not a renumbering of every assertion in the file - and a renumbering that a test
 * run reports as "expected $1,700, received 42" rather than as "the tiles moved".
 */
const tile = (container: Element, which: (typeof ORDER)[number]): string =>
    figures(container)[ORDER.indexOf(which)]!;

beforeEach(() =>
{
    useLocale().choose('en');
    resetNetworkStats();
    vi.useFakeTimers();
});

afterEach(() =>
{
    vi.useRealTimers();
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
});

describe('NetworkSection tile states', () =>
{
    // An ellipsis and an em-dash read differently on purpose: "we have not asked yet" is
    // not "we asked and got nothing", and a reader watching a stuck tile deserves to know
    // which it is.
    it('shows an ellipsis before anything has resolved', () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        expect(figures(container)).toEqual(['…', '…', '…', '…']);
    });

    it('renders each figure once its source answers', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'height')).toBe('4,424'));
        await vi.waitFor(() => expect(tile(container, 'transactions')).toBe('42'));
        await vi.waitFor(() => expect(tile(container, 'tvl')).toBe('$0.00'));
        await vi.waitFor(() => expect(tile(container, 'price')).toBe('$0.0002784'));
    });

    it('shows an em-dash for a source that failed before it ever answered', async () =>
    {
        routeFetch({ explorer: () => Promise.reject(new Error('CORS')) });

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'transactions')).toBe('—'));
    });

    // The documented reason the tiles hold separate flags: the explorer is blocked
    // cross-origin while the RPC is not, so one dead source must not blank the others.
    it('keeps the working tiles alive when one source is dead', async () =>
    {
        routeFetch({ explorer: () => Promise.reject(new Error('CORS')) });

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'transactions')).toBe('—'));

        expect(tile(container, 'height')).toBe('4,424');
        expect(tile(container, 'tvl')).toBe('$0.00');
        expect(tile(container, 'price')).toBe('$0.0002784');
    });

    // The price relay is a FOURTH independent source, and the one most likely to be down on
    // its own: it depends on the swap, which the other three do not.
    it('blanks only the price when the relay is the thing that failed', async () =>
    {
        routeFetch({ price: () => Promise.reject(new Error('503')) });

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'price')).toBe('—'));

        expect(tile(container, 'height')).toBe('4,424');
        expect(tile(container, 'transactions')).toBe('42');
    });

    it('names the section headings and labels from the string table', () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        expect(container.textContent).toContain(en.network.title);
        expect(container.textContent).toContain(en.network.blockHeight);
        expect(container.textContent).toContain(en.network.transactions);
        expect(container.textContent).toContain(en.network.tvl);
        expect(container.textContent).toContain(en.network.price);
    });
});

describe('NetworkSection failure messaging', () =>
{
    it('warns only while nothing at all has loaded', async () =>
    {
        routeFetch({ explorer: () => Promise.reject(new Error('CORS')) });

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(container.textContent).toContain(en.network.unavailable));
    });

    it('stays silent when every source answered', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'transactions')).toBe('42'));

        expect(container.textContent).not.toContain(en.network.unavailable);
    });

    // "A failed REFRESH stays silent, because the figure on screen is still the one this
    // section promised." A minute-old height beats an em-dash.
    it('keeps the last good figure when a later refresh fails, and does not warn', async () =>
    {
        let calls = 0;
        const height = (): Promise<Response> =>
        {
            calls += 1;

            return calls === 1
                ? Promise.resolve(ok({ jsonrpc: '2.0', id: 1, result: '0x1148' }))
                : Promise.reject(new Error('RPC down'));
        };

        routeFetch({ height });

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'height')).toBe('4,424'));

        // Past both the section's refresh interval and the module's one-minute memo.
        resetNetworkStats();
        await vi.advanceTimersByTimeAsync(60_001);
        await vi.waitFor(() => expect(calls).toBeGreaterThan(1));

        expect(tile(container, 'height')).toBe('4,424');
        expect(container.textContent).not.toContain(en.network.unavailable);
    });
});

describe('NetworkSection TVL breakdown', () =>
{
    const withBalances = () => routeFetch({
        supplies: () => Promise.resolve(ok([
            { id: 0, result: word(2n * 10n ** 18n) }, { id: 1, result: word(18n) },
            { id: 2, result: word(500n * 10n ** 18n) }, { id: 3, result: word(18n) }
        ]))
    });

    const toggle = (container: Element): HTMLElement =>
        container.querySelector<HTMLElement>(`button[aria-label="${ en.network.breakdown }"]`)!;

    it('starts collapsed and opens on click', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'tvl')).toBe('$1,700'));

        const button = toggle(container);

        expect(button.getAttribute('aria-expanded')).toBe('false');

        fire(button, 'click');

        expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes again on a second click', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));
        const button = toggle(container);

        fire(button, 'click');
        fire(button, 'click');

        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    // Same contract as the drawer and the language modal.
    it('closes on Escape', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));
        const button = toggle(container);

        fire(button, 'click');
        expect(button.getAttribute('aria-expanded')).toBe('true');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('ignores other keys', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));
        const button = toggle(container);

        fire(button, 'click');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));

        expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    // The amounts stay in the DOM whether or not the panel is open, so a screen reader
    // reaches them; the panel hides with opacity rather than by unmounting.
    it('lists every bridged asset with its amount', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(container.textContent).toContain('BNB'));

        expect(container.textContent).toContain('USDT');
        expect(container.textContent).toContain('500');
    });

    it('pins the holder address LTR so bidi cannot reorder it', async () =>
    {
        withBalances();

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() =>
            expect([...container.querySelectorAll('[dir="ltr"]')].some((el) => el.textContent?.includes('0x'))).toBe(true));
    });
});

describe('NetworkSection price note', () =>
{
    const toggle = (container: Element): HTMLElement =>
        container.querySelector<HTMLElement>(`button[aria-label="${ en.network.priceNote }"]`)!;

    /**
     * The reason this tile is defensible at all.
     *
     * The section's own history is the argument: it carried no price for a long time on the
     * grounds that a made-up figure on a project's own site is worse than none. A real quote
     * from a pool holding a few hundred dollars is not made up, but it is not a valuation
     * either, and the note is the thing that keeps those apart. A commit that drops it has
     * turned an honest tile back into the one this section refused to build.
     */
    it('states the thin-liquidity caveat', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(container.textContent).toContain(en.network.priceThin));
    });

    it('links the swap the figure was read from', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() =>
        {
            const link = container.querySelector<HTMLAnchorElement>('a[href^="https://swap.nurachain.net"]');

            expect(link).not.toBeNull();
            // An outbound link opening a new tab, so both halves of the pair are required:
            // `noopener` is what stops the opened page reaching back through `window.opener`.
            expect(link!.getAttribute('rel')).toContain('noopener');
        });
    });

    // The server answers with its last good reading for a quarter of an hour after the swap
    // goes quiet. Without this line a reader has no way to tell a fresh price from that one.
    it('shows when the figure was last read', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(container.textContent).toContain(en.network.priceAsOf));
    });

    it('starts collapsed and opens on click', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(container, 'price')).toBe('$0.0002784'));

        const button = toggle(container);

        expect(button.getAttribute('aria-expanded')).toBe('false');

        fire(button, 'click');

        expect(button.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes on Escape', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));
        const button = toggle(container);

        fire(button, 'click');
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    // One listener serves both panels, so the case worth pinning is the one where both are
    // open: a reader pressing Escape means "close this", not "close one of these".
    it('closes the TVL breakdown and the price note together', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));
        const price = toggle(container);
        const parts = container.querySelector<HTMLElement>(`button[aria-label="${ en.network.breakdown }"]`)!;

        fire(price, 'click');
        fire(parts, 'click');

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

        expect(price.getAttribute('aria-expanded')).toBe('false');
        expect(parts.getAttribute('aria-expanded')).toBe('false');
    });

    // The panel hides with opacity rather than by unmounting, so the caveat is reachable by a
    // screen reader whichever way the panel sits. It must not be behind `Show` on open state.
    it('keeps the caveat in the DOM while collapsed', async () =>
    {
        routeFetch({});

        const { container } = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(container.textContent).toContain(en.network.priceThin));

        expect(toggle(container).getAttribute('aria-expanded')).toBe('false');
    });
});

describe('NetworkSection localisation', () =>
{
    it('formats figures with the active locale, not a fixed one', async () =>
    {
        routeFetch({});

        const first = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(first.container, 'height')).toBe('4,424'));
        cleanup();

        useLocale().choose('fa');
        resetNetworkStats();

        const second = renderTest(() => NetworkSection({}));

        await vi.waitFor(() => expect(tile(second.container, 'height')).toBe('۴٬۴۲۴'));
    });

    // The price needs its own case because it does not go through the same formatter as the
    // others: significant digits rather than fraction digits, since a sub-cent figure renders
    // as "$0.00" under `money`. Persian digits still have to come out of it.
    it('formats the price in the active locale too', async () =>
    {
        routeFetch({});
        useLocale().choose('fa');

        const { container } = renderTest(() => NetworkSection({}));

        // `toContain`, not equality: the currency form also carries a direction mark and a
        // symbol whose placement is the formatter's business, not this test's.
        await vi.waitFor(() => expect(tile(container, 'price')).toContain('۰٫۰۰۰۲۷۸۴'));
    });
});
