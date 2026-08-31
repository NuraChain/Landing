// The one-click add-chain path, end to end: button -> picker -> wallet module -> the provider
// that announced itself.
//
// Deliberately NOT mocking `../src/lib/wallet`: the interesting behaviour is the seam between
// the component's status machine and EIP-1193, and stubbing the module out would leave that
// seam untested while still looking green.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import AddChainButton from '../src/components/chain/add-chain-button.component.azeroth';
import { forgetWallets } from '../src/lib/wallet';
import { METAMASK_RDNS, TRUST_RDNS, WALLET_BRANDS } from '../src/lib/wallets';
import { useLocale } from '../src/stores/locale';
import { useToasts } from '../src/stores/toasts';
import { en } from '../src/lib/i18n/en';

type Request = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

/** One EIP-6963 announcement, as an extension makes it. */
const announce = (rdns: string, request: Request): void =>
{
    window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
        detail: {
            info: { uuid: `uuid-${ rdns }`, name: rdns, icon: 'data:image/png;base64,AA==', rdns },
            provider: { request }
        }
    }));
};

/** A promise the test resolves by hand, so "pending" is a state that can be observed. */
const deferred = <T>() =>
{
    let settle!: (value: T) => void;
    let fail!: (reason: unknown) => void;
    const promise = new Promise<T>((resolve, reject) =>
    {
        settle = resolve; fail = reject;
    });

    return { promise, settle, fail };
};

const label = (container: Element): string => container.querySelector('button')!.textContent!.trim();

/** The picker is portaled onto the end of the document, so it is never inside `container`. */
const dialog = (): HTMLElement | null => document.querySelector('[role="dialog"]');

/** One roster row, by the label the picker prints. */
const row = (name: string): HTMLElement =>
{
    const found = [...(dialog()?.querySelectorAll<HTMLElement>('li a, li button') ?? [])]
        .find((node) => node.textContent?.includes(name));

    if (found === undefined)
    {
        throw new Error(`no row for ${ name }`);
    }

    return found;
};

/** Open the picker and choose a wallet - what a reader does in two presses. */
const pick = (container: Element, name: string): void =>
{
    fire(container.querySelector('button')!, 'click');
    fire(row(name), 'click');
};

beforeEach(() =>
{
    useLocale().choose('en');

    // A toast carrying a detail does not self-dismiss, by design - so it outlives the test
    // that raised it and the next one reads somebody else's failure. Cleared here the way
    // components.spec clears it, which is what keeps these order-independent.
    const toasts = useToasts();

    for (const entry of [...toasts.items()])
    {
        toasts.dismiss(entry.id);
    }

    // The registry in lib/wallet is module-level and this file does not reset modules - the
    // component under test imports it. Without this, one test's wallet answers the next one's
    // press, which is exactly the drift `--sequence.shuffle` is run to catch.
    forgetWallets();
    location.hash = '';
    vi.useFakeTimers();
});

afterEach(() =>
{
    vi.useRealTimers();
    cleanup();
    forgetWallets();
    location.hash = '';
    localStorage.clear();
    vi.restoreAllMocks();
});

describe('AddChainButton', () =>
{
    it('starts on the call to action', () =>
    {
        const { container } = renderTest(() => AddChainButton({}));

        expect(label(container)).toBe(en.addChain.cta);
        expect(dialog()).toBeNull();
    });

    /*
     * The press asks WHICH wallet before it asks anything of a wallet.
     *
     * That question is the fix this button went through six revisions without: the injected
     * global carries no identity, so every earlier version had to guess which object was the
     * wallet the reader meant and then recover from guessing wrong.
     */
    it('opens the picker rather than guessing at a wallet', () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        announce(METAMASK_RDNS, request);

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');

        expect(dialog()).not.toBeNull();
        expect(request).not.toHaveBeenCalled();
    });

    // The whole roster, installed or not: an installed wallet is something to click, and a
    // missing one is where to get it. A list of only what was detected leaves a reader with
    // nothing installed staring at an empty box.
    it('lists the whole roster, and links the ones that are not installed', () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');

        for (const brand of WALLET_BRANDS)
        {
            expect(row(brand.label), brand.label).toBeTruthy();
        }

        expect(row('MetaMask').tagName).toBe('BUTTON');

        const missing = row('Trust Wallet');

        expect(missing.tagName).toBe('A');
        expect(missing.getAttribute('href')).toBe(WALLET_BRANDS.find((brand) => brand.rdns === TRUST_RDNS)?.install);
        expect(missing.getAttribute('rel')).toBe('noreferrer');
    });

    /*
     * Nura Wallet is the exception to the row above: an application rather than an extension,
     * pressable whether or not anything announced it, because the request leaves over
     * `nurawallet://`. The hint says which of the two put the button there.
     *
     * The image assertion is a real regression. Reaching this branch with no announcement
     * behind it was impossible until the deep link landed, and the icon test read
     * `installed(...)?.icon !== null` - undefined is not null, so the row drew an `<img src="">`
     * and a broken-image glyph beside the wallet whose landing page this is.
     */
    it('makes Nura Wallet pressable with nothing announced, and draws no image', () =>
    {
        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');

        const nura = row('Nura Wallet');

        expect(nura.tagName).toBe('BUTTON');
        expect(nura.textContent).toContain(en.addChain.openApp);
        expect(nura.querySelector('img')).toBeNull();
    });

    it('confirms on the label when the wallet accepts, then returns to idle', async () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        vi.advanceTimersByTime(2600);

        expect(label(container)).toBe(en.addChain.cta);
    });

    it('closes the picker once a wallet has been chosen', async () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');

        expect(dialog()).toBeNull();
    });

    it('asks the wallet that was chosen, and only that one', async () =>
    {
        const metamask = vi.fn().mockResolvedValue(null);
        const trust = vi.fn().mockResolvedValue(null);
        announce(METAMASK_RDNS, metamask);
        announce(TRUST_RDNS, trust);

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'Trust Wallet');
        await vi.waitFor(() => expect(trust).toHaveBeenCalled());

        expect(metamask).not.toHaveBeenCalled();
    });

    /*
     * ONE request, and it is `wallet_addEthereumChain`.
     *
     * The previous version switched first and added only if the switch failed in a way it
     * recognised, so the ordinary path ran two requests and a wallet that answered the first
     * one oddly settled the outcome of a press that had not yet asked for anything.
     */
    it('sends one EIP-3085 request per accepted press, and no switch', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        announce(METAMASK_RDNS, request);

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        expect(request).toHaveBeenCalledTimes(1);
        expect(request.mock.calls[0]?.[0]?.method).toBe('wallet_addEthereumChain');
    });

    it('says nothing at all when the visitor declines the prompt', async () =>
    {
        const request = vi.fn().mockRejectedValue(Object.assign(new Error('rejected'), { code: 4001 }));
        announce(METAMASK_RDNS, request);

        const { container } = renderTest(() => AddChainButton({}));
        const before = useToasts().items().length;

        pick(container, 'MetaMask');

        // Waited on the REQUEST rather than on the label: the resting label is what this
        // asserts, so waiting for it would pass before anything had happened at all.
        await vi.waitFor(() => expect(request).toHaveBeenCalled());
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.cta));

        // The reader pressed cancel. Reporting that back as "Could not add" tells somebody
        // their own decision went wrong, so the button simply returns to its resting label.
        expect(useToasts().items().length).toBe(before);
    });

    it('travels to the manual chain card when the wallet refuses', async () =>
    {
        const section = document.createElement('section');
        section.id = 'chain';
        const travelled = vi.fn();
        section.scrollIntoView = travelled;
        document.body.append(section);

        announce(METAMASK_RDNS, vi.fn().mockRejectedValue(new Error('nope')));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.failed));

        expect(travelled).toHaveBeenCalled();
        expect(useToasts().items().some((entry) => entry.message === en.addChain.failed)).toBe(true);

        section.remove();
    });

    /*
     * -32602 is almost always the wallet holding this chain id under a different ticker. That
     * is a thing the reader can go and fix, and "Could not add" does not tell them so.
     */
    it('says which situation it is when the id is already taken under another ticker', async () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockRejectedValue({ code: -32602, message: 'different symbol' }));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.failed));

        expect(useToasts().items().some((entry) => entry.message === en.addChain.mismatch)).toBe(true);
        expect(useToasts().items().some((entry) => entry.message === en.addChain.failed)).toBe(false);
    });

    it('ignores a second choice while a request is still in flight', async () =>
    {
        const pending = deferred<unknown>();
        const request = vi.fn().mockReturnValue(pending.promise);
        announce(METAMASK_RDNS, request);

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        pick(container, 'MetaMask');

        expect(request).toHaveBeenCalledTimes(1);

        pending.settle(null);
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));
    });

    it('accepts a fresh press once the previous attempt has settled', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        announce(METAMASK_RDNS, request);

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        vi.advanceTimersByTime(2600);
        pick(container, 'MetaMask');

        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    });

    // A success has nothing to trace, and a detail would only make the confirmation stay on
    // screen until somebody dismissed it.
    it('says nothing technical when it worked', async () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        expect(useToasts().items().find((entry) => entry.message === en.addChain.done)!.detail).toBeUndefined();
    });

    it('renders its label in the active locale', async () =>
    {
        useLocale().choose('fa');

        const { container } = renderTest(() => AddChainButton({}));

        expect(label(container)).toBe((await import('../src/lib/i18n/fa')).fa.addChain.cta);
    });

    // The timer is cleared on unmount; a pending callback firing into a torn-down component
    // is the classic "cannot update state on an unmounted component" leak.
    it('does not throw when unmounted mid-confirmation', async () =>
    {
        announce(METAMASK_RDNS, vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        pick(container, 'MetaMask');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        cleanup();

        expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    });
});
