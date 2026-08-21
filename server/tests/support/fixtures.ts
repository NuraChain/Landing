// Shared fixtures for the server suite.
//
// Every spec builds the same two things - an in-memory store and an app over it - so they live
// here once rather than being copied per file. Nothing here opens a socket or touches the disk:
// the database is ':memory:' and the app is driven through `app.handle`, which is what lets the
// whole suite run offline, in any order, with nothing to clean up.
import { buildApp } from '../../src/app.ts';
import { BlogStore, type PostFields, type TranslationFields } from '../../src/blog/store.ts';
import type { App } from '@azerothjs/http';

export interface Harness
{
    store: BlogStore;
    app: App;
    get: (path: string) => Promise<Response>;
    json: <T>(path: string) => Promise<T>;
}

/** Every store a test opens, so the caller can close them all in one `afterEach`. */
export const opened: BlogStore[] = [];

export function closeAll(): void
{
    while (opened.length > 0)
    {
        opened.pop()?.close();
    }
}

export function harness(): Harness
{
    const store = new BlogStore(':memory:');

    opened.push(store);

    const app = buildApp({ store, dev: false });
    const get = (path: string): Promise<Response> => app.handle(new Request(`http://local${ path }`));

    return {
        store,
        app,
        get,
        json: async <T>(path: string): Promise<T> => (await get(path)).json() as Promise<T>
    };
}

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
