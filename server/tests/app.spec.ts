// The server shell.
//
// What is worth pinning here is the SHAPE: the app builds, the health probe answers, the
// manifest the browser's typed client boots from is projected from the same declaration the
// routes were registered from, and nothing outside /api is invented. Each of those is a thing a
// later commit could break without any page looking wrong.
import { describe, it, expect } from 'vitest';

import { App } from '@azerothjs/http';

import { buildApp, createApi, registerApi } from '../src/app.ts';
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

describe('which language a page is served in', () =>
{
    /*
     * The kit decides, per request, and stamps the answer on the document.
     *
     * This is the half no component can do: the choice lives in a cookie and a header that a
     * render cannot see, so before it the shell went out saying `lang="en"` for every reader
     * and a Persian visitor got a left-to-right page labelled English - mislabelled for a
     * crawler, announced in the wrong language by a screen reader, and laid out backwards
     * until a script corrected it after paint.
     *
     * Driven through a mount with no renderer, which is where the mount's OWN stamp lands: a
     * server-rendered page is stamped inside the renderer instead, and a stub renderer would
     * never be stamped at all.
     */
    const shell = '<!doctype html><html lang="en"><head><title>Nura</title></head><body><div id="root"></div></body></html>';

    const serving = (): App =>
    {
        const content = { store: new BlogContent([post()]), whitepaper: whitepaper() };

        return buildApp({
            ...content,
            dev: false,
            market: { read: () => Promise.reject(new Error('No price source in this test.')) },
            // A `client` route with no renderer: the mount serves the shell, which is exactly
            // the path that carries its own stamp. The component is never constructed.
            pages: { routes: [{ path: '/blog', component: () => [], render: 'client' }], shell }
        });
    };

    const document = (headers: Record<string, string>): Promise<string> =>
        serving().handle(new Request('http://local/blog', { headers: { accept: 'text/html', ...headers } })).then((response) => response.text());

    it('answers a Persian browser in Persian, mirrored', async () =>
    {
        expect(await document({ 'accept-language': 'fa-IR,fa;q=0.9,en;q=0.8' })).toContain('<html lang="fa" dir="rtl"');
    });

    // The header is read in PREFERENCE ORDER: this reader asked for English and would accept
    // Persian, and answering in Persian because Persian appears at all gets that backwards.
    it('reads the header in preference order, not by mere presence', async () =>
    {
        expect(await document({ 'accept-language': 'en-US,fa;q=0.9' })).toContain('<html lang="en"');
    });

    it('lets a reader\'s own choice outrank their browser', async () =>
    {
        const html = await document({ 'accept-language': 'fa-IR', cookie: 'locale=tr' });

        expect(html).toContain('<html lang="tr" dir="ltr"');
    });

    it('resolves a regional tag to the language the site publishes', async () =>
    {
        expect(await document({ 'accept-language': 'pt-BR' })).toContain('<html lang="pt"');
    });

    it('falls back to English for a language the site does not publish', async () =>
    {
        expect(await document({ 'accept-language': 'ja-JP,ko-KR;q=0.9' })).toContain('<html lang="en"');
    });

    it('tells shared caches everything that can decide the answer', async () =>
    {
        // Not just what DID decide it: a cache matches a stored response on the fields that
        // response named, so a page stamped only with the header would be replayed to a
        // reader whose cookie chose another language.
        const response = await serving().handle(new Request('http://local/blog', { headers: { accept: 'text/html' } }));

        expect(response.headers.get('vary')).toBe('accept-language, cookie');
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
