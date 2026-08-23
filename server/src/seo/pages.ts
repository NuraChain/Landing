/**
 * Which head each server-rendered page gets, and how it replaces the shell's.
 *
 * Only `/blog` and `/blog/:slug` are handled, and that is the whole intended scope: those are
 * the two routes `routes.ts` pins to `render: 'server'`, so they are the only ones whose HTML
 * this process ever composes. The landing pages are `render: 'client'` - the kit serves them the
 * shell untouched, index.html's own title and description stand, and nothing here can disturb
 * SEO that already works.
 */
import { toDetail } from '../blog/present.ts';
import type { BlogContent } from '../blog/content.ts';
import type { PostDetail } from '../schemas.ts';

import { directionOf, renderMeta, type PageMeta } from './meta.ts';

/** The blog index's own copy. Not a chain fact, so it lives with the markup that states it. */
const BLOG_TITLE = 'Blog — Nura Chain';
const BLOG_DESCRIPTION
    = 'Guides and technical writing on Nura Chain: the EVM network, its RPC endpoint, the block '
    + 'explorer, smart contract deployment and the tools developers build with.';

/** Meta descriptions are truncated by every engine around here; cutting on a word is tidier. */
const DESCRIPTION_LIMIT = 160;

/**
 * A description from a post that has no summary.
 *
 * Never reached by a post written through the dashboard with the summary filled in, which is
 * every post the seed script publishes - but a summary is allowed to be empty by the schema, and
 * the alternative to this is emitting raw markdown into a search result.
 */
export function excerpt(body: string): string
{
    const flat = body
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/^\s*[#>-]+\s*/gm, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (flat.length <= DESCRIPTION_LIMIT)
    {
        return flat;
    }

    const cut = flat.slice(0, DESCRIPTION_LIMIT);
    const lastSpace = cut.lastIndexOf(' ');

    return `${ (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() }…`;
}

/** The publisher every schema below points at. There is no author system, so it is also the author. */
const organization = (siteUrl: string): Record<string, unknown> => ({
    '@type': 'Organization',
    name: 'Nura Chain',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${ siteUrl }/icon.png` }
});

/** Home > Blog > this post. Positions are 1-based; a 0 quietly invalidates the whole list. */
const breadcrumbs = (trail: Array<{ name: string; url: string }>): Record<string, unknown> => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: step.name,
        item: step.url
    }))
});

export interface SeoDeps
{
    store: BlogContent;
    /** The canonical origin, no trailing slash - every absolute url below is built from it. */
    siteUrl: string;
}

/** One post address. Shared by `metaFor` and `isMissingPost` so they cannot disagree. */
const POST_PATH = /^\/blog\/([^/]+)$/;

/** The path a url identifies, with the query dropped and any trailing slash normalised away. */
const pathOf = (url: string, siteUrl: string): string =>
    new URL(url, siteUrl).pathname.replace(/\/+$/, '') || '/';

/**
 * One post address. Shared by every lookup below so they cannot disagree.
 *
 * The WHATWG url parser leaves a lone `%` exactly where it is - `/blog/%` keeps its bare
 * percent through `new URL(...)` - so what this captures can still fail to decode.
 */
const postPathOf = (url: string, siteUrl: string): string | null =>
    POST_PATH.exec(pathOf(url, siteUrl))?.[1] ?? null;

/**
 * Decodes a captured slug, or null when the escape sequence is malformed.
 *
 * `decodeURIComponent('%')` - any truncated escape - throws a URIError, and unguarded a
 * mistyped address would turn into a 500 thrown from inside the renderer rather than the
 * miss the callers below already know how to answer.
 */
const decodeSlug = (raw: string): string | null =>
{
    try
    {
        return decodeURIComponent(raw);
    }
    catch
    {
        return null;
    }
};

/**
 * The meta for one url, or null when this module has nothing to say about it.
 *
 * Null is the important arm: it means "leave the shell exactly as it was", which is what any
 * path other than the two blog routes gets. A miss here must never blank a page's existing head.
 */
export function metaFor(url: string, deps: SeoDeps): PageMeta | null
{
    const { store, siteUrl } = deps;

    // The renderer is handed a url that may carry the blog's `?page=` / `?tag=` query. The path
    // is what identifies the page; the query only ever narrows a list.
    const path = pathOf(url, siteUrl);

    if (path === '/blog')
    {
        return {
            title: BLOG_TITLE,
            description: BLOG_DESCRIPTION,
            canonical: `${ siteUrl }/blog`,
            locale: 'en',
            alternateLocales: [],
            image: null,
            imageAlt: '',
            type: 'website',
            jsonLd: [
                {
                    '@context': 'https://schema.org',
                    '@type': 'Blog',
                    name: BLOG_TITLE,
                    description: BLOG_DESCRIPTION,
                    url: `${ siteUrl }/blog`,
                    publisher: organization(siteUrl)
                },
                breadcrumbs([
                    { name: 'Home', url: `${ siteUrl }/` },
                    { name: 'Blog', url: `${ siteUrl }/blog` }
                ])
            ]
        };
    }

    const match = postPathOf(url, siteUrl);
    const slug = match === null ? null : decodeSlug(match);
    const stored = slug === null ? null : store.bySlug(slug);

    // A slug nobody has published renders the app's own not-found state, and that page has
    // nothing to describe - the shell's default title is the right thing to leave in place.
    if (stored === null)
    {
        return null;
    }

    /*
     * Resolved against the post's OWN default language rather than a reader's.
     *
     * `renderPage` is called with a url and a shell and no request headers, so there is no
     * reader here to resolve against - see the note at the top of meta.ts. The post's authored
     * language is the one stable answer, and it is what the served `<html lang>` will say.
     */
    const detail = toDetail(stored, stored.post.defaultLocale);

    if (detail === null)
    {
        return null;
    }

    const canonical = `${ siteUrl }/blog/${ detail.slug }`;
    const description = detail.summary.trim() === '' ? excerpt(detail.body) : detail.summary;
    // The schema stores a path under the app's own public/, never a remote url - so an absolute
    // one is built here rather than trusted from the row.
    const image = detail.coverImage === null ? null : `${ siteUrl }${ detail.coverImage }`;

    return {
        title: `${ detail.title } — Nura Chain`,
        description,
        canonical,
        locale: detail.locale,
        alternateLocales: detail.available,
        image,
        imageAlt: detail.title,
        type: 'article',
        article: {
            publishedTime: detail.publishedAt,
            modifiedTime: detail.updatedAt,
            tags: detail.tags
        },
        jsonLd: [
            {
                '@context': 'https://schema.org',
                '@type': 'BlogPosting',
                headline: detail.title,
                description,
                inLanguage: detail.locale,
                // Every language the same url can be read in. True because the switcher is
                // client-side; see the og:locale:alternate note in meta.ts.
                availableLanguage: detail.available,
                datePublished: detail.publishedAt ?? undefined,
                dateModified: detail.updatedAt,
                keywords: detail.tags.join(', '),
                url: canonical,
                mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
                ...(image === null ? {} : { image: [image] }),
                // No author system exists, and inventing a byline would be a fabricated
                // credential in a field search engines read as one. The organization publishes.
                author: organization(siteUrl),
                publisher: organization(siteUrl)
            },
            breadcrumbs([
                { name: 'Home', url: `${ siteUrl }/` },
                { name: 'Blog', url: `${ siteUrl }/blog` },
                { name: detail.title, url: canonical }
            ])
        ]
    };
}

/**
 * Whether this url is a post address that resolves to nothing.
 *
 * Distinguished from "not a post address at all", which is what `/`, `/about` and `/blog` are:
 * those keep the shell's head AND the kit's status, and nothing here should touch them.
 *
 * The distinction exists to fix a SOFT 404. Before this, `/blog/anything` rendered the app's
 * not-found state with a 200 and the shell's generic title, which is a page a search engine
 * will happily index as real content - and a mistyped or expired link becomes a duplicate of
 * the home page in the index. A 404 says the one true thing about that url.
 */
export function isMissingPost(url: string, deps: SeoDeps): boolean
{
    const match = postPathOf(url, deps.siteUrl);

    if (match === null)
    {
        return false;
    }

    const slug = decodeSlug(match);

    // An undecodable slug resolves to nothing by construction - that IS a missing post,
    // not a non-post address.
    return slug === null ? true : deps.store.bySlug(slug) === null;
}

const TITLE = /[ \t]*<title>[\s\S]*?<\/title>[ \t]*\r?\n?/i;
/*
 * Each pattern above eats the line's own indentation and its trailing newline, so removing a
 * tag removes the whole line rather than leaving a blank one behind in served markup.
 */
const DESCRIPTION = /[ \t]*<meta\s+name="description"[^>]*>[ \t]*\r?\n?/i;
const HTML_OPEN = /<html\b[^>]*>/i;

/**
 * Rewrites the shell's head with this page's.
 *
 * Every `replace` takes a FUNCTION rather than a string. A replacement string reads `$&`, `$1`
 * and friends as references, and these values are post titles somebody typed - a title
 * containing `$&` would otherwise inject the matched tag back into the document.
 */
export function injectMeta(html: string, meta: PageMeta): string
{
    const head = renderMeta(meta);
    const lang = meta.locale;
    const dir = directionOf(lang);

    return html
        // Dropped rather than left in place: two titles in one document is undefined behaviour
        // that every parser resolves differently, and the shell's is the generic one.
        .replace(TITLE, () => '')
        .replace(DESCRIPTION, () => '')
        /*
         * The served document declares the post's own language. The pre-paint script in
         * index.html overwrites both attributes from localStorage a moment later, so a visitor
         * still gets their chosen language - but a crawler, which runs no script, reads the
         * language the post was actually written in instead of a hard-coded `en`.
         */
        .replace(HTML_OPEN, () => `<html lang="${ lang }" dir="${ dir }">`)
        .replace('</head>', () => `    ${ head }\n    </head>`);
}

/**
 * The post one url serves, in the language it was authored in - or null for anything else.
 *
 * Split out of `metaFor` so the BODY can be rendered from the same resolution the HEAD was: a
 * page whose `<title>` names one article and whose text is another is worse than either alone.
 * Same reasoning as the head, too - the renderer sees a url and a shell and no request headers,
 * so there is no reader to resolve against and the post's own default language is what a
 * crawler is served.
 */
export function postFor(url: string, deps: SeoDeps): PostDetail | null
{
    const match = postPathOf(url, deps.siteUrl);
    const slug = match === null ? null : decodeSlug(match);

    if (slug === null)
    {
        return null;
    }

    const stored = deps.store.bySlug(slug);

    return stored === null ? null : toDetail(stored, stored.post.defaultLocale);
}
