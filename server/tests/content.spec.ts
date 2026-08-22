// The blog, read from disk, and the markup a crawler is served.
//
// This is the ONE spec that touches the filesystem, and deliberately: `loadArticles` reading
// the repository's own cluster is the assertion that the ten articles this site publishes are
// complete and loadable. Everything else here builds its blog inline.
import { describe, it, expect } from 'vitest';

import { BlogContent, loadArticles } from '../src/blog/content.ts';
import { articleMarkup, injectArticle, renderArticle, safeHref } from '../src/seo/article.ts';
import { postFor } from '../src/seo/pages.ts';
import { POST_LOCALES } from '../src/schemas.ts';
import { post, translation } from './support/fixtures.ts';

const SITE = 'https://nurachain.net';

describe('the repository cluster', () =>
{
    it('loads, in every language every article declares', () =>
    {
        // A missing or empty .md throws with the path in the message, so a red here names the
        // file. This is the check that used to be the seed script's.
        const loaded = loadArticles();

        expect(loaded.length).toBeGreaterThan(0);

        for (const entry of loaded)
        {
            expect(entry.translations.length, entry.post.slug).toBe(POST_LOCALES.length);

            for (const row of entry.translations)
            {
                expect(row.body.length, `${ entry.post.slug }/${ row.locale }`).toBeGreaterThan(0);
                expect(row.title.length, `${ entry.post.slug }/${ row.locale }`).toBeGreaterThan(0);
            }
        }
    });

    it('gives every article a publication date that parses', () =>
    {
        // The dates are declared by hand now, so a typo is a real possibility and it would
        // sort the article to one end of the index rather than failing loudly.
        for (const { post: row } of loadArticles())
        {
            expect(Number.isNaN(Date.parse(row.publishedAt)), row.slug).toBe(false);
            expect(Number.isNaN(Date.parse(row.updatedAt)), row.slug).toBe(false);
        }
    });

    it('refuses to load an article whose markdown is not there', () =>
    {
        // The failure that matters: an article declared in index.ts with no directory behind
        // it. Refusing at load is what keeps a post with nine languages from ever being served.
        expect(() => loadArticles([{
            slug: 'no-such-directory',
            tags: [],
            defaultLocale: 'en',
            status: 'published',
            publishedAt: '2026-01-01T00:00:00.000Z',
            updatedAt: '2026-01-01T00:00:00.000Z',
            coverImage: null,
            heads: Object.fromEntries(POST_LOCALES.map((locale) =>
                [locale, { title: 't', summary: 's' }])) as never
        }])).toThrow(/no-such-directory/);
    });
});

describe('the index', () =>
{
    it('holds a draft back from every read path', () =>
    {
        const store = new BlogContent([
            post({ slug: 'live', tags: ['shipped'] }),
            post({ slug: 'draft', status: 'draft', tags: ['unshipped'] })
        ]);

        expect(store.list({ limit: 10, offset: 0 }).total).toBe(1);
        expect(store.bySlug('draft')).toBeNull();
        expect(store.tags()).toEqual([{ tag: 'shipped', count: 1 }]);
    });

    it('breaks a date tie by declaration order, newest last-written first', () =>
    {
        // Ten articles share three timestamps in the real cluster, so the tiebreak decides most
        // of the page. Reversed index order: the one written last reads as the newest.
        const same = '2026-05-05T00:00:00.000Z';
        const store = new BlogContent([
            post({ slug: 'written-first', publishedAt: same }),
            post({ slug: 'written-second', publishedAt: same }),
            post({ slug: 'written-third', publishedAt: same })
        ]);

        expect(store.list({ limit: 10, offset: 0 }).rows.map((row) => row.post.slug))
            .toEqual(['written-third', 'written-second', 'written-first']);
    });

    it('counts what matched before paging, not what one page holds', () =>
    {
        const store = new BlogContent(Array.from({ length: 7 }, (_, at) => post({ slug: `p-${ at }` })));
        const page = store.list({ limit: 3, offset: 3 });

        expect(page.rows).toHaveLength(3);
        expect(page.total).toBe(7);
    });
});

describe('rendering an article body', () =>
{
    it('levels headings against the document own shallowest, not against h1', () =>
    {
        // `#`/`##` and `##`/`###` both have to come out h2/h3: the post title is the page's h1,
        // and a body that jumped straight to h3 would break the outline a crawler reads.
        expect(renderArticle('# Top\n\n## Under')).toBe('<h2>Top</h2><h3>Under</h3>');
        expect(renderArticle('## Top\n\n### Under')).toBe('<h2>Top</h2><h3>Under</h3>');
    });

    it('keeps a fenced block verbatim', () =>
    {
        const html = renderArticle('```js\nconst a = **not bold**;\n```');

        expect(html).toBe('<pre><code>const a = **not bold**;</code></pre>');
    });

    it('escapes everything an author typed', () =>
    {
        const html = renderArticle('A <script>alert(1)</script> & "quotes"');

        expect(html).not.toContain('<script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&amp;');
        expect(html).toContain('&quot;');
    });

    it('keeps the text of a link it refuses to point at', () =>
    {
        // `javascript:` and `data:` are the two that turn a link into script. Dropping the whole
        // span would delete a sentence's worth of prose over one bad href.
        const html = renderArticle('Click [here](javascript:alert(1)) now');

        expect(html).toBe('<p>Click here now</p>');
        expect(safeHref('javascript:alert(1)')).toBeNull();
        expect(safeHref('//evil.example')).toBeNull();
        expect(safeHref('/blog/x')).toBe('/blog/x');
        expect(safeHref('https://nurachain.net')).toBe('https://nurachain.net');
    });

    it('renders lists, quotes and emphasis', () =>
    {
        expect(renderArticle('- one\n- two')).toBe('<ul><li>one</li><li>two</li></ul>');
        expect(renderArticle('1. one\n2. two')).toBe('<ol><li>one</li><li>two</li></ol>');
        expect(renderArticle('> quoted')).toBe('<blockquote><p>quoted</p></blockquote>');
        expect(renderArticle('**b** and *i* and `c`'))
            .toBe('<p><strong>b</strong> and <em>i</em> and <code>c</code></p>');
    });

    it('ends one list and opens another when the marker changes', () =>
    {
        expect(renderArticle('- one\n1. two'))
            .toBe('<ul><li>one</li></ul><ol><li>two</li></ol>');
    });
});

describe('the crawlable article', () =>
{
    it('carries the post own language and direction, not the document own', () =>
    {
        // An English fallback inside a Persian site is a left-to-right run in a mirrored
        // document; without its own dir every trailing full stop lands at the wrong end.
        const store = new BlogContent([post({ slug: 'persian', defaultLocale: 'fa' }, [
            translation('fa', { title: 'عنوان', body: 'متن' })
        ])]);

        const markup = articleMarkup(postFor('/blog/persian', { store, siteUrl: SITE })!);

        expect(markup).toContain('lang="fa"');
        expect(markup).toContain('dir="rtl"');
        expect(markup).toContain('<h1>عنوان</h1>');
    });

    it('is the post text, not a loading skeleton', () =>
    {
        // The regression this whole path exists for: /blog/:slug used to be indexed with a
        // correct <title> over a body containing no article at all.
        const store = new BlogContent([post({ slug: 'real' }, [
            translation('en', { title: 'A real title', body: '## A heading\n\nSome real prose.' })
        ])]);

        const markup = articleMarkup(postFor('/blog/real', { store, siteUrl: SITE })!);

        expect(markup).toContain('<h1>A real title</h1>');
        expect(markup).toContain('<h2>A heading</h2>');
        expect(markup).toContain('Some real prose.');
    });

    it('answers null for anything that is not one post', () =>
    {
        const store = new BlogContent([post()]);

        for (const url of ['/', '/about', '/blog', '/blog?page=2', '/blog/never-written'])
        {
            expect(postFor(url, { store, siteUrl: SITE }), url).toBeNull();
        }
    });

    it('goes in ahead of the frame the kit rendered, without disturbing it', () =>
    {
        const shell = '<!doctype html><html><head></head><body><div id="root">FRAME</div></body></html>';
        const out = injectArticle(shell, '<article data-ssr-article>text</article>');

        expect(out.indexOf('data-ssr-article')).toBeLessThan(out.indexOf('FRAME'));
        expect(out).toContain('FRAME');
        expect(out).toContain('</body></html>');
    });

    it('does not let a body containing $& splice the document back into itself', () =>
    {
        // `String.replace` reads `$&` in a REPLACEMENT string as the whole match. This path uses
        // slice for exactly that reason - the same trap injectMeta has a note about.
        const shell = '<div id="root">FRAME</div>';
        const out = injectArticle(shell, '<article>$& and $` and $\'</article>');

        expect(out).toContain('$& and $` and $\'');
        expect(out).not.toContain('<div id="root">FRAME</div>FRAME');
    });
});
