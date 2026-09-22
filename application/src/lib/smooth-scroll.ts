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

/**
 * How far above the target the glide stops, so the sticky header does not cover it.
 *
 * The same distance `[id] { scroll-margin-top: 5.5rem }` in styles.css gives the native
 * anchor landing, which is what runs when Lenis is not driving - move the two together.
 */
const HEADER_OFFSET = -88;

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
            lenis?.scrollTo(target, { offset: HEADER_OFFSET, duration: 1.1 });
        });
    }
    catch
    {
        // Any Lenis failure leaves native scrolling in place; the page must not
        // survive by a wheel hijack.
        lenis = null;
    }
};

/**
 * Land on a section AFTER a route change - the case the click delegate above cannot serve,
 * because at click time the target is still on the page being left.
 *
 * This HOLDS the position instead of setting it once, and that is the whole design. Every
 * single-shot version of this landed somewhere wrong, because a landing page a frame old is
 * not the page it is about to be:
 *
 * - aim immediately and the document is still the one being left, whose height clamps the
 *   scroll. From /blog every section landed at 1314px, which is exactly that page's own
 *   maximum scroll. The router's built-in hash scroll does this, which is why `SectionLink`
 *   navigates with `scroll: false` and calls this instead;
 * - wait for the document to be tall enough and the middle sections still land short, by
 *   however much the hero above them grows afterwards as its live figures arrive;
 * - wait for the target to stop moving and a phone never gets there at all: the page is
 *   8000px of reflowing content and the budget runs out first.
 *
 * So the target is re-pinned every frame until it needs no correction for five in a row, or
 * two seconds pass. In practice it is still within a few frames; the loop costs one
 * `offsetTop` read per frame while it runs.
 *
 * It lands rather than glides, which is the right shape for this case: the reader has just
 * changed page, and a full document load - what this replaced - did not glide either. The
 * glide belongs to a click on the page already showing, which is the delegate above.
 *
 * Any real scroll input stops it at once. A hold the reader has to fight is worse than a
 * landing they have to correct.
 */
export const scrollToSection = (id: string): void =>
{
    if (typeof document === 'undefined' || typeof requestAnimationFrame === 'undefined')
    {
        return;
    }

    let frames = 0;
    let settled = 0;
    let abandoned = false;

    const release = (): void =>
    {
        abandoned = true;
    };

    // `passive`: these only ever read, and a non-passive wheel listener on the document
    // costs the scroll thread a round trip to ask whether this one will preventDefault.
    const inputs = ['wheel', 'touchstart', 'keydown'] as const;

    for (const type of inputs)
    {
        window.addEventListener(type, release, { passive: true, once: true });
    }

    const stop = (): void =>
    {
        for (const type of inputs)
        {
            window.removeEventListener(type, release);
        }
    };

    const pin = (): void =>
    {
        frames += 1;

        const target = document.getElementById(id);

        // A drawer that held the link is still closing: `lib/overlay.ts` keeps the body
        // locked while a panel is open, and nothing can scroll until it lets go.
        if (target !== null && document.body.style.overflow !== 'hidden')
        {
            const wanted = Math.max(0, Math.min(
                target.offsetTop + HEADER_OFFSET,
                document.documentElement.scrollHeight - window.innerHeight
            ));

            if (Math.abs(window.scrollY - wanted) > 1)
            {
                settled = 0;

                if (lenis !== null)
                {
                    // Through Lenis where it is running, or its own loop writes the old
                    // position back on the next frame.
                    lenis.scrollTo(wanted, { immediate: true });
                }
                else
                {
                    window.scrollTo(0, wanted);
                }
            }
            else
            {
                settled += 1;
            }
        }

        if (abandoned || settled >= 5 || frames >= 120)
        {
            stop();
            return;
        }

        requestAnimationFrame(pin);
    };

    requestAnimationFrame(pin);
};
