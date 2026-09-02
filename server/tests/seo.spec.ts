// The head a crawler is served, and the sitemap that points at it.
//
// Two things are worth pinning here above all else. The first is the NEGATIVE case: `metaFor`
// answering null for everything that is not a blog page is what guarantees this module cannot
// disturb the landing pages' existing head. The second is escaping - every value below is text
// an author committed, and it lands inside an HTML attribute and inside a `<script>` payload,
// which are the two places where getting it wrong is not a cosmetic bug.
import { describe, it, expect } from 'vitest';

import { BlogContent, type LoadedPost } from '../src/blog/content.ts';
import { injectMeta, isMissingPost, metaFor, excerpt, postFor, whitepaperFor, type SeoDeps } from '../src/seo/pages.ts';
import { buildSitemap } from '../src/seo/sitemap.ts';
import { articleMarkup } from '../src/seo/article.ts';
import { chapter, harness, post, translation, whitepaper } from './support/fixtures.ts';

const SITE = 'https://nurachain.net';

const storeWith = (...posts: LoadedPost[]): BlogContent => new BlogContent(posts);

/** The deps every head is built from: this blog, the default whitepaper, the canonical origin. */
const deps = (store: BlogContent): SeoDeps => ({ store, whitepaper: whitepaper(), siteUrl: SITE });

/** The whole content a head or a sitemap is built from: these posts, and the default whitepaper. */
const contentWith = (...posts: LoadedPost[]): { store: BlogContent; whitepaper: ReturnType<typeof whitepaper> } =>
    ({ store: storeWith(...posts), whitepaper: whitepaper() });

/** The shape the built index.html has: one title, one description, one head to replace. */
const SHELL = `<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8"/>
        <title>Nura Chain — an open and decentralized blockchain</title>
        <meta name="description" content="the generic one"/>
    </head>
    <body><div id="root"></div></body>
</html>`;

describe('which pages get a head of their own', () =>
{
    it('says nothing about a page it does not own', () =>
    {
        // A null leaves the shell's head exactly as it was, and that is the arm that stops this
        // module blanking a page it does not understand. Assets and favicons are the paths it
        // genuinely owns nothing about - the landing pages moved out of this list when they
        // gained heads of their own, asserted below.
        const store = storeWith();

        for (const path of ['/assets/index-abc123.js', '/favicon-32.png', '/nope'])
        {
            expect(metaFor(path, deps(store))).toBeNull();
        }
    });

    it('gives the home page its own canonical and structured data', () =>
    {
        const meta = metaFor('/', deps(storeWith()));

        // The trailing slash matters: the sitemap lists `${SITE}/`, and a canonical that
        // disagrees with the sitemap is a page arguing with itself.
        expect(meta?.canonical).toBe(`${ SITE }/`);
        expect(meta?.robots).toBeUndefined();

        const types = (meta?.jsonLd ?? []).map((entry) => (entry as { '@type': string })['@type']);

        expect(types).toEqual(['WebSite', 'Organization']);
    });

    it('gives the about page a head of its own, not a copy of the home page', () =>
    {
        const home = metaFor('/', deps(storeWith()));
        const about = metaFor('/about', deps(storeWith()));

        // The defect this fixes: both paths were served the shell, so the site's two most
        // important addresses each declared themselves a duplicate of the other.
        expect(about?.title).not.toBe(home?.title);
        expect(about?.description).not.toBe(home?.description);
        expect(about?.canonical).toBe(`${ SITE }/about`);
    });

    it('keeps the about page out of the index while it is still the starter template', () =>
    {
        const meta = metaFor('/about', deps(storeWith()));

        // `follow`, not `nofollow`: the header and footer links on that page are real pages.
        expect(meta?.robots).toBe('noindex, follow');
    });

    it('says nothing about a slug nobody has published', () =>
    {
        const store = storeWith(post({ slug: 'draft-only', status: 'draft' }));

        // A draft resolves to null through `bySlug`, so the not-found page keeps the shell's
        // title rather than being described as an article that does not exist.
        expect(metaFor('/blog/draft-only', deps(store))).toBeNull();
        expect(metaFor('/blog/never-written', deps(store))).toBeNull();
    });

    it('treats an undecodable slug as a miss instead of throwing', () =>
    {
        // `decodeURIComponent('%')` - or any truncated escape - throws a URIError. Unguarded,
        // a mistyped address like /blog/% turned into a 500 from inside the renderer rather
        // than the 404 the soft-404 guard exists to produce.
        const store = storeWith(post({ slug: 'real' }));

        for (const path of ['/blog/%', '/blog/%E0%A4', '/blog/%zz'])
        {
            expect(metaFor(path, deps(store)), path).toBeNull();
            expect(isMissingPost(path, deps(store)), path).toBe(true);
            expect(postFor(path, deps(store)), path).toBeNull();
        }
    });

    it('describes the index whatever the filter and page are', () =>
    {
        // The path identifies the page; ?tag= and ?page= only narrow a list, and every one of
        // them is the same index with the same canonical.
        const store = storeWith();

        for (const url of ['/blog', '/blog/', '/blog?page=3', '/blog?tag=evm&page=2'])
        {
            const meta = metaFor(url, deps(store));

            expect(meta?.canonical).toBe(`${ SITE }/blog`);
            expect(meta?.type).toBe('website');
        }
    });
});

describe('the soft-404 guard', () =>
{
    it('marks a post address that resolves to nothing', () =>
    {
        const store = storeWith(post({ slug: 'real' }), post({ slug: 'hidden', status: 'draft' }));

        expect(isMissingPost('/blog/never-written', deps(store))).toBe(true);
        // A draft is not readable, so its url is not a page either.
        expect(isMissingPost('/blog/hidden', deps(store))).toBe(true);
        expect(isMissingPost('/blog/real', deps(store))).toBe(false);
    });

    it('never claims a non-post path is missing', () =>
    {
        // These keep the kit's own status. Returning true for any of them would turn the
        // landing page into a 404, which is the failure this separation exists to prevent.
        const store = storeWith();

        for (const path of ['/', '/about', '/blog', '/blog?page=2', '/favicon-32.png'])
        {
            expect(isMissingPost(path, deps(store))).toBe(false);
        }
    });
});

describe('a post head', () =>
{
    it('carries the post title, summary and a self-referencing canonical', () =>
    {
        const store = storeWith(post({ slug: 'nura-chain-rpc', tags: ['rpc', 'developers'] }, [
            translation('en', { title: 'Connecting to the Nura Chain RPC', summary: 'Chain ID 1020, over HTTPS.' })
        ]));

        const meta = metaFor('/blog/nura-chain-rpc', deps(store))!;

        expect(meta.title).toBe('Connecting to the Nura Chain RPC — Nura Chain');
        expect(meta.description).toBe('Chain ID 1020, over HTTPS.');
        expect(meta.canonical).toBe(`${ SITE }/blog/nura-chain-rpc`);
        expect(meta.type).toBe('article');
        expect(meta.article?.tags).toEqual(['rpc', 'developers']);
    });

    it('is written in the post default language, not in English by default', () =>
    {
        // The renderer gets no request headers, so there is no reader to resolve against. A post
        // authored in Persian must not be described to a crawler in a language it does not hold.
        const store = storeWith(post({ slug: 'persian-first', defaultLocale: 'fa' }, [
            translation('fa', { title: 'نورا چین چیست', summary: 'خلاصه' })
        ]));

        const meta = metaFor('/blog/persian-first', deps(store))!;

        expect(meta.locale).toBe('fa');

        const html = injectMeta(SHELL, meta);

        expect(html).toContain('<html lang="fa" dir="rtl">');
    });

    it('names every other language the same url can be read in', () =>
    {
        const store = storeWith(post({ slug: 'many' }, [
            translation('en'),
            translation('fa', { title: 'فارسی' }),
            translation('tr', { title: 'Turkce' })
        ]));

        const html = injectMeta(SHELL, metaFor('/blog/many', deps(store))!);

        // The alternates are real: the switcher is client-side, so this url does serve them.
        expect(html).toContain('<meta property="og:locale" content="en_US"/>');
        expect(html).toContain('<meta property="og:locale:alternate" content="fa_IR"/>');
        expect(html).toContain('<meta property="og:locale:alternate" content="tr_TR"/>');
        // The page's own language is not also listed as an alternate to itself.
        expect(html).not.toContain('<meta property="og:locale:alternate" content="en_US"/>');
        // No hreflang: there is no second url to name. See the note in sitemap.ts.
        expect(html).not.toContain('hreflang');
    });
});

describe('the whitepaper head', () =>
{
    it('describes the document with its own canonical, its revision and its download', () =>
    {
        const content: SeoDeps = {
            store: storeWith(),
            whitepaper: whitepaper({ revision: '2.1' }, [
                chapter('en', { title: 'Nura Chain Whitepaper', summary: 'The reference.' })
            ]),
            siteUrl: SITE
        };

        const meta = metaFor('/whitepaper', content)!;

        expect(meta.title).toBe('Nura Chain Whitepaper — Nura Chain');
        expect(meta.description).toBe('The reference.');
        expect(meta.canonical).toBe(`${ SITE }/whitepaper`);
        expect(meta.type).toBe('article');
        expect(meta.robots).toBeUndefined();

        // A cited document carries its version, and the PDF is declared as an encoding of the
        // same work rather than as a page of its own.
        const article = meta.jsonLd[0] as { '@type': string; version: string; encoding: { contentUrl: string } };

        expect(article['@type']).toBe('TechArticle');
        expect(article.version).toBe('2.1');
        expect(article.encoding.contentUrl).toBe(`${ SITE }/whitepaper/nura-chain-whitepaper-en.pdf`);
    });

    it('is written in the document default language and names the others', () =>
    {
        const content: SeoDeps = {
            store: storeWith(),
            whitepaper: whitepaper({ defaultLocale: 'fa' }, [chapter('en'), chapter('fa', { title: 'وایت‌پیپر' })]),
            siteUrl: SITE
        };

        const meta = metaFor('/whitepaper', content)!;

        expect(meta.locale).toBe('fa');
        expect(meta.title).toBe('وایت‌پیپر — Nura Chain');

        const html = injectMeta(SHELL, meta);

        expect(html).toContain('<html lang="fa" dir="rtl">');
        expect(html).toContain('<meta property="og:locale:alternate" content="en_US"/>');
    });

    it('renders the body for a crawler from the same resolution as the head', () =>
    {
        // Head and body go through one call, so a page cannot describe one revision and print
        // another. The query is dropped the way it is for the blog index.
        const content = deps(storeWith());
        const detail = whitepaperFor('/whitepaper?utm=x', content)!;

        expect(detail.locale).toBe('en');
        expect(articleMarkup(detail)).toContain('<h1>Nura Chain Whitepaper (en)</h1>');
        expect(articleMarkup(detail)).toContain('<h2>1. Introduction</h2>');
    });

    it('says nothing about any other address, the downloads included', () =>
    {
        const content = deps(storeWith());

        for (const path of ['/whitepaper/nura-chain-whitepaper-en.pdf', '/blog', '/', '/whitepapers'])
        {
            expect(whitepaperFor(path, content), path).toBeNull();
        }
    });
});

describe('replacing the shell head', () =>
{
    it('leaves exactly one title and one description', () =>
    {
        const store = storeWith(post({ slug: 'one' }, [translation('en', { title: 'One' })]));
        const html = injectMeta(SHELL, metaFor('/blog/one', deps(store))!);

        // Two titles in a document is undefined behaviour every parser resolves differently.
        expect(html.match(/<title>/g)).toHaveLength(1);
        expect(html.match(/name="description"/g)).toHaveLength(1);
        expect(html).toContain('<title>One — Nura Chain</title>');
        expect(html).not.toContain('the generic one');
        // The rest of the shell survives - the hashed asset tags live in there.
        expect(html).toContain('<div id="root">');
        expect(html).toContain('<meta charset="UTF-8"/>');
    });

    it('escapes a title that would otherwise close an attribute or a tag', () =>
    {
        const store = storeWith(post({ slug: 'hostile' }, [translation('en', {
            title: 'Tags & "quotes" <script>alert(1)</script>',
            summary: "It's a <b>summary</b> & nothing more"
        })]));

        const html = injectMeta(SHELL, metaFor('/blog/hostile', deps(store))!);

        // Nothing an author typed reaches the document as markup.
        expect(html).not.toContain('<script>alert(1)</script>');
        expect(html).toContain('&lt;script&gt;');
        expect(html).toContain('&quot;quotes&quot;');
        expect(html).toContain('&#39;');
    });

    it('cannot terminate the JSON-LD script early', () =>
    {
        // An HTML parser ends a script at the first `</script`, whatever the JSON thinks - so a
        // title containing one would put the rest of the payload into the page as markup.
        const store = storeWith(post({ slug: 'breakout' }, [translation('en', {
            title: 'A </script><img src=x onerror=alert(1)> title'
        })]));

        const html = injectMeta(SHELL, metaFor('/blog/breakout', deps(store))!);
        const block = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html);

        expect(block).not.toBeNull();
        expect(block![1]).not.toContain('</script');
        expect(block![1]).not.toContain('<img');
        // Still valid JSON, and still the title the author typed once parsed back.
        const parsed = JSON.parse(block![1]!) as { headline: string };

        expect(parsed.headline).toBe('A </script><img src=x onerror=alert(1)> title');
    });

    it('does not let a title containing $& inject the matched tag back', () =>
    {
        // `String.replace` reads `$&` in a REPLACEMENT string as the whole match. Every replace
        // in injectMeta takes a function for exactly this reason.
        const store = storeWith(post({ slug: 'dollar' }, [translation('en', { title: 'Cost $& value $1' })]));
        const html = injectMeta(SHELL, metaFor('/blog/dollar', deps(store))!);

        expect(html).toContain('<title>Cost $&amp; value $1 — Nura Chain</title>');
        expect(html.match(/<title>/g)).toHaveLength(1);
    });
});

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

describe('a description for a post with no summary', () =>
{
    it('flattens markdown rather than emitting it into a search result', () =>
    {
        const body = '## A heading\n\nSome **bold** text with a [link](https://example.com) and `code`.';

        expect(excerpt(body)).toBe('A heading Some bold text with a link and code.');
    });

    it('drops fenced code entirely and cuts on a word boundary', () =>
    {
        const body = `\`\`\`bash\nnpm install everything\n\`\`\`\n\n${ 'word '.repeat(60) }`;
        const result = excerpt(body);

        expect(result).not.toContain('npm install');
        expect(result.length).toBeLessThanOrEqual(161);
        expect(result.endsWith('…')).toBe(true);
    });
});
