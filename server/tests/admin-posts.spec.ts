// The dashboard's write API.
//
// Two things are tested here. The first is that every route is closed: a signed-out caller gets
// nothing, whichever verb they use. The second is that the editor's own hazards - a slug already
// taken, deleting the language a post falls back to - come back as conflicts a form can show
// rather than as a 500 that says nothing.
import { describe, it, expect, afterEach } from 'vitest';

import type { PostEditor, PostRecordPage } from '../src/schemas.ts';
import { closeAll, harness, postFields, postText, type Harness } from './support/fixtures.ts';

afterEach(closeAll);

/** A signed-in harness plus the cookie every call below carries. */
async function signedIn(): Promise<{ api: Harness; cookie: string }>
{
    const api = harness();
    const cookie = await api.signIn();

    return { api, cookie };
}

const NEW_POST = {
    ...postFields({ slug: 'a-new-post' }),
    locale: 'en' as const,
    translation: postText({ title: 'A new post' })
};

/** Any method, with the session cookie and the same-origin marker a browser would send. */
function send(api: Harness, method: string, path: string, body?: unknown, cookie?: string): Promise<Response>
{
    const headers: Record<string, string> = { 'sec-fetch-site': 'same-origin' };

    if (body !== undefined)
    {
        headers['content-type'] = 'application/json';
    }

    if (cookie !== undefined)
    {
        headers['cookie'] = cookie;
    }

    return api.app.handle(new Request(`http://local${ path }`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body)
    }));
}

describe('every write route is closed to a stranger', () =>
{
    it('refuses each one with 401 when there is no session', async () =>
    {
        // The point of guarding at the FEATURE rather than per route: this list is every write
        // path there is, and none of them had to remember to ask for protection.
        const api = harness();
        const calls: Array<[string, string, unknown?]> = [
            ['GET', '/api/admin/posts'],
            ['GET', '/api/admin/posts/1'],
            ['POST', '/api/admin/posts', NEW_POST],
            ['PATCH', '/api/admin/posts/1', postFields()],
            ['DELETE', '/api/admin/posts/1'],
            ['PUT', '/api/admin/posts/1/translations/fa', postText()],
            ['DELETE', '/api/admin/posts/1/translations/fa']
        ];

        for (const [method, path, body] of calls)
        {
            const response = await send(api, method, path, body);

            expect(response.status, `${ method } ${ path }`).toBe(401);
        }
    });

    it('refuses a cross-site call even when it carries a valid session', async () =>
    {
        // The cookie is SameSite=Strict so a browser would not send it at all; this covers the
        // case where something else does.
        const { api, cookie } = await signedIn();
        const response = await api.app.handle(new Request('http://local/api/admin/posts', {
            method: 'POST',
            headers: { 'content-type': 'application/json', cookie, 'sec-fetch-site': 'cross-site' },
            body: JSON.stringify(NEW_POST)
        }));

        expect(response.status).toBe(403);
    });

    it('refuses a session that has been signed out', async () =>
    {
        const { api, cookie } = await signedIn();

        expect((await send(api, 'GET', '/api/admin/posts', undefined, cookie)).status).toBe(200);

        await api.post('/api/admin/session/end', {}, { cookie });

        expect((await send(api, 'GET', '/api/admin/posts', undefined, cookie)).status).toBe(401);
    });
});

describe('creating a post', () =>
{
    it('creates it with its first language and returns the editor shape', async () =>
    {
        const { api, cookie } = await signedIn();
        const response = await send(api, 'POST', '/api/admin/posts', NEW_POST, cookie);

        expect(response.status).toBe(200);

        const editor = (await response.json()) as PostEditor;

        expect(editor.slug).toBe('a-new-post');
        expect(editor.translations.map((row) => row.locale)).toEqual(['en']);
        expect(editor.translations[0]?.title).toBe('A new post');
    });

    it('answers a taken slug with a conflict a form can show, not a 500', async () =>
    {
        // Two posts at one url is a 404 waiting to happen. Checked before the insert, so the
        // answer names the problem instead of surfacing a UNIQUE constraint.
        const { api, cookie } = await signedIn();

        await send(api, 'POST', '/api/admin/posts', NEW_POST, cookie);

        const clash = await send(api, 'POST', '/api/admin/posts', NEW_POST, cookie);

        expect(clash.status).toBe(409);
    });

    it('validates the post at the boundary', async () =>
    {
        const { api, cookie } = await signedIn();
        const bad = { ...NEW_POST, slug: 'Not A Slug' };

        expect((await send(api, 'POST', '/api/admin/posts', bad, cookie)).status).toBe(422);
        expect((await send(api, 'POST', '/api/admin/posts', { ...NEW_POST, status: 'live' }, cookie)).status).toBe(422);
        expect((await send(api, 'POST', '/api/admin/posts', { ...NEW_POST, defaultLocale: 'de' }, cookie)).status).toBe(422);
    });

    it('lower-cases and trims a slug rather than refusing it', async () =>
    {
        // The author is not the adversary: a slug pasted with a capital is corrected, and only
        // the shape that could not be addressed is refused.
        const { api, cookie } = await signedIn();
        const response = await send(api, 'POST', '/api/admin/posts', { ...NEW_POST, slug: '  Nura-Mainnet  ' }, cookie);

        expect(((await response.json()) as PostEditor).slug).toBe('nura-mainnet');
    });
});

describe('editing a post', () =>
{
    it('lists every post, drafts included, with the languages each one holds', async () =>
    {
        const { api, cookie } = await signedIn();

        api.store.create(postFields({ slug: 'published' }), 'en', postText());
        api.store.create(postFields({ slug: 'a-draft', status: 'draft' }), 'fa', postText({ title: 'پیش‌نویس' }));

        const page = (await (await send(api, 'GET', '/api/admin/posts', undefined, cookie)).json()) as PostRecordPage;

        expect(page.rows.map((row) => row.slug).sort()).toEqual(['a-draft', 'published']);
        // The draft's title comes from Persian, its default language - a post being managed has
        // a name in the list whatever language it was written in.
        expect(page.rows.find((row) => row.slug === 'a-draft')?.title).toBe('پیش‌نویس');
        expect(page.total).toBe(2);
        expect(page.page).toBe(1);
        expect(page.pages).toBe(1);
    });

    it('pages the list, so a post past the first page is still reachable', async () =>
    {
        // The dashboard shipped with a hard `limit: 200` and no query, which made the 201st
        // post invisible to the only screen that can edit it.
        const { api, cookie } = await signedIn();

        for (let index = 0; index < 25; index++)
        {
            api.store.create(postFields({ slug: `post-${ index }` }), 'en', postText());
        }

        const first = (await (await send(api, 'GET', '/api/admin/posts', undefined, cookie)).json()) as PostRecordPage;
        const second = (await (await send(api, 'GET', '/api/admin/posts?page=2', undefined, cookie)).json()) as PostRecordPage;

        expect(first.total).toBe(25);
        expect(first.pages).toBe(2);
        expect(first.rows).toHaveLength(20);
        expect(second.rows).toHaveLength(5);

        // No post appears on both pages, and between them they are all there.
        const seen = new Set([...first.rows, ...second.rows].map((row) => row.slug));

        expect(seen.size).toBe(25);
    });

    it('updates the post fields and publishes it', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields({ status: 'draft' }), 'en', postText());
        const response = await send(api, 'PATCH', `/api/admin/posts/${ created.post.id }`,
            postFields({ status: 'published', tags: ['release', 'mainnet'] }), cookie);

        const editor = (await response.json()) as PostEditor;

        expect(editor.status).toBe('published');
        expect(editor.tags).toEqual(['release', 'mainnet']);
        expect(editor.publishedAt).not.toBeNull();
    });

    it('refuses to move a post onto another slug already in use', async () =>
    {
        const { api, cookie } = await signedIn();

        api.store.create(postFields({ slug: 'taken' }), 'en', postText());

        const moving = api.store.create(postFields({ slug: 'moving' }), 'en', postText());
        const clash = await send(api, 'PATCH', `/api/admin/posts/${ moving.post.id }`,
            postFields({ slug: 'taken' }), cookie);

        expect(clash.status).toBe(409);
    });

    it('lets a post keep its OWN slug through an edit', async () =>
    {
        // The obvious off-by-one in a uniqueness check: an edit that does not change the slug
        // must not collide with the row it is editing.
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields({ slug: 'staying' }), 'en', postText());
        const response = await send(api, 'PATCH', `/api/admin/posts/${ created.post.id }`,
            postFields({ slug: 'staying', tags: ['edited'] }), cookie);

        expect(response.status).toBe(200);
    });

    it('404s an unknown post', async () =>
    {
        const { api, cookie } = await signedIn();

        expect((await send(api, 'GET', '/api/admin/posts/999', undefined, cookie)).status).toBe(404);
        expect((await send(api, 'PATCH', '/api/admin/posts/999', postFields(), cookie)).status).toBe(404);
        expect((await send(api, 'DELETE', '/api/admin/posts/999', undefined, cookie)).status).toBe(404);
    });

    it('deletes a post', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields(), 'en', postText());
        const response = await send(api, 'DELETE', `/api/admin/posts/${ created.post.id }`, undefined, cookie);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({ removed: true });
        expect(api.store.byId(created.post.id)).toBeNull();
    });
});

describe('translations', () =>
{
    it('adds a language, and corrects it through the same call', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields(), 'en', postText());
        const path = `/api/admin/posts/${ created.post.id }/translations/fa`;

        const added = (await (await send(api, 'PUT', path, postText({ title: 'شبکه اصلی نورا' }), cookie)).json()) as PostEditor;

        expect(added.translations.map((row) => row.locale)).toEqual(['en', 'fa']);

        const fixed = (await (await send(api, 'PUT', path, postText({ title: 'اصلاح‌شده' }), cookie)).json()) as PostEditor;

        // Upserted, not duplicated.
        expect(fixed.translations).toHaveLength(2);
        expect(fixed.translations.find((row) => row.locale === 'fa')?.title).toBe('اصلاح‌شده');
    });

    it('returns the languages in the site order, not the order they were written in', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields({ defaultLocale: 'tr' }), 'tr', postText());

        await send(api, 'PUT', `/api/admin/posts/${ created.post.id }/translations/fa`, postText(), cookie);
        await send(api, 'PUT', `/api/admin/posts/${ created.post.id }/translations/en`, postText(), cookie);

        const editor = (await (await send(api, 'GET', `/api/admin/posts/${ created.post.id }`, undefined, cookie)).json()) as PostEditor;

        expect(editor.translations.map((row) => row.locale)).toEqual(['en', 'fa', 'tr']);
    });

    it('removes a language', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields({ defaultLocale: 'en' }), 'en', postText());

        await send(api, 'PUT', `/api/admin/posts/${ created.post.id }/translations/fa`, postText(), cookie);

        const response = await send(api, 'DELETE', `/api/admin/posts/${ created.post.id }/translations/fa`, undefined, cookie);

        expect(response.status).toBe(200);
        expect(((await response.json()) as PostEditor).translations.map((row) => row.locale)).toEqual(['en']);
    });

    it('refuses to remove the language the post falls back to, and says why', async () =>
    {
        // A 409 rather than a 400: the request is well formed, it conflicts with the post's
        // state, and the dashboard turns that into "change the default language first".
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields({ defaultLocale: 'en' }), 'en', postText());
        const response = await send(api, 'DELETE', `/api/admin/posts/${ created.post.id }/translations/en`, undefined, cookie);

        expect(response.status).toBe(409);
        expect(api.store.byId(created.post.id)?.translations).toHaveLength(1);
    });

    it('404s a language on a post that does not exist', async () =>
    {
        const { api, cookie } = await signedIn();

        expect((await send(api, 'PUT', '/api/admin/posts/999/translations/fa', postText(), cookie)).status).toBe(404);
        expect((await send(api, 'DELETE', '/api/admin/posts/999/translations/fa', undefined, cookie)).status).toBe(404);
    });

    it('validates a translation at the boundary', async () =>
    {
        const { api, cookie } = await signedIn();
        const created = api.store.create(postFields(), 'en', postText());
        const path = `/api/admin/posts/${ created.post.id }/translations/fa`;

        expect((await send(api, 'PUT', path, { ...postText(), title: '' }, cookie)).status).toBe(422);
        expect((await send(api, 'PUT', path, { title: 'Only a title' }, cookie)).status).toBe(422);
    });
});
