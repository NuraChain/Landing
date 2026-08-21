import { createSignal, createStore, type Getter } from 'azerothjs';

export type ToastTone = 'success' | 'error';

export interface ToastEntry
{
    id: number;
    tone: ToastTone;
    /** Already translated. The store holds text, not keys - it has no locale of its own. */
    message: string;
}

export interface ToastsApi
{
    items: Getter<ToastEntry[]>;
    push: (tone: ToastTone, message: string) => number;
    dismiss: (id: number) => void;
}

/** Beyond this the stack covers the page it is reporting about. Oldest goes. */
const MOST = 3;

/**
 * Self-dismissing is part of what a toast IS, so the lifetime belongs with the data rather
 * than with whichever host happens to render it.
 */
const LIFETIME_MS = 4000;

let nextId = 1;

/**
 * Somewhere to report from.
 *
 * A store rather than props so a control buried in a panel can say "saved" without every
 * component between it and the shell having to know that notifications exist. That is the
 * whole reason this is not state on the page.
 *
 * Deliberately only two tones. `success` and `error` are the outcomes a write actually has;
 * an `info` toast is nearly always a sentence that belongs on the page instead, where it can
 * be read twice and does not vanish after four seconds.
 */
export const useToasts = createStore((): ToastsApi =>
{
    const [items, setItems] = createSignal<ToastEntry[]>([]);

    const dismiss = (id: number): void =>
    {
        setItems(items().filter((entry) => entry.id !== id));
    };

    const push = (tone: ToastTone, message: string): number =>
    {
        const id = nextId++;

        setItems([...items().slice(-(MOST - 1)), { id, tone, message }]);
        setTimeout(() => dismiss(id), LIFETIME_MS);

        return id;
    };

    return { items, push, dismiss };
});
