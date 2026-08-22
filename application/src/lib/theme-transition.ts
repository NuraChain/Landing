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
 * - `prefers-reduced-motion` → instant swap; a widening screen is exactly the motion
 *   those readers asked not to have.
 *
 * The trigger is located by the `.theme-trigger` class the header's toggle carries; if
 * it is somehow absent, the circle starts from the viewport center rather than failing.
 */

export const withThemeTransition = (apply: () => void): void =>
{
    if (typeof document === 'undefined'
        || typeof document.startViewTransition !== 'function'
        || !motionOk())
    {
        apply();

        return;
    }

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
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at ${ cx }px ${ cy }px)`,
                        `circle(${ radius }px at ${ cx }px ${ cy }px)`
                    ]
                },
                {
                    duration: 650,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
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
