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

const CHAIN_HEX = `0x${ CHAIN_ID.toString(16) }`;

/**
 * Collects every synchronously-injected EIP-1193 provider.
 *
 * `window.ethereum` is the legacy singletons most wallets still fill (MetaMask,
 * Trust Wallet in its injected-browser, Nura Wallet's extension). When more than
 * one extension is installed, some wallets expose `window.ethereum.providers`
 * while others leave a proxy on `window.ethereum` itself - so both shapes are
 * collected.
 *
 * Nura Wallet and Trust Wallet also expose legacy globals (`window.nurawallet`,
 * `window.trustwallet`). They are checked explicitly so a visitor with one of
 * those plus MetaMask is not reduced to a single candidate by accident.
 *
 * No filtering on `typeof request === 'function'` here: a malformed stub
 * (injected before it finished loading) is still a *present* provider and must
 * map to `failed` rather than `no-provider` - the button's two fallbacks mean
 * different things.
 */
export const getInjectedProvidersSync = (): Eip1193Provider[] =>
{
    const w = window as unknown as Record<string, unknown>;
    const out: Eip1193Provider[] = [];

    const eth = w.ethereum as (Eip1193Provider & { providers?: Eip1193Provider[] }) | undefined;

    if (eth !== undefined && eth !== null)
    {
        if (Array.isArray((eth as { providers?: unknown }).providers))
        {
            for (const p of (eth as { providers: Eip1193Provider[] }).providers)
            {
                if (p !== undefined && p !== null) out.push(p);
            }
        }

        out.push(eth as Eip1193Provider);
    }

    const trustEth1 = (w.trustwallet as { ethereum?: Eip1193Provider } | undefined)?.ethereum;
    if (trustEth1 !== undefined) out.push(trustEth1);

    const trustEth2 = (w.trustWallet as { ethereum?: Eip1193Provider } | undefined)?.ethereum;
    if (trustEth2 !== undefined) out.push(trustEth2);

    const nura1 = w.nurawallet as Eip1193Provider | undefined;
    if (nura1 !== undefined) out.push(nura1);

    const nura2 = w.nuraWallet as Eip1193Provider | undefined;
    if (nura2 !== undefined) out.push(nura2);

    const nuraEth = (w.nura as { ethereum?: Eip1193Provider } | undefined)?.ethereum;
    if (nuraEth !== undefined) out.push(nuraEth);

    // De-duplicate by reference - the proxy and one entry in `providers`
    // can be the same object.
    const seen = new Set<Eip1193Provider>();
    const dedup: Eip1193Provider[] = [];

    for (const p of out)
    {
        if (seen.has(p)) continue;
        seen.add(p);
        dedup.push(p);
    }

    return dedup;
};

/**
 * EIP-6963 discovery: wallets announce themselves after a
 * `eip6963:requestProvider` event.
 *
 * The site does not render a wallet picker - the one-click button just needs
 * *a* provider - but listening for announcements makes wallets that never touch
 * `window.ethereum` (or only appear after the page loaded) discoverable. Used
 * as a fallback when no synchronous provider is present.
 */
export const discoverEip6963Providers = (timeoutMs = 160): Promise<Eip1193Provider[]> =>
{
    return new Promise((resolve) =>
    {
        const providers: Eip1193Provider[] = [];

        const handler = (event: Event): void =>
        {
            const detail = (event as CustomEvent<{ provider?: Eip1193Provider }>).detail;
            if (detail?.provider !== undefined) providers.push(detail.provider);
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

const getProviders = async (): Promise<Eip1193Provider[]> =>
{
    const sync = getInjectedProvidersSync();
    if (sync.length > 0) return sync;
    return discoverEip6963Providers(160);
};

type AttemptResult = 'success' | 'rejected' | 'failed';

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
        const code = (error as { code?: number })?.code;

        // 4001 - user rejected the prompt. Do not fall through to a second
        // prompt (`wallet_addEthereumChain`) and do not try the next wallet.
        if (code === 4001) return 'rejected';

        // 4902 - chain unknown to the wallet. This is the normal first-visit
        // path: add it, which most wallets also switch to.
        if (code === 4902)
        {
            try
            {
                await provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });
                return 'success';
            }
            catch (inner: unknown)
            {
                const innerCode = (inner as { code?: number })?.code;
                if (innerCode === 4001) return 'rejected';
                return 'failed';
            }
        }

        // Some wallets expose only `wallet_addEthereumChain` and reject the
        // switch with "method not found". Treat that as 4902.
        if (code === -32601 || code === -32603)
        {
            try
            {
                await provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });
                return 'success';
            }
            catch (inner: unknown)
            {
                const innerCode = (inner as { code?: number })?.code;
                if (innerCode === 4001) return 'rejected';
                return 'failed';
            }
        }

        return 'failed';
    }
};

export type AddChainResult = 'added' | 'failed' | 'no-provider';

/**
 * Asks the injected wallet to add Nura Chain.
 *
 * Tries `wallet_switchEthereumChain` first: if the chain is already known the
 * wallet just switches and the button shows `done`. If it is unknown (4902)
 * it falls back to `wallet_addEthereumChain`. This covers all three wallets
 * called out in the requirement (MetaMask, Trust Wallet, Nura Wallet) - they
 * all speak EIP-1193 and either inject `window.ethereum` or announce via
 * EIP-6963.
 *
 * Returns an outcome instead of throwing, because every branch is an expected
 * state the button renders, not an error: `no-provider` is most desktop
 * browsers, and `failed` covers both the visitor declining the prompt and a
 * wallet that rejects the params.
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

        if (result === 'success') return 'added';
        if (result === 'rejected') return 'failed';
        // 'failed' -> try next provider, if any
    }

    return 'failed';
};
