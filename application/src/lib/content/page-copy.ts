// The title and description of the pages whose copy is not translated.
//
// These sit beside the other facts the site states rather than inside the pages, for one
// reason each:
//
//   - the HOME strings are also in `index.html`, which is what a reader with no JavaScript and
//     every path the site does not own is served, so a change made in one place and not the
//     other gives one page two descriptions depending on how it was reached. `tests/head.spec.ts`
//     pins the shell's copy against these;
//   - the ABOUT and BLOG strings describe a route, not a section, and a route's own component
//     is the wrong home for a string another file has to agree with.
//
// They are English-only, deliberately. Every other string on the site goes through `t()`, but a
// `<title>` is negotiated per request and these three pages' bodies are not translated yet (the
// about page is still the starter template and says so, behind `noindex`). When they are, these
// move into the string tables like everything else.

/** The home page's copy. Must stay in step with `index.html`. */
export const HOME_TITLE = 'Nura Chain — an open and decentralized blockchain';
export const HOME_DESCRIPTION
    = 'Nura Chain is an open and decentralized blockchain. Chain ID, RPC endpoint, block '
    + 'explorer, tokenomics, and the Nura Wallet for every device.';

/**
 * The about page's copy.
 *
 * Describes what the page will say rather than the scaffold it shows today, because it ships
 * behind `noindex` either way - and the day real copy lands, the only thing to remove is the
 * directive.
 */
export const ABOUT_TITLE = 'About — Nura Chain';
export const ABOUT_DESCRIPTION = 'About Nura Chain: what the network is, who builds it, and how to reach them.';

/** The blog index's own copy. Not a chain fact, so it lives with the markup that states it. */
export const BLOG_TITLE = 'Blog — Nura Chain';
export const BLOG_DESCRIPTION
    = 'Guides and technical writing on Nura Chain: the EVM network, its RPC endpoint, the block '
    + 'explorer, smart contract deployment and the tools developers build with.';
