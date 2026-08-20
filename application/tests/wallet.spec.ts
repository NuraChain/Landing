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
});

afterEach(() =>
{
    delete (window as { ethereum?: unknown }).ethereum;
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

    it('sends exactly one wallet_addEthereumChain request with the chain params', async () =>
    {
        const request = vi.fn().mockResolvedValue(null);

        withProvider(request);

        await addChainToWallet();

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith({
            method: 'wallet_addEthereumChain',
            params: [ADD_CHAIN_PARAMS]
        });
    });

    // The visitor declining the MetaMask prompt is code 4001. It is not an error condition
    // for this site - the button says so and goes back to idle - but it must not be
    // mistaken for success.
    it('reports failed when the visitor rejects the prompt', async () =>
    {
        withProvider(vi.fn().mockRejectedValue(Object.assign(new Error('User rejected the request.'), { code: 4001 })));

        await expect(addChainToWallet()).resolves.toBe('failed');
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
