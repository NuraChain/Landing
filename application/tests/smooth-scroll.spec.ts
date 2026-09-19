// `scrollToSection` is the landing half of a cross-route section link, and every wrong
// version of it looked right in a browser for a second or two before settling somewhere
// else. The behaviours worth pinning are all about WHEN it acts, so the frames are driven
// by hand here rather than waited on.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { scrollToSection } from '../src/lib/smooth-scroll';

/** Frames, on demand. Nothing here waits on a real clock. */
let queue: FrameRequestCallback[] = [];

const frame = (count = 1): void =>
{
    for (let i = 0; i < count; i += 1)
    {
        const due = queue;

        queue = [];
        for (const cb of due)
        {
            cb(0);
        }
    }
};

/** Where `window.scrollTo` last put us; the document is `pageHeight` tall. */
let scrolled = 0;
let pageHeight = 4000;

const section = (top: number): HTMLElement =>
{
    const node = document.createElement('div');

    node.id = 'chain';
    // happy-dom lays nothing out, so the one measurement the helper reads is declared.
    Object.defineProperty(node, 'offsetTop', { configurable: true, value: top });
    document.body.append(node);

    return node;
};

beforeEach(() =>
{
    queue = [];
    scrolled = 0;
    pageHeight = 4000;

    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback): number =>
    {
        queue.push(cb);

        return queue.length;
    });

    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
    Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scrolled });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, get: () => pageHeight });
    vi.stubGlobal('scrollTo', (_x: number, y: number): void =>
    {
        scrolled = y;
    });
});

afterEach(() =>
{
    document.body.innerHTML = '';
    document.body.style.overflow = '';
    vi.unstubAllGlobals();
});

describe('scrollToSection', () =>
{
    it('lands the section 88px down, clear of the sticky header', () =>
    {
        section(1000);

        scrollToSection('chain');
        frame(3);

        expect(scrolled).toBe(912);
    });

    it('waits for a section that has not mounted yet', () =>
    {
        scrollToSection('chain');
        frame(4);

        expect(scrolled).toBe(0);

        section(1000);
        frame(2);

        expect(scrolled).toBe(912);
    });

    it('waits while a drawer still holds the body locked', () =>
    {
        // lib/overlay.ts keeps `overflow: hidden` for as long as a panel is open, and the
        // drawer that held the link closes in the same click. A scroll issued here is lost.
        section(1000);
        document.body.style.overflow = 'hidden';

        scrollToSection('chain');
        frame(4);

        expect(scrolled).toBe(0);

        document.body.style.overflow = '';
        frame(2);

        expect(scrolled).toBe(912);
    });

    it('re-aims when the page grows under it', () =>
    {
        // The hero above the target is still filling in. A single-shot version landed short
        // by exactly however much arrived after it aimed.
        const node = section(1000);

        scrollToSection('chain');
        frame(2);

        expect(scrolled).toBe(912);

        Object.defineProperty(node, 'offsetTop', { configurable: true, value: 1600 });
        frame(2);

        expect(scrolled).toBe(1512);
    });

    it('never scrolls past the end of the document', () =>
    {
        // The document is briefly still the page being LEFT, whose height clamps the scroll.
        section(3800);
        pageHeight = 1000;

        scrollToSection('chain');
        frame(3);

        expect(scrolled).toBe(100);

        pageHeight = 5000;
        frame(2);

        expect(scrolled).toBe(3712);
    });

    it('lets go once the target has held still', () =>
    {
        section(1000);

        scrollToSection('chain');
        frame(10);

        expect(queue).toHaveLength(0);
    });

    it.each([
        ['wheel'],
        ['touchstart'],
        ['keydown']
    ])('stops the moment the reader %ss', (type) =>
    {
        section(1000);
        document.body.style.overflow = 'hidden';

        scrollToSection('chain');
        frame(2);

        window.dispatchEvent(new Event(type));
        frame(1);

        // It let go without ever scrolling: a hold the reader has to fight is worse than a
        // landing they have to correct.
        expect(queue).toHaveLength(0);
        expect(scrolled).toBe(0);
    });

    it('gives up rather than holding a page that never settles', () =>
    {
        section(1000);
        document.body.style.overflow = 'hidden';

        scrollToSection('chain');
        frame(130);

        expect(queue).toHaveLength(0);
    });
});
