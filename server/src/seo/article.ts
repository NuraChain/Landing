import type { PostLocale } from '../schemas.ts';

import { attr as escapeHtml, directionOf } from './meta.ts';

/**
 * What one document needs to be rendered for a crawler. A post and the whitepaper both satisfy
 * it, so `articleMarkup` renders either; nothing below reads a slug or a tag.
 */
export interface ArticleLike
{
    locale: PostLocale;
    title: string;
    body: string;
    publishedAt: string | null;
}

/**
 * The article, as markup a crawler can read.
 *
 * WHY THIS EXISTS. `/blog/:slug` is `render: 'server'`, but the page it renders fetches inside
 * an `effect`, which never runs on a server - so what was served was the frame with a loading
 * skeleton in it, and the indexed page contained no article. The head was right and the body
 * was empty. This renders the body into the same document.
 *
 * WHY IT IS NOT `lib/markdown.ts`. That parser is the BROWSER's, it produces a tree rather than
 * markup, and the two halves share types only - importing it here would be the second crossing
 * and would drag the client runtime into this process. So this is a second reading of the same
 * subset, and normally that is exactly the drift this codebase argues against.
 *
 * It is safe here for one specific reason, and it is worth stating because it is the whole
 * justification: `main.azeroth` mounts with `render()`, not `hydrate()`, and `render()` EMPTIES
 * its container before mounting. Whatever this emits is deleted the moment the bundle boots.
 * Nothing hydrates against it, so it cannot mismatch, and it does not have to agree with the
 * client's DOM down to a class name - only to say the same words in the same order. That is
 * what a crawler reads and what a reader with no JavaScript gets.
 *
 * WHAT IT ESCAPES. Everything. The tree parser on the other side is safe by construction -
 * it never produces markup - and this one produces nothing BUT markup, so every author string
 * goes through `attr` on the way in - the same escape the head uses. Hrefs are additionally filtered by `safeHref`:
 * `javascript:` and `data:` are the two that turn a link into script.
 */

/** The heading depths markdown offers, mapped to the tags a body may use under the page's h1. */
const HEADING_TAGS = ['h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * A url this site is willing to point at, or null.
 *
 * Deliberately the same three shapes `lib/markdown.ts` accepts: a site-relative path, a
 * fragment, and an absolute http(s) url. `//evil.example` is refused explicitly - it looks like
 * a path and passes a naive "starts with a slash" check, but a browser reads it as
 * protocol-relative and leaves the site.
 */
export function safeHref(raw: string): string | null
{
    const href = raw.trim();

    if (href === '' || href.startsWith('//'))
    {
        return null;
    }

    if (href.startsWith('/') || href.startsWith('#'))
    {
        return href;
    }

    return /^https?:\/\//i.test(href) ? href : null;
}

/** Inline spans, in precedence order. Code first: a backtick span is literal. */
const INLINE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]*\]\((?:[^()\s]|\([^()\s]*\))*\))/g;
const LINK = /^\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))*)\)$/;

/** One line of prose to HTML, with every author string escaped on the way through. */
function inline(source: string): string
{
    let out = '';
    let at = 0;

    for (const match of source.matchAll(INLINE))
    {
        const token = match[0];
        const index = match.index;

        out += escapeHtml(source.slice(at, index));
        at = index + token.length;

        if (token.startsWith('`'))
        {
            out += `<code>${ escapeHtml(token.slice(1, -1)) }</code>`;
        }
        else if (token.startsWith('**'))
        {
            out += `<strong>${ escapeHtml(token.slice(2, -2)) }</strong>`;
        }
        else if (token.startsWith('*'))
        {
            out += `<em>${ escapeHtml(token.slice(1, -1)) }</em>`;
        }
        else
        {
            const link = LINK.exec(token);
            const href = link === null ? null : safeHref(link[2] ?? '');

            // A refused url keeps its TEXT and loses its link. Dropping the whole span would
            // delete a sentence's worth of prose over one bad href.
            out += href === null
                ? escapeHtml(link?.[1] ?? token)
                : `<a href="${ escapeHtml(href) }">${ escapeHtml(link?.[1] ?? '') }</a>`;
        }
    }

    return out + escapeHtml(source.slice(at));
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^[-*]\s+(.*)$/;
const NUMBER = /^\d+\.\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;
const IMAGE = /^!\[([^\]]*)\]\(((?:[^()\s]|\([^()\s]*\))*)\)$/;

/**
 * Markdown to HTML.
 *
 * Line-oriented and single pass, like the parser it mirrors. Headings LEVEL against the
 * document's own shallowest heading, so `#`/`##` and `##`/`###` both come out h2/h3 rather than
 * skipping a level under the page's h1 - the same rule the browser applies, and the one that
 * keeps the outline valid for a screen reader and for a crawler reading structure.
 */
export function renderArticle(markdown: string): string
{
    const lines = markdown.split('\n');

    // The shallowest heading in THIS document decides what h2 means for it.
    const depths = lines
        .map((line) => HEADING.exec(line))
        .filter((match): match is RegExpExecArray => match !== null)
        .map((match) => (match[1] ?? '#').length);
    const shallowest = depths.length === 0 ? 1 : Math.min(...depths);

    const out: string[] = [];
    let paragraph: string[] = [];
    let list: { ordered: boolean; items: string[] } | null = null;

    const closeParagraph = (): void =>
    {
        if (paragraph.length > 0)
        {
            out.push(`<p>${ inline(paragraph.join(' ')) }</p>`);
            paragraph = [];
        }
    };

    const closeList = (): void =>
    {
        if (list !== null)
        {
            const tag = list.ordered ? 'ol' : 'ul';

            out.push(`<${ tag }>${ list.items.map((item) => `<li>${ inline(item) }</li>`).join('') }</${ tag }>`);
            list = null;
        }
    };

    const close = (): void =>
    {
        closeParagraph();
        closeList();
    };

    for (let at = 0; at < lines.length; at++)
    {
        const line = lines[at] ?? '';

        // A fence swallows lines VERBATIM until it closes. Nothing inside is parsed, which is
        // what stops a code sample full of asterisks and backticks becoming emphasis.
        if (line.trimStart().startsWith('```'))
        {
            close();

            const body: string[] = [];

            for (at += 1; at < lines.length; at++)
            {
                if ((lines[at] ?? '').trimStart().startsWith('```'))
                {
                    break;
                }

                body.push(lines[at] ?? '');
            }

            out.push(`<pre><code>${ escapeHtml(body.join('\n')) }</code></pre>`);
            continue;
        }

        const trimmed = line.trim();

        if (trimmed === '')
        {
            close();
            continue;
        }

        if (RULE.test(trimmed))
        {
            close();
            out.push('<hr/>');
            continue;
        }

        const image = IMAGE.exec(trimmed);

        if (image !== null)
        {
            close();

            const src = safeHref(image[2] ?? '');

            if (src !== null)
            {
                out.push(`<img src="${ escapeHtml(src) }" alt="${ escapeHtml(image[1] ?? '') }"/>`);
            }

            continue;
        }

        const heading = HEADING.exec(trimmed);

        if (heading !== null)
        {
            close();

            const step = (heading[1] ?? '#').length - shallowest;
            const tag = HEADING_TAGS[Math.min(Math.max(step, 0), HEADING_TAGS.length - 1)];

            out.push(`<${ tag }>${ inline(heading[2] ?? '') }</${ tag }>`);
            continue;
        }

        const quote = QUOTE.exec(trimmed);

        if (quote !== null)
        {
            close();
            out.push(`<blockquote><p>${ inline(quote[1] ?? '') }</p></blockquote>`);
            continue;
        }

        const bullet = BULLET.exec(trimmed);
        const number = NUMBER.exec(trimmed);

        if (bullet !== null || number !== null)
        {
            closeParagraph();

            const ordered = number !== null;
            const text = (ordered ? number[1] : bullet?.[1]) ?? '';

            // A switch between bullets and numbers ends one list and opens another, rather than
            // silently folding the second into the first under the wrong tag.
            if (list !== null && list.ordered !== ordered)
            {
                closeList();
            }

            list ??= { ordered, items: [] };
            list.items.push(text);
            continue;
        }

        closeList();
        paragraph.push(trimmed);
    }

    close();

    return out.join('');
}

/**
 * The whole article as one crawlable block: heading, date, and the rendered body.
 *
 * `lang` and `dir` are the POST's, not the document's. A post served as an English fallback
 * inside a site set to Persian is a left-to-right run in a mirrored document, and without its
 * own direction every trailing comma lands at the wrong end of the line - the same reasoning,
 * and the same pair of attributes, as the browser component that replaces this.
 */
export function articleMarkup(detail: ArticleLike): string
{
    const date = detail.publishedAt === null
        ? ''
        : `<p><time datetime="${ escapeHtml(detail.publishedAt) }">${ escapeHtml(detail.publishedAt.slice(0, 10)) }</time></p>`;

    return `<article data-ssr-article lang="${ escapeHtml(detail.locale) }" dir="${ directionOf(detail.locale) }">`
        + `<h1>${ escapeHtml(detail.title) }</h1>`
        + date
        + renderArticle(detail.body)
        + '</article>';
}

/**
 * Splices the article in as the first thing inside the rendered root.
 *
 * Prepended rather than substituted, so the frame the kit rendered - header, footer, the shape
 * of the page - survives underneath it. Both are gone within a frame of the bundle booting, so
 * the only audience for the order is a crawler and a reader with no JavaScript, and both are
 * better served by the article being early in the document.
 *
 * `slice` rather than `String.replace`: a rendered article routinely contains `$&` and `$'`,
 * which the replacement-string form would expand into the surrounding document. The same trap
 * `injectMeta` and the kit's own renderer each have a note about.
 */
export function injectArticle(html: string, markup: string): string
{
    const marker = '<div id="root">';
    const at = html.indexOf(marker);

    return at === -1 ? html : html.slice(0, at + marker.length) + markup + html.slice(at + marker.length);
}
