// Nura Wallet in a browser it cannot inject into: the `nurawallet://` deep link.
//
// Two seams, and they fail in different ways. The first is what LEAVES - a URL an operating
// system hands to an application, carrying the same chain params the extension path sends, with
// a callback the wallet will actually accept. The second is what COMES BACK, which arrives in a
// tab this page did not open, from a URL fragment anybody can edit: the id is the only thing
// standing between a stale or forged fragment and a button that reports success.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { ADD_CHAIN_PARAMS } from '../src/lib/content/site';
import { METAMASK_RDNS, NURA_RDNS } from '../src/lib/wallets';

type Request = (args: { method: string; params?: unknown[] }) => Promise<unknown>;

/** The page the suite starts on, and the one every test is put back on. */
const HOME = window.location.href;

/**
 * Re-imported per test for the reason `wallet.spec.ts` gives: both modules keep their state at
 * module level and attach their listeners at import, so one test's pending request would
 * otherwise still be waiting during the next one.
 */
let wallet: typeof import('../src/lib/wallet');
let link: typeof import('../src/lib/nura-link');

const fromBase64Url = (value: string): string =>
    new TextDecoder().decode(
        Uint8Array.from(atob(value.replaceAll('-', '+').replaceAll('_', '/')), (char) => char.codePointAt(0) ?? 0)
    );

const toBase64Url = (value: string): string =>
    btoa(value).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');

interface SentRequest
{
    id: string;
    method: string;
    params: unknown[];
    callback: string;
}

/** The deep link this tab last sent, decoded back into the envelope the wallet parses. */
const sent = (): SentRequest =>
{
    const url = new URL(window.location.href);
    const packed = url.searchParams.get('request');

    if (url.protocol !== 'nurawallet:' || packed === null)
    {
        throw new Error(`no deep link was sent (address is ${ window.location.href })`);
    }

    return JSON.parse(fromBase64Url(packed)) as SentRequest;
};

/** One EIP-6963 announcement, as the wallet's own in-app browser makes it. */
const announce = (rdns: string, request: Request): void =>
{
    window.dispatchEvent(new CustomEvent('eip6963:announceProvider', {
        detail: {
            info: { uuid: `uuid-${ rdns }`, name: rdns, icon: 'data:image/png;base64,AA==', rdns },
            provider: { request }
        }
    }));
};

/**
 * The wallet answering.
 *
 * Through the `storage` fallback rather than the BroadcastChannel, because it is the same
 * delivery either way and this one is the path a browser without a channel takes - the harder
 * of the two to notice breaking.
 */
const answer = (reply: { id: string; result?: unknown; error?: unknown }): void =>
{
    window.dispatchEvent(new StorageEvent('storage', {
        key: `nura-connector/reply/${ reply.id }`,
        newValue: JSON.stringify(reply)
    }));
};

beforeEach(async () =>
{
    vi.resetModules();

    wallet = await import('../src/lib/wallet');
    link = await import('../src/lib/nura-link');

    wallet.forgetWallets();
    link.forgetLinks();
});

afterEach(() =>
{
    wallet.forgetWallets();
    link.forgetLinks();
    vi.useRealTimers();

    // A sent link leaves the document sitting on the `nurawallet:` address, whose origin is
    // opaque - the next test's callback would be built from it.
    window.location.href = HOME;
});

describe('what leaves', () =>
{
    it('asks Nura Wallet over the scheme when nothing announced a provider', () =>
    {
        void wallet.addChain(NURA_RDNS);

        expect(window.location.href.startsWith('nurawallet://dapp?request=')).toBe(true);
        expect(sent().method).toBe('wallet_addEthereumChain');
    });

    // The one-click path, the link path and the values printed on the chain card are one
    // constant. A wallet stores what this carries, so a divergence here is how somebody adds a
    // network that looks right and is not.
    it('carries the same chain params the extension path sends', () =>
    {
        void wallet.addChain(NURA_RDNS);

        expect(sent().params).toEqual([ADD_CHAIN_PARAMS]);
    });

    /*
     * The wallet reopens this URL to deliver its answer, and drops the request outright if it
     * is not `https:`. A query string or fragment would be rebuilt for the reader by a wallet,
     * so the callback is the bare page.
     */
    it('calls back to this page, without its query or its fragment', () =>
    {
        void wallet.addChain(NURA_RDNS);

        expect(sent().callback).toBe(HOME.replace(/[?#].*$/, ''));
        expect(sent().callback).not.toContain('?');
        expect(sent().callback).not.toContain('#');
    });

    it('gives every request an id of its own', () =>
    {
        void wallet.addChain(NURA_RDNS);

        const first = sent().id;

        void wallet.addChain(NURA_RDNS);

        expect(first.length).toBeGreaterThan(0);
        expect(sent().id).not.toBe(first);
    });

    /*
     * Inside the wallet's OWN browser there is an injected provider and no reason to leave the
     * page. Sending the deep link anyway would bounce the reader out to an application they are
     * already standing in.
     */
    it('uses the injected provider instead when the wallet announced one', async () =>
    {
        const calls: Array<{ method: string }> = [];

        announce(NURA_RDNS, async (args) =>
        {
            calls.push({ method: args.method });

            return null;
        });

        expect(await wallet.addChain(NURA_RDNS)).toBe('added');
        expect(calls).toEqual([{ method: 'wallet_addEthereumChain' }]);
        expect(window.location.href).toBe(HOME);
    });

    // The exception is Nura's alone. Every other wallet is an extension, and a browser with no
    // extension has nothing to open.
    it('does not send a link for a wallet that never announced', async () =>
    {
        expect(await wallet.addChain(METAMASK_RDNS)).toBe('refused');
        expect(window.location.href).toBe(HOME);
    });
});

describe('what comes back', () =>
{
    it('reports the chain as added when the wallet answers', async () =>
    {
        const outcome = wallet.addChain(NURA_RDNS);

        answer({ id: sent().id, result: null });

        expect(await outcome).toBe('added');
    });

    // 4001 is the visitor saying no. It is their decision and must never read as a failure.
    it('reads a rejection as a dismissal', async () =>
    {
        const outcome = wallet.addChain(NURA_RDNS);

        answer({ id: sent().id, error: { code: 4001, message: 'The user rejected the request' } });

        expect(await outcome).toBe('dismissed');
    });

    it('reads -32602 as the chain id already being held under another ticker', async () =>
    {
        const outcome = wallet.addChain(NURA_RDNS);

        answer({ id: sent().id, error: { code: -32602, message: 'Chain id is not a hex number' } });

        expect(await outcome).toBe('mismatch');
    });

    it('reads any other error as a refusal', async () =>
    {
        const outcome = wallet.addChain(NURA_RDNS);

        answer({ id: sent().id, error: { code: -32603, message: 'Something went wrong' } });

        expect(await outcome).toBe('refused');
    });

    /*
     * The id is the gate. A fragment is editable by anyone and outlives the request that
     * earned it - a bookmark, a shared link, a back button - so an answer nobody is waiting on
     * has to fall on the floor rather than settle the next request to come along.
     */
    it('ignores an answer to a request this tab did not make', async () =>
    {
        vi.useFakeTimers();

        const outcome = wallet.addChain(NURA_RDNS);

        answer({ id: 'some-other-request', result: null });
        answer({ id: `${ sent().id }-not-quite`, result: null });

        await vi.advanceTimersByTimeAsync(120_000);

        expect(await outcome).toBe('unanswered');
    });

    // The wait is for somebody leaving the browser, unlocking a wallet and reading a prompt.
    // An answer that takes most of it is still an answer.
    it('takes an answer that arrives just inside the wait', async () =>
    {
        vi.useFakeTimers();

        const outcome = wallet.addChain(NURA_RDNS);

        await vi.advanceTimersByTimeAsync(119_000);

        answer({ id: sent().id, result: null });

        expect(await outcome).toBe('added');
    });

    it('drops a fragment that is not a reply at all', async () =>
    {
        vi.useFakeTimers();

        const outcome = wallet.addChain(NURA_RDNS);

        window.dispatchEvent(new StorageEvent('storage', {
            key: `nura-connector/reply/${ sent().id }`,
            newValue: 'not json'
        }));

        await vi.advanceTimersByTimeAsync(120_000);

        expect(await outcome).toBe('unanswered');
    });
});

describe('the tab the wallet opened', () =>
{
    /*
     * The answer lands in a fresh tab of this site, so every page load reads the fragment and
     * then wipes it: it is a one-shot token, and a reader who bookmarks or shares the address
     * should not be carrying a wallet reply around inside it.
     */
    it('clears the reply out of the address bar', async () =>
    {
        window.location.hash = `nura=${ toBase64Url(JSON.stringify({ id: 'anything', result: null })) }`;

        vi.resetModules();
        await import('../src/lib/nura-link');

        expect(window.location.hash).toBe('');
    });

    it('leaves an ordinary fragment alone', async () =>
    {
        window.location.hash = 'chain';

        vi.resetModules();
        await import('../src/lib/nura-link');

        expect(window.location.hash).toBe('#chain');
    });
});

describe('reachability', () =>
{
    /*
     * "Reachable" is not "installed", and cannot be: nothing on the web can tell whether an
     * application exists on the device until it either answers or does not. The picker draws a
     * button for Nura Wallet on that basis and `unanswered` is what covers the other case.
     */
    it('holds Nura Wallet reachable with nothing announced', () =>
    {
        expect(wallet.isReachable(NURA_RDNS)).toBe(true);
    });

    it('holds an extension reachable only once it has announced', () =>
    {
        expect(wallet.isReachable(METAMASK_RDNS)).toBe(false);

        announce(METAMASK_RDNS, async () => null);

        expect(wallet.isReachable(METAMASK_RDNS)).toBe(true);
    });
});
