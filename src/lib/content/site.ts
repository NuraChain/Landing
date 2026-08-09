/**
 * Every fact about Nura Chain that this site states, in one file.
 *
 * The point is that nothing below is scattered through markup: when the real tokenomics
 * and chain constants land, they land HERE and the whole site becomes correct in one
 * edit. Until then `PROVISIONAL` is true and the affected sections render a visible
 * warning, because a wrong chain ID or RPC endpoint is not a cosmetic bug - somebody
 * follows it and loses funds.
 *
 * Set `PROVISIONAL` to false only when every value marked below has been replaced with a
 * figure from the official announcement.
 */
export const PROVISIONAL = true;

export type PlatformId = 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'extension';

export interface Download
{
    id: PlatformId;
    /** Shown as-is; a product name, not translated copy. */
    label: string;
    /** Null renders a disabled "coming soon" control rather than a dead link. */
    url: string | null;
    /** Architecture or store note, e.g. "App Store" or ".deb". */
    note: string;
}

/** TODO(real-data): every url below except Android is still unconfirmed. */
export const DOWNLOADS: readonly Download[] =
[
    { id: 'ios', label: 'iOS', url: null, note: 'App Store' },
    {
        id: 'android',
        label: 'Android',
        url: 'https://play.google.com/store/apps/details?id=io.nurawallet.android',
        note: 'Google Play'
    },
    { id: 'windows', label: 'Windows', url: null, note: '.exe' },
    { id: 'macos', label: 'macOS', url: null, note: 'Apple silicon' },
    { id: 'linux', label: 'Linux', url: null, note: '.deb / .AppImage' },
    { id: 'extension', label: 'Browser', url: null, note: 'Chrome / Firefox' }
];

export interface ChainFact
{
    /** Key into `Strings['chain']`, so the label is translated and the value is not. */
    key: 'networkName' | 'chainId' | 'rpcUrl' | 'explorerUrl' | 'nativeToken' | 'blockTime';
    value: string;
    /** Whether a copy button is worth offering. Nobody copies a block time. */
    copyable: boolean;
    /**
     * Renders the value as a link as well as copyable text. Only for URLs a browser can
     * usefully open: the RPC endpoint answers POST from a wallet, so linking it would send
     * people to an error page and make them doubt a value that is actually correct.
     */
    link?: boolean;
}

/** TODO(real-data): placeholder values. A wrong chainId or rpcUrl is actively harmful. */
export const CHAIN: readonly ChainFact[] =
[
    { key: 'networkName', value: 'Nura Mainnet', copyable: false },
    { key: 'chainId', value: '1010', copyable: true },
    { key: 'rpcUrl', value: 'https://rpc.nurachain.net', copyable: true },
    { key: 'explorerUrl', value: 'https://explorer.nurachain.net', copyable: true, link: true },
    { key: 'nativeToken', value: 'Nora Coin', copyable: false },
    { key: 'blockTime', value: '3s', copyable: false }
];

export interface Allocation
{
    /**
     * Key into `Strings['tokenomics']['allocations']`, so the label translates and the
     * percentage does not. These are ordinary words, not proper nouns, which is why they
     * translate at all - unlike the chain facts above, which stay Latin in every locale
     * because they are values someone pastes into a wallet.
     */
    key: 'locked' | 'liquidity' | 'community' | 'publicSale' | 'treasury' | 'validators';
    percent: number;
}

/**
 * Must sum to 100.
 *
 * Order is load-bearing twice over: it is the order segments appear in the bar, and each
 * row draws the hue at its own index in `HUES` (tokenomics.section). So a row inserted in
 * the middle repaints every row after it, and the palette is validated on ADJACENT pairs -
 * reordering can put two similar hues side by side. Re-run the check if this list moves.
 */
export const ALLOCATIONS: readonly Allocation[] =
[
    { key: 'locked', percent: 40 },
    { key: 'liquidity', percent: 25 },
    { key: 'community', percent: 10 },
    { key: 'publicSale', percent: 10 },
    { key: 'treasury', percent: 10 },
    { key: 'validators', percent: 5 }
];

/**
 * Raw numbers, never pre-formatted strings, so each locale groups them its own way -
 * Persian renders its own digits and separators off the same value.
 *
 * TODO(real-data): `total` is still unconfirmed.
 */
export const SUPPLY =
{
    total: 1_000_000_000,
    circulating: 600_000_000
};

export type SocialId = 'github' | 'telegram' | 'x' | 'discord' | 'youtube';

export interface Social
{
    id: SocialId;
    label: string;
    url: string;
}

/** TODO(real-data): confirm every handle before launch. */
export const SOCIALS: readonly Social[] =
[
    { id: 'github', label: 'GitHub', url: 'https://github.com/NuraChain' },
    { id: 'telegram', label: 'Telegram', url: 'https://t.me/nurachain' },
    { id: 'x', label: 'X', url: 'https://x.com/nurachainnet' },
    { id: 'discord', label: 'Discord', url: 'https://discord.gg/8BMAXTdXQg' }
];

export const EXPLORER_URL = 'https://explorer.nurachain.net';
