import { ADD_CHAIN_PARAMS } from './content/site';

/**
 * The one slice of EIP-1193 this site uses. Typed here rather than pulled from a wallet
 * SDK: a landing page that imports a provider library to send a single request would carry
 * the library for nothing.
 */
interface Eip1193Provider
{
    request(args: { method: string; params?: unknown[] }): Promise<unknown>;
}

/**
 * MetaMask and every other EIP-1193 extension inject `window.ethereum`. Read through a
 * cast rather than a global augmentation, which the lint config bans as a namespace.
 */
const injected = (): Eip1193Provider | undefined => (window as { ethereum?: Eip1193Provider }).ethereum;

export type AddChainResult = 'added' | 'failed' | 'no-provider';

/**
 * Asks the injected wallet to add Nura Chain (EIP-3085).
 *
 * Returns an outcome instead of throwing, because every branch is an expected state the
 * button renders, not an error: `no-provider` is most desktop browsers, and `failed`
 * covers both the visitor declining the prompt and a wallet that rejects the params.
 */
export const addChainToWallet = async (): Promise<AddChainResult> =>
{
    const provider = injected();

    if (provider === undefined)
    {
        return 'no-provider';
    }

    try
    {
        await provider.request({ method: 'wallet_addEthereumChain', params: [ADD_CHAIN_PARAMS] });

        return 'added';
    }
    catch
    {
        return 'failed';
    }
};
