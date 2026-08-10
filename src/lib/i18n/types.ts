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
        explorer: string;
        social: string;
        download: string;
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
            validators: string;
        };
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
