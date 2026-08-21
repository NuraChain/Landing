import { createEffect, createSignal, createStore, onCleanup } from 'azerothjs';

export type Theme = 'dark' | 'light' | 'contrast';

export const THEMES: readonly Theme[] = ['dark', 'light', 'contrast'];

/**
 * Shared with the pre-paint script inlined in `index.html`. Both must agree on the key and
 * on the attribute name, or the page resolves one theme before paint and a different one
 * after hydration - which is the flash this whole arrangement exists to prevent.
 */
export const THEME_KEY = 'nura.theme';

const isTheme = (value: unknown): value is Theme => THEMES.includes(value as Theme);

/**
 * Whether there is a browser to ask.
 *
 * The blog routes server-render, and the header renders with them, so this store is
 * constructed on the server too - where there is no matchMedia, no localStorage and no
 * visitor whose preference could be read. Checked explicitly rather than left to a
 * try/catch: `matchMedia` throwing a ReferenceError is a known condition, not an
 * exceptional one, and catching it would hide the day it becomes something else.
 */
const inBrowser = typeof window !== 'undefined';

// Dark on the server, which is the site's own documented default. The markup it produces is
// theme-independent anyway - the palette hangs off `data-theme` on <html>, which the
// pre-paint script sets from the real preference before anything is painted.
const systemPreference = (): Theme =>
    inBrowser && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

export const useTheme = createStore(() =>
{
    const saved = ((): Theme | null =>
    {
        if (!inBrowser)
        {
            return null;
        }

        try
        {
            const value = localStorage.getItem(THEME_KEY);

            return isTheme(value) ? value : null;
        }
        catch
        {
            return null;
        }
    })();

    const [theme, setTheme] = createSignal<Theme>(saved ?? systemPreference());

    // Null once the visitor chooses for themselves. Until then the OS leads, so someone
    // who flips their system to light mode mid-visit sees the page follow.
    const [followsSystem, setFollowsSystem] = createSignal(saved === null);

    createEffect(() =>
    {
        if (inBrowser)
        {
            document.documentElement.dataset.theme = theme();
        }
    }, { name: 'theme-attribute' });

    createEffect(() =>
    {
        if (!inBrowser || !followsSystem())
        {
            return;
        }

        const query = matchMedia('(prefers-color-scheme: light)');
        const sync = (): void => setTheme(systemPreference());

        query.addEventListener('change', sync);

        onCleanup(() => query.removeEventListener('change', sync));
    }, { name: 'theme-system-follow' });

    const choose = (next: Theme): void =>
    {
        setFollowsSystem(false);
        setTheme(next);

        try
        {
            localStorage.setItem(THEME_KEY, next);
        }
        catch
        {
            // The theme still applies for this visit; only the memory of it is lost.
        }
    };

    return {
        theme,
        choose,
        cycle: (): void => choose(THEMES[(THEMES.indexOf(theme()) + 1) % THEMES.length])
    };
});
