// The one-click add-chain path, end to end: button -> wallet module -> injected provider.
//
// Deliberately NOT mocking `../src/lib/wallet`: the interesting behaviour is the seam
// between the component's status machine and EIP-1193, and stubbing the module out would
// leave that seam untested while still looking green.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderTest, cleanup, fire } from '@azerothjs/testing';

import AddChainButton from '../src/components/add-chain-button.component.azeroth';
import { useLocale } from '../src/stores/locale';
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
    location.hash = '';
    vi.useFakeTimers();
});

afterEach(() =>
{
    vi.useRealTimers();
    cleanup();
    delete (window as { ethereum?: unknown }).ethereum;
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

    it('says so when the wallet rejects, then returns to idle', async () =>
    {
        withProvider(vi.fn().mockRejectedValue(Object.assign(new Error('rejected'), { code: 4001 })));

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(label(container)).toBe(en.addChain.failed));

        vi.advanceTimersByTime(2600);

        expect(label(container)).toBe(en.addChain.cta);
    });

    // With no extension present - most desktop browsers - the manual values ARE the
    // fallback, and a button that silently does nothing reads as broken.
    it('falls back to the manual chain card when no wallet is injected', async () =>
    {
        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(location.hash).toBe('#chain'));

        expect(label(container)).toBe(en.addChain.cta);
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

    it('sends the EIP-3085 request exactly once per accepted click', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);

        withProvider(request);

        const { container } = renderTest(() => AddChainButton({}));

        fire(container.querySelector('button')!, 'click');
        await vi.waitFor(() => expect(request).toHaveBeenCalledTimes(1));

        expect(request.mock.calls[0][0]).toMatchObject({ method: 'wallet_addEthereumChain' });
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
