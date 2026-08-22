import { join } from 'node:path';

import { App, ConflictError, HttpError, NotFoundError, json, pipeline, rateLimit, requestId, securityHeaders, text, type ErrorObserver, type RequestObserver, type WebHandler } from '@azerothjs/http';
import { staticFiles } from '@azerothjs/http/node';
import { feature, manifestOf, register, reply } from '@azerothjs/http/api';
import { mountPages, type KitOptions, type PageRenderer } from '@azerothjs/kit';
import { array } from '@azerothjs/schema';

import { adminGuards } from './admin/guard.ts';
import { matchesKey } from './admin/key.ts';
import { SESSION_TTL_SECONDS, type SessionStore } from './admin/sessions.ts';
import { pageCount, toCards, toDetail, toEditor, toRecord } from './blog/present.ts';
import type { BlogStore } from './blog/store.ts';
import { createPriceGateway, type PriceGateway } from './market/price.ts';
import { injectMeta, isMissingPost, metaFor } from './seo/pages.ts';
import { buildSitemap } from './seo/sitemap.ts';
import {
    adminKeyInput,
    createPostInput,
    nuraPrice,
    pageQuery,
    postDetail,
    postEditor,
    postInput,
    postPage,
    adminPageQuery,
    postRecordPage,
    readQuery,
    removed,
    sessionState,
    tagCount,
    translationInput,
    type PostLocale
} from './schemas.ts';

/** How many posts a blog index page holds when the caller does not say. */
const DEFAULT_LIMIT = 10;

/** The dashboard shows more per page than the blog: it is a work list, not a reading one. */
const ADMIN_LIMIT = 20;

/** The language a reader gets when they ask for none - the same default the site falls to. */
const DEFAULT_LOCALE = 'en';

/** The one answer every failed sign-in gives, whatever went wrong. */
const SIGNED_OUT = { signedIn: false, expiresAt: null };

const iso = (seconds: number): string => new Date(seconds * 1000).toISOString();

/** Turns a store miss into the 404 every admin route would otherwise repeat by hand. */
function found<T>(value: T | null): T
{
    if (value === null)
    {
        throw new NotFoundError('No such post.');
    }

    return value;
}

export interface ApiDeps
{
    store: BlogStore;
    sessions: SessionStore;

    /**
     * The configured admin key, or null when none is set.
     *
     * Null is a real state, not an oversight: development without a key disables the dashboard
     * outright. "No key configured" must never resolve to "no key required".
     */
    adminKey: string | null;

    /** Whether cookies are minted Secure - production, in practice. */
    secure: boolean;

    /** Behind a reverse proxy this must be on, or every client shares one rate bucket. */
    trustProxy?: boolean;

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
 * A factory rather than a module constant so the store, the sessions and the key can be handed
 * in: every spec builds the app over an in-memory database with a key of its own choosing, which
 * is what lets the suite run with nothing on disk and no order dependence between files.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- the route literal IS the type; naming it would erase per-route inference
export function createApi(deps: ApiDeps)
{
    const { store, sessions } = deps;
    const market = deps.market ?? createPriceGateway();
    const guards = adminGuards({
        sessions,
        secure: deps.secure,
        key: deps.adminKey,
        trustProxy: deps.trustProxy
    });

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
        })),

        /*
         * Guarded at the FEATURE, so authentication is what a route gets by default and any
         * route added here later is protected without anyone remembering to say so.
         *
         * The session routes step back out with `routes.only(...)`: sign-in and sign-out to
         * same-origin alone, and the read-only "am I signed in" to nothing at all. Dropping an
         * inherited guard is the one thing here that turns a protected route into an open one,
         * which is why it has its own name - `grep -rn 'routes.only'` is the complete list of
         * every place this feature's protection stops, and it is three lines long.
         */
        admin: feature('/admin', [guards.sameOrigin, guards.requireAdmin], (routes) => ({
            /**
             * Whether this browser is signed in.
             *
             * Unguarded, and both halves of that are deliberate.
             *
             * Not behind `requireAdmin`: the dashboard calls it on load to choose between the key
             * form and the editor, and a 401 would be an error to handle where a plain "no" is
             * the answer.
             *
             * Not behind `sameOrigin` either. That guard exists to stop a cross-site request
             * CHANGING something, and this changes nothing - it reads a cookie the browser will
             * not send cross-site anyway (SameSite=Strict) and reports one bit. Guarding it
             * would only add a way for a non-browser caller to fail.
             */
            session: routes.only().get('/session', { output: sessionState }, (context) =>
            {
                const token = guards.readToken(context.request);

                if (token === undefined || deps.adminKey === null)
                {
                    return SIGNED_OUT;
                }

                const live = sessions.verify(token);

                return live === null ? SIGNED_OUT : { signedIn: true, expiresAt: iso(live.expiresAt) };
            }),

            /**
             * Exchanges the key for a session.
             *
             * The failure answers are deliberately uniform in BODY: a wrong key and a dashboard
             * with no key configured say the same nothing. Only the status differs, and only
             * where a caller has to be told something actionable - 429 so they stop retrying.
             *
             * There is no "no such key" versus "wrong key" to leak, because there is one key;
             * distinguishing them would say whether one is configured at all.
             */
            signIn: routes.only(guards.sameOrigin).post('/session', {
                input: adminKeyInput,
                output: sessionState,
                responses: { 401: sessionState, 429: sessionState, 503: sessionState }
            }, (context) =>
            {
                if (guards.throttleLogin(context.request) !== undefined)
                {
                    return reply(429, SIGNED_OUT);
                }

                if (deps.adminKey === null)
                {
                    return reply(503, SIGNED_OUT);
                }

                if (!matchesKey(context.input.key, deps.adminKey))
                {
                    return reply(401, SIGNED_OUT);
                }

                const issued = sessions.create();

                return reply(200, { signedIn: true, expiresAt: iso(issued.expiresAt) }, {
                    'set-cookie': guards.setCookie(issued.token, SESSION_TTL_SECONDS)
                });
            }),

            /**
             * Ends this session.
             *
             * Behind `sameOrigin` but NOT behind `requireAdmin`: signing out has to work even
             * once the session has expired, and a 401 would leave a stale cookie in the browser
             * with nothing able to clear it. The cookie is expired either way.
             */
            signOut: routes.only(guards.sameOrigin).post('/session/end', { output: sessionState }, (context) =>
            {
                const token = guards.readToken(context.request);

                if (token !== undefined)
                {
                    sessions.revoke(token);
                }

                return reply(200, SIGNED_OUT, { 'set-cookie': guards.clearCookie() });
            }),

            // ------------------------------------------------------------------------------
            // Everything below inherits the feature's guards: a live session and same-origin.
            // ------------------------------------------------------------------------------

            /**
             * A page of posts, drafts included, newest first - the dashboard's own list.
             *
             * `total` is the count BEFORE paging, so the dashboard can draw a pager. It used to
             * take no query at all and answer with a bare array capped at 200, which made the
             * 201st post unreachable from the only screen that can edit it.
             */
            posts: routes.get('/posts', { query: adminPageQuery, output: postRecordPage }, ({ query }) =>
            {
                const limit = query.limit ?? ADMIN_LIMIT;
                const page = query.page ?? 1;
                const { rows, total } = store.list({
                    limit,
                    offset: (page - 1) * limit,
                    includeDrafts: true
                });

                return { rows: rows.map(toRecord), total, page, pages: pageCount(total, limit) };
            }),

            /** One post with every language in full, for the editor. */
            post: routes.get('/posts/:id', { output: postEditor }, ({ params }) =>
                toEditor(found(store.byId(Number(params.id))))),

            create: routes.post('/posts', { input: createPostInput, output: postEditor }, ({ input }) =>
            {
                // Checked before the insert so the answer is a 409 a form can show against the
                // slug field, rather than a 500 from the UNIQUE index saying nothing useful.
                if (store.slugTaken(input.slug))
                {
                    throw new ConflictError('That slug is already taken.');
                }

                const { locale, translation, ...fields } = input;

                return toEditor(store.create(fields, locale, translation));
            }),

            update: routes.patch('/posts/:id', { input: postInput, output: postEditor }, ({ params, input }) =>
            {
                const id = Number(params.id);

                if (store.slugTaken(input.slug, id))
                {
                    throw new ConflictError('That slug is already taken.');
                }

                return toEditor(found(store.update(id, input)));
            }),

            remove: routes.del('/posts/:id', { output: removed }, ({ params }) =>
            {
                if (!store.remove(Number(params.id)))
                {
                    throw new NotFoundError('No such post.');
                }

                return { removed: true };
            }),

            /** Writes one language of a post. The same call creates it and corrects it. */
            translate: routes.put('/posts/:id/translations/:locale', {
                input: translationInput,
                output: postEditor
            }, ({ params, input }) =>
                toEditor(found(store.upsertTranslation(Number(params.id), params.locale as PostLocale, input)))),

            /**
             * Drops one language.
             *
             * Refusing to remove the DEFAULT one is the store's rule rather than this route's -
             * it is what every other reader falls back to. A 409 and not a 400: the request is
             * well formed, it conflicts with the post's current state, and the dashboard turns
             * that into "change the default language first".
             */
            untranslate: routes.del('/posts/:id/translations/:locale', { output: postEditor }, ({ params }) =>
            {
                const id = Number(params.id);
                const outcome = store.removeTranslation(id, params.locale as PostLocale);

                if (outcome === 'missing')
                {
                    throw new NotFoundError('No such post or language.');
                }

                if (outcome === 'default')
                {
                    throw new ConflictError('That is the language this post falls back to. Change the default first.');
                }

                return toEditor(found(store.byId(id)));
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
    app.get('/sitemap.xml', () => text(buildSitemap(options.store, siteUrl), {
        headers: {
            'content-type': 'application/xml; charset=utf-8',
            // Crawlers re-read this often; an hour keeps it fresh without regenerating per hit.
            'cache-control': 'public, max-age=3600'
        }
    }));

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

        mountPages(app, {
            ...options.pages,
            renderer: withMeta(options.pages.renderer, options.store, siteUrl),
            manifest: manifestOf(api)
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
function withMeta(renderer: PageRenderer | undefined, store: BlogStore, siteUrl: string): PageRenderer | undefined
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

        const deps = { store, siteUrl };
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

        return { ...result, html: injectMeta(result.html, meta) };
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
