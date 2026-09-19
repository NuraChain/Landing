// The head a crawler and a link preview actually read, declared by the page that owns it.
//
// This used to be the server's job: it rendered a page, then rewrote the finished document's
// `<head>` by string surgery, from a table of paths it kept in its own half. That worked and
// it had two costs. A client-side navigation changed nothing, because no server was involved -
// so the title in a reader's tab belonged to whichever page they had landed on first. And the
// facts lived a long way from the page that knew them: a post's title was resolved twice, once
// to render and once to describe.
//
// `useHead` puts them together. Declared during the render, the values are serialized into the
// served document by the kit - which replaces the shell's own title, description and robots by
// KEY, so a document still carries exactly one of each - and on the client the same
// declaration is applied to the live head and rolled back when the page is left.
//
// Getters, not values: on the client they stay live, so a title derived from a loader updates
// when the data lands. On the server they resolve once, during the render, with the loader's
// data already in hand.
import { useHead, useLocale as useDocumentLocale } from 'azerothjs';
import type { HeadMeta } from 'azerothjs';

import { NETWORK_NAME, SITE_URL } from './content/site';
import type { Locale } from '../stores/locale';

/**
 * BCP 47 territory subtags for `og:locale`, which insists on `language_TERRITORY` and
 * ignores a bare language. Facebook's parser is the strict one; the rest follow it.
 */
const TERRITORY: Record<Locale, string> = {
    en: 'en_US', fa: 'fa_IR', ar: 'ar_AR', es: 'es_ES', pt: 'pt_BR',
    hi: 'hi_IN', zh: 'zh_CN', ru: 'ru_RU', fr: 'fr_FR', tr: 'tr_TR'
};

/**
 * The card a shared link renders as, for every page with no picture of its own.
 *
 * 1200x630 because every card layout in use lays out at ~1.91:1 and crops or letterboxes
 * anything else - `/icon.png` did this job at 512 square and was pillarboxed or cut off
 * depending on the client, and below 600px wide X drops the preview to its text-only form.
 * The file is DERIVED and committed: `npm run og:image` renders it from the site's own tokens.
 */
export const SOCIAL_IMAGE = {
    url: `${ SITE_URL }/og-image.png`,
    alt: NETWORK_NAME,
    width: 1200,
    height: 630
} as const;

/** One picture a page can name for itself, or the site card. */
export interface HeadImage
{
    url: string;
    alt: string;
    /** Stated only where they are known: a committed cover is whatever shape somebody committed. */
    width?: number;
    height?: number;
}

/** The publisher every schema points at. There is no author system, so it is also the author. */
export const organization = (): Record<string, unknown> => ({
    '@type': 'Organization',
    name: NETWORK_NAME,
    url: SITE_URL,
    // The square mark genuinely belongs here, where a logo is what is being described.
    logo: { '@type': 'ImageObject', url: `${ SITE_URL }/icon.png` }
});

/** Home > Blog > this post. Positions are 1-based; a 0 quietly invalidates the whole list. */
export const breadcrumbs = (trail: Array<{ name: string; url: string }>): Record<string, unknown> => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: step.name,
        item: step.url
    }))
});

/** Meta descriptions are truncated by every engine around here; cutting on a word is tidier. */
const DESCRIPTION_LIMIT = 160;

/**
 * A description for a document that carries no summary of its own.
 *
 * The schema allows an empty summary, and the alternative to this is emitting raw markdown
 * into a search result.
 */
export function excerpt(body: string): string
{
    const flat = body
        .replace(/```[\s\S]*?```/gu, ' ')
        .replace(/^\s*[#>-]+\s*/gmu, ' ')
        .replace(/!\[[^\]]*\]\([^)]*\)/gu, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/gu, '$1')
        .replace(/[*_`]/gu, '')
        .replace(/\s+/gu, ' ')
        .trim();

    if (flat.length <= DESCRIPTION_LIMIT)
    {
        return flat;
    }

    const cut = flat.slice(0, DESCRIPTION_LIMIT);
    const lastSpace = cut.lastIndexOf(' ');

    return `${ (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd() }…`;
}

/** What one page declares about itself. */
export interface PageHead
{
    /** Always a real title: a getter that can answer `''` writes an EMPTY `<title>`, which is worse than the shell's. */
    title: () => string;
    description: () => string;

    /** The canonical PATH (`/blog/x`); the origin is {@link SITE_URL}. */
    path: string;

    type: 'website' | 'article';

    /** Only a page that wants something other than the site default states one. */
    robots?: string;

    /**
     * The language of the CONTENT, when it differs from the reader's.
     *
     * A post is written in one language and may be read by someone using another: `og:locale`
     * names the language the words are in. Defaults to the reader's, which is right for every
     * page whose copy comes from the string tables.
     */
    locale?: () => Locale;

    /** Every other language this same url can be read in - true, because the switcher is client-side. */
    alternates?: () => Locale[];

    article?: () => { publishedTime: string | null; modifiedTime: string; tags: string[] } | null;

    /** A document's own cover, when it has one. The site card otherwise. */
    image?: () => HeadImage | null;

    jsonLd: () => Record<string, unknown>[];
}

/**
 * Declares one page's head: title, description, canonical, Open Graph, Twitter, JSON-LD.
 *
 * Open Graph and the Twitter card are BOTH emitted and they disagree about naming on purpose:
 * `og:` uses `property`, `twitter:` uses `name`, and a parser looking for one ignores the
 * other. Getting that backwards is the most common way a link preview silently renders blank.
 */
export function pageHead(head: PageHead): void
{
    const reader = useDocumentLocale();
    const locale = (): Locale => head.locale?.() ?? (reader() as Locale);
    const canonical = `${ SITE_URL }${ head.path }`;
    const image = (): HeadImage => head.image?.() ?? SOCIAL_IMAGE;

    const meta: HeadMeta[] = [
        { name: 'description', content: head.description },
        /*
         * Stated, not omitted. A crawler reads an absent directive as `index, follow` already,
         * so this is not about the crawler - it is about an auditor reading the served markup
         * being able to tell "deliberately indexable" from "nobody thought about it". The kit
         * replaces the shell's line by key, so a document still carries exactly one.
         */
        { name: 'robots', content: head.robots ?? 'index, follow' },

        { property: 'og:type', content: head.type },
        { property: 'og:title', content: head.title },
        { property: 'og:description', content: head.description },
        { property: 'og:url', content: canonical },
        { property: 'og:site_name', content: NETWORK_NAME },
        { property: 'og:locale', content: () => TERRITORY[locale()] },

        { property: 'og:image', content: () => image().url },
        { property: 'og:image:alt', content: () => image().alt },

        // Every page has a picture - its own or the site card - so the card is always the
        // large one. Declaring `summary_large_image` with no image is what renders an empty
        // grey box in a preview, which looks more broken than a plain text card.
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: () => image().url },
        // Twitter reads its own alt and ignores og:image:alt, so the same string is said twice.
        { name: 'twitter:image:alt', content: () => image().alt },
        { name: 'twitter:title', content: head.title },
        { name: 'twitter:description', content: head.description }
    ];

    // Laid out from these numbers BEFORE the image finishes downloading, by Facebook, LinkedIn
    // and Slack: without them the first render of a shared link is a collapsed box.
    const sized = image();

    if (sized.width !== undefined && sized.height !== undefined)
    {
        meta.push(
            { property: 'og:image:width', content: String(sized.width) },
            { property: 'og:image:height', content: String(sized.height) });
    }

    /*
     * `og:locale:alternate` is honest here in a way `hreflang` would not be. It says "this
     * same document can also be read in these languages", which is exactly true - the
     * switcher is client-side and the url does not change. `hreflang` says "the same content
     * lives at THIS other url", and there is no other url to name.
     */
    for (const tag of head.alternates?.() ?? [])
    {
        if (tag !== locale())
        {
            meta.push({ property: 'og:locale:alternate', content: TERRITORY[tag] });
        }
    }

    const article = head.article?.() ?? null;

    if (article !== null)
    {
        if (article.publishedTime !== null)
        {
            meta.push({ property: 'article:published_time', content: article.publishedTime });
        }

        meta.push({ property: 'article:modified_time', content: article.modifiedTime });

        for (const tag of article.tags)
        {
            meta.push({ property: 'article:tag', content: tag });
        }
    }

    useHead({
        title: head.title,
        meta,
        links: [{ rel: 'canonical', href: canonical }],
        jsonLd: head.jsonLd
    });
}
