// Types only, and from `api.ts` rather than from the server directly - that file is the one
// crossing this half makes, and it re-exports the wire shapes for exactly this. The shape is
// declared once in `server/src/schemas.ts`, so a field added there cannot drift from what is
// read here without the compiler saying so.
import type { NuraPriceWire } from '../api';

import { BRIDGE_TOKENS, EXPLORER_URL, RPC_URL } from './content/site';

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

    const raw = body.result ?? '';

    // The shape is checked BEFORE parsing, because `Number.parseInt` stops at the first
    // character it cannot read and returns what it got so far: "0x11zz" parses to 17, which
    // is finite, plausible, and wrong. A NaN at least announces itself - a silently wrong
    // block height does not, and this section exists to state chain facts accurately.
    if (!/^0x[0-9a-fA-F]+$/u.test(raw))
    {
        throw new Error(`RPC returned an unreadable height: ${ String(body.result) }`);
    }

    const height = Number.parseInt(raw, 16);

    // Past 2^53 a hex quantity no longer survives as a JS number, so the tile would render
    // a rounded figure. Nura would need ~10^9 years at its 3s block time to get there; a
    // value this large means the reply is wrong, not that the chain is old.
    if (!Number.isSafeInteger(height))
    {
        throw new Error(`RPC returned an out-of-range height: ${ raw }`);
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

/** `totalSupply()` and `decimals()`, the two selectors this file calls on a bridge token. */
const TOTAL_SUPPLY = '0x18160ddd';
const DECIMALS = '0x313ce567';

const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';

interface RpcBatchEntry
{
    id: number;
    result?: string;
    error?: { message?: string };
}

/**
 * Converts a uint256 of base units into whole tokens.
 *
 * The scaling happens in BigInt FIRST: a supply large enough to matter would lose its
 * integer part to float precision if converted before dividing, and this number ends up
 * multiplied by a price and shown as dollars.
 */
const toUnits = (raw: bigint, decimals: number): number =>
{
    const keep = Math.min(decimals, 6);
    const scale = 10n ** BigInt(Math.max(0, decimals - keep));

    return Number(raw / scale) / 10 ** keep;
};

export interface TvlPart
{
    symbol: string;
    units: number;
    usd: number;
}

export interface Tvl
{
    usd: number;
    parts: readonly TvlPart[];
}

/** Supply and decimals for every bridge token, in ONE batched JSON-RPC round trip. */
const readSupplies = async (): Promise<{ units: number; priceId: string; symbol: string }[]> =>
{
    const batch = BRIDGE_TOKENS.flatMap((token, index) =>
        [
            { jsonrpc: '2.0', id: index * 2, method: 'eth_call', params: [{ to: token.address, data: TOTAL_SUPPLY }, 'latest'] },
            { jsonrpc: '2.0', id: index * 2 + 1, method: 'eth_call', params: [{ to: token.address, data: DECIMALS }, 'latest'] }
        ]);

    const response = await fetch(RPC_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(batch)
    });

    if (!response.ok)
    {
        throw new Error(`RPC answered ${ response.status }`);
    }

    const body = await response.json() as RpcBatchEntry[];

    if (!Array.isArray(body))
    {
        throw new Error('RPC did not answer the batch with an array');
    }

    // Batch replies may arrive in any order, so results are matched by id, never by index.
    const byId = new Map(body.map((entry) => [entry.id, entry]));

    const read = (id: number): bigint =>
    {
        const entry = byId.get(id);

        if (entry === undefined || entry.error !== undefined || entry.result === undefined)
        {
            throw new Error(entry?.error?.message ?? `RPC returned no result for call ${ id }`);
        }

        return BigInt(entry.result);
    };

    return BRIDGE_TOKENS.map((token, index) =>
        ({
            symbol: token.symbol,
            priceId: token.priceId,
            units: toUnits(read(index * 2), Number(read(index * 2 + 1)))
        }));
};

const readPrices = async (ids: readonly string[]): Promise<Record<string, number>> =>
{
    const response = await fetch(`${ PRICE_URL }?ids=${ ids.join(',') }&vs_currencies=usd`, {
        headers: { accept: 'application/json' }
    });

    if (!response.ok)
    {
        throw new Error(`Price feed answered ${ response.status }`);
    }

    const body = await response.json() as Record<string, { usd?: number } | undefined>;
    const prices: Record<string, number> = {};

    for (const id of ids)
    {
        const usd = body[id]?.usd;

        if (typeof usd !== 'number' || !Number.isFinite(usd))
        {
            throw new Error(`Price feed returned no USD price for ${ id }`);
        }

        prices[id] = usd;
    }

    return prices;
};

/**
 * Value bridged onto Nura, in USD.
 *
 * Supplies come from the chain and prices from CoinGecko, which allows browser reads. When
 * every supply is zero the price call is SKIPPED: nothing multiplied by any price is still
 * nothing, and the tile should not go blank because a price feed is down when the true
 * answer is known exactly.
 */
export const bridgeTvl = cachedReader(async (): Promise<Tvl> =>
{
    const supplies = await readSupplies();

    if (supplies.every((token) => token.units === 0))
    {
        return { usd: 0, parts: supplies.map(({ symbol, units }) => ({ symbol, units, usd: 0 })) };
    }

    const prices = await readPrices([...new Set(supplies.map((token) => token.priceId))]);

    const parts = supplies.map(({ symbol, units, priceId }) =>
        ({
            symbol,
            units,
            usd: units * prices[priceId]
        }));

    return { usd: parts.reduce((sum, part) => sum + part.usd, 0), parts };
});

export interface NuraPrice
{
    /** USD per NURA. */
    usd: number;
    /** When the SWAP answered - which may be minutes before this reply. See below. */
    at: Date;
}

/**
 * Our own server, so a bare path - every other url in this file is absolute because every
 * other source is somebody else's. `PRICE_URL` above is CoinGecko's, and prices the BRIDGED
 * assets behind TVL; this one is the coin itself. Two different questions, two constants.
 */
const RELAY_URL = '/api/market/price';

/**
 * What one NURA is worth, by way of this site's own server.
 *
 * The ONE figure on this page that is not read from its source directly, and the detour is
 * forced rather than chosen: swap.nurachain.net sends no `Access-Control-Allow-Origin` and
 * an explicit `cross-origin-resource-policy: same-origin`, so the fetch this file would
 * otherwise make is refused before it leaves the browser - the same wall `totalTransactions`
 * is still stuck behind. `server/src/market/price.ts` reads the swap and relays one number.
 *
 * Same one-minute memo as its neighbours, over a server memoising for the same minute: one
 * request per reader per minute to our own origin, and one request per minute to the swap
 * however many readers there are.
 *
 * That server also keeps answering with its last good reading for a quarter of an hour after
 * the swap goes quiet, which is why `at` is on the wire and is carried through here rather
 * than being replaced with "now": the caller is the only one that can decide whether a
 * reading that old is worth showing, and it cannot decide without being told.
 */
export const nuraPrice = cachedReader(async (): Promise<NuraPrice> =>
{
    const response = await fetch(RELAY_URL, { headers: { accept: 'application/json' } });

    // 503 is the ordinary answer when the swap is unreachable, not an exception - it arrives
    // here as a rejection so the tile shows an em-dash rather than rendering a missing price.
    if (!response.ok)
    {
        throw new Error(`The price relay answered ${ response.status }`);
    }

    const body = await response.json() as Partial<NuraPriceWire>;

    // Validated even though our own server declares the shape: this is a network reply like
    // any other, and the one thing worse than a blank tile is a confident wrong price.
    if (typeof body.usd !== 'number' || !Number.isFinite(body.usd) || body.usd <= 0)
    {
        throw new Error('The price relay returned no usable price');
    }

    const at = new Date(body.at ?? '');

    // An Invalid Date would fail every comparison the caller makes against it silently -
    // `NaN > anything` is false - so a broken timestamp would quietly read as "fresh".
    if (Number.isNaN(at.getTime()))
    {
        throw new Error('The price relay returned an unreadable timestamp');
    }

    return { usd: body.usd, at };
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
