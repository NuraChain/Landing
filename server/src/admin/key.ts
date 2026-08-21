import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * The admin key: the one secret this deployment has.
 *
 * It never reaches the browser bundle, it is never written to the database, and it is never
 * compared with `===`. Everything below exists for one of those three reasons.
 */

/**
 * The shape the generator produces: `XXXX-XXXX-XXXX-XXXX`.
 *
 * The alphabet excludes I, O, 0 and 1 - a key gets read off one screen and typed into another,
 * and those four are the pairs that get transcribed wrong. Twenty-eight remaining symbols over
 * sixteen positions is about 76 bits, which is not brute-forceable through a rate-limited login.
 */
export const KEY_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
export const KEY_PATTERN = /^[A-Z0-9]{4}(?:-[A-Z0-9]{4}){3}$/;

/**
 * The floor a key must clear to be accepted at boot.
 *
 * Not the same as matching KEY_PATTERN: a deployment is free to use a longer passphrase from a
 * password manager, and refusing it because it is not four groups of four would push people
 * toward the shape rather than the strength. What is refused is anything SHORT.
 */
const MIN_KEY_LENGTH = 16;

/** Trimmed and upper-cased, so a key pasted with a stray space or in lower case still works. */
export function normalizeKey(value: string): string
{
    return value.trim().toUpperCase();
}

/** Whether a key is long enough to be worth having. Counts real characters, not separators. */
export function keyIsStrong(value: string): boolean
{
    return normalizeKey(value).replace(/-/g, '').length >= MIN_KEY_LENGTH;
}

/**
 * Whether a candidate matches, in constant time.
 *
 * Both sides are hashed first, which does two things a bare `timingSafeEqual` cannot: it makes
 * the compared buffers the same length whatever was submitted (the function throws on a length
 * mismatch, and that throw is itself an oracle for the key's length), and it means the
 * comparison time carries no information about how many leading characters were right.
 *
 * A plain `===` would return on the first differing byte, which leaks the key one character at a
 * time to anyone who can measure it.
 */
export function matchesKey(candidate: string, expected: string): boolean
{
    const left = createHash('sha256').update(normalizeKey(candidate), 'utf8').digest();
    const right = createHash('sha256').update(normalizeKey(expected), 'utf8').digest();

    return timingSafeEqual(left, right);
}

export interface KeyCheck
{
    /** The key to compare against, already normalized. */
    key: string;
}

/**
 * Reads the configured key, refusing to start rather than starting insecure.
 *
 * A missing key in DEVELOPMENT is allowed and disables the dashboard outright - a contributor
 * running the site to fix a margin should not have to invent a secret first, and "no key
 * configured" must never mean "no key required".
 *
 * In production both a missing and a weak key are fatal. The alternative - defaulting to
 * something, warning, and serving anyway - produces exactly the deployment where the dashboard
 * is reachable and nobody knows it.
 */
export function loadAdminKey(raw: string | undefined, options: { production: boolean }): KeyCheck | null
{
    const value = raw === undefined ? '' : normalizeKey(raw);

    if (value === '')
    {
        if (options.production)
        {
            throw new Error(
                'ADMIN_KEY is not set. The dashboard cannot be served without one - generate a key '
                + 'with `npm run admin:key --workspace server` and put it in server/.env.');
        }

        return null;
    }

    if (!keyIsStrong(value))
    {
        throw new Error(
            `ADMIN_KEY is too short to be safe (${ value.replace(/-/g, '').length } characters, minimum `
            + `${ MIN_KEY_LENGTH }). Generate one with \`npm run admin:key --workspace server\`.`);
    }

    return { key: value };
}
