// Visual and accessibility QA across every viewport and both text directions.
//
// The point is not the screenshots on their own - it is the assertions that run beside
// them. A screenshot only helps if somebody looks at it, so this also checks the things a
// person reliably misses: horizontal overflow, elements escaping the viewport, the document
// direction actually flipping, and the axe rule set. Screenshots are the evidence you read
// AFTER something fails, not the check itself.
//
//   npm run qa:visual                      # against http://localhost:4000
//   npm run qa:visual -- --url http://...  # against anything else
//
// Requires the dev server (or a preview build) to already be serving.
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

/** The three sizes the site is designed against; the mobile one is an iPhone 14/15 class. */
const VIEWPORTS = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 1024, height: 768 },
    { name: 'mobile', width: 390, height: 844 }
];

/** One Latin locale and one Arabic-script locale - the two directions the site ships. */
const DIRECTIONS = [
    { locale: 'en', dir: 'ltr' },
    { locale: 'fa', dir: 'rtl' }
];

const arg = (flag, fallback) =>
{
    const index = process.argv.indexOf(flag);

    return index === -1 ? fallback : process.argv[index + 1];
};

const URL_UNDER_TEST = arg('--url', 'http://localhost:4000/');
const OUT_DIR = arg('--out', 'artifacts/visual-qa');

/**
 * Rules that are about the page's own markup rather than about the harness. `color-contrast`
 * is kept ON deliberately: the three themes each claim measured ratios, and this is what
 * checks the claim.
 */
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const findings = [];

const record = (level, scenario, message) =>
{
    findings.push({ level, scenario, message });
};

/** Anything wider than the viewport, or hanging off either edge, on a page that never scrolls sideways. */
const layoutProblems = async (page) => page.evaluate(() =>
{
    const root = document.documentElement;
    const overflowing = [];

    for (const element of document.querySelectorAll('body *'))
    {
        const style = getComputedStyle(element);

        if (style.display === 'none' || style.visibility === 'hidden' || style.position === 'fixed')
        {
            continue;
        }

        const box = element.getBoundingClientRect();

        if (box.width === 0 || box.height === 0)
        {
            continue;
        }

        // A few pixels of rounding is normal; a real escape is much larger than that.
        if (box.left < -2 || box.right > root.clientWidth + 2)
        {
            // ...unless an ancestor clips it. A truncated URL inside `overflow: hidden` is
            // WIDER than its box by design - it is ellipsized, not spilling onto the page.
            // Reporting those trains the reader to ignore this check, which is worse than
            // not having it.
            let clipped = false;

            for (let parent = element.parentElement; parent !== null; parent = parent.parentElement)
            {
                const parentStyle = getComputedStyle(parent);

                if (!/^(hidden|clip|auto|scroll)$/.test(parentStyle.overflowX))
                {
                    continue;
                }

                const parentBox = parent.getBoundingClientRect();

                if (parentBox.left >= -2 && parentBox.right <= root.clientWidth + 2)
                {
                    clipped = true;
                    break;
                }
            }

            if (clipped)
            {
                continue;
            }

            overflowing.push({
                tag: element.tagName.toLowerCase(),
                cls: String(element.className ?? '').slice(0, 48),
                left: Math.round(box.left),
                right: Math.round(box.right)
            });
        }
    }

    return {
        scrollWidth: root.scrollWidth,
        clientWidth: root.clientWidth,
        hasHorizontalScroll: root.scrollWidth > root.clientWidth + 1,
        dir: root.getAttribute('dir'),
        lang: root.getAttribute('lang'),
        // Deduplicated: one broken container usually reports every descendant too.
        overflowing: overflowing.slice(0, 6)
    };
});

const run = async () =>
{
    await mkdir(OUT_DIR, { recursive: true });

    const browser = await chromium.launch();
    const summary = [];

    try
    {
        for (const direction of DIRECTIONS)
        {
            for (const viewport of VIEWPORTS)
            {
                const scenario = `${ direction.dir }-${ viewport.name }`;
                const context = await browser.newContext({
                    viewport: { width: viewport.width, height: viewport.height },
                    deviceScaleFactor: 1
                });

                // Seeded before any script runs, so the page paints in the right locale on
                // the FIRST frame - which is the whole point of the pre-paint script.
                await context.addInitScript(([locale]) =>
                {
                    try
                    {
                        localStorage.setItem('nura.locale', locale);
                        localStorage.setItem('nura.theme', 'dark');
                    }
                    catch
                    { /* storage blocked; the page still resolves a default */ }
                }, [direction.locale]);

                const page = await context.newPage();

                await page.goto(URL_UNDER_TEST, { waitUntil: 'networkidle', timeout: 60000 });
                await page.waitForSelector('main', { timeout: 30000 });

                const layout = await layoutProblems(page);

                if (layout.dir !== direction.dir)
                {
                    record('FAIL', scenario, `document dir is "${ layout.dir }", expected "${ direction.dir }"`);
                }

                if (layout.hasHorizontalScroll)
                {
                    record('FAIL', scenario, `page scrolls horizontally (${ layout.scrollWidth }px in ${ layout.clientWidth }px)`);
                }

                for (const element of layout.overflowing)
                {
                    record('WARN', scenario, `<${ element.tag }> escapes the viewport (${ element.left }..${ element.right }) ${ element.cls }`);
                }

                const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();

                for (const violation of axe.violations)
                {
                    record(violation.impact === 'critical' || violation.impact === 'serious' ? 'FAIL' : 'WARN',
                        scenario,
                        `a11y ${ violation.id } (${ violation.impact }, ${ violation.nodes.length }x): ${ violation.help }`);
                }

                const file = `${ OUT_DIR }/${ scenario }.png`;

                await page.screenshot({ path: file, fullPage: true });

                summary.push({
                    scenario,
                    viewport: `${ viewport.width }x${ viewport.height }`,
                    lang: layout.lang,
                    dir: layout.dir,
                    hScroll: layout.hasHorizontalScroll,
                    overflow: layout.overflowing.length,
                    a11yViolations: axe.violations.length,
                    screenshot: file
                });

                await context.close();
            }
        }
    }
    finally
    {
        await browser.close();
    }

    console.table(summary);

    await writeFile(`${ OUT_DIR }/report.json`,
        JSON.stringify({ url: URL_UNDER_TEST, summary, findings }, null, 2));

    const fails = findings.filter((f) => f.level === 'FAIL');
    const warns = findings.filter((f) => f.level === 'WARN');

    for (const finding of [...fails, ...warns])
    {
        console.log(`${ finding.level.padEnd(4) } [${ finding.scenario }] ${ finding.message }`);
    }

    console.log(`\n${ fails.length } failing, ${ warns.length } warning, screenshots in ${ OUT_DIR }/`);

    // Warnings do not fail the run; a genuine regression does.
    process.exit(fails.length > 0 ? 1 : 0);
};

await run();
