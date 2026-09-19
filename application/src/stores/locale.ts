import { createStore, localeDirection, setLocale, useLocale as useDocumentLocale } from 'azerothjs';

import { ar } from '../lib/i18n/ar';
import { en } from '../lib/i18n/en';
import { es } from '../lib/i18n/es';
import { fa } from '../lib/i18n/fa';
import { fr } from '../lib/i18n/fr';
import { hi } from '../lib/i18n/hi';
import { pt } from '../lib/i18n/pt';
import { ru } from '../lib/i18n/ru';
import { tr } from '../lib/i18n/tr';
import { zh } from '../lib/i18n/zh';
import type { Strings } from '../lib/i18n/types';

export type Locale = 'en' | 'fa' | 'ar' | 'es' | 'pt' | 'hi' | 'zh' | 'ru' | 'fr' | 'tr';

/**
 * Also the order the switcher lists them in.
 *
 * The SERVER negotiates over the same ten - `POST_LOCALES` in `server/src/schemas.ts`, handed
 * to `mountPages` as its `locales` config - and `tests/blog-locales.spec.ts` pins the two
 * lists equal. Adding a language is one row here, one row there, and one file under lib/i18n/.
 */
export const LOCALES: readonly Locale[] = ['en', 'fa', 'ar', 'es', 'pt', 'hi', 'zh', 'ru', 'fr', 'tr'];

const TABLE: Record<Locale, Strings> = { en, fa, ar, es, pt, hi, zh, ru, fr, tr };

/** The key a reader's choice used to live under, before the server could read it. See {@link migrateLegacyChoice}. */
const LEGACY_KEY = 'nura.locale';

const isLocale = (value: unknown): value is Locale =>
    typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/**
 * The direction a given language reads in - NOT the page's.
 *
 * The blog needs this because a post can be written in a language the reader is not using:
 * an English post shown to a Persian reader is a left-to-right island in a mirrored page,
 * and it has to be marked as one or its trailing punctuation jumps to the wrong end.
 *
 * `Intl` decides, through the same function the framework uses for the document itself, so
 * the page and an island inside it can never disagree about a language's direction - and the
 * languages a hand-kept table forgets are right without anyone maintaining one.
 */
export const directionOf = (locale: Locale): 'rtl' | 'ltr' => localeDirection(locale);

/** The switcher's row labels: every language names itself, whichever one is active. */
export const nativeName = (locale: Locale): string => TABLE[locale].languageName;

/**
 * The reader's language, as the FRAMEWORK holds it.
 *
 * There is no detection here any more, and that is the point. The server negotiates every
 * request - the reader's `locale` cookie first, then `Accept-Language` in preference order,
 * then English - and stamps the answer on `<html lang>` and `<html dir>` before the first
 * byte leaves. This store reads that stamp, so the hydrating page agrees with the served
 * markup by construction rather than by correcting it a frame later, and a crawler or a
 * reader with no JavaScript gets a correctly labelled, correctly mirrored document.
 *
 * `choose` writes the cookie the NEXT request is negotiated from, which is what makes a
 * language switch survive a reload as a server render rather than as a repair.
 */
export const useLocale = createStore(() =>
{
    const current = useDocumentLocale();

    // The document can only ever hold a tag the server negotiated, which is one of ours - but
    // this file owns the string table, so an unknown tag falls back rather than indexing it.
    const locale = (): Locale =>
    {
        const tag = current();

        return isLocale(tag) ? tag : 'en';
    };

    return {
        locale,
        direction: (): 'rtl' | 'ltr' => localeDirection(locale()),
        /** The active string table. Every component reads copy through `t()`. */
        t: (): Strings => TABLE[locale()],
        isRtl: (): boolean => localeDirection(locale()) === 'rtl',
        choose: (next: Locale): void => setLocale(next)
    };
});

/**
 * A choice remembered before the cookie existed still counts, once.
 *
 * Readers who picked a language under the old store have it in `localStorage`, where no
 * server can see it - so on their next visit the page would arrive in whatever their browser
 * asks for and silently forget what they chose. This reads that key one last time, replays it
 * through `setLocale` (which writes the cookie), and removes it.
 *
 * Called from `main.azeroth` AFTER the app boots, never during it: switching mid-mount would
 * fight the markup the server just sent.
 */
export function migrateLegacyChoice(): void
{
    try
    {
        const saved = localStorage.getItem(LEGACY_KEY);

        if (saved === null)
        {
            return;
        }

        localStorage.removeItem(LEGACY_KEY);

        if (isLocale(saved) && saved !== useLocale().locale())
        {
            setLocale(saved);
        }
    }
    catch
    {
        // A blocked store costs the remembered choice, never the page.
    }
}
