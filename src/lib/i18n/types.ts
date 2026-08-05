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
        downloadFor: string;
        otherPlatforms: string;
        comingSoon: string;
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
        legal: string;
        privacy: string;
        terms: string;
        builtWith: string;
        rights: string;
    };
}
