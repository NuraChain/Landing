// The EIP-3085 path: the one place this site talks to a wallet extension.
//
// Discovery is EIP-6963 and the reader names the wallet, so these tests are about two things:
// which announcements are allowed to become an option at all, and which outcome each shape of
// refusal maps to. A wallet that declines, a wallet that holds the chain id under another
// ticker and a wallet that simply fails are three different things to say to somebody.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ADD_CHAIN_PARAMS, CHAIN_ID, EXPLORER_URL, ICON_URL, NATIVE_TOKEN, NATIVE_TOKEN_SYMBOL, NETWORK_NAME, RPC_URL } from '../src/lib/content/site';
import { METAMASK_RDNS, NURA_RDNS, TRUST_RDNS } from '../src/lib/wallets';

type Request = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

/**
 * Re-imported per test, not bound once at the top of the file.
 *
 * `lib/wallet` keeps its registry in a module-level map, filled by a listener it attaches AT
 * IMPORT - which is the point of that design, but it means the wallet announced by one test
 * would still be a candidate for every test after it. `vi.resetModules()` hands each test its
 * own copy of the module, and so its own empty registry; listeners left on `window` by the
 * discarded copies push into maps nothing reads. `--sequence.shuffle` is what catches the
 * alternative.
 */
let wallet: typeof import('../src/lib/wallet');

/** One EIP-6963 announcement, as an extension makes it. */
const announce = (rdns: string, request: Request, icon = 'data:image/svg+xml;base64,PHN2Zy8+'): void =>
{
    window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
        detail: {
            info: { uuid: `uuid-${ rdns }`, name: rdns, icon, rdns },
            provider: { request }
        }
    }));
};

/** A wallet that says yes to everything, and records what it was asked. */
const accepting = (): { request: Request; calls: Array<{ method: string; params?: unknown[] }> } =>
{
    const calls: Array<{ method: string; params?: unknown[] }> = [];

    return {
        calls,
        request: async (args) =>
        {
            calls.push(args);

            return null;
        }
    };
};

/** A wallet that refuses with whatever it was given. */
const refusing = (error: unknown): Request => () => Promise.reject(error);

beforeEach(async () =>
{
    vi.resetModules();
    wallet = await import('../src/lib/wallet');
    wallet.forgetWallets();
});

afterEach(() =>
{
    wallet.forgetWallets();
    vi.restoreAllMocks();
});

describe('discovery', () =>
{
    it('finds nothing until a wallet announces itself', () =>
    {
        expect(wallet.walletOptions()).toEqual([]);
    });

    it('takes up a roster wallet that announces', () =>
    {
        announce(METAMASK_RDNS, accepting().request);

        expect(wallet.walletOptions()).toHaveLength(1);
        expect(wallet.walletOptions()[0]?.rdns).toBe(METAMASK_RDNS);
        expect(wallet.walletOptions()[0]?.label).toBe('MetaMask');
    });

    // The gate. A wallet outside the roster is not offered - see lib/wallets.ts, which is also
    // the one place widening it happens.
    it('drops an announcement from a wallet this site does not offer', () =>
    {
        announce('io.rabby', accepting().request);
        announce('com.okex.wallet', accepting().request);

        expect(wallet.walletOptions()).toEqual([]);
    });

    /*
     * Roster order, not announcement order. Which extension answers first is a race, and a
     * list whose rows move between two visits is a list nobody can aim at.
     */
    it('lists them in the roster\'s order however they announced', () =>
    {
        announce(TRUST_RDNS, accepting().request);
        announce(METAMASK_RDNS, accepting().request);
        announce(NURA_RDNS, accepting().request);

        expect(wallet.walletOptions().map((option) => option.rdns))
            .toEqual([NURA_RDNS, METAMASK_RDNS, TRUST_RDNS]);
    });

    // Wallets announce unprompted at load AND on request, so the same one arrives twice on an
    // ordinary page view.
    it('holds one entry per wallet however many times it announces', () =>
    {
        announce(METAMASK_RDNS, accepting().request);
        announce(METAMASK_RDNS, accepting().request);

        expect(wallet.walletOptions()).toHaveLength(1);
    });

    /*
     * EIP-6963 requires a data URI and an extension is free to announce anything at all. An
     * image data URI cannot run script, where an `http(s)` one would be a request to a third
     * party made from this page.
     */
    it('refuses an icon that is not an image data uri', () =>
    {
        announce(METAMASK_RDNS, accepting().request, 'https://example.com/logo.png');

        expect(wallet.walletOptions()[0]?.icon).toBeNull();
    });

    it('keeps an icon that is one', () =>
    {
        announce(METAMASK_RDNS, accepting().request, 'data:image/png;base64,AA==');

        expect(wallet.walletOptions()[0]?.icon).toBe('data:image/png;base64,AA==');
    });

    it('survives an announcement carrying no detail at all', () =>
    {
        window.dispatchEvent(new CustomEvent('eip6963:announceProvider'));

        expect(wallet.walletOptions()).toEqual([]);
    });
});

describe('addChain', () =>
{
    it('adds the chain, and asks the wallet exactly once', async () =>
    {
        const provider = accepting();
        announce(METAMASK_RDNS, provider.request);

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('added');

        /*
         * ONE request, and it is the one the button is named after.
         *
         * This is the regression the rewrite exists for. The previous version sent
         * `wallet_switchEthereumChain` first and decided what to do next from whatever came
         * back - so the ordinary path ran two requests, and a wallet that answered the first
         * one oddly settled the outcome of a button that had not yet asked for anything.
         * There is nothing to switch to before the chain is added.
         */
        expect(provider.calls).toHaveLength(1);
        expect(provider.calls[0]?.method).toBe('wallet_addEthereumChain');
        expect(provider.calls[0]?.params).toEqual([ADD_CHAIN_PARAMS]);
    });

    // Adding a network needs no account, and `eth_requestAccounts` hands over an address
    // nobody agreed to share by pressing a button that says nothing about accounts.
    it('never asks for an account', async () =>
    {
        const provider = accepting();
        announce(METAMASK_RDNS, provider.request);

        await wallet.addChain(METAMASK_RDNS);

        expect(provider.calls.map((call) => call.method)).not.toContain('eth_requestAccounts');
    });

    it('asks the wallet that was CHOSEN, not whichever announced first', async () =>
    {
        const first = accepting();
        const second = accepting();
        announce(METAMASK_RDNS, first.request);
        announce(TRUST_RDNS, second.request);

        await wallet.addChain(TRUST_RDNS);

        expect(first.calls).toEqual([]);
        expect(second.calls).toHaveLength(1);
    });

    it('refuses an rdns that never announced', async () =>
    {
        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
    });

    it('refuses a stub that announced without a usable request method', async () =>
    {
        window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
            detail: { info: { uuid: 'u', name: 'n', icon: '', rdns: METAMASK_RDNS }, provider: {} }
        }));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
    });

    it('reads a decline as a decline, not a failure', async () =>
    {
        announce(METAMASK_RDNS, refusing({ code: 4001, message: 'User rejected the request.' }));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('dismissed');
    });

    /*
     * Mobile in-app browsers bridge the native sheet's dismissal back into the page as a plain
     * error with a message and no numeric code, so a code-only test reads a cancellation as a
     * fault - and tells somebody their own decision went wrong.
     */
    it('reads a decline that arrives as a message only', async () =>
    {
        for (const message of ['User rejected the request', 'Rejected by the user', 'Cancelled.', 'User denied transaction'])
        {
            wallet.forgetWallets();
            announce(METAMASK_RDNS, refusing(new Error(message)));

            expect(await wallet.addChain(METAMASK_RDNS), message).toBe('dismissed');
        }
    });

    // A looser pattern would read this - a real parameter fault the reader must be told about -
    // as a decision they made, and silence it.
    it('does not read a rejected PARAMETER as a rejected prompt', async () =>
    {
        announce(METAMASK_RDNS, refusing(new Error('Rejected: invalid chainId')));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
    });

    /*
     * -32602 here is almost always one thing: the wallet already holds this chain id under a
     * different ticker and will not re-add it. The reader can go and fix that, but only if the
     * page says so instead of "your wallet said no".
     */
    it('names the case where the wallet already holds this id under another ticker', async () =>
    {
        announce(METAMASK_RDNS, refusing({ code: -32602, message: 'may not specify a different symbol' }));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('mismatch');
    });

    /*
     * MetaMask wraps the provider error it got from its own middleware, so the real code
     * arrives buried under an outer -32603. Reading only the outer one turns a refusal that
     * has a name into the generic one.
     */
    it('reads the code MetaMask buried under its own wrapper', async () =>
    {
        announce(METAMASK_RDNS, refusing({
            code: -32603,
            message: 'Internal JSON-RPC error.',
            data: { originalError: { code: -32602, message: 'different symbol' } }
        }));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('mismatch');

        wallet.forgetWallets();
        announce(TRUST_RDNS, refusing({ code: -32603, data: { originalError: { code: 4001 } } }));

        expect(await wallet.addChain(TRUST_RDNS)).toBe('dismissed');
    });

    it('reports anything else as a refusal', async () =>
    {
        announce(METAMASK_RDNS, refusing(new Error('boom')));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
    });

    it('reports a provider that throws something that is not an Error', async () =>
    {
        announce(METAMASK_RDNS, refusing('nope'));

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
    });

    it('reports a provider that throws synchronously', async () =>
    {
        announce(METAMASK_RDNS, (): never => { throw new Error('sync'); });

        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
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

    /*
     * EIP-3085's optional icon, and the only field here pointing at something this site
     * serves itself. Absolute on purpose: a wallet draws it in its own network list, where
     * a relative path resolves against nothing and the network turns up unmarked.
     */
    it('carries an absolute icon url', () =>
    {
        expect(ADD_CHAIN_PARAMS.iconUrls).toEqual([ICON_URL]);
        expect(ICON_URL.startsWith('https://')).toBe(true);
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
