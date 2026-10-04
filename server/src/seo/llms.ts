/**
 * `/llms.txt`: the site described for a language model, generated from the store.
 *
 * The sitemap tells a crawler which addresses exist. It says nothing about what is AT them, so
 * an answer engine deciding whether this site can answer a question has to fetch and render
 * forty pages to find out. This is the same list with one line of description each, in the
 * markdown shape llmstxt.org proposes: a title, a one-paragraph summary, then sections of
 * links. One request, no script, no rendering.
 *
 * Generated for the reason the sitemap is: a file committed under public/ is a second list of
 * posts to keep in step with the first, and it goes stale in the silent direction. Reading the
 * store means publishing IS listing.
 *
 * English only, and deliberately. The file has one address and no negotiation, and a post's
 * address is the same in every language - so each line carries the English head and the note
 * at the top says the other nine are served from that same url.
 */
import { resolve } from '../blog/present.ts';
import type { SiteContent } from '../content.ts';
import { POST_LOCALES } from '../schemas.ts';
import { toWhitepaper } from '../whitepaper/content.ts';

/** How many rows one store read pulls back - see the same constant in sitemap.ts. */
const CHUNK = 500;

/** The language every line is written in. A post with no English falls back the way a reader does. */
const LOCALE = 'en';

/** The name the file opens with. A proper noun, the same in every language the site ships. */
const SITE_NAME = 'Nura Chain';

/**
 * What the SITE is, in one paragraph - the blockquote a model reads before any link.
 *
 * It describes what is here rather than the chain's figures on purpose. Chain id, RPC endpoint
 * and supply are stated in `application/src/lib/content/site.ts` and in the whitepaper; a copy
 * here would be a third place to keep them true, in the half that does not own them.
 */
const SITE_SUMMARY = 'Nura Chain is an open, EVM-compatible blockchain. This site holds its whitepaper and a blog: '
    + 'guides to the network, and plain-language explainers of blockchain news with dated, sourced figures.';

/**
 * One line of prose for a markdown list item.
 *
 * A head is plain text by convention, but the file is parsed line by line: a newline inside a
 * summary would end the item and start a paragraph, and a stray `]` in a title would close the
 * link early. Neither can be written through the typed heads today; both are one careless edit
 * away.
 */
const flat = (value: string): string => value.replace(/\s+/gu, ' ').trim();
const label = (value: string): string => flat(value).replaceAll('[', '(').replaceAll(']', ')');

/** `- [title](url): summary`, or without the colon when there is nothing to say after it. */
const item = (title: string, url: string, note: string): string =>
    (flat(note) === '' ? `- [${ label(title) }](${ url })` : `- [${ label(title) }](${ url }): ${ flat(note) }`);

/**
 * The whole file as one document.
 *
 * Only PUBLISHED posts, newest first: `store.list` cannot reach a draft, so there is no
 * arrangement of this function that leaks one.
 */
export function buildLlmsTxt(content: SiteContent, siteUrl: string): string
{
    const { store, whitepaper } = content;
    const paper = toWhitepaper(whitepaper, LOCALE);
    const lines: string[] = [`# ${ SITE_NAME }`, '', `> ${ SITE_SUMMARY }`, ''];

    lines.push(
        `Every page is published in ${ POST_LOCALES.length } languages (${ POST_LOCALES.join(', ') }) at ONE address. `
        + 'The language is negotiated per request from the `Accept-Language` header, so the links below '
        + 'return the same document in whichever of those languages is asked for. Dates are ISO 8601.',
        '');

    if (paper !== null)
    {
        lines.push(
            '## Whitepaper',
            '',
            item(paper.title, `${ siteUrl }/whitepaper`, `${ flat(paper.summary) } Revision ${ whitepaper.revision }, updated ${ whitepaper.updatedAt.slice(0, 10) }.`),
            '');
    }

    const posts: string[] = [];

    for (let offset = 0; ; offset += CHUNK)
    {
        const { rows, total } = store.list({ limit: CHUNK, offset });

        for (const stored of rows)
        {
            const head = resolve(stored, LOCALE);

            if (head !== null)
            {
                // The date is the article's own, stated on the line: a model weighing two
                // answers about a moving subject needs to know which one is older.
                posts.push(item(
                    head.title,
                    `${ siteUrl }/blog/${ stored.post.slug }`,
                    `${ flat(head.summary) } Published ${ stored.post.publishedAt.slice(0, 10) }.`));
            }
        }

        if (rows.length === 0 || offset + CHUNK >= total)
        {
            break;
        }
    }

    if (posts.length > 0)
    {
        lines.push('## Blog', '', ...posts, '');
    }

    return `${ lines.join('\n').trimEnd() }\n`;
}
