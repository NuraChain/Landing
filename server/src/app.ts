import { App, json, type ErrorObserver, type RequestObserver } from '@azerothjs/http';
import { manifestOf, register } from '@azerothjs/http/api';
import { mountPages, type KitOptions } from '@azerothjs/kit';

/**
 * The whole API, declared once.
 *
 * A route's name keys this object, the served manifest, the browser's typed client and the
 * OpenAPI operation, so a route is named in exactly one place. Empty for now - this half exists
 * first to serve the site from one origin; the blog and its admin land on it next.
 */
export const api = {};

export interface AppOptions
{
    dev: boolean;
    observe?: RequestObserver;
    onError?: ErrorObserver;

    /** The built client + SSR renderer (production); omit in dev - vite serves the client. */
    pages?: KitOptions;
}

export function buildApp(options: AppOptions): App
{
    const app = new App({ dev: options.dev, observe: options.observe, onError: options.onError });

    app.get('/api/healthz', () => json({ ok: true, at: new Date().toISOString() }));

    register(app, api);

    // The typed client's runtime half, projected from the SAME declaration `register` installed.
    // Production also embeds it into each served page (KitOptions.manifest), so hydration costs
    // no round trip; this endpoint is what a plain vite dev page falls back to.
    app.get('/api/_manifest', () => json(manifestOf(api)));

    // Mounted LAST so nothing can shadow /api: the kit's asset fallback matches everything.
    if (options.pages !== undefined)
    {
        mountPages(app, options.pages);
    }

    return app;
}
