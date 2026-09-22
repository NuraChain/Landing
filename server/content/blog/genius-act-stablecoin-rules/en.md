Stablecoins spent a decade as the most used thing in crypto and the least defined. That ended with the GENIUS Act, signed in July 2025 as the first US federal framework for payment stablecoins, and 2026 is the year the detail is being written: Treasury and the OCC put proposed rules out for comment, with the comment window on Treasury's illicit-finance rulemaking running to 19 October 2026.

The statute itself bites on 18 January 2027. From that date, issuing a payment stablecoin in the United States without a federal or state licence is prohibited.

## What the framework actually requires

Three things, in plain terms.

- **A licence.** Only a permitted payment stablecoin issuer may issue. That is a status you apply for, not a structure you assert.
- **Reserves you can point at.** A payment stablecoin is a claim redeemable at par, and the rules are about what stands behind that claim.
- **The compliance apparatus of a financial institution.** Issuers fall under the Bank Secrecy Act, with anti-money-laundering obligations and a sanctions compliance programme.

None of that is unusual for money transmission. What is new is that it applies to a token rather than to an account at a bank.

## What it does not do

It is a rulebook for issuers, not for the chains tokens move on, and not for the people holding them. It does not make a blockchain a regulated entity, and it does not reach every token that keeps a steady price — an algorithmic or yield-bearing design is a different question under a different heading.

It is also one jurisdiction. The EU's MiCA regime and Hong Kong's licensing scheme arrived on their own timetables and do not say the same things. A token that is compliant in one place is not thereby compliant everywhere.

## The part that matters if you hold one onchain

A wrapped stablecoin is not the issuer's token. When a bridge mints a representation of USDT on another network, what you hold is an ERC-20 contract whose value depends on the bridge continuing to honour it. The issuer's reserves back the original. Your claim is on the bridge.

That distinction is not changed by any of the above, and it is worth being concrete about it, because "USDT on chain X" reads like one asset and is really two.

- Check which contract address you actually hold, and who deployed it.
- Check how redemption works before you need it, not after.
- Treat a bridged balance as exposure to the bridge as well as to the issuer.

Nura Chain has wrapped representations of BNB and USDT, minted by its bridge as ordinary ERC-20 contracts — the same shape any token takes here, which [creating an ERC-20 token on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) describes. You can confirm any of it yourself on [the explorer](https://explorer.nurachain.net); [how to read the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) shows where to look.

None of this is legal advice. The proposals are public, the comment periods are real, and the dates above are the ones to check against the [US Treasury](https://home.treasury.gov) rather than against a blog post.
