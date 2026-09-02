/**
 * The shape of the whitepaper's head.
 *
 * The same split the blog makes, for the same reason: titles and summaries are plain prose and
 * sit in TypeScript, where a missing language is a COMPILE error, while the bodies are markdown
 * full of code fences and stay as `<locale>.md` files beside this one, reviewable as the markdown
 * they are. `src/whitepaper/content.ts` reads the lot at boot.
 *
 * Unlike a post, there is exactly one of these and it has no slug and no tags - it is THE
 * document, read at `/whitepaper`. What it has instead is a revision: a whitepaper is cited, so
 * a reader has to be able to say which one they hold.
 */
import type { ArticleHead } from '../blog/types.ts';
import type { PostLocale } from '../../src/schemas.ts';

export interface WhitepaperHead
{
    /** Printed on the page and on the PDF's cover. Bump it with any change a reader would cite. */
    revision: string;

    /** ISO 8601, both. `updatedAt` is what /sitemap.xml reports as lastmod. */
    publishedAt: string;
    updatedAt: string;

    /** The language a crawler is served, and the fallback for a reader whose language is missing. */
    defaultLocale: PostLocale;

    /** Every language, required - the body for each is read from `<locale>.md`. */
    heads: Record<PostLocale, ArticleHead>;
}
