import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { logRequests, loadConfig, flag, num, oneOf, str, type ErrorObserver } from '@azerothjs/http';
import { manifestOf } from '@azerothjs/http/api';
import { serve, handleShutdownSignals } from '@azerothjs/http/node';
import type { KitErrorObserver, PageRenderer, PageRoute } from '@azerothjs/kit';
import { SSR_SOURCE_ENTRY } from '@azerothjs/kit/dev/entry';
import { createLogger, teeSink, terminalSink } from '@azerothjs/logger';
import { fileSink } from '@azerothjs/logger/node';

import { buildApp, createApi, createHandler, registerApi, DEFAULT_SITE_URL } from './app.ts';
import { BlogContent, loadArticles } from './blog/content.ts';
import { loadWhitepaper, PDF_DIR, pdfStatus } from './whitepaper/content.ts';

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

// Production mode with nothing built is the one way the import below dies as a bare missing
// module; say what it means while there is still a logger to say it with.
if (isProduction && !existsSync(config.ssrEntry))
{
    log.error('no SSR bundle on disk - run `npm run build` first, or start the dev session with `npm run dev`', {
        ssrEntry: config.ssrEntry,
        env: config.env
    });
}

// Production: the self-contained SSR bundle carries the routes and the renderer. Dev builds
// nothing - the kit's session below loads the same two exports from source, through vite.
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

/*
 * The whitepaper, the same way - and its PDFs, which are derived from it by
 * `npm run whitepaper:pdf` and committed beside it. A language with no PDF is a dead download
 * link on every page, so it is a bad deploy and refused here; a STALE one still opens a real
 * document, so it is logged and served while somebody regenerates it. The suite fails on both.
 */
const whitepaper = loadWhitepaper();
const pdfs = pdfStatus(whitepaper);

if (pdfs.missing.length > 0)
{
    throw new Error(`Whitepaper PDF missing for: ${ pdfs.missing.join(', ') } - run npm run whitepaper:pdf.`);
}

const content = { store, whitepaper };
const observe = logRequests(log);

const onError: ErrorObserver = (error, mapped) =>
{
    if (mapped.status >= 500)
    {
        log.error('unhandled error', { status: mapped.status, error });
    }
};

/*
 * A page failure has nowhere else to go.
 *
 * A rejected loader renders the page at a real 500 rather than throwing, so the kernel's own
 * error path never sees it - the kit reports it here instead, and its default is `console.error`,
 * which the NDJSON log never receives. The same seam carries a failed ISR regeneration and a
 * streamed boundary that rejected after the shell had flushed.
 */
const pageError: KitErrorObserver = (error, context) =>
    log.error('page failed', { path: context.path, phase: context.phase, error });

/*
 * The ONE api this process holds.
 *
 * Built here rather than inside `buildApp` because both halves of the boot need the same
 * instance: its price gateway carries the one-minute memo, and a second instance would be a
 * second memo asking the swap on its own schedule.
 */
const api = createApi(content);

/*
 * Development runs the production page mount, fed by vite inside THIS process.
 *
 * One origin serves the pages, the api, the PDFs and the HMR socket, over the same route table
 * and the same renderer a deploy uses - so guards as status, locale negotiation, real 404s and
 * the manifest splice are all things that exist in dev now, rather than things you could only
 * see after a build. The import is dynamic because vite is a devDependency a production image
 * (`npm ci --omit=dev`) never installs.
 */
const kitDev = isProduction ? undefined : await import('@azerothjs/kit/dev');
const session = await kitDev?.devPages({
    root: fileURLToPath(new URL('../../application/', import.meta.url)),
    entry: SSR_SOURCE_ENTRY,
    pages: { manifest: manifestOf(api), onError: pageError },
    routes: (target) => registerApi(target, api, content, { siteUrl: config.siteUrl, pdfDir: PDF_DIR }),
    app: { dev: true, observe, onError },
    // The single-instance check resolves `azerothjs` from THIS module rather than from the kit,
    // so a second copy under the server half is refused at startup instead of silently splitting
    // the request scope.
    serverAnchor: import.meta.url
});

const app = session?.app ?? buildApp({
    ...content,
    api,
    pdfDir: PDF_DIR,
    siteUrl: config.siteUrl,
    dev: !isProduction,
    observe,
    onError,
    pages: ssr === undefined
        ? undefined
        : { routes: ssr.routes, clientDir: config.clientDir, renderer: ssr.renderPage, onError: pageError }
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

const served = await serve(handler, {
    port: config.port,
    // Vite's own middleware, ahead of the kernel: it sees only its own urls and the files under
    // the application root. Undefined in production, where there is no session.
    before: session?.before,
    // Dev binds IPv4 loopback, because `localhost` resolves to ::1 first on some platforms and
    // a page that cannot reach its own origin is the confusing failure. HOST=0.0.0.0 opens it to
    // another device. Production keeps the adapter's own bind.
    hostname: isProduction ? undefined : (process.env.HOST ?? '127.0.0.1')
});

// The HMR socket rides THIS server: vite was given a relay it never listens on, so the page
// dials its own origin and a tab survives the process restarting under `node --watch`.
session?.attach(served.server);

handleShutdownSignals(served, { beforeExit: () => session?.close() });

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

if (pdfs.stale.length > 0)
{
    log.warn('whitepaper PDF is stale - run npm run whitepaper:pdf', { locales: pdfs.stale });
}

log.info('Listening', { url: `http://localhost:${ served.port }`, env: config.env, posts: store.list({ limit: 0, offset: 0 }).total });
