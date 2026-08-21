import { pathToFileURL } from 'node:url';

import { pipeline, requestId, securityHeaders, rateLimit, logRequests, loadConfig, num, oneOf, str } from '@azerothjs/http';
import { serve, handleShutdownSignals } from '@azerothjs/http/node';
import type { PageRenderer, PageRoute } from '@azerothjs/kit';
import { createLogger, teeSink, terminalSink } from '@azerothjs/logger';
import { fileSink } from '@azerothjs/logger/node';

import { buildApp } from './app.ts';
import { BlogStore } from './blog/store.ts';

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
    // Outside the server workspace so a `npm ci` in either half cannot touch it, and
    // gitignored: this file IS the blog, and it is restored from a backup, never a clone.
    dbPath: str('DB_PATH', { default: '../.data/blog.db' }),
    ssrEntry: str('SSR_ENTRY', { default: '../application/dist-server/entry.server.js' })
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

const store = new BlogStore(config.dbPath);

const app = buildApp({
    store,
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

const handler = pipeline(
    app,
    requestId(),
    securityHeaders(),
    rateLimit({ limit: 200, windowMs: 60_000 })
);

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

// The database holds a file handle and a write-ahead log; a shutdown that leaves them open
// keeps the process alive and the database locked against the next boot.
process.on('exit', () => store.close());

log.info('Listening', { url: `http://localhost:${ served.port }`, env: config.env, db: config.dbPath });
