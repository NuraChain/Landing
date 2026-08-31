// The wallets this site talks to, and deliberately no others.
//
// Discovery is EIP-6963 rather than `window.ethereum`, and that is not a modernisation - it is
// what makes a roster possible at all. The injected global carries no identity: two extensions
// installed side by side overwrite each other on it, and `isMetaMask` is set by half a dozen
// wallets that are not MetaMask. An announcement carries an `rdns`, so a wallet can be named.
//
// The roster is a GATE here, unlike the advisory lists most sites keep: a wallet that is not on
// it is not offered, because that is what this deployment asked for. The cost is real and worth
// writing down - someone whose only wallet is Rabby or OKX has to add the network by hand from
// the values in the chain card, and EIP-6963 exists precisely to end lists like this one.
// Widening it is one entry below and no change anywhere else.

/** The three, by the identity each announces itself under. */
export const METAMASK_RDNS = 'io.metamask';
export const TRUST_RDNS = 'com.trustwallet.app';

/**
 * Nura Wallet's identity, as the wallet ACTUALLY announces it: the string in its own
 * `src/core/dapp.script.ts`, and in the connector it ships to dApps.
 *
 * This was `io.nurawallet`, the Tauri BUNDLE identifier from `src-tauri/tauri.conf.json`, on the
 * assumption that an application announces itself under the name the operating system knows it
 * by. It does not, and nothing failed loudly: an announcement carrying the real rdns was dropped
 * by the roster gate below, so the wallet whose landing page this is was the one wallet the
 * picker could never detect. A wrong rdns has no symptom other than silence, which is why the
 * two names are written down here together.
 *
 * Its in-app browser injects a provider and announces it like any extension. An external
 * browser cannot be injected into at all, and there the request travels over `nurawallet://`
 * instead - see `lib/nura-link.ts`.
 */
export const NURA_RDNS = 'net.nurachain.wallet';

export interface WalletBrand
{
    /** EIP-6963 rdns - the identity a wallet announces itself under. */
    rdns: string;

    /**
     * What the picker prints. Taken from here and NOT from the announcement: the name is the one
     * thing in an announcement that a page renders as text, and it is written by the extension.
     */
    label: string;

    /** Where to get it, for a reader who does not have it. */
    install: string;
}

/** The roster, in the order the picker shows it. */
export const WALLET_BRANDS: WalletBrand[] = [
    {
        rdns: NURA_RDNS,
        label: 'Nura Wallet',
        install: 'https://github.com/NuraChain/Wallet/releases'
    },
    {
        rdns: METAMASK_RDNS,
        label: 'MetaMask',
        install: 'https://metamask.io/download/'
    },
    {
        rdns: TRUST_RDNS,
        label: 'Trust Wallet',
        install: 'https://trustwallet.com/browser-extension'
    }
];

export const brandFor = (rdns: string): WalletBrand | undefined =>
    WALLET_BRANDS.find((brand) => brand.rdns === rdns);

/**
 * Whether an announced icon is safe to put in an `<img src>`.
 *
 * EIP-6963 requires a data URI, and an extension is free to announce anything at all. An image
 * data URI cannot run script where an `http(s)` one would be a request to a third party made
 * from this page - so anything that is not one draws the neutral glyph instead.
 */
export const usableIcon = (icon: string | undefined): string | null =>
    typeof icon === 'string' && icon.startsWith('data:image/') ? icon : null;
