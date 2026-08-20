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

const systemPreference = (): Theme =>
    matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

export const useTheme = createStore(() =>
{
    const saved = ((): Theme | null =>
    {
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
        document.documentElement.dataset.theme = theme();
    }, { name: 'theme-attribute' });

    createEffect(() =>
    {
        if (!followsSystem())
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
