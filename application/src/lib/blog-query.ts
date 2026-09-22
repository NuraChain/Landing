import type { Query } from 'azerothjs';

/** What the blog's url says it is showing: which page of the list, and which tag narrows it. */
export interface BlogQuery
{
    page: number;
    tag: string | null;
}

/**
 * A `Query` value is `string | string[]` - a repeated `?page=1&page=2` arrives as an array -
 * so everything read out of it is narrowed before it is sent anywhere.
 */
const one = (value: string | string[] | undefined): string | null =>
{
    const first = Array.isArray(value) ? value[0] : value;

    return first === undefined || first === '' ? null : first;
};

/**
 * The page and the tag a blog url names, narrowed and clamped.
 *
 * The URL is the source of truth for both, not component state: page two can then be linked,
 * bookmarked and followed by a crawler back through older posts, and Back steps through the
 * pages rather than leaving the blog entirely.
 *
 * It lives here rather than in the page because the LOADER needs it too - the loader is what
 * turns a url into a request now, and a second copy of this parsing is a second answer to
 * "which page is this" for the same address.
 */
export const blogQuery = (query: Query): BlogQuery =>
{
    const raw = Number(one(query.page));

    return {
        page: Number.isSafeInteger(raw) && raw >= 1 ? raw : 1,
        tag: one(query.tag)
    };
};
