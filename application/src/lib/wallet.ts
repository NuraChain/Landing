import { ADD_CHAIN_PARAMS, CHAIN_ID } from './content/site';

/**
 * The one slice of EIP-1193 this site uses. Typed here rather than pulled from a wallet
 * SDK: a landing page that imports a provider library to send a single request would carry
 * the library for nothing.
 */
interface Eip1193Provider
{
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
    // Present when multiple wallets race for `window.ethereum`.
    providers?: Eip1193Provider[];
}

/**
 * The flags wallets set on their own provider so a site can tell them apart. Every one is
 * optional and none is trustworthy on its own - any extension can set any of them - which is
 * why they only ever ORDER the candidates here and never gate them.
 */
interface ProviderFlags
{
    isMetaMask?: boolean;
    isTrust?: boolean;
    isTrustWallet?: boolean;
    isBinance?: boolean;
    isNura?: boolean;
    isNuraWallet?: boolean;
}

const CHAIN_HEX = `0x${ CHAIN_ID.toString(16) }`;

const inBrowser = typeof window !== 'undefined';

/**
 * Providers that announced themselves through EIP-6963.
 *
 * Filled by the listener below, which is attached AT IMPORT rather than at click time. That
 * is the whole point: a wallet announces once, in response to a request event, and most of
 * them answer within a frame of the page loading. Asking only when the button is pressed
 * means either waiting out a timeout before the wallet prompt can open - a delay on the one
 * interaction that should feel immediate - or missing the wallets that already answered.
 */
const announced: Eip1193Provider[] = [];

if (inBrowser)
{
    window.addEventListener('eip6963:announceProvider', (event: Event): void =>
    {
        const detail = (event as CustomEvent<{ provider?: Eip1193Provider }>).detail;

        if (detail?.provider !== undefined && detail.provider !== null && !announced.includes(detail.provider))
        {
            announced.push(detail.provider);
        }
    });

    try
    {
        window.dispatchEvent(new Event('eip6963:requestProvider'));
    }
    catch
    {
        // A DOM that will not dispatch a custom event name costs the announcements, not the
        // page: the synchronous globals below still find every wallet that injects one.
    }
}

/**
 * Collects every synchronously-injected EIP-1193 provider.
 *
 * `window.ethereum` is the legacy singleton most wallets still fill (MetaMask, Trust Wallet
 * in its in-app browser, Binance Web3 Wallet, Nura Wallet's extension). When more than one
 * extension is installed, some wallets expose `window.ethereum.providers` while others leave
 * a proxy on `window.ethereum` itself - so both shapes are collected.
 *
 * The wallet-specific globals are checked explicitly so a visitor running one of them
 * ALONGSIDE MetaMask is not reduced to a single candidate by whichever extension won the
 * race for `window.ethereum`:
 *
 * - Trust Wallet  `window.trustwallet.ethereum`, `window.trustWallet.ethereum`
 * - Nura Wallet   `window.nurawallet`, `window.nuraWallet`, `window.nura.ethereum`
 * - Binance       `window.BinanceChain`, and `window.binancechain` on older builds
 *
 * No filtering on `typeof request === 'function'` here: a malformed stub (injected before it
 * finished loading) is still a *present* provider and must map to `failed` rather than
 * `no-provider` - the button's two fallbacks mean different things.
 */
export const getInjectedProvidersSync = (): Eip1193Provider[] =>
{
    const w = window as unknown as Record<string, unknown>;
    const out: Eip1193Provider[] = [];

    const push = (candidate: unknown): void =>
    {
        if (candidate !== undefined && candidate !== null)
        {
            out.push(candidate as Eip1193Provider);
        }
    };

    const eth = w.ethereum as (Eip1193Provider & { providers?: Eip1193Provider[] }) | undefined;

    if (eth !== undefined && eth !== null)
    {
        if (Array.isArray(eth.providers))
        {
            for (const provider of eth.providers)
            {
                push(provider);
            }
        }

        push(eth);
    }

    push((w.trustwallet as { ethereum?: Eip1193Provider } | undefined)?.ethereum);
    push((w.trustWallet as { ethereum?: Eip1193Provider } | undefined)?.ethereum);

    push(w.nurawallet);
    push(w.nuraWallet);
    push((w.nura as { ethereum?: Eip1193Provider } | undefined)?.ethereum);

    push(w.BinanceChain);
    push(w.binancechain);

    return out;
};

/**
 * EIP-6963 discovery: wallets announce themselves after a `eip6963:requestProvider` event.
 *
 * The registry above already holds whatever answered at import. This re-asks, for the wallet
 * that loaded after the page did, and is only awaited when nothing else has turned up - so
 * the timeout is never spent on a visitor who has a wallet ready.
 */
export const discoverEip6963Providers = (timeoutMs = 160): Promise<Eip1193Provider[]> =>
{
    return new Promise((resolve) =>
    {
        const providers: Eip1193Provider[] = [...announced];

        const handler = (event: Event): void =>
        {
            const detail = (event as CustomEvent<{ provider?: Eip1193Provider }>).detail;

            if (detail?.provider !== undefined && !providers.includes(detail.provider))
            {
                providers.push(detail.provider);
            }
        };

        window.addEventListener('eip6963:announceProvider', handler as EventListener);

        try
        {
            window.dispatchEvent(new Event('eip6963:requestProvider'));
        }
        catch
        {
            // Some test DOMs may not support dispatchEvent for custom names.
        }

        window.setTimeout(() =>
        {
            window.removeEventListener('eip6963:announceProvider', handler as EventListener);
            resolve(providers);
        }, timeoutMs);
    });
};

/**
 * Known wallets first, everything else in the order it was found.
 *
 * With several extensions installed the candidate list is whatever order the injections
 * happened in, and the first one tried is the one that opens a prompt. Putting a provider
 * that identifies itself as one of the four supported wallets ahead of an anonymous one
 * means the visitor is asked by a wallet they recognise. The sort is STABLE, so providers
 * that share a rank keep their discovery order - the proxy on `window.ethereum` still comes
 * after the entries of `window.ethereum.providers`, which is what the suite pins.
 */
const rank = (provider: Eip1193Provider): number =>
{
    const flags = provider as ProviderFlags;

    const known = flags.isMetaMask === true
        || flags.isTrust === true
        || flags.isTrustWallet === true
        || flags.isBinance === true
        || flags.isNura === true
        || flags.isNuraWallet === true;

    return known ? 0 : 1;
};

const getProviders = async (): Promise<Eip1193Provider[]> =>
{
    const candidates = [...getInjectedProvidersSync(), ...announced];

    // De-duplicate by reference - the proxy, an entry in `providers` and an EIP-6963
    // announcement can all be the same object.
    const seen = new Set<Eip1193Provider>();
    const unique: Eip1193Provider[] = [];

    for (const provider of candidates)
    {
        if (!seen.has(provider))
        {
            seen.add(provider);
            unique.push(provider);
        }
    }

    if (unique.length > 0)
    {
        return unique.sort((a, b) => rank(a) - rank(b));
    }

    return discoverEip6963Providers(160);
};

type AttemptResult = 'success' | 'rejected' | 'failed';

/**
 * The error code a wallet actually meant.
 *
 * MetaMask wraps the provider error it got from its own middleware, so the 4902 that says
 * "this chain is unknown to me" arrives as an outer -32603 with the real code buried in
 * `data.originalError.code`. Reading only the outer code turned the normal first-visit path
 * into a generic failure.
 */
const errorCode = (error: unknown): number | undefined =>
{
    const outer = error as { code?: number; data?: { code?: number; originalError?: { code?: number } } };

    return outer?.data?.originalError?.code ?? outer?.data?.code ?? outer?.code;
};

/**
 * Whether an error is the visitor saying no, rather than the wallet failing.
 *
 * 4001 is the EIP-1193 code for it and is what every desktop extension sends. Mobile
 * in-app browsers frequently do not: the native sheet's dismissal is bridged back into the
 * page as a plain error carrying a message and no numeric code at all, so a code-only test
 * reads a cancellation as a fault. That distinction decides two things - whether the reader
 * is shown a failure they did not cause, and, since the switch now falls through to an add,
 * whether they are prompted a SECOND time after already declining.
 *
 * The message test insists on the word "user" next to the verb, or on a message that is
 * nothing but the verb. A looser pattern would read "Rejected: invalid chainId" - a real
 * param fault the reader must be told about - as a decision they made, and silence it.
 */
const REJECTED_BY_USER = /\buser\s+(?:has\s+)?(?:rejected|denied|cancell?ed|declined|dismissed)\b|\b(?:rejected|denied|cancell?ed|declined)\s+by\s+(?:the\s+)?user\b/i;

const REJECTED_BARE = /^\s*(?:user\s+)?(?:rejected|denied|cancell?ed|declined)\.?\s*$/i;

const isRejection = (error: unknown): boolean =>
{
    if (errorCode(error) === 4001)
    {
        return true;
    }

    const message = (error as { message?: unknown } | null | undefined)?.message;

    return typeof message === 'string' && (REJECTED_BY_USER.test(message) || REJECTED_BARE.test(message));
};

/**
 * EIP-1193 4100, "unauthorized": the wallet will not run this method for a site it has not
 * been introduced to.
 *
 * This is why the button worked in Trust Wallet's browser EXTENSION and failed in the Trust
 * Wallet APP on a phone - two different codebases behind one name. The mobile provider gates
 * every request behind a `ready` flag that is only set once an account has been shared, and
 * refuses everything else before it reaches the wallet at all:
 *
 *     postMessage(handler, id, data) {
 *       if (this.ready || handler === "requestAccounts") { super.postMessage(...) }
 *       else { this.sendError(id, new ProviderRpcError(4100, "provider is not ready")); }
 *     }
 *
 * (`src/base_provider.js` and `src/ethereum_provider.js`, trustwallet/trust-web3-provider.)
 * So neither the switch nor the add was ever seen by anything that could have granted it.
 * The extension has no such gate, and several other in-app browsers fork this provider and
 * carry it.
 *
 * Matched on the message as well as the code because the gate is one string in one file,
 * and a wallet that reworded it while keeping the behaviour would put the bug straight back.
 */
const NOT_AUTHORISED = /provider is not ready|not authori[sz]ed|unauthori[sz]ed/i;

const isUnauthorized = (error: unknown): boolean =>
{
    if (errorCode(error) === 4100)
    {
        return true;
    }

    const message = (error as { message?: unknown } | null | undefined)?.message;

    return typeof message === 'string' && NOT_AUTHORISED.test(message);
};

/** `unauthorized` is not an outcome the button renders - it is a step the caller can take. */
type ChainAttempt = AttemptResult | 'unauthorized';

const addChain = async (provider: Eip1193Provider): Promise<ChainAttempt> =>
{
    try
    {
        await provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });

        return 'success';
    }
    catch (error: unknown)
    {
        if (isRejection(error))
        {
            return 'rejected';
        }

        return isUnauthorized(error) ? 'unauthorized' : 'failed';
    }
};

const switchOrAddChain = async (provider: Eip1193Provider): Promise<ChainAttempt> =>
{
    try
    {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] });

        return 'success';
    }
    catch (error: unknown)
    {
        // The visitor declined the prompt. Do not fall through to a second prompt
        // (`wallet_addEthereumChain`) and do not try the next wallet: they said no once.
        if (isRejection(error))
        {
            return 'rejected';
        }

        // Not a refusal and not a fault - the wallet wants an introduction first. Reported
        // up rather than handled here, because the retry belongs after the connection.
        if (isUnauthorized(error))
        {
            return 'unauthorized';
        }

        // -32002 - a prompt for this very request is already open, either in front of the
        // reader or left unanswered behind the page. An add sent now queues a second sheet
        // behind the first instead of helping.
        if (errorCode(error) === -32002)
        {
            return 'failed';
        }

        /*
         * Anything else: ADD the chain. This used to be an allowlist - 4902 ("unknown
         * chain"), -32601 and -32603 - and every wallet outside it got a hard failure
         * without the request the button is actually named after ever being sent.
         *
         * An allowlist is the wrong shape for this. There is no registry of the codes every
         * wallet on every phone returns, and the cost of the two directions is not
         * symmetric: a needless add request costs one prompt the reader can dismiss, while
         * a missing one costs the feature. Switching first stays only as an optimisation -
         * it spares a redundant prompt for a reader who already has the chain.
         */
        return addChain(provider);
    }
};

const connect = async (provider: Eip1193Provider): Promise<AttemptResult> =>
{
    try
    {
        await provider.request({ method: 'eth_requestAccounts', params: [] });

        return 'success';
    }
    catch (error: unknown)
    {
        return isRejection(error) ? 'rejected' : 'failed';
    }
};

const attemptForProvider = async (provider: Eip1193Provider): Promise<AttemptResult> =>
{
    if (provider === undefined || provider === null || typeof (provider as { request?: unknown }).request !== 'function')
    {
        return 'failed';
    }

    const first = await switchOrAddChain(provider);

    if (first !== 'unauthorized')
    {
        return first;
    }

    /*
     * The wallet said it will not act for a site it has not met. Introduce the site, then
     * ask again - on a phone this is the only order that works at all.
     *
     * Deliberately NOT done up front. `eth_requestAccounts` hands over an address, which is
     * more than adding a network needs and more than somebody agreed to by pressing a button
     * that says nothing about accounts. On an extension the add already works without it and
     * no account is ever shared, and it stays that way: the connection is asked for only
     * when a wallet has said, in EIP-1193's own vocabulary, that it will not proceed without
     * one. That costs the reader on a phone two prompts instead of one, which is the price
     * of the button working there at all.
     */
    const connected = await connect(provider);

    if (connected !== 'success')
    {
        return connected;
    }

    const second = await switchOrAddChain(provider);

    // Still refusing with an account shared: nothing left to try on this provider, and
    // retrying the connection would only loop.
    return second === 'unauthorized' ? 'failed' : second;
};

export type AddChainResult = 'added' | 'rejected' | 'failed' | 'no-provider';

/**
 * Asks the injected wallet to add Nura Chain.
 *
 * Tries `wallet_switchEthereumChain` first: if the chain is already known the wallet just
 * switches and the button shows `done`, with no second prompt. Any answer other than a
 * refusal by the reader falls through to `wallet_addEthereumChain` - see the note there for
 * why that is deliberately not conditioned on a list of error codes. That covers the four
 * supported wallets - MetaMask, Trust Wallet, Nura Wallet and Binance - which all speak
 * EIP-1193 and either inject one of the globals above or announce through EIP-6963, in an
 * extension or in a phone's in-app browser.
 *
 * A wallet that refuses both because the site has not connected to it yet is connected to
 * and asked again - see `isUnauthorized`, which is the whole reason the app on a phone
 * behaved differently from the extension of the same name.
 *
 * Returns an outcome instead of throwing, because every branch is an expected state the
 * button renders, not an error: `no-provider` is most desktop browsers, `rejected` is the
 * visitor declining the prompt, and `failed` is a wallet that could not do it.
 */
export const addChainToWallet = async (): Promise<AddChainResult> =>
{
    let providers: Eip1193Provider[];

    try
    {
        providers = await getProviders();
    }
    catch
    {
        return 'failed';
    }

    if (providers.length === 0)
    {
        return 'no-provider';
    }

    for (const provider of providers)
    {
        let result: AttemptResult;

        try
        {
            result = await attemptForProvider(provider);
        }
        catch
        {
            result = 'failed';
        }

        if (result === 'success')
        {
            return 'added';
        }

        if (result === 'rejected')
        {
            // Reported as its own outcome rather than folded into `failed`: the visitor was
            // asked and answered, and telling them their answer did not work is both wrong and
            // faintly rude. The loop still stops - they said no once.
            return 'rejected';
        }

        // 'failed' - the next wallet may still be able to answer.
    }

    return 'failed';
};
