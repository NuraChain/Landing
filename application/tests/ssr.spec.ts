// @vitest-environment node

// The pages as a SERVER renders them: no window, no document, no localStorage.
//
// Two things are worth driving in process here, and neither is visible to any other spec.
//
// The first is that these components can render server-side AT ALL. Every other spec runs
// under happy-dom, where `window` exists - so a component that reached for it outside an
// effect passed the whole suite and threw on the first production request. Since AzerothJS
// 2.1.0 a component owns its own scope and its bare `cleanup` blocks run when a string render
// disposes, which is exactly where `window.clearTimeout` blew up.
//
// The second is the page CONTRACT: the route's loader runs before the render, so the document
// a crawler and a reader with no JavaScript receive holds the real article, the reader's own
// language, and a real 404 for a slug nobody published. All of that used to be patched into
// the markup afterwards by the server half, or not to exist.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, it, expect } from 'vitest';

import { buildApp } from '../../server/src/app.ts';
import { BlogContent } from '../../server/src/blog/content.ts';
import { chapter, post, translation, whitepaper } from '../../server/tests/support/fixtures.ts';
import { renderPage, routes } from '../src/entry.server.ts';

/** The real shell, so the spec sees the same splice points production does. */
const SHELL = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

/**
 * The whole server, over an inline blog, with the REAL renderer.
 *
 * `shell` rather than `clientDir`: there is no build in a test run, and the kit takes the
 * document as text for exactly this. Everything else is what production mounts - the same
 * route table, the same renderer, the same head writer, the same negotiation.
 */
const site = (): ReturnType<typeof buildApp> => buildApp({
    store: new BlogContent([
        post({ slug: 'hello', tags: ['release'] }, [
            translation('en', { title: 'Hello there', summary: 'A first post.', body: '## First section\n\nThe opening paragraph.' }),
            translation('fa', { title: 'سلام', summary: 'نوشته اول.', body: '## بخش اول\n\nپاراگراف آغازین.' })
        ])
    ]),
    whitepaper: whitepaper({}, [chapter('en', { title: 'Nura Chain Whitepaper' })]),
    // Reachable and always down: no spec reaches the network, and the price tile is not what
    // any of this is about.
    market: { read: () => Promise.reject(new Error('No price source in this test.')) },
    dev: false,
    pages: { routes, renderer: renderPage, shell: SHELL }
});

interface Served
{
    status: number;
    html: string;
    headers: Headers;
}

const visit = async (path: string, headers: Record<string, string> = {}): Promise<Served> =>
{
    const response = await site().handle(new Request(`http://local${ path }`, {
        headers: { accept: 'text/html', ...headers }
    }));

    return { status: response.status, html: await response.text(), headers: response.headers };
};

describe('server rendering', () =>
{
    it('renders every server route without touching a browser global', async () =>
    {
        // Every row is exercised, so a page added as 'server' cannot skip this check.
        const paths = routes.filter((route) => route.render === 'server').map((route) => route.path.replace(':slug', 'hello'));

        expect(paths.length).toBe(5);

        for (const path of paths)
        {
            const served = await visit(path);

            expect(served.status, path).toBe(200);
            expect(served.html, path).toContain('<main id="main">');
        }
    });

    it('puts the ARTICLE in the document, not a loading skeleton', async () =>
    {
        // The whole point of the loader. Before it, `/blog/hello` served a correct <title>
        // over an empty frame and the server half patched the body in behind the renderer's
        // back; now the page's own Markdown component renders it, on both sides.
        const served = await visit('/blog/hello');

        expect(served.html).toContain('Hello there');
        expect(served.html).toContain('<h2');
        expect(served.html).toContain('First section');
        expect(served.html).toContain('The opening paragraph.');
    });

    it('carries the loader handoff, so the browser does not fetch it again', async () =>
    {
        const served = await visit('/blog/hello');

        expect(served.html).toContain('Hello there');
        // The seed the hydrating client adopts. Without it the page refetches everything it
        // was just sent, which is the round trip this whole phase removes.
        expect(served.html).toMatch(/application\/json[^>]*>\s*\{/u);
    });

    it('lists the blog index with its cards and its tags', async () =>
    {
        const served = await visit('/blog');

        expect(served.status).toBe(200);
        expect(served.html).toContain('Hello there');
        expect(served.html).toContain('release');
    });

    it('answers a real 404 for a slug nobody published', async () =>
    {
        // A soft 404 - the not-found page at status 200 - is a page a crawler indexes as real
        // content, so every mistyped link became a duplicate of the home page in the index.
        // The loader throws `notFound()` and the kit answers the status.
        const served = await visit('/blog/never-written');

        expect(served.status).toBe(404);
    });

    it('answers a real 404 for a url no route matches', async () =>
    {
        expect((await visit('/nope')).status).toBe(404);
    });

    it('serves the whitepaper as the document, not as a frame', async () =>
    {
        const served = await visit('/whitepaper');

        expect(served.status).toBe(200);
        expect(served.html).toContain('Nura Chain Whitepaper');
        expect(served.html).toContain('Introduction');
    });
});

describe('the language a document is served in', () =>
{
    it('renders the page, its interface AND its article in the reader\'s language', async () =>
    {
        const served = await visit('/blog/hello', { 'accept-language': 'fa-IR,fa;q=0.9,en;q=0.8' });

        expect(served.html).toContain('<html lang="fa" dir="rtl"');
        // The article itself, not only the chrome: the loader asked the api for Persian.
        expect(served.html).toContain('سلام');
        expect(served.html).toContain('پاراگراف آغازین.');
    });

    it('lets a reader\'s own choice outrank their browser', async () =>
    {
        const served = await visit('/blog/hello', { 'accept-language': 'fa-IR', cookie: 'locale=en' });

        expect(served.html).toContain('<html lang="en"');
        expect(served.html).toContain('Hello there');
    });

    it('falls back to a translation the post HAS, and says so', async () =>
    {
        // Turkish is a language the site speaks and this post does not, so the reader gets the
        // post's default with the notice beside it - the fallback policy, end to end.
        const served = await visit('/blog/hello', { 'accept-language': 'tr' });

        expect(served.html).toContain('<html lang="tr"');
        expect(served.html).toContain('Hello there');
    });

    it('tells shared caches what the answer depends on', async () =>
    {
        expect((await visit('/blog/hello')).headers.get('vary')).toBe('accept-language, cookie');
    });
});

describe('the head a crawler reads', () =>
{
    it('gives each page one title, one description and one robots directive', async () =>
    {
        for (const path of ['/', '/about', '/blog', '/blog/hello', '/whitepaper'])
        {
            const { html } = await visit(path);

            expect([...html.matchAll(/<title>/gu)], path).toHaveLength(1);
            expect([...html.matchAll(/name="description"/gu)], path).toHaveLength(1);
            // Two robots directives resolve to the MOST RESTRICTIVE, so a duplicate is how a
            // page ends up silently de-indexed by /about's noindex.
            expect([...html.matchAll(/name="robots"/gu)], path).toHaveLength(1);
        }
    });

    it('titles the landing pages apart from each other', async () =>
    {
        // Both used to be served the shell verbatim, so the site's two most important
        // addresses each declared themselves a duplicate of the other.
        const home = await visit('/');
        const about = await visit('/about');

        const titleOf = (html: string): string | undefined => /<title>([^<]*)<\/title>/u.exec(html)?.[1];

        expect(titleOf(home.html)).toBeTruthy();
        expect(titleOf(home.html)).not.toBe(titleOf(about.html));
    });

    it('keeps /about out of the index and leaves every other page in it', async () =>
    {
        /*
         * Read as the DIRECTIVE, never as a substring of the document: the shell carries a
         * comment explaining this very rule, and the word "noindex" appears in it. A test
         * that greps the page passes or fails on prose.
         */
        const directive = (html: string): string | undefined =>
            /<meta\s+name="robots"[^>]*content="([^"]*)"/u.exec(html)?.[1];

        expect(directive((await visit('/about')).html)).toBe('noindex, follow');

        for (const path of ['/', '/blog', '/blog/hello', '/whitepaper'])
        {
            expect(directive((await visit(path)).html), path).toBe('index, follow');
        }
    });

    it('names the post in its title and its canonical', async () =>
    {
        const { html } = await visit('/blog/hello');

        expect(html).toContain('<title>Hello there — Nura Chain</title>');
        expect(html).toContain('<link rel="canonical" href="https://nurachain.net/blog/hello"/>');
    });
});
