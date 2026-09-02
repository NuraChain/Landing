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
        /** The whitepaper route - a nav entry, and the eyebrow label above the document's title. */
        whitepaper: string;
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
        /** The coin's own price, quoted by the swap's pool. Not to be confused with `tvl`. */
        price: string;
        /** Accessible name for the button that opens the price note. */
        priceNote: string;
        /**
         * The caveat the price note leads with: the pool behind the quote is small enough
         * that one trade moves it. Not a disclaimer to be trimmed for length - it is the
         * reason showing the figure at all is defensible.
         */
        priceThin: string;
        /** Labels the link to the swap in the price note: where the figure was read. */
        priceSource: string;
        /** Labels the time in the price note. The server may serve a reading minutes old. */
        priceAsOf: string;
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
        /** Reported when nothing on the machine can be asked - the manual card is the fallback. */
        /** The picker's title: which of the roster wallets to ask. */
        pick: string;
        /** Trailing hint on a wallet that is not installed - the row is a link to it. */
        get: string;
        /** Trailing hint on a wallet that announced itself. */
        detected: string;
        /**
         * Trailing hint on Nura Wallet, which is an application rather than an extension: the
         * row is a button whether or not anything announced, because the request leaves over
         * `nurawallet://` and opens the app.
         */
        openApp: string;
        /** The wallet holds this chain id under another ticker - a thing the reader can fix. */
        mismatch: string;
        /** The deep link went out and nothing came back - the app is most likely not installed. */
        unanswered: string;
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

    /**
     * The whitepaper page's own chrome. The document itself is content, served from
     * `server/content/whitepaper/` in the reader's language, so nothing of its text lives here -
     * only the labels around it and the download control.
     */
    whitepaper:
    {
        /** Prefixes the revision number: "Revision 1.0". */
        revision: string;
        /** The download control's label, top and bottom of the page. */
        download: string;
        /** Under the heading of the download panel at the foot of the document. */
        downloadHint: string;
        /** Raised when the document could not be fetched at all. */
        failed: string;
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
