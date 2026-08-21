import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { createHash, randomBytes } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Admin sessions.
 *
 * Stateful rather than a signed stateless cookie, and the reason is revocation: a session row
 * can be deleted, so a lost laptop is one query rather than a key rotation that logs out every
 * device and invalidates the key printed in somebody's password manager. It is also the shape
 * that survives a second admin being added, which is the direction this dashboard is meant to
 * grow in.
 */

/** How long a session lasts without being renewed. Long enough to write a post, not a month. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

const DDL = `
CREATE TABLE IF NOT EXISTS admin_sessions (
    id_hash TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON admin_sessions (expires_at);
`;

export interface AdminSession
{
    createdAt: number;
    expiresAt: number;
}

export interface IssuedSession extends AdminSession
{
    /** The value the cookie carries. Returned ONCE, at creation - it is never stored as-is. */
    token: string;
}

/**
 * The token as it is stored.
 *
 * Hashed, for the same reason a password is: a session id is a bearer credential, so a database
 * that leaks - a backup on a laptop, a copied file - would otherwise hand over live logins. The
 * cookie carries the raw token and only its digest is ever written down.
 *
 * No salt and no slow KDF, deliberately: this is 32 bytes of CSPRNG output, not a human-chosen
 * password, so there is no dictionary to run and nothing for a work factor to buy.
 */
const digest = (token: string): string => createHash('sha256').update(token, 'utf8').digest('hex');

export class SessionStore
{
    readonly #db: DatabaseSync;
    readonly #statements = new Map<string, StatementSync>();

    /**
     * Opens its OWN connection to the database file.
     *
     * A session is not blog content: it has a different lifetime, a different backup story and
     * no business inside the migration that versions the posts table. Two connections to one
     * sqlite file is ordinary under WAL, and `busy_timeout` covers the moment at boot where both
     * halves want the write lock.
     */
    constructor(path: string)
    {
        if (path !== ':memory:')
        {
            const parent = dirname(resolve(path));

            if (!existsSync(parent))
            {
                mkdirSync(parent, { recursive: true });
            }
        }

        this.#db = new DatabaseSync(path);
        this.#db.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA busy_timeout = 5000;`);
        this.#db.exec(DDL);
    }

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

    public close(): void
    {
        this.#db.close();
    }

    #now(): number
    {
        return Math.floor(Date.now() / 1000);
    }

    /** Mints a session. 32 bytes of CSPRNG output - guessing one is not a strategy. */
    public create(ttlSeconds = SESSION_TTL_SECONDS): IssuedSession
    {
        const token = randomBytes(32).toString('base64url');
        const createdAt = this.#now();
        const expiresAt = createdAt + ttlSeconds;

        this.#stmt('INSERT INTO admin_sessions (id_hash, created_at, expires_at) VALUES (?, ?, ?)')
            .run(digest(token), createdAt, expiresAt);

        // Opportunistic: expired rows are already unusable, this just stops the table growing
        // forever. Done on the write path so no reader ever pays for it.
        this.#stmt('DELETE FROM admin_sessions WHERE expires_at <= ?').run(createdAt);

        return { token, createdAt, expiresAt };
    }

    /**
     * The session behind a token, or null.
     *
     * An expired row answers null AND is deleted, so a stale cookie cannot be replayed even in
     * the window before the next sweep.
     */
    public verify(token: string): AdminSession | null
    {
        const hash = digest(token);
        const row = this.#stmt('SELECT created_at, expires_at FROM admin_sessions WHERE id_hash = ?')
            .get(hash) as { created_at: number; expires_at: number } | undefined;

        if (row === undefined)
        {
            return null;
        }

        if (row.expires_at <= this.#now())
        {
            this.#stmt('DELETE FROM admin_sessions WHERE id_hash = ?').run(hash);

            return null;
        }

        return { createdAt: row.created_at, expiresAt: row.expires_at };
    }

    public revoke(token: string): boolean
    {
        return this.#stmt('DELETE FROM admin_sessions WHERE id_hash = ?').run(digest(token)).changes > 0;
    }

    /** Every session, everywhere - what a rotated key or a lost device calls for. */
    public revokeAll(): number
    {
        return Number(this.#stmt('DELETE FROM admin_sessions').run().changes);
    }

    /** How many sessions are currently live. The dashboard shows it; the tests assert on it. */
    public count(): number
    {
        return (this.#stmt('SELECT COUNT(*) AS n FROM admin_sessions WHERE expires_at > ?')
            .get(this.#now()) as { n: number }).n;
    }
}
