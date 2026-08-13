import { createEffect, createSignal, createStore } from 'azerothjs';

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
 * Also the order the switcher lists them in. Adding a language is one row here, one file
 * under lib/i18n/, and the same two lists in index.html's pre-paint script - which must
 * stay in step with these, or the first paint disagrees with the hydrated page.
 */
export const LOCALES: readonly Locale[] = ['en', 'fa', 'ar', 'es', 'pt', 'hi', 'zh', 'ru', 'fr', 'tr'];

const TABLE: Record<Locale, Strings> = { en, fa, ar, es, pt, hi, zh, ru, fr, tr };
const RTL: ReadonlySet<Locale> = new Set<Locale>(['fa', 'ar']);
const KEY = 'nura.locale';

const isLocale = (value: unknown): value is Locale =>
    typeof value === 'string' && (LOCALES as readonly string[]).includes(value);

/** The switcher's row labels: every language names itself, whichever one is active. */
export const nativeName = (locale: Locale): string => TABLE[locale].languageName;

/**
 * The visitor's language, remembered across visits and falling back to the browser's own
 * preference. Walking `navigator.languages` in the browser's order rather than ours means
 * a visitor lands on THEIR best language, not the first one we happen to support.
 */
const initial = (): Locale =>
{
    try
    {
        const saved = localStorage.getItem(KEY);

        if (isLocale(saved))
        {
            return saved;
        }
    }
    catch
    {
        // A blocked store costs the remembered choice, never the page.
    }

    for (const tag of navigator.languages ?? [])
    {
        const primary = tag.toLowerCase().split('-')[0];

        if (isLocale(primary))
        {
            return primary;
        }
    }

    return 'en';
};

export const useLocale = createStore(() =>
{
    const [locale, setLocale] = createSignal<Locale>(initial());

    const direction = (): 'rtl' | 'ltr' => RTL.has(locale()) ? 'rtl' : 'ltr';

    // `dir` and `lang` belong on the root, not on each component. Set once here and the
    // whole document mirrors, including scrollbars, text selection and form controls that
    // no per-element class can reach.
    createEffect(() =>
    {
        const root = document.documentElement;

        root.lang = locale();
        root.dir = direction();
    }, { name: 'locale-document' });

    const choose = (next: Locale): void =>
    {
        setLocale(next);

        try
        {
            localStorage.setItem(KEY, next);
        }
        catch
        {
            // Same: remembering is a convenience, not a requirement.
        }
    };

    return {
        locale,
        direction,
        /** The active string table. Every component reads copy through `t()`. */
        t: (): Strings => TABLE[locale()],
        isRtl: (): boolean => RTL.has(locale()),
        choose
    };
});
