/**
 * The head a crawler and a link preview actually read.
 *
 * The kit splices `<div id="root">` and the loader handoff into the built shell and leaves
 * `<head>` exactly as index.html declared it - so without this module every post on the site
 * shares one title and one description, which are the two fields a search result is built from.
 *
 * `PageRenderer` hands back the whole document as a string, so the head can be rewritten after
 * the render without the kit growing an API for it and without a single route moving. That is
 * the entire trick, and it is why this lives in the server half rather than in a component:
 * a `<title>` set during hydration is set after the crawler has already read the one it was
 * served, and never appears in a link preview at all.
 *
 * WHICH LANGUAGE. The renderer is called with a url and a shell and no request headers, so
 * there is no reader whose language could be resolved here - the same limitation `routes.ts`
 * describes. The meta is therefore written in the post's OWN default locale, which is the
 * language the post was authored in and the one `stores/locale.ts` already assumes server-side.
 * One url, one declared language, no guessing.
 */
import type { PostLocale } from '../schemas.ts';

/** The languages that read right-to-left. Mirrors the set in the application's locale store. */
const RTL: ReadonlySet<string> = new Set(['fa', 'ar']);

/**
 * BCP 47 territory subtags for `og:locale`, which insists on `language_TERRITORY` and
 * ignores a bare language. Facebook's parser is the strict one; the rest follow it.
 */
const TERRITORY: Record<PostLocale, string> = {
    en: 'en_US', fa: 'fa_IR', ar: 'ar_AR', es: 'es_ES', pt: 'pt_BR',
    hi: 'hi_IN', zh: 'zh_CN', ru: 'ru_RU', fr: 'fr_FR', tr: 'tr_TR'
};

export interface ArticleMeta
{
    publishedTime: string | null;
    modifiedTime: string;
    tags: string[];
}

export interface PageMeta
{
    title: string;
    description: string;
    /** Absolute, self-referencing. There is one url per post, so there is one canonical. */
    canonical: string;
    locale: PostLocale;
    /** Every language this url can be read in - true here, because the switcher is client-side. */
    alternateLocales: PostLocale[];
    image: string | null;
    imageAlt: string;
    type: 'website' | 'article';
    /**
     * The `robots` directive, when the page wants one. Omitted for everything that should be
     * indexed - an absent tag and `index, follow` mean the same thing to a crawler, and the
     * absent one cannot be got wrong.
     */
    robots?: string;
    article?: ArticleMeta;
    jsonLd: unknown[];
}

/**
 * Escapes text for an HTML attribute value.
 *
 * Every field below is author-supplied - a post title, a summary somebody typed into the
 * dashboard - so it is escaped rather than trusted. The `'` matters as much as the `"`: these
 * values are interpolated into double-quoted attributes here, but a future edit that switches
 * quote style would otherwise turn an apostrophe in a title into an attribute break.
 */
export function attr(value: string): string
{
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/**
 * Escapes a JSON-LD payload for embedding in a `<script>`.
 *
 * An HTML parser ends a script element at the first `</script` in the text, whatever the
 * surrounding JSON thinks - so a post whose title contained that string would close the tag
 * early and put the rest of the payload into the document as markup. Rewriting the angle
 * brackets and the ampersand as their JSON unicode escapes is still valid JSON, parses back
 * to exactly the same string, and cannot terminate anything.
 */
export function ldJson(value: unknown): string
{
    return JSON.stringify(value)
        .replaceAll('<', '\\u003c')
        .replaceAll('>', '\\u003e')
        .replaceAll('&', '\\u0026');
}

/** One `<meta>` line, or nothing when the value is empty - an empty tag is worse than none. */
const tag = (kind: 'name' | 'property', key: string, value: string): string =>
    value === '' ? '' : `<meta ${ kind }="${ attr(key) }" content="${ attr(value) }"/>`;

/**
 * The head fragment for one page.
 *
 * Open Graph and the Twitter card are BOTH emitted and they disagree about naming on purpose:
 * `og:` uses `property`, `twitter:` uses `name`, and a parser looking for one ignores the other.
 * Getting that backwards is the most common way a link preview silently renders blank.
 */
export function renderMeta(meta: PageMeta): string
{
    const parts: string[] = [
        `<title>${ attr(meta.title) }</title>`,
        tag('name', 'description', meta.description),
        `<link rel="canonical" href="${ attr(meta.canonical) }"/>`,

        tag('property', 'og:type', meta.type),
        tag('property', 'og:title', meta.title),
        tag('property', 'og:description', meta.description),
        tag('property', 'og:url', meta.canonical),
        tag('property', 'og:site_name', 'Nura Chain'),
        tag('property', 'og:locale', TERRITORY[meta.locale])
    ];

    if (meta.robots !== undefined)
    {
        // Second in the document, right after <title>, so a crawler that stops reading the
        // head early has still seen it.
        parts.splice(1, 0, tag('name', 'robots', meta.robots));
    }

    /*
     * `og:locale:alternate` is honest here in a way `hreflang` would not be. It says "this same
     * document can also be read in these languages", which is exactly true - the switcher is
     * client-side and the url does not change. `hreflang` says "the same content lives at THIS
     * other url", and there is no other url to name, so it is omitted rather than pointed at
     * itself ten times. See the note in routes.ts about what per-locale SEO would actually cost.
     */
    for (const locale of meta.alternateLocales)
    {
        if (locale !== meta.locale)
        {
            parts.push(tag('property', 'og:locale:alternate', TERRITORY[locale]));
        }
    }

    if (meta.article !== undefined)
    {
        if (meta.article.publishedTime !== null)
        {
            parts.push(tag('property', 'article:published_time', meta.article.publishedTime));
        }

        parts.push(tag('property', 'article:modified_time', meta.article.modifiedTime));

        for (const item of meta.article.tags)
        {
            parts.push(tag('property', 'article:tag', item));
        }
    }

    if (meta.image !== null)
    {
        parts.push(tag('property', 'og:image', meta.image));
        parts.push(tag('property', 'og:image:alt', meta.imageAlt));
        parts.push(tag('name', 'twitter:card', 'summary_large_image'));
        parts.push(tag('name', 'twitter:image', meta.image));
    }
    else
    {
        // No image means no large-image card: declaring one and supplying nothing renders an
        // empty grey box in the preview, which looks more broken than a plain summary.
        parts.push(tag('name', 'twitter:card', 'summary'));
    }

    parts.push(tag('name', 'twitter:title', meta.title));
    parts.push(tag('name', 'twitter:description', meta.description));

    for (const entry of meta.jsonLd)
    {
        parts.push(`<script type="application/ld+json">${ ldJson(entry) }</script>`);
    }

    return parts.filter((part) => part !== '').join('\n        ');
}

/** The document language and direction, for the `<html>` element the shell already carries. */
export const directionOf = (locale: PostLocale): 'rtl' | 'ltr' => RTL.has(locale) ? 'rtl' : 'ltr';
