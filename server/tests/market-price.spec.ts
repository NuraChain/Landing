// The price relay.
//
// Two things are under test and they are worth separating. The GATEWAY is where the judgement
// lives - which token it reads, what it refuses, how long a good reading survives its source
// going away - and it is driven with a stub fetch and a stub clock, so none of it waits and
// none of it reaches the network. The ROUTE is thinner: it turns a reading into a body and a
// failure into a 503, and that is all it should ever do.
import { describe, it, expect, afterEach } from 'vitest';

import { createPriceGateway } from '../src/market/price.ts';
import type { NuraPrice } from '../src/schemas.ts';
import { closeAll, harness } from './support/fixtures.ts';

afterEach(closeAll);

/** The shape the swap actually answers with, trimmed to the fields this reads. */
const TOKENS = [
    { address: '0xd422', symbol: 'BNB', name: 'Bridge BNB', decimals: 18, priceUsd: 696.52, anchored: true },
    { address: '0x4e0d', symbol: 'USDT', name: 'Bridge USDT', decimals: 18, priceUsd: 1, anchored: true },
    { address: '0xf0a4', symbol: 'WNURA', name: 'Wrapped NURA', decimals: 18, priceUsd: 0.00027838, anchored: false }
];

interface Stub
{
    fetch: typeof globalThis.fetch;
    /** How many times the gateway actually went out. The memo is measured by this. */
    calls: () => number;
    urls: () => string[];
    fail: (yes: boolean) => void;
    body: (value: unknown) => void;
    status: (code: number) => void;
}

function stubFetch(initial: unknown = TOKENS): Stub
{
    let calls = 0;
    let failing = false;
    let status = 200;
    let body = initial;
    const urls: string[] = [];

    return {
        calls: () => calls,
        urls: () => urls,
        fail: (yes) =>
        {
            failing = yes;
        },
        body: (value) =>
        {
            body = value;
        },
        status: (code) =>
        {
            status = code;
        },
        fetch: ((input: string | URL | Request) =>
        {
            calls += 1;
            urls.push(String(input));

            if (failing)
            {
                return Promise.reject(new Error('offline'));
            }

            return Promise.resolve(new Response(JSON.stringify(body), {
                status,
                headers: { 'content-type': 'application/json' }
            }));
        }) as typeof globalThis.fetch
    };
}

/** A clock the test moves by hand, so a fifteen-minute window costs no wall time. */
function clock(): { now: () => number; advance: (ms: number) => void }
{
    let at = Date.UTC(2026, 7, 22, 12, 0, 0);

    return {
        now: () => at,
        advance: (ms) =>
        {
            at += ms;
        }
    };
}

describe('the price gateway', () =>
{
    it('reads the swap and reports the WNURA price', async () =>
    {
        const stub = stubFetch();
        const gateway = createPriceGateway({ fetch: stub.fetch });

        const price = await gateway.read();

        expect(price.usd).toBe(0.00027838);
        expect(stub.urls()[0]).toBe('https://swap.nurachain.net/api/market/tokens');
    });

    it('reads the coin, never a bridged asset', async () =>
    {
        // The regression this pins is a real one waiting to happen: BNB is the FIRST entry in
        // the list and it has a perfectly plausible `priceUsd`. A reader that took [0], or that
        // matched loosely, would report $696 as the price of NURA and look entirely healthy.
        const gateway = createPriceGateway({ fetch: stubFetch().fetch });

        expect((await gateway.read()).usd).not.toBe(696.52);
        expect((await gateway.read()).usd).toBe(0.00027838);
    });

    it('stamps the reading with the moment the swap answered', async () =>
    {
        const time = clock();
        const gateway = createPriceGateway({ fetch: stubFetch().fetch, now: time.now });

        expect((await gateway.read()).at).toBe(new Date(time.now()).toISOString());
    });

    it('answers a second caller from memory inside the minute', async () =>
    {
        const stub = stubFetch();
        const time = clock();
        const gateway = createPriceGateway({ fetch: stub.fetch, now: time.now });

        await gateway.read();
        time.advance(59_000);
        await gateway.read();

        expect(stub.calls()).toBe(1);
    });

    it('goes back out once the minute is up', async () =>
    {
        const stub = stubFetch();
        const time = clock();
        const gateway = createPriceGateway({ fetch: stub.fetch, now: time.now });

        await gateway.read();
        time.advance(61_000);
        await gateway.read();

        expect(stub.calls()).toBe(2);
    });

    it('joins concurrent callers onto one request', async () =>
    {
        // Otherwise a burst of readers landing on a cold cache is a burst of requests at the
        // swap, which is the one thing a proxy exists to prevent.
        const stub = stubFetch();
        const gateway = createPriceGateway({ fetch: stub.fetch });

        const [a, b, c] = await Promise.all([gateway.read(), gateway.read(), gateway.read()]);

        expect(stub.calls()).toBe(1);
        expect(a.usd).toBe(b.usd);
        expect(b.usd).toBe(c.usd);
    });

    it('keeps answering with the last good reading while the swap is down', async () =>
    {
        const stub = stubFetch();
        const time = clock();
        const gateway = createPriceGateway({ fetch: stub.fetch, now: time.now });

        const fresh = await gateway.read();

        stub.fail(true);
        time.advance(5 * 60_000);

        const stale = await gateway.read();

        expect(stale.usd).toBe(fresh.usd);
        // The timestamp still names the moment the SWAP answered, not this call - which is the
        // whole reason the field is on the wire.
        expect(stale.at).toBe(fresh.at);
    });

    it('stops answering once the last good reading is too old', async () =>
    {
        const stub = stubFetch();
        const time = clock();
        const gateway = createPriceGateway({ fetch: stub.fetch, now: time.now });

        await gateway.read();

        stub.fail(true);
        time.advance(16 * 60_000);

        await expect(gateway.read()).rejects.toThrow();
    });

    it('does not let its own failures extend the grace window', async () =>
    {
        // The trap: refreshing the cache timestamp on a stale-serve would make each failed read
        // renew the window, and a swap that went down at noon would still be quoted at
        // midnight. The window runs from the last SUCCESS.
        const stub = stubFetch();
        const time = clock();
        const gateway = createPriceGateway({ fetch: stub.fetch, now: time.now });

        await gateway.read();
        stub.fail(true);

        for (let minute = 0; minute < 14; minute += 1)
        {
            time.advance(60_000);
            await gateway.read();
        }

        time.advance(2 * 60_000);

        await expect(gateway.read()).rejects.toThrow();
    });

    it('refuses a price of zero rather than reporting a free coin', async () =>
    {
        const stub = stubFetch();

        stub.body([{ symbol: 'WNURA', priceUsd: 0 }]);

        await expect(createPriceGateway({ fetch: stub.fetch }).read()).rejects.toThrow();
    });

    it.each([
        ['a missing coin', [{ symbol: 'BNB', priceUsd: 696.52 }]],
        ['a price that is not a number', [{ symbol: 'WNURA', priceUsd: '0.0002' }]],
        ['a negative price', [{ symbol: 'WNURA', priceUsd: -1 }]],
        ['a body that is not a list', { symbol: 'WNURA', priceUsd: 1 }]
    ])('refuses %s', async (_label, body) =>
    {
        const stub = stubFetch();

        stub.body(body);

        await expect(createPriceGateway({ fetch: stub.fetch }).read()).rejects.toThrow();
    });

    it('refuses an error status even when the body parses', async () =>
    {
        const stub = stubFetch();

        stub.status(502);

        await expect(createPriceGateway({ fetch: stub.fetch }).read()).rejects.toThrow();
    });

    it('does not cache a failure', async () =>
    {
        // A minute-long memo over an error would pin the tile blank long after the swap came
        // back. The next call retries instead - the same rule `lib/network.ts` follows.
        const stub = stubFetch();

        stub.fail(true);

        const gateway = createPriceGateway({ fetch: stub.fetch });

        await expect(gateway.read()).rejects.toThrow();

        stub.fail(false);

        expect((await gateway.read()).usd).toBe(0.00027838);
    });
});

describe('GET /api/market/price', () =>
{
    it('serves the gateway`s reading', async () =>
    {
        const reading: NuraPrice = { usd: 0.00027838, at: '2026-08-22T12:00:00.000Z' };
        const { get } = harness({ market: { read: () => Promise.resolve(reading) } });

        const response = await get('/api/market/price');

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual(reading);
    });

    it('answers 503 when there is no price to give', async () =>
    {
        // Not an empty 200. The browser's tile distinguishes "asked and got nothing" from
        // "still asking", and it can only do that if a failure arrives as one.
        const { get } = harness();

        expect((await get('/api/market/price')).status).toBe(503);
    });

    it('says nothing about the upstream in the failure body', async () =>
    {
        const { get } = harness({
            market: { read: () => Promise.reject(new Error('ECONNREFUSED 10.0.0.4:8080')) }
        });

        const body = await (await get('/api/market/price')).text();

        expect(body).not.toContain('ECONNREFUSED');
        expect(body).not.toContain('10.0.0.4');
    });

    it('needs no session', async () =>
    {
        // It states a public fact. A guard here would only break the landing page for readers.
        const { get } = harness({ market: { read: () => Promise.resolve({ usd: 1, at: 'now' }) } });

        expect((await get('/api/market/price')).status).toBe(200);
    });

    it('is reachable through the manifest the browser boots from', async () =>
    {
        const { json } = harness();
        const manifest = await json<Record<string, Record<string, { path?: string }>>>('/api/_manifest');

        expect(manifest['market']?.['price']?.path).toBe('/market/price');
    });
});
