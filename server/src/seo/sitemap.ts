/**
 * The sitemap, generated from the store rather than written by hand.
 *
 * A static file would be a second list of posts to keep in step with the first, and the failure
 * is silent in the direction that matters: a post published and not added here is simply never
 * crawled. Reading the store means publishing IS listing, with nothing to remember.
 */
import type { BlogContent } from '../blog/content.ts';

/**
 * How many rows one store read pulls back while walking the posts.
 *
 * The whole table would fit in one query today, but "today" is the assumption that turns into a
 * truncated sitemap later - the same way the dashboard's old hard `limit: 200` made the 201st
 * post invisible. Paging costs one extra query per 500 posts and cannot silently cut off.
 */
const CHUNK = 500;

/**
 * The static routes worth crawling.
 *
 * `/about` is deliberately absent while it still renders the starter template: `seo/pages.ts`
 * serves it `noindex`, and a sitemap is a request TO index. Listing a url and then telling the
 * crawler to drop it is a contradiction reported as a sitemap error rather than quietly
 * obeyed. Both come back together the day the page has real copy.
 */
const STATIC: ReadonlyArray<{ path: string; priority: string; frequency: string }> = [
    { path: '/', priority: '1.0', frequency: 'weekly' },
    { path: '/blog', priority: '0.8', frequency: 'daily' }
];

/**
 * Escapes a url for XML text.
 *
 * Slugs are `[a-z0-9-]` by schema so none of this can currently fire, but a sitemap is served
 * to a parser that rejects the whole document on one stray character - and the cost of being
 * wrong is every url in it going uncrawled, not just the offending one.
 */
function xml(value: string): string
{
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
}

interface Entry
{
    loc: string;
    lastmod?: string;
    changefreq: string;
    priority: string;
}

const entry = (item: Entry): string =>
{
    const lastmod = item.lastmod === undefined ? '' : `\n        <lastmod>${ xml(item.lastmod) }</lastmod>`;

    return `    <url>
        <loc>${ xml(item.loc) }</loc>${ lastmod }
        <changefreq>${ item.changefreq }</changefreq>
        <priority>${ item.priority }</priority>
    </url>`;
};

/**
 * The whole sitemap as one document.
 *
 * Only PUBLISHED posts: `store.list` cannot reach a draft at all, so
 * there is no arrangement of this function that leaks one to a crawler.
 *
 * No `hreflang` alternates. The site keeps the reader's language in a store rather than in the
 * url, so a post has exactly one address and there is no alternate to name - see the note in
 * routes.ts about what changing that would cost. Ten `xhtml:link` entries all pointing at the
 * same url would be a claim that ten pages exist where one does.
 */
export function buildSitemap(store: BlogContent, siteUrl: string): string
{
    const entries: string[] = STATIC.map((route) => entry({
        loc: `${ siteUrl }${ route.path === '/' ? '/' : route.path }`,
        changefreq: route.frequency,
        priority: route.priority
    }));

    for (let offset = 0; ; offset += CHUNK)
    {
        const { rows, total } = store.list({ limit: CHUNK, offset });

        for (const { post } of rows)
        {
            entries.push(entry({
                loc: `${ siteUrl }/blog/${ post.slug }`,
                // The post's own last edit, in any language: a translation landing IS a change
                // to what this url serves, and `updatedAt` already moves when one does -
                // it is declared per article, so a revision that forgets it goes uncrawled.
                lastmod: post.updatedAt,
                changefreq: 'monthly',
                priority: '0.7'
            }));
        }

        if (rows.length === 0 || offset + CHUNK >= total)
        {
            break;
        }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ entries.join('\n') }
</urlset>
`;
}
