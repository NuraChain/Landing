// Header interactions: the mobile drawer, the language modal and the theme control.
//
// The drawer and the modal both mount through a Portal onto document.body, so they are
// queried from `document`, not from the render container.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';
import { RouterProvider, createMemoryHistory, createRouter } from 'azerothjs';

import Header from '../src/components/layout/header.component.azeroth';
import { LOCALES, nativeName, useLocale } from '../src/stores/locale';
import { useTheme } from '../src/stores/theme';
import { en } from '../src/lib/i18n/en';
import { routes } from '../src/routes';

/*
 * The header navigates, so it needs a router: a <Link> to the blog, and section anchors
 * that resolve against the current path. Both read the router from context.
 *
 * Mounted at '/' because that is where the section links are bare hashes - the state every
 * assertion below was written against. `children` is a THUNK: an eager child would be built
 * before the provider publishes the context and would not see it.
 */
const mount = (url = '/'): ReturnType<typeof renderTest> =>
{
    const router = createRouter({ routes, history: createMemoryHistory(url) });

    return renderTest(() => RouterProvider({ router, children: () => Header({}) }));
};

const byLabel = (root: ParentNode, label: string): HTMLElement | null =>
    root.querySelector<HTMLElement>(`button[aria-label="${ label }"]`);

const escape = (): void =>
{
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
};

const drawer = (): HTMLElement | null => document.querySelector<HTMLElement>('nav.drawer');
const dialog = (): HTMLElement | null => document.querySelector<HTMLElement>('[role="dialog"]');

beforeEach(() =>
{
    useLocale().choose('en');
    useTheme().choose('dark');
    document.body.style.overflow = '';
});

afterEach(() =>
{
    cleanup();
    localStorage.clear();
    document.body.style.overflow = '';
    vi.restoreAllMocks();
});

describe('mobile drawer', () =>
{
    it('is closed until the menu button is pressed', () =>
    {
        mount();

        expect(drawer()).toBeNull();
        expect(byLabel(document, en.nav.openMenu)?.getAttribute('aria-expanded')).toBe('false');
    });

    it('opens on the menu button and reports itself expanded', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');

        expect(drawer()).not.toBeNull();
        expect(byLabel(container, en.nav.closeMenu)?.getAttribute('aria-expanded')).toBe('true');
    });

    it('closes from its own close button', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        fire(byLabel(drawer()!, en.nav.closeMenu)!, 'click');

        expect(drawer()).toBeNull();
    });

    // Tapping the scrim is the gesture people try before hunting for an X.
    it('closes when the scrim is tapped', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');

        const scrim = document.querySelector('.fixed.inset-0')!;

        fire(scrim, 'click');

        expect(drawer()).toBeNull();
    });

    it('closes on Escape', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        expect(drawer()).not.toBeNull();

        escape();

        expect(drawer()).toBeNull();
    });

    // A hash link leaves the menu open behind the section it jumped to, which reads as a
    // broken overlay on a phone.
    it('closes when a section link inside it is followed', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        fire(drawer()!.querySelector('a[href="#tokenomics"]')!, 'click');

        expect(drawer()).toBeNull();
    });

    it('offers every section and the download call to action', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');

        const hrefs = [...drawer()!.querySelectorAll('a')].map((a) => a.getAttribute('href'));

        expect(hrefs).toEqual(expect.arrayContaining(['#wallet', '#tokenomics', '#chain', '#explorer', '#social']));
    });
});

describe('drawer scroll lock', () =>
{
    // Without the lock, a drag on the drawer scrolls the document underneath it and the
    // whole thing feels like a web page rather than an app.
    it('freezes the page behind the drawer and thaws it again', () =>
    {
        const { container } = mount();

        expect(document.body.style.overflow).toBe('');

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        expect(document.body.style.overflow).toBe('hidden');

        escape();
        expect(document.body.style.overflow).toBe('');
    });

    // Regression: the effect restores the PREVIOUS value rather than clearing, so a page
    // that was already locked for another reason stays locked.
    it('restores whatever overflow the page had before, not a blank', () =>
    {
        document.body.style.overflow = 'clip';

        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        expect(document.body.style.overflow).toBe('hidden');

        escape();
        expect(document.body.style.overflow).toBe('clip');
    });

    it('does not leave the page frozen when the header unmounts while open', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.openMenu)!, 'click');
        expect(document.body.style.overflow).toBe('hidden');

        cleanup();

        expect(document.body.style.overflow).not.toBe('hidden');
    });
});

describe('language modal', () =>
{
    it('opens from the language control', () =>
    {
        const { container } = mount();

        expect(dialog()).toBeNull();

        fire(byLabel(container, en.nav.language)!, 'click');

        expect(dialog()).not.toBeNull();
        expect(dialog()!.getAttribute('aria-modal')).toBe('true');
    });

    it('lists every supported language, each named in itself', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.language)!, 'click');

        const rows = [...dialog()!.querySelectorAll('button[lang]')];

        expect(rows).toHaveLength(LOCALES.length);

        for (const locale of LOCALES)
        {
            const row = rows.find((button) => button.getAttribute('lang') === locale);

            expect(row, locale).toBeDefined();
            expect(row!.textContent, locale).toContain(nativeName(locale));
        }
    });

    it('switches the language and closes itself', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.language)!, 'click');
        fire(dialog()!.querySelector('button[lang="tr"]')!, 'click');

        expect(useLocale().locale()).toBe('tr');
        expect(dialog()).toBeNull();
    });

    it('closes on Escape without changing the language', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.language)!, 'click');
        escape();

        expect(dialog()).toBeNull();
        expect(useLocale().locale()).toBe('en');
    });

    it('freezes the page behind it too', () =>
    {
        const { container } = mount();

        fire(byLabel(container, en.nav.language)!, 'click');
        expect(document.body.style.overflow).toBe('hidden');

        escape();
        expect(document.body.style.overflow).toBe('');
    });

    it('marks only the active language as chosen', () =>
    {
        useLocale().choose('es');

        const { container } = mount();

        // The trigger's accessible name is itself translated, so it is found by its role
        // relationship rather than by an English label.
        fire(container.querySelector('button[aria-haspopup="dialog"]')!, 'click');

        const rows = [...dialog()!.querySelectorAll('button[lang]')];
        const highlighted = rows.filter((row) => row.getAttribute('class')?.includes('border-accent'));

        expect(highlighted).toHaveLength(1);
        expect(highlighted[0].getAttribute('lang')).toBe('es');
    });
});

describe('theme control', () =>
{
    it('cycles the theme and names the current one', () =>
    {
        const { container } = mount();
        const button = container.querySelector<HTMLElement>('button[aria-label^="Theme"]')!;

        expect(button.getAttribute('aria-label')).toBe(`${ en.theme.label }: ${ en.theme.dark }`);

        fire(button, 'click');
        expect(useTheme().theme()).toBe('light');

        fire(button, 'click');
        expect(useTheme().theme()).toBe('contrast');

        fire(button, 'click');
        expect(useTheme().theme()).toBe('dark');
    });
});

describe('header navigation', () =>
{
    it('links the brand and every section without leaving the page', () =>
    {
        const { container } = mount();
        const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

        expect(hrefs).toContain('#top');
        expect(hrefs).toEqual(expect.arrayContaining(['#wallet', '#tokenomics', '#chain', '#explorer', '#social']));

        // The blog is the one entry that is a real route, and it is a <Link>, so the router
        // intercepts the click. Everything else is an anchor into this one document. What the
        // header must never grow is an absolute URL - that is the shape that reloads the app.
        expect(hrefs).toContain('/blog');

        for (const href of hrefs)
        {
            expect(href?.startsWith('#') === true || href?.startsWith('/') === true,
                `${ href } should stay inside the app`).toBe(true);
        }
    });

    it('roots the section anchors once the visitor is off the landing page', () =>
    {
        // From /blog a bare `#chain` points at nothing in the document being shown, and would
        // leave the visitor on /blog#chain having moved nowhere.
        const { container } = mount('/blog');
        const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));

        expect(hrefs).toEqual(expect.arrayContaining(['/#top', '/#wallet', '/#chain']));
        expect(hrefs).not.toContain('#chain');
    });

    it('relabels itself when the language changes', () =>
    {
        const { container } = mount();

        expect(container.textContent).toContain(en.nav.download);

        useLocale().choose('fr');

        expect(container.textContent).not.toContain(en.nav.download);
    });
});
