// The whitepaper page: what it renders from the document the server resolved, and what it says
// when the server could not be reached.
//
// The typed client is replaced at the module boundary rather than by stubbing `fetch`: the
// client boots from a manifest that is read once at import, before any spec can seed it, so on
// this side of the wire the honest thing to test is the page's contract with `client`, not the
// bytes it would have sent.
//
// The page is mounted through a REAL router now, because it reads its document from the route's
// loader rather than fetching in an effect. That is the shape production runs: the loader calls
// the client, the resource carries the answer, and `<Routes>` dispatches the component. Mounting
// the component bare would leave `useLoader()` with no router to resolve and throw.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup } from '@azerothjs/testing';
import { RouterProvider, Routes, createMemoryHistory, createRouter } from 'azerothjs';

const { read } = vi.hoisted(() => ({ read: vi.fn() }));

vi.mock('../src/api', () => ({ client: { whitepaper: { read } } }));

import Whitepaper from '../src/pages/whitepaper.page.azeroth';
import type { WhitepaperDetail } from '../src/api';
import { loadWhitepaper } from '../src/lib/loaders';
import { readerLocale } from '../src/lib/reader-locale';
import { useLocale } from '../src/stores/locale';
import { en } from '../src/lib/i18n/en';

const detail = (overrides: Partial<WhitepaperDetail> = {}): WhitepaperDetail => ({
    revision: '1.0',
    publishedAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
    locale: 'en',
    requestedLocale: 'en',
    translated: true,
    available: ['en'],
    title: 'Nura Chain Whitepaper',
    summary: 'The reference description of the network.',
    body: '## 1. Introduction\n\nThe network seals a block every three seconds.\n\n## 2. Fees\n\nEIP-1559.',
    pdf: '/whitepaper/nura-chain-whitepaper-en.pdf',
    ...overrides
});

/**
 * The page at its own address, with the route table's own loader.
 *
 * The row is declared here rather than imported from `routes.ts` so this spec mounts ONE page
 * instead of the whole site - but the loader is the real one, so what the page receives is
 * what production hands it.
 */
const mount = (): ReturnType<typeof renderTest> =>
{
    const router = createRouter({
        routes: [{
            path: '/whitepaper',
            component: Whitepaper,
            loader: ({ request }) => loadWhitepaper(readerLocale(request))
        }],
        history: createMemoryHistory('/whitepaper')
    });

    // The children are a THUNK: an eager child is built before the provider publishes its
    // context, and the page resolves its router during construction.
    return renderTest(() => RouterProvider({ router, children: () => Routes({}) }));
};

/** Lets the loader settle: it resolves on a microtask and the page renders on the answer. */
const settle = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() =>
{
    useLocale().choose('en');
    read.mockReset();
});

afterEach(() =>
{
    cleanup();
    localStorage.clear();
});

describe('the whitepaper page', () =>
{
    it('asks for the document in the reader language and renders it', async () =>
    {
        read.mockResolvedValue(detail());

        const { container } = mount();

        await settle();

        expect(read).toHaveBeenCalledWith({ query: { locale: 'en' } });
        expect(container.querySelector('h1')?.textContent).toBe('Nura Chain Whitepaper');
        expect(container.textContent).toContain('The network seals a block every three seconds.');
        // The body's own sections keep their numbers: a reader cites "section 2".
        expect([...container.querySelectorAll('h2')].map((h) => h.textContent)).toContain('2. Fees');
        expect(container.textContent).toContain(`${ en.whitepaper.revision } 1.0`);
    });

    it('offers the served PDF as a download, beside the title and at the foot of the text', async () =>
    {
        read.mockResolvedValue(detail({ pdf: '/whitepaper/nura-chain-whitepaper-fa.pdf' }));

        const { container } = mount();

        await settle();

        const downloads = [...container.querySelectorAll('a[download]')];

        expect(downloads).toHaveLength(2);

        for (const anchor of downloads)
        {
            // The path the SERVER named, and a file name for the downloads folder - never a
            // path the page computed for itself from the reader's language.
            expect(anchor.getAttribute('href')).toBe('/whitepaper/nura-chain-whitepaper-fa.pdf');
            expect(anchor.getAttribute('download')).toBe('nura-chain-whitepaper-fa.pdf');
            expect(anchor.textContent).toContain(en.whitepaper.download);
        }

        // The second copy sits after the body, in the panel that closes the document.
        const last = downloads[1]!;

        expect(last.compareDocumentPosition(container.querySelector('h2')!) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
    });

    it('says when the reader is looking at a fallback, and lists what the document holds', async () =>
    {
        read.mockResolvedValue(detail({ requestedLocale: 'en', translated: false, available: ['en', 'fa'] }));

        const { container } = mount();

        await settle();

        expect(container.textContent).toContain(en.blog.notTranslated);

        const offered = [...container.querySelectorAll('aside button[lang]')].map((b) => b.getAttribute('lang'));

        expect(offered).toEqual(['en', 'fa']);
    });

    it('reports a failure instead of rendering an empty document', async () =>
    {
        read.mockRejectedValue(new Error('down'));

        const { container } = mount();

        await settle();

        expect(container.querySelector('[role="alert"]')?.textContent).toContain(en.whitepaper.failed);
        expect(container.querySelector('h1')).toBeNull();
        expect(container.querySelector('a[download]')).toBeNull();
    });

    it('lands in the failed state when the client refuses synchronously', async () =>
    {
        // With no manifest the typed client throws at the CALL rather than rejecting. A loader
        // that throws synchronously is judged exactly as one that rejects, so the page shows
        // its failure state rather than the whole render dying.
        read.mockImplementation(() =>
        {
            throw new Error('no manifest');
        });

        const { container } = mount();

        await settle();

        expect(container.querySelector('[role="alert"]')).not.toBeNull();
    });

    it('asks again in the new language when the reader switches', async () =>
    {
        read.mockResolvedValue(detail());

        mount();

        await settle();

        // Which translation is served is the SERVER's decision, so a switch is a new request
        // rather than a re-render - and the language is not one of the loader's own inputs,
        // which is exactly what `useLocalizedLoader` exists to watch.
        useLocale().choose('fa');

        await settle();

        expect(read).toHaveBeenCalledTimes(2);
        expect(read).toHaveBeenLastCalledWith({ query: { locale: 'fa' } });
    });
});
