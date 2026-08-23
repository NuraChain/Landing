import { motionOk } from './motion';

/**
 * The circular theme reveal: the new theme spreads from the toggle's own position out to
 * the edges of the page, as one expanding circle.
 *
 * Implementation is the View Transitions API. The browser snapshots the page in both
 * themes, and we animate `clip-path: circle()` on the new-root layer from the button's
 * center - the one property that scales a snapshot for free. The default crossfade is
 * switched off in styles.css because the circle IS the transition.
 *
 * Guards:
 * - No `startViewTransition` (older engines, test envs) → instant swap, nothing breaks.
 * - `prefers-reduced-motion` → a plain CROSS-FADE, not an instant swap. The preference is
 *   about movement: a circle sweeping across the viewport is the vestibular trigger, and a
 *   layer changing opacity in place is not. Snapping the whole page between a light and a
 *   dark palette in one frame is its own kind of unpleasant - it is the harshest version of
 *   the change, handed to the readers who asked for the gentlest. So the motion goes and the
 *   transition stays.
 *
 * The trigger is located by the `.theme-trigger` class the header's toggle carries; if
 * it is somehow absent, the circle starts from the viewport center rather than failing.
 */

/** How long each arm runs. The fade is shorter: there is no distance for the eye to follow. */
const SWEEP_MS = 650;
const FADE_MS = 200;

export const withThemeTransition = (apply: () => void): void =>
{
    if (typeof document === 'undefined'
        || typeof document.startViewTransition !== 'function')
    {
        apply();

        return;
    }

    // Read ONCE, before the snapshot: the branch decides which animation runs below, and
    // asking twice invites the two halves to disagree if the setting changes mid-transition.
    const sweep = motionOk();

    const trigger = document.querySelector<HTMLElement>('.theme-trigger');

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;

    if (trigger !== null)
    {
        const rect = trigger.getBoundingClientRect();
        cx = rect.left + rect.width / 2;
        cy = rect.top + rect.height / 2;
    }

    // The radius that reaches the farthest corner, so the wipe always covers the page.
    const radius = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
    );

    const transition = document.startViewTransition(() =>
    {
        apply();
    });

    void transition.ready
        .then(() =>
        {
            /*
             * Both arms animate the NEW layer over the old one, which is what makes either
             * read as a reveal rather than a flicker: styles.css turns the browser's default
             * crossfade off on both layers, so the old snapshot simply holds until this
             * finishes and the new one is painted on top of it.
             */
            document.documentElement.animate(
                sweep
                    ? {
                        clipPath: [
                            `circle(0px at ${ cx }px ${ cy }px)`,
                            `circle(${ radius }px at ${ cx }px ${ cy }px)`
                        ]
                    }
                    : { opacity: [0, 1] },
                {
                    duration: sweep ? SWEEP_MS : FADE_MS,
                    easing: sweep ? 'cubic-bezier(0.22, 1, 0.36, 1)' : 'linear',
                    fill: 'both',
                    pseudoElement: '::view-transition-new(root)'
                }
            );
        })
        .catch(() =>
        {
            // The snapshot failed; `apply` already ran inside the callback, so the theme
            // is correct and only the flourish is missing.
        });
};
