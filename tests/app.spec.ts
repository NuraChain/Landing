// Component tests run against real DOM (happy-dom) through the compiler - the same
// pipeline that serves the app. App takes a `url` so tests pin the route.
import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import App from '../src/App.azeroth';
import { useLocale } from '../src/stores/locale';

/**
 * `App` mounts SIBLING roots (the skip link, then the page shell), so it hands back an
 * array of nodes. `render()` accepts that in the browser, but `renderTest` appends its
 * component's return value directly - so the array is folded into one wrapper here.
 */
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
    // `useLocale` is a module singleton, so the signal survives `cleanup()` and outlives
    // the test that set it - clearing localStorage only stops it reaching the NEXT file.
    // Without this, whichever test switches language first decides what every later test
    // renders, down to which digits the percentages use.
    useLocale().choose('en');
});

afterEach(() =>
{
    cleanup();

    // A language choice persists to localStorage; a test that switched must not leak its
    // choice into the next one.
    localStorage.clear();
});

describe('App', () =>
{
    it('renders the chain reference card with the real values', () =>
    {
        const { container } = mountApp('/');

        const values = [...container.querySelectorAll('dl [dir="ltr"]')].map((el) => el.textContent?.trim());

        expect(values).toContain('1020');
        expect(values).toContain('https://rpc.nurachain.net');
    });

    it('offers the one-click add-chain button at the top and the bottom of the page', () =>
    {
        const { container } = mountApp('/');

        const buttons = [...container.querySelectorAll('button')]
            .filter((button) => button.textContent?.includes('Add Nura Chain to wallet'));

        expect(buttons).toHaveLength(2);
    });

    it('switches language from the modal picker and flips direction for RTL locales', () =>
    {
        const { container } = mountApp('/');

        // The trigger is icon-only, so it is found by its accessible name - which is
        // itself translated, hence the per-language label below.
        const openPicker = (triggerLabel: string): void =>
        {
            const trigger = container.querySelector(`button[aria-label="${ triggerLabel }"]`);

            expect(trigger).not.toBeNull();
            fire(trigger!, 'click');
        };

        // The modal mounts through a Portal onto document.body, outside `container`.
        const pick = (name: string): void =>
        {
            const item = [...document.querySelectorAll('[role="dialog"] button')]
                .find((button) => button.textContent?.includes(name));

            expect(item).toBeDefined();
            fire(item!, 'click');
        };

        openPicker('Language');
        pick('Español');

        expect(document.documentElement.lang).toBe('es');
        expect(container.textContent).toContain('Tus llaves');

        openPicker('Idioma');
        pick('فارسی');

        expect(document.documentElement.lang).toBe('fa');
        expect(document.documentElement.dir).toBe('rtl');
    });

    it('splits the allocation six ways and sums to a whole', () =>
    {
        const { container } = mountApp('/');

        const legend = container.querySelector('#tokenomics ul');
        const rows = [...legend!.querySelectorAll(':scope > li')];

        expect(rows).toHaveLength(6);

        // Read the percentages back off the rendered rows rather than re-importing
        // ALLOCATIONS: a table that sums to 90 would render a full bar and look fine, so
        // the sum is only worth asserting where a visitor actually reads it.
        const total = rows
            .map((row) => Number.parseFloat(row.querySelector('.font-mono')!.textContent!))
            .reduce((sum, value) => sum + value, 0);

        expect(total).toBe(100);
    });

    it('opens one allocation note at a time and closes it again', () =>
    {
        const { container } = mountApp('/');

        const infoFor = (label: string): HTMLElement =>
            container.querySelector(`#tokenomics button[aria-label="More about ${ label }"]`)!;

        const airdrop = infoFor('Airdrop');
        const locked = infoFor('Locked');

        expect(airdrop).not.toBeNull();
        expect(container.textContent).not.toContain('distributed as an airdrop');

        fire(airdrop, 'click');

        expect(airdrop.getAttribute('aria-expanded')).toBe('true');
        expect(container.textContent).toContain('distributed as an airdrop');

        // Opening another row replaces the first: the state holds one key, not a set.
        fire(locked, 'click');

        expect(airdrop.getAttribute('aria-expanded')).toBe('false');
        expect(container.textContent).not.toContain('distributed as an airdrop');
        expect(container.textContent).toContain('locked for one year');

        fire(locked, 'click');

        expect(container.textContent).not.toContain('locked for one year');
    });

    it('offers no note button for an allocation whose terms are unsettled', () =>
    {
        const { container } = mountApp('/');

        // `publicSale` has no `notes` entry, so it must render the row without the button
        // rather than an empty panel.
        expect(container.querySelector('#tokenomics button[aria-label="More about Public sale"]')).toBeNull();
        expect(container.querySelectorAll('#tokenomics ul button')).toHaveLength(5);
    });
});
