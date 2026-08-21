// The window arithmetic, asserted on the array rather than on markup: the boundaries are where
// this kind of code goes wrong, and they are far easier to read as numbers.
import { describe, it, expect } from 'vitest';

import { pageWindow } from '../src/components/ui/pagination.component.azeroth';

/** `1 2 ... 20` - readable at a glance, which is the point of testing it this way. */
const shape = (page: number, pages: number): string =>
    pageWindow(page, pages).map((slot) => slot.value === 'gap' ? '...' : String(slot.value)).join(' ');

describe('pageWindow', () =>
{
    it('lists every page when they all fit', () =>
    {
        expect(shape(1, 1)).toBe('1');
        expect(shape(3, 5)).toBe('1 2 3 4 5');
        expect(shape(4, 7)).toBe('1 2 3 4 5 6 7');
    });

    it('keeps the same number of slots at both ends and in the middle', () =>
    {
        // The whole reason the window is clamped rather than centred: a row that shrinks near
        // the ends moves the control out from under the pointer that is clicking it.
        const widths = [1, 2, 3, 10, 18, 19, 20].map((page) => pageWindow(page, 20).length);

        expect(new Set(widths)).toEqual(new Set([7]));
    });

    it('pins the first and last page, whatever the window slid to', () =>
    {
        for (const page of [1, 2, 5, 10, 15, 19, 20])
        {
            const slots = pageWindow(page, 20);

            expect(slots[0]!.value).toBe(1);
            expect(slots[slots.length - 1]!.value).toBe(20);
        }
    });

    it('backfills at the start rather than collapsing to four slots', () =>
    {
        expect(shape(1, 20)).toBe('1 2 3 4 5 ... 20');
        expect(shape(2, 20)).toBe('1 2 3 4 5 ... 20');
    });

    it('backfills at the end the same way', () =>
    {
        expect(shape(20, 20)).toBe('1 ... 16 17 18 19 20');
        expect(shape(19, 20)).toBe('1 ... 16 17 18 19 20');
    });

    it('centres the current page once it is clear of both ends', () =>
    {
        expect(shape(10, 20)).toBe('1 ... 9 10 11 ... 20');
    });

    it('never spends a gap on a single hidden page', () =>
    {
        // A gap standing for one page is a lie the reader cannot act on - it should have been
        // that page's number.
        for (let page = 1; page <= 20; page++)
        {
            const slots = pageWindow(page, 20);

            slots.forEach((slot, index) =>
            {
                if (slot.value !== 'gap')
                {
                    return;
                }

                const before = slots[index - 1]!.value as number;
                const after = slots[index + 1]!.value as number;

                expect(after - before).toBeGreaterThan(2);
            });
        }
    });

    it('always contains the current page', () =>
    {
        for (const [page, pages] of [[1, 3], [7, 9], [50, 100], [99, 100]] as const)
        {
            expect(pageWindow(page, pages).some((slot) => slot.value === page)).toBe(true);
        }
    });
});
