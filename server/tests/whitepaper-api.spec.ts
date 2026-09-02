// The whitepaper's public read API.
//
// content.spec.ts covers the loader against the repository's own files. What is worth pinning
// HERE is the boundary: that the reader's language reaches the resolver, that the fallback is
// reported rather than silently applied, that the PDF named is the one in the language SERVED,
// and that a language the site does not speak is refused rather than coerced.
import { describe, it, expect } from 'vitest';

import type { WhitepaperDetail } from '../src/schemas.ts';
import { chapter, harness, whitepaper } from './support/fixtures.ts';

describe('reading the whitepaper', () =>
{
    it('serves the document in its default language when none is asked for', async () =>
    {
        const { json } = harness();
        const detail = await json<WhitepaperDetail>('/api/whitepaper');

        expect(detail.locale).toBe('en');
        expect(detail.requestedLocale).toBe('en');
        expect(detail.translated).toBe(true);
        expect(detail.revision).toBe('1.0');
        expect(detail.body).toContain('three seconds');
    });

    it('serves the reader their own language when the document holds it', async () =>
    {
        const { json } = harness({
            whitepaper: whitepaper({}, [chapter('en'), chapter('fa', { title: 'وایت‌پیپر', body: 'بدنه' })])
        });

        const detail = await json<WhitepaperDetail>('/api/whitepaper?locale=fa');

        expect(detail.locale).toBe('fa');
        expect(detail.translated).toBe(true);
        expect(detail.title).toBe('وایت‌پیپر');
        expect(detail.body).toBe('بدنه');
    });

    it('falls back to the default language and says so, naming every language it does hold', async () =>
    {
        // Declared out of the site's order on purpose: the list a reader is offered has to come
        // back in the site's order, not in the order the files happened to be read.
        const { json } = harness({
            whitepaper: whitepaper({}, [chapter('fa'), chapter('en')])
        });

        const detail = await json<WhitepaperDetail>('/api/whitepaper?locale=tr');

        expect(detail.locale).toBe('en');
        expect(detail.requestedLocale).toBe('tr');
        expect(detail.translated).toBe(false);
        expect(detail.available).toEqual(['en', 'fa']);
    });

    it('names the PDF in the language served, not the one asked for', async () =>
    {
        // A reader shown the English fallback must download the English file: a page in one
        // language with a download in another is the one way the two can disagree.
        const { json } = harness({ whitepaper: whitepaper({}, [chapter('en')]) });

        const detail = await json<WhitepaperDetail>('/api/whitepaper?locale=ar');

        expect(detail.locale).toBe('en');
        expect(detail.pdf).toBe('/whitepaper/nura-chain-whitepaper-en.pdf');

        const own = await json<WhitepaperDetail>('/api/whitepaper?locale=en');

        expect(own.pdf).toBe('/whitepaper/nura-chain-whitepaper-en.pdf');
    });

    it('refuses a language the site does not speak', async () =>
    {
        const { get } = harness();

        expect((await get('/api/whitepaper?locale=xx')).status).toBe(422);
    });

    it('serves no download when no directory is mounted', async () =>
    {
        // The suite never mounts one, so this is the shape every other spec runs against: the
        // api answers, the file does not, and nothing here has read a disk.
        const { get } = harness();

        expect((await get('/whitepaper/nura-chain-whitepaper-en.pdf')).status).toBe(404);
    });
});
