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

    blog:
    {
        title: string;
        subtitle: string;
        /** The nav entry and the "back to the list" link. */
        all: string;
        empty: string;
        emptyHint: string;
        readMore: string;
        published: string;
        updated: string;
        /** Tag filter: the chip that clears it. */
        everyTag: string;
        notFound: string;
        notFoundHint: string;
        loading: string;
        /**
         * Shown on a post the reader's own language does not have yet.
         *
         * Deliberately says nothing about WHICH language they are reading: the languages the
         * post does hold are listed beside it as links, each named in its own language, which
         * a sentence cannot do for ten of them.
         */
        notTranslated: string;
        availableIn: string;
    };

    /**
     * The dashboard at /admin.
     *
     * Translated like everything else, and not because a stranger will read it: the operator
     * writes Persian posts, and a dashboard pinned to English would render a right-to-left
     * author an interface that mirrors nothing while the content beside it does.
     */
    admin:
    {
        title: string;
        signInHint: string;
        key: string;
        signIn: string;
        wrongKey: string;
        tooMany: string;
        signOut: string;
        posts: string;
        newPost: string;
        noPosts: string;
        noPostsHint: string;
        edit: string;
        remove: string;
        confirmRemove: string;
        languages: string;
        slug: string;
        status: string;
        draft: string;
        published: string;
        tags: string;
        tagsHint: string;
        coverImage: string;
        defaultLocale: string;
        translations: string;
        addLanguage: string;
        removeLanguage: string;
        postTitle: string;
        summary: string;
        body: string;
        bodyHint: string;
        save: string;
        saving: string;
        saved: string;
        back: string;
        slugTaken: string;
        failed: string;
        required: string;
        cannotRemoveDefault: string;
        /** Shown while the 12-hour session is inside its last hour. */
        expiring: string;
        cancel: string;
        /** The toast after a delete, as opposed to `remove`, which labels the button. */
        removed: string;
    };

    pagination:
    {
        /** Names the <nav>, so a screen reader can skip the whole control. */
        label: string;
        first: string;
        previous: string;
        next: string;
        last: string;
        /**
         * Prefixes a page number in a control's accessible name: "Page 3".
         *
         * The number is composed on at the call site rather than interpolated - these tables
         * are plain typed strings with no placeholder machinery, and the digits have to go
         * through Intl for the reader's own numerals anyway.
         */
        page: string;
    };

    toast:
    {
        dismiss: string;
        /** Raised when the clipboard refuses - the one copy outcome the button cannot show. */
        copyFailed: string;
    };

    /**
     * The roadmap. Milestone COPY is keyed by the ids in `ROADMAP` (lib/content/site.ts), the
     * same way the tokenomics allocations key theirs - so adding a milestone is a compile error
     * until all ten tables carry its line.
     */
    roadmap:
    {
        title: string;
        subtitle: string;
        status:
        {
            done: string;
            now: string;
            next: string;
        };
        milestones: Record<string, string>;
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
