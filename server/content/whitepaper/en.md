Nura Chain is a public blockchain that runs the Ethereum Virtual Machine. It is identified by chain ID `1020`, seals a block every three seconds, prices transactions with the EIP-1559 fee market, and pays for computation in its native coin, NURA. Around the network sit a self-custody wallet, a block explorer, a swap and a bridge, all reachable today.

This document is the reference description of the network: what it is, how it works, what its coin is for and how the supply is divided, what exists around it, and what a reader can verify against the chain rather than take on trust. It is written for three readers at once - someone deciding whether to hold NURA, someone about to build on the network, and someone who simply wants to know what they are looking at.

## 1. Introduction

Most people meet a new blockchain through a wallet dialog asking for five values, and they paste those values without knowing what any of them mean. Nura Chain is built to be the opposite experience. Every figure this document states is either readable from the chain itself or clearly marked as a published claim, and the tooling around the network is the tooling the wider EVM ecosystem already uses.

The name covers one thing: the network. The products built on it - Nura Wallet, Nura Explorer, Nura Swap - are described in section 7 and are separate from the chain they serve. Any EVM wallet that accepts a custom network can use Nura Chain; the project's own wallet is one way in, not the only one.

## 2. Design principles

Four choices shape everything below.

- **Familiar execution.** The network runs the EVM unchanged, so contracts, libraries, keys and addresses carry over from Ethereum without modification. A developer's first day on Nura Chain is a configuration entry, not a rewrite.
- **Self-custody by default.** Nura Wallet never holds a key and cannot move a balance. The network has no account recovery, no freezing and no privileged spend path; whoever holds the key holds the coin.
- **Verifiable before trusted.** The chain ID, the block interval, the fee market and the identity of every block producer are readable over public RPC. Where a figure cannot be read from the chain - total supply is the important case - this document says so rather than implying otherwise.
- **A small surface, described honestly.** The network ships fewer pieces than a marketing page might list, and each of them is described here with its limits, including the uncomfortable ones.

## 3. The network

### 3.1 Execution: the Ethereum Virtual Machine

Nura Chain executes EVM bytecode. A contract compiled with Solidity or Vyper for the EVM runs here with the same semantics, the same instruction costs and the same 20-byte address space it would have on Ethereum. The node answers the standard Ethereum JSON-RPC interface, so ethers.js, viem, web3.py, wagmi, Hardhat and Foundry work against it with nothing more than an endpoint and a chain ID.

Compatibility is a statement about the execution layer only. An address controlled on Ethereum is controlled here, because it derives from the same secp256k1 key - but balances, deployed contracts and history are separate ledgers. Nothing sent to "the same address on another chain" moves between them. Section 9 returns to this because it is where most real losses come from.

### 3.2 Blocks, time and fees

The network seals one block every three seconds. The interval is fixed rather than a target: consecutive headers differ by exactly three seconds. The chain's first block carries a timestamp of 6 June 2026, 00:00 UTC.

Transactions are priced with the EIP-1559 fee market. Each block carries a base fee set by the protocol, and a sender adds a priority fee on top; the `baseFeePerGas` field in every header and the `eth_maxPriorityFeePerGas` and `eth_feeHistory` methods expose both. At the time of this revision the base fee sits at 1 gwei and the block gas limit is 150,000,000 gas. Both are values to read at runtime rather than to hard-code, which is what a library's fee estimation does by default.

Headers have the shape modern Ethereum clients produce: a `difficulty` of zero, an empty `nonce`, a zero `mixHash`, and the fields introduced by the Shanghai, Cancun and Prague upgrades - `withdrawalsRoot`, `parentBeaconBlockRoot`, `blobGasUsed` and `requestsHash`. Code that branches on a non-zero difficulty, or expects proof-of-work fields to mean anything, will misbehave here exactly as it does on Ethereum today.

### 3.3 Block production

Nura Chain does not use proof-of-work; the header fields above rule it out. Blocks are sealed by an authorised block producer on the fixed schedule described above. The account that sealed a block is recorded in its `miner` field, so the producer of any block is a public fact rather than a claim in a document.

As of this revision, every block sampled was sealed by the same producer account. The size of the producer set is a matter of how the network is operated, not of its execution layer, and this document does not fix it. Any change to it is announced through the project's channels listed in section 11.

The network exposes no separate finality signal over RPC. Inclusion in a sealed block is the confirmation that wallets and the explorer show, and because blocks arrive on a schedule, an included transaction is visible within one interval.

### 3.4 Identity of the network

These are the values a wallet or a client library asks for. They are the same values the site's chain card carries, and the same ones Nura Wallet stores.

- Network name: Nura Chain
- Chain ID: `1020`, which wallets want as the hex string `0x3fc`
- RPC endpoint: `https://rpc.nurachain.net`
- Block explorer: `https://explorer.nurachain.net`
- Native coin: Nura, ticker `NURA`, 18 decimals
- Block time: 3 seconds

The chain ID is more than a label. Under EIP-155 it is signed into every transaction, so a transaction signed for chain 1020 cannot be replayed on any other network, and a transaction signed for another network is rejected here. It is also the value to check before trusting any of the rest, including this page:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

The reply is `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. A wallet that supports EIP-3085 can be handed all of the values above in one request, which is what the "Add Nura Chain to wallet" control on the site does.

## 4. The native coin

NURA is the network's native coin. It pays for gas: every transaction consumes gas, gas is priced in NURA, and an account needs a balance before it can send anything at all, including its first contract deployment. That is the role ether plays on Ethereum, and the smallest unit is likewise one billionth of one billionth of a coin.

Because it is native rather than a contract, NURA has no token address. A page asking for "the NURA contract address" in order to add the coin is asking for something that does not exist; adding the network is what makes the balance appear. ERC-20 tokens exist on Nura Chain as ordinary contracts, and NURA is not one of them.

## 5. Supply and allocation

### 5.1 Total supply

The published total supply is 1,000,000,000 NURA - one billion.

This is a published figure, not a chain-readable one, and the distinction matters. An ERC-20 exposes `totalSupply()` because it is a contract keeping its own ledger; a native coin's issuance lives in the client's configuration and genesis state, and there is no `eth_totalSupply`. Any individual balance can be read with `eth_getBalance`; the total cannot.

A circulating supply is deliberately not stated in this revision. Circulating supply depends on which allocations count as unlocked at a given moment, and that is a judgement rather than a measurement unless every locked allocation sits at a published address that anyone can watch.

### 5.2 Allocation

The total is divided six ways. The percentages, the token counts they imply and the stated terms of each portion are:

- **Locked - 40%, 400,000,000 NURA.** Locked for one year. What happens to it is decided once that period ends, and any decision about this portion requires approval by a vote of at least 65% of the network.
- **Liquidity - 25%, 250,000,000 NURA.** Allocated over a one-year period to providing and managing liquidity, with the aim of workable trading liquidity and a steadier NURA ecosystem.
- **Community - 10%, 100,000,000 NURA.** Distributed to community members over one year, for people who help the network grow through activity, participation, development, referrals or other effective contribution rather than by paying. Allocation follows review and approval by the management board.
- **Public sale - 10%, 100,000,000 NURA.** Offered in a public sale priced at $24,000 in total, which works out at $0.00024 per NURA.
- **Treasury - 10%, 100,000,000 NURA.** Allocated over one year, under the oversight of the management board, to ecosystem development, infrastructure, products, partnerships and other needs of the project.
- **Airdrop - 5%, 50,000,000 NURA.** Distributed as an airdrop over one year. Recipients are identified through selected channels and communities, and the final allocation is confirmed by the management board.

Those six add to 100%. The public sale price is a fixed term of that sale, not a market quote, and it should not be read as a valuation of the coin.

### 5.3 Verifying a balance

Every balance on the network is public. Any address, including any address the project publishes for an allocation, can be read by anyone:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

The answer is in wei, hex-encoded; divide by 10^18 for NURA. The same figure is shown by Nura Explorer, and reading both is the habit this document recommends throughout.

## 6. Governance

Two governance rules are stated for the network at this revision, and both concern the allocation above rather than the protocol.

The locked 40% of supply cannot be released, repurposed or otherwise decided upon without approval by a vote of at least 65% of the network. That threshold is the one binding rule on the largest single portion of the supply.

The community, treasury and airdrop portions - 25% of supply between them - are allocated under the review and oversight of a management board, which confirms each distribution.

No other governance mechanism is claimed here. The protocol's own parameters - the block interval, the fee market, the producer set - are set by the network's operators, and this document does not describe an on-chain voting system for them because none is deployed.

## 7. The ecosystem

### 7.1 Nura Wallet

Nura Wallet is a self-custody wallet built for the network. Private keys are generated and kept on the device, and the wallet cannot spend a balance on its own. Its source and its releases are published on GitHub.

It is built as a native application rather than a browser extension. Builds are published for Android, both on Google Play and as a universal APK, for Windows as an x64 installer, and for Linux as an amd64 Debian package. iOS and macOS builds are not yet published. Every build and architecture is listed on the wallet's releases page.

Because it is an application, a web page has nothing to inject into outside the wallet's own in-app browser. The site therefore reaches it two ways: through the EIP-6963 provider announcement inside that browser, and everywhere else through a `nurawallet://` deep link that carries the request to the app and returns the answer to the page. Any other EVM wallet reaches the network through the ordinary EIP-3085 add-chain request.

### 7.2 Nura Explorer

Nura Explorer indexes blocks, transactions and transfers on the network. It is where a transaction is confirmed to have happened, where a contract's code and calls can be read, and where the block producer of section 3.3 can be seen on every block. It reads the same chain the RPC endpoint serves, which is why checking both is worth the ten seconds.

### 7.3 Nura Swap

Nura Swap is a swap interface for the network. Its pool quotes the price of NURA against a wrapped representation of the coin, and that quote is what the site shows as the NURA price.

The pool is small, so a single trade can move the quote sharply. It is a market quote from one pool, not an exchange listing, and this document does not state a price for that reason.

### 7.4 The bridge

A bridge mints representations of BNB and USDT on Nura Chain as ordinary ERC-20 contracts. Both are mint-and-burn tokens rather than vaults: a unit exists on Nura only because a unit was locked on the origin chain. Their contracts on Nura are:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

The value bridged onto the network is therefore each token's `totalSupply()`, which is how the site computes total value locked. That figure measures the claim minted on Nura; it equals the collateral only while the bridge is solvent and backed one to one. The custodian balance on the origin chain is the authoritative side, and it is the figure a careful reader checks.

## 8. Building on Nura Chain

Nothing in a Solidity toolchain is specific to this network. A deployment is a network entry with the RPC endpoint and chain ID from section 3.4, funded with enough NURA to pay gas. Three points of friction are worth knowing before the first deployment.

- Read the chain ID from the endpoint and compare it to the framework configuration. The two disagree more often than expected, usually because a configuration was copied from another project.
- Let the library estimate fees. The base fee and priority fee are readable at runtime, and a pinned gas price is the most common reason a transaction sits unmined.
- A contract deployed elsewhere is not deployed here. Redeploying assigns a new address unless a deterministic deployer is used deliberately, and any hard-coded dependency on another network's contracts or oracles must be revisited.

The RPC endpoint sends permissive CORS headers, so a page running in a browser can read from the chain directly without a server in between. The project's blog carries step-by-step guides for connecting, deploying a contract and issuing an ERC-20.

## 9. Security and risk

- **Self-custody is a responsibility.** There is no recovery path for a lost seed phrase, on this network or any other, and no party can reverse a transaction once it is sealed.
- **A wrong chain ID is how funds are lost.** Verify `1020` against the endpoint before storing the network in a wallet, and treat any page - including this one - as a claim to check.
- **Compatibility is not shared state.** Assets do not move between chains by being sent to the same address. Only the bridge in section 7.4 moves BNB or USDT onto the network, and only under the limits stated there.
- **The swap quote is thin.** A price read from one small pool is not a valuation, and it can be moved by a single trade.
- **The bridge carries custodial risk.** A minted representation is worth its collateral only while the origin-side custodian holds it one to one.
- **Some figures are published claims.** Total supply and the allocation terms in section 5 cannot be confirmed over RPC. Where the project publishes allocation addresses, their balances can be read with the call in section 5.3.
- **Block production is concentrated.** Section 3.3 states the observed producer set plainly so that a reader can weigh it now rather than discover it later.

## 10. Disclaimer

This document describes the network as it is at the stated revision. It is not an offer, a solicitation or investment advice, and nothing in it should be read as a promise about the future price, liquidity or availability of NURA. Figures marked as published claims are the project's statements; every other figure can be checked against the chain using the calls shown. Later revisions replace this one, and the revision number and date at the top of the document identify which one a reader holds.

## 11. References

- RPC endpoint: `https://rpc.nurachain.net`
- Block explorer: [Nura Explorer](https://explorer.nurachain.net)
- Swap: [Nura Swap](https://swap.nurachain.net/)
- Wallet releases: [Nura Wallet on GitHub](https://github.com/NuraChain/Wallet/releases)
- Source: [NuraChain on GitHub](https://github.com/NuraChain)
- Community: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Standards: [EIP-155](https://eips.ethereum.org/EIPS/eip-155) (replay protection), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) (fee market), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) (adding a chain to a wallet), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) (wallet discovery)
- Guides: [What Nura Chain is](/blog/what-is-nura-chain), [connecting to the RPC](/blog/connect-to-nura-chain-rpc), [adding the network to a wallet](/blog/add-nura-chain-to-your-wallet), [deploying a contract](/blog/deploy-a-smart-contract-on-nura-chain), [supply and allocation](/blog/nura-coin-tokenomics)
