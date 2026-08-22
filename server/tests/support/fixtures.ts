// Shared fixtures for the server suite.
//
// Every spec builds the same three things - an in-memory store, a session store beside it, and
// an app over both - so they live here once rather than being copied per file. Nothing here
// opens a socket or touches the disk: the databases are ':memory:' and the app is driven through
// `app.handle`, which is what lets the suite run offline, in any order, with nothing to clean up.
import type { App } from '@azerothjs/http';

import { buildApp } from '../../src/app.ts';
import { ADMIN_HEADER } from '../../src/admin/guard.ts';
import { SessionStore } from '../../src/admin/sessions.ts';
import { BlogStore, type PostFields, type TranslationFields } from '../../src/blog/store.ts';
import type { PriceGateway } from '../../src/market/price.ts';

/** A key of the shape the generator produces, and long enough to pass the strength floor. */
export const TEST_KEY = 'ABCD-EFGH-JKLM-NPQR';

export interface Harness
{
    store: BlogStore;
    sessions: SessionStore;
    app: App;
    get: (path: string) => Promise<Response>;
    json: <T>(path: string) => Promise<T>;
    /** A same-origin POST, the way the dashboard's own client sends one. */
    post: (path: string, body: unknown, init?: { cookie?: string; sameOrigin?: boolean }) => Promise<Response>;
    /** Signs in with the configured key and returns the Cookie header value to reuse. */
    signIn: (key?: string) => Promise<string>;
}

export interface HarnessOptions
{
    /** Null models a deployment with no key: the dashboard is disabled, not unlocked. */
    adminKey?: string | null;
    secure?: boolean;

    /**
     * The price source. Defaults to one that refuses, NOT to the live swap.
     *
     * Every other spec builds a harness without thinking about the market, and the default has
     * to be safe for those: an app that fell through to `createPriceGateway()` would put a real
     * request to swap.nurachain.net one `get('/api/market/price')` away, and the suite's whole
     * premise is that a red build is a real change rather than somebody else's outage.
     */
    market?: PriceGateway;
}

/** The default gateway: reachable, and always down. */
const offlineMarket: PriceGateway = {
    read: () => Promise.reject(new Error('No price source in this test.'))
};

const opened: Array<{ close: () => void }> = [];

export function closeAll(): void
{
    while (opened.length > 0)
    {
        opened.pop()?.close();
    }
}

/** The cookie a Set-Cookie header just minted, ready to send back. */
export function cookieFrom(response: Response): string
{
    const header = response.headers.get('set-cookie') ?? '';

    return header.split(';')[0] ?? '';
}

export function harness(options: HarnessOptions = {}): Harness
{
    const store = new BlogStore(':memory:');
    const sessions = new SessionStore(':memory:');

    opened.push(store, sessions);

    const adminKey = options.adminKey === undefined ? TEST_KEY : options.adminKey;
    const app = buildApp({
        store,
        sessions,
        adminKey,
        secure: options.secure ?? false,
        dev: false,
        market: options.market ?? offlineMarket
    });

    const get = (path: string): Promise<Response> => app.handle(new Request(`http://local${ path }`));

    const post: Harness['post'] = (path, body, init = {}) =>
    {
        const headers: Record<string, string> = { 'content-type': 'application/json' };

        // A real browser sends this and page script cannot forge it; the guard trusts it first.
        // Tests that mean to model a cross-site attempt pass `sameOrigin: false`.
        if (init.sameOrigin !== false)
        {
            headers['sec-fetch-site'] = 'same-origin';
        }

        if (init.cookie !== undefined)
        {
            headers['cookie'] = init.cookie;
        }

        return app.handle(new Request(`http://local${ path }`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers
        }));
    };

    return {
        store,
        sessions,
        app,
        get,
        json: async <T>(path: string): Promise<T> => (await get(path)).json() as Promise<T>,
        post,
        signIn: async (key = TEST_KEY): Promise<string> =>
        {
            const response = await post('/api/admin/session', { key });

            return cookieFrom(response);
        }
    };
}

/** The header a non-browser caller has to present instead of Sec-Fetch-Site. */
export const adminHeader = { [ADMIN_HEADER]: '1' };

export const postFields = (overrides: Partial<PostFields> = {}): PostFields => ({
    slug: 'nura-mainnet-is-live',
    status: 'published',
    coverImage: null,
    tags: ['release'],
    defaultLocale: 'en',
    ...overrides
});

export const postText = (overrides: Partial<TranslationFields> = {}): TranslationFields => ({
    title: 'Nura mainnet is live',
    summary: 'The chain is open.',
    body: 'The first block was mined today.',
    ...overrides
});
