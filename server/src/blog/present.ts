import { POST_LOCALES, type PostCard, type PostDetail, type PostLocale } from '../schemas.ts';
import type { LoadedPost, PostRow, TranslationRow } from './content.ts';

/**
 * Turning a loaded post into what one reader sees.
 *
 * This is where the translation model actually lives. Everything else about it - the notice on
 * the page, the language list under a title - is a consequence of the three lines in `resolve`.
 */

/** The site's own order, so a language list never arrives shuffled by the order files were read. */
export const inSiteOrder = (locales: PostLocale[]): PostLocale[] =>
    [...locales].sort((left, right) => POST_LOCALES.indexOf(left) - POST_LOCALES.indexOf(right));

/**
 * Which translation this reader gets.
 *
 * Three steps, in order, and the order is the whole policy:
 *
 *   1. Their own language, if the document has been written in it.
 *   2. The document's DEFAULT language - chosen per document, so one written in Persian falls
 *      back to Persian rather than to an English translation nobody has produced.
 *   3. Whatever exists, in the site's own order.
 *
 * Step three is not a nicety. A document can lose its default translation to a bad edit, and a
 * reader meeting an empty page would be worse served than one reading a language they did not
 * ask for - which the page tells them about either way.
 *
 * Generic over the row, because the blog and the whitepaper each carry their own translation
 * shape and there must be ONE policy: a reader falling back differently on the whitepaper than
 * on a post would be a bug nobody could describe.
 */
export function pick<T extends { locale: PostLocale }>(
    translations: readonly T[],
    defaultLocale: PostLocale,
    wanted: PostLocale
): T | null
{
    return translations.find((row) => row.locale === wanted)
        ?? translations.find((row) => row.locale === defaultLocale)
        ?? inSiteOrder(translations.map((row) => row.locale))
            .map((locale) => translations.find((row) => row.locale === locale))
            .find((row) => row !== undefined)
        ?? null;
}

/** The blog's reading of {@link pick}: a post's default language is declared on the post. */
export function resolve(stored: LoadedPost, wanted: PostLocale): TranslationRow | null
{
    return pick(stored.translations, stored.post.defaultLocale, wanted);
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
        coverImage: post.coverImage,
        tags: post.tags,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,

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
export function toCard(stored: LoadedPost, wanted: PostLocale): PostCard | null
{
    const chosen = resolve(stored, wanted);

    if (chosen === null)
    {
        return null;
    }

    return served(stored.post, chosen, inSiteOrder(stored.translations.map((row) => row.locale)), wanted);
}

export function toDetail(stored: LoadedPost, wanted: PostLocale): PostDetail | null
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
 * `BlogContent` refuses to load one - a declared language with no file is a startup error - so
 * this filter is the belt to that pair of braces rather than a state the site can reach.
 */
export function toCards(rows: LoadedPost[], wanted: PostLocale): PostCard[]
{
    return rows.map((row) => toCard(row, wanted)).filter((card): card is PostCard => card !== null);
}

export function pageCount(total: number, limit: number): number
{
    return Math.max(1, Math.ceil(total / limit));
}
