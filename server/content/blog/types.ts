/**
 * The shape of a seeded article.
 *
 * Content, not code: these modules are read by `scripts/seed-blog.ts` and by nothing the server
 * serves, so they live outside `src/` and the running process never imports them.
 *
 * The split between this file and the `.md` files beside each article is deliberate. Titles and
 * summaries are plain prose, so they sit in TypeScript where a missing language is a COMPILE
 * error - `heads` is a full Record, not a Partial, and that is the whole reason it is declared
 * here. Bodies are markdown full of backticks and code fences, which in a template literal
 * would need escaping on every inline span; as files they stay reviewable in a diff as the
 * markdown they actually are.
 *
 * The store itself is happy with a post in one language - the fallback policy in
 * blog/present.ts exists for exactly that - so nothing below is a constraint the schema
 * imposes. It is a constraint this cluster imposes on itself, because an article that shipped
 * in English only would be a gap no reader reports and nobody notices.
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
