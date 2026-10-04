South Korea has put a date on something most markets still describe as a trend. On 4 September 2026 the Financial Services Commission and the Financial Supervisory Service published a three-phase plan for tokenized securities, and the law behind it takes effect on 4 February 2027. From that day a token on a distributed ledger can be the legal record of who owns a security in Korea.

## Key facts

- **The date:** amendments to the Capital Markets Act and the Electronic Securities Act take effect on 4 February 2027.
- **Phase one:** institutional money market funds, bonds, unlisted shares and fractional investment securities.
- **Phase two:** every publicly offered security.
- **Phase three:** onchain settlement, with stablecoins as the payment leg.
- **Who can take part:** existing brokerages may handle tokenized securities without an additional licence.

## What does legal recognition actually change?

Until now a token representing a share was a pointer. The legal record of ownership sat in a conventional register, and the token was a claim on whoever kept that register in step. That is the structure [tokenized treasuries](/blog/tokenized-treasuries-rwa-2026) still use almost everywhere: the chain does the transfer, somebody else does the truth.

The Korean amendments collapse the two. A distributed ledger becomes an accepted way to keep the register itself, so the entry on the ledger is the ownership rather than evidence of it. That is a smaller sentence than it sounds and a larger change: disputes, insolvencies and inheritance are all decided by reference to the register.

## Why does it go in three phases?

Because each phase answers a different question.

Phase one asks whether the plumbing works, and it asks with instruments that institutions hold and the public rarely trades. Phase two depends on that going well, and it is the one that matters for size: listed shares and public bonds. Phase three changes how a trade settles. Today the security can be a token while the money still moves through a bank overnight. Settling the cash leg onchain, in a stablecoin, is what turns delivery and payment into a single step.

No dates have been published for phases two and three. The regulators said they would set that timetable alongside the subordinate rules.

## What does it mean if you build on an EVM chain?

Mechanically, less than the headlines suggest. A regulated security token is an ordinary token contract with rules about who may hold it — an allowlist checked on every transfer. That is the same shape as any ERC-20, which [creating an ERC-20 token on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) walks through.

What does not come with the contract is the permission. Korea is licensing who may issue, who may keep the register and who may broker, and it is doing so through firms that already hold securities licences. A chain is a place such a register could live. It is not a licence to keep one, and nothing in this roadmap names the networks that will be used.

## What should you watch next?

- **The subordinate rules,** which decide the technical requirements a ledger must meet.
- **The phase two date,** because public securities are where the volume is.
- **Which stablecoins qualify for settlement** in phase three, which the plan does not yet say.

This is one jurisdiction and a published plan, not a finished market. The primary source is the [Financial Services Commission](https://www.fsc.go.kr/eng/index); check dates there rather than here.
