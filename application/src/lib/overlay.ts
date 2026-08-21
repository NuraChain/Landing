/**
 * Everything an overlay owes the page while it is up.
 *
 * The drawer and the language dialog are both full-screen panels over a scrim, and both were
 * doing half of this each: Escape closed them and the body stopped scrolling, but focus stayed
 * on the button behind the scrim. That is the half that matters most, because both panels are
 * rendered through a Portal onto the END of `document.body` - so a Tab from the trigger walked
 * the entire page underneath before it ever reached the panel that was covering it.
 *
 * Four things, then, and they belong together because they share one lifetime:
 *
 *   - Escape closes;
 *   - the page behind stops scrolling (without it, a drag on the drawer scrolls the document
 *     underneath and the whole thing reads as a web page rather than an app);
 *   - focus moves INTO the panel when it opens;
 *   - focus returns to whatever opened it when it closes, so the keyboard lands back where the
 *     visitor left off rather than at the top of the document.
 */

/** What counts as reachable. `[tabindex="-1"]` is excluded: it is focusable, not tabbable. */
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]),'
    + ' textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const tabbable = (panel: HTMLElement): HTMLElement[] =>
    [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((node) => node.offsetParent !== null);

/**
 * Opens the overlay's side of the contract and returns the function that closes it again.
 *
 * `panelSelector` is resolved on the NEXT frame rather than now: the caller is an effect
 * reacting to the state change that mounts the panel, so at call time the element does not
 * exist yet.
 */
export const captureOverlay = (close: () => void, panelSelector: string): (() => void) =>
{
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    const panel = (): HTMLElement | null => document.querySelector<HTMLElement>(panelSelector);

    const onKey = (event: KeyboardEvent): void =>
    {
        if (event.key === 'Escape')
        {
            close();

            return;
        }

        if (event.key !== 'Tab')
        {
            return;
        }

        // The trap. Without it, Tab off the last control leaves the panel for the page behind
        // the scrim - which is not reachable by pointer, so the keyboard would be somewhere the
        // mouse cannot go.
        const open = panel();
        const stops = open === null ? [] : tabbable(open);

        if (stops.length === 0)
        {
            return;
        }

        const first = stops[0]!;
        const last = stops[stops.length - 1]!;
        const on = document.activeElement;

        if (event.shiftKey && (on === first || open?.contains(on) !== true))
        {
            event.preventDefault();
            last.focus();
        }
        else if (!event.shiftKey && on === last)
        {
            event.preventDefault();
            first.focus();
        }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);

    const frame = requestAnimationFrame(() =>
    {
        const open = panel();

        if (open !== null)
        {
            tabbable(open)[0]?.focus();
        }
    });

    return (): void =>
    {
        cancelAnimationFrame(frame);
        document.body.style.overflow = previousOverflow;
        document.removeEventListener('keydown', onKey);

        // Guarded: the opener can have been unmounted while the panel was up (a language change
        // rebuilds the header), and focusing a detached node silently sends focus to <body>.
        if (opener !== null && opener.isConnected)
        {
            opener.focus();
        }
    };
};
