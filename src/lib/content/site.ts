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

export type PlatformId = 'ios' | 'android' | 'apk' | 'windows' | 'macos' | 'linux';

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

/** Every build, and the page people land on when they want one this list does not cover. */
export const RELEASES_URL = 'https://github.com/NuraChain/Wallet/releases';

/**
 * Desktop and mobile builds link through `/releases/latest/download/<asset>`, GitHub's
 * redirect to whatever the newest release calls that file. Pinning `/download/v1.0.10/`
 * instead would freeze this page at one version and quietly serve a stale wallet after the
 * next tag - the worst kind of stale, because nothing here would look broken.
 *
 * This only works while asset names stay version-free, which is what v1.0.10 changed (its
 * predecessors embedded `1.0.8` in every filename). A release that reverts to versioned
 * names breaks all six links at once, so keep the naming and these strings in step.
 *
 * One build per platform, the mainstream architecture. Every other arch and format - arm64,
 * .rpm, .AppImage, the split APKs - lives behind the releases link rather than in a matrix
 * nobody reads.
 *
 * TODO(real-data): iOS and macOS have no published build yet.
 */
const LATEST = `${ RELEASES_URL }/latest/download`;

export const DOWNLOADS: readonly Download[] =
[
    { id: 'ios', label: 'iOS', url: null, note: 'App Store' },
    {
        id: 'android',
        label: 'Android',
        url: 'https://play.google.com/store/apps/details?id=io.nurawallet.android',
        note: 'Google Play'
    },
    { id: 'windows', label: 'Windows', url: `${ LATEST }/Nura-Wallet-Windows-x64-setup.exe`, note: '.exe · x64' },
    { id: 'macos', label: 'macOS', url: null, note: 'Apple silicon' },
    { id: 'linux', label: 'Linux', url: `${ LATEST }/Nura-Wallet-Linux-amd64.deb`, note: '.deb · x64' },
    {
        id: 'apk',
        label: 'Android APK',
        url: `${ LATEST }/Nura-Wallet-Android-universal.apk`,
        note: '.apk · universal'
    }
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
export const NETWORK_NAME = 'Nura Mainnet';
export const CHAIN_ID = 1020;
export const RPC_URL = 'https://rpc.nurachain.net';
export const EXPLORER_URL = 'https://explorer.nurachain.net';
export const NATIVE_TOKEN = 'Nura Coin';

/** TODO(real-data): ticker, as unconfirmed as the rest. Wallets show it next to balances. */
export const NATIVE_TOKEN_SYMBOL = 'NURA';

export const CHAIN: readonly ChainFact[] =
[
    { key: 'networkName', value: NETWORK_NAME, copyable: false },
    { key: 'chainId', value: String(CHAIN_ID), copyable: true },
    { key: 'rpcUrl', value: RPC_URL, copyable: true },
    { key: 'explorerUrl', value: EXPLORER_URL, copyable: true, link: true },
    { key: 'nativeToken', value: NATIVE_TOKEN, copyable: false },
    { key: 'blockTime', value: '3s', copyable: false }
];

/**
 * The EIP-3085 `wallet_addEthereumChain` request, built from the same constants the manual
 * card renders so the one-click path and the copy-paste path can never disagree. Wallets
 * insist on the hex form of the id; 18 decimals is the EVM convention.
 */
export const ADD_CHAIN_PARAMS =
{
    chainId: `0x${ CHAIN_ID.toString(16) }`,
    chainName: NETWORK_NAME,
    nativeCurrency: { name: NATIVE_TOKEN, symbol: NATIVE_TOKEN_SYMBOL, decimals: 18 },
    rpcUrls: [RPC_URL],
    blockExplorerUrls: [EXPLORER_URL]
} as const;

export interface Allocation
{
    /**
     * Key into `Strings['tokenomics']['allocations']`, so the label translates and the
     * percentage does not. These are ordinary words, not proper nouns, which is why they
     * translate at all - unlike the chain facts above, which stay Latin in every locale
     * because they are values someone pastes into a wallet.
     */
    key: 'locked' | 'liquidity' | 'community' | 'publicSale' | 'treasury' | 'airdrop';
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
    { key: 'airdrop', percent: 5 }
];

export interface BridgeToken
{
    /** The on-chain symbol. A ticker, not translated copy. */
    symbol: string;
    /** The ERC-20 on Nura that represents the bridged asset. */
    address: string;
    /** CoinGecko id, used to price a unit of it in USD. */
    priceId: string;
}

/**
 * The bridged assets whose value makes up TVL.
 *
 * Both are mint-and-burn ERC-20s on Nura, NOT vaults - they carry no `getBalance`, and
 * their own token balances are zero. So the figure that means "value bridged in" is
 * `totalSupply()`: a unit exists here only because a unit was locked on the origin chain,
 * which is the same way bridged TVL is counted elsewhere. `balanceOf(token)` would instead
 * count assets mistakenly sent to the contract itself, which is not TVL by any reading.
 *
 * The caveat that survives that reasoning: this measures the CLAIM minted on Nura, which
 * equals the collateral only while the bridge is solvent and 1:1. The custodian balance on
 * BNB Chain and Ethereum is the authoritative side, and this page cannot see it.
 *
 * Decimals are read on-chain rather than listed here, so a redeploy cannot silently move
 * the decimal point on a dollar figure.
 */
export const BRIDGE_TOKENS: readonly BridgeToken[] =
[
    { symbol: 'BNB', address: '0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc', priceId: 'binancecoin' },
    { symbol: 'USDT', address: '0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC', priceId: 'tether' }
];

/**
 * The account holding every bridged token counted in TVL, linked from the breakdown so the
 * figure is checkable rather than asserted.
 *
 * It is a NURA address, and the link points at the Nura explorer. Checked on 2026-08-14,
 * the same address on BNB Chain and on Ethereum has a zero balance, a zero nonce and no
 * code - it has never been used on either - so a BscScan link would send a visitor to an
 * empty page and read as an unbacked bridge. The custodian holding the origin-side
 * collateral is a different address, and this file does not know it yet.
 *
 * TODO(real-data): add the BNB Chain custodian once known; the origin side is what proves
 * the minted claim is backed, and only that address can show it.
 */
export const BRIDGE_HOLDER = '0x4ac0d9300422b408bA2AbF47995C87cF32763712';

/**
 * The same address on BNB Chain, for the BNB side of the bridge.
 *
 * Checked twice, 2026-08-14 and 2026-08-15: zero native balance, zero BEP-20 USDT, zero
 * nonce and no code, so as of writing this link opens an account BNB Chain has never seen
 * used. It ships because it was asked for; if the origin-side custodian turns out to be a
 * different address, this is the one line to change and the breakdown picks it up.
 */
export const BRIDGE_HOLDER_BSC_URL = `https://bscscan.com/address/${ BRIDGE_HOLDER }`;

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
