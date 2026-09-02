import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { App, HttpError, NotFoundError, html, json, pipeline, rateLimit, requestId, securityHeaders, text, type ErrorObserver, type RequestObserver, type WebHandler } from '@azerothjs/http';
import { staticFiles } from '@azerothjs/http/node';
import { feature, manifestOf, manifestScript, register } from '@azerothjs/http/api';
import { mountPages, type KitOptions, type PageRenderer } from '@azerothjs/kit';
import { array } from '@azerothjs/schema';

import { pageCount, toCards, toDetail } from './blog/present.ts';
import type { SiteContent } from './content.ts';
import { createPriceGateway, type PriceGateway } from './market/price.ts';
import { articleMarkup, injectArticle } from './seo/article.ts';
import { injectMeta, isMissingPost, metaFor, postFor, whitepaperFor } from './seo/pages.ts';
import { buildSitemap } from './seo/sitemap.ts';
import {
    nuraPrice,
    pageQuery,
    postDetail,
    postPage,
    readQuery,
    tagCount,
    whitepaperDetail
} from './schemas.ts';
import { PDF_ROUTE, toWhitepaper } from './whitepaper/content.ts';

/**
 * The pages this process serves the shell for itself, head included.
 *
 * They are `render: 'client'` in `routes.ts` and stay that way - the browser still renders
 * their bodies. This list is only about which half of the process writes their `<head>`, and
 * it must match the `'client'` rows in that table: a path here that the table does not carry
 * would serve a page the client router cannot route.
 */
const LANDING_PATHS: readonly string[] = ['/', '/about'];

/** How many posts a blog index page holds when the caller does not say. */
const DEFAULT_LIMIT = 10;

/** The language a reader gets when they ask for none - the same default the site falls to. */
const DEFAULT_LOCALE = 'en';

/**
 * Everything the api reads: the content, already off disk, and where the price comes from.
 *
 * `SiteContent` is the blog AND the whitepaper, in one object - see content.ts for why the two
 * are never passed loose.
 */
export interface ApiDeps extends SiteContent
{
    /**
     * Where the NURA price comes from. Defaults to the live swap.
     *
     * Injected by the suite, which is what keeps the promise made in CLAUDE.md: no spec binds
     * a port or reaches the network, so a red build is always a real change rather than the
     * swap having a bad afternoon.
     */
    market?: PriceGateway;
}

/**
 * The whole API, declared once.
 *
 * A route's name keys this object, the served manifest, the browser's typed client and the
 * OpenAPI operation, so a route is named in exactly one place.
 *
 * A factory rather than a module constant so the content can be handed in: every spec builds
 * the app over a blog of its own choosing, which is what lets one describe a two-post site
 * without writing twenty markdown files.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- the route literal IS the type; naming it would erase per-route inference
export function createApi(deps: ApiDeps)
{
    const { store, whitepaper } = deps;
    const market = deps.market ?? createPriceGateway();

    return {
        blog: feature('/blog', (routes) => ({
            /**
             * The blog index, newest first.
             *
             * Drafts are never included on this path at all - not filtered out downstream, but
             * absent from the query - so there is no arrangement of parameters that reaches one.
             */
            list: routes.get('/', { query: pageQuery, output: postPage }, ({ query }) =>
            {
                const limit = query.limit ?? DEFAULT_LIMIT;
                const page = query.page ?? 1;
                const { rows, total } = store.list({ limit, offset: (page - 1) * limit, tag: query.tag });

                return {
                    rows: toCards(rows, query.locale ?? DEFAULT_LOCALE),
                    total,
                    page,
                    pages: pageCount(total, limit)
                };
            }),

            /**
             * Every tag in use, most used first.
             *
             * Declared BEFORE the `/:slug` route below. The router prefers a static segment to a
             * parameter, so the order is belt and braces rather than the guarantee - the
             * guarantee is the test that asks for /api/blog/tags and expects tags.
             */
            tags: routes.get('/tags', { output: array(tagCount) }, () => store.tags()),

            one: routes.get('/:slug', { query: readQuery, output: postDetail }, ({ params, query }) =>
            {
                const stored = store.bySlug(params.slug);

                if (stored === null)
                {
                    throw new NotFoundError('No such post.');
                }

                const detail = toDetail(stored, query.locale ?? DEFAULT_LOCALE);

                // A post that resolved to no language at all is a 404 rather than a blank page:
                // there is nothing to render, and saying "not found" is the honest answer.
                if (detail === null)
                {
                    throw new NotFoundError('No such post.');
                }

                return detail;
            })
        })),

        /**
         * The whitepaper, in the reader's language or the nearest the document holds.
         *
         * Read-only and unguarded, like a post. One document, so there is no list and no slug -
         * the locale is the only thing a caller chooses, and the same fallback policy a post
         * follows decides what they get. The response names the PDF in the language served.
         */
        whitepaper: feature('/whitepaper', (routes) => ({
            read: routes.get('/', { query: readQuery, output: whitepaperDetail }, ({ query }) =>
            {
                const detail = toWhitepaper(whitepaper, query.locale ?? DEFAULT_LOCALE);

                // The loader refuses to start without every language, so this is unreachable
                // in a booted process - but an empty document is a 404, not a blank page.
                if (detail === null)
                {
                    throw new NotFoundError('No whitepaper.');
                }

                return detail;
            })
        })),

        /**
         * What the chain's own coin is worth, relayed from the swap.
         *
         * Unguarded and read-only, like the blog: it states a public fact and changes nothing.
         *
         * This is the ONLY figure on the site the browser cannot fetch for itself - see the
         * header of `market/price.ts` for why the swap's API is unreachable cross-origin. It
         * is deliberately the whole feature: a proxy for one number, not a market data
         * service. Pools, volume and the token list all stay where they already live.
         */
        market: feature('/market', (routes) => ({
            price: routes.get('/price', { output: nuraPrice }, async () =>
            {
                try
                {
                    return await market.read();
                }
                catch
                {
                    /*
                     * 503 rather than an empty 200, so the browser's reader rejects and the
                     * tile can say "we asked and got nothing" instead of rendering a null as
                     * a price. `expose` because the message is about a third party being
                     * down, not about this process - there is nothing here to leak.
                     *
                     * The upstream error is not chained on purpose: it would put the swap's
                     * status line into a public response body, and the caller can do exactly
                     * nothing differently for a 500 there versus a timeout.
                     */
                    throw new HttpError(503, 'The swap did not answer.', {
                        code: 'price-unavailable',
                        expose: true
                    });
                }
            })
        }))

    };
}

export type Api = ReturnType<typeof createApi>;

/**
 * The canonical origin, used for every absolute url the site emits about itself.
 *
 * A default rather than a required option so a test and a dev boot need not supply one; a
 * deployment sets SITE_URL. Getting it wrong costs canonical tags and a sitemap pointing at
 * the wrong host, which is why it is one constant and not a value each call site invents.
 */
export const DEFAULT_SITE_URL = 'https://nurachain.net';

export interface AppOptions extends ApiDeps
{
    dev: boolean;
    observe?: RequestObserver;
    onError?: ErrorObserver;

    /** Canonical origin, no trailing slash. Defaults to {@link DEFAULT_SITE_URL}. */
    siteUrl?: string;

    /**
     * The directory holding the whitepaper PDFs, one per language; omit to serve none.
     *
     * A directory rather than the files, because `staticFiles` does the serving - and omitted by
     * the suite, which describes its whitepaper inline and never reads a disk. `main.ts` passes
     * `PDF_DIR` after checking every language's file is actually there.
     */
    pdfDir?: string;

    /**
     * The built client + SSR renderer (production); omit in dev - vite serves the client.
     *
     * `manifest` is not among the options a caller supplies: it is projected from the api this
     * function just registered, so the embedded copy and the served one cannot disagree.
     */
    pages?: Omit<KitOptions, 'manifest'>;
}

export function buildApp(options: AppOptions): App
{
    const app = new App({ dev: options.dev, observe: options.observe, onError: options.onError });
    const api = createApi(options);

    app.get('/api/healthz', () => json({ ok: true, at: new Date().toISOString() }));

    register(app, api);

    // The typed client's runtime half. Production also embeds it into each served page, so
    // hydration costs no round trip; this endpoint is what a plain vite dev page falls back to.
    app.get('/api/_manifest', () => json(manifestOf(api)));

    const siteUrl = (options.siteUrl ?? DEFAULT_SITE_URL).replace(/\/+$/, '');

    /*
     * Generated per request rather than written to a file at build.
     *
     * Posts are published from the dashboard at runtime, so a sitemap baked at build time is
     * stale the moment anybody writes anything - and stale in the silent direction, where the
     * new post is simply never crawled. This reads the store, so publishing IS listing.
     *
     * Registered before `mountPages` for the same reason `/api` is: the kit's asset fallback
     * matches every path, and a static `sitemap.xml` in public/ would otherwise win.
     */
    app.get('/sitemap.xml', () => text(buildSitemap(options, siteUrl), {
        headers: {
            'content-type': 'application/xml; charset=utf-8',
            // Crawlers re-read this often; an hour keeps it fresh without regenerating per hit.
            'cache-control': 'public, max-age=3600'
        }
    }));

    /*
     * The whitepaper downloads, under the same prefix as the page that describes them.
     *
     * Registered ahead of `mountPages` like `/assets` and `/sitemap.xml`: the kit claims
     * `/whitepaper` by name and everything else through `/*path`, and this pattern is more
     * specific than the fallback without colliding with the page. The default cache policy -
     * revalidate every time - is the right one here, because a regenerated PDF keeps its name.
     */
    if (options.pdfDir !== undefined)
    {
        app.get(`${ PDF_ROUTE }/*path`, staticFiles(options.pdfDir));
    }

    // Mounted LAST so nothing can shadow /api: the kit's asset fallback matches everything.
    if (options.pages !== undefined)
    {
        /*
         * Vite writes CONTENT-HASHED names into /assets, so the bytes behind one of those urls
         * can never change - a new build is a new name. The kit serves them on its default
         * `max-age=0, must-revalidate` all the same, which asks the browser to check every
         * script, stylesheet and font again on every single page view.
         *
         * Two costs, and the second is the one that bit: a round trip per asset per visit, and
         * a request per asset for the rate limiter to count. Pinning them for a year takes a
         * returning reader's page view from a dozen metered requests to zero.
         *
         * Registered BEFORE mountPages for the same reason /sitemap.xml is - the kit's /*path
         * fallback matches everything, and the first match wins.
         *
         * Only /assets is pinned. index.html, the favicons and robots.txt live at the root
         * under names that stay the same across deploys, so they must keep revalidating or a
         * deploy would never reach anybody holding a cached copy.
         */
        app.get('/assets/*path', staticFiles(join(options.pages.clientDir, 'assets'), {
            cacheControl: 'public, max-age=31536000, immutable'
        }));

        /*
         * The landing pages, served with a head of their own.
         *
         * `/` and `/about` are `render: 'client'`, and the kit calls a renderer only for a
         * `'server'` route - so `mountPages` hands them the shell verbatim and `withMeta` below
         * never sees them. That left the site's two most important addresses sharing one title
         * and one description, with no canonical, no Open Graph and no structured data.
         *
         * These two paths are TAKEN OUT of the table handed to `mountPages` rather than
         * registered ahead of it. `/sitemap.xml` and `/assets` can sit in front of the kit
         * because the kit never claims those exact patterns - it claims `/*path`, and a more
         * specific route wins. `/` and `/about` it claims by name, and this router answers a
         * duplicate pattern with `Route conflict` at startup rather than by preferring one.
         * Removing them is also the more honest description of what happens: for a `'client'`
         * route the kit only serves the shell, which is precisely what the handler below does,
         * with the head filled in.
         *
         * This changes the HEAD only. The body is still the shell, so the browser renders these
         * two pages exactly as it did - none of the client-only work in the stores or the
         * network section is dragged onto a server, which is the trade routes.ts weighed and
         * declined.
         */
        const clientDir = options.pages.clientDir;
        const manifest = manifestOf(api);

        /*
         * The shell, read once and kept. Same order the kit looks in - a built client may ship
         * `shell.html` beside `index.html` - and the manifest script is spliced in exactly as
         * `mountPages` would, so hydration on these two paths still costs no round trip.
         */
        let shellCache: Promise<string> | null = null;

        const landingShell = (): Promise<string> =>
        {
            shellCache ??= readFile(join(clientDir, 'shell.html'), 'utf8')
                .catch(() => readFile(join(clientDir, 'index.html'), 'utf8'))
                .then((page) => page.replace('</head>', () => `${ manifestScript(manifest) }</head>`));

            return shellCache;
        };

        for (const path of LANDING_PATHS)
        {
            app.get(path, async () =>
            {
                const shell = await landingShell();
                const meta = metaFor(path, { ...options, siteUrl });

                // Null would mean this module has nothing to say about the path, which cannot
                // happen for these two - but the shell is the right answer if it ever does.
                return html(meta === null ? shell : injectMeta(shell, meta));
            });
        }

        mountPages(app, {
            ...options.pages,
            routes: options.pages.routes.filter((route) => !LANDING_PATHS.includes(route.path)),
            renderer: withMeta(options.pages.renderer, options, siteUrl),
            manifest
        });
    }

    return app;
}

/**
 * Wraps the page renderer so a server-rendered blog page carries its own head.
 *
 * The kit splices markup into the shell and leaves `<head>` alone, which would give all ten
 * posts index.html's single title and description - the two fields a search result is built
 * from. `PageRenderer` hands back the finished document as a string, so the head can be
 * rewritten here without the kit growing an API for it and without a route moving.
 *
 * Everything that is not one of the two blog routes falls through untouched: `metaFor` answers
 * null and the original result is returned as-is. A page whose head this module does not
 * understand keeps the one it already had.
 */
function withMeta(renderer: PageRenderer | undefined, content: SiteContent, siteUrl: string): PageRenderer | undefined
{
    if (renderer === undefined)
    {
        return undefined;
    }

    return async (url, shell) =>
    {
        const result = await renderer(url, shell);

        // The union may grow - a streaming arm is planned - so this switches on the one arm it
        // can rewrite rather than assuming anything about the others.
        if (result.kind !== 'html')
        {
            return result;
        }

        const deps = { store: content.store, whitepaper: content.whitepaper, siteUrl };
        const meta = metaFor(url, deps);

        if (meta === null)
        {
            /*
             * A post address that resolves to nothing is served as a real 404.
             *
             * The app renders its own not-found state either way, so the page a visitor sees is
             * unchanged - what changes is the status line above it. It used to be 200, which is
             * a soft 404: a crawler is told "this is a page" and indexes the generic shell
             * title, so every mistyped or retired post url becomes a duplicate of the home page
             * in the index. The status is the only thing that distinguishes them.
             */
            return isMissingPost(url, deps) ? { ...result, status: 404 } : result;
        }

        /*
         * The head, then the BODY.
         *
         * A post route renders its text into the document here rather than leaving the frame's
         * loading skeleton for a crawler to index. The page fetches inside an `effect`, which
         * never runs on a server, so before this the indexed article was a correct `<title>`
         * over an empty page - the head described something the body did not contain.
         *
         * A post or the whitepaper: each resolver answers null for every other address, and
         * the blog index has nothing to server-render that the frame does not already carry.
         */
        const html = injectMeta(result.html, meta);
        const detail = postFor(url, deps) ?? whitepaperFor(url, deps);

        return {
            ...result,
            html: detail === null ? html : injectArticle(html, articleMarkup(detail))
        };
    };
}

/**
 * How much one client may ask for in a window.
 *
 * Generous per address on purpose: the limiter counts ASSETS as well as api calls, because it
 * wraps the whole app, and a cold page load is a dozen requests before the reader has done
 * anything. The number only means what it says once {@link createHandler} is keyed on the real
 * client - see the note there.
 */
export const RATE_LIMIT = { limit: 200, windowMs: 60_000 } as const;

export interface HandlerOptions
{
    /**
     * On behind a reverse proxy.
     *
     * This is the whole reason this function exists rather than the pipeline being inlined in
     * main.ts, where the flag was read, handed to the admin guard, and then NOT handed to the
     * limiter. `clientIp` falls back to the TCP peer without it, and behind a proxy the TCP
     * peer is the proxy for every visitor alive: one shared bucket, spent by whoever happened
     * to arrive first, and a site that "sometimes does not load" for everybody after them.
     *
     * Off by default, and off is the safe default rather than the convenient one: a server
     * reachable directly must not believe an `x-forwarded-for` its caller wrote itself.
     */
    trustProxy?: boolean;
}

/**
 * The app wrapped in the edges every request crosses on its way in.
 *
 * Exported so the suite can drive the composed handler rather than the bare app: the guards
 * that live out here - the limiter above all - are invisible to a spec that calls
 * `app.handle` directly, which is how the trust boundary came to be wrong without a test
 * noticing.
 */
export function createHandler(app: App, options: HandlerOptions = {}): WebHandler
{
    return pipeline(
        app,
        requestId(),
        securityHeaders(),
        rateLimit({ ...RATE_LIMIT, trustProxy: options.trustProxy === true })
    );
}
