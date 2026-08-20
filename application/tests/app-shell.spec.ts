// The shell: routing, landmarks and the document outline the whole page hangs off.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup } from '@azerothjs/testing';

import App from '../src/App.azeroth';
import { resetNetworkStats } from '../src/lib/network';
import { useLocale } from '../src/stores/locale';
import { en } from '../src/lib/i18n/en';

const ok = (body: unknown): Response => ({ ok: true, json: async () => body }) as unknown as Response;
const word = (value: bigint): string => `0x${ value.toString(16).padStart(64, '0') }`;

/** `App` mounts sibling roots, so its array return is folded into one wrapper. */
const mount = (url?: string) => renderTest((() =>
{
    const wrap = document.createElement('div');
    const nodes = App(url === undefined ? {} : { url }) as unknown;

    for (const node of (Array.isArray(nodes) ? nodes : [nodes]) as Node[])
    {
        wrap.appendChild(node);
    }

    return wrap;
}) as unknown as Parameters<typeof renderTest>[0]);

beforeEach(() =>
{
    useLocale().choose('en');
    resetNetworkStats();
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: string, init?: { body?: string }) =>
    {
        const href = String(url);

        if (href.includes('coingecko'))
        {
            return Promise.resolve(ok({ binancecoin: { usd: 1 }, tether: { usd: 1 } }));
        }
        if (href.includes('explorer'))
        {
            return Promise.resolve(ok({ indexed: { transactions: 1 } }));
        }

        return Promise.resolve((init?.body ?? '').trimStart().startsWith('[')
            ? ok([0, 1, 2, 3].map((id) => ({ jsonrpc: '2.0', id, result: word(id % 2 === 0 ? 0n : 18n) })))
            : ok({ jsonrpc: '2.0', id: 1, result: '0x1148' }));
    }));
});

afterEach(() =>
{
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
});

describe('routing', () =>
{
    it('renders the landing page at the root', () =>
    {
        const { container } = mount('/');

        for (const id of ['network', 'wallet', 'tokenomics', 'chain', 'explorer', 'social'])
        {
            expect(container.querySelector(`#${ id }`), `#${ id } should be on the home page`).not.toBeNull();
        }
    });

    it('renders the about page at /about', () =>
    {
        const { container } = mount('/about');

        expect(container.textContent).toContain('About');
        expect(container.querySelector('#tokenomics')).toBeNull();
    });

    it('renders a 404 for an unknown path rather than a blank page', () =>
    {
        const { container } = mount('/nope');

        expect(container.querySelector('main')?.textContent).toContain('404');
    });

    // Without a `url` prop the router takes real browser history - the production path,
    // which no memory-history test would exercise.
    it('falls back to browser history when mounted without an explicit url', () =>
    {
        expect(() => mount()).not.toThrow();

        expect(document.querySelector('main')).not.toBeNull();
    });
});

describe('document structure', () =>
{
    it('exposes the header, main and footer landmarks exactly once', () =>
    {
        const { container } = mount('/');

        expect(container.querySelectorAll('header')).toHaveLength(1);
        expect(container.querySelectorAll('main')).toHaveLength(1);
        expect(container.querySelectorAll('footer')).toHaveLength(1);
    });

    // One h1 per document: a second one would give the page two competing titles in the
    // outline a screen-reader user navigates by.
    it('has exactly one h1, in the hero', () =>
    {
        const { container } = mount('/');
        const headings = container.querySelectorAll('h1');

        expect(headings).toHaveLength(1);
        expect(headings[0].textContent).toBe(en.hero.headline);
    });

    it('never skips a heading level', () =>
    {
        const { container } = mount('/');
        const levels = [...container.querySelectorAll('h1, h2, h3, h4, h5, h6')]
            .map((heading) => Number(heading.tagName[1]));

        for (let index = 1; index < levels.length; index += 1)
        {
            expect(levels[index] - levels[index - 1], `jump from h${ levels[index - 1] } to h${ levels[index] }`)
                .toBeLessThanOrEqual(1);
        }
    });

    // First tab stop on the page: keyboard users should not have to walk the whole header
    // on every navigation to reach the content.
    it('opens with a skip link that targets the main landmark', () =>
    {
        const { container } = mount('/');
        const first = container.querySelector('a')!;

        expect(first.getAttribute('href')).toBe('#main');
        expect(first.textContent).toBe(en.nav.skipToContent);
        expect(container.querySelector('#main')).not.toBeNull();
    });

    it('gives the skip link a visible focus state instead of hiding it outright', () =>
    {
        const { container } = mount('/');
        const classes = container.querySelector('a')!.getAttribute('class')!;

        expect(classes).toContain('sr-only');
        expect(classes).toContain('focus:not-sr-only');
    });

    it('anchors every in-page nav target that the header links to', () =>
    {
        const { container } = mount('/');
        const targets = [...container.querySelectorAll('header a[href^="#"]')]
            .map((anchor) => anchor.getAttribute('href')!.slice(1))
            .filter((id) => id !== 'top');

        for (const id of targets)
        {
            expect(container.querySelector(`#${ id }`), `header links to #${ id }, which does not exist`).not.toBeNull();
        }
    });

    it('anchors every in-page footer target too', () =>
    {
        const { container } = mount('/');
        const targets = [...container.querySelectorAll('footer a[href^="#"]')]
            .map((anchor) => anchor.getAttribute('href')!.slice(1))
            .filter((id) => id !== 'top');

        for (const id of targets)
        {
            expect(container.querySelector(`#${ id }`), `footer links to #${ id }, which does not exist`).not.toBeNull();
        }
    });
});

describe('link safety', () =>
{
    // Every new-tab link hands the opened page a `window.opener` reference without this.
    it('gives every external link the safe rel', () =>
    {
        const { container } = mount('/');
        const external = [...container.querySelectorAll('a[target="_blank"]')];

        expect(external.length).toBeGreaterThan(0);

        for (const anchor of external)
        {
            const rel = anchor.getAttribute('rel') ?? '';

            expect(rel, anchor.getAttribute('href') ?? '').toContain('noopener');
            expect(rel, anchor.getAttribute('href') ?? '').toContain('noreferrer');
        }
    });

    it('never links out over plaintext http', () =>
    {
        const { container } = mount('/');

        for (const anchor of container.querySelectorAll('a[href^="http"]'))
        {
            expect(anchor.getAttribute('href'), 'external links must be https').toMatch(/^https:\/\//u);
        }
    });

    // A disabled download tile must not be a live link to nowhere.
    it('renders unreleased platforms as inert tiles, not dead links', () =>
    {
        const { container } = mount('/');

        for (const tile of container.querySelectorAll('#wallet a[aria-disabled="true"]'))
        {
            expect(tile.getAttribute('href')).toBeNull();
            expect(tile.textContent).toContain(en.wallet.comingSoon);
        }
    });
});

describe('images', () =>
{
    // Decorative images carry alt="" on purpose - the brand name sits beside the mark, and
    // a real alt would make a screen reader announce it twice - but the attribute must be
    // PRESENT, or assistive tech falls back to reading the file name.
    it('gives every image an alt attribute', () =>
    {
        const { container } = mount('/');
        const images = [...container.querySelectorAll('img')];

        expect(images.length).toBeGreaterThan(0);

        for (const image of images)
        {
            expect(image.hasAttribute('alt'), image.getAttribute('src') ?? '').toBe(true);
        }
    });

    // Intrinsic dimensions reserve the box before the bytes arrive, so the header does not
    // jump once the logo loads.
    it('declares intrinsic dimensions so images cannot shift the layout', () =>
    {
        const { container } = mount('/');

        for (const image of container.querySelectorAll('img'))
        {
            expect(image.hasAttribute('width'), image.getAttribute('src') ?? '').toBe(true);
            expect(image.hasAttribute('height'), image.getAttribute('src') ?? '').toBe(true);
        }
    });
});

describe('icon accessibility', () =>
{
    // Every icon sits beside real text or inside a control carrying its own name, so an
    // announced glyph would read the label twice.
    it('hides every decorative svg from assistive technology', () =>
    {
        const { container } = mount('/');
        const icons = [...container.querySelectorAll('svg')];

        expect(icons.length).toBeGreaterThan(0);

        for (const svg of icons)
        {
            expect(svg.getAttribute('aria-hidden')).toBe('true');
        }
    });

    // An icon-only control has no text node, so its name has to come from an attribute.
    it('names every icon-only control', () =>
    {
        const { container } = mount('/');

        for (const button of container.querySelectorAll('button'))
        {
            const hasText = (button.textContent ?? '').trim().length > 0;
            const hasLabel = (button.getAttribute('aria-label') ?? '').trim().length > 0;

            expect(hasText || hasLabel, button.outerHTML.slice(0, 90)).toBe(true);
        }
    });
});
