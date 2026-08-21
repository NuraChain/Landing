// The blog's locale list and the site's must not drift.
//
// The same guard `prepaint.spec.ts` puts on the inline script's copy of the list, for the same
// reason: two lists that must agree, in files that cannot import each other for good reasons -
// the wire needs a validator the browser store has no business owning, and a marketing store
// should not be reaching into the server half for its own language menu.
//
// The failure this prevents is quiet. Add an eleventh language to the site and forget it here,
// and the site offers it, the reader picks it, and every blog request 422s on a locale the
// server has never heard of.
import { describe, it, expect } from 'vitest';

import { POST_LOCALES } from '../../server/src/schemas.ts';
import { LOCALES } from '../src/stores/locale';

describe('the blog speaks the same languages as the site', () =>
{
    it('lists exactly the site\'s locales, in the site\'s order', () =>
    {
        // Order matters as much as membership: the fallback walks this list when a post holds
        // neither the reader's language nor its own default, so the order decides what a reader
        // is shown - and the language tab strip is drawn from it directly.
        expect([...POST_LOCALES]).toEqual([...LOCALES]);
    });

    it('still ships the two right-to-left languages a post can be written in', () =>
    {
        // Naming them here is what makes a silent removal loud: the blog page mirrors, the
        // editor mirrors, and both are only exercised because these two exist.
        expect(POST_LOCALES).toContain('fa');
        expect(POST_LOCALES).toContain('ar');
    });
});
