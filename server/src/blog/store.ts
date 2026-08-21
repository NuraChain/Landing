import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { POST_LOCALES, type PostLocale, type PostStatus } from '../schemas.ts';

/**
 * The blog's database.
 *
 * Everything here is CONTENT: somebody wrote it, and nothing else in the world holds a copy.
 * That single fact decides most of what follows - the schema migrates rather than rebuilds, the
 * delete is a real delete the caller has to mean, and the durability settings lean the other way
 * from an index that could always be derived again.
 */

/** Bumped when a column changes. Unlike a derived index, this MIGRATES - it cannot replay. */
const SCHEMA_VERSION = 2;

const DDL = `
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL,
    cover_image TEXT,
    tags TEXT NOT NULL,
    default_locale TEXT NOT NULL,
    published_at INTEGER,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
-- The reader's query is "published, newest first"; the dashboard's is "everything, newest
-- first". One index over (status, published_at) serves the first and the second falls back to
-- the primary key, which is already in creation order.
CREATE INDEX IF NOT EXISTS idx_posts_live ON posts (status, published_at DESC);

CREATE TABLE IF NOT EXISTS post_translations (
    post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
    locale TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (post_id, locale)
);
`;

export interface PostRow
{
    id: number;
    slug: string;
    status: PostStatus;
    cover_image: string | null;
    tags: string;
    default_locale: PostLocale;
    published_at: number | null;
    created_at: number;
    updated_at: number;
}

export interface TranslationRow
{
    post_id: number;
    locale: PostLocale;
    title: string;
    summary: string;
    body: string;
    updated_at: number;
}

/** What a caller sets on the post itself. Timestamps are never among them - see `#now`. */
export interface PostFields
{
    slug: string;
    status: PostStatus;
    coverImage: string | null;
    tags: string[];
    defaultLocale: PostLocale;
}

export interface TranslationFields
{
    title: string;
    summary: string;
    body: string;
}

export interface ListOptions
{
    limit: number;
    offset: number;
    /** Drafts are the dashboard's business alone; every reader path leaves this false. */
    includeDrafts?: boolean;
    tag?: string;
}

/** A post and every language it holds, which is what both readers and the dashboard start from. */
export interface StoredPost
{
    post: PostRow;
    translations: TranslationRow[];
}

export class BlogStore
{
    readonly #db: DatabaseSync;

    /** Prepared statements, keyed by their SQL: the same handful run on every request. */
    readonly #statements = new Map<string, StatementSync>();

    #inTransaction = false;

    constructor(path: string)
    {
        // sqlite creates the FILE but not the directory holding it, so a configured
        // `.data/blog.db` fails to open on a fresh clone until someone makes the folder.
        // ':memory:' has no directory at all.
        if (path !== ':memory:')
        {
            const parent = dirname(resolve(path));

            if (!existsSync(parent))
            {
                mkdirSync(parent, { recursive: true });
            }
        }

        this.#db = new DatabaseSync(path);

        /*
         * `foreign_keys` is OFF by default in sqlite and is per CONNECTION, not per database -
         * so the ON DELETE CASCADE in the DDL above is decoration until this line runs. Without
         * it, deleting a post silently orphans every translation it had.
         *
         * `synchronous = NORMAL` under WAL, and this is the opposite call from a derived index:
         * there, a power cut costs blocks that get re-read from the chain, so the fsync buys
         * nothing. Here the only copy of a post somebody wrote is this file. NORMAL still
         * survives a process crash intact; it risks the last transaction on a power cut, which
         * is the trade every sqlite deployment makes and the reason backups exist.
         */
        this.#db.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA foreign_keys = ON;
            PRAGMA busy_timeout = 5000;`);

        this.#db.exec(DDL);
        this.#migrate();
    }

    /** A prepared statement, prepared once per distinct SQL string and reused thereafter. */
    #stmt(sql: string): StatementSync
    {
        let statement = this.#statements.get(sql);

        if (statement === undefined)
        {
            statement = this.#db.prepare(sql);
            this.#statements.set(sql, statement);
        }

        return statement;
    }

    /**
     * Runs `work` inside ONE transaction. Nested calls join the outer one rather than opening a
     * second, which sqlite does not allow. A throw rolls back: a post and its translations are
     * written together or not at all, so no reader ever sees a post with no title.
     */
    public transaction<T>(work: () => T): T
    {
        if (this.#inTransaction)
        {
            return work();
        }

        this.#db.exec('BEGIN IMMEDIATE');
        this.#inTransaction = true;

        try
        {
            const result = work();

            this.#db.exec('COMMIT');

            return result;
        }
        catch (error)
        {
            this.#db.exec('ROLLBACK');

            throw error;
        }
        finally
        {
            this.#inTransaction = false;
        }
    }

    /**
     * Schema versioning that MIGRATES.
     *
     * The derived-index trick of dropping every table and replaying is not available to a store
     * whose rows exist nowhere else. Each step is written out and runs in order, so a database
     * two versions behind arrives intact rather than empty.
     */
    #migrate(): void
    {
        const current = Number(this.#db.prepare('PRAGMA user_version').get()?.user_version ?? 0);

        if (current >= SCHEMA_VERSION)
        {
            return;
        }

        this.transaction(() =>
        {
            // v1 -> v2: `posts.default_locale`. Before it, every post fell back to English,
            // which is wrong for one written in Persian first.
            if (current < 2)
            {
                const columns = this.#db.prepare('PRAGMA table_info(posts)').all() as unknown as Array<{ name: string }>;

                if (!columns.some((column) => column.name === 'default_locale'))
                {
                    this.#db.exec("ALTER TABLE posts ADD COLUMN default_locale TEXT NOT NULL DEFAULT 'en'");
                }
            }

            // Interpolated, not bound: sqlite takes no parameter in a PRAGMA, and the value is
            // this file's own integer constant rather than anything a caller supplied.
            this.#db.exec(`PRAGMA user_version = ${ SCHEMA_VERSION }`);
        });
    }

    public close(): void
    {
        this.#db.close();
    }

    /** Unix seconds. One clock read per write, so a post and its translation share a timestamp. */
    #now(): number
    {
        return Math.floor(Date.now() / 1000);
    }

    // ----------------------------------------------------------------------------------
    // Reads
    // ----------------------------------------------------------------------------------

    /**
     * One page of posts, newest first, with every translation each one holds.
     *
     * Two queries rather than a join: a join would repeat each post once per language it has,
     * and the caller would spend more code un-repeating it than this costs. The second query is
     * one `IN` over at most `limit` ids.
     */
    public list(options: ListOptions): { rows: StoredPost[]; total: number }
    {
        const conditions: string[] = [];
        const bound: Array<string | number> = [];

        if (options.includeDrafts !== true)
        {
            conditions.push("status = 'published'");
        }

        if (options.tag !== undefined && options.tag !== '')
        {
            // Tags are a JSON array in one column; `json_each` unrolls it so the match is a
            // real equality rather than a LIKE that would also match 'defi' inside 'defiance'.
            conditions.push('EXISTS (SELECT 1 FROM json_each(posts.tags) WHERE json_each.value = ?)');
            bound.push(options.tag);
        }

        const where = conditions.length === 0 ? '' : `WHERE ${ conditions.join(' AND ') }`;

        const total = (this.#stmt(`SELECT COUNT(*) AS n FROM posts ${ where }`)
            .get(...bound) as { n: number }).n;

        // A draft has no published_at, so ordering by it alone would bunch every draft together
        // at one end. COALESCE falls back to when it was created, which is the order a
        // dashboard expects to see its own drafts in.
        const rows = this.#stmt(`
            SELECT * FROM posts ${ where }
            ORDER BY COALESCE(published_at, created_at) DESC, id DESC
            LIMIT ? OFFSET ?`)
            .all(...bound, options.limit, options.offset) as unknown as PostRow[];

        return { rows: this.#withTranslations(rows), total };
    }

    /** Attaches every translation for a set of posts, in one query rather than one per row. */
    #withTranslations(rows: PostRow[]): StoredPost[]
    {
        if (rows.length === 0)
        {
            return [];
        }

        // The placeholder list is built from the row COUNT and every id is still bound, so this
        // is a shape decided here and values supplied by sqlite - not a query built from data.
        const holes = rows.map(() => '?').join(', ');
        const translations = this.#stmt(
            `SELECT * FROM post_translations WHERE post_id IN (${ holes }) ORDER BY locale ASC`)
            .all(...rows.map((row) => row.id)) as unknown as TranslationRow[];

        const byPost = new Map<number, TranslationRow[]>();

        for (const row of translations)
        {
            const held = byPost.get(row.post_id);

            if (held === undefined)
            {
                byPost.set(row.post_id, [row]);
            }
            else
            {
                held.push(row);
            }
        }

        return rows.map((post) => ({ post, translations: byPost.get(post.id) ?? [] }));
    }

    public bySlug(slug: string, options: { includeDrafts?: boolean } = {}): StoredPost | null
    {
        const row = this.#stmt('SELECT * FROM posts WHERE slug = ?').get(slug) as PostRow | undefined;

        if (row === undefined || (options.includeDrafts !== true && row.status !== 'published'))
        {
            return null;
        }

        return this.#withTranslations([row])[0] ?? null;
    }

    public byId(id: number): StoredPost | null
    {
        const row = this.#stmt('SELECT * FROM posts WHERE id = ?').get(id) as PostRow | undefined;

        return row === undefined ? null : this.#withTranslations([row])[0] ?? null;
    }

    /** Every tag in use on a published post, most used first - the blog's own filter list. */
    public tags(): Array<{ tag: string; count: number }>
    {
        return this.#stmt(`
            SELECT json_each.value AS tag, COUNT(*) AS count
            FROM posts, json_each(posts.tags)
            WHERE posts.status = 'published'
            GROUP BY tag
            ORDER BY count DESC, tag ASC`)
            .all() as unknown as Array<{ tag: string; count: number }>;
    }

    // ----------------------------------------------------------------------------------
    // Writes
    // ----------------------------------------------------------------------------------

    /**
     * Creates a post with its first translation, in one transaction.
     *
     * A post with no language at all has no title, so every list would have to invent one. It
     * is not a state worth being able to reach, so `create` will not produce it.
     */
    public create(fields: PostFields, locale: PostLocale, translation: TranslationFields): StoredPost
    {
        return this.transaction(() =>
        {
            const at = this.#now();
            // `published_at` is stamped when a post FIRST goes live and never moved by a later
            // edit - an author fixing a typo has not republished, and a blog that reorders
            // itself on every correction is lying about when it said what it said.
            const published = fields.status === 'published' ? at : null;

            const inserted = this.#stmt(`
                INSERT INTO posts (slug, status, cover_image, tags, default_locale, published_at, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                RETURNING *`)
                .get(fields.slug, fields.status, fields.coverImage, JSON.stringify(fields.tags),
                    fields.defaultLocale, published, at, at) as unknown as PostRow;

            this.#writeTranslation(inserted.id, locale, translation, at);

            return this.#withTranslations([inserted])[0]!;
        });
    }

    /** Replaces the post's own fields. Translations are edited through their own call. */
    public update(id: number, fields: PostFields): StoredPost | null
    {
        return this.transaction(() =>
        {
            const existing = this.#stmt('SELECT * FROM posts WHERE id = ?').get(id) as PostRow | undefined;

            if (existing === undefined)
            {
                return null;
            }

            const at = this.#now();
            // First publication stamps the date; unpublishing clears it, so a post that goes
            // back to draft and out again is dated from when it was actually readable.
            const published = fields.status === 'published'
                ? existing.published_at ?? at
                : null;

            const row = this.#stmt(`
                UPDATE posts
                SET slug = ?, status = ?, cover_image = ?, tags = ?, default_locale = ?, published_at = ?, updated_at = ?
                WHERE id = ?
                RETURNING *`)
                .get(fields.slug, fields.status, fields.coverImage, JSON.stringify(fields.tags),
                    fields.defaultLocale, published, at, id) as unknown as PostRow;

            return this.#withTranslations([row])[0]!;
        });
    }

    /** Removes a post and, through the cascade, every language of it. */
    public remove(id: number): boolean
    {
        return this.#stmt('DELETE FROM posts WHERE id = ?').run(id).changes > 0;
    }

    public upsertTranslation(id: number, locale: PostLocale, fields: TranslationFields): StoredPost | null
    {
        return this.transaction(() =>
        {
            const existing = this.#stmt('SELECT * FROM posts WHERE id = ?').get(id) as PostRow | undefined;

            if (existing === undefined)
            {
                return null;
            }

            const at = this.#now();

            this.#writeTranslation(id, locale, fields, at);
            // The post's own timestamp moves too: a translation is a change to the post, and a
            // dashboard sorted by "recently touched" that ignored them would bury active work.
            this.#stmt('UPDATE posts SET updated_at = ? WHERE id = ?').run(at, id);

            return this.byId(id);
        });
    }

    /**
     * Drops one language of a post.
     *
     * Refuses to remove the DEFAULT one: that is the language every other reader falls back to,
     * so deleting it would leave the post unreadable for anybody whose language is missing. The
     * dashboard changes the default first, which is a deliberate act rather than a side effect.
     */
    public removeTranslation(id: number, locale: PostLocale): 'removed' | 'missing' | 'default'
    {
        const post = this.#stmt('SELECT * FROM posts WHERE id = ?').get(id) as PostRow | undefined;

        if (post === undefined)
        {
            return 'missing';
        }

        if (post.default_locale === locale)
        {
            return 'default';
        }

        const changes = this.#stmt('DELETE FROM post_translations WHERE post_id = ? AND locale = ?')
            .run(id, locale).changes;

        return changes > 0 ? 'removed' : 'missing';
    }

    #writeTranslation(id: number, locale: PostLocale, fields: TranslationFields, at: number): void
    {
        this.#stmt(`
            INSERT INTO post_translations (post_id, locale, title, summary, body, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
            ON CONFLICT (post_id, locale) DO UPDATE SET
                title = excluded.title, summary = excluded.summary,
                body = excluded.body, updated_at = excluded.updated_at`)
            .run(id, locale, fields.title, fields.summary, fields.body, at);
    }

    /** Whether a slug is already taken, optionally ignoring the post being edited. */
    public slugTaken(slug: string, exceptId?: number): boolean
    {
        const row = this.#stmt('SELECT id FROM posts WHERE slug = ?').get(slug) as { id: number } | undefined;

        return row !== undefined && row.id !== exceptId;
    }
}

/** The site's own locale order, for anything that lists the languages a post holds. */
export const localeOrder = (locale: PostLocale): number => POST_LOCALES.indexOf(locale);
