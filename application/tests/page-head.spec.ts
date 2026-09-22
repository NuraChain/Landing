// @vitest-environment node

// The pieces a page's head is built from.
//
// The head itself is asserted over a real server in `ssr.spec.ts` - that is what a crawler
// receives, and the only place the kit's splice, the shell's own tags and the page's
// declaration all meet. What is here is the two things that spec cannot see: the fallback
// description a document with no summary gets, and the fact that both halves of the
// repository agree on the origin every absolute url is built from.
import { describe, it, expect } from 'vitest';

import { DEFAULT_SITE_URL } from '../../server/src/app.ts';
import { SITE_URL } from '../src/lib/content/site';
import { excerpt, SOCIAL_IMAGE } from '../src/lib/head';

describe('the origin the site names itself by', () =>
{
    it('is the same in both halves', () =>
    {
        /*
         * The application builds canonicals, Open Graph urls and JSON-LD from `SITE_URL`; the
         * server builds the sitemap from `DEFAULT_SITE_URL`. A drift between them is a site
         * whose sitemap lists addresses its own pages disown - which is invisible in both
         * halves and only shows up in a search console weeks later.
         */
        expect(SITE_URL).toBe(DEFAULT_SITE_URL);
    });

    it('carries no trailing slash, so every path can be appended', () =>
    {
        expect(SITE_URL.endsWith('/')).toBe(false);
    });
});

describe('the social card', () =>
{
    it('is the wide one, at the size every card layout is built from', () =>
    {
        // 1200x630: every layout in use lays out at ~1.91:1 and crops or letterboxes anything
        // else. The file itself is checked in `head.spec.ts`, which reads its pixels.
        expect(SOCIAL_IMAGE.width).toBe(1200);
        expect(SOCIAL_IMAGE.height).toBe(630);
        expect(SOCIAL_IMAGE.url).toBe(`${ SITE_URL }/og-image.png`);
        expect(SOCIAL_IMAGE.alt).not.toBe('');
    });
});

describe('a description for a document with no summary', () =>
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

    it('leaves a short body alone', () =>
    {
        expect(excerpt('Just a sentence.')).toBe('Just a sentence.');
    });
});
