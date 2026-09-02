// CLIENT-SAFE: the application imports this file, so it may import only the schema package.
// One declaration validates the server boundary AND types the browser, so the shape is
// decided in exactly one place and cannot drift.
import { array, boolean, enumOf, number, object, string, type Infer } from '@azerothjs/schema';

/**
 * The languages a post can be written in.
 *
 * The same ten the site itself ships, in the same order, but declared HERE because the wire
 * needs a validator and the store needs a column check - and a marketing store's list is not
 * something the server can import from a browser store. `tests/blog-locales.spec.ts` in the
 * application half asserts the two never drift, which is the same guard `prepaint.spec.ts`
 * already puts on the inline script's copy of the list.
 */
export const POST_LOCALES = ['en', 'fa', 'ar', 'es', 'pt', 'hi', 'zh', 'ru', 'fr', 'tr'] as const;
export type PostLocale = (typeof POST_LOCALES)[number];

/**
 * A draft is invisible to every reader and to every list except the dashboard's own.
 *
 * There is deliberately no third state. "Scheduled" sounds free but is not: it needs a clock
 * the server has to consult on every read, and a post that publishes itself at 3am while
 * nobody is watching is a thing you want to have chosen on purpose, not inherited.
 */
export const POST_STATUS = ['draft', 'published'] as const;
export type PostStatus = (typeof POST_STATUS)[number];

/**
 * The url-safe name a post is read at: `/blog/nura-mainnet-is-live`.
 *
 * Lower-cased and trimmed BEFORE the pattern runs, so a slug pasted with a capital or a
 * trailing space is corrected rather than rejected - the author is not the adversary here,
 * and the pattern is what keeps the value addressable.
 */
export const slug = string({ trim: true, lowercase: true, min: 1, max: 120, pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ });

/**
 * How one post reads to one reader.
 *
 * `locale` is what was actually served and `requestedLocale` is what they asked for; when the
 * two differ the reader is looking at a fallback and the page says so. Reporting both beats a
 * bare `translated: false`, because the notice has to name the language they are reading.
 */
const servedFields = {
    slug: string(),
    status: enumOf(POST_STATUS),
    coverImage: string().nullable(),
    tags: array(string()),
    publishedAt: string().nullable(),
    updatedAt: string(),

    locale: enumOf(POST_LOCALES),
    requestedLocale: enumOf(POST_LOCALES),
    translated: boolean(),
    /** Every language this post exists in, so the reader can switch to one on purpose. */
    available: array(enumOf(POST_LOCALES)),

    title: string(),
    summary: string()
};

/** A row in the blog index: everything but the body, which no list needs. */
export const postCard = object({ ...servedFields });
export type PostCard = Infer<typeof postCard>;

/** One post, read in full. */
export const postDetail = object({ ...servedFields, body: string() });
export type PostDetail = Infer<typeof postDetail>;

/** A page of cards. `total` is the count BEFORE paging, so a pager can be drawn. */
export const postPage = object({
    rows: array(postCard),
    total: number({ int: true, min: 0 }),
    page: number({ int: true, min: 1 }),
    pages: number({ int: true, min: 1 })
});
export type PostPage = Infer<typeof postPage>;

/** One tag and how many published posts carry it - the blog's own filter list. */
export const tagCount = object({
    tag: string(),
    count: number({ int: true, min: 0 })
});
export type TagCount = Infer<typeof tagCount>;

/**
 * Paging, bounded at BOTH ends.
 *
 * `page` needs a maximum for the same reason `limit` does, and it is the less obvious one: the
 * handler multiplies it into an offset, and a page of 1e21 arrives as an ordinary-looking query
 * string, passes an integer check (it IS integral as a double) and produces an offset past
 * Number.MAX_SAFE_INTEGER, which sqlite refuses to bind - a 500 where every other malformed
 * page gets a 422.
 */
export const pageQuery = object({
    page: number({ int: true, min: 1, max: 1_000_000, coerce: true }).optional(),
    limit: number({ int: true, min: 1, max: 50, coerce: true }).optional(),
    /** The reader's language. Absent means English, the same default the site itself falls to. */
    locale: enumOf(POST_LOCALES).optional(),
    /** Narrow to one tag. */
    tag: string({ trim: true, lowercase: true, max: 40 }).optional()
});

export const readQuery = object({
    locale: enumOf(POST_LOCALES).optional()
});

/**
 * The whitepaper as one reader sees it.
 *
 * The same served fields a post carries - which language was asked for, which was served, and
 * every language it exists in - because the page shows the same fallback notice a post does. What
 * replaces the slug and the tags is a revision, which is how a cited document says which one it
 * is, and `pdf`: the site-relative path of the download in the language SERVED, so a reader shown
 * the fallback downloads the file that matches the page rather than one in a language they
 * cannot read.
 */
export const whitepaperDetail = object({
    revision: string(),
    publishedAt: string(),
    updatedAt: string(),

    locale: enumOf(POST_LOCALES),
    requestedLocale: enumOf(POST_LOCALES),
    translated: boolean(),
    available: array(enumOf(POST_LOCALES)),

    title: string(),
    summary: string(),
    body: string(),
    pdf: string()
});
export type WhitepaperDetail = Infer<typeof whitepaperDetail>;

/**
 * What one NURA is worth in USD, and when that was read.
 *
 * `at` is not decoration. The figure is served from a server-side memo that keeps answering
 * from its last good reading while the swap is unreachable, so a caller needs to be able to
 * see how old the number it just received actually is. A response carrying no timestamp
 * would make a fifteen-minute-old price indistinguishable from a fresh one.
 */
export const nuraPrice = object({
    /** USD per NURA. Positive and finite; the reader rejects anything else upstream sends. */
    usd: number(),
    /** ISO 8601, stamped when the swap answered - NOT when this response was written. */
    at: string()
});
export type NuraPrice = Infer<typeof nuraPrice>;
