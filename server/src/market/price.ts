// The one outbound call this server makes.
//
// Everything else the site shows about the chain is read straight from the browser: the RPC
// sends `Access-Control-Allow-Origin: *`, so `lib/network.ts` talks to it directly and this
// process never sees a block height. The swap is different. Its market API sends NO
// `Access-Control-Allow-Origin` at all and adds `cross-origin-resource-policy: same-origin`,
// so a fetch from nurachain.net is refused by every browser - the same wall the explorer's
// transaction total has been stuck behind since it was written.
//
// Proxying is the difference between a tile that works today and a second TODO waiting on
// somebody else's CORS config. It costs one memo on this side and nothing on the wire: the
// browser was already going to make a request, and now it makes it to an origin that answers.
import type { NuraPrice } from '../schemas.ts';

/**
 * The swap's token list, which is where its own header reads the price it displays.
 *
 * Deliberately this endpoint and not `/market/pools`: the pool reserves would let this file
 * compute a price itself, and then the site and the swap could disagree about the value of
 * the same coin at the same moment - two implementations of one ratio, drifting the first
 * time either rounds differently or one of them learns about a second pool. The swap owns
 * the number; this reads it.
 */
const TOKENS_URL = 'https://swap.nurachain.net/api/market/tokens';

/**
 * The wrapped coin, not a bridged asset.
 *
 * WNURA is NURA at 1:1, and it is the symbol the swap's own price tile looks up. The other
 * two entries in that list are `anchored: true` bridged assets whose prices come from an
 * external feed - they are not this chain's coin and must never be read as it.
 */
const SYMBOL = 'WNURA';

/** Matches the browser-side memo in `lib/network.ts`, so neither layer re-caches the other. */
const TTL_MS = 60_000;

/**
 * How long a good reading keeps answering after the swap stops responding.
 *
 * Well past the TTL, because the failure this covers is a restart or a blip on a sibling
 * service, and a price from four minutes ago is a far better answer than an em-dash. Bounded
 * because it stops being true eventually, and a thin pool can move a long way in a quarter of
 * an hour - see the caveat on the tile itself.
 */
const GRACE_MS = 15 * 60_000;

/** A hung upstream must not hold this server's request open behind it. */
const TIMEOUT_MS = 5_000;

/**
 * Guards against a list that is not the small fixed one this reads. The swap ships three
 * tokens; a reply with thousands is a different service answering, not a busy day.
 */
const MAX_TOKENS = 100;

interface MarketToken
{
    symbol?: unknown;
    priceUsd?: unknown;
}

export interface PriceGateway
{
    /** The current price, from the memo when it is warm and from the swap when it is not. */
    read: () => Promise<NuraPrice>;
}

export interface PriceGatewayOptions
{
    /** Injected by the suite so no spec reaches the network. Defaults to the global. */
    fetch?: typeof globalThis.fetch;
    /** Injected by the suite so cache expiry can be tested without waiting a minute. */
    now?: () => number;
}

/**
 * Reads the swap's price for NURA.
 *
 * A factory rather than a module-level memo, and that is not a style preference: both halves
 * of this repository lean on module singletons, `npm run test:shuffle` is the gate that
 * catches them, and a cache shared across specs would make the first file to run decide what
 * every later one sees. One gateway per app instance means one cache per app instance.
 */
export function createPriceGateway(options: PriceGatewayOptions = {}): PriceGateway
{
    const call = options.fetch ?? globalThis.fetch;
    const now = options.now ?? Date.now;

    let cached: { at: number; value: NuraPrice } | null = null;
    let inFlight: Promise<NuraPrice> | null = null;

    const readUpstream = async (): Promise<NuraPrice> =>
    {
        const response = await call(TOKENS_URL, {
            headers: { accept: 'application/json' },
            signal: AbortSignal.timeout(TIMEOUT_MS)
        });

        if (!response.ok)
        {
            throw new Error(`The swap answered ${ response.status }`);
        }

        const body = await response.json() as MarketToken[];

        if (!Array.isArray(body) || body.length > MAX_TOKENS)
        {
            throw new Error('The swap did not answer with a token list');
        }

        const token = body.find((entry) => entry.symbol === SYMBOL);

        if (token === undefined)
        {
            throw new Error(`The swap listed no ${ SYMBOL }`);
        }

        const usd = token.priceUsd;

        // Zero is rejected along with the rest. The swap answers 0 for a token it cannot
        // price - its own header treats that as "show nothing" - so passing it through
        // would put a confident "$0.00" under a coin that simply has no quote right now.
        if (typeof usd !== 'number' || !Number.isFinite(usd) || usd <= 0)
        {
            throw new Error(`The swap returned no usable price for ${ SYMBOL }`);
        }

        return { usd, at: new Date(now()).toISOString() };
    };

    return {
        read: () =>
        {
            if (cached !== null && now() - cached.at < TTL_MS)
            {
                return Promise.resolve(cached.value);
            }

            inFlight ??= readUpstream()
                .then((value) =>
                {
                    cached = { at: now(), value };

                    return value;
                })
                .catch((error: unknown) =>
                {
                    // A stale-but-recent reading beats nothing, and it carries its own
                    // timestamp so nobody downstream has to guess how old it is. Note the
                    // cache is NOT refreshed here: the grace window runs from the last
                    // SUCCESS, so a swap that stays down expires rather than being kept
                    // alive by its own failures.
                    if (cached !== null && now() - cached.at < GRACE_MS)
                    {
                        return cached.value;
                    }

                    throw error;
                })
                .finally(() =>
                {
                    inFlight = null;
                });

            return inFlight;
        }
    };
}
