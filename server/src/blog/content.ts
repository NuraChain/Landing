import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ARTICLES } from '../../content/blog/index.ts';
import type { Article } from '../../content/blog/types.ts';
import { POST_LOCALES, type PostLocale, type PostStatus } from '../schemas.ts';

/**
 * The blog, read from disk.
 *
 * This replaced a 500-line sqlite store, and the reason is not that the store was bad - it is
 * that nothing wrote to it any more. Posts arrived through a seed script that read exactly this
 * directory, so the database was a cache of the repository with an editor bolted to the side.
 * Deleting it removed the dashboard, the session table, the admin key and the one piece of
 * mutable state the deployment had to back up. A post is now a commit.
 *
 * Everything is read ONCE, at construction. Ten articles in ten languages is about half a
 * megabyte of markdown; holding it costs less than the statement cache the store kept, and it
 * means no request touches the filesystem. The consequence is the honest one: editing an
 * article on a running server changes nothing until the process restarts. That is the same
 * deal the rest of the site already makes - the bundle is built, not watched.
 */

/** Where the articles live, resolved from THIS file rather than from the working directory. */
const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'blog');

/**
 * A post's own fields, with dates as the ISO strings the wire carries.
 *
 * The store's row carried unix seconds because that is what sqlite held, and `present.ts`
 * converted on the way out. The files carry ISO already, so the conversion had nowhere left to
 * happen and both sides simply got shorter.
 */
export interface PostRow
{
    slug: string;
    status: PostStatus;
    coverImage: string | null;
    tags: string[];
    defaultLocale: PostLocale;
    publishedAt: string;
    updatedAt: string;
}

/** One language of one post. */
export interface TranslationRow
{
    locale: PostLocale;
    title: string;
    summary: string;
    body: string;
}

/** A post and every language it holds - what the fallback policy in `present.ts` starts from. */
export interface LoadedPost
{
    post: PostRow;
    translations: TranslationRow[];
}

export interface ListOptions
{
    limit: number;
    offset: number;
    tag?: string;
}

/**
 * Reads one article's markdown, in every language its head declares.
 *
 * A missing file is collected rather than thrown on, so a writer who moved a directory is told
 * about all ten at once instead of being walked through them one restart at a time.
 */
function bodiesFor(article: Article, missing: string[]): TranslationRow[]
{
    const translations: TranslationRow[] = [];

    for (const locale of POST_LOCALES)
    {
        const head = article.heads[locale];
        const path = join(CONTENT_DIR, article.slug, `${ locale }.md`);
        let body: string;

        try
        {
            body = readFileSync(path, 'utf8').trim();
        }
        catch
        {
            missing.push(`${ article.slug }/${ locale }.md`);
            continue;
        }

        // An empty file is a missing file that happens to exist. It would otherwise become a
        // post with a title, a place in the index and nothing under the heading.
        if (body === '')
        {
            missing.push(`${ article.slug }/${ locale }.md (empty)`);
            continue;
        }

        translations.push({ locale, title: head.title, summary: head.summary, body });
    }

    return translations;
}

/**
 * Reads the cluster off disk.
 *
 * Split from the class on purpose, and the split is what keeps the suite honest: this is the
 * only function here that touches a filesystem, so a spec constructs `BlogContent` from posts
 * it declares inline and the promise that no test reads the disk stays true by construction
 * rather than by everyone remembering.
 *
 * @throws If any declared translation has no file behind it. Refusing to start is the point:
 *   the alternative is a post that silently lost a language, which is a gap no reader reports.
 *   Every missing path is named in the one message rather than one restart at a time.
 */
export function loadArticles(articles: readonly Article[] = ARTICLES): LoadedPost[]
{
    const missing: string[] = [];

    const loaded = articles.map((article) => ({
        post: {
            slug: article.slug,
            status: article.status,
            coverImage: article.coverImage,
            tags: article.tags,
            defaultLocale: article.defaultLocale,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt
        },
        translations: bodiesFor(article, missing)
    }));

    if (missing.length > 0)
    {
        throw new Error(`Blog content is incomplete - no file for:\n  ${ missing.join('\n  ') }`);
    }

    return loaded;
}

/**
 * The articles, indexed in memory.
 *
 * Constructed once in `main.ts` over {@link loadArticles} and handed to `buildApp`; the suite
 * builds its own over posts declared in the spec, which is what lets one describe a blog of
 * two articles without writing twenty markdown files.
 */
export class BlogContent
{
    readonly #posts: LoadedPost[];

    constructor(loaded: readonly LoadedPost[])
    {
        /*
         * Newest first, and ties broken by the order `index.ts` lists them in - REVERSED, so
         * that within one publication date the article written last reads as the newest. The
         * store got this from `id DESC` over rows the seed script inserted in that same order;
         * with three timestamps across ten articles the tiebreak decides most of the page, so
         * it is spelled out rather than left to sort stability.
         */
        this.#posts = [...loaded]
            .map((entry, index) => ({ entry, index }))
            .sort((left, right) =>
                Date.parse(right.entry.post.publishedAt) - Date.parse(left.entry.post.publishedAt)
                || right.index - left.index)
            .map(({ entry }) => entry);
    }

    /** Published posts only - a draft is an article whose `status` says so, and it is not served. */
    get #published(): LoadedPost[]
    {
        return this.#posts.filter((entry) => entry.post.status === 'published');
    }

    /**
     * One page of the index, newest first.
     *
     * `total` counts what matched BEFORE paging, because the pager is drawn from it.
     */
    public list(options: ListOptions): { rows: LoadedPost[]; total: number }
    {
        const tag = options.tag;
        const matched = tag === undefined || tag === ''
            ? this.#published
            // Equality against each tag, never a substring: 'defi' must not match 'defiance'.
            : this.#published.filter((entry) => entry.post.tags.includes(tag));

        return {
            rows: matched.slice(options.offset, options.offset + options.limit),
            total: matched.length
        };
    }

    public bySlug(slug: string): LoadedPost | null
    {
        return this.#published.find((entry) => entry.post.slug === slug) ?? null;
    }

    /** Every tag in use, most used first, then alphabetically so the order is stable. */
    public tags(): Array<{ tag: string; count: number }>
    {
        const counts = new Map<string, number>();

        for (const entry of this.#published)
        {
            for (const tag of entry.post.tags)
            {
                counts.set(tag, (counts.get(tag) ?? 0) + 1);
            }
        }

        return [...counts]
            .map(([tag, count]) => ({ tag, count }))
            .sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
    }
}
