// The behaviour contract, in two real browsers.
//
// `qa:visual` looks at the page - overflow, direction, contrast, screenshots - in Chromium.
// This looks at what the page DOES, in Chromium and Firefox both, and it covers the half that
// has no other check: the document a reader is served before any JavaScript runs, the language
// it was negotiated into, whether the browser adopts that markup or throws it away, and
// whether a wrong address is a real 404.
//
// None of that is visible to the unit suites. They run under happy-dom against components;
// this runs against a server over a socket, which is where SSR, hydration, cookies and status
// codes actually exist.
//
//   npm run dev                                   # or a production `npm start`
//   npm run qa:browser                            # against http://127.0.0.1:3000
//   npm run qa:browser -- --url http://host:port/ --browser chromium
//
// Warnings do not fail the run; a real regression exits non-zero.
import { launchBrowser } from './browsers.mjs';

const arg = (flag, fallback) =>
{
    const index = process.argv.indexOf(flag);

    return index === -1 ? fallback : process.argv[index + 1];
};

const BASE = arg('--url', 'http://127.0.0.1:3000/').replace(/\/+$/, '');
const ENGINES = ['chromium', 'firefox'];
const WANTED = arg('--browser', 'all');

/** The five addresses the site publishes, plus the two that must NOT resolve. */
const PAGES = ['/', '/about', '/blog', '/whitepaper'];

const findings = [];
const record = (level, scenario, message) => findings.push({ level, scenario, message });

/** Reported once per run: every later failure is a consequence of the first refusal. */
let rateLimited = false;

/*
 * Every matcher below tolerates ATTRIBUTES on the tag it looks for.
 *
 * The head runtime marks what it wrote - `data-azeroth-head` on each element it owns, and
 * `data-azeroth-title-base` on the title, holding the shell's original text so the client can
 * restore it when a page is left. A matcher written as `<title>` therefore finds nothing on a
 * served page and reports a missing head that is in fact perfectly present.
 */

/** The `content` of a named meta, read out of served markup rather than out of a live DOM. */
const metaOf = (html, name) =>
    new RegExp(`<meta[^>]*name="${ name }"[^>]*content="([^"]*)"`, 'u').exec(html)?.[1] ?? null;

const titleOf = (html) => /<title[^>]*>([^<]*)<\/title>/u.exec(html)?.[1] ?? null;

/** The first JSON-LD payload, or null when the page carries none. */
const jsonLdOf = (html) =>
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/u.exec(html)?.[1] ?? null;

/** Every `<html ...>` attribute run in the served document. */
const rootAttrs = (html) => /<html\b([^>]*)>/u.exec(html)?.[1] ?? '';

/**
 * Refuses every request that leaves this origin.
 *
 * The landing page reads live chain figures from the RPC, the explorer and a price feed, and
 * the network section polls. None of that is what these checks are about, and all of it makes
 * them depend on three third parties being up: `networkidle` never arrives while a hung
 * request is outstanding, and a run goes red because somebody else had a bad minute. The
 * suites already hold this line by stubbing `fetch`; this is the same rule one layer out.
 */
async function isolate(context, options = {})
{
    await context.route('**/*', (route) =>
    {
        const request = route.request();
        const url = request.url();
        const ours = url.startsWith(BASE) || url.startsWith('data:') || url.startsWith('blob:');

        /*
         * The document alone, for the checks that only PARSE it.
         *
         * Those read served markup - the head, the article, the status - and never render, so
         * the stylesheet, the bundle and four font subsets are pure cost. They are also the
         * bulk of it: the site rate-limits on the client address and the limiter wraps the
         * whole app, so a cold page load spends a dozen of the budget on its own assets.
         */
        if (options.documentOnly === true && request.resourceType() !== 'document')
        {
            return route.abort();
        }

        return ours ? route.continue() : route.abort();
    });

    /*
     * A 429 is reported as ITSELF, once, rather than as whatever it breaks downstream.
     *
     * The site rate-limits on the client address and the limiter wraps the whole app, so a
     * cold page load spends a dozen of the budget on its own assets. A QA run that walks
     * twenty pages can spend it all - and when it does, the pages come back refused and every
     * later check reports a missing element, which reads as a broken site rather than a
     * throttled one. This is the whole reason the run reuses contexts and trims its matrix.
     */
    context.on('response', (response) =>
    {
        if (response.status() === 429 && !rateLimited)
        {
            rateLimited = true;
            record('error', 'rate limit',
                `the server answered 429 for ${ response.url().replace(BASE, '') || '/' } - this run spent the site's `
                + 'own request budget (200/minute per address). Wait a minute and re-run, or run one engine at a time.');
        }
    });
}

/**
 * The document as a crawler and a reader with scripting off receive it.
 *
 * Fetched through the browser with JavaScript DISABLED, rather than with `fetch`, because the
 * point is what a browser is handed - and because a context can carry the cookie and the
 * language header a real reader would send.
 */
async function servedDocument(browser, path, options = {})
{
    const context = await browser.newContext({
        javaScriptEnabled: false,
        ...(options.locale === undefined ? {} : { extraHTTPHeaders: { 'accept-language': options.locale } })
    });

    await isolate(context, { documentOnly: true });

    if (options.cookie !== undefined)
    {
        await context.addCookies([{ name: 'locale', value: options.cookie, url: BASE }]);
    }

    const page = await context.newPage();
    const response = await page.goto(BASE + path, { waitUntil: 'domcontentloaded', timeout: 45000 });
    const html = await page.content();
    const status = response?.status() ?? 0;

    await context.close();

    return { status, html };
}

/** What the server sends, before a single byte of the bundle has run. */
async function checkServedDocuments(browser, engine)
{
    for (const path of PAGES)
    {
        const scenario = `${ engine } no-js ${ path }`;
        const { status, html } = await servedDocument(browser, path);

        if (status !== 200)
        {
            record('error', scenario, `expected 200, got ${ status }`);
            continue;
        }

        // One of each. Two robots directives resolve to the MOST RESTRICTIVE, which is how a
        // page ends up silently de-indexed by another page's noindex.
        for (const [what, count] of [
            ['<title>', [...html.matchAll(/<title[\s>]/gu)].length],
            ['name="description"', [...html.matchAll(/name="description"/gu)].length],
            ['name="robots"', [...html.matchAll(/name="robots"/gu)].length]
        ])
        {
            if (count !== 1)
            {
                record('error', scenario, `${ count } copies of ${ what } in the document, expected exactly 1`);
            }
        }

        if ((titleOf(html) ?? '') === '')
        {
            record('error', scenario, 'the document has no title');
        }

        if (!html.includes('rel="canonical"'))
        {
            record('error', scenario, 'no canonical link');
        }

        const robots = metaOf(html, 'robots');
        const expected = path === '/about' ? 'noindex, follow' : 'index, follow';

        if (robots !== expected)
        {
            record('error', scenario, `robots is "${ robots }", expected "${ expected }"`);
        }
    }

    // A post, which is the page whose BODY used to be a loading skeleton for a crawler.
    const index = await servedDocument(browser, '/blog');
    const slug = /href="\/blog\/([a-z0-9-]+)"/u.exec(index.html)?.[1] ?? null;

    if (slug === null)
    {
        record('error', `${ engine } no-js /blog`, 'the served index links no post, so the article check cannot run');

        return null;
    }

    const post = await servedDocument(browser, `/blog/${ slug }`);
    const scenario = `${ engine } no-js /blog/${ slug }`;

    if (!/<h2[^>]*>/u.test(post.html))
    {
        record('error', scenario, 'the served post carries no <h2>: the article is not in the document');
    }

    const block = jsonLdOf(post.html);

    if (block === null)
    {
        record('error', scenario, 'no JSON-LD block');
    }
    else
    {
        try
        {
            const parsed = JSON.parse(block);

            if (typeof parsed['@type'] !== 'string')
            {
                record('error', scenario, 'the JSON-LD block names no @type');
            }
        }
        catch (error)
        {
            record('error', scenario, `the JSON-LD block does not parse: ${ error.message }`);
        }
    }

    return slug;
}

/** The language the server decides on, and what it tells caches about the decision. */
async function checkNegotiation(browser, engine)
{
    const persian = await servedDocument(browser, '/blog', { locale: 'fa-IR,fa;q=0.9,en;q=0.8' });

    if (!/lang="fa"/u.test(rootAttrs(persian.html)) || !/dir="rtl"/u.test(rootAttrs(persian.html)))
    {
        record('error', `${ engine } negotiate`, `a Persian browser was served <html${ rootAttrs(persian.html) }>`);
    }

    // The header is read in PREFERENCE ORDER: this reader asked for English.
    const english = await servedDocument(browser, '/blog', { locale: 'en-US,fa;q=0.9' });

    if (!/lang="en"/u.test(rootAttrs(english.html)))
    {
        record('error', `${ engine } negotiate`, `an English-first browser was served <html${ rootAttrs(english.html) }>`);
    }

    // A cookie is an answer the reader gave, and it outranks their browser's guess.
    const chosen = await servedDocument(browser, '/blog', { locale: 'fa-IR', cookie: 'tr' });

    if (!/lang="tr"/u.test(rootAttrs(chosen.html)))
    {
        record('error', `${ engine } negotiate`, `a reader who chose Turkish was served <html${ rootAttrs(chosen.html) }>`);
    }
}

/** A url that names nothing must say so, in the status line and not only on the page. */
async function checkNotFound(browser, engine)
{
    for (const path of ['/blog/this-post-does-not-exist', '/nope'])
    {
        const { status } = await servedDocument(browser, path);

        if (status !== 404)
        {
            record('error', `${ engine } 404 ${ path }`, `expected 404, got ${ status } - a soft 404 is indexed as real content`);
        }
    }
}

/**
 * Whether the browser ADOPTS the server's markup or throws it away and starts again, and
 * whether the theme toggle shows exactly one glyph.
 *
 * A hydration mismatch is not visible on screen: the page looks right either way, because the
 * fallback is a clean client render of the same tree. It costs the reader the whole render and
 * shows up only as a console warning, which is why it is asserted here.
 *
 * The glyph rides along rather than getting a pass of its own. It is the one piece of markup
 * that depends on the theme, this is already the loop that visits pages under each theme, and
 * a separate pass costs two more cold contexts - which the request budget cannot spare.
 */
async function checkHydration(browser, engine, slug)
{
    const every = slug === null ? PAGES : [...PAGES, `/blog/${ slug }`];

    for (const theme of ['dark', 'light'])
    {
        const context = await browser.newContext();

        await isolate(context);
        await context.addInitScript((value) =>
        {
            try
            {
                localStorage.setItem('nura.theme', value);
            }
            catch
            { /* storage blocked; the page still resolves a default */ }
        }, theme);

        // The dark pass walks the whole site. The light one visits the home page alone: the
        // only markup that differs by theme is the toggle's glyph, checked below, and a second
        // full walk buys nothing for a dozen more page loads.
        const paths = theme === 'dark' ? every : ['/'];

        for (const path of paths)
        {
            const scenario = `${ engine } ${ theme } ${ path }`;
            const page = await context.newPage();
            const noise = [];
            const refetched = [];

            page.on('console', (message) =>
            {
                const text = message.text();

                /*
                 * A network-level failure is this run's own isolation, not the page.
                 *
                 * The site reads live chain figures from three third parties and the run
                 * refuses them, which is what makes it deterministic - and each refusal is
                 * logged by the browser. Chromium words it as a bare `ERR_FAILED` with no url,
                 * so the filter is on the SHAPE of the message rather than on a hostname.
                 * Nothing real is lost: an exception arrives through `pageerror`, and a
                 * hydration complaint is matched by name below.
                 */
                if (/failed to load resource|net::err_|ns_error_|cross-origin request blocked/iu.test(text))
                {
                    return;
                }

                if (message.type() === 'error' || /hydrat/iu.test(text))
                {
                    noise.push(`${ message.type() }: ${ text }`);
                }
            });
            page.on('pageerror', (error) => noise.push(`pageerror: ${ error.message }`));
            page.on('request', (request) =>
            {
                if (request.url().includes('/api/blog') || request.url().includes('/api/whitepaper'))
                {
                    refetched.push(request.url().replace(BASE, ''));
                }
            });

            await page.goto(BASE + path, { waitUntil: 'load', timeout: 45000 });
            await page.waitForTimeout(500);

            for (const line of noise)
            {
                record('error', scenario, line);
            }

            // The loader's data rode the handoff into the document, so drawing the page costs
            // no request. One here means the browser did not adopt what it was sent.
            if (refetched.length > 0)
            {
                record('error', scenario, `refetched on load: ${ refetched.join(', ') }`);
            }

            if (path === '/')
            {
                /*
                 * Counted per class, never as one comma-separated selector: `:visible` binds
                 * to the first branch of such a list, so `a:visible, b:visible` answers 0
                 * whenever it is `b` that is showing - which reads as a broken page rather
                 * than a broken check.
                 */
                const shown = await page.locator('header .theme-glyph-dark:visible').count()
                    + await page.locator('header .theme-glyph-light:visible').count();

                if (shown !== 1)
                {
                    record('error', scenario, `${ shown } theme glyphs visible in the header, expected exactly 1`);
                }
            }

            await page.close();
        }

        await context.close();
    }
}

/** The head follows a client-side navigation, which is the half a served document cannot show. */
async function checkClientNavigation(context, engine)
{
    const page = await context.newPage();

    await page.goto(`${ BASE }/blog`, { waitUntil: 'load', timeout: 45000 });

    const indexTitle = await page.title();
    const first = page.locator('ul a[href^="/blog/"]').first();

    try
    {
        // Waited for rather than counted: `networkidle` is about the network, not about the
        // list being on screen, and a count taken a frame early reads as an empty blog.
        await first.waitFor({ state: 'visible', timeout: 10000 });
    }
    catch
    {
        record('error', `${ engine } navigation`, 'the blog index rendered no post links within 10s');
        await page.close();

        return;
    }

    await first.click();
    await page.waitForTimeout(700);

    const postTitle = await page.title();

    if (postTitle === indexTitle)
    {
        record('error', `${ engine } navigation`, `the title did not change on navigation (still "${ postTitle }")`);
    }

    await page.goBack({ waitUntil: 'load' });
    await page.waitForTimeout(500);

    if (await page.title() !== indexTitle)
    {
        record('error', `${ engine } navigation`, `back did not restore the index title (got "${ await page.title() }")`);
    }

    await page.close();
}

/** A language switch is a new request, and the whole document follows it. */
async function checkLanguageSwitch(context, engine)
{
    const page = await context.newPage();

    await page.goto(`${ BASE }/blog`, { waitUntil: 'load', timeout: 45000 });

    // The switcher lives behind a dialog; the cookie is what it ultimately writes, so the
    // check drives the same path a reader does and then reads what the document says.
    const opened = page.locator('button[aria-haspopup="dialog"]').last();

    try
    {
        await opened.waitFor({ state: 'visible', timeout: 10000 });
    }
    catch
    {
        record('error', `${ engine } language`, 'no language trigger on the page within 10s');
        await page.close();

        return;
    }

    await opened.click();

    const persian = page.locator('button[lang="fa"]').first();

    try
    {
        await persian.waitFor({ state: 'visible', timeout: 10000 });
    }
    catch
    {
        record('error', `${ engine } language`, 'the picker offered no Persian row within 10s');
        await page.close();

        return;
    }

    await persian.click();
    await page.waitForTimeout(900);

    const lang = await page.evaluate(() => document.documentElement.lang);
    const dir = await page.evaluate(() => document.documentElement.dir);

    if (lang !== 'fa' || dir !== 'rtl')
    {
        record('error', `${ engine } language`, `after choosing Persian the document reads lang="${ lang }" dir="${ dir }"`);
    }

    const cookie = (await page.context().cookies()).find((entry) => entry.name === 'locale');

    if (cookie?.value !== 'fa')
    {
        record('error', `${ engine } language`, `the choice was not remembered where the server reads it (cookie: ${ cookie?.value ?? 'none' })`);
    }

    await page.close();
}

const engines = WANTED === 'all' ? ENGINES : [WANTED];

for (const engine of engines)
{
    let browser;

    try
    {
        const launched = await launchBrowser(engine);

        browser = launched.browser;
        console.log(`> ${ engine }: ${ launched.using }`);
    }
    catch (error)
    {
        record('error', engine, `could not launch: ${ error.message }`);
        continue;
    }

    try
    {
        const slug = await checkServedDocuments(browser, engine);

        await checkNegotiation(browser, engine);
        await checkNotFound(browser, engine);
        await checkHydration(browser, engine, slug);
        // One context for both: each new one starts with an empty cache and re-downloads the
        // bundle, the stylesheet and the fonts, and that is exactly the budget the site's own
        // rate limiter meters.
        const interactive = await browser.newContext();

        await isolate(interactive);

        try
        {
            await checkClientNavigation(interactive, engine);
            await checkLanguageSwitch(interactive, engine);
        }
        finally
        {
            await interactive.close();
        }
    }
    finally
    {
        await browser.close();
    }
}

const errors = findings.filter((entry) => entry.level === 'error');
const warnings = findings.filter((entry) => entry.level === 'warn');

for (const entry of findings)
{
    console.log(`${ entry.level === 'error' ? 'x' : '!' } ${ entry.scenario }: ${ entry.message }`);
}

console.log(`\n${ errors.length } error(s), ${ warnings.length } warning(s) across ${ engines.join(' and ') }, against ${ BASE }`);

process.exit(errors.length === 0 ? 0 : 1);
