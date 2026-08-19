/**
 * The shape every locale must satisfy.
 *
 * Declaring it as a type rather than inferring it from English is the whole point: a key
 * added to `en` and forgotten in `fa` is a compile error, not a blank space on the page
 * that nobody notices until a Persian speaker opens the site.
 */
export interface Strings
{
    /** Language name in its OWN language, for the switcher. A Persian speaker looking for their language should not have to read English to find it. */
    languageName: string;

    /**
     * The project's own name, per locale. Translated because Persian renders it in Persian
     * script, so it cannot be a literal in the markup the way a wordmark usually is. Note
     * this covers the chain ALONE: the product names built on it ("Nura Wallet", "Nura
     * Explorer") are separate keys under their own sections and translate independently.
     */
    brand: string;

    nav:
    {
        tokenomics: string;
        chain: string;
        wallet: string;
        swap: string;
        explorer: string;
        social: string;
        download: string;
        /** The language picker: the trigger's accessible name and the modal's title. */
        language: string;
        skipToContent: string;
        openMenu: string;
        closeMenu: string;
    };

    theme:
    {
        label: string;
        dark: string;
        light: string;
        contrast: string;
    };

    hero:
    {
        headline: string;
        subhead: string;
        primaryCta: string;
        secondaryCta: string;
    };

    tokenomics:
    {
        title: string;
        subtitle: string;
        totalSupply: string;
        circulating: string;
        allocation: string;
        vesting: string;
        provisional: string;

        /**
         * One label per row of `ALLOCATIONS`, reached by that row's `key`. Nested rather
         * than flattened into this object so a new allocation can never collide with
         * `title` or `allocation` and silently render the wrong string.
         */
        allocations:
        {
            locked: string;
            liquidity: string;
            community: string;
            publicSale: string;
            treasury: string;
            airdrop: string;
        };

        /**
         * The long-form terms behind each slice, shown in the disclosure the legend's info
         * button opens. Every allocation now has one, but this stays a SEPARATE interface
         * from `allocations` rather than being merged into it: a row with no entry here
         * renders no button at all, which is what let `publicSale` ship silent while its
         * terms were unsettled instead of carrying invented copy.
         *
         * These are paragraphs, not labels - the reason the legend opens a panel instead of
         * floating a tooltip, which no viewport survives at this length.
         */
        notes:
        {
            locked: string;
            liquidity: string;
            community: string;
            publicSale: string;
            treasury: string;
            airdrop: string;
        };

        /** Accessible name for the per-row info button; the row's own label follows it. */
        moreAbout: string;
    };

    /**
     * The live-figures section. `transactions` is the chain-wide total from the explorer's
     * index, not a per-block count - so it must not be worded as "recent" or "current" in
     * any locale.
     */
    network:
    {
        title: string;
        subtitle: string;
        blockHeight: string;
        transactions: string;
        /** Value bridged onto Nura, in USD. Bridged assets - never the coin's own price. */
        tvl: string;
        /** Labels the explorer link in the TVL breakdown: whose balance these amounts are. */
        holder: string;
        /** Accessible name for the button that opens the TVL breakdown. */
        breakdown: string;
        /** Shown only when nothing has loaded at all, never over stale-but-real figures. */
        unavailable: string;
    };

    chain:
    {
        title: string;
        subtitle: string;
        networkName: string;
        chainId: string;
        rpcUrl: string;
        explorerUrl: string;
        nativeToken: string;
        blockTime: string;
        copy: string;
        copied: string;
        provisional: string;
    };

    /**
     * The one-click alternative to the manual chain card: a button that asks the visitor's
     * wallet extension to add Nura Chain (EIP-3085). `done` and `failed` swap in as the
     * label briefly, so all three must stay short enough to live inside a button.
     */
    addChain:
    {
        cta: string;
        done: string;
        failed: string;
    };

    wallet:
    {
        title: string;
        subtitle: string;
        platforms: string;
        comingSoon: string;
        allDownloads: string;
        features:
        {
            selfCustody: string;
            selfCustodyBody: string;
            speed: string;
            speedBody: string;
            openSource: string;
            openSourceBody: string;
        };
    };

    explorer:
    {
        title: string;
        subtitle: string;
        cta: string;
    };

    social:
    {
        title: string;
        subtitle: string;
    };

    footer:
    {
        tagline: string;
        product: string;
        resources: string;
        builtWith: string;
        rights: string;
    };
}
