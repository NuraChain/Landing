The last week of September 2026 carries a heavy cluster of scheduled token releases. Public unlock calendars have one project releasing 1.76 billion XPL on 25 September, with two others putting a further $26 million or so into circulation around the same window.

Unlock weeks come round constantly, and the reporting around them is usually a price prediction. The more useful thing is to understand what the event actually is.

## Total supply is not circulating supply

A token has a total supply, fixed by the contract. It has a circulating supply, which is total supply minus everything that cannot currently move: team allocations under vesting, investor tranches under a cliff, treasury held by a multisig, ecosystem funds behind a timelock.

An unlock does not create tokens. Nothing is minted. What changes is that a portion of what already existed becomes transferable. Total supply is flat across the event; circulating supply steps up.

That distinction matters because "fully diluted valuation" prices the first number and the market trades the second. A project whose circulating supply is 8% of total has 92% of its supply arriving on a schedule somebody wrote down.

## How schedules are usually built

- **A cliff.** Nothing for a fixed period, then a lump. This is the shape that produces a calendar event.
- **Linear vesting.** A continuous drip, often per block or per month, after any cliff has passed.
- **Milestone releases.** Tied to something happening, which means the date is an estimate rather than a fact.

The first is the one that gets written about, because it is the only one that looks like a date.

## What an unlock does and does not tell you

It tells you supply that can move now can move. It does not tell you that it will. Tokens released to a long-term treasury and tokens released to an early investor behave nothing alike, and the schedule alone does not distinguish them.

The questions worth asking are: who receives this tranche, what have previous recipients of the same tranche done, and is any of it already hedged or pre-sold off-chain. None of those are answered by the headline number.

## Verify it against the chain

A schedule is usually a contract, and a contract is readable.

- Find the vesting or timelock contract and look at its balance over time. A drop is a release, and the transaction shows where it went.
- Check whether the token contract can mint. A supply cap that lives only in a document is not a cap.
- Watch the recipient address afterwards, not just the unlock block. The interesting movement is the next hop.

[How to read the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) covers the mechanics of following a balance and a transfer, and the same method works on any EVM chain.

## Nura Coin's own numbers

Total supply is 1,000,000,000 NURA. How that is divided, what each portion is for and what is held back is set out in [Nura Coin supply and allocation](/blog/nura-coin-tokenomics), which is the page to read rather than this one for any figure specific to this network.

The general habit is the one worth keeping: read the schedule before you need it, check it against the contract, and treat any unlock article — including this one — as a prompt to go and look rather than a conclusion.
