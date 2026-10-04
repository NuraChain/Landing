Bitcoin's last protocol upgrade was Taproot, in November 2021. Nothing has activated since. The leading candidates for the next one are Bitcoin covenants — rules that restrict how a coin can be spent in future — in two competing forms, OP_CAT and OP_CTV. On 1 October 2026 Adam Back, Blockstream's chief executive, endorsed covenant opcodes as a possible "last soft-fork". The proposals are mature. The process for adopting one is the part that is stuck.

## Key facts

- **Last soft fork:** Taproot, November 2021.
- **OP_CAT (BIP 347):** joins two pieces of data in a script. Its specification was marked complete in March 2026 and it has been tested on signet.
- **OP_CTV (BIP 119):** commits a coin to a predefined spending template.
- **Neither is active** on Bitcoin mainnet.
- **A recent failure:** BIP 110, a proposal to limit arbitrary data in transactions for a year, drew about 2.5% of miner support against the 55% it needed, and its enforcing branch stalled after two blocks in August 2026.

## What is a covenant?

A condition that travels with the coin.

A Bitcoin script today decides who may spend a coin. It cannot say anything about where the coin goes next. A covenant can: "this coin may only be sent to one of these addresses", or "this coin can be moved only after a delay, and during the delay the owner can cancel".

That second example is a vault. If a thief takes your key, the withdrawal is announced onchain and waits; you see it and pull the funds back with a recovery key. It is the most cited use for covenants because it addresses theft, which is the thing Bitcoin holders actually fear.

## How do OP_CAT and CTV differ?

In how much they allow.

- **CTV is narrow.** It fixes, in advance, the exact shape of the transaction that may spend a coin. It is easy to reason about and limited to what was planned.
- **OP_CAT is general.** Concatenating data sounds trivial, but combined with existing opcodes it lets a script inspect the transaction spending it, and from that a great deal can be built.

The argument between them is the old one about tools. A narrow tool is safer to approve and may need replacing. A general one may be the last change needed, and is harder to bound. Back's case is for the second: "build a general toolkit once, verify it rigorously, and let future innovation happen on top of it."

## Why does nothing activate?

Because Bitcoin has no decision procedure, by design.

There is no foundation that schedules forks and no vote that binds anyone. A soft fork needs developers to merge it, miners to signal for it, and node operators to run it, and any of those groups can simply not. Since Taproot there has been no agreement even on how an upgrade should be activated.

BIP 110 showed what happens when a proposal goes ahead without that agreement. It did not change Bitcoin. It produced a branch that two blocks later was nobody's.

Whether this is a flaw depends on what you want. A network that is nearly impossible to change is also nearly impossible to change for the worse.

## How is this different on an EVM chain?

Everything a covenant does is ordinary there. A contract can hold funds and enforce any rule about where they go: time locks, allowlists, vaults, spending limits. Nothing needs a protocol change, because the rules live in the contract and not in the chain's consensus — [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) shows how little ceremony that takes, and [EIP-7702 and smart accounts](/blog/eip-7702-smart-accounts) covers the wallet version of the same idea.

The cost is the mirror image. More expressive contracts mean more ways to be wrong, and an EVM chain's upgrades are decided by a smaller group than Bitcoin's. Bitcoin's caution and the EVM's flexibility are the same trade made in opposite directions.

Proposal texts live in the [Bitcoin BIPs repository](https://github.com/bitcoin/bips); status there is authoritative, and commentary, including this, is not.
