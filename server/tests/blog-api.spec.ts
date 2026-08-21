// The blog's public read API - what a visitor can reach without a key.
//
// The store's own suite already covers the fallback chain and the cascade. What is worth
// pinning HERE is the boundary: that a draft is unreachable by any arrangement of parameters,
// that a malformed query is refused rather than coerced into something plausible, and that the
// locale a reader asks for reaches the resolver at all.
import { describe, it, expect, afterEach } from 'vitest';

import type { PostDetail, PostPage, TagCount } from '../src/schemas.ts';
import { closeAll, harness, postFields, postText } from './support/fixtures.ts';

afterEach(closeAll);

describe('the blog index', () =>
{
    it('lists published posts in a countable envelope', async () =>
    {
        const { store, json } = harness();

        store.create(postFields({ slug: 'first' }), 'en', postText({ title: 'First' }));
        store.create(postFields({ slug: 'second' }), 'en', postText({ title: 'Second' }));

        const page = await json<PostPage>('/api/blog');

        expect(page.total).toBe(2);
        expect(page.page).toBe(1);
        expect(page.pages).toBe(1);
        expect(page.rows.map((row) => row.slug)).toContain('first');
        // No body in a card: a list carrying every post's full text is a download.
        expect((page.rows[0] as unknown as { body?: string }).body).toBeUndefined();
    });

    it('never reaches a draft, whatever the caller asks for', async () =>
    {
        // Drafts are absent from the reader's query rather than filtered downstream, so there
        // is no page, limit or tag that walks into one.
        const { store, get, json } = harness();

        store.create(postFields({ slug: 'secret', status: 'draft' }), 'en', postText());

        expect((await json<PostPage>('/api/blog')).total).toBe(0);
        expect((await json<PostPage>('/api/blog?limit=50&page=1')).total).toBe(0);
        expect((await json<PostPage>('/api/blog?tag=release')).total).toBe(0);
        expect((await get('/api/blog/secret')).status).toBe(404);
    });

    it('pages, and reports the page count the pager draws', async () =>
    {
        const { store, json } = harness();

        for (let at = 0; at < 5; at++)
        {
            store.create(postFields({ slug: `post-${ at }` }), 'en', postText());
        }

        const first = await json<PostPage>('/api/blog?limit=2');

        expect(first.rows).toHaveLength(2);
        expect(first.pages).toBe(3);
        expect(first.total).toBe(5);

        const last = await json<PostPage>('/api/blog?limit=2&page=3');

        expect(last.rows).toHaveLength(1);
        expect(last.page).toBe(3);
    });

    it('refuses a malformed query rather than coercing it into something plausible', async () =>
    {
        const { get } = harness();

        expect((await get('/api/blog?limit=0')).status).toBe(422);
        expect((await get('/api/blog?limit=500')).status).toBe(422);
        expect((await get('/api/blog?page=0')).status).toBe(422);
        // A locale the site does not ship. Silently serving English would hide a real bug -
        // most likely the site offering a language the server has never heard of.
        expect((await get('/api/blog?locale=de')).status).toBe(422);
    });

    it('narrows to a tag', async () =>
    {
        const { store, json } = harness();

        store.create(postFields({ slug: 'one', tags: ['release'] }), 'en', postText());
        store.create(postFields({ slug: 'two', tags: ['wallet'] }), 'en', postText());

        expect((await json<PostPage>('/api/blog?tag=wallet')).rows.map((row) => row.slug)).toEqual(['two']);
    });
});

describe('reading one post', () =>
{
    it('serves the reader the language they asked for, and says so', async () =>
    {
        const { store, json } = harness();
        const created = store.create(postFields({ defaultLocale: 'en' }), 'en', postText());

        store.upsertTranslation(created.post.id, 'fa', postText({ title: 'شبکه اصلی نورا' }));

        const persian = await json<PostDetail>('/api/blog/nura-mainnet-is-live?locale=fa');

        expect(persian.locale).toBe('fa');
        expect(persian.requestedLocale).toBe('fa');
        expect(persian.translated).toBe(true);
        expect(persian.title).toBe('شبکه اصلی نورا');
        expect(persian.body).toBeTypeOf('string');
    });

    it('falls back, and reports BOTH languages so the page can name them', async () =>
    {
        // A bare `translated: false` is not enough to write the notice with: it has to say
        // which language the reader is actually looking at.
        const { store, json } = harness();

        store.create(postFields({ defaultLocale: 'en' }), 'en', postText());

        const spanish = await json<PostDetail>('/api/blog/nura-mainnet-is-live?locale=es');

        expect(spanish.requestedLocale).toBe('es');
        expect(spanish.locale).toBe('en');
        expect(spanish.translated).toBe(false);
        expect(spanish.available).toEqual(['en']);
    });

    it('defaults to English when no language is named', async () =>
    {
        const { store, json } = harness();

        store.create(postFields(), 'en', postText());

        expect((await json<PostDetail>('/api/blog/nura-mainnet-is-live')).requestedLocale).toBe('en');
    });

    it('404s an unknown slug rather than inventing a post', async () =>
    {
        const { get } = harness();

        expect((await get('/api/blog/nothing-here')).status).toBe(404);
    });
});

describe('tags', () =>
{
    it('answers /tags with tags, not with a post called "tags"', async () =>
    {
        // The static segment has to win over the `/:slug` parameter beside it. This is the
        // assertion that says so - the declaration order above is only belt and braces.
        const { store, json } = harness();

        store.create(postFields({ slug: 'one', tags: ['release', 'wallet'] }), 'en', postText());
        store.create(postFields({ slug: 'two', tags: ['release'] }), 'en', postText());

        const tags = await json<TagCount[]>('/api/blog/tags');

        expect(tags).toEqual([
            { tag: 'release', count: 2 },
            { tag: 'wallet', count: 1 }
        ]);
    });

    it('offers no tag that only a draft carries', async () =>
    {
        const { store, json } = harness();

        store.create(postFields({ slug: 'hidden', status: 'draft', tags: ['unreleased'] }), 'en', postText());

        expect(await json<TagCount[]>('/api/blog/tags')).toEqual([]);
    });
});
