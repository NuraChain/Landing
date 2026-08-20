// The server shell, before any of the blog is on it.
//
// What is worth pinning at this stage is the SHAPE: the app builds without a client mounted,
// the health probe answers, the manifest the browser's typed client boots from is served from
// the same declaration the routes were registered from, and nothing outside /api is invented.
// Each of those is a thing a later commit could break without any page looking wrong.
import { describe, it, expect } from 'vitest';

import { api, buildApp } from '../src/app.ts';

const app = buildApp({ dev: false });
const get = (path: string): Promise<Response> => app.handle(new Request(`http://local${ path }`));

describe('the server shell', () =>
{
    it('answers the health probe', async () =>
    {
        const response = await get('/api/healthz');

        expect(response.status).toBe(200);
        expect(((await response.json()) as { ok: boolean }).ok).toBe(true);
    });

    it('serves a manifest projected from the SAME declaration the routes came from', async () =>
    {
        // The browser's typed client boots from this. Served from `manifestOf(api)` rather than
        // from a second hand-written list, so a route can never exist on one side only.
        const response = await get('/api/_manifest');

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({});
        expect(Object.keys(api)).toEqual([]);
    });

    it('404s cleanly outside /api when no client is mounted', async () =>
    {
        // Dev runs without `pages`: vite serves the site and proxies /api here. A 404 rather
        // than a 500 is what says the request simply was not this half's to answer.
        expect((await get('/nope')).status).toBe(404);
    });
});
