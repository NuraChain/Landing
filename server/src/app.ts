import { App, NotFoundError, json, type ErrorObserver, type RequestObserver } from '@azerothjs/http';
import { feature, manifestOf, register, reply } from '@azerothjs/http/api';
import { mountPages, type KitOptions } from '@azerothjs/kit';
import { array } from '@azerothjs/schema';

import { adminGuards } from './admin/guard.ts';
import { matchesKey } from './admin/key.ts';
import { SESSION_TTL_SECONDS, type SessionStore } from './admin/sessions.ts';
import { pageCount, toCards, toDetail } from './blog/present.ts';
import type { BlogStore } from './blog/store.ts';
import { adminKeyInput, pageQuery, postDetail, postPage, readQuery, sessionState, tagCount } from './schemas.ts';

/** How many posts a blog index page holds when the caller does not say. */
const DEFAULT_LIMIT = 10;

/** The language a reader gets when they ask for none - the same default the site falls to. */
const DEFAULT_LOCALE = 'en';

/** The one answer every failed sign-in gives, whatever went wrong. */
const SIGNED_OUT = { signedIn: false, expiresAt: null };

const iso = (seconds: number): string => new Date(seconds * 1000).toISOString();

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

        admin: feature('/admin', (routes) => ({
            /**
             * Whether this browser is signed in.
             *
             * Not behind `requireAdmin`: the dashboard calls it on load to choose between the key
             * form and the editor, and a 401 would be an error to handle where a plain "no" is
             * the answer. It reports one bit and an expiry, never anything about the key.
             */
            session: routes.get('/session', { output: sessionState }, (context) =>
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
            signIn: routes.with(guards.sameOrigin).post('/session', {
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
            signOut: routes.with(guards.sameOrigin).post('/session/end', { output: sessionState }, (context) =>
            {
                const token = guards.readToken(context.request);

                if (token !== undefined)
                {
                    sessions.revoke(token);
                }

                return reply(200, SIGNED_OUT, { 'set-cookie': guards.clearCookie() });
            })
        }))
    };
}

export type Api = ReturnType<typeof createApi>;

export interface AppOptions extends ApiDeps
{
    dev: boolean;
    observe?: RequestObserver;
    onError?: ErrorObserver;

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

    // Mounted LAST so nothing can shadow /api: the kit's asset fallback matches everything.
    if (options.pages !== undefined)
    {
        mountPages(app, { ...options.pages, manifest: manifestOf(api) });
    }

    return app;
}
