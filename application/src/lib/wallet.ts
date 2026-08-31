import { createSignal, type Getter } from 'azerothjs';

import { ADD_CHAIN_PARAMS } from './content/site';
import { nuraRequest } from './nura-link';
import { brandFor, NURA_RDNS, usableIcon, WALLET_BRANDS } from './wallets';

/**
 * Asking a wallet to store Nura Chain (EIP-3085).
 *
 * Discovery is EIP-6963 and nothing else. The previous version of this file scanned
 * `window.ethereum`, `window.ethereum.providers` and a list of wallet-specific globals, ranked
 * the candidates by the `isMetaMask`-style flags they set, and then tried each in turn -
 * switching first, adding on any refusal, connecting and retrying when a provider said it was
 * unauthorised. Every one of those steps existed because the injected global does not say WHICH
 * wallet answered, so the page had to guess and then recover from guessing wrong. An
 * announcement carries an `rdns`, which ends the guessing: the reader picks a wallet by name and
 * the request goes to that exact provider.
 *
 * What follows from that, and is the actual fix:
 *
 *   - No switch-first. `wallet_addEthereumChain` is the request this button is named after, and
 *     a wallet that already holds the chain answers it without a second prompt anyway. Switching
 *     first meant the common path ran two requests, and a wallet that answered the first one
 *     oddly - `-32002`, an unenumerated code, a bare string - decided the outcome of a button
 *     that had not yet asked for anything.
 *   - No connect-first. Adding a network needs no account, and `eth_requestAccounts` hands over
 *     an address nobody agreed to share by pressing a button that says nothing about accounts.
 *   - No loop over providers. There is one provider: the one the reader chose.
 *
 * Every call into an extension is in this file. That is the point of it - this is the only code
 * on the site that hands anything to somebody else's software.
 */

/** The slice of EIP-1193 this needs. Injected wallets are ambient, so the type is declared here. */
interface InjectedProvider
{
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

/** One announcement, as EIP-6963 shapes it. */
interface Eip6963Detail
{
    info: { uuid: string; name: string; icon: string; rdns: string };
    provider: InjectedProvider;
}

/** A roster wallet that is actually installed. The provider itself never leaves this file. */
export interface WalletOption
{
    rdns: string;
    label: string;

    /** The vector the wallet announced, or null - in which case the picker draws its own glyph. */
    icon: string | null;
}

/**
 * What came of asking a wallet to add the network.
 *
 * Five outcomes and not a boolean, because they are five different things to say to a reader:
 * a dismissal is not a failure and must never be reported as one, a wallet that already holds
 * this chain id under another ticker is a situation the reader can go and fix, and a deep link
 * nothing answered is not a wallet refusing - it is a wallet that was never there.
 */
export type AddChainOutcome = 'added' | 'dismissed' | 'mismatch' | 'refused' | 'unanswered';

const [options, setOptions] = createSignal<WalletOption[]>([]);

/** The roster wallets installed right now, in roster order. Empty during SSR. */
export const walletOptions: Getter<WalletOption[]> = options;

/** Every announced ROSTER wallet, by rdns. */
const found = new Map<string, { provider: InjectedProvider; icon: string | null }>();

/**
 * Listening at IMPORT rather than at click time.
 *
 * A wallet announces once, in response to a request event, and most answer within a frame of the
 * page loading. Asking only when the button is pressed means either waiting out a timeout before
 * the wallet prompt can open - a delay on the one interaction that should feel immediate - or
 * missing the wallets that already answered.
 */
if (typeof window !== 'undefined')
{
    window.addEventListener('eip6963:announceProvider', (event: Event) =>
    {
        const detail = (event as CustomEvent<Eip6963Detail>).detail;
        const brand = brandFor(detail?.info?.rdns ?? '');

        // The gate, in one place. An announcement from a wallet this site does not offer is
        // dropped here and nowhere else, so widening the roster is one entry in ./wallets.ts.
        if (brand === undefined || found.has(brand.rdns))
        {
            return;
        }

        found.set(brand.rdns, { provider: detail.provider, icon: usableIcon(detail.info?.icon) });

        // Roster order and not announcement order: which extension answers first is a race, and
        // a list whose rows move between two visits is a list nobody can aim at.
        setOptions(WALLET_BRANDS
            .filter((entry) => found.has(entry.rdns))
            .map((entry) => ({ rdns: entry.rdns, label: entry.label, icon: found.get(entry.rdns)?.icon ?? null })));
    });

    try
    {
        // Wallets announce unprompted at load AND on request. The request is what catches the
        // ones that finished injecting before this listener existed - without it, whether a
        // wallet is found depends on which script the browser ran first.
        window.dispatchEvent(new Event('eip6963:requestProvider'));
    }
    catch
    {
        // A DOM that will not dispatch a custom event name costs the announcements, not the
        // page: the button then reports that no wallet was found, which is what a reader sees.
    }
}

/** Test seam: drops every announcement, so one spec's wallets cannot leak into the next. */
export const forgetWallets = (): void =>
{
    found.clear();
    setOptions([]);
};

/**
 * Whether this wallet can be asked at all right now, which is the question the picker draws a
 * row from - a button to press, or a link to go and install.
 *
 * Announced is the usual answer, and reads off the signal rather than the map so a wallet that
 * announces late redraws the row it belongs to. Nura Wallet is the standing exception: it is an
 * application rather than an extension, reachable over its own scheme with no announcement at
 * all. That is not the same as being installed - nothing on the web can tell whether an
 * application exists until it either answers or does not, which is what `unanswered` reports.
 */
export const isReachable = (rdns: string): boolean =>
    rdns === NURA_RDNS || options().some((option) => option.rdns === rdns);

/**
 * The error code a wallet actually meant.
 *
 * MetaMask wraps the provider error it got from its own middleware, so a code sent by the inner
 * layer arrives as an outer `-32603` with the real one buried in `data.originalError.code`.
 * Reading only the outer code turns a refusal that has a name into the generic one.
 */
const codeOf = (error: unknown): number | null =>
{
    const outer = error as { code?: unknown; data?: { code?: unknown; originalError?: { code?: unknown } } } | null;

    for (const value of [outer?.data?.originalError?.code, outer?.data?.code, outer?.code])
    {
        if (typeof value === 'number')
        {
            return value;
        }
    }

    return null;
};

/**
 * Whether an error is the visitor saying no, rather than the wallet failing.
 *
 * 4001 is the EIP-1193 code for it and is what every desktop extension sends. Mobile in-app
 * browsers frequently do not: the native sheet's dismissal is bridged back into the page as a
 * plain error carrying a message and no numeric code at all, so a code-only test reads a
 * cancellation as a fault and tells somebody their own decision went wrong.
 *
 * The message test insists on the word "user" next to the verb, or on a message that is nothing
 * but the verb. A looser pattern would read "Rejected: invalid chainId" - a real parameter fault
 * the reader must be told about - as a decision they made, and silence it.
 */
const REJECTED_BY_USER = /\buser\s+(?:has\s+)?(?:rejected|denied|cancell?ed|declined|dismissed)\b|\b(?:rejected|denied|cancell?ed|declined)\s+by\s+(?:the\s+)?user\b/i;

const REJECTED_BARE = /^\s*(?:user\s+)?(?:rejected|denied|cancell?ed|declined)\.?\s*$/i;

const isDismissal = (error: unknown): boolean =>
{
    if (codeOf(error) === 4001)
    {
        return true;
    }

    const message = (error as { message?: unknown } | null | undefined)?.message;

    return typeof message === 'string' && (REJECTED_BY_USER.test(message) || REJECTED_BARE.test(message));
};

/**
 * One refusal, read the same way whether a provider threw it or the deep link carried it back.
 *
 * -32602 is almost always one thing: the wallet already holds this chain id under a different
 * ticker and refuses to re-add it. That is a fixable situation the reader can act on, so it
 * must not read as the generic "your wallet said no".
 */
const refusal = (error: unknown): AddChainOutcome =>
    isDismissal(error) ? 'dismissed' : codeOf(error) === -32602 ? 'mismatch' : 'refused';

/**
 * The same request, over `nurawallet://`, for the browsers Nura Wallet cannot inject into.
 *
 * Sending the identical `ADD_CHAIN_PARAMS` is the point: the extension path, the link path and
 * the values printed on the chain card are one constant, so no two of them can drift.
 */
const overLink = async (): Promise<AddChainOutcome> =>
{
    const outcome = await nuraRequest('wallet_addEthereumChain', [ADD_CHAIN_PARAMS]);

    if (outcome.status === 'answered')
    {
        return 'added';
    }

    return outcome.status === 'unanswered' ? 'unanswered' : refusal(outcome.error);
};

/**
 * Asks ONE wallet to store this network.
 *
 * Needs no connection - only a chosen wallet. Answers with an outcome rather than throwing,
 * because every branch is an expected state the button renders and not an error: a reader
 * declining the prompt is the most ordinary of the five.
 */
export const addChain = async (rdns: string): Promise<AddChainOutcome> =>
{
    const entry = found.get(rdns);

    if (entry === undefined || typeof entry.provider?.request !== 'function')
    {
        // Nothing announced. For Nura Wallet that is the ordinary case and not a fault - it is
        // an application, so outside its own in-app browser there is no provider to inject and
        // the request travels over the scheme instead. For an extension it means announced and
        // then not there, or a stub injected before the extension finished loading, which
        // presents as a wallet that refused because from here that is what it is.
        return rdns === NURA_RDNS ? overLink() : 'refused';
    }

    try
    {
        await entry.provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });

        return 'added';
    }
    catch (error: unknown)
    {
        return refusal(error);
    }
};
