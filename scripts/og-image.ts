// Renders the social preview card.
//
//   npm run og:image
//
// One file, application/public/og-image.png, at 1200x630 - the size and the 1.91:1 ratio
// Facebook, LinkedIn, Slack and X all lay their cards out at. `server/src/seo/pages.ts` names
// it as `og:image` for every page that has no picture of its own, which before this was
// /icon.png: a 512x512 square in a wide slot, pillarboxed or cropped depending on the reader's
// client, and small enough that X demoted the card to its text-only `summary` layout.
//
// Rendered rather than drawn, and from the site's OWN sources: the headline is the hero's
// string table entry, the figures are the constants in lib/content/site.ts, the palette is the
// dark theme's tokens and the face is the Space Grotesk the display headings are set in. A card
// that repeated any of those as a literal here would drift from the page it advertises.
//
// Chromium comes from Playwright, the same dev dependency `npm run qa:visual` and
// `npm run whitepaper:pdf` already drive, and never a runtime one. The output is committed:
// nothing on a deploy runs a browser.
import { readFile, writeFile } from 'node:fs/promises';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { chromium } from 'playwright';

import { CHAIN_ID, NATIVE_TOKEN_SYMBOL, RPC_URL } from '../application/src/lib/content/site.ts';
import { en } from '../application/src/lib/i18n/en.ts';
import { attr } from '../server/src/seo/meta.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DISPLAY_FACE = join(ROOT, 'node_modules', '@fontsource-variable', 'space-grotesk');
const ICON = join(ROOT, 'application', 'public', 'icon.png');
const TARGET = join(ROOT, 'application', 'public', 'og-image.png');

/** The card's pixel size. Both numbers are repeated in `SOCIAL_IMAGE` in seo/pages.ts. */
const WIDTH = 1200;
const HEIGHT = 630;

/**
 * The display face, addressed by file url so Chromium embeds it rather than reaching the net.
 *
 * Read from the package's own stylesheet for the same reason the whitepaper script does:
 * the per-script `unicode-range` in it is what makes the subsets one family. This card is
 * English-only - there is one og:image for ten languages, because there is one url per page -
 * so only the Latin face is needed.
 */
async function displayFace(): Promise<string>
{
    const css = await readFile(join(DISPLAY_FACE, 'index.css'), 'utf8');

    return css.replaceAll('url(./files/', `url(${ pathToFileURL(join(DISPLAY_FACE, 'files')).href }/`);
}

/**
 * The card, as markup.
 *
 * Laid out at exactly WIDTH x HEIGHT with no scrollbar and no scaling, so the screenshot is
 * the layout rather than a crop of it. The safe area is generous on purpose: Slack and X both
 * round the corners and some clients trim a few percent from every edge.
 */
const card = (fonts: string): string => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
${ fonts }

*, *::before, *::after { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

body
{
    width: ${ WIDTH }px;
    height: ${ HEIGHT }px;
    overflow: hidden;
    /* The dark theme's tokens, as literals: this is a static image, so there is no runtime
       variable to point at. They are --bg, --ink, --muted, --line-strong and --accent. */
    background: #070b12;
    color: #e6edf7;
    font-family: "Space Grotesk Variable", "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
}

/* The blueprint grid the hero draws, at the same 48px pitch, and the accent glow above it. */
.sheet
{
    position: relative;
    width: 100%;
    height: 100%;
    padding: 64px 72px;
    display: flex;
    flex-direction: column;
    background-image:
        radial-gradient(70% 70% at 50% 0%, rgb(42 212 184 / 0.16), transparent 70%),
        linear-gradient(to right, #1d2839 1px, transparent 1px),
        linear-gradient(to bottom, #1d2839 1px, transparent 1px);
    background-size: 100% 100%, 48px 48px, 48px 48px;
}

/* The brand, top-left, the way the header sets it. */
.brand { display: flex; align-items: center; gap: 14px; font-size: 26px; font-weight: 600; letter-spacing: -0.01em; }
/* The mark carries its own near-black plate, which reads as a hole against --bg unless the
   edge is declared; the border makes it a tile instead. Square, like everything else here. */
.brand img { width: 44px; height: 44px; border: 1px solid #2a3850; }

h1
{
    margin: auto 0 0;
    max-width: 15ch;
    font-size: 88px;
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.035em;
}

.lede { margin: 24px 0 0; max-width: 46ch; font-size: 25px; line-height: 1.45; color: #97a6bd; font-weight: 400; }

/* The ticker's grammar: a monospace run of chain facts along the bottom edge, above a rule. */
.facts
{
    margin: 44px 0 0;
    padding: 22px 0 0;
    border-top: 1px solid #2a3850;
    display: flex;
    gap: 32px;
    align-items: center;
    font-family: Consolas, "Cascadia Code", "SF Mono", Menlo, monospace;
    font-size: 20px;
    letter-spacing: 0.04em;
    color: #97a6bd;
}

.facts b { color: #2ad4b8; font-weight: 600; }
.facts .sep { color: #2a3850; }
</style>
</head>
<body>
<div class="sheet">
    <div class="brand"><img src="${ pathToFileURL(ICON).href }" alt=""><span>${ attr(en.brand) }</span></div>
    <h1>${ attr(en.hero.headline) }</h1>
    <p class="lede">${ attr(en.hero.subhead) }</p>
    <div class="facts">
        <span>CHAIN ID <b>${ attr(String(CHAIN_ID)) }</b></span>
        <span class="sep">/</span>
        <span><b>${ attr(NATIVE_TOKEN_SYMBOL) }</b></span>
        <span class="sep">/</span>
        <span>${ attr(RPC_URL.replace(/^https?:\/\//, '')) }</span>
    </div>
</div>
</body>
</html>
`;

async function main(): Promise<void>
{
    const fonts = await displayFace();
    const scratch = await mkdtemp(join(tmpdir(), 'nura-og-'));
    const source = join(scratch, 'card.html');

    await writeFile(source, card(fonts), 'utf8');

    const browser = await chromium.launch();

    try
    {
        // deviceScaleFactor 1: the viewport IS the output size, so nothing is resampled.
        const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT }, deviceScaleFactor: 1 });

        // A file url, not `setContent`: the face and the icon are file urls too, and a page
        // with no origin of its own is not allowed to read them.
        await page.goto(pathToFileURL(source).href, { waitUntil: 'load' });
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: TARGET, type: 'png' });
        await page.close();
    }
    finally
    {
        await browser.close();
        await rm(scratch, { recursive: true, force: true });
    }

    const { size } = await import('node:fs').then((fs) => fs.statSync(TARGET));

    console.log(`og-image.png  ${ WIDTH }x${ HEIGHT }  ${ Math.round(size / 1024) } KB  ->  ${ TARGET }`);
}

await main();
