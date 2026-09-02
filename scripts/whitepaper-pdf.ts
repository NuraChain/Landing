// Renders the whitepaper to one PDF per language.
//
//   npm run whitepaper:pdf
//
// The page at /whitepaper and the file a reader downloads have to say the same words, and the
// only way to guarantee that is for both to be RENDERED from the same markdown by the same
// renderer: `renderArticle` in server/src/seo/article.ts, the one a crawler is served. This
// script wraps that markup in a print stylesheet, lets Chromium typeset it - which is what gets
// Persian and Arabic shaped correctly, Chinese and Devanagari set in a real face, and page
// breaks that avoid orphaned headings - and writes the result into
// server/content/whitepaper/pdf/, beside a manifest recording the hash of the markdown each
// file was rendered from.
//
// That manifest is the whole reason the PDFs can be committed rather than built on deploy: the
// server refuses to boot without them and the suite fails while any is stale, so nobody has to
// remember to run this - forgetting is red. Chromium is a dev dependency here (Playwright, the
// same one `npm run qa:visual` drives) and never a runtime one.
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

import type { Strings } from '../application/src/lib/i18n/types.ts';
import { DEFAULT_SITE_URL } from '../server/src/app.ts';
import type { PostLocale } from '../server/src/schemas.ts';
import { renderArticle } from '../server/src/seo/article.ts';
import { attr, directionOf } from '../server/src/seo/meta.ts';
import { bodyHash, loadWhitepaper, PDF_DIR, pdfFileFor, type PdfManifest } from '../server/src/whitepaper/content.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = join(ROOT, 'node_modules', '@fontsource-variable');
const ICON = join(ROOT, 'application', 'public', 'icon.png');
const I18N = join(ROOT, 'application', 'src', 'lib', 'i18n');
const MANIFEST = join(ROOT, 'server', 'content', 'whitepaper', 'manifest.json');

/**
 * The self-hosted faces the site already ships, addressed by file url so Chromium embeds them.
 *
 * Read from each package's own stylesheet rather than declared here, because the stylesheet
 * carries the per-script `unicode-range` that makes three files one family - without it the
 * last `@font-face` declared would win every glyph and the Arabic subset would never be used.
 */
async function fontFaces(): Promise<string>
{
    const sheets = await Promise.all(['vazirmatn', 'space-grotesk'].map(async (name) =>
    {
        const dir = join(FONTS, name);
        const css = await readFile(join(dir, 'index.css'), 'utf8');

        return css.replaceAll('url(./files/', `url(${ pathToFileURL(join(dir, 'files')).href }/`);
    }));

    return sheets.join('\n');
}

/**
 * The body face per script. Latin locales read in the system sans the site itself falls back
 * to; the two Arabic-script locales take Vazirmatn as the site does, with the same taller
 * leading; Han and Devanagari name the faces Windows and macOS ship for them.
 */
const BODY_FONT: Record<PostLocale, string> = {
    en: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    es: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    pt: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    fr: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    tr: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    ru: '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif',
    fa: '"Vazirmatn Variable", "Segoe UI", Tahoma, sans-serif',
    ar: '"Vazirmatn Variable", "Segoe UI", Tahoma, sans-serif',
    zh: '"Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", sans-serif',
    hi: '"Nirmala UI", "Noto Sans Devanagari", "Segoe UI", sans-serif'
};

const LINE_HEIGHT: Partial<Record<PostLocale, string>> = { fa: '1.85', ar: '1.85' };

/** The light theme's tokens, as literals: a printed page has one palette. Values from styles.css. */
const PRINT_CSS = `
@page { size: A4; }
html { font-size: 10.5pt; color: #0d1826; }
body { margin: 0; line-height: 1.55; }
main { orphans: 3; widows: 3; }
.cover { display: flex; flex-direction: column; min-height: 240mm; break-after: page; }
.brand { display: flex; align-items: center; gap: 8pt; font-family: "Space Grotesk Variable", "Vazirmatn Variable", "Segoe UI", sans-serif; font-weight: 600; font-size: 12pt; }
.brand img { width: 22pt; height: 22pt; border-radius: 5pt; }
.eyebrow { margin: 42pt 0 8pt; font-family: Consolas, "Cascadia Code", Menlo, monospace, "Vazirmatn Variable"; font-size: 8.5pt; letter-spacing: 0.16em; text-transform: uppercase; color: #5b6a80; }
.rule { height: 1px; background: #dde5ee; margin: 0 0 18pt; }
h1 { margin: 0 0 14pt; font-family: "Space Grotesk Variable", "Vazirmatn Variable", "Segoe UI", sans-serif; font-weight: 700; font-size: 30pt; line-height: 1.08; letter-spacing: -0.02em; }
.lede { max-width: 120mm; font-size: 12pt; color: #4d5f78; margin: 0 0 20pt; }
.meta { font-family: Consolas, "Cascadia Code", Menlo, monospace, "Vazirmatn Variable"; font-size: 8.5pt; color: #5b6a80; letter-spacing: 0.04em; margin: 0; }
.meta bdi { unicode-bidi: isolate; }
.toc { margin: auto 0 0; padding: 14pt 0 0; border-top: 1px solid #dde5ee; list-style: none; columns: 2; column-gap: 12mm; font-size: 9.5pt; color: #4d5f78; }
.toc li { break-inside: avoid; padding: 2pt 0; }
h2 { margin: 22pt 0 8pt; font-family: "Space Grotesk Variable", "Vazirmatn Variable", "Segoe UI", sans-serif; font-weight: 700; font-size: 16pt; line-height: 1.2; letter-spacing: -0.01em; break-after: avoid; }
h3 { margin: 16pt 0 6pt; font-weight: 600; font-size: 12pt; break-after: avoid; }
h4 { margin: 12pt 0 4pt; font-weight: 600; font-size: 10.5pt; break-after: avoid; }
p { margin: 0 0 8pt; }
ul, ol { margin: 0 0 8pt; padding-inline-start: 1.4em; }
li { margin: 0 0 4pt; }
strong { font-weight: 600; }
blockquote { margin: 0 0 8pt; padding-inline-start: 10pt; border-inline-start: 3px solid #dde5ee; color: #4d5f78; }
hr { border: 0; height: 1px; background: #dde5ee; margin: 14pt 0; }
code { font-family: Consolas, "Cascadia Code", "SF Mono", Menlo, monospace, "Vazirmatn Variable"; font-size: 0.9em; direction: ltr; unicode-bidi: isolate; background: #f0f4f8; border-radius: 3px; padding: 0 3px; }
pre { direction: ltr; text-align: left; margin: 0 0 10pt; padding: 8pt 10pt; background: #f0f4f8; border: 1px solid #dde5ee; border-radius: 4px; font-size: 8.5pt; line-height: 1.45; white-space: pre-wrap; overflow-wrap: anywhere; break-inside: avoid; }
pre code { background: none; padding: 0; font-size: inherit; }
a { color: #0e9384; text-decoration: none; }
/* Paper cannot be clicked: every link prints its address. The document's links are all in the
   references, where that is what a reader wants to see. */
a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 0.85em; color: #5b6a80; unicode-bidi: isolate; direction: ltr; }
a[href^="/"]::after { content: " (${ DEFAULT_SITE_URL }" attr(href) ")"; font-size: 0.85em; color: #5b6a80; unicode-bidi: isolate; direction: ltr; }
img { max-width: 100%; }
`;

/** The running footer: the address, the revision and the page count, in Latin on every page. */
const footer = (revision: string): string =>
    '<div style="width:100%;box-sizing:border-box;padding:0 18mm;display:flex;justify-content:space-between;'
    + 'direction:ltr;font-family:Consolas,Menlo,monospace;font-size:7.5px;color:#5b6a80;letter-spacing:0.04em">'
    + `<span>${ attr(DEFAULT_SITE_URL.replace(/^https?:\/\//, '')) }/whitepaper · ${ attr(revision) }</span>`
    + '<span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>';

interface Page
{
    locale: PostLocale;
    title: string;
    summary: string;
    body: string;
}

/** The whole document for one language, as the markup Chromium prints. */
function document(page: Page, strings: Strings, fonts: string, revision: string, updatedAt: string): string
{
    const dir = directionOf(page.locale);
    const article = renderArticle(page.body);
    const date = new Intl.DateTimeFormat(page.locale, { dateStyle: 'long' }).format(new Date(updatedAt));
    // The contents list is the document's own h2s, already escaped by the renderer.
    const sections = [...article.matchAll(/<h2>(.*?)<\/h2>/gu)].map((match) => `<li>${ match[1] ?? '' }</li>`).join('');
    const lineHeight = LINE_HEIGHT[page.locale] === undefined ? '' : `body { line-height: ${ LINE_HEIGHT[page.locale] }; }`;

    return `<!doctype html>
<html lang="${ attr(page.locale) }" dir="${ dir }">
<head>
<meta charset="utf-8">
<title>${ attr(page.title) }</title>
<style>
${ fonts }
${ PRINT_CSS }
body { font-family: ${ BODY_FONT[page.locale] }; }
${ lineHeight }
</style>
</head>
<body>
<section class="cover">
    <div class="brand"><img src="${ pathToFileURL(ICON).href }" alt=""><span>${ attr(strings.brand) }</span></div>
    <p class="eyebrow">${ attr(strings.nav.whitepaper) }</p>
    <div class="rule"></div>
    <h1>${ attr(page.title) }</h1>
    <p class="lede">${ attr(page.summary) }</p>
    <p class="meta"><bdi dir="ltr">${ attr(strings.whitepaper.revision) } ${ attr(revision) }</bdi> · <bdi>${ attr(date) }</bdi> · <bdi dir="ltr">${ attr(DEFAULT_SITE_URL) }/whitepaper</bdi></p>
    <ol class="toc">${ sections }</ol>
</section>
<main>${ article }</main>
</body>
</html>
`;
}

async function main(): Promise<void>
{
    const content = loadWhitepaper();
    const fonts = await fontFaces();
    const scratch = await mkdtemp(join(tmpdir(), 'nura-whitepaper-'));
    const manifest: PdfManifest = { revision: content.revision, generatedAt: new Date().toISOString(), sha256: {} };

    await mkdir(PDF_DIR, { recursive: true });

    const browser = await chromium.launch();

    try
    {
        for (const row of content.translations)
        {
            const strings = (await import(pathToFileURL(join(I18N, `${ row.locale }.ts`)).href) as Record<string, Strings>)[row.locale];

            if (strings === undefined)
            {
                throw new Error(`No string table for ${ row.locale }.`);
            }

            const source = join(scratch, `${ row.locale }.html`);
            const target = join(PDF_DIR, pdfFileFor(row.locale));

            await writeFile(source, document(row, strings, fonts, content.revision, content.updatedAt), 'utf8');

            const page = await browser.newPage();

            // A file url, not `setContent`: the fonts and the icon are file urls too, and a page
            // with no origin of its own is not allowed to read them.
            await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
            await page.evaluate(() => document.fonts.ready);
            await page.pdf({
                path: target,
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', right: '18mm', bottom: '22mm', left: '18mm' },
                displayHeaderFooter: true,
                headerTemplate: '<span></span>',
                footerTemplate: footer(content.revision)
            });
            await page.close();

            manifest.sha256[row.locale] = bodyHash(row.body);

            const { size } = await import('node:fs').then((fs) => fs.statSync(target));

            console.log(`${ pdfFileFor(row.locale).padEnd(34) } ${ Math.round(size / 1024) } KB`);
        }
    }
    finally
    {
        await browser.close();
        await rm(scratch, { recursive: true, force: true });
    }

    await writeFile(MANIFEST, `${ JSON.stringify(manifest, null, 4) }\n`, 'utf8');

    console.log(`\n${ content.translations.length } PDFs in ${ PDF_DIR }, manifest at ${ MANIFEST }`);
}

await main();
