Every Ethereum node checks a block the same way today: it runs every transaction again and compares the result. EIP-8025 proposes a second way. A specialised prover runs the block once and produces a zkEVM proof that the execution was correct, and everyone else checks the proof, which is far cheaper than repeating the work. At the Ethereum Foundation's protocol AMA on 16 September 2026, researchers described zkEVM proving as nearing production, and the proposal is a candidate for the Hegotá fork.

## Key facts

- **The proposal:** EIP-8025, "Optional Execution Proofs", lets consensus nodes accept a block on the strength of zkEVM proofs sent over the peer-to-peer network.
- **Optional:** validators who do not opt in "see no change".
- **Speed:** the Foundation has reported that 99% of Ethereum blocks can be proven within 10 seconds on its target hardware. A block arrives every 12 seconds.
- **Timing:** ethereum.org lists Hegotá as an upgrade in planning, with the second quarter of 2027 as the expected period and no confirmed date.
- **Status:** proposed for inclusion in Hegotá, not scheduled.

## What is a zkEVM proof?

A short piece of data that convinces you a computation was done correctly, without you doing it.

The prover executes the block's transactions and records every step. From that record it builds a cryptographic proof. Checking the proof takes a fraction of the effort of the execution, and its cost barely grows with the size of the block. "Zero-knowledge" is the family of mathematics involved; nothing here is being hidden. The useful property is that verification is cheap.

## Why does Ethereum want this?

Because re-execution is what keeps blocks small.

If every node must replay every transaction in a few seconds on modest hardware, the amount of computation in a block is capped by the slowest machine you are unwilling to exclude. Replace replaying with verifying and that cap moves: as ethereum.org puts it, "when verification is cheap, the gas limit can safely increase." It is the same goal as the next fork's parallel execution, described in [Glamsterdam, explained](/blog/ethereum-glamsterdam-upgrade), reached by a different route.

It also lowers what it costs to run a validator, which matters for how many people can.

## What does "real-time" mean here?

Fast enough to keep up with the chain. A proof that arrives after the next block is no use for consensus, so the budget is the twelve seconds between blocks.

The average is not the hard part. EIP-8025's authors note that proving most blocks in seconds "is of limited value if an attacker can craft a block that takes minutes to prove." A network has to survive its worst block, not its typical one.

## What is still unsolved?

- **Correctness of the provers.** A bug in a proof system is a bug in consensus. Formal verification work this year established guarantees for parts of one prover's RISC-V implementation, and later testing still found an issue in it.
- **Who does the proving.** It needs serious hardware. If only a few operators can afford it, checking a block gets more decentralised while proving one gets less.
- **Diversity.** Ethereum relies on several independent clients so that one bug cannot fork the chain. The same has to be true of provers, and ethereum.org lists five in development.

This is why the first step is optional. Nodes that verify proofs run alongside nodes that re-execute, and the two check each other.

## Does anything change for contracts or other EVM chains?

For contracts, no. The proposal is explicit: "The EVM itself is not modified." Solidity compiles to the same bytecode and it does the same thing.

For other EVM networks, nothing is inherited automatically. Each chain decides how its own nodes validate blocks, and nothing here is a statement about Nura Chain's plans. What every EVM chain shares is the execution layer itself — the subject of [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility) — and anything built to prove EVM execution is built against that shared specification.

Timelines here are plans. The [Ethereum Foundation's zkEVM blog](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota) and [ethereum.org](https://ethereum.org/roadmap/zkevm/) carry the current ones.
