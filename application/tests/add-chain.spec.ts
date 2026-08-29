// The one-click add-chain path, end to end: button -> wallet module -> injected provider.
//
// Deliberately NOT mocking `../src/lib/wallet`: the interesting behaviour is the seam
// between the component's status machine and EIP-1193, and stubbing the module out would
// leave that seam untested while still looking green.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import AddChainButton from '../src/components/chain/add-chain-button.component.azeroth';
import { useLocale } from '../src/stores/locale';
import { useToasts } from '../src/stores/toasts';
import { en } from '../src/lib/i18n/en';

type Request = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

const withProvider = (request: Request): void =>
{
    (window as { ethereum?: { request: Request } }).ethereum = { request };
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

beforeEach(() =>
{
    useLocale().choose('en');
    delete (window as { ethereum?: unknown }).ethereum;
    delete (window as { trustwallet?: unknown }).trustwallet;
    delete (window as { trustWallet?: unknown }).trustWallet;
    delete (window as { nurawallet?: unknown }).nurawallet;
    delete (window as { nuraWallet?: unknown }).nuraWallet;
    delete (window as { nura?: unknown }).nura;
    location.hash = '';
    vi.useFakeTimers();
});

afterEach(() =>
{
    vi.useRealTimers();
    cleanup();
    delete (window as { ethereum?: unknown }).ethereum;
    delete (window as { trustwallet?: unknown }).trustwallet;
    delete (window as { trustWallet?: unknown }).trustWallet;
    delete (window as { nurawallet?: unknown }).nurawallet;
    delete (window as { nuraWallet?: unknown }).nuraWallet;
    delete (window as { nura?: unknown }).nura;
    location.hash = '';
    localStorage.clear();
    vi.restoreAllMocks();
});

describe('AddChainButton state machine', () =>
{
    it('starts on the call to action', () =>
    {
        const { container } = renderTest(() => AddChainButton({}));

        expect(label(container)).toBe(en.addChain.cta);
    });

    it('confirms on the label when the wallet accepts, then returns to idle', async () =>
    {
        withProvider(vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        vi.advanceTimersByTime(2600);

        expect(label(container)).toBe(en.addChain.cta);
    });

    it('says nothing at all when the visitor declines the prompt', async () =>
    {
        const request = vi.fn().mockRejectedValue(Object.assign(new Error('rejected'), { code: 4001 }));

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));
        const before = useToasts().items().length;

        fire(container.querySelector('button')!, 'click');

        // Waited on the REQUEST rather than on the label: the resting label is what this
        // asserts, so waiting for it would pass before anything had happened at all.
        await vi.waitFor(() => expect(request).toHaveBeenCalled());
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.cta));

        // The reader pressed cancel. Reporting that back as "Could not add" tells somebody
        // their own decision went wrong, so the button simply returns to its resting label.
        expect(label(container)).toBe(en.addChain.cta);
        expect(useToasts().items().length).toBe(before);
    });

    /*
     * With no extension present - most desktop browsers - the manual values ARE the fallback,
     * and this is the regression guard on the bug that made the whole control look dead.
     *
     * It used to answer this case with `location.hash = '#chain'` and nothing else. Assigning
     * a hash the document already carries fires no navigation and moves no scroll, and this
     * button is rendered INSIDE the chain section as well as in the hero - so pressing it
     * there did nothing whatsoever. Both halves are asserted: the reader is told, and the page
     * actually travels.
     */
    it('says there is no wallet and travels to the manual chain card', async () =>
    {
        const section = document.createElement('section');
        section.id = 'chain';
        document.body.append(section);

        const travelled = vi.fn();
        section.scrollIntoView = travelled;

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(travelled).toHaveBeenCalled());

        expect(useToasts().items().some((entry) => entry.message === en.addChain.noWallet)).toBe(true);
        expect(label(container)).toBe(en.addChain.cta);

        section.remove();
    });

    // Regression guard on the `status() === 'pending'` early return: without it, an
    // impatient double-click opens a second wallet prompt behind the first.
    it('ignores a second click while a request is still in flight', async () =>
    {
        const gate = deferred<unknown>();
        const request = vi.fn().mockReturnValue(gate.promise);

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));
        const button = container.querySelector('button')!;

        fire(button, 'click');
        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));

        fire(button, 'click');
        fire(button, 'click');

        expect(request).toHaveBeenCalledTimes(1);

        gate.settle(null);
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));
    });

    it('accepts a fresh click once the previous attempt has settled', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));
        const button = container.querySelector('button')!;

        fire(button, 'click');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        vi.advanceTimersByTime(2600);
        fire(button, 'click');
        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2));
    });

    it('sends the EIP-1193 switch request exactly once per accepted click', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));

        expect(request.mock.calls[0][0]).toMatchObject({ method: 'wallet_switchEthereumChain' });
    });

    it('adds the chain when switch reports unknown chain (4902)', async () =>
    {
        const request = vi.fn().mockImplementation(async ({ method }: { method: string }) =>
        {
            if (method === 'wallet_switchEthereumChain')
            {
                throw Object.assign(new Error('Unknown chain'), { code: 4902 });
            }

            return null;
        });

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(2));
        expect(request.mock.calls[0][0]).toMatchObject({ method: 'wallet_switchEthereumChain' });
        expect(request.mock.calls[1][0]).toMatchObject({ method: 'wallet_addEthereumChain' });
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));
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
        withProvider(vi.fn().mockResolvedValue(null));

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.done));

        cleanup();

        expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
    });
});
