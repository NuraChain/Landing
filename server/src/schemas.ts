// CLIENT-SAFE: the application imports this file, so it may import only the schema package.
// One declaration validates the admin's form AND the server boundary, and types the browser.
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

/** Shared by the submitted and the stored shape, so the two cannot drift apart. */
const translationFields = {
    title: string({ trim: true, min: 1, max: 200 }),
    /** The line a card and a search result show. Empty is allowed; a lie is not. */
    summary: string({ trim: true, max: 400 }),
    /** Markdown, in the strict subset the renderer accepts - see lib/markdown.ts. */
    body: string({ min: 1, max: 200_000 })
};

export const translationInput = object({ ...translationFields });
export type TranslationInput = Infer<typeof translationInput>;

/** One language of one post, as it is stored and served. */
export const translation = object({
    ...translationFields,
    locale: enumOf(POST_LOCALES),
    /** ISO 8601, generated server-side. No timestamp is ever accepted from a caller. */
    updatedAt: string()
});
export type Translation = Infer<typeof translation>;

/** The fields an admin sets on the post itself, rather than on one of its languages. */
const postFields = {
    slug,
    status: enumOf(POST_STATUS),
    /** A path under the app's own `public/`, or null. Never a remote url - see the store. */
    coverImage: string({ trim: true, max: 300 }).nullable(),
    tags: array(string({ trim: true, lowercase: true, min: 1, max: 40 })),
    /**
     * The language this post falls back to when the reader's is missing.
     *
     * Per post rather than a site-wide 'en': an announcement written in Persian first should
     * fall back to Persian, not to an English translation that does not exist yet.
     */
    defaultLocale: enumOf(POST_LOCALES)
};

export const postInput = object({ ...postFields });
export type PostInput = Infer<typeof postInput>;

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

/**
 * What the dashboard lists: the post itself plus which languages it holds, and nothing else.
 *
 * Deliberately not the reader's shape. An editor is choosing what to work on next, so the
 * useful column is "what is still missing", which a resolved-with-fallback card cannot show.
 */
export const postRecord = object({
    id: number({ int: true, min: 1 }),
    ...postFields,
    publishedAt: string().nullable(),
    createdAt: string(),
    updatedAt: string(),
    /** Present languages, in the site's own order - the tab strip reads it directly. */
    available: array(enumOf(POST_LOCALES)),
    /** The title in the default language, so a draft with no English still has a name. */
    title: string()
});
export type PostRecord = Infer<typeof postRecord>;

/** What the sign-in form submits. The key is never logged, echoed or stored. */
export const adminKeyInput = object({
    key: string({ trim: true, min: 1, max: 200 })
});
export type AdminKeyInput = Infer<typeof adminKeyInput>;

/**
 * Whether the caller is signed in, and until when.
 *
 * Deliberately says nothing else - no key fragment, no hint, no "wrong key" versus "no key".
 * The dashboard needs exactly one bit to decide what to render.
 */
export const sessionState = object({
    signedIn: boolean(),
    /** ISO 8601, or null when signed out. The dashboard warns before this passes. */
    expiresAt: string().nullable()
});
export type SessionState = Infer<typeof sessionState>;

/**
 * One post open in the editor: its own fields plus every language it holds, in full.
 *
 * The reader's shape resolves ONE language and hides the rest; an editor needs all of them at
 * once, because the thing it is for is seeing what is still missing.
 */
export const postEditor = object({
    id: number({ int: true, min: 1 }),
    ...postFields,
    publishedAt: string().nullable(),
    createdAt: string(),
    updatedAt: string(),
    translations: array(translation)
});
export type PostEditor = Infer<typeof postEditor>;

/** Creating a post: its fields, plus the first language it is written in. */
export const createPostInput = object({
    ...postFields,
    locale: enumOf(POST_LOCALES),
    translation: translationInput
});
export type CreatePostInput = Infer<typeof createPostInput>;

/** A delete's answer: nothing to return but the fact that it happened. */
export const removed = object({ removed: boolean() });

/** What the dashboard lists. */
export const postRecordList = array(postRecord);

/**
 * A page of dashboard rows.
 *
 * The same envelope the public blog has had since it was written. The dashboard shipped with a
 * bare array and a hard `limit: 200`, which meant the 201st post existed, was served, and was
 * invisible to the only screen that could edit it - silently, with nothing to indicate a
 * cut-off had happened.
 */
export const postRecordPage = object({
    rows: postRecordList,
    total: number({ int: true, min: 0 }),
    page: number({ int: true, min: 1 }),
    pages: number({ int: true, min: 1 })
});
export type PostRecordPage = Infer<typeof postRecordPage>;

/**
 * Paging for the dashboard: the reader's language is not a factor, because the list shows each
 * post in its own fallback language rather than resolving one.
 */
export const adminPageQuery = object({
    page: number({ int: true, min: 1, max: 1_000_000, coerce: true }).optional(),
    limit: number({ int: true, min: 1, max: 100, coerce: true }).optional()
});

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
