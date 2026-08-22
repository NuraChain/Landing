import Lenis from 'lenis';

import { motionOk } from './motion';

/**
 * Smooth scrolling, wired once at mount.
 *
 * Lenis lerps the document's real scroll position, so every existing consumer keeps
 * working exactly as it did: IntersectionObserver reveals, the hero scrub, the ticker's
 * velocity feed, all of it reads `window.scrollY` as before - it just arrives between
 * frames instead of in wheel-sized jumps.
 *
 * Guards, in order of importance:
 * - `prefers-reduced-motion`: nothing is hijacked, native scroll stays.
 * - No ResizeObserver (old engines, test envs): Lenis needs it; we skip it instead of
 *   shimming, and the page degrades to native scrolling.
 * - Keyboard anchor activation (Enter on a link fires a click with `detail === 0`): left
 *   native, because jumping must still move FOCUS for keyboard users - Lenis scrolls
 *   pixels, not focus.
 *
 * The click delegation turns mouse-driven hash links (header nav, footer, hero CTAs,
 * skip-link is keyboard-only so untouched) into a glide that lands the target net of the
 * sticky header. Everything else about the document is untouched.
 */
let lenis: Lenis | null = null;

export const initSmoothScroll = (): void =>
{
    if (typeof document === 'undefined' || !motionOk() || typeof ResizeObserver === 'undefined')
    {
        return;
    }

    try
    {
        lenis = new Lenis({
            duration: 1.05,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            touchMultiplier: 1.4
        });

        // No teardown to hand back: the loop is once-per-page-load like the instance it
        // drives, so there is nothing to cancel and no id to keep.
        const loop = (time: number): void =>
        {
            lenis?.raf(time);
            requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);

        document.addEventListener('click', (event) =>
        {
            if (!(event.target instanceof Element) || event.detail === 0)
            {
                return;
            }

            const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');

            if (anchor === null)
            {
                return;
            }

            const hash = anchor.getAttribute('href');

            if (hash === null || hash.length < 2)
            {
                return;
            }

            const target = document.querySelector<HTMLElement>(hash);

            if (target === null)
            {
                return;
            }

            event.preventDefault();
            lenis?.scrollTo(target, { offset: -88, duration: 1.1 });
        });
    }
    catch
    {
        // Any Lenis failure leaves native scrolling in place; the page must not
        // survive by a wheel hijack.
        lenis = null;
    }
};
