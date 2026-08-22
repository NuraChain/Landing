// The markdown subset.
//
// Two things are under test. The first is the parse: what an author types becomes the blocks
// they meant. The second, and the reason this file is long, is what does NOT come out - a url
// that would execute, a tag that would run, a protocol-relative path that leaves the site.
//
// The renderer builds a tree and never a string, so the class of bug these guard is "the parser
// produced a node it should have refused", not "the escaping missed a case".
import { describe, it, expect, afterEach } from 'vitest';
import { renderTest, cleanup } from '@azerothjs/testing';

import { parseInline, parseMarkdown, safeHref, safeSrc, type Block } from '../src/lib/markdown';
import Markdown from '../src/components/content/markdown.component.azeroth';

const kinds = (blocks: Block[]): string[] => blocks.map((block) => block.kind);

describe('urls a post is allowed to point at', () =>
{
    it('accepts a site path, a fragment and an absolute http(s) url', () =>
    {
        expect(safeHref('/blog')).toBe('/blog');
        expect(safeHref('#section')).toBe('#section');
        expect(safeHref('https://nura.example/docs')).toBe('https://nura.example/docs');
        expect(safeHref('http://nura.example')).toBe('http://nura.example/');
    });

    it('refuses the two protocols that turn a link into script', () =>
    {
        expect(safeHref('javascript:alert(1)')).toBeNull();
        expect(safeHref('JavaScript:alert(1)')).toBeNull();
        expect(safeHref('  javascript:alert(1)  ')).toBeNull();
        expect(safeHref('data:text/html,<script>alert(1)</script>')).toBeNull();
        expect(safeHref('vbscript:msgbox(1)')).toBeNull();
    });

    it('refuses a protocol-relative url, which LOOKS like a path', () =>
    {
        // `//evil.example` passes a naive "starts with a slash" check and then leaves the site.
        expect(safeHref('//evil.example')).toBeNull();
        expect(safeSrc('//evil.example/pixel.gif')).toBeNull();
    });

    it('refuses plain http for an IMAGE where it allows it for a link', () =>
    {
        // A mixed-content image is blocked by the browser anyway, so accepting one would only
        // produce a post with a hole in it.
        expect(safeSrc('http://nura.example/a.png')).toBeNull();
        expect(safeSrc('https://nura.example/a.png')).toBe('https://nura.example/a.png');
        expect(safeSrc('/covers/a.png')).toBe('/covers/a.png');
    });

    it('refuses an empty or nonsense url rather than guessing one', () =>
    {
        expect(safeHref('')).toBeNull();
        expect(safeHref('   ')).toBeNull();
        expect(safeHref('not a url')).toBeNull();
    });
});

describe('inline', () =>
{
    it('reads emphasis, code and links', () =>
    {
        expect(parseInline('a **bold** and *slanted* and `code`')).toEqual([
            { kind: 'text', text: 'a ' },
            { kind: 'strong', text: 'bold' },
            { kind: 'text', text: ' and ' },
            { kind: 'em', text: 'slanted' },
            { kind: 'text', text: ' and ' },
            { kind: 'code', text: 'code' }
        ]);
    });

    it('keeps a backtick span literal', () =>
    {
        // Code comes first in the scan for exactly this: what is inside backticks is what the
        // author typed, markers included.
        expect(parseInline('`**not bold**`')).toEqual([{ kind: 'code', text: '**not bold**' }]);
    });

    it('keeps a url that contains balanced parentheses whole', () =>
    {
        // The ordinary case this exists for, not a corner one: a naive url pattern stops at the
        // first `)` and truncates the link to a page nobody meant.
        expect(parseInline('[Nura](https://en.wikipedia.org/wiki/Nura_(river))')).toEqual([
            { kind: 'link', text: 'Nura', href: 'https://en.wikipedia.org/wiki/Nura_(river)' }
        ]);
    });

    it('reads a link and keeps its text', () =>
    {
        expect(parseInline('see [the docs](https://nura.example)')).toEqual([
            { kind: 'text', text: 'see ' },
            { kind: 'link', text: 'the docs', href: 'https://nura.example/' }
        ]);
    });

    it('leaves a refused link as TEXT rather than dropping the sentence', () =>
    {
        // The words stay readable and nothing is silently swallowed; what is gone is the link.
        expect(parseInline('click [here](javascript:alert(1)) now')).toEqual([
            { kind: 'text', text: 'click ' },
            { kind: 'text', text: '[here](javascript:alert(1))' },
            { kind: 'text', text: ' now' }
        ]);
    });

    it('never produces a node from raw html', () =>
    {
        // There is no 'html' node kind to produce, which is the whole design: a tag an author
        // pastes is text, and it reaches the DOM through a text node.
        const nodes = parseInline('<script>alert(1)</script> and <img src=x onerror=alert(1)>');

        expect(nodes.every((node) => node.kind === 'text')).toBe(true);
        expect(nodes.map((node) => node.text).join('')).toContain('<script>');
    });
});

describe('blocks', () =>
{
    it('splits paragraphs on blank lines and joins wrapped ones', () =>
    {
        const blocks = parseMarkdown('one\nstill one\n\ntwo');

        expect(kinds(blocks)).toEqual(['paragraph', 'paragraph']);
        expect(blocks[0]).toMatchObject({ inline: [{ kind: 'text', text: 'one still one' }] });
    });

    it('starts headings at h2, because the page already has an h1', () =>
    {
        // A body that opened at h1 would give the document two, and a level that skips is the
        // most common structural failure a page has.
        const blocks = parseMarkdown('# One\n\n## Two\n\n### Three\n\n###### Six');

        expect(blocks.map((block) => block.kind === 'heading' ? block.level : 0)).toEqual([2, 3, 4, 4]);
    });

    it('starts a body written in ## at h2 as well, rather than skipping to h3', () =>
    {
        // The convention this has to survive: an author who reserves `#` for the title they are
        // not writing here, and opens every section with `##`. Reading `##` as h3 unconditionally
        // would send the document h1 -> h3 and skip a level, which nothing on the page reveals.
        const blocks = parseMarkdown('## Two\n\n### Three');

        expect(blocks.map((block) => block.kind === 'heading' ? block.level : 0)).toEqual([2, 3]);
    });

    it('keeps a gap the author left, but never past h4', () =>
    {
        const blocks = parseMarkdown('## Two\n\n#### Four\n\n###### Six');

        expect(blocks.map((block) => block.kind === 'heading' ? block.level : 0)).toEqual([2, 4, 4]);
    });

    it('levels against the shallowest heading, wherever it appears', () =>
    {
        // The deepest heading comes FIRST here: normalizing on the running minimum rather than the
        // whole document would level this one against `###` and demote the section below it.
        const blocks = parseMarkdown('### Deep first\n\n# Shallow later');

        expect(blocks.map((block) => block.kind === 'heading' ? block.level : 0)).toEqual([4, 2]);
    });

    it('reads both kinds of list, and ends one at a blank line', () =>
    {
        const blocks = parseMarkdown('- a\n- b\n\n1. one\n2. two\n\nafter');

        expect(kinds(blocks)).toEqual(['list', 'list', 'paragraph']);
        expect(blocks[0]).toMatchObject({ ordered: false });
        expect(blocks[1]).toMatchObject({ ordered: true });
        expect((blocks[0] as { items: unknown[] }).items).toHaveLength(2);
    });

    it('starts a NEW list when the marker changes', () =>
    {
        // An author who switched from bullets to numbers meant two lists, not one confused one.
        expect(kinds(parseMarkdown('- a\n1. b'))).toEqual(['list', 'list']);
    });

    it('takes a fenced block verbatim, markers and all', () =>
    {
        const blocks = parseMarkdown('```\n# not a heading\n- not a list\n```');

        expect(blocks).toEqual([{ kind: 'code', text: '# not a heading\n- not a list' }]);
    });

    it('survives an unclosed fence rather than losing the rest of the post', () =>
    {
        // Authors do this. Swallowing everything after it is worse than closing it for them.
        expect(parseMarkdown('```\nstill code')).toEqual([{ kind: 'code', text: 'still code' }]);
    });

    it('reads quotes, rules and images', () =>
    {
        const blocks = parseMarkdown('> quoted\n\n---\n\n![a chart](/covers/chart.png)');

        expect(kinds(blocks)).toEqual(['quote', 'rule', 'image']);
        expect(blocks[2]).toEqual({ kind: 'image', src: '/covers/chart.png', alt: 'a chart' });
    });

    it('drops an image whose source is refused, since there is no text to fall back to', () =>
    {
        expect(parseMarkdown('![x](javascript:alert(1))')).toEqual([]);
        expect(parseMarkdown('![x](//evil.example/p.gif)')).toEqual([]);
    });

    it('handles an empty body and a body of only whitespace', () =>
    {
        expect(parseMarkdown('')).toEqual([]);
        expect(parseMarkdown('   \n\n  \n')).toEqual([]);
    });

    it('normalises Windows line endings', () =>
    {
        // A body pasted from a Windows editor must not become one paragraph with stray returns.
        expect(kinds(parseMarkdown('one\r\n\r\ntwo'))).toEqual(['paragraph', 'paragraph']);
    });

    it('reads right-to-left text as ordinary text', () =>
    {
        const blocks = parseMarkdown('## شبکه اصلی\n\nنخستین بلاک **امروز** استخراج شد.');

        expect(kinds(blocks)).toEqual(['heading', 'paragraph']);
        expect(blocks[1]).toMatchObject({ inline: [
            { kind: 'text', text: 'نخستین بلاک ' },
            { kind: 'strong', text: 'امروز' },
            { kind: 'text', text: ' استخراج شد.' }
        ] });
    });
});

describe('the parser cannot be made to emit a dangerous node', () =>
{
    // A seeded sweep rather than a list of known payloads: the property is structural - whatever
    // goes in, every link and image that comes OUT has a url this site was willing to point at.
    const HOSTILE = [
        '[a](javascript:alert(1))',
        '[a](JAVASCRIPT:alert(1))',
        '[a](  javascript:alert(1))',
        '[a](java\tscript:alert(1))',
        '[a](data:text/html;base64,PHNjcmlwdD4=)',
        '![i](javascript:alert(1))',
        '![i](//evil.example)',
        '[a](//evil.example)',
        '<a href="javascript:alert(1)">x</a>',
        '<script>alert(1)</script>',
        '<img src=x onerror=alert(1)>',
        '> <script>alert(1)</script>',
        '# <script>alert(1)</script>',
        '- <script>alert(1)</script>',
        '`<script>alert(1)</script>`'
    ];

    it.each(HOSTILE)('refuses to produce a link or image node for %s', (source) =>
    {
        for (const block of parseMarkdown(source))
        {
            if (block.kind === 'image')
            {
                expect(safeSrc(block.src)).not.toBeNull();
            }

            const run = block.kind === 'paragraph' || block.kind === 'heading' || block.kind === 'quote'
                ? block.inline
                : block.kind === 'list' ? block.items.flat() : [];

            for (const node of run)
            {
                if (node.kind === 'link')
                {
                    // Whatever the input, a link that survived has a vetted href.
                    expect(safeHref(node.href)).not.toBeNull();
                    expect(node.href.toLowerCase()).not.toContain('javascript:');
                    expect(node.href.toLowerCase()).not.toContain('data:');
                }
            }
        }
    });
});

afterEach(cleanup);

// A post body is the one place on the site where a Latin run - a method name, a hex chain id,
// a url, a JSON fragment - is written by an author rather than by a component, and it is read
// in ten languages including two that mirror. These are the direction pins that keep such a run
// ordering on its own terms inside a Persian or Arabic sentence.
describe('code keeps its own direction inside a mirrored page', () =>
{
    it('pins an inline code span', () =>
    {
        // The edges are what break: `{`, `}`, `"` and `*` are bidi neutral, so without an
        // isolate they resolve against the paragraph and the span renders inside out.
        const { container } = renderTest(() => Markdown({ source: 'مقدار `personal_*` را بخوانید.' }));
        const code = container.querySelector('code');

        expect(code).not.toBeNull();
        expect(code!.getAttribute('dir')).toBe('ltr');
        expect(code!.textContent).toBe('personal_*');
    });

    it('pins a fenced block and leaves it keyboard reachable', () =>
    {
        const fenced = ['```', 'curl -s https://rpc.nurachain.net', '```'].join('\n');
        const { container } = renderTest(() => Markdown({ source: fenced }));
        const pre = container.querySelector('pre');

        expect(pre).not.toBeNull();
        expect(pre!.getAttribute('dir')).toBe('ltr');
        // `overflow-x-auto` makes this a scrollable region on a narrow screen; a scrollable
        // region that cannot be focused is unreachable by keyboard - WCAG 2.1.1.
        expect(pre!.getAttribute('tabindex')).toBe('0');
    });

    it('does not pin ordinary prose, which must follow the reader', () =>
    {
        const { container } = renderTest(() => Markdown({ source: 'یک جمله فارسی بدون کد.' }));

        expect(container.querySelector('[dir]')).toBeNull();
    });
});
