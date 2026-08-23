// The circular theme reveal, and what it degrades to.
//
// Worth pinning because every failure mode here is SILENT. `withThemeTransition` swallows a
// rejected `ready` on purpose - the theme is already correct by then and only the flourish is
// missing - so a transition that never runs looks exactly like one that runs perfectly, and
// the only way to tell is to assert on what it asked the browser to animate.
import { describe, it, expect, afterEach, vi } from 'vitest';

/**
 * A `startViewTransition` that resolves like the real one, without needing a visible document.
 *
 * Hands back a promise that settles WHEN `animate` is called, rather than leaving the test to
 * await a guessed number of microtasks. The guess is what made this file flaky against itself:
 * `withThemeTransition` fires and forgets a `.then`, so a chain left pending at the end of one
 * test resolves during the next and calls ITS mock, and the second test sees two calls.
 */
const stubViewTransitions = () =>
{
    let onCall: () => void;
    const called = new Promise<void>((resolve) =>
    {
        onCall = resolve;
    });
    const animate = vi.fn(() =>
    {
        onCall();

        return { finished: Promise.resolve() };
    });

    Object.defineProperty(document.documentElement, 'animate', {
        value: animate,
        configurable: true,
        writable: true
    });

    (document as unknown as { startViewTransition: unknown }).startViewTransition = (callback: () => void) =>
    {
        callback();

        return { ready: Promise.resolve(), finished: Promise.resolve() };
    };

    return { animate, called };
};

/** Fails loudly instead of hanging to the suite timeout when the animation never registers. */
const within = async (promise: Promise<void>, ms = 1000): Promise<void> =>
    Promise.race([
        promise,
        new Promise<void>((_, reject) =>
        {
            setTimeout(() => reject(new Error('no animation was registered')), ms);
        })
    ]);

/** Reports one answer to `prefers-reduced-motion: reduce`, which is all `motionOk` reads. */
const stubReducedMotion = (reduce: boolean): void =>
{
    const ignore = (): void =>
    {
        // The module never subscribes; these exist so the stub matches the real shape.
    };

    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduce, addEventListener: ignore, removeEventListener: ignore })));
};

/** The module reads `matchMedia` per call, but the import is cached - so reset between tests. */
const freshTransition = async (): Promise<typeof import('../src/lib/theme-transition')> =>
{
    vi.resetModules();

    return import('../src/lib/theme-transition');
};

afterEach(() =>
{
    vi.unstubAllGlobals();
    Reflect.deleteProperty(document as unknown as Record<string, unknown>, 'startViewTransition');
    Reflect.deleteProperty(document.documentElement as unknown as Record<string, unknown>, 'animate');
});

describe('the theme transition', () =>
{
    it('sweeps a circle from the trigger when motion is welcome', async () =>
    {
        stubReducedMotion(false);

        const { animate, called } = stubViewTransitions();
        const { withThemeTransition } = await freshTransition();
        const apply = vi.fn();

        withThemeTransition(apply);
        await within(called);

        expect(apply).toHaveBeenCalledOnce();
        expect(animate).toHaveBeenCalledOnce();

        const [keyframes, options] = animate.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];

        expect(Object.keys(keyframes)).toEqual(['clipPath']);
        expect(options.duration).toBe(650);
        expect(options.pseudoElement).toBe('::view-transition-new(root)');
    });

    it('CROSS-FADES instead of sweeping when the reader asked for less motion', async () =>
    {
        /*
         * The regression this file exists for. This used to be an instant swap - the guard
         * returned before `startViewTransition` was ever called - which handed the readers who
         * asked for the gentlest treatment the harshest version of it: a whole page flipping
         * between a light and a dark palette in a single frame.
         *
         * The preference is about MOVEMENT. A circle sweeping the viewport is the thing it
         * exists to stop; a layer changing opacity in place is not, so the transition stays and
         * only the travel goes.
         */
        stubReducedMotion(true);

        const { animate, called } = stubViewTransitions();
        const { withThemeTransition } = await freshTransition();
        const apply = vi.fn();

        withThemeTransition(apply);
        await within(called);

        expect(apply).toHaveBeenCalledOnce();
        expect(animate).toHaveBeenCalledOnce();

        const [keyframes, options] = animate.mock.calls[0] as [Record<string, unknown>, Record<string, unknown>];

        expect(Object.keys(keyframes)).toEqual(['opacity']);
        expect(keyframes.opacity).toEqual([0, 1]);
        // Nothing travels, so nothing needs time to be followed across the screen.
        expect(options.duration).toBe(200);
        expect(options.pseudoElement).toBe('::view-transition-new(root)');
    });

    it('still applies the theme where the API does not exist at all', async () =>
    {
        // Older engines and the SSR pass. The swap must happen either way - a browser without
        // view transitions must not be a browser stuck on one theme.
        stubReducedMotion(false);

        const { withThemeTransition } = await freshTransition();
        const apply = vi.fn();

        withThemeTransition(apply);

        expect(apply).toHaveBeenCalledOnce();
    });
});
