// The reusable components, rendered through the real compiler against real DOM.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';
import { Check } from 'lucide';

import Banner from '../src/components/banner.component.azeroth';
import Button from '../src/components/button.component.azeroth';
import Card from '../src/components/card.component.azeroth';
import CopyField from '../src/components/copy-field.component.azeroth';
import SectionHeading from '../src/components/section-heading.component.azeroth';
import { brandIcon } from '../src/components/brand-icon';
import { flagSrc } from '../src/components/flag-icon';
import { icon } from '../src/components/icon';
import { platformIcon } from '../src/components/platform-icon';
import { DOWNLOADS, SOCIALS } from '../src/lib/content/site';
import { LOCALES } from '../src/stores/locale';

afterEach(() =>
{
    cleanup();
    vi.restoreAllMocks();
});

describe('Button', () =>
{
    it('renders a real button when it has no href', () =>
    {
        const { container } = renderTest(() => Button({ children: 'Go' }));
        const button = container.querySelector('button');

        expect(button).not.toBeNull();
        expect(container.querySelector('a')).toBeNull();
        expect(button!.getAttribute('type')).toBe('button');
        expect(button!.textContent).toContain('Go');
    });

    // A control that navigates must BE a link, or middle-click and open-in-new-tab break.
    it('renders an anchor when it has an href', () =>
    {
        const { container } = renderTest(() => Button({ children: 'Docs', href: '/docs' }));

        expect(container.querySelector('a')?.getAttribute('href')).toBe('/docs');
        expect(container.querySelector('button')).toBeNull();
    });

    // Opening a new tab without `noopener` hands the target page a window reference back.
    it('adds the safe rel and target only for external links', () =>
    {
        const external = renderTest(() => Button({ children: 'X', href: 'https://x.test', external: true }));

        expect(external.container.querySelector('a')?.getAttribute('rel')).toBe('noreferrer noopener');
        expect(external.container.querySelector('a')?.getAttribute('target')).toBe('_blank');
        cleanup();

        const internal = renderTest(() => Button({ children: 'X', href: '/local' }));

        expect(internal.container.querySelector('a')?.getAttribute('target')).toBeNull();
        expect(internal.container.querySelector('a')?.getAttribute('rel')).toBeNull();
    });

    it('fires onClick when pressed', () =>
    {
        const onClick = vi.fn();
        const { container } = renderTest(() => Button({ children: 'Go', onClick }));

        fire(container.querySelector('button')!, 'click');

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('marks a disabled button disabled and shows it', () =>
    {
        const { container } = renderTest(() => Button({ children: 'Go', disabled: true }));
        const button = container.querySelector('button')!;

        expect(button.hasAttribute('disabled')).toBe(true);
        expect(button.getAttribute('class')).toContain('cursor-not-allowed');
    });

    it('carries an explicit accessible name when one is given', () =>
    {
        const { container } = renderTest(() => Button({ children: '×', ariaLabel: 'Close' }));

        expect(container.querySelector('button')?.getAttribute('aria-label')).toBe('Close');
    });

    it('supports submit buttons without changing the default', () =>
    {
        const submit = renderTest(() => Button({ children: 'Send', type: 'submit' }));

        expect(submit.container.querySelector('button')?.getAttribute('type')).toBe('submit');
    });
});

describe('Card', () =>
{
    it('renders a plain div when it is not a link', () =>
    {
        const { container } = renderTest(() => Card({ children: 'body' }));

        expect(container.querySelector('a')).toBeNull();
        expect(container.textContent).toContain('body');
    });

    // The whole rectangle is the target, not just a few words inside it.
    it('renders the whole card as one anchor when given an href', () =>
    {
        const { container } = renderTest(() => Card({ children: 'body', href: 'https://x.test', external: true }));
        const anchor = container.querySelector('a')!;

        expect(anchor.getAttribute('href')).toBe('https://x.test');
        expect(anchor.getAttribute('rel')).toBe('noreferrer noopener');
        expect(anchor.textContent).toContain('body');
    });

    it('only adds hover affordances to cards that actually do something', () =>
    {
        const inert = renderTest(() => Card({ children: 'x' }));

        expect(inert.container.firstElementChild?.getAttribute('class')).not.toContain('hover:');
        cleanup();

        const link = renderTest(() => Card({ children: 'x', href: '/a' }));

        expect(link.container.querySelector('a')?.getAttribute('class')).toContain('hover:');
    });
});

describe('Banner', () =>
{
    // Colour alone is invisible to a colourblind reader and to anyone printing the page.
    it('announces the warn tone and carries an icon, not just a colour', () =>
    {
        const { container } = renderTest(() => Banner({ tone: 'warn', children: 'provisional' }));
        const paragraph = container.querySelector('p')!;

        expect(paragraph.getAttribute('role')).toBe('status');
        expect(paragraph.querySelector('svg')).not.toBeNull();
        expect(paragraph.textContent).toContain('provisional');
    });

    it('defaults to the warn tone', () =>
    {
        const { container } = renderTest(() => Banner({ children: 'x' }));

        expect(container.querySelector('p')?.getAttribute('role')).toBe('status');
    });

    it('does not announce the informational tone', () =>
    {
        const { container } = renderTest(() => Banner({ tone: 'info', children: 'fyi' }));

        expect(container.querySelector('p')?.getAttribute('role')).toBeNull();
    });
});

describe('SectionHeading', () =>
{
    // The page has exactly one h1 in the hero; a section picking its own level would break
    // the outline a screen-reader user navigates by.
    it('is always an h2, never another level', () =>
    {
        const { container } = renderTest(() => SectionHeading({ title: 'Tokenomics' }));

        expect(container.querySelector('h2')?.textContent).toBe('Tokenomics');
        expect(container.querySelector('h1, h3, h4')).toBeNull();
    });

    it('renders the lede only when there is one', () =>
    {
        const withSub = renderTest(() => SectionHeading({ title: 'T', subtitle: 'the lede' }));

        expect(withSub.container.querySelector('p')?.textContent).toBe('the lede');
        cleanup();

        const without = renderTest(() => SectionHeading({ title: 'T' }));

        expect(without.container.querySelector('p')).toBeNull();
    });
});

describe('CopyField', () =>
{
    const writeText = vi.fn<(text: string) => Promise<void>>();

    beforeEach(() =>
    {
        writeText.mockReset();
        writeText.mockResolvedValue(undefined);
        vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
        vi.useFakeTimers();
    });

    afterEach(() =>
    {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    const mount = (props: Partial<Parameters<typeof CopyField>[0]> = {}) =>
        renderTest(() => CopyField({
            value: '0x4ac0d9300422b408bA2AbF47995C87cF32763712',
            copyLabel: 'Copy address',
            copiedLabel: 'Copied',
            ...props
        }));

    it('renders the value LTR-isolated so bidi cannot reorder it', () =>
    {
        const { container } = mount();
        const bdi = container.querySelector('bdi')!;

        expect(bdi.getAttribute('dir')).toBe('ltr');
        expect(bdi.textContent).toBe('0x4ac0d9300422b408bA2AbF47995C87cF32763712');
    });

    it('copies the exact value to the clipboard', async () =>
    {
        const { container } = mount();

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

        expect(writeText).toHaveBeenCalledWith('0x4ac0d9300422b408bA2AbF47995C87cF32763712');
    });

    it('confirms the copy on the button, then reverts', async () =>
    {
        const { container } = mount();
        const button = container.querySelector('button')!;

        expect(button.getAttribute('aria-label')).toBe('Copy address');

        fire(button, 'click');
        await vi.waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copied'));

        vi.advanceTimersByTime(1600);

        expect(button.getAttribute('aria-label')).toBe('Copy address');
    });

    // Regression: a second copy must restart the countdown rather than inherit the first
    // one, or the confirmation vanishes early on the click that just happened.
    it('restarts the countdown when copied again mid-confirmation', async () =>
    {
        const { container } = mount();
        const button = container.querySelector('button')!;

        fire(button, 'click');
        await vi.waitFor(() => expect(button.getAttribute('aria-label')).toBe('Copied'));

        vi.advanceTimersByTime(1500);
        fire(button, 'click');
        await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));

        // The first timer would have fired at 1600ms; the second copy pushed it out.
        vi.advanceTimersByTime(200);
        expect(button.getAttribute('aria-label')).toBe('Copied');

        vi.advanceTimersByTime(1400);
        expect(button.getAttribute('aria-label')).toBe('Copy address');
    });

    // Clipboard access is permission-gated and blocked outright in some embedded browsers.
    // The value is on screen and selectable, so a failure costs convenience only - but it
    // must not throw, and must not claim success.
    it('stays quiet and does not claim success when the clipboard is blocked', async () =>
    {
        writeText.mockRejectedValue(new Error('NotAllowedError'));

        const { container } = mount();
        const button = container.querySelector('button')!;

        expect(() => fire(button, 'click')).not.toThrow();
        await vi.waitFor(() => expect(writeText).toHaveBeenCalled());

        expect(button.getAttribute('aria-label')).toBe('Copy address');
    });

    it('omits the copy button for values nobody copies', () =>
    {
        const { container } = mount({ copyable: false });

        expect(container.querySelector('button')).toBeNull();
        expect(container.querySelector('bdi')?.textContent).toBeTruthy();
    });

    it('renders an external link when the value is one a browser can open', () =>
    {
        const { container } = mount({ value: 'https://explorer.test', href: 'https://explorer.test' });
        const anchor = container.querySelector('a')!;

        expect(anchor.getAttribute('href')).toBe('https://explorer.test');
        expect(anchor.getAttribute('rel')).toBe('noreferrer noopener');
        expect(anchor.querySelector('bdi')?.getAttribute('dir')).toBe('ltr');
    });

    // The documented reason the flag is local state: a shared one would light up whichever
    // row the parent last recorded.
    it('confirms only the field that was copied', async () =>
    {
        const { container } = renderTest(() =>
        {
            const wrap = document.createElement('div');

            for (const value of ['first', 'second'])
            {
                wrap.appendChild(CopyField({ value, copyLabel: `Copy ${ value }`, copiedLabel: `Copied ${ value }` }) as Node);
            }

            return wrap;
        });

        const buttons = [...container.querySelectorAll('button')];

        fire(buttons[0], 'click');
        await vi.waitFor(() => expect(buttons[0].getAttribute('aria-label')).toBe('Copied first'));

        expect(buttons[1].getAttribute('aria-label')).toBe('Copy second');
    });
});

describe('icon helpers', () =>
{
    // Every icon sits beside real text or inside a control that carries its own accessible
    // name, so announcing the glyph too would read the label twice.
    it('hides lucide glyphs from assistive technology', () =>
    {
        const svg = icon(Check, 'size-4');

        expect(svg.getAttribute('aria-hidden')).toBe('true');
        expect(svg.getAttribute('class')).toBe('size-4');
    });

    it('draws every social brand mark in currentColor, never a baked-in hex', () =>
    {
        for (const social of SOCIALS)
        {
            const svg = brandIcon(social.id);

            expect(svg.getAttribute('aria-hidden'), social.id).toBe('true');
            expect(svg.getAttribute('viewBox'), social.id).toBe('0 0 24 24');
            expect(svg.querySelector('path')?.getAttribute('fill'), social.id).toBe('currentColor');
            expect(svg.querySelector('path')?.getAttribute('d'), social.id).toBeTruthy();
        }
    });

    it('draws a mark for every platform tile, including the hand-written Windows path', () =>
    {
        for (const entry of DOWNLOADS)
        {
            const svg = platformIcon(entry.id);

            expect(svg.getAttribute('aria-hidden'), entry.id).toBe('true');
            expect(svg.querySelector('path')?.getAttribute('d'), entry.id).toBeTruthy();
            expect(svg.querySelector('path')?.getAttribute('fill'), entry.id).toBe('currentColor');
        }
    });

    it('has a flag for every locale in the switcher', () =>
    {
        for (const locale of LOCALES)
        {
            expect(flagSrc(locale), locale).toBeTruthy();
        }

        // Distinct flags, so no two rows look like the same language.
        const flags = LOCALES.map((locale) => flagSrc(locale));

        expect(new Set(flags).size).toBe(flags.length);
    });
});
