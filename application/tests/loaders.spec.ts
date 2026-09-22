// @vitest-environment node

// The route data layer: what a url means, what a loader asks for, and how it fails.
//
// NODE, not happy-dom, and the reason is `Request`. These loaders run on the server, where a
// request carries the reader's `Cookie` - and happy-dom implements the BROWSER's rule, under
// which `Cookie` is a forbidden header that a page may not set. Constructing a request with
// one there silently drops it, so a spec asserting that a reader's saved choice outranks
// their browser's header would fail against a framework that gets it right.
//
// These run before any page renders, on both sides of the wire, and they decide what the
// served document contains - so their edge cases are worth stating directly rather than
// reaching through a component. The typed client is replaced at the module boundary, the way
// `whitepaper.spec.ts` does it: on this side the honest thing to test is the contract with
// `client`, not the bytes it would have sent.
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isNotFound } from 'azerothjs';

/*
 * Everything the factory reads is hoisted with it - the error CLASS included.
 *
 * `vi.mock` is lifted above the imports, so a class declared at the top level of this file
 * does not exist yet when the factory runs. `loadPost` branches on `instanceof ApiError`, so
 * the double has to be the very object the module under test imports.
 */
const { list, tags, one, read, ApiError } = vi.hoisted(() =>
{
    class FakeApiError extends Error
    {
        public readonly status: number;

        constructor(status: number)
        {
            super(`api ${ status }`);
            this.status = status;
        }
    }

    return { list: vi.fn(), tags: vi.fn(), one: vi.fn(), read: vi.fn(), ApiError: FakeApiError };
});

vi.mock('../src/api', () => ({
    ApiError,
    client: { blog: { list, tags, one }, whitepaper: { read } }
}));

import { blogQuery } from '../src/lib/blog-query';
import { loadBlogIndex, loadPost, loadWhitepaper } from '../src/lib/loaders';
import { readerLocale } from '../src/lib/reader-locale';
import { useLocale } from '../src/stores/locale';

beforeEach(() =>
{
    list.mockReset();
    tags.mockReset();
    one.mockReset();
    read.mockReset();
});

describe('what a blog url says it is showing', () =>
{
    it('reads the page and the tag', () =>
    {
        expect(blogQuery({ page: '3', tag: 'evm' })).toEqual({ page: 3, tag: 'evm' });
    });

    it('defaults to the first page with no filter', () =>
    {
        expect(blogQuery({})).toEqual({ page: 1, tag: null });
    });

    it('takes the first value when a parameter is repeated', () =>
    {
        // `?page=1&page=2` arrives as an array, and an array reaching the api is a 422.
        expect(blogQuery({ page: ['2', '9'], tag: ['rpc', 'evm'] })).toEqual({ page: 2, tag: 'rpc' });
    });

    it('treats an empty value as absent', () =>
    {
        expect(blogQuery({ page: '', tag: '' })).toEqual({ page: 1, tag: null });
    });

    it('clamps a page that is not a counting number', () =>
    {
        // Each of these is a url somebody can type, and each would otherwise be multiplied
        // into an offset: a page of 1e21 passes an integer check and overflows downstream.
        for (const page of ['0', '-4', 'nonsense', '1.5', '1e21', String(Number.MAX_SAFE_INTEGER + 10)])
        {
            expect(blogQuery({ page }).page, page).toBe(1);
        }
    });
});

describe('the language a loader asks for', () =>
{
    it('negotiates from the request on the server', () =>
    {
        const asking = (headers: Record<string, string>): string =>
            readerLocale(new Request('http://local/blog', { headers }));

        expect(asking({ 'accept-language': 'fa-IR,fa;q=0.9,en;q=0.8' })).toBe('fa');
        // Preference ORDER, not mere presence: this reader asked for English.
        expect(asking({ 'accept-language': 'en-US,fa;q=0.9' })).toBe('en');
        // A choice the reader made outranks their browser's guess.
        expect(asking({ 'accept-language': 'fa-IR', cookie: 'locale=tr' })).toBe('tr');
        // A language the site does not publish falls back rather than reaching the api.
        expect(asking({ 'accept-language': 'ja-JP,ko-KR;q=0.9' })).toBe('en');
        expect(asking({})).toBe('en');
    });

    it('reads the store in the browser, where there is no request', () =>
    {
        useLocale().choose('es');

        expect(readerLocale(null)).toBe('es');

        useLocale().choose('en');
    });
});

describe('loading one post', () =>
{
    it('asks for the slug in the reader language', async () =>
    {
        one.mockResolvedValue({ title: 'Hello' });

        await expect(loadPost('hello', 'fa')).resolves.toEqual({ title: 'Hello' });
        expect(one).toHaveBeenCalledWith({ params: { slug: 'hello' }, query: { locale: 'fa' } });
    });

    it('turns the api 404 into a route not-found, which is a real 404', async () =>
    {
        // Not an ordinary throw: that is a server FAULT and would answer 500 to a reader, a
        // crawler and a cache alike, for the commonest miss a blog has.
        one.mockRejectedValue(new ApiError(404));

        await expect(loadPost('never-written', 'en')).rejects.toSatisfy(isNotFound);
    });

    it('lets any other failure stay a failure', async () =>
    {
        // A 500 upstream is a fault, and dressing it as "no such post" would tell a crawler to
        // forget a page that exists.
        one.mockRejectedValue(new ApiError(500));

        await expect(loadPost('real', 'en')).rejects.toBeInstanceOf(ApiError);

        one.mockRejectedValue(new TypeError('network down'));

        await expect(loadPost('real', 'en')).rejects.toBeInstanceOf(TypeError);
    });
});

describe('loading the blog index', () =>
{
    it('asks for one page, its tags and the published count together', async () =>
    {
        list.mockResolvedValue({ rows: [{ slug: 'a' }], total: 7, page: 1, pages: 1 });
        tags.mockResolvedValue([{ tag: 'evm', count: 3 }]);

        const index = await loadBlogIndex({ page: 1, tag: null }, 'en');

        expect(index).toEqual({
            requestedLocale: 'en',
            rows: [{ slug: 'a' }],
            pages: 1,
            tags: [{ tag: 'evm', count: 3 }],
            published: 7
        });
        // No filter, so the page's own total IS the site's - no second call for it.
        expect(list).toHaveBeenCalledTimes(1);
    });

    it('asks a second time for the site total when a tag narrows the list', async () =>
    {
        // With a tag applied the first answer's `total` is that TAG's count, and the
        // unfiltered chip would otherwise show it as though it were everything published.
        list.mockImplementation(({ query }: { query: { tag?: string } }) =>
            Promise.resolve(query.tag === undefined
                ? { rows: [], total: 42, page: 1, pages: 1 }
                : { rows: [{ slug: 'a' }], total: 2, page: 1, pages: 1 }));
        tags.mockResolvedValue([]);

        const index = await loadBlogIndex({ page: 1, tag: 'evm' }, 'en');

        expect(index.rows).toHaveLength(1);
        expect(index.published).toBe(42);
        expect(list).toHaveBeenCalledTimes(2);
    });

    it('still lists the posts when the tag call fails', async () =>
    {
        // A missing filter row costs a chip; the list below it is the page.
        list.mockResolvedValue({ rows: [{ slug: 'a' }], total: 1, page: 1, pages: 1 });
        tags.mockRejectedValue(new Error('down'));

        const index = await loadBlogIndex({ page: 1, tag: null }, 'en');

        expect(index.tags).toEqual([]);
        expect(index.rows).toHaveLength(1);
    });

    it('fails when the list itself fails', async () =>
    {
        list.mockRejectedValue(new ApiError(500));
        tags.mockResolvedValue([]);

        await expect(loadBlogIndex({ page: 1, tag: null }, 'en')).rejects.toBeInstanceOf(ApiError);
    });

    it('carries the language it ASKED for, so a switch can be detected', async () =>
    {
        // Compared against the reader's to know the list is stale: comparing the language
        // SERVED would re-ask forever whenever a post has no translation in it.
        list.mockResolvedValue({ rows: [], total: 0, page: 1, pages: 1 });
        tags.mockResolvedValue([]);

        expect((await loadBlogIndex({ page: 1, tag: null }, 'tr')).requestedLocale).toBe('tr');
    });
});

describe('loading the whitepaper', () =>
{
    it('asks for the reader language and hands back what the server resolved', async () =>
    {
        read.mockResolvedValue({ title: 'Whitepaper', locale: 'en' });

        await expect(loadWhitepaper('fa')).resolves.toEqual({ title: 'Whitepaper', locale: 'en' });
        expect(read).toHaveBeenCalledWith({ query: { locale: 'fa' } });
    });
});
