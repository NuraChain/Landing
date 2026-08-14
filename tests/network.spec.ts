// The caches are the whole point of this module, so they are tested against a stubbed fetch
// rather than the live services: a test hitting rpc.nurachain.net would be slow, flaky, and
// would assert whatever the chain happened to be doing that second.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { blockHeight, bridgeTvl, totalTransactions, resetNetworkStats } from '../src/lib/network';

const json = (body: unknown): Response => ({
    ok: true,
    json: async () => body
}) as unknown as Response;

const height = (hex: string): Response => json({ jsonrpc: '2.0', id: 1, result: hex });

const stats = (transactions: number): Response =>
    json({ chain: { chainId: 1020 }, head: 4452, indexed: { blocks: 4452, transactions } });

describe('blockHeight', () =>
{
    beforeEach(() =>
    {
        resetNetworkStats();

        // Fake timers move Date.now() too, which is what the TTL reads.
        vi.useFakeTimers();
    });

    afterEach(() =>
    {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('parses the hex height the RPC returns', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(height('0x1148')));

        await expect(blockHeight()).resolves.toBe(4424);
    });

    it('serves a second read inside the minute from cache', async () =>
    {
        const fetchMock = vi.fn().mockResolvedValue(height('0x1148'));

        vi.stubGlobal('fetch', fetchMock);

        await blockHeight();
        vi.advanceTimersByTime(59_000);
        await blockHeight();

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('refetches once the minute is up', async () =>
    {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(height('0x1148'))
            .mockResolvedValueOnce(height('0x1149'));

        vi.stubGlobal('fetch', fetchMock);

        await blockHeight();
        vi.advanceTimersByTime(60_001);

        await expect(blockHeight()).resolves.toBe(4425);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('joins concurrent callers to a single request', async () =>
    {
        const fetchMock = vi.fn().mockResolvedValue(height('0x1148'));

        vi.stubGlobal('fetch', fetchMock);

        await Promise.all([blockHeight(), blockHeight(), blockHeight()]);

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('does not cache a failure, so the next read retries', async () =>
    {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ ok: false, status: 502 } as Response)
            .mockResolvedValueOnce(height('0x1148'));

        vi.stubGlobal('fetch', fetchMock);

        await expect(blockHeight()).rejects.toThrow('502');
        await expect(blockHeight()).resolves.toBe(4424);
    });

    it('rejects an unreadable height rather than rendering NaN', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(height('not-hex')));

        await expect(blockHeight()).rejects.toThrow();
    });

    it('surfaces a JSON-RPC error object as a failure', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ error: { message: 'method not supported' } })));

        await expect(blockHeight()).rejects.toThrow('method not supported');
    });
});

describe('totalTransactions', () =>
{
    beforeEach(() =>
    {
        resetNetworkStats();
        vi.useFakeTimers();
    });

    afterEach(() =>
    {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it('reads the chain-wide total out of the explorer index', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(stats(1)));

        await expect(totalTransactions()).resolves.toBe(1);
    });

    it('reads a zero total as a number, not as missing', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(stats(0)));

        await expect(totalTransactions()).resolves.toBe(0);
    });

    it('caches for a minute like the height does', async () =>
    {
        const fetchMock = vi.fn().mockResolvedValue(stats(7));

        vi.stubGlobal('fetch', fetchMock);

        await totalTransactions();
        vi.advanceTimersByTime(59_000);
        await totalTransactions();

        expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('rejects when the payload carries no total', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json({ head: 4452, indexed: { blocks: 4452 } })));

        await expect(totalTransactions()).rejects.toThrow('no transaction total');
    });

    it('keeps its cache separate from the height cache', async () =>
    {
        // The explorer is blocked cross-origin while the RPC is not, so the failing reader
        // must not poison the working one - they are separate memos for exactly this.
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            String(url).includes('explorer')
                ? Promise.reject(new Error('CORS'))
                : Promise.resolve(height('0x1148')));

        vi.stubGlobal('fetch', fetchMock);

        await expect(totalTransactions()).rejects.toThrow();
        await expect(blockHeight()).resolves.toBe(4424);
    });
});

/** A uint256 word, the shape `eth_call` returns for both totalSupply and decimals. */
const word = (value: bigint): string => `0x${ value.toString(16).padStart(64, '0') }`;

/**
 * Batch replies in the order the ids were sent. Order is deliberately REVERSED in one test
 * below, because a JSON-RPC server is free to answer a batch in any order.
 */
const batch = (entries: { id: number; value: bigint }[]): Response =>
    ({ ok: true, json: async () => entries.map(({ id, value }) => ({ jsonrpc: '2.0', id, result: word(value) })) }) as unknown as Response;

const prices = (body: Record<string, { usd: number }>): Response =>
    ({ ok: true, json: async () => body }) as unknown as Response;

describe('bridgeTvl', () =>
{
    beforeEach(() =>
    {
        resetNetworkStats();
        vi.useFakeTimers();
    });

    afterEach(() =>
    {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const supplies = (bnb: bigint, usdt: bigint) => [
        { id: 0, value: bnb }, { id: 1, value: 18n },
        { id: 2, value: usdt }, { id: 3, value: 18n }
    ];

    it('prices each bridged supply and sums them', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? prices({ binancecoin: { usd: 600 }, tether: { usd: 1 } })
                : batch(supplies(2n * 10n ** 18n, 500n * 10n ** 18n))));

        vi.stubGlobal('fetch', fetchMock);

        // 2 BNB at $600 plus 500 USDT at $1.
        await expect(bridgeTvl()).resolves.toMatchObject({ usd: 1700 });
    });

    it('skips the price call entirely when every supply is zero', async () =>
    {
        const fetchMock = vi.fn().mockResolvedValue(batch(supplies(0n, 0n)));

        vi.stubGlobal('fetch', fetchMock);

        await expect(bridgeTvl()).resolves.toMatchObject({ usd: 0 });

        // One RPC call and no price feed: zero times any price is zero, so a dead feed
        // must not blank a figure that is known exactly.
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(String(fetchMock.mock.calls[0][0])).not.toContain('coingecko');
    });

    it('matches batch replies by id, not by arrival order', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? prices({ binancecoin: { usd: 600 }, tether: { usd: 1 } })
                : batch([...supplies(1n * 10n ** 18n, 7n * 10n ** 18n)].reverse())));

        vi.stubGlobal('fetch', fetchMock);

        await expect(bridgeTvl()).resolves.toMatchObject({ usd: 607 });
    });

    it('honours a token that does not use 18 decimals', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? prices({ binancecoin: { usd: 600 }, tether: { usd: 1 } })
                : batch([
                    { id: 0, value: 0n }, { id: 1, value: 18n },
                    { id: 2, value: 1_000_000n }, { id: 3, value: 6n }
                ])));

        vi.stubGlobal('fetch', fetchMock);

        // 1,000,000 base units at 6 decimals is 1 USDT, not 1,000,000 of them.
        await expect(bridgeTvl()).resolves.toMatchObject({ usd: 1 });
    });

    it('rejects rather than guessing when the price feed omits an asset', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? prices({ binancecoin: { usd: 600 } })
                : batch(supplies(1n * 10n ** 18n, 0n))));

        vi.stubGlobal('fetch', fetchMock);

        await expect(bridgeTvl()).rejects.toThrow('tether');
    });

    it('surfaces a reverting eth_call as a failure', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ jsonrpc: '2.0', id: 0, error: { message: 'execution reverted' } }]
        } as unknown as Response));

        await expect(bridgeTvl()).rejects.toThrow('execution reverted');
    });
});
