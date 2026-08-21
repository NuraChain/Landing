import { App, NotFoundError, json, type ErrorObserver, type RequestObserver } from '@azerothjs/http';
import { feature, manifestOf, register } from '@azerothjs/http/api';
import { mountPages, type KitOptions } from '@azerothjs/kit';
import { array } from '@azerothjs/schema';

import { pageCount, toCards, toDetail } from './blog/present.ts';
import type { BlogStore } from './blog/store.ts';
import { pageQuery, postDetail, postPage, readQuery, tagCount } from './schemas.ts';

/** How many posts a blog index page holds when the caller does not say. */
const DEFAULT_LIMIT = 10;

/** The language a reader gets when they ask for none - the same default the site falls to. */
const DEFAULT_LOCALE = 'en';

export interface ApiDeps
{
    store: BlogStore;
}

/**
 * The whole API, declared once.
 *
 * A route's name keys this object, the served manifest, the browser's typed client and the
 * OpenAPI operation, so a route is named in exactly one place.
 *
 * A factory rather than a module constant so the store can be handed in: every spec builds the
 * app over an in-memory database, which is what lets the suite run with nothing on disk and no
 * order dependence between files.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- the route literal IS the type; naming it would erase per-route inference
export function createApi({ store }: ApiDeps)
{
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
