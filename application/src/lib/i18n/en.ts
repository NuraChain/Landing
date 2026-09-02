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
        swap: 'Swap',
        explorer: 'Explorer',
        social: 'Community',
        download: 'Download',
        whitepaper: 'Whitepaper',
        language: 'Language',
        skipToContent: 'Skip to content',
        openMenu: 'Open menu',
        closeMenu: 'Close menu'
    },

    theme:
    {
        label: 'Theme',
        dark: 'Dark',
        light: 'Light'
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
        subtitle: 'Read live from the Nura RPC, explorer and swap, cached for one minute.',
        blockHeight: 'Block height',
        transactions: 'Total transactions',
        price: 'NURA price',
        priceNote: 'About this price',
        priceThin: 'Quoted by the Nura Swap pool. That pool is small, so a single trade can move this figure sharply — it is a market quote, not an exchange listing.',
        priceSource: 'Source',
        priceAsOf: 'Last read',
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
        failed: 'Could not add',
        pick: 'Choose a wallet',
        get: 'Get',
        detected: 'Detected',
        openApp: 'Open app',
        mismatch: 'Your wallet already holds this chain id under a different token. Remove it there, or use the values below.',
        unanswered: 'Nura Wallet did not answer. Install it on this device, then try again.'
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

    blog:
    {
        title: 'Blog',
        subtitle: 'Release notes, network updates, and what we are building.',
        all: 'Blog',
        empty: 'No posts yet',
        emptyHint: 'Announcements and release notes will appear here.',
        readMore: 'Read',
        published: 'Published',
        updated: 'Updated',
        everyTag: 'All',
        notFound: 'That post does not exist',
        notFoundHint: 'It may have been renamed. Everything we have published is on the blog.',
        loading: 'Loading',
        notTranslated: 'Not available in your language yet.',
        availableIn: 'Available in'
    },

    pagination:
    {
        label: 'Pagination',
        first: 'First page',
        previous: 'Previous page',
        next: 'Next page',
        last: 'Last page',
        page: 'Page'
    },

    toast:
    {
        dismiss: 'Dismiss',
        copyFailed: 'Could not copy. Select the value and copy it by hand.'
    },

    roadmap:
    {
        title: 'Roadmap',
        subtitle: 'What is built, what is being built, and what comes next.',
        status:
        {
            done: 'Done',
            now: 'In progress',
            next: 'Planned'
        },
        // Keyed by the ids in ROADMAP. Empty while ROADMAP is: a milestone added there
        // fails the build until its line exists in all ten tables.
        milestones: {}
    },

    whitepaper:
    {
        revision: 'Revision',
        download: 'Download the PDF',
        downloadHint: 'The full document, typeset for print, in the language you are reading.',
        failed: 'The whitepaper could not be loaded. Reload the page to try again.'
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
        tagline: 'An open, safe, secure and decentralized blockchain.',
        product: 'Product',
        resources: 'Resources',
        builtWith: 'Built with',
        rights: 'All rights reserved.'
    }
};
