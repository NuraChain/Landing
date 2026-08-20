// Direction regressions, guarded at the DOM level.
//
// What these can and cannot prove: happy-dom parses markup and runs the components, but it
// does not lay out Tailwind classes, so `getComputedStyle` here reports nothing useful about
// geometry. Every assertion below is therefore about the DOM contract that PRODUCES the
// right layout - which attribute pins which element, which element is allowed to carry
// `text-start` - rather than about pixels. The pixel behaviour each one stands in for was
// measured in Chromium against the dev server; the measurement is recorded in the comment
// on each test so a future reader knows what breaking it would actually look like.
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import App from '../src/App.azeroth';
import { resetNetworkStats } from '../src/lib/network';
import { useLocale } from '../src/stores/locale';

const mountApp = (url: string): ReturnType<typeof renderTest> => renderTest((() =>
{
    const wrap = document.createElement('div');
    const nodes = App({ url }) as unknown;

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
        const batched = (init?.body ?? '').trimStart().startsWith('[');

        return Promise.resolve({
            ok: true,
            json: async () =>
            {
                if (String(url).includes('coingecko'))
                {
                    return { binancecoin: { usd: 600 }, tether: { usd: 1 } };
                }

                if (String(url).includes('explorer'))
                {
                    return { indexed: { transactions: 1 } };
                }

                return batched
                    ? [0, 1, 2, 3].map((id) => ({ jsonrpc: '2.0', id, result: `0x${ (id % 2 === 0 ? 0 : 18).toString(16).padStart(64, '0') }` }))
                    : { jsonrpc: '2.0', id: 1, result: '0x1148' };
            }
        } as unknown as Response);
    }));
});

afterEach(() =>
{
    cleanup();
    vi.unstubAllGlobals();
    localStorage.clear();
});

/** The language modal is the only way in, and its trigger is icon-only. */
const pickLanguage = (container: Element, triggerLabel: string, nativeName: string): void =>
{
    const trigger = container.querySelector(`button[aria-label="${ triggerLabel }"]`);

    expect(trigger).not.toBeNull();
    fire(trigger!, 'click');

    const row = [...document.querySelectorAll('[role="dialog"] button')]
        .find((button) => button.textContent?.includes(nativeName));

    expect(row).toBeDefined();
    fire(row!, 'click');
};

describe('document direction', () =>
{
    it('ships ltr for English and rtl for both RTL locales', () =>
    {
        const { container } = mountApp('/');

        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.dir).toBe('ltr');

        pickLanguage(container, 'Language', 'فارسی');

        expect(document.documentElement.lang).toBe('fa');
        expect(document.documentElement.dir).toBe('rtl');

        pickLanguage(container, 'زبان', 'العربية');

        expect(document.documentElement.lang).toBe('ar');
        expect(document.documentElement.dir).toBe('rtl');
    });

    // The direction has to survive a round trip, not just the first switch: an effect that
    // only ever sets `rtl` leaves an English visitor stuck mirrored after one detour.
    it('returns to ltr when switching back out of an RTL locale, with no reload', () =>
    {
        const { container } = mountApp('/');

        pickLanguage(container, 'Language', 'فارسی');
        expect(document.documentElement.dir).toBe('rtl');

        pickLanguage(container, 'زبان', 'English');

        expect(document.documentElement.lang).toBe('en');
        expect(document.documentElement.dir).toBe('ltr');
    });

    it('leaves the non-Latin LTR locales alone', () =>
    {
        const { container } = mountApp('/');

        pickLanguage(container, 'Language', '中文');

        expect(document.documentElement.lang).toBe('zh');
        expect(document.documentElement.dir).toBe('ltr');
    });
});

describe('technical values stay LTR inside an RTL page', () =>
{
    // The regression this exists for: the chain card pinned `dir="ltr"` on the SAME element
    // that carried `text-start`. `start` resolves against the element's own direction, so in
    // Persian every value aligned to the far LEFT of a 666px flex slot - measured 420-633px
    // of dead space between a Persian label and the RPC URL it names. The fix splits the two
    // jobs: the block keeps the page direction so `text-start` means "beside the label", and
    // an inner <bdi> carries the LTR pin. Chromium now measures a 16px gap (the row's
    // gap-x-4) on every row in both directions.
    it('pins chain values on an inner bdi, never on the element that aligns them', () =>
    {
        const { container } = mountApp('/');

        const values = [...container.querySelectorAll('#chain dd .truncate')];

        expect(values.length).toBeGreaterThan(0);

        for (const value of values)
        {
            // The aligning block must NOT carry a direction of its own.
            expect(value.hasAttribute('dir')).toBe(false);
            expect(value.className).toContain('text-start');

            // ...and the value inside it must be isolated and pinned.
            const bdi = value.querySelector('bdi');

            expect(bdi).not.toBeNull();
            expect(bdi!.getAttribute('dir')).toBe('ltr');
            expect(bdi!.textContent?.trim().length).toBeGreaterThan(0);
        }
    });

    it('keeps the RPC endpoint and chain id readable as written', () =>
    {
        const { container } = mountApp('/');

        const values = [...container.querySelectorAll('#chain bdi[dir="ltr"]')]
            .map((el) => el.textContent?.trim());

        expect(values).toContain('1020');
        expect(values).toContain('https://rpc.nurachain.net');
        expect(values).toContain('https://explorer.nurachain.net');
    });

    // The bridge holder is a wallet address rendered inside a Persian panel; the platform
    // note (".deb · x64") is a Latin format string whose leading dot bidi would otherwise
    // throw to the far end, rendering it "deb · x64.".
    it('pins wallet addresses and Latin format strings', async () =>
    {
        const { container } = mountApp('/');

        // The platform note is static markup and is there on mount.
        const onMount = [...container.querySelectorAll('[dir="ltr"]')].map((el) => el.textContent?.trim());

        expect(onMount).toContain('.deb · x64');

        // The bridge holder only exists once the TVL read resolves, so the address assertion
        // has to wait for it rather than racing the stubbed fetch.
        await vi.waitFor(() =>
        {
            const pinned = [...container.querySelectorAll('[dir="ltr"]')].map((el) => el.textContent?.trim());

            expect(pinned.some((text) => text?.startsWith('0x'))).toBe(true);
        });
    });

    // `/about` is the one page whose copy never goes through `t()`. Under `dir=rtl` its
    // English prose lost every trailing neutral to the far end - the lede rendered
    // ":You navigated here client-side" and `src/pages/` came out as `/src/pages`, which
    // reads as an absolute path and is simply the wrong answer.
    it('isolates the file paths and commands on the untranslated about page', () =>
    {
        const { container } = mountApp('/about');

        const identifiers = [...container.querySelectorAll('code bdi[dir="ltr"]')]
            .map((el) => el.textContent?.trim());

        expect(identifiers).toContain('src/pages/');
        expect(identifiers).toContain('src/routes.ts');
        expect(identifiers).toContain('npm run build');

        // The section is pinned too, for as long as its copy is untranslated English.
        expect(container.querySelector('section[dir="ltr"]')).not.toBeNull();
    });
});

describe('directional icons', () =>
{
    // Mirror only what means "direction of travel". The hero arrow means "onward" and
    // rotates; the outbound markers mean "away from this page" and mirror on the x axis,
    // because the flex row has already moved them to the opposite edge in RTL and an
    // unmirrored up-right arrow sitting at the LEFT edge points back into its own label.
    // Rotating those 180 degrees instead would produce a DOWN-left arrow and read as a
    // download.
    it('flips the onward arrow and mirrors the outbound markers, and nothing else', () =>
    {
        const { container } = mountApp('/');

        const classOf = (svg: Element): string => svg.getAttribute('class') ?? '';
        const directional = [...container.querySelectorAll('svg')].filter((svg) =>
            classOf(svg).includes('rtl:'));

        expect(directional.length).toBeGreaterThanOrEqual(3);

        const hero = container.querySelector('a[href="#wallet"] svg');

        expect(classOf(hero!)).toContain('rtl:rotate-180');

        for (const svg of [...container.querySelectorAll('#social svg, #explorer a[target="_blank"] svg')]
            .filter((svg) => classOf(svg).includes('rtl:')))
        {
            expect(classOf(svg)).toContain('rtl:-scale-x-100');
        }
    });

    // Brand marks and logos must never mirror: a reversed GitHub or Telegram mark is a
    // recognisably wrong shape, and the flag in the language picker is a photograph of a
    // flag, not an arrow.
    it('never mirrors brand marks or flags', () =>
    {
        const { container } = mountApp('/');

        for (const svg of container.querySelectorAll('#social span:first-child svg, footer svg'))
        {
            expect(svg.getAttribute('class') ?? '').not.toContain('scale-x');
        }

        for (const img of container.querySelectorAll('img'))
        {
            expect(img.getAttribute('class') ?? '').not.toContain('scale-x');
        }
    });
});

describe('locale-aware numerals', () =>
{
    // Every figure on the site goes through Intl. The footer year was the one exception -
    // a raw template literal that left "2026" in Latin digits inside a Persian sentence,
    // three sections below a supply figure rendered "۱٬۰۰۰٬۰۰۰٬۰۰۰".
    it('renders the copyright year in the active locale, ungrouped', () =>
    {
        const { container } = mountApp('/');
        const year = new Date().getFullYear();

        expect(container.querySelector('footer')?.textContent).toContain(String(year));

        pickLanguage(container, 'Language', 'فارسی');

        const persian = new Intl.NumberFormat('fa', { useGrouping: false }).format(year);
        const footer = container.querySelector('footer')?.textContent ?? '';

        expect(footer).toContain(persian);

        // A year is not a quantity: grouping would render it "۲٬۰۲۶".
        expect(footer).not.toContain(new Intl.NumberFormat('fa').format(year));
    });
});
