import { MemoryRateStore, clientIp, expireCookie, ipBucket, parseCookies, serializeCookie } from '@azerothjs/http';
import { guard } from '@azerothjs/http/api';

import type { AdminSession, SessionStore } from './sessions.ts';

/**
 * The gate in front of the dashboard.
 *
 * `/admin` not being linked from the site is convenience, not protection - a url nobody printed
 * is still a url. Everything that actually keeps a stranger out is in this file.
 */

/**
 * The cookie the session rides in.
 *
 * `__Host-` in production: the prefix is what pins a cookie to this exact host, and the browser
 * ENFORCES it - a `__Host-` cookie without Secure, or with a Domain, or on a path other than /,
 * is silently dropped. That last part is why the name changes in development: over plain http
 * the Secure attribute cannot be satisfied, so a `__Host-` cookie would appear to be set and
 * then simply not exist, and the dashboard would log in and immediately be logged out.
 */
export const cookieName = (secure: boolean): string => secure ? '__Host-nura_admin' : 'nura_admin';

/**
 * The header the admin client sends on every call.
 *
 * This is the CSRF defence, and it works because of what a browser will NOT do: script on
 * another origin cannot set a custom header on a cross-site request without a preflight, and
 * this server answers no CORS preflight at all. A form post - the classic CSRF vector - cannot
 * set headers under any circumstances.
 *
 * beta.2 ships no csrfProtect helper, so this is hand-rolled; it is paired with SameSite=Strict
 * on the cookie above, which independently stops the cookie being sent cross-site in the first
 * place. Either one alone would do; both is what makes it not worth thinking about again.
 */
export const ADMIN_HEADER = 'x-nura-admin';

export interface GuardDeps
{
    sessions: SessionStore;
    /** Whether cookies are minted Secure - production, in practice. */
    secure: boolean;
    /** Null disables the dashboard entirely: development with no key configured. */
    key: string | null;
    /** Behind a reverse proxy this must be on, or every client shares the proxy's rate bucket. */
    trustProxy?: boolean;
}

const deny = (status: number, code: string, message: string): Response =>
    new Response(JSON.stringify({ error: { code, message } }), {
        status,
        headers: { 'content-type': 'application/json' }
    });

/**
 * How many key attempts one address gets, and over how long.
 *
 * Sized against the key rather than against annoyance: at five per fifteen minutes, working
 * through a 76-bit space is not a thing that finishes. The fixed-window arithmetic means the
 * real instantaneous ceiling is twice this across a boundary, which is accounted for here -
 * ten attempts in a moment is still nowhere.
 */
const LOGIN_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export function adminGuards(deps: GuardDeps)
{
    const loginAttempts = new MemoryRateStore();

    /** The session token this request carries, if any. One place knows the cookie's name. */
    const readToken = (request: Request): string | undefined =>
        parseCookies(request)[cookieName(deps.secure)];

    /**
     * Same-origin only, for anything that changes state.
     *
     * `Sec-Fetch-Site` is set by the browser itself and cannot be touched by page script, so it
     * is checked first and trusted absolutely. It is also proxy-independent, which an Origin
     * comparison against the request's own url is not: behind a reverse proxy the server sees
     * `http://internal:3000` while the browser sent `https://nura.example`, and a naive
     * comparison would reject every real request.
     *
     * A caller that sends no `Sec-Fetch-Site` at all (curl, an older browser, a script) has to
     * present the custom header instead - which a cross-site page cannot.
     */
    const sameOrigin = guard((context) =>
    {
        const site = context.request.headers.get('sec-fetch-site');

        if (site !== null)
        {
            return site === 'same-origin'
                ? undefined
                : deny(403, 'cross_site', 'This request did not come from the dashboard.');
        }

        return context.request.headers.get(ADMIN_HEADER) === null
            ? deny(403, 'cross_site', 'This request did not come from the dashboard.')
            : undefined;
    });

    /**
     * A live session, or 401.
     *
     * Returns the session so every handler behind it has it on the context, typed - which is
     * also what makes it impossible to write an admin route that forgets to check.
     */
    const requireAdmin = guard((context): { admin: AdminSession } | Response =>
    {
        if (deps.key === null)
        {
            // No key configured: the dashboard does not exist, rather than existing unlocked.
            return deny(503, 'admin_disabled', 'No admin key is configured on this deployment.');
        }

        const token = readToken(context.request);

        if (token === undefined)
        {
            return deny(401, 'unauthorized', 'Sign in to continue.');
        }

        const admin = deps.sessions.verify(token);

        if (admin === null)
        {
            return deny(401, 'unauthorized', 'That session has expired.');
        }

        return { admin };
    });

    /** Counts one key attempt against the caller's address; a Response means they are out. */
    const throttleLogin = (request: Request): Response | undefined =>
    {
        const address = clientIp(request, { trustProxy: deps.trustProxy ?? false });
        // An address the socket could not give us is bucketed together rather than exempted:
        // "unknown" must be the most restricted case, never the unlimited one.
        const key = address === undefined ? 'unknown' : ipBucket(address);
        const decision = loginAttempts.hit(`login:${ key }`, LOGIN_LIMIT, LOGIN_WINDOW_MS);

        return decision.limited
            ? deny(429, 'too_many_attempts', 'Too many attempts. Wait a few minutes and try again.')
            : undefined;
    };

    const setCookie = (token: string, maxAge: number): string =>
        serializeCookie(cookieName(deps.secure), token, {
            maxAge,
            path: '/',
            httpOnly: true,
            secure: deps.secure,
            // Strict, not Lax: nothing about this cookie should travel on a cross-site
            // navigation. There is no "arrive at the dashboard from a link on another site"
            // flow worth keeping, and Lax would send it on exactly that.
            sameSite: 'strict'
        });

    const clearCookie = (): string =>
        expireCookie(cookieName(deps.secure), { path: '/', secure: deps.secure });

    return { sameOrigin, requireAdmin, throttleLogin, readToken, setCookie, clearCookie };
}

export type AdminGuards = ReturnType<typeof adminGuards>;
