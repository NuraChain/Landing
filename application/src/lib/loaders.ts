// What each page needs, fetched where the page is rendered.
//
// These run on the server for a direct load - where the typed client dispatches through this
// app's own api IN PROCESS, carrying the visitor's identity and no socket - and in the browser
// for a client-side navigation. The result rides the loader handoff into the served document,
// so a hydrating page draws its content without asking for it again, and a crawler reads the
// article rather than a loading skeleton.
//
// The route table ships to the browser, so everything reachable from here stays browser-safe.
import { notFound } from 'azerothjs';

import { ApiError, client, type PostCard, type PostDetail, type TagCount, type WhitepaperDetail } from '../api';
import type { Locale } from '../stores/locale';
import type { BlogQuery } from './blog-query';

/** One page of the blog index, plus the two figures its chips are drawn from. */
export interface BlogIndex
{
    /**
     * The language this was ASKED for.
     *
     * The page compares it with the reader's to know when a language switch has left the list
     * stale: which translation each card carries is decided server-side, so it cannot be
     * recomputed in the browser - it has to be re-asked. See `useLocalizedLoader`.
     */
    requestedLocale: Locale;

    rows: PostCard[];
    pages: number;
    tags: TagCount[];

    /** Everything published, for the count on the unfiltered chip. */
    published: number;
}

/**
 * One post, in the reader's language or the nearest the document holds.
 *
 * A slug nobody has published is `notFound()`, not a fault: the server answers a real 404 for
 * it - where an ordinary throw would be a 500 - and the client keeps it as this level's own
 * error, which the page renders as its empty state. That is what replaced the soft 404 the
 * server used to patch in afterwards by inspecting the url.
 */
export async function loadPost(slug: string, locale: Locale): Promise<PostDetail>
{
    try
    {
        return await client.blog.one({ params: { slug }, query: { locale } });
    }
    catch (error)
    {
        if (error instanceof ApiError && error.status === 404)
        {
            throw notFound();
        }

        throw error;
    }
}

/**
 * A page of the index, its tag list and the site's published count, in one settle.
 *
 * Three calls rather than one because they answer three questions, and they are issued
 * TOGETHER: a waterfall here would be three round trips on the server before the first byte.
 * The tag list is allowed to fail on its own - a missing filter row costs a chip, and the list
 * below it still reads.
 */
export async function loadBlogIndex({ page, tag }: BlogQuery, locale: Locale): Promise<BlogIndex>
{
    const [found, tags, filteredTotal] = await Promise.all([
        client.blog.list({ query: { locale, page, ...(tag === null ? {} : { tag }) } }),
        client.blog.tags().catch((): TagCount[] => []),
        // With a tag applied, `found.total` is that TAG's count - the unfiltered chip needs the
        // site's. Asked for one row, because only the total is read.
        tag === null ? null : client.blog.list({ query: { locale, limit: 1 } }).then((all) => all.total)
    ]);

    return {
        requestedLocale: locale,
        rows: found.rows,
        pages: found.pages,
        tags,
        published: filteredTotal ?? found.total
    };
}

/** The whitepaper, resolved through the same fallback policy a post follows. */
export const loadWhitepaper = (locale: Locale): Promise<WhitepaperDetail> =>
    client.whitepaper.read({ query: { locale } });
