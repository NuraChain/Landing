Ethereum ships protocol upgrades on a roughly six-month cadence now, and Glamsterdam is the next one in line. It entered its final development stage in June 2026 and is expected to activate in the second half of the year. If you write Solidity or run a node, it is worth knowing what is in it before it lands.

## The two changes that matter

The headline items are block-level access lists and enshrined proposer-builder separation.

- **Block-level access lists** publish, up front, which accounts and storage slots a block will touch. A node that knows the list in advance can fetch that state in parallel and execute transactions that do not overlap at the same time, instead of strictly one after another.
- **Enshrined proposer-builder separation** writes the split between the validator that proposes a block and the builder that assembles it into the protocol itself, rather than leaving it to off-chain relays that everyone trusts and nobody is obliged to run.

Neither changes the bytecode your contracts compile to. Both change what a block can hold.

## This is really a story about the gas limit

Sequential execution is why the mainnet gas limit has stayed conservative: every node replays every transaction in order. Once a block declares its state accesses in advance, that replay stops being the bottleneck, and the ceiling can move. The figures under discussion run from roughly 60 million gas per block today toward something nearer 200 million.

More gas per block is more room for the same contracts, not different ones. It is a capacity change, not a language change.

## What you actually have to do

Very little, if you use ordinary tooling.

- Solidity, Hardhat and Foundry target the EVM, and these proposals do not change the opcode semantics you write against.
- Client libraries such as ethers.js and viem already build EIP-1559 transactions by default, which is the part of the fee market your users feel.
- If you run your own node or an indexer, read the release notes properly. Block structure is what changes, and block structure is what infrastructure parses.

## What it means on other EVM chains

EVM networks do not inherit upstream upgrades automatically. Each chain decides which EIPs to adopt and when. What they do inherit is the toolchain, and that is the part that makes a new network a configuration entry rather than a rewrite.

Nura Chain already prices transactions with an EIP-1559 base fee, the same way Ethereum has since London, so a library written in the last few years works against it unmodified. The mechanics are in [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility), and the endpoint itself in [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc).

Upgrade schedules move. Check [ethereum.org](https://ethereum.org) rather than this page before you plan around a date.
