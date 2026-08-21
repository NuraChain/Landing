import { POST_LOCALES, type PostCard, type PostDetail, type PostEditor, type PostLocale, type PostRecord } from '../schemas.ts';
import type { PostRow, StoredPost, TranslationRow } from './store.ts';

/**
 * Turning a stored post into what one reader sees.
 *
 * This is where the translation model actually lives. Everything else about it - the tab strip
 * in the dashboard, the notice on the page, the language list under a title - is a consequence
 * of the three lines in `resolve`.
 */

/** Unix seconds to the ISO string the wire carries. Null stays null - a draft has no date. */
const iso = (seconds: number | null): string | null =>
    seconds === null ? null : new Date(seconds * 1000).toISOString();

/** The site's own order, so a language list never arrives shuffled by whatever sqlite returned. */
export const inSiteOrder = (locales: PostLocale[]): PostLocale[] =>
    [...locales].sort((left, right) => POST_LOCALES.indexOf(left) - POST_LOCALES.indexOf(right));

/**
 * Which translation this reader gets.
 *
 * Three steps, in order, and the order is the whole policy:
 *
 *   1. Their own language, if the post has been written in it.
 *   2. The post's DEFAULT language - chosen per post, so one written in Persian falls back to
 *      Persian rather than to an English translation nobody has produced.
 *   3. Whatever exists, in the site's own order.
 *
 * Step three is not a nicety. A post can lose its default translation to a bad edit, and a
 * reader meeting an empty page would be worse served than one reading a language they did not
 * ask for - which the page tells them about either way.
 */
export function resolve(stored: StoredPost, wanted: PostLocale): TranslationRow | null
{
    const { post, translations } = stored;

    return translations.find((row) => row.locale === wanted)
        ?? translations.find((row) => row.locale === post.default_locale)
        ?? inSiteOrder(translations.map((row) => row.locale))
            .map((locale) => translations.find((row) => row.locale === locale))
            .find((row) => row !== undefined)
        ?? null;
}

/** The fields every served shape shares, resolved for one reader. */
/*
 * Annotated with the WIRE type it feeds rather than left inferred: `toCard` returns this
 * value directly as a `PostCard`, so naming it here is what makes a field added to one and
 * not the other a compile error instead of a silently thinner card.
 */
function served(post: PostRow, chosen: TranslationRow, available: PostLocale[], wanted: PostLocale): PostCard
{
    return {
        slug: post.slug,
        status: post.status,
        coverImage: post.cover_image,
        tags: JSON.parse(post.tags) as string[],
        publishedAt: iso(post.published_at),
        updatedAt: new Date(post.updated_at * 1000).toISOString(),

        locale: chosen.locale,
        requestedLocale: wanted,
        // Compared against what was SERVED, not against the list of what exists: those differ
        // the moment step two or three above fires, and this flag is what the notice reads.
        translated: chosen.locale === wanted,
        available,

        title: chosen.title,
        summary: chosen.summary
    };
}

/** One row of the blog index. No body: a list that carried every post's full text is a download. */
export function toCard(stored: StoredPost, wanted: PostLocale): PostCard | null
{
    const chosen = resolve(stored, wanted);

    if (chosen === null)
    {
        return null;
    }

    return served(stored.post, chosen, inSiteOrder(stored.translations.map((row) => row.locale)), wanted);
}

export function toDetail(stored: StoredPost, wanted: PostLocale): PostDetail | null
{
    const chosen = resolve(stored, wanted);

    if (chosen === null)
    {
        return null;
    }

    return {
        ...served(stored.post, chosen, inSiteOrder(stored.translations.map((row) => row.locale)), wanted),
        body: chosen.body
    };
}

/**
 * A post with no translation at all is skipped rather than rendered blank.
 *
 * `create` will not produce one, but a delete of the last translation could, and a list is the
 * wrong place to discover it - the dashboard shows it as an untitled row instead.
 */
export function toCards(rows: StoredPost[], wanted: PostLocale): PostCard[]
{
    return rows.map((row) => toCard(row, wanted)).filter((card): card is PostCard => card !== null);
}

/** Unix seconds to ISO, for a column that is never null. */
const stamp = (seconds: number): string => new Date(seconds * 1000).toISOString();

/**
 * One row of the dashboard's list.
 *
 * `title` comes from the DEFAULT language rather than from English, and falls back to any
 * language the post holds. A draft written in Persian and not yet translated still has a name
 * in the list it is being managed from - an empty string only survives a post with no languages
 * at all, which the list renders as untitled rather than as a blank row.
 */
export function toRecord(stored: StoredPost): PostRecord
{
    const { post, translations } = stored;
    const available = inSiteOrder(translations.map((row) => row.locale));
    const primary = translations.find((row) => row.locale === post.default_locale)
        ?? translations.find((row) => row.locale === available[0]);

    return {
        id: post.id,
        slug: post.slug,
        status: post.status,
        coverImage: post.cover_image,
        tags: JSON.parse(post.tags) as string[],
        defaultLocale: post.default_locale,
        publishedAt: iso(post.published_at),
        createdAt: stamp(post.created_at),
        updatedAt: stamp(post.updated_at),
        available,
        title: primary?.title ?? ''
    };
}

/** One post open in the editor: every language at once, in the site's own order. */
export function toEditor(stored: StoredPost): PostEditor
{
    const { post, translations } = stored;
    const order = inSiteOrder(translations.map((row) => row.locale));

    return {
        id: post.id,
        slug: post.slug,
        status: post.status,
        coverImage: post.cover_image,
        tags: JSON.parse(post.tags) as string[],
        defaultLocale: post.default_locale,
        publishedAt: iso(post.published_at),
        createdAt: stamp(post.created_at),
        updatedAt: stamp(post.updated_at),
        translations: order.map((locale) =>
        {
            const row = translations.find((held) => held.locale === locale)!;

            return {
                locale: row.locale,
                title: row.title,
                summary: row.summary,
                body: row.body,
                updatedAt: stamp(row.updated_at)
            };
        })
    };
}

export function pageCount(total: number, limit: number): number
{
    return Math.max(1, Math.ceil(total / limit));
}
