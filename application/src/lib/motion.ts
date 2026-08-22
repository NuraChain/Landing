import { animate, createTimeline, spring, stagger } from 'animejs';

/**
 * The one motion authority for the landing page.
 *
 * Everything animated routes through here so two rules cannot be forgotten by a section
 * written later:
 *
 * 1. `prefers-reduced-motion` suppresses JS-driven motion the way the global CSS rule in
 *    styles.css suppresses declarative motion - content appears in its final state,
 *    instantly. The CSS rule cannot see anime.js timelines; this gate is what covers them.
 * 2. Scroll reveals degrade to "visible immediately" wherever IntersectionObserver is
 *    absent (older engines, the happy-dom test environment), so a reveal can never strand
 *    content invisible. Nothing is hidden by default: the hidden state is applied by JS
 *    only when motion is actually available, so a page without JS renders complete.
 *
 * Property discipline (measured, not guessed - see the compositor-safety literature):
 * everything here animates `transform` and `opacity`, nothing else. `will-change` is
 * applied by hand only to the elements with CONTINUOUS animation (the ticker track), and
 * released when a one-shot completes - a standing hint is a standing GPU allocation.
 *
 * NOTE: never `utils.set` from anime.js here. `utils` is a namespace re-export
 * (`export * as utils`), and Vite's dependency pre-bundling has been known to hand back
 * `undefined` for such bindings at runtime. Plain style writes cost nothing and cannot.
 */

export { animate, createTimeline, spring, stagger };

export const motionOk = (): boolean =>
    typeof matchMedia !== 'undefined'
    && !matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs `cb` with `#id` the moment it exists in the document.
 *
 * Component effects run while the component's own nodes are still detached, so a bare
 * `document.getElementById(...)` inside an effect body returns null and the effect does
 * nothing - silently. This helper retries once per animation frame until the node appears,
 * then hands the callback a single release function for the cleanup block.
 */
export const onReady = (id: string, cb: (el: HTMLElement) => (() => void) | void): (() => void) =>
{
    let disposed = false;
    let release: (() => void) | null = null;

    const attempt = (): void =>
    {
        if (disposed)
        {
            return;
        }

        const el = document.getElementById(id);

        if (el === null)
        {
            if (typeof requestAnimationFrame !== 'undefined')
            {
                requestAnimationFrame(attempt);
            }

            return;
        }

        const out = cb(el);
        release = typeof out === 'function' ? out : null;
    };

    if (typeof requestAnimationFrame === 'undefined')
    {
        attempt();

        return () =>
        {
        };
    }

    requestAnimationFrame(attempt);

    return () =>
    {
        disposed = true;

        if (release !== null)
        {
            release();
            release = null;
        }
    };
};

/**
 * Runs `cb` the first time `el` scrolls into view; returns the release for a cleanup
 * block. The negative bottom margin fires the reveal a little before the section edge
 * reaches the fold, so the content is already moving when it becomes visible.
 */
export const onVisible = (el: Element, cb: () => void): (() => void) =>
{
    if (typeof IntersectionObserver === 'undefined')
    {
        cb();

        return () =>
        {
        };
    }

    const io = new IntersectionObserver((entries) =>
    {
        if (entries.some((entry) => entry.isIntersecting))
        {
            io.disconnect();
            cb();
        }
    }, { rootMargin: '0px 0px -12% 0px' });

    io.observe(el);

    return () => io.disconnect();
};

/**
 * The standard section entrance: a short rise-and-fade on the section itself, once, when
 * it first scrolls into view. The hidden state is set HERE and only when motion is
 * available - never in markup - so content is never stranded invisible.
 *
 * `heading: true` also draws the section heading's rule and raises its title inside the
 * same scroll trigger, so the heading reads as the cursor that opens the section.
 */
export const reveal = (section: HTMLElement, opts: { heading?: boolean } = {}): (() => void) =>
{
    if (!motionOk())
    {
        return () =>
        {
        };
    }

    const parts: { el: HTMLElement; move: boolean; rule: HTMLElement | null }[] =
        [{ el: section, move: true, rule: null }];

    if (opts.heading === true)
    {
        const heading = section.querySelector<HTMLElement>('[data-sh]');

        if (heading !== null)
        {
            parts.push({
                el: heading,
                move: true,
                rule: heading.querySelector<HTMLElement>('.sh-rule')
            });
        }
    }

    // Hidden state, applied only now. `move` elements rise; the rule only draws.
    for (const part of parts)
    {
        if (part.move)
        {
            part.el.style.opacity = '0';
            part.el.style.translate = '0px 18px';
        }

        if (part.rule !== null)
        {
            part.rule.style.transform = 'scaleX(0)';
        }
    }

    return onVisible(section, () =>
    {
        for (const part of parts)
        {
            animate(part.el, {
                opacity: 1,
                translate: '0px 0px',
                duration: 700,
                ease: 'outExpo'
            });

            if (part.rule !== null)
            {
                animate(part.rule, {
                    scaleX: 1,
                    duration: 800,
                    delay: 120,
                    ease: 'inOutCubic'
                });
            }
        }
    });
};

/**
 * The staggered entrance for a section's grid of cards: each item rises with a spring so
 * the settle has one tiny overshoot, then holds. Items are `container`'s children by
 * default; pass an item selector when the grid children are display:contents wrappers
 * (social cards) or otherwise not the moving element.
 *
 * Sets its own hidden state, gated on motion, exactly like `reveal`.
 */
export const revealItems = (
    section: HTMLElement,
    containerSelector: string,
    itemSelector = ':scope > *'
): (() => void) =>
{
    if (!motionOk())
    {
        return () =>
        {
        };
    }

    const container = section.querySelector<HTMLElement>(containerSelector);

    if (container === null)
    {
        return () =>
        {
        };
    }

    const items = [...container.querySelectorAll<HTMLElement>(itemSelector)];

    if (items.length === 0)
    {
        return () =>
        {
        };
    }

    items.forEach((el) =>
    {
        el.style.opacity = '0';
        el.style.translate = '0px 22px';
    });

    return onVisible(section, () =>
    {
        animate(items, {
            opacity: [0, 1],
            translate: ['0px 22px', '0px 0px'],
            duration: 650,
            ease: spring({ stiffness: 150, damping: 18, mass: 0.9 }),
            delay: stagger(70)
        });
    });
};

/**
 * Scroll-linked framing: one rAF-coalesced loop that calls `onFrame(progress, velocity)`
 * while the user scrolls, then parks itself until the next scroll event - no per-frame
 * work at rest, nothing on the main thread while idle. `progress` is how far `el` has
 * scrolled past the top of the document (0..1); `velocity` is a smoothed px/frame delta.
 *
 * The loop stops itself when the element is done (progress hits 1 and motion settles) and
 * on hidden tabs; any scroll wakes it again. `onFrame` must only write transform/opacity.
 */
export const scrub = (
    el: HTMLElement,
    onFrame: (progress: number, velocity: number) => void
): (() => void) =>
{
    if (!motionOk())
    {
        return () =>
        {
        };
    }

    let raf = 0;
    let running = false;
    let lastY = window.scrollY;
    let velocity = 0;

    const tick = (): void =>
    {
        const y = window.scrollY;
        const delta = y - lastY;

        lastY = y;
        velocity += (delta - velocity) * 0.15;

        const progress = Math.min(1, Math.max(0, y / Math.max(1, el.offsetHeight)));

        onFrame(progress, velocity);

        if (progress >= 1 && Math.abs(velocity) < 0.5)
        {
            running = false;

            return;
        }

        raf = requestAnimationFrame(tick);
    };

    const kick = (): void =>
    {
        if (running || document.visibilityState === 'hidden')
        {
            return;
        }

        running = true;
        raf = requestAnimationFrame(tick);
    };

    const onVisibility = (): void =>
    {
        if (document.visibilityState === 'visible')
        {
            kick();
        }
    };

    window.addEventListener('scroll', kick, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    return () =>
    {
        cancelAnimationFrame(raf);
        running = false;
        window.removeEventListener('scroll', kick);
        document.removeEventListener('visibilitychange', onVisibility);
    };
};

/**
 * Rolls a number into an element with an exponential settle. The element is set to zero
 * first, but only when motion is available - under reduced motion the final value stands
 * from the start, which is also what keeps a no-JS render correct.
 */
export const countUp = (el: HTMLElement, to: number, format: (value: number) => string): (() => void) =>
{
    if (!motionOk())
    {
        return () =>
        {
        };
    }

    const state = { v: 0 };

    el.textContent = format(0);

    const anim = animate(state, {
        v: to,
        duration: 1200,
        ease: 'outExpo',
        onUpdate: () =>
        {
            el.textContent = format(Math.round(state.v));
        }
    });

    return () => anim.pause();
};

/**
 * Splits an element's plain text into per-word mask spans for the hero's masked rise.
 *
 * The element's `textContent` is preserved byte-for-byte: words are re-joined with single
 * spaces, which is also what keeps the document-outline test (`h1.textContent` equals the
 * string table entry) passing after the split. Each word gets an overflow-hidden mask and
 * an inner span to translate - per word rather than per line, because line breaks are
 * layout-dependent and must not need measuring.
 */
export const splitWords = (el: HTMLElement): HTMLElement[] =>
{
    const words = (el.textContent ?? '').split(' ').filter((word) => word.length > 0);

    el.textContent = '';

    const inners: HTMLElement[] = [];

    words.forEach((word, index) =>
    {
        if (index > 0)
        {
            el.append(document.createTextNode(' '));
        }

        const mask = document.createElement('span');
        mask.className = 'hero-word';

        const inner = document.createElement('span');
        inner.className = 'hero-word-inner';
        inner.textContent = word;

        mask.append(inner);
        el.append(mask);
        inners.push(inner);
    });

    return inners;
};
