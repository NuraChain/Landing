import { EXPLORER_URL, RPC_URL } from './content/site';

/**
 * Live figures for the network section, read from the two services that hold them.
 *
 * They are kept as SEPARATE readers because they fail separately. The RPC answers with
 * `Access-Control-Allow-Origin: *` and works from the browser today; the explorer sends no
 * ACAO at all plus an explicit `cross-origin-resource-policy: same-origin`, so every
 * browser read of it fails until it opts in (see `totalTransactions`). One dead source must
 * not blank the tile the other one feeds.
 */

/** One minute, so a reader refreshing the page does not re-hit either service per visit. */
const TTL_MS = 60_000;

const resets: (() => void)[] = [];

/**
 * A one-minute memo around a single async read.
 *
 * Callers arriving mid-flight join that request rather than opening their own, and a
 * failure is NOT cached - the next call retries instead of pinning an error for a minute,
 * which matters most for the explorer, whose first success may come from a config change
 * rather than from anything this page does.
 */
const cachedReader = <T>(read: () => Promise<T>): (() => Promise<T>) =>
{
    let cached: { at: number; value: T } | null = null;
    let inFlight: Promise<T> | null = null;

    resets.push(() =>
    {
        cached = null;
        inFlight = null;
    });

    return () =>
    {
        if (cached !== null && Date.now() - cached.at < TTL_MS)
        {
            return Promise.resolve(cached.value);
        }

        inFlight ??= read()
            .then((value) =>
            {
                cached = { at: Date.now(), value };

                return value;
            })
            .finally(() =>
            {
                inFlight = null;
            });

        return inFlight;
    };
};

interface RpcResponse
{
    result?: string;
    error?: { message?: string };
}

/**
 * The height of the latest block, from the RPC.
 *
 * `eth_blockNumber` rather than fetching the block itself: this needs one integer, and the
 * block body would be a far larger payload for it.
 */
export const blockHeight = cachedReader(async (): Promise<number> =>
{
    const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
    });

    if (!response.ok)
    {
        throw new Error(`RPC answered ${ response.status }`);
    }

    const body = await response.json() as RpcResponse;

    if (body.error !== undefined)
    {
        throw new Error(body.error.message ?? 'RPC returned an error');
    }

    const height = Number.parseInt(body.result ?? '', 16);

    // A NaN would render as "NaN" in the tile rather than as a failure, so it is treated as
    // one: the section may honestly say "unavailable", but it must never say NaN.
    if (!Number.isFinite(height))
    {
        throw new Error(`RPC returned an unreadable height: ${ String(body.result) }`);
    }

    return height;
});

interface ExplorerStats
{
    indexed?: { transactions?: number };
}

/**
 * Every transaction the chain has ever processed, from the explorer's own index.
 *
 * This is the ONLY sustainable source for the figure. A browser could add it up itself with
 * batched `eth_getBlockTransactionCountByNumber` calls - measured at ~11 requests and five
 * seconds over 5,200 blocks - but the chain mints roughly 28,800 blocks a day at its 3s
 * block time, so that scan passes a minute of loading inside a week and only ever gets
 * worse. The explorer already holds the total; it just has to say so cross-origin.
 *
 * TODO(infra): this rejects on every browser until the explorer returns
 * `Access-Control-Allow-Origin: https://nurachain.net` on /api/stats. Nothing here needs to
 * change when it does - the tile starts resolving on its own.
 */
export const totalTransactions = cachedReader(async (): Promise<number> =>
{
    const response = await fetch(`${ EXPLORER_URL }/api/stats`, {
        headers: { accept: 'application/json' }
    });

    if (!response.ok)
    {
        throw new Error(`Explorer answered ${ response.status }`);
    }

    const body = await response.json() as ExplorerStats;
    const total = body.indexed?.transactions;

    if (typeof total !== 'number' || !Number.isFinite(total))
    {
        throw new Error('Explorer returned no transaction total');
    }

    return total;
});

/**
 * Drops every cache. Tests share one module instance, so without this the first read in a
 * file would decide what every later test sees - the same trap the locale store set.
 */
export const resetNetworkStats = (): void =>
{
    for (const reset of resets)
    {
        reset();
    }
};
