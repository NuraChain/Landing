// The sitemap: which addresses this site asks a crawler to read.
//
// The HEAD used to be built here too, by rewriting a rendered document from a table of paths
// this half kept. Each page declares its own now (`application/src/lib/head.ts`), so those
// tests moved with the code: `application/tests/ssr.spec.ts` asserts the served head over the
// real server, and `application/tests/page-head.spec.ts` covers the pieces it is built from.
//
// What is left is the one SEO artifact the server still owns outright, because it describes
// the whole site rather than one page - and because it reads the store, so publishing IS
// listing.
import { describe, it, expect } from 'vitest';

import { BlogContent, type LoadedPost } from '../src/blog/content.ts';
import { buildSitemap } from '../src/seo/sitemap.ts';
import { harness, post, whitepaper } from './support/fixtures.ts';

const SITE = 'https://nurachain.net';

const storeWith = (...posts: LoadedPost[]): BlogContent => new BlogContent(posts);

/** The whole content a sitemap is built from: these posts, and the default whitepaper. */
const contentWith = (...posts: LoadedPost[]): { store: BlogContent; whitepaper: ReturnType<typeof whitepaper> } =>
    ({ store: storeWith(...posts), whitepaper: whitepaper() });

describe('the sitemap', () =>
{
    it('lists the static routes and every published post', () =>
    {
        const xml = buildSitemap(contentWith(post({ slug: 'live-one' }), post({ slug: 'live-two' })), SITE);

        expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
        expect(xml).toContain(`<loc>${ SITE }/</loc>`);
        expect(xml).toContain(`<loc>${ SITE }/blog</loc>`);
        // Absent on purpose while pages.ts serves it `noindex`: a sitemap is a request TO
        // index, so listing it and then refusing it is a contradiction, not a belt and braces.
        expect(xml).not.toContain(`<loc>${ SITE }/about</loc>`);
        expect(xml).toContain(`<loc>${ SITE }/blog/live-one</loc>`);
        expect(xml).toContain(`<loc>${ SITE }/blog/live-two</loc>`);
        expect(xml).toContain('</urlset>');
    });

    it('lists the whitepaper with the lastmod its head declares', () =>
    {
        // Emitted beside the posts rather than as a dateless constant: a revision that forgets
        // to bump `updatedAt` is one a crawler is never told to re-read.
        const content = { store: storeWith(), whitepaper: whitepaper({ updatedAt: '2026-10-01T00:00:00.000Z' }) };
        const xml = buildSitemap(content, SITE);

        expect(xml).toContain(`<loc>${ SITE }/whitepaper</loc>`);
        expect(xml).toContain('<lastmod>2026-10-01T00:00:00.000Z</lastmod>');
    });

    it('reports each post lastmod from its own updatedAt', () =>
    {
        // The sitemap is the only consumer of `updatedAt`, so a post revised without touching
        // that field is one a crawler is never told to re-read.
        const content = contentWith(post({ slug: 'revised', updatedAt: '2026-07-04T12:00:00.000Z' }));

        expect(buildSitemap(content, SITE)).toContain('<lastmod>2026-07-04T12:00:00.000Z</lastmod>');
    });

    it('never lists a draft', () =>
    {
        const xml = buildSitemap(contentWith(post({ slug: 'secret', status: 'draft' })), SITE);

        expect(xml).not.toContain('secret');
    });

    it('pages through more posts than one store read returns', () =>
    {
        // The chunk is 500; this asserts the loop terminates and covers everything rather than
        // silently stopping at the first read - the failure mode a hard limit produces.
        const xml = buildSitemap(contentWith(...Array.from({ length: 12 }, (_, at) => post({ slug: `post-${ at }` }))), SITE);

        // 12 posts plus the two static routes - `/` and `/blog` - and the whitepaper.
        expect(xml.match(/<url>/g)).toHaveLength(12 + 3);
    });

    it('is served as XML from the app', async () =>
    {
        const { get } = harness({ posts: [post({ slug: 'served' })] });
        const response = await get('/sitemap.xml');

        expect(response.status).toBe(200);
        expect(response.headers.get('content-type')).toContain('application/xml');
        expect(await response.text()).toContain('/blog/served');
    });
});
