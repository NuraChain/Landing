import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { WHITEPAPER } from '../../content/whitepaper/whitepaper.ts';
import type { WhitepaperHead } from '../../content/whitepaper/types.ts';
import { inSiteOrder, pick } from '../blog/present.ts';
import { POST_LOCALES, type PostLocale, type WhitepaperDetail } from '../schemas.ts';

/**
 * The whitepaper, read from disk.
 *
 * One document in ten languages, served at `/whitepaper` and downloadable as a PDF per language.
 * It follows the blog's model rather than the string tables' because it IS an article - some
 * fifteen hundred words of markdown, written for a reader with no technical background - and
 * because the fallback policy the blog already has is exactly the one a reader whose language
 * is missing should get here too.
 *
 * Read ONCE, at construction, like the blog. Editing a body on a running server changes nothing
 * until it restarts, which is the deal the bundle already makes.
 *
 * THE PDFs ARE DERIVED, NOT AUTHORED. `scripts/whitepaper-pdf.ts` renders each `<locale>.md`
 * through the same markdown renderer the crawler is served and prints it with Chromium, into
 * `pdf/`, beside a `manifest.json` that records the hash of the markdown each file was rendered
 * from. That manifest is what lets `pdfStatus` say a PDF is STALE - the words on the page and the
 * words in the download must be the same words, and nothing else would notice them drifting.
 */

/** Where the bodies live, resolved from THIS file rather than from the working directory. */
const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'whitepaper');

/** The rendered PDFs, one per language. Served by app.ts under {@link PDF_ROUTE}. */
export const PDF_DIR = join(CONTENT_DIR, 'pdf');

/** Which markdown each PDF was rendered from. Beside the bodies, not in `pdf/`, so it is never served. */
const MANIFEST_PATH = join(CONTENT_DIR, 'manifest.json');

/**
 * The url prefix the PDFs are served under.
 *
 * The same path as the page on purpose: `/whitepaper` is the document and
 * `/whitepaper/<file>.pdf` is one rendering of it. The kit claims the exact page path and
 * `/*path`; a `/whitepaper/*path` route registered ahead of it is more specific than the
 * fallback and does not collide with the page.
 */
export const PDF_ROUTE = '/whitepaper';

export interface WhitepaperTranslation
{
    locale: PostLocale;
    title: string;
    summary: string;
    body: string;
}

/** The whole document, every language it holds, plus the head fields the wire carries through. */
export interface WhitepaperContent
{
    revision: string;
    publishedAt: string;
    updatedAt: string;
    defaultLocale: PostLocale;
    translations: WhitepaperTranslation[];
}

/**
 * The file name one language downloads as.
 *
 * Descriptive rather than `en.pdf`, because it is the name that lands in a reader's downloads
 * folder, where "en.pdf" beside forty other files means nothing.
 */
export const pdfFileFor = (locale: PostLocale): string => `nura-chain-whitepaper-${ locale }.pdf`;

/** The site-relative path one language's PDF is served at. */
export const pdfPathFor = (locale: PostLocale): string => `${ PDF_ROUTE }/${ pdfFileFor(locale) }`;

/** The fingerprint the manifest records for one body. Shared with the generator so the two agree. */
export const bodyHash = (body: string): string => createHash('sha256').update(body, 'utf8').digest('hex');

/**
 * Reads the document off disk, in every language the head declares.
 *
 * @throws If any declared language has no markdown behind it, or an empty file. Refusing to
 *   start is the point - see `blog/content.ts`. Every missing path is named at once.
 */
export function loadWhitepaper(head: WhitepaperHead = WHITEPAPER): WhitepaperContent
{
    const missing: string[] = [];
    const translations: WhitepaperTranslation[] = [];

    for (const locale of POST_LOCALES)
    {
        const path = join(CONTENT_DIR, `${ locale }.md`);
        let body: string;

        try
        {
            body = readFileSync(path, 'utf8').trim();
        }
        catch
        {
            missing.push(`${ locale }.md`);
            continue;
        }

        if (body === '')
        {
            missing.push(`${ locale }.md (empty)`);
            continue;
        }

        const { title, summary } = head.heads[locale];

        translations.push({ locale, title, summary, body });
    }

    if (missing.length > 0)
    {
        throw new Error(`Whitepaper content is incomplete - no file for:\n  ${ missing.join('\n  ') }`);
    }

    return {
        revision: head.revision,
        publishedAt: head.publishedAt,
        updatedAt: head.updatedAt,
        defaultLocale: head.defaultLocale,
        translations
    };
}

export interface PdfStatus
{
    /** Languages with no PDF on disk at all. A deploy with one of these serves a dead download. */
    missing: PostLocale[];
    /** Languages whose PDF was rendered from different markdown than the one now on disk. */
    stale: PostLocale[];
}

/** The manifest the generator writes. `sha256` is keyed by locale. */
export interface PdfManifest
{
    revision: string;
    generatedAt: string;
    sha256: Partial<Record<PostLocale, string>>;
}

/**
 * Whether every language's PDF exists and was rendered from the markdown now on disk.
 *
 * `main.ts` refuses to boot over a MISSING one and only logs a stale one: a download that opens
 * an older revision is a bug, a download that 404s is a broken site. The suite fails on either,
 * which is what turns "remember to re-run the generator" into something nobody has to remember.
 */
export function pdfStatus(content: WhitepaperContent, dir: string = PDF_DIR, manifestPath: string = MANIFEST_PATH): PdfStatus
{
    let manifest: PdfManifest | null = null;

    try
    {
        manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PdfManifest;
    }
    catch
    {
        // No manifest means nothing was ever generated: every PDF that exists is of unknown
        // provenance, which is reported as stale rather than trusted.
    }

    const missing: PostLocale[] = [];
    const stale: PostLocale[] = [];

    for (const row of content.translations)
    {
        if (!existsSync(join(dir, pdfFileFor(row.locale))))
        {
            missing.push(row.locale);
            continue;
        }

        if (manifest?.sha256[row.locale] !== bodyHash(row.body) || manifest.revision !== content.revision)
        {
            stale.push(row.locale);
        }
    }

    return { missing, stale };
}

/**
 * The document as one reader sees it - the blog's fallback policy, applied to one post.
 *
 * `pdf` names the PDF in the language SERVED, not the one asked for: a reader shown the English
 * fallback downloads the English file, so the page and the download can never disagree.
 */
export function toWhitepaper(content: WhitepaperContent, wanted: PostLocale): WhitepaperDetail | null
{
    const chosen = pick(content.translations, content.defaultLocale, wanted);

    if (chosen === null)
    {
        return null;
    }

    return {
        revision: content.revision,
        publishedAt: content.publishedAt,
        updatedAt: content.updatedAt,

        locale: chosen.locale,
        requestedLocale: wanted,
        translated: chosen.locale === wanted,
        available: inSiteOrder(content.translations.map((row) => row.locale)),

        title: chosen.title,
        summary: chosen.summary,
        body: chosen.body,
        pdf: pdfPathFor(chosen.locale)
    };
}
