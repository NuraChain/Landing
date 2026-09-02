// Shared fixtures for the server suite.
//
// Every spec builds the same two things - a blog and an app over it - so they live here once
// rather than being copied per file. Nothing here opens a socket or touches the DISK: posts are
// declared inline and handed to `BlogContent` directly, never read through `loadArticles`, and
// the app is driven through `app.handle`. That is what lets the suite run offline, in any
// order, with nothing to clean up.
//
// The repository's real cluster is exercised by content.spec.ts, which is the one place that
// reads the filesystem on purpose.
import type { App } from '@azerothjs/http';

import { buildApp } from '../../src/app.ts';
import { BlogContent, type LoadedPost, type PostRow, type TranslationRow } from '../../src/blog/content.ts';
import type { PriceGateway } from '../../src/market/price.ts';
import type { PostLocale } from '../../src/schemas.ts';
import type { WhitepaperContent, WhitepaperTranslation } from '../../src/whitepaper/content.ts';

export interface Harness
{
    store: BlogContent;
    app: App;
    get: (path: string) => Promise<Response>;
    json: <T>(path: string) => Promise<T>;
}

export interface HarnessOptions
{
    /** The blog this app serves. Defaults to a single published post in English. */
    posts?: LoadedPost[];

    /** The whitepaper this app serves. Defaults to one English translation. */
    whitepaper?: WhitepaperContent;

    /** Where the PDFs are served from. Omitted by default: no spec reads a disk it did not write. */
    pdfDir?: string;

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

/** One language of a post, with everything a spec does not care about already filled in. */
export const translation = (
    locale: PostLocale,
    overrides: Partial<TranslationRow> = {}
): TranslationRow => ({
    locale,
    title: `Nura mainnet is live (${ locale })`,
    summary: 'The chain is open.',
    body: 'The first block was mined today.',
    ...overrides
});

/**
 * A whole post.
 *
 * Dates default to one fixed instant rather than to "now": a spec that asserts on ordering or
 * on the sitemap's lastmod has to be reading a value it chose, and a clock would make those
 * assertions depend on when the suite ran.
 */
export const post = (
    overrides: Partial<PostRow> = {},
    translations: TranslationRow[] = [translation('en')]
): LoadedPost => ({
    post: {
        slug: 'nura-mainnet-is-live',
        status: 'published',
        coverImage: null,
        tags: ['release'],
        defaultLocale: 'en',
        publishedAt: '2026-08-22T00:40:57.000Z',
        updatedAt: '2026-08-22T00:40:57.000Z',
        ...overrides
    },
    translations
});

/** One language of the whitepaper, with everything a spec does not care about filled in. */
export const chapter = (
    locale: PostLocale,
    overrides: Partial<WhitepaperTranslation> = {}
): WhitepaperTranslation => ({
    locale,
    title: `Nura Chain Whitepaper (${ locale })`,
    summary: 'The reference description of the network.',
    body: '## 1. Introduction\n\nThe network seals a block every three seconds.',
    ...overrides
});

/** The whole whitepaper. Same fixed instant as `post`, for the same reason. */
export const whitepaper = (
    overrides: Partial<WhitepaperContent> = {},
    translations: WhitepaperTranslation[] = [chapter('en')]
): WhitepaperContent => ({
    revision: '1.0',
    publishedAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
    defaultLocale: 'en',
    translations,
    ...overrides
});

export function harness(options: HarnessOptions = {}): Harness
{
    const store = new BlogContent(options.posts ?? [post()]);
    const app = buildApp({
        store,
        whitepaper: options.whitepaper ?? whitepaper(),
        pdfDir: options.pdfDir,
        dev: false,
        market: options.market ?? offlineMarket
    });

    const get = (path: string): Promise<Response> => app.handle(new Request(`http://local${ path }`));

    return {
        store,
        app,
        get,
        json: async <T>(path: string): Promise<T> => (await get(path)).json() as Promise<T>
    };
}
