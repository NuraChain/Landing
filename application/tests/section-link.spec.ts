// A link to a landing section has to do two different things depending on where it is
// clicked from, and getting the second one wrong is invisible in the markup.
//
// The regression this file exists for: every section link in the header and the footer was a
// plain `<a href="/#chain">`. That is a cross-document navigation, which the router does not
// intercept, so reaching a heading from /blog tore the whole document down and built it
// again. It looked correct - the right section, the right scroll - and cost a full request,
// a bundle parse and a re-hydration every time.
import { describe, it, expect, afterEach } from 'vitest';
import { renderTest, cleanup } from '@azerothjs/testing';
import { RouterProvider, createMemoryHistory, createRouter } from 'azerothjs';

import SectionLink from '../src/components/ui/section-link.component.azeroth';
import { routes } from '../src/routes';

const mount = (url: string): { root: ParentNode; link: HTMLAnchorElement } =>
{
    const router = createRouter({ routes, history: createMemoryHistory(url) });

    // `children` is a THUNK: an eager child is built before the provider publishes context.
    const rendered = renderTest(() => RouterProvider({
        router,
        children: () => SectionLink({ id: 'chain', class: 'x', children: 'Chain' })
    }));

    const link = rendered.container.querySelector('a');

    if (link === null)
    {
        throw new Error('SectionLink rendered no anchor');
    }

    return { root: rendered.container, link };
};

/** A left click, cancelable, the way a real one arrives. */
const click = (link: HTMLAnchorElement): MouseEvent =>
{
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });

    link.dispatchEvent(event);

    return event;
};

afterEach(() =>
{
    cleanup();
});

describe('SectionLink', () =>
{
    it('is one anchor, so it can be a <For> row', () =>
    {
        const { root } = mount('/');

        expect(root.querySelectorAll('a')).toHaveLength(1);
    });

    describe('on the landing page', () =>
    {
        it('writes a bare hash, which is the form smooth-scroll delegates on', () =>
        {
            // `lib/smooth-scroll.ts` matches `a[href^="#"]`. A rooted href here would miss
            // the delegate AND reload the page it is already showing.
            expect(mount('/').link.getAttribute('href')).toBe('#chain');
        });

        it('leaves the click alone for Lenis to glide', () =>
        {
            const event = click(mount('/').link);

            expect(event.defaultPrevented).toBe(false);
        });
    });

    describe('from another route', () =>
    {
        it('roots the href, because a bare hash points at nothing here', () =>
        {
            expect(mount('/blog').link.getAttribute('href')).toBe('/#chain');
        });

        it('takes the click, so the document is never rebuilt to reach a heading', () =>
        {
            const event = click(mount('/blog').link);

            expect(event.defaultPrevented).toBe(true);
        });

        it.each([
            ['ctrlKey'],
            ['metaKey'],
            ['shiftKey'],
            ['altKey']
        ])('leaves a %s click to the browser, which is opening a tab', (modifier) =>
        {
            const { link } = mount('/blog');
            const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, [modifier]: true });

            link.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(false);
        });

        it('leaves a middle click to the browser', () =>
        {
            const { link } = mount('/blog');
            const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 1 });

            link.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(false);
        });
    });

    it('runs the caller\'s onClick before deciding anything - the drawer closes either way', () =>
    {
        const seen: string[] = [];
        const router = createRouter({ routes, history: createMemoryHistory('/blog') });
        const rendered = renderTest(() => RouterProvider({
            router,
            children: () => SectionLink({ id: 'chain', onClick: () => seen.push('closed'), children: 'Chain' })
        }));

        click(rendered.container.querySelector('a')!);

        expect(seen).toEqual(['closed']);
    });
});
