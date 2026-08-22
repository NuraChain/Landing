/**
 * The shape of a seeded article.
 *
 * Content, not code - but the SERVER READS IT. These modules used to be seeded into sqlite by a
 * script and then never touched again; the store is gone and `src/blog/content.ts` now loads
 * this directory at boot and serves it. They stay outside `src/` because they are still prose
 * rather than logic, and a writer editing an article should not be reading past the server.
 *
 * The split between this file and the `.md` files beside each article is deliberate. Titles and
 * summaries are plain prose, so they sit in TypeScript where a missing language is a COMPILE
 * error - `heads` is a full Record, not a Partial, and that is the whole reason it is declared
 * here. Bodies are markdown full of backticks and code fences, which in a template literal
 * would need escaping on every inline span; as files they stay reviewable in a diff as the
 * markdown they actually are.
 *
 * The SERVER is happy with a post in one language - the fallback policy in blog/present.ts
 * exists for exactly that - so nothing below is a constraint the schema imposes. It is a
 * constraint this cluster imposes on itself, because an article that shipped in English only
 * would be a gap no reader reports and nobody notices.
 */
import type { PostLocale, PostStatus } from '../../src/schemas.ts';

export interface ArticleHead
{
    /** The h1 and the `<title>`. Kept near 60 characters where the language allows it. */
    title: string;
    /** The card line, the meta description and og:description - one sentence, roughly 140-160. */
    summary: string;
}

export interface Article
{
    /** The url this reads at: `/blog/<slug>`, and the directory the bodies live in. */
    slug: string;
    tags: string[];
    defaultLocale: PostLocale;
    status: PostStatus;

    /**
     * When this article went up, and when it was last revised - ISO 8601, both of them.
     *
     * Declared here because there is nowhere else left to put them. They used to be assigned by
     * the seed run, which meant the date a post claimed depended on when somebody last rebuilt
     * the database rather than on anything editorial. A file has no such timestamp to borrow:
     * mtime survives neither a clone nor a checkout, so it would redate the whole blog on a
     * fresh deploy.
     *
     * `publishedAt` orders the index and `updatedAt` is what /sitemap.xml reports as lastmod,
     * so revising an article without touching `updatedAt` is how a correction goes uncrawled.
     */
    publishedAt: string;
    updatedAt: string;
    /** A path under the application's own public/, or null. Never a remote url. */
    coverImage: string | null;
    /**
     * Every language, required.
     *
     * The body for each is read from `<slug>/<locale>.md`; the seed script refuses to publish an
     * article whose file is missing rather than quietly writing a post with nine languages.
     */
    heads: Record<PostLocale, ArticleHead>;
}
