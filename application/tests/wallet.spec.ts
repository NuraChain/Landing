// The EIP-3085 path: the one place this site talks to a wallet extension.
//
// `addChainToWallet` returns an outcome instead of throwing, so the tests below are mostly
// about which outcome each failure shape maps to - a wallet that rejects, a wallet that is
// not there, and a wallet that throws something that is not an Error all have to land on a
// state the button can render.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { addChainToWallet } from '../src/lib/wallet';
import { ADD_CHAIN_PARAMS, CHAIN_ID, EXPLORER_URL, NATIVE_TOKEN, NATIVE_TOKEN_SYMBOL, NETWORK_NAME, RPC_URL } from '../src/lib/content/site';

type Request = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

const withProvider = (request: Request): void =>
{
    (window as { ethereum?: { request: Request } }).ethereum = { request };
};

beforeEach(() =>
{
    delete (window as { ethereum?: unknown }).ethereum;
    delete (window as { trustwallet?: unknown }).trustwallet;
    delete (window as { trustWallet?: unknown }).trustWallet;
    delete (window as { nurawallet?: unknown }).nurawallet;
    delete (window as { nuraWallet?: unknown }).nuraWallet;
    delete (window as { nura?: unknown }).nura;
});

afterEach(() =>
{
    delete (window as { ethereum?: unknown }).ethereum;
    delete (window as { trustwallet?: unknown }).trustwallet;
    delete (window as { trustWallet?: unknown }).trustWallet;
    delete (window as { nurawallet?: unknown }).nurawallet;
    delete (window as { nuraWallet?: unknown }).nuraWallet;
    delete (window as { nura?: unknown }).nura;
    vi.restoreAllMocks();
});

describe('addChainToWallet', () =>
{
    it('reports no-provider when no wallet is injected', async () =>
    {
        await expect(addChainToWallet()).resolves.toBe('no-provider');
    });

    it('reports added when the wallet accepts the request', async () =>
    {
        withProvider(vi.fn().mockResolvedValue(null));

        await expect(addChainToWallet()).resolves.toBe('added');
    });

    it('switches to the chain when it is already known (no add needed)', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);

        withProvider(request);

        await addChainToWallet();

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3fc' }]
        });
    });

    it('adds the chain when the wallet does not know it (4902 → add)', async () =>
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

        await expect(addChainToWallet()).resolves.toBe('added');

        expect(request).toHaveBeenCalledTimes(2);
        expect(request.mock.calls[0][0]).toEqual({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x3fc' }]
        });
        expect(request.mock.calls[1][0]).toEqual({
            method: 'wallet_addEthereumChain',
            params: [ADD_CHAIN_PARAMS]
        });
    });

    it('falls back to add when switch is not supported (-32601)', async () =>
    {
        const request = vi.fn().mockImplementation(async ({ method }: { method: string }) =>
        {
            if (method === 'wallet_switchEthereumChain')
            {
                throw Object.assign(new Error('Method not found'), { code: -32601 });
            }

            return null;
        });

        withProvider(request);

        await expect(addChainToWallet()).resolves.toBe('added');
        expect(request).toHaveBeenCalledTimes(2);
        expect(request.mock.calls[1][0].method).toBe('wallet_addEthereumChain');
    });

    // The visitor declining the MetaMask prompt is code 4001. It is not an error condition
    // for this site - the button says so and goes back to idle - but it must not be
    // mistaken for success.
    it('reports rejected, not failed, when the visitor declines the prompt', async () =>
    {
        withProvider(vi.fn().mockRejectedValue(Object.assign(new Error('User rejected the request.'), { code: 4001 })));

        // Its own outcome: the button reports a failure to the reader, and a decision the
        // reader made is not one. `failed` here put "Could not add" in front of somebody who
        // had just pressed cancel.
        await expect(addChainToWallet()).resolves.toBe('rejected');
    });

    it('reports failed when the wallet rejects the params', async () =>
    {
        withProvider(vi.fn().mockRejectedValue(Object.assign(new Error('Invalid chainId'), { code: -32602 })));

        await expect(addChainToWallet()).resolves.toBe('failed');
    });

    // Wallet extensions are not required to reject with an Error, and a `catch` that
    // re-read `.message` off a string would throw inside the handler.
    it('reports failed when the wallet rejects with a non-Error value', async () =>
    {
        withProvider(vi.fn().mockRejectedValue('nope'));

        await expect(addChainToWallet()).resolves.toBe('failed');
    });

    it('reports failed when the provider throws synchronously', async () =>
    {
        withProvider(vi.fn().mockImplementation(() =>
        {
            throw new Error('provider exploded');
        }));

        await expect(addChainToWallet()).resolves.toBe('failed');
    });

    // A provider object that is present but malformed (no `request`) is a real shape: some
    // extensions inject a stub before they finish loading.
    it('reports failed rather than crashing when the injected object has no request method', async () =>
    {
        (window as { ethereum?: unknown }).ethereum = {};

        await expect(addChainToWallet()).resolves.toBe('failed');
    });

    it('never resolves to added when the request never settles successfully', async () =>
    {
        withProvider(vi.fn().mockRejectedValue(new Error('timeout')));

        const results = await Promise.all([addChainToWallet(), addChainToWallet(), addChainToWallet()]);

        expect(results).toEqual(['failed', 'failed', 'failed']);
    });

    it('uses a provider from window.ethereum.providers when multiple wallets are present', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        const secondary = vi.fn().mockResolvedValue(null);
        (window as unknown as { ethereum: unknown }).ethereum = {
            request,
            providers: [{ request: secondary } as unknown as { request: Request }, { request } as unknown as { request: Request }]
        };

        await expect(addChainToWallet()).resolves.toBe('added');
        // Should try a provider from the array - either the array entry or the proxy.
        expect(request.mock.calls.length + secondary.mock.calls.length).toBeGreaterThan(0);
    });

    it('supports Trust Wallet via window.trustwallet.ethereum', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        (window as unknown as { trustwallet: unknown }).trustwallet = { ethereum: { request } };

        await expect(addChainToWallet()).resolves.toBe('added');
        expect(request).toHaveBeenCalledWith(expect.objectContaining({ method: 'wallet_switchEthereumChain' }));
    });

    it('supports Nura Wallet via window.nurawallet', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        (window as unknown as { nurawallet: unknown }).nurawallet = { request };

        await expect(addChainToWallet()).resolves.toBe('added');
        expect(request).toHaveBeenCalledWith(expect.objectContaining({ method: 'wallet_switchEthereumChain' }));
    });

    it('discovers providers via EIP-6963 when window.ethereum is absent', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);
        const provider = { request };

        // Announce after the module dispatches eip6963:requestProvider
        window.addEventListener('eip6963:requestProvider', () =>
        {
            window.dispatchEvent(
                new CustomEvent('eip6963:announceProvider', {
                    detail: { info: { name: 'Fake Wallet', rdns: 'com.example.fake' }, provider }
                })
            );
        }, { once: true });

        await expect(addChainToWallet()).resolves.toBe('added');
        expect(request).toHaveBeenCalledWith(expect.objectContaining({ method: 'wallet_switchEthereumChain' }));
    });

    it('does not try a second provider after user rejected (4001)', async () =>
    {
        const first = vi.fn().mockRejectedValue(Object.assign(new Error('rejected'), { code: 4001 }));
        const second = vi.fn().mockResolvedValue(null);
        (window as unknown as { ethereum: unknown }).ethereum = {
            request: first,
            providers: [{ request: first } as unknown as { request: Request }, { request: second } as unknown as { request: Request }]
        };

        // `rejected`, not `failed`: they were asked and answered. The loop still stops - the
        // point of the test - because a second wallet prompt after a no is harassment.
        await expect(addChainToWallet()).resolves.toBe('rejected');
        expect(second).not.toHaveBeenCalled();
    });
});

/**
 * The params are what a wallet actually stores, so a wrong value here is the failure mode
 * the whole `PROVISIONAL` warning exists for: somebody adds the chain, sends funds, and
 * loses them. These assert the params agree with the constants the manual copy-paste card
 * renders - the two paths must never disagree.
 */
describe('ADD_CHAIN_PARAMS', () =>
{
    it('encodes the chain id as hex, which is what wallets require', () =>
    {
        expect(ADD_CHAIN_PARAMS.chainId).toBe('0x3fc');
        expect(Number.parseInt(ADD_CHAIN_PARAMS.chainId, 16)).toBe(CHAIN_ID);
    });

    it('uses a 0x-prefixed hex string with no leading zeros and no decimal form', () =>
    {
        expect(ADD_CHAIN_PARAMS.chainId).toMatch(/^0x[0-9a-f]+$/);
        expect(ADD_CHAIN_PARAMS.chainId).not.toMatch(/^0x0/);
        expect(ADD_CHAIN_PARAMS.chainId).not.toBe(String(CHAIN_ID));
    });

    it('carries the same endpoints the manual card tells people to type', () =>
    {
        expect(ADD_CHAIN_PARAMS.rpcUrls).toEqual([RPC_URL]);
        expect(ADD_CHAIN_PARAMS.blockExplorerUrls).toEqual([EXPLORER_URL]);
        expect(ADD_CHAIN_PARAMS.chainName).toBe(NETWORK_NAME);
    });

    it('declares 18-decimal native currency, the EVM convention wallets assume', () =>
    {
        expect(ADD_CHAIN_PARAMS.nativeCurrency).toEqual({
            name: NATIVE_TOKEN,
            symbol: NATIVE_TOKEN_SYMBOL,
            decimals: 18
        });
    });

    // Wallets reject a symbol outside 2-6 characters outright, which would make the
    // one-click button fail for everyone while the manual card kept working.
    it('uses a native symbol wallets will accept', () =>
    {
        expect(ADD_CHAIN_PARAMS.nativeCurrency.symbol).toMatch(/^[A-Z0-9]{2,6}$/);
    });
});
