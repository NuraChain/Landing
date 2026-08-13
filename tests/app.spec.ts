// Component tests run against real DOM (happy-dom) through the compiler - the same
// pipeline that serves the app. App takes a `url` so tests pin the route.
import { describe, it, expect, afterEach } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import App from '../src/App.azeroth';

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
});
