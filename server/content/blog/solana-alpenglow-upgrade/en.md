Alpenglow, the most substantial change to Solana's consensus so far, went live on Solana's testnet on 22 September 2026. It did not go live on mainnet on 28 September, despite a week of headlines saying it would. The upgrade replaces how validators vote and how blocks spread, and it targets finality of roughly 100 to 150 milliseconds, against about 12.8 seconds today.

## Key facts

- **What it is:** a new consensus design, proposed as SIMD-0326, replacing TowerBFT.
- **Two parts:** Votor handles voting and finality; Rotor handles how blocks are propagated.
- **Status:** on testnet since 22 September 2026. Not on mainnet.
- **The date confusion:** 28 September was when the client's developers resumed activating features on mainnet in general, not an Alpenglow launch.
- **Next window:** a mainnet activation window opens on 9 November 2026. That is a window, not a commitment.

## What is finality, and why does 150 ms matter?

Finality is the point after which a transaction cannot be undone.

It is different from a block being produced. A block can appear in under a second and still be provisional; an exchange crediting a deposit or a merchant releasing goods waits for finality, not for inclusion. Twelve seconds is fast for a blockchain and slow for a checkout. A tenth of a second is in the range where a person does not perceive waiting at all.

## How does Alpenglow get there?

By taking votes off the chain.

Today Solana validators vote by sending transactions, which are processed like any others and paid for like any others. Alpenglow has validators exchange votes directly and record a compact certificate once enough stake has agreed. A block that gathers a large enough share of stake in the first round is final immediately; otherwise a second round completes it.

A side effect is economic. Validators currently pay fees on every vote, a fixed cost that weighs most on small operators. Removing vote transactions removes that cost.

## Why did everyone think it launched?

Because a schedule entry was read as an announcement. The validator client's release plan listed 28 September as the day feature activation would resume on mainnet. Alpenglow was the feature people were waiting for, so the two were joined. The developers said plainly that it was not happening that day.

The lesson travels well beyond Solana: upgrade dates in this industry are targets until the block they activate in has been produced. The same caution applies to Ethereum's next fork, as [Glamsterdam, explained](/blog/ethereum-glamsterdam-upgrade) notes.

## Does this affect EVM chains?

Not directly. Solana is not an EVM network; its programs, accounts and tooling are separate, and nothing in Alpenglow ports across.

The comparison is still useful, because it shows what "fast" means. Block time and finality are different numbers, and a chain's headline figure is usually the first. Nura Chain produces a block about every three seconds — that is its block time, stated in [what Nura Chain is](/blog/what-is-nura-chain) — and why EVM compatibility says nothing about consensus is covered in [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility). When you compare networks, ask which of the two numbers you are being shown.

Dates above are as published by the client's developers and can move; [Anza](https://www.anza.xyz) maintains the release schedule.
