/**
 * Every fact about Nura that this site states, in one file.
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

/** TODO(real-data): every url below is unconfirmed. */
export const DOWNLOADS: readonly Download[] =
[
    { id: 'ios', label: 'iOS', url: null, note: 'App Store' },
    { id: 'android', label: 'Android', url: null, note: 'APK / Play' },
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
}

/** TODO(real-data): placeholder values. A wrong chainId or rpcUrl is actively harmful. */
export const CHAIN: readonly ChainFact[] =
[
    { key: 'networkName', value: 'Nura Mainnet', copyable: false },
    { key: 'chainId', value: '0000', copyable: true },
    { key: 'rpcUrl', value: 'https://rpc.nura.invalid', copyable: true },
    { key: 'explorerUrl', value: 'https://explorer.nura.invalid', copyable: true },
    { key: 'nativeToken', value: 'NURA', copyable: false },
    { key: 'blockTime', value: '0.0s', copyable: false }
];

export interface Allocation
{
    /** Translation key under `Strings['tokenomics']` is not used here: these are proper nouns of the token plan and stay in English in both locales, matching how every chain publishes them. */
    label: string;
    percent: number;
    /** Drives the chart's colour ramp position, 0 to 1. */
    tone: number;
}

/** TODO(real-data): placeholder split. Must sum to 100. */
export const ALLOCATIONS: readonly Allocation[] =
[
    { label: 'Community', percent: 40, tone: 0 },
    { label: 'Ecosystem', percent: 20, tone: 0.2 },
    { label: 'Team', percent: 15, tone: 0.4 },
    { label: 'Treasury', percent: 15, tone: 0.6 },
    { label: 'Liquidity', percent: 10, tone: 0.8 }
];

/** TODO(real-data): placeholder supply figures. Raw numbers so each locale formats them. */
export const SUPPLY =
{
    total: 1_000_000_000,
    circulating: 0
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
    { id: 'github', label: 'GitHub', url: 'https://github.com' },
    { id: 'telegram', label: 'Telegram', url: 'https://telegram.org' },
    { id: 'x', label: 'X', url: 'https://x.com' },
    { id: 'discord', label: 'Discord', url: 'https://discord.com' }
];

export const EXPLORER_URL = 'https://explorer.nura.invalid';
