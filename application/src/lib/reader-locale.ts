import { negotiateLocale } from 'azerothjs';

import { LOCALES, useLocale, type Locale } from '../stores/locale';

/**
 * Which language a route loader asks the api for.
 *
 * A loader runs on BOTH sides and the answer comes from a different place on each, which is
 * the whole reason this is a function rather than a call to the store:
 *
 *   - On the server it is negotiated from the request, with the SAME rule the kit used to
 *     stamp `<html lang>` on the response - so the page's language and its content's language
 *     are one decision. It cannot read the store: loaders settle BEFORE the render, and the
 *     render is where the locale gets pinned, so `useLocale()` would answer English for every
 *     reader and quietly serve English articles to a Persian page.
 *   - In the browser `request` is null and the store is the answer, which is the document's
 *     own stamp until the reader switches.
 *
 * The config is spelled out here rather than imported from the server half: this file ships to
 * the browser, and `tests/blog-locales.spec.ts` already pins `LOCALES` equal to the server's
 * `POST_LOCALES`, so the two negotiations cannot disagree about what is on offer.
 */
export const readerLocale = (request: Request | null): Locale =>
{
    if (request === null)
    {
        return useLocale().locale();
    }

    const { locale } = negotiateLocale(request, { supported: LOCALES, default: 'en' });

    // `negotiateLocale` answers a tag from the list it was given, so this is a narrowing cast
    // rather than a guess - but the list is typed `readonly string[]` on the way in.
    return locale as Locale;
};
