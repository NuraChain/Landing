// Upstream failure modes: what each of the four reads does when the service answers with
// something other than 200.
//
// Three separate hosts sit behind these figures - the Nura RPC, the Nura explorer and
// CoinGecko - and each has its own way of saying no. A rate-limited price feed and a
// gateway-timed-out RPC must both end up as "unavailable" rather than as a rendered zero.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { blockHeight, bridgeTvl, totalTransactions, resetNetworkStats } from '../src/lib/network';

const ok = (body: unknown): Response => ({ ok: true, json: async () => body }) as unknown as Response;
const status = (code: number): Response => ({ ok: false, status: code } as unknown as Response);
const word = (value: bigint): string => `0x${ value.toString(16).padStart(64, '0') }`;

const SUPPLIES = [
    { jsonrpc: '2.0', id: 0, result: word(2n * 10n ** 18n) },
    { jsonrpc: '2.0', id: 1, result: word(18n) },
    { jsonrpc: '2.0', id: 2, result: word(0n) },
    { jsonrpc: '2.0', id: 3, result: word(18n) }
];

/** Fails exactly one upstream and answers the others normally. */
const failOnly = (target: 'rpc' | 'batch' | 'explorer' | 'prices', code: number): void =>
{
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string, init?: { body?: string }) =>
    {
        const href = String(url);
        const batched = (init?.body ?? '').trimStart().startsWith('[');

        if (href.includes('coingecko'))
        {
            return Promise.resolve(target === 'prices' ? status(code) : ok({ binancecoin: { usd: 600 }, tether: { usd: 1 } }));
        }

        if (href.includes('explorer'))
        {
            return Promise.resolve(target === 'explorer' ? status(code) : ok({ indexed: { transactions: 5 } }));
        }

        if (batched)
        {
            return Promise.resolve(target === 'batch' ? status(code) : ok(SUPPLIES));
        }

        return Promise.resolve(target === 'rpc' ? status(code) : ok({ jsonrpc: '2.0', id: 1, result: '0x10' }));
    }));
};

beforeEach(() =>
{
    resetNetworkStats();
});

afterEach(() =>
{
    vi.unstubAllGlobals();
});

describe('HTTP status handling', () =>
{
    const CODES = [400, 401, 403, 404, 429, 500, 502, 503, 504];

    it('rejects the block height on every error status, naming the code', async () =>
    {
        for (const code of CODES)
        {
            resetNetworkStats();
            failOnly('rpc', code);

            await expect(blockHeight(), `RPC ${ code }`).rejects.toThrow(new RegExp(`RPC answered ${ code }`, 'u'));
        }
    });

    it('rejects the transaction total on every error status', async () =>
    {
        for (const code of CODES)
        {
            resetNetworkStats();
            failOnly('explorer', code);

            await expect(totalTransactions(), `explorer ${ code }`).rejects.toThrow(new RegExp(`Explorer answered ${ code }`, 'u'));
        }
    });

    it('rejects TVL when the batched eth_call is refused', async () =>
    {
        for (const code of CODES)
        {
            resetNetworkStats();
            failOnly('batch', code);

            await expect(bridgeTvl(), `batch ${ code }`).rejects.toThrow(new RegExp(`RPC answered ${ code }`, 'u'));
        }
    });

    // CoinGecko's public tier rate-limits aggressively, so 429 here is the expected failure
    // rather than an exotic one. TVL must go unavailable, never render un-priced supplies
    // as if they were dollars.
    it('rejects TVL when the price feed refuses, rather than pricing at zero', async () =>
    {
        for (const code of [429, 500, 503])
        {
            resetNetworkStats();
            failOnly('prices', code);

            await expect(bridgeTvl(), `prices ${ code }`).rejects.toThrow(new RegExp(`Price feed answered ${ code }`, 'u'));
        }
    });

    // The reads are separate memos precisely so one dead host cannot blank the others.
    it('keeps the other figures readable when one host is down', async () =>
    {
        failOnly('explorer', 503);

        await expect(totalTransactions()).rejects.toThrow();
        await expect(blockHeight()).resolves.toBe(16);
        await expect(bridgeTvl()).resolves.toMatchObject({ usd: 1200 });
    });
});

describe('transport failures', () =>
{
    it('propagates a rejected fetch rather than swallowing it', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

        await expect(blockHeight()).rejects.toThrow(/Failed to fetch/u);
    });

    // A CORS block surfaces in the browser as a rejected fetch, which is the explorer's
    // permanent state until it sends the header.
    it('propagates a CORS-style rejection from the explorer', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('NetworkError when attempting to fetch resource.')));

        await expect(totalTransactions()).rejects.toThrow();
    });

    it('rejects when a body is not JSON at all', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            json: async () =>
            {
                throw new SyntaxError('Unexpected token < in JSON at position 0');
            }
        } as unknown as Response));

        await expect(blockHeight()).rejects.toThrow(/Unexpected token/u);
    });

    // An HTML error page from a proxy parses as neither shape; every reader must refuse it.
    it('rejects a well-formed JSON body of the wrong shape', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(ok({ unexpected: true })));

        await expect(blockHeight()).rejects.toThrow();

        resetNetworkStats();
        await expect(totalTransactions()).rejects.toThrow();

        resetNetworkStats();
        await expect(bridgeTvl()).rejects.toThrow();
    });

    // A failure is deliberately not cached, so a source that recovers is picked up on the
    // next tick instead of staying dark for the rest of the minute.
    it('retries after a failure instead of pinning the error for the TTL', async () =>
    {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(status(503))
            .mockResolvedValueOnce(ok({ jsonrpc: '2.0', id: 1, result: '0x20' }));

        vi.stubGlobal('fetch', fetchMock);

        await expect(blockHeight()).rejects.toThrow(/503/u);
        await expect(blockHeight()).resolves.toBe(32);
        expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    // Concurrent callers join one in-flight request; when it fails they must ALL see the
    // failure, and none may resolve with a stale or partial value.
    it('fails every joined caller when the shared request fails', async () =>
    {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue(status(500)));

        const results = await Promise.allSettled([blockHeight(), blockHeight(), blockHeight()]);

        expect(results.every((result) => result.status === 'rejected')).toBe(true);
    });
});

describe('request shape', () =>
{
    it('asks the RPC for eth_blockNumber over POST with a JSON content type', async () =>
    {
        const fetchMock = vi.fn().mockResolvedValue(ok({ jsonrpc: '2.0', id: 1, result: '0x1' }));

        vi.stubGlobal('fetch', fetchMock);
        await blockHeight();

        const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];

        expect(init.method).toBe('POST');
        expect((init.headers as Record<string, string>)['content-type']).toBe('application/json');
        expect(JSON.parse(init.body as string)).toMatchObject({ method: 'eth_blockNumber', jsonrpc: '2.0' });
    });

    // One batched round trip, not one request per token: the comment in site.ts explains
    // why a per-block scan was rejected, and the same reasoning applies here.
    it('reads every bridge token in a single batched round trip', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? ok({ binancecoin: { usd: 600 }, tether: { usd: 1 } })
                : ok(SUPPLIES)));

        vi.stubGlobal('fetch', fetchMock);
        await bridgeTvl();

        const rpcCalls = fetchMock.mock.calls.filter(([url]) => !String(url).includes('coingecko'));

        expect(rpcCalls).toHaveLength(1);

        const batch = JSON.parse((rpcCalls[0][1] as RequestInit).body as string) as unknown[];

        expect(batch).toHaveLength(4);
        expect(batch.every((entry) => (entry as { method: string }).method === 'eth_call')).toBe(true);
    });

    it('requests only the prices it needs, deduplicated', async () =>
    {
        const fetchMock = vi.fn().mockImplementation((url: string) =>
            Promise.resolve(String(url).includes('coingecko')
                ? ok({ binancecoin: { usd: 600 }, tether: { usd: 1 } })
                : ok(SUPPLIES)));

        vi.stubGlobal('fetch', fetchMock);
        await bridgeTvl();

        const priceUrl = fetchMock.mock.calls.map(([url]) => String(url)).find((url) => url.includes('coingecko'))!;
        const ids = new URL(priceUrl).searchParams.get('ids')!.split(',');

        expect(new Set(ids).size).toBe(ids.length);
        expect(new URL(priceUrl).searchParams.get('vs_currencies')).toBe('usd');
    });
});
