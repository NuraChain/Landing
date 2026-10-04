On 7 September 2026 the Ethereum Foundation set a deadline: by December 2029, Ethereum's transactions, validators and data storage should all resist attack by a quantum computer. Ten days later a post-quantum roadmap for Bitcoin was in circulation with the same target year. Post-quantum cryptography has stopped being a research topic for blockchains and become a schedule.

## Key facts

- **Ethereum:** the Foundation's target is December 2029, with a reassessment by outside experts planned for January 2027.
- **Bitcoin:** a developer roadmap names the same date, built around BIP 360, which adds quantum-resistant ways to spend.
- **The exposure:** roughly 6.9 million BTC, about a third of supply, sits in addresses whose public key is already visible, by one research estimate.
- **Not just crypto:** Google, Cloudflare and Microsoft have migration targets in the same window.

## What would a quantum computer actually break?

Signatures, not blockchains.

Every account on Bitcoin, Ethereum and every EVM chain is controlled by an elliptic-curve key pair. Deriving the private key from the public one is infeasible for ordinary computers and, in principle, tractable for a large enough quantum one. Hashing is far less affected, which is why blocks, addresses and proof-of-work are not the urgent part.

That also explains the exposure figure. An address that has never spent reveals only a hash of its public key. One that has spent, or that uses a format which publishes the key outright, has shown the key itself — and that is what an attacker would need.

## Why 2029, if no such machine exists?

Because the migration takes longer than the warning will.

Nobody can say when a quantum computer capable of this will exist. The Foundation's own framing is that credible forecasts start around 2030, and that some researchers doubt it arrives at all. But replacing the signature scheme of a live network means new wallets, new hardware, new exchange infrastructure, and then waiting for millions of users to move their funds. That is years of work, and it has to finish before the threat is real rather than start then.

## Why is it hard?

Post-quantum signatures are larger and slower to verify than the ones in use now, and a blockchain stores every signature forever. Ethereum is working with hash-based schemes; the Foundation describes Hegotá, a fork planned for 2027, as "not the PQ fork" but "the fork that decides whether the PQ forks happen on time."

Bitcoin has a second problem, which is political. Coins in exposed addresses whose owners never migrate remain stealable. Whether to freeze them or leave them is a question about property, not cryptography, and it has no agreed answer.

## What should you do today?

Nothing dramatic, and two things worth making a habit.

- **Do not reuse addresses** where the system lets you avoid it. An unspent address has not shown its key.
- **Keep your wallet software current.** The migration will arrive as wallet updates, and the people at risk will be the ones who never installed them.

On EVM chains the path is likely to run through programmable accounts, where the rule that authorises a transaction is code rather than a fixed curve — the direction [EIP-7702 and smart accounts](/blog/eip-7702-smart-accounts) already points in. Nura Chain uses the same account model as every EVM network, so it faces the same question and will inherit the same tooling. It has announced no schedule of its own, and this page does not invent one.

Deadlines here are targets, not guarantees. The [Ethereum Foundation blog](https://blog.ethereum.org) and [NIST's post-quantum project](https://csrc.nist.gov/projects/post-quantum-cryptography) are the sources to follow.
