import { pathToFileURL } from 'node:url';

import { logRequests, loadConfig, flag, num, oneOf, str } from '@azerothjs/http';
import { serve, handleShutdownSignals } from '@azerothjs/http/node';
import type { PageRenderer, PageRoute } from '@azerothjs/kit';
import { createLogger, teeSink, terminalSink } from '@azerothjs/logger';
import { fileSink } from '@azerothjs/logger/node';

import { buildApp, createHandler, DEFAULT_SITE_URL } from './app.ts';
import { BlogContent, loadArticles } from './blog/content.ts';

try
{
    process.loadEnvFile();
}
catch
{
    // No .env file - the ambient environment is the configuration.
}

const config = loadConfig({
    port: num('PORT', { default: 3000 }),
    /*
     * Unset means PRODUCTION. `azeroth dev` declares development for its children, so anything
     * that did not come from the dev command is a deploy. Defaulting the other way would make a
     * deployment that forgot the variable serve the dev app and open every dev-only gate.
     */
    env: oneOf('NODE_ENV', ['development', 'production', 'test'], { default: 'production' }),
    clientDir: str('CLIENT_DIR', { default: '../application/dist' }),
    // On behind a reverse proxy, or every client shares the proxy's rate bucket and the
    // login throttle becomes one global budget an attacker can exhaust for everybody.
    trustProxy: flag('TRUST_PROXY', { default: false }),
    ssrEntry: str('SSR_ENTRY', { default: '../application/dist-server/entry.server.js' }),
    // The origin the site names itself by: canonical tags, Open Graph urls, JSON-LD and the
    // sitemap are all built from it. A deployment behind a different host sets this, or every
    // one of those points somewhere the site is not actually served.
    siteUrl: str('SITE_URL', { default: DEFAULT_SITE_URL })
});
const isProduction = config.env === 'production';

// Readable lines on the terminal, NDJSON in server/logs/ - both, in every mode.
const log = createLogger({
    sink: teeSink(terminalSink(), fileSink(new URL('../logs/', import.meta.url))),
    fields: { service: 'nura-landing-server' }
});

// Dev: vite serves the client and proxies /api here. Production: this server serves the whole
// site from one origin, and the self-contained SSR bundle carries the routes and the renderer.
const ssr = isProduction
    ? await import(pathToFileURL(config.ssrEntry).href) as { routes: PageRoute[]; renderPage: PageRenderer }
    : undefined;

/*
 * The whole blog, read off disk once, before a port is bound.
 *
 * A missing or empty translation throws HERE rather than on the request that would have served
 * it: the content ships with the code, so an incomplete cluster is a bad deploy and the loud
 * failure is the one that gets noticed. Nothing writes to it afterwards - publishing is a
 * commit, and a running process serves what it read at boot.
 */
const store = new BlogContent(loadArticles());

const app = buildApp({
    store,
    siteUrl: config.siteUrl,
    dev: !isProduction,
    observe: logRequests(log),
    onError: (error, mapped) =>
    {
        if (mapped.status >= 500)
        {
            log.error('unhandled error', { status: mapped.status, error });
        }
    },
    pages: ssr === undefined
        ? undefined
        : { routes: ssr.routes, clientDir: config.clientDir, renderer: ssr.renderPage }
});

/*
 * The edges, and the trust boundary they are keyed on.
 *
 * `trustProxy` has to reach the LIMITER, which is where it once failed to. The limiter keys
 * on the client address, and without the flag that address is the TCP peer - behind a reverse
 * proxy, the proxy. Every visitor on the internet then shared one
 * bucket of 200 requests a minute, and since the limiter wraps the whole app rather than just
 * /api, a single cold page load spends a dozen of them on its own script, stylesheet, fonts
 * and icons. The site went down for whoever asked next, for the rest of the minute, and came
 * back on its own - which is exactly what "it sometimes does not load" looks like from
 * outside.
 */
const handler = createHandler(app, { trustProxy: config.trustProxy });

const served = await serve(handler, { port: config.port });
handleShutdownSignals(served);

/*
 * The devtools bridge exposes live server state, so it attaches only under a LITERAL
 * NODE_ENV=development - `config.env` above is defaulted and would switch it on everywhere.
 * The token comes from the gitignored .env rather than being minted per boot: `node --watch`
 * restarts on every save, and a fresh token each restart would strand the panel.
 */
if (process.env.NODE_ENV === 'development')
{
    const token = process.env.DEVTOOLS_TOKEN;

    if (token === undefined || token.length < 16)
    {
        log.warn('devtools bridge off - set DEVTOOLS_TOKEN in .env (16+ chars) to enable it');
    }
    else
    {
        const { attachDevtools } = await import('@azerothjs/devtools/server');

        attachDevtools(served.server, { token });
        log.info('devtools bridge', { url: `ws://localhost:${ served.port }/__azeroth/devtools?token=${ token }` });
    }
}

log.info('Listening', { url: `http://localhost:${ served.port }`, env: config.env, posts: store.list({ limit: 0, offset: 0 }).total });
