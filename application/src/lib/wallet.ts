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

const addChain = async (provider: Eip1193Provider): Promise<AttemptResult> =>
{
    try
    {
        await provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });

        return 'success';
    }
    catch (error: unknown)
    {
        return errorCode(error) === 4001 ? 'rejected' : 'failed';
    }
};

const attemptForProvider = async (provider: Eip1193Provider): Promise<AttemptResult> =>
{
    if (provider === undefined || provider === null || typeof (provider as { request?: unknown }).request !== 'function')
    {
        return 'failed';
    }

    try
    {
        await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_HEX }] });

        return 'success';
    }
    catch (error: unknown)
    {
        const code = errorCode(error);

        // 4001 - the visitor declined the prompt. Do not fall through to a second prompt
        // (`wallet_addEthereumChain`) and do not try the next wallet: they said no once.
        if (code === 4001)
        {
            return 'rejected';
        }

        // 4902 - chain unknown to the wallet. The normal first-visit path: add it, which
        // most wallets also switch to. -32601 and -32603 are the wallets that expose only
        // `wallet_addEthereumChain` and answer the switch with "method not found".
        if (code === 4902 || code === -32601 || code === -32603)
        {
            return addChain(provider);
        }

        return 'failed';
    }
};

export type AddChainResult = 'added' | 'failed' | 'no-provider';

/**
 * Asks the injected wallet to add Nura Chain.
 *
 * Tries `wallet_switchEthereumChain` first: if the chain is already known the wallet just
 * switches and the button shows `done`. If it is unknown (4902) it falls back to
 * `wallet_addEthereumChain`. That covers the four supported wallets - MetaMask, Trust
 * Wallet, Nura Wallet and Binance - which all speak EIP-1193 and either inject one of the
 * globals above or announce through EIP-6963.
 *
 * Returns an outcome instead of throwing, because every branch is an expected state the
 * button renders, not an error: `no-provider` is most desktop browsers, and `failed` covers
 * both the visitor declining the prompt and a wallet that rejects the params.
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
            return 'failed';
        }

        // 'failed' - the next wallet may still be able to answer.
    }

    return 'failed';
};
