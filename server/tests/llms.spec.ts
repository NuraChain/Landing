// /llms.txt: the site described for a language model.
//
// The sitemap's sibling, and built the same way - from the store, so publishing IS listing.
// What is pinned here is what a model reading it relies on: every published post is on it with
// an absolute address and a description, a draft never is, and the file is plain text that
// parses line by line.
import { describe, it, expect } from 'vitest';

import { BlogContent, type LoadedPost } from '../src/blog/content.ts';
import { buildLlmsTxt } from '../src/seo/llms.ts';
import { chapter, harness, post, translation, whitepaper } from './support/fixtures.ts';

const SITE = 'https://nurachain.net';

const contentWith = (...posts: LoadedPost[]): { store: BlogContent; whitepaper: ReturnType<typeof whitepaper> } =>
    ({ store: new BlogContent(posts), whitepaper: whitepaper() });

describe('llms.txt', () =>
{
    it('opens with the site name and a one-paragraph summary', () =>
    {
        const text = buildLlmsTxt(contentWith(post()), SITE);
        const [title, blank, summary] = text.split('\n');

        // The shape llmstxt.org asks for: an H1, then a blockquote. A parser reads those two
        // lines before anything else, so they are asserted by position.
        expect(title).toBe('# Nura Chain');
        expect(blank).toBe('');
        expect(summary?.startsWith('> Nura Chain is ')).toBe(true);
    });

    it('lists every published post with an absolute address, its summary and its date', () =>
    {
        const text = buildLlmsTxt(contentWith(
            post({ slug: 'live-one', publishedAt: '2026-10-02T08:00:00.000Z' }, [
                translation('en', { title: 'A real title', summary: 'What the article says.' })
            ])), SITE);

        expect(text).toContain('## Blog');
        expect(text).toContain(`- [A real title](${ SITE }/blog/live-one): What the article says. Published 2026-10-02.`);
    });

    it('lists the whitepaper with its revision', () =>
    {
        const content = {
            store: new BlogContent([]),
            whitepaper: whitepaper({ revision: '2.1', updatedAt: '2026-10-01T00:00:00.000Z' }, [
                chapter('en', { title: 'Nura Chain Whitepaper', summary: 'A plain-language guide.' })
            ])
        };

        expect(buildLlmsTxt(content, SITE))
            .toContain(`- [Nura Chain Whitepaper](${ SITE }/whitepaper): A plain-language guide. Revision 2.1, updated 2026-10-01.`);
    });

    it('puts the newest post first', () =>
    {
        // A model that stops reading early should have read the recent ones.
        const text = buildLlmsTxt(contentWith(
            post({ slug: 'older', publishedAt: '2026-09-01T00:00:00.000Z' }),
            post({ slug: 'newer', publishedAt: '2026-10-01T00:00:00.000Z' })), SITE);

        expect(text.indexOf('/blog/newer')).toBeLessThan(text.indexOf('/blog/older'));
    });

    it('never lists a draft', () =>
    {
        const text = buildLlmsTxt(contentWith(post({ slug: 'secret', status: 'draft' })), SITE);

        expect(text).not.toContain('secret');
        // No posts at all, so no empty section either: a heading over nothing reads as a
        // section that failed to load.
        expect(text).not.toContain('## Blog');
    });

    it('falls back to the post own language when it has no English', () =>
    {
        // The same policy a reader gets. Skipping the post would make it invisible to exactly
        // the readers who ask a model rather than a search engine.
        const text = buildLlmsTxt(contentWith(post({ slug: 'persian', defaultLocale: 'fa' }, [
            translation('fa', { title: 'عنوان', summary: 'خلاصه' })
        ])), SITE);

        expect(text).toContain(`- [عنوان](${ SITE }/blog/persian): خلاصه Published`);
    });

    it('keeps one item on one line whatever a head contains', () =>
    {
        // The file is parsed line by line: a newline inside a summary would end the item, and
        // a bracket in a title would close the link early.
        const text = buildLlmsTxt(contentWith(post({ slug: 'awkward' }, [
            translation('en', { title: 'Fees [explained]', summary: 'Two\nlines.' })
        ])), SITE);

        expect(text).toContain(`- [Fees (explained)](${ SITE }/blog/awkward): Two lines. Published`);
    });

    it('is served as plain text from the app', async () =>
    {
        const { get } = harness({ posts: [post({ slug: 'served' })] });
        const response = await get('/llms.txt');

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('text/plain');
        expect(await response.text()).toContain('/blog/served');
    });
});
