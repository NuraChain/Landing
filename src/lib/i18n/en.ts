import type { Strings } from './types';

export const en: Strings =
{
    languageName: 'English',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Tokenomics',
        chain: 'Chain',
        wallet: 'Wallet',
        explorer: 'Explorer',
        social: 'Community',
        download: 'Download',
        language: 'Language',
        skipToContent: 'Skip to content',
        openMenu: 'Open menu',
        closeMenu: 'Close menu'
    },

    theme:
    {
        label: 'Theme',
        dark: 'Dark',
        light: 'Light',
        contrast: 'High contrast'
    },

    hero:
    {
        headline: 'Your keys. Your coins. Your call.',
        subhead: 'Nura Wallet keeps your assets in your hands, not on someone else\'s server. Fast, open, and built for people who read the fine print.',
        primaryCta: 'Download Nura Wallet',
        secondaryCta: 'Explore the chain'
    },

    tokenomics:
    {
        title: 'Tokenomics',
        subtitle: 'Where every token goes, and when it unlocks.',
        totalSupply: 'Total supply',
        circulating: 'Circulating',
        allocation: 'Allocation',
        vesting: 'Vesting schedule',
        provisional: 'Provisional figures, pending final publication.',

        allocations:
        {
            locked: 'Locked',
            liquidity: 'Liquidity',
            community: 'Community',
            publicSale: 'Public sale',
            treasury: 'Treasury',
            airdrop: 'Airdrop'
        },

        notes:
        {
            locked: 'The remaining 40% of total supply will be locked for one year. What happens to it will be decided once that period ends, and any decision about this 40% must be approved by a vote of at least 65% of the network.',
            liquidity: '25% of total supply will be allocated over a one-year period to providing and managing liquidity. The aim is workable liquidity for trading and a steadier NURA ecosystem.',
            community: '10% of total supply will go to community members over one year. It is meant for people who pay nothing directly and help NURA grow through activity, participation, development, referrals, or other effective contributions. Allocation follows review and approval by the management board.',
            publicSale: '10% of total supply is offered in a public sale priced at $24,000 in total. That share holds 100,000,000 tokens, which works out at $0.00024 per NURA.',
            treasury: '10% of total supply will go to the NURA treasury. Over a one-year period, under the oversight of the management board, it funds ecosystem development, infrastructure, products, partnerships, and other project needs.',
            airdrop: '5% of total NURA supply will be distributed as an airdrop over a one-year period. Recipients will be identified through selected channels and communities, and the final allocation is confirmed by the management board.'
        },

        moreAbout: 'More about'
    },

    network:
    {
        title: 'Network activity',
        subtitle: 'Read live from the Nura RPC and explorer, cached for one minute.',
        blockHeight: 'Block height',
        transactions: 'Total transactions',
        tvl: 'Total value locked',
        holder: 'Held by',
        breakdown: 'What makes up this figure',
        unavailable: 'A figure could not be loaded. It returns as soon as its source answers.'
    },

    chain:
    {
        title: 'Chain information',
        subtitle: 'Everything you need to add Nura Chain to your wallet by hand.',
        networkName: 'Network name',
        chainId: 'Chain ID',
        rpcUrl: 'RPC endpoint',
        explorerUrl: 'Block explorer',
        nativeToken: 'Native token',
        blockTime: 'Block time',
        copy: 'Copy',
        copied: 'Copied',
        provisional: 'Provisional values. Verify against the official announcement before sending funds.'
    },

    addChain:
    {
        cta: 'Add Nura Chain to wallet',
        done: 'Added to your wallet',
        failed: 'Could not add'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'One wallet, every device you own.',
        platforms: 'Platforms',
        comingSoon: 'Coming soon',
        allDownloads: 'All builds and architectures on GitHub',
        features:
        {
            selfCustody: 'Self custody',
            selfCustodyBody: 'Your private keys never leave your device. We could not spend your funds if we wanted to.',
            speed: 'Built for speed',
            speedBody: 'Sign and broadcast in a tap. No spinner, no waiting on a middleman.',
            openSource: 'Open source',
            openSourceBody: 'Read the code that holds your money. Every release is reproducible and signed.'
        }
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Follow any block, transaction, or address on the network.',
        cta: 'Open the explorer'
    },

    social:
    {
        title: 'Join the community',
        subtitle: 'Ship notes, roadmap arguments, and support, in the open.'
    },

    footer:
    {
        tagline: 'A self custody wallet for Nura Chain.',
        product: 'Product',
        resources: 'Resources',
        builtWith: 'Built with',
        rights: 'All rights reserved.'
    }
};
