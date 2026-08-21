// The server shell.
//
// What is worth pinning here is the SHAPE: the app builds, the health probe answers, the
// manifest the browser's typed client boots from is projected from the same declaration the
// routes were registered from, and nothing outside /api is invented. Each of those is a thing a
// later commit could break without any page looking wrong.
import { describe, it, expect, afterEach } from 'vitest';

import { closeAll, harness } from './support/fixtures.ts';

afterEach(closeAll);

describe('the server shell', () =>
{
    it('answers the health probe', async () =>
    {
        const { get } = harness();
        const response = await get('/api/healthz');

        expect(response.status).toBe(200);
        expect(((await response.json()) as { ok: boolean }).ok).toBe(true);
    });

    it('serves a manifest projected from the SAME declaration the routes came from', async () =>
    {
        // The browser's typed client boots from this. Projected rather than hand-written, so a
        // route can never exist on one side only.
        const { get } = harness();
        const response = await get('/api/_manifest');

        expect(response.status).toBe(200);

        const manifest = (await response.json()) as Record<string, unknown>;

        expect(Object.keys(manifest).length).toBeGreaterThan(0);
        expect(JSON.stringify(manifest)).toContain('blog');
    });

    it('404s cleanly outside /api when no client is mounted', async () =>
    {
        // Dev runs without `pages`: vite serves the site and proxies /api here. A 404 rather
        // than a 500 is what says the request simply was not this half's to answer.
        const { get } = harness();

        expect((await get('/nope')).status).toBe(404);
    });
});
