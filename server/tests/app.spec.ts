// The server shell.
//
// What is worth pinning here is the SHAPE: the app builds, the health probe answers, the
// manifest the browser's typed client boots from is projected from the same declaration the
// routes were registered from, and nothing outside /api is invented. Each of those is a thing a
// later commit could break without any page looking wrong.
import { describe, it, expect } from 'vitest';

import { App } from '@azerothjs/http';

import { createApi, registerApi } from '../src/app.ts';
import { harness, post, whitepaper } from './support/fixtures.ts';
import { BlogContent } from '../src/blog/content.ts';

describe('the routes that are not pages', () =>
{
    /*
     * `registerApi` is the contract between the two boots: the kit's dev session registers it
     * on the App it serves and `buildApp` on the production one. A route added to one and not
     * the other is the divergence this exists to prevent - so it is asserted against a bare
     * App, the way the dev session gets it.
     */
    const bare = (): App =>
    {
        const app = new App({ dev: false });
        const content = { store: new BlogContent([post()]), whitepaper: whitepaper() };

        registerApi(app, createApi(content), content);

        return app;
    };

    it('serves the api, its manifest and the sitemap on an App that mounts no pages', async () =>
    {
        const app = bare();
        const get = (path: string): Promise<Response> => app.handle(new Request(`http://local${ path }`));

        expect((await get('/api/healthz')).status).toBe(200);
        expect((await get('/api/_manifest')).status).toBe(200);
        expect((await get('/api/blog/')).status).toBe(200);

        const sitemap = await get('/sitemap.xml');

        expect(sitemap.status).toBe(200);
        expect(await sitemap.text()).toContain('/blog/nura-mainnet-is-live');
    });

    it('serves no PDFs when no directory is named', async () =>
    {
        // The suite never reads a disk it did not write, so `pdfDir` is omitted - and an
        // omitted directory must mean "no route", not "a route that throws".
        expect((await bare().handle(new Request('http://local/whitepaper/nura-chain-whitepaper-en.pdf'))).status).toBe(404);
    });
});

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
