Real-world assets were a slide in a deck for years. In 2026 they are a number: roughly $37.9 billion of distributed asset value as of 6 August 2026, against about $4.1 billion in January 2025. Excluding stablecoins, the market grew around 30% in the first quarter of 2026 alone, to roughly $29 billion — a 263% increase year over year.

One asset class is most of it. Tokenized US Treasuries passed $10 billion in late February 2026 and $13.4 billion by early April, which is close to 45% of the total.

## What a tokenized treasury actually is

Strip the vocabulary away and the structure is ordinary.

- A fund or issuer holds the real instrument — short-dated government debt, custodied in the traditional system.
- A token is issued on chain that represents a share of that holding.
- Transfers of the token are recorded on chain, usually with a transfer restriction so only approved addresses can hold it.
- Redemption happens off chain, against the issuer, under the issuer's terms.

The chain is doing the register and the settlement. It is not doing the custody, and it is not doing the credit.

## Where the trust sits

This is the part worth being blunt about. A tokenized treasury is not trustless. The token is a claim on an issuer who holds an asset somewhere else. What the chain gives you is a transfer mechanism that settles in seconds and a register anybody can read; what it does not give you is any assurance about the thing being registered.

That is not a criticism, it is the design. But it means the questions that matter are the boring ones: who is the issuer, what is the redemption process, who is the custodian, and what happens if the issuer stops answering.

## Why institutions moved in 2026

The first quarter brought infrastructure commitments rather than pilots. Nasdaq, the NYSE and the DTCC all moved toward integrating tokenized securities into existing regulated market plumbing. BlackRock's BUIDL was already there; JPMorgan launched its own onchain yield fund in January 2026 with a hundred-million-dollar seed, and Goldman Sachs and BNY Mellon are competing for the same treasury-style mandate.

The market also stopped being one category. At least six now each exceed a billion dollars of onchain value, which is a different shape from a single product with a large number next to it.

## What it means for an ordinary EVM chain

Mechanically, very little is exotic. A restricted-transfer token is an ERC-20 with a check in `transfer`, and it deploys the way any contract deploys — see [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) and [creating an ERC-20 token](/blog/create-an-erc-20-token-on-nura-chain).

What is not ordinary is everything off the chain: the issuer, the custodian, the auditor, the legal wrapper and the jurisdiction. The token is the easy half. Anyone selling you the token as though it were the whole thing is selling you the easy half.

Figures above are third-party measurements as of the dates given, and they move fast — read them as a snapshot, not a constant.
