/**
 * A strict markdown subset, parsed to a TREE.
 *
 * The tree is the security design. A renderer that builds an HTML string and hands it to
 * `innerHTML` is one escaping mistake away from executing whatever an author pasted; this parser
 * never produces markup at all. It produces data, the component renders that data through real
 * elements, and text reaches the DOM as text. There is nothing to escape, so there is nothing to
 * get wrong - script in a post is impossible rather than filtered.
 *
 * What is deliberately NOT supported: raw HTML, tables, footnotes, nested emphasis, nested lists,
 * reference links, and inline formatting inside a link. Each is a feature somebody would use once
 * and a parser branch that would live forever. The set below is what a release note needs.
 */

export type Inline =
    | { kind: 'text'; text: string }
    | { kind: 'strong'; text: string }
    | { kind: 'em'; text: string }
    | { kind: 'code'; text: string }
    | { kind: 'link'; text: string; href: string };

export type Block =
    | { kind: 'heading'; level: 2 | 3 | 4; inline: Inline[] }
    | { kind: 'paragraph'; inline: Inline[] }
    | { kind: 'list'; ordered: boolean; items: Inline[][] }
    | { kind: 'quote'; inline: Inline[] }
    | { kind: 'code'; text: string }
    | { kind: 'image'; src: string; alt: string }
    | { kind: 'rule' };

/**
 * A url this site is willing to point at, or null.
 *
 * Three shapes pass: a site-relative path, a fragment, and an absolute http(s) url. Everything
 * else is refused, and the ones that matter are `javascript:` and `data:` - the two that turn a
 * link into script the moment somebody clicks it.
 *
 * `//evil.example` is refused explicitly. It LOOKS like a path and passes a naive "starts with a
 * slash" check, but a browser reads it as protocol-relative and leaves the site.
 */
export function safeHref(raw: string): string | null
{
    const value = raw.trim();

    if (value === '' || value.startsWith('//'))
    {
        return null;
    }

    if (value.startsWith('/') || value.startsWith('#'))
    {
        return value;
    }

    try
    {
        const url = new URL(value);

        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
    }
    catch
    {
        // Not a url at all. A bare word is not a link, and guessing one would be worse.
        return null;
    }
}

/**
 * An image source: a path served by this site, or an https url.
 *
 * Plain http is refused where a link allows it - a mixed-content image is blocked by the browser
 * anyway, so accepting one only produces a post with a hole in it.
 */
export function safeSrc(raw: string): string | null
{
    const value = raw.trim();

    if (value === '' || value.startsWith('//'))
    {
        return null;
    }

    if (value.startsWith('/'))
    {
        return value;
    }

    try
    {
        return new URL(value).protocol === 'https:' ? value : null;
    }
    catch
    {
        return null;
    }
}

/**
 * One pass over a line of text, in precedence order.
 *
 * Code first, because a backtick span is literal: `**not bold**` inside one has to survive as
 * the characters an author typed.
 */
// The url part allows ONE level of balanced parentheses. A naive `[^)]+` stops at the first
// `)`, which truncates every real url containing a pair - a Wikipedia article such as
// `/wiki/Nura_(river)` is the ordinary case rather than a corner one. It also means a
// refused url like `javascript:alert(1)` is consumed WHOLE, so the fallback keeps the
// author's text intact instead of splitting it around a stray bracket.
const URL_PART = String.raw`(?:[^()\s]|\([^()\s]*\))*`;

const INLINE = new RegExp(
    [
        String.raw`(\x60[^\x60\n]+\x60)`,
        String.raw`(\*\*[^*\n]+\*\*)`,
        String.raw`(\*[^*\n]+\*)`,
        String.raw`(_[^_\n]+_)`,
        String.raw`(\[[^\]\n]*\]\(${ URL_PART }\))`
    ].join('|'), 'g');

const LINK = new RegExp(String.raw`^\[([^\]]*)\]\((${ URL_PART })\)$`);

export function parseInline(source: string): Inline[]
{
    const out: Inline[] = [];
    let at = 0;

    const push = (text: string): void =>
    {
        if (text !== '')
        {
            out.push({ kind: 'text', text });
        }
    };

    for (const match of source.matchAll(INLINE))
    {
        const [token] = match;
        const start = match.index;

        push(source.slice(at, start));
        at = start + token.length;

        if (token.startsWith('`'))
        {
            out.push({ kind: 'code', text: token.slice(1, -1) });
        }
        else if (token.startsWith('**'))
        {
            out.push({ kind: 'strong', text: token.slice(2, -2) });
        }
        else if (token.startsWith('*') || token.startsWith('_'))
        {
            out.push({ kind: 'em', text: token.slice(1, -1) });
        }
        else
        {
            const link = LINK.exec(token);
            const href = link === null ? null : safeHref(link[2] ?? '');

            // A refused url does not vanish and does not become a dead link: the text stays,
            // as text, so the sentence still reads and nothing is silently swallowed.
            if (link === null || href === null)
            {
                push(token);
            }
            else
            {
                out.push({ kind: 'link', text: link[1] ?? '', href });
            }
        }
    }

    push(source.slice(at));

    return out;
}

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^[-*]\s+(.*)$/;
const NUMBER = /^\d+\.\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const IMAGE = new RegExp(String.raw`^!\[([^\]]*)\]\((${ URL_PART })\)$`);
const RULE = /^(-{3,}|\*{3,}|_{3,})$/;

/**
 * Markdown to blocks.
 *
 * Line-oriented and single-pass. A fenced code block swallows lines verbatim until it closes -
 * or until the source ends, because an unclosed fence is a thing authors do and losing the rest
 * of the post over it would be the worse answer.
 */
export function parseMarkdown(source: string): Block[]
{
    const lines = source.replace(/\r\n?/g, '\n').split('\n');
    const blocks: Block[] = [];
    let paragraph: string[] = [];

    const flush = (): void =>
    {
        if (paragraph.length === 0)
        {
            return;
        }

        const text = paragraph.join(' ').trim();

        paragraph = [];

        if (text !== '')
        {
            blocks.push({ kind: 'paragraph', inline: parseInline(text) });
        }
    };

    for (let at = 0; at < lines.length; at++)
    {
        const line = lines[at] ?? '';
        const trimmed = line.trim();

        if (trimmed.startsWith('```'))
        {
            flush();

            const held: string[] = [];

            at++;

            while (at < lines.length && !(lines[at] ?? '').trim().startsWith('```'))
            {
                held.push(lines[at] ?? '');
                at++;
            }

            blocks.push({ kind: 'code', text: held.join('\n') });

            continue;
        }

        if (trimmed === '')
        {
            flush();

            continue;
        }

        if (RULE.test(trimmed))
        {
            flush();
            blocks.push({ kind: 'rule' });

            continue;
        }

        const image = IMAGE.exec(trimmed);

        if (image !== null)
        {
            const src = safeSrc(image[2] ?? '');

            flush();

            // A refused source drops the image rather than rendering a broken one. Unlike a
            // link there is no text to fall back to - an `![]()` carries nothing but the alt.
            if (src !== null)
            {
                blocks.push({ kind: 'image', src, alt: image[1] ?? '' });
            }

            continue;
        }

        const heading = HEADING.exec(trimmed);

        if (heading !== null)
        {
            flush();

            // Capped at h2 and floored at h4. The page's h1 is the post's title, so a `#` in the
            // body is a section under it - starting the body at h1 would give the document two,
            // and headings that skip a level are the most common structural failure there is.
            const depth = (heading[1] ?? '#').length;
            const level = depth <= 1 ? 2 : depth === 2 ? 3 : 4;

            blocks.push({ kind: 'heading', level, inline: parseInline(heading[2] ?? '') });

            continue;
        }

        const quote = QUOTE.exec(trimmed);

        if (quote !== null)
        {
            flush();
            blocks.push({ kind: 'quote', inline: parseInline(quote[1] ?? '') });

            continue;
        }

        const bullet = BULLET.exec(trimmed);
        const numbered = NUMBER.exec(trimmed);

        if (bullet !== null || numbered !== null)
        {
            flush();

            const ordered = numbered !== null;
            const items: Inline[][] = [];

            // Consecutive items of the SAME kind become one list; switching marker starts a new
            // one, which is what an author who changed their mind mid-list actually meant.
            while (at < lines.length)
            {
                const next = (lines[at] ?? '').trim();
                const match = ordered ? NUMBER.exec(next) : BULLET.exec(next);

                if (match === null)
                {
                    break;
                }

                items.push(parseInline(match[1] ?? ''));
                at++;
            }

            at--;
            blocks.push({ kind: 'list', ordered, items });

            continue;
        }

        paragraph.push(trimmed);
    }

    flush();

    return blocks;
}
