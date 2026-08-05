import { createEffect, createSignal, createStore } from 'azerothjs';

import { en } from '../lib/i18n/en';
import { fa } from '../lib/i18n/fa';
import type { Strings } from '../lib/i18n/types';

export type Locale = 'en' | 'fa';

const TABLE: Record<Locale, Strings> = { en, fa };
const RTL: ReadonlySet<Locale> = new Set<Locale>(['fa']);
const KEY = 'nura.locale';

const isLocale = (value: unknown): value is Locale => value === 'en' || value === 'fa';

/**
 * The visitor's language, remembered across visits and falling back to the browser's own
 * preference. Reading `navigator.languages` rather than a hardcoded default means a
 * Persian speaker lands on Persian without hunting for the switcher.
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

    return navigator.languages?.some((tag) => tag.toLowerCase().startsWith('fa')) === true ? 'fa' : 'en';
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
        choose,
        toggle: (): void => choose(locale() === 'en' ? 'fa' : 'en')
    };
});
