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

        expect(values).toContain('22');
        expect(values).toContain('https://rpc.nurachain.net');
    });

    it('offers the one-click add-chain button at the top and the bottom of the page', () =>
    {
        const { container } = mountApp('/');

        const buttons = [...container.querySelectorAll('button')]
            .filter((button) => button.textContent?.includes('Add Nura Chain to wallet'));

        expect(buttons).toHaveLength(2);
    });

    it('switches language from the picker and flips direction for RTL locales', () =>
    {
        const { container } = mountApp('/');

        const trigger = [...container.querySelectorAll('button')]
            .find((button) => button.textContent?.trim() === 'en');

        expect(trigger).toBeDefined();
        fire(trigger!, 'click');

        const spanish = [...container.querySelectorAll('button')]
            .find((button) => button.textContent?.includes('Español'));

        expect(spanish).toBeDefined();
        fire(spanish!, 'click');

        expect(document.documentElement.lang).toBe('es');
        expect(container.textContent).toContain('Tus llaves');

        const reopened = [...container.querySelectorAll('button')]
            .find((button) => button.textContent?.trim() === 'es');

        fire(reopened!, 'click');

        const persian = [...container.querySelectorAll('button')]
            .find((button) => button.textContent?.includes('فارسی'));

        fire(persian!, 'click');

        expect(document.documentElement.lang).toBe('fa');
        expect(document.documentElement.dir).toBe('rtl');
    });
});
