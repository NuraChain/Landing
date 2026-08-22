// The edges every request crosses before it reaches a route.
//
// These live OUTSIDE `App.handle`, which is why they went untested and why the bug they now
// pin got in: every other spec in this suite drives `app.handle` directly and never sees the
// limiter at all. The composed handler is what production actually serves, so that is what is
// exercised here.
//
// The one thing worth pinning is the trust boundary. A limiter keyed on the wrong address is
// not a limiter that is slightly off - it is one global bucket for the whole internet, and the
// site refusing strangers at random for the rest of every minute.
import { describe, it, expect, afterEach } from 'vitest';

import { createHandler, RATE_LIMIT } from '../src/app.ts';
import { closeAll, harness } from './support/fixtures.ts';

afterEach(closeAll);

/** A request as it arrives from a reverse proxy that appended the caller's address. */
const forwarded = (ip: string): Request =>
    new Request('http://local/api/healthz', { headers: { 'x-forwarded-for': ip } });

describe('the edge pipeline', () =>
{
    it('gives every forwarded client a bucket of its own', async () =>
    {
        // The regression. Before the fix the flag stopped at the admin guard and never reached
        // `rateLimit`, so the limiter fell back to the TCP peer - the proxy, identically, for
        // every visitor alive. One reader loading the page a few times spent the budget and
        // the next person to arrive was refused.
        const handler = createHandler(harness().app, { trustProxy: true });

        for (let sent = 0; sent < RATE_LIMIT.limit; sent++)
        {
            expect((await handler.handle(forwarded('203.0.113.9'))).status).toBe(200);
        }

        // That client is now spent, and only that client.
        expect((await handler.handle(forwarded('203.0.113.9'))).status).toBe(429);
        expect((await handler.handle(forwarded('198.51.100.4'))).status).toBe(200);
    });

    it('refuses to believe a forwarded address when no proxy is declared', async () =>
    {
        // The other half of the boundary, and the reason the flag defaults to off: a server
        // reachable directly must not let a caller name its own bucket. With no socket behind
        // this in-process request there is then no identity to key on at all, and the limiter
        // fails CLOSED rather than quietly handing out an unmetered lane.
        const handler = createHandler(harness().app, { trustProxy: false });
        const response = await handler.handle(forwarded('203.0.113.9'));

        expect(response.status).toBe(500);
        expect(await response.text()).toContain('rate-limit-key-unavailable');
    });

    it('tells a client where it stands before it is ever refused', async () =>
    {
        const handler = createHandler(harness().app, { trustProxy: true });
        const response = await handler.handle(forwarded('203.0.113.7'));

        expect(response.headers.get('ratelimit-limit')).toBe(String(RATE_LIMIT.limit));
        expect(response.headers.get('ratelimit-remaining')).toBe(String(RATE_LIMIT.limit - 1));
    });

    it('still stamps the security headers and a request id', async () =>
    {
        // Cheap, but it is the assertion that fails if someone reorders the pipeline while
        // fixing something else: the limiter is not the only edge in it.
        const handler = createHandler(harness().app, { trustProxy: true });
        const response = await handler.handle(forwarded('203.0.113.5'));

        expect(response.headers.get('x-content-type-options')).toBe('nosniff');
        expect(response.headers.get('x-request-id')).not.toBeNull();
    });
});
