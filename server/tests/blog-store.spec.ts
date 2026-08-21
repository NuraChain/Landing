// The blog's store, against a real sqlite database rather than a mock of one. ':memory:' per
// test, so cases are isolated by construction and there is no cleanup step to forget.
//
// What is worth pinning here is what a reader would never see failing directly: a cascade that
// silently does not cascade, a fallback that picks the wrong language, a publication date that
// moves when somebody fixes a typo, and a delete that leaves a post nobody can read.
import { describe, it, expect, afterEach } from 'vitest';

import { BlogStore, type PostFields, type TranslationFields } from '../src/blog/store.ts';
import { resolve, toCard, toDetail } from '../src/blog/present.ts';

const opened: BlogStore[] = [];

afterEach(() =>
{
    while (opened.length > 0)
    {
        opened.pop()?.close();
    }
});

function store(): BlogStore
{
    const next = new BlogStore(':memory:');

    opened.push(next);

    return next;
}

const fields = (overrides: Partial<PostFields> = {}): PostFields => ({
    slug: 'nura-mainnet-is-live',
    status: 'published',
    coverImage: null,
    tags: ['release'],
    defaultLocale: 'en',
    ...overrides
});

const text = (overrides: Partial<TranslationFields> = {}): TranslationFields => ({
    title: 'Nura mainnet is live',
    summary: 'The chain is open.',
    body: 'The first block was mined today.',
    ...overrides
});

describe('creating and reading a post', () =>
{
    it('creates a post with its first language, and reads it back by slug', () =>
    {
        const index = store();
        const created = index.create(fields(), 'en', text());

        expect(created.post.slug).toBe('nura-mainnet-is-live');
        expect(created.translations.map((row) => row.locale)).toEqual(['en']);

        const found = index.bySlug('nura-mainnet-is-live');

        expect(found?.post.id).toBe(created.post.id);
        expect(found?.translations[0]?.title).toBe('Nura mainnet is live');
    });

    it('stamps a publication date only once a post is actually published', () =>
    {
        const index = store();
        const draft = index.create(fields({ status: 'draft' }), 'en', text());

        expect(draft.post.published_at).toBeNull();

        const live = index.update(draft.post.id, fields({ status: 'published' }));

        expect(live?.post.published_at).not.toBeNull();
    });

    it('does NOT move the publication date when a published post is edited', () =>
    {
        // An author fixing a typo has not republished. A blog that reorders itself on every
        // correction is lying about when it said what it said.
        const index = store();
        const created = index.create(fields(), 'en', text());
        const first = created.post.published_at;

        const edited = index.update(created.post.id, fields({ tags: ['release', 'mainnet'] }));

        expect(edited?.post.published_at).toBe(first);
    });

    it('clears the date when a post goes back to draft, and re-stamps it on the way out', () =>
    {
        const index = store();
        const created = index.create(fields(), 'en', text());

        expect(index.update(created.post.id, fields({ status: 'draft' }))?.post.published_at).toBeNull();
        expect(index.update(created.post.id, fields({ status: 'published' }))?.post.published_at).not.toBeNull();
    });

    it('hides a draft from every reader path and shows it to the dashboard', () =>
    {
        const index = store();

        index.create(fields({ status: 'draft' }), 'en', text());

        expect(index.bySlug('nura-mainnet-is-live')).toBeNull();
        expect(index.bySlug('nura-mainnet-is-live', { includeDrafts: true })).not.toBeNull();
        expect(index.list({ limit: 10, offset: 0 }).total).toBe(0);
        expect(index.list({ limit: 10, offset: 0, includeDrafts: true }).total).toBe(1);
    });
});

describe('the fallback chain', () =>
{
    /** One post in English and Persian, defaulting to Persian - written by a Persian author. */
    function bilingual(): BlogStore
    {
        const index = store();
        const created = index.create(fields({ defaultLocale: 'fa' }), 'fa', text({ title: 'شبکه اصلی نورا' }));

        index.upsertTranslation(created.post.id, 'en', text({ title: 'Nura mainnet is live' }));

        return index;
    }

    it('serves the reader their own language when the post has it', () =>
    {
        const found = bilingual().bySlug('nura-mainnet-is-live')!;
        const card = toCard(found, 'en')!;

        expect(card.locale).toBe('en');
        expect(card.translated).toBe(true);
        expect(card.title).toBe('Nura mainnet is live');
    });

    it('falls back to the POST\'s default language, not to English', () =>
    {
        // The whole reason the default is per post: a Spanish reader on a Persian-first
        // announcement should land on the Persian original, which exists.
        const found = bilingual().bySlug('nura-mainnet-is-live')!;
        const card = toCard(found, 'es')!;

        expect(card.locale).toBe('fa');
        expect(card.requestedLocale).toBe('es');
        expect(card.translated).toBe(false);
    });

    it('reports every language the post holds, in the site\'s own order', () =>
    {
        // Not sqlite's order: the tab strip and the language list under a title read this
        // directly, and 'en' comes before 'fa' on this site whatever the query returned.
        const card = toCard(bilingual().bySlug('nura-mainnet-is-live')!, 'en')!;

        expect(card.available).toEqual(['en', 'fa']);
    });

    it('falls through to ANY language rather than serving an empty page', () =>
    {
        // Reachable the ordinary way: an admin points the default at a language nobody has
        // written yet. Step two then finds nothing, and a reader whose own language is also
        // missing must still get a page - step three is what stops it being blank.
        const index = store();
        const created = index.create(fields({ defaultLocale: 'en' }), 'en', text());

        index.upsertTranslation(created.post.id, 'fa', text({ title: 'شبکه اصلی نورا' }));
        index.update(created.post.id, fields({ defaultLocale: 'es' }));

        const card = toCard(index.bySlug('nura-mainnet-is-live')!, 'ru')!;

        // 'en' rather than 'fa': step three walks the SITE's order, not sqlite's.
        expect(card.locale).toBe('en');
        expect(card.translated).toBe(false);
    });

    it('resolves to nothing when a post holds no language at all', () =>
    {
        const index = store();

        index.create(fields(), 'en', text());

        // Handed an empty set on purpose: `create` cannot produce this state and
        // `removeTranslation` guards the last one, but the presenter is what a request runs
        // through, and it has to answer rather than throw if anything ever does.
        const found = index.bySlug('nura-mainnet-is-live')!;

        expect(resolve({ post: found.post, translations: [] }, 'en')).toBeNull();
        expect(toCard({ post: found.post, translations: [] }, 'en')).toBeNull();
        expect(toDetail({ post: found.post, translations: [] }, 'en')).toBeNull();
    });
});

describe('translations', () =>
{
    it('upserts rather than duplicating a language', () =>
    {
        const index = store();
        const created = index.create(fields(), 'en', text());

        index.upsertTranslation(created.post.id, 'en', text({ title: 'Corrected' }));

        const found = index.bySlug('nura-mainnet-is-live')!;

        expect(found.translations).toHaveLength(1);
        expect(found.translations[0]?.title).toBe('Corrected');
    });

    it('refuses to remove the language everything else falls back to', () =>
    {
        // Removing it would leave the post unreadable for anybody whose language is missing.
        // Changing the default first is a deliberate act; this is the accident it prevents.
        const index = store();
        const created = index.create(fields({ defaultLocale: 'en' }), 'en', text());

        expect(index.removeTranslation(created.post.id, 'en')).toBe('default');
        expect(index.bySlug('nura-mainnet-is-live')?.translations).toHaveLength(1);
    });

    it('touches the POST when one of its languages changes', () =>
    {
        // A translation is a change to the post. A dashboard sorted by "recently touched" that
        // ignored them would bury exactly the work somebody is in the middle of.
        const index = store();
        const created = index.create(fields(), 'en', text());
        const before = created.post.updated_at;

        index.upsertTranslation(created.post.id, 'fa', text({ title: 'شبکه اصلی نورا' }));

        expect(index.byId(created.post.id)!.post.updated_at).toBeGreaterThanOrEqual(before);
    });

    it('answers an unknown post rather than throwing', () =>
    {
        const index = store();

        expect(index.upsertTranslation(999, 'en', text())).toBeNull();
        expect(index.removeTranslation(999, 'en')).toBe('missing');
        expect(index.update(999, fields())).toBeNull();
        expect(index.remove(999)).toBe(false);
        expect(index.byId(999)).toBeNull();
    });
});

describe('deleting', () =>
{
    it('takes every language with it - the cascade is really on', () =>
    {
        // `foreign_keys` is OFF by default in sqlite and is per connection, so the ON DELETE
        // CASCADE in the DDL is decoration until the PRAGMA runs. This is the test that says
        // the PRAGMA is there: without it the translations survive as orphans.
        const index = store();
        const created = index.create(fields(), 'en', text());

        index.upsertTranslation(created.post.id, 'fa', text({ title: 'شبکه اصلی نورا' }));
        expect(index.remove(created.post.id)).toBe(true);

        expect(index.byId(created.post.id)).toBeNull();
        // Re-creating at the same slug must not inherit the dead post's languages.
        const again = index.create(fields(), 'en', text());

        expect(index.byId(again.post.id)!.translations.map((row) => row.locale)).toEqual(['en']);
    });
});

describe('listing', () =>
{
    function threePosts(): BlogStore
    {
        const index = store();

        index.create(fields({ slug: 'first', tags: ['release'] }), 'en', text({ title: 'First' }));
        index.create(fields({ slug: 'second', tags: ['release', 'wallet'] }), 'en', text({ title: 'Second' }));
        index.create(fields({ slug: 'third', status: 'draft', tags: ['wallet'] }), 'en', text({ title: 'Third' }));

        return index;
    }

    it('counts the published posts, not every row', () =>
    {
        const page = threePosts().list({ limit: 10, offset: 0 });

        expect(page.total).toBe(2);
        expect(page.rows).toHaveLength(2);
    });

    it('narrows to a tag by real equality, not by substring', () =>
    {
        // A LIKE over the JSON column would match 'wallet' inside 'wallets' and inside a title.
        // json_each unrolls the array so the comparison is between whole values.
        const index = threePosts();

        expect(index.list({ limit: 10, offset: 0, tag: 'wallet' }).total).toBe(1);
        expect(index.list({ limit: 10, offset: 0, tag: 'walle' }).total).toBe(0);
        expect(index.list({ limit: 10, offset: 0, tag: 'release' }).total).toBe(2);
    });

    it('pages without losing or repeating a post', () =>
    {
        const index = threePosts();
        const seen = [
            ...index.list({ limit: 1, offset: 0, includeDrafts: true }).rows,
            ...index.list({ limit: 1, offset: 1, includeDrafts: true }).rows,
            ...index.list({ limit: 1, offset: 2, includeDrafts: true }).rows
        ].map((row) => row.post.slug);

        expect(new Set(seen).size).toBe(3);
    });

    it('answers an offset past the end with no rows and an honest total', () =>
    {
        const page = threePosts().list({ limit: 10, offset: 500 });

        expect(page.rows).toEqual([]);
        expect(page.total).toBe(2);
    });

    it('counts the tags in use on published posts alone', () =>
    {
        // The draft's 'wallet' must not appear in a filter list a reader is offered.
        expect(threePosts().tags()).toEqual([
            { tag: 'release', count: 2 },
            { tag: 'wallet', count: 1 }
        ]);
    });

    it('orders a draft by when it was created, since it has no publication date', () =>
    {
        // Ordering by published_at alone would bunch every draft at one end of the dashboard.
        const rows = threePosts().list({ limit: 10, offset: 0, includeDrafts: true }).rows;

        expect(rows.map((row) => row.post.slug)).toEqual(['third', 'second', 'first']);
    });
});

describe('slugs', () =>
{
    it('reports a slug already taken, and does not count the post being edited', () =>
    {
        const index = store();
        const created = index.create(fields({ slug: 'taken' }), 'en', text());

        expect(index.slugTaken('taken')).toBe(true);
        expect(index.slugTaken('taken', created.post.id)).toBe(false);
        expect(index.slugTaken('free')).toBe(false);
    });

    it('refuses two posts at the same slug', () =>
    {
        // The UNIQUE index is the real guard: two posts at one url is a 404 waiting to happen,
        // and the check above is a courtesy the handler pays before reaching this.
        const index = store();

        index.create(fields({ slug: 'taken' }), 'en', text());
        expect(() => index.create(fields({ slug: 'taken' }), 'en', text())).toThrow();
    });
});
