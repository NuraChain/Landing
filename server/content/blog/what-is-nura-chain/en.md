Nura Chain is a public blockchain that runs the Ethereum Virtual Machine. If you have written a Solidity contract, added a network to MetaMask, or called an Ethereum JSON-RPC endpoint, most of what you already know applies here unchanged: the same account model, the same transaction format, the same tooling.

This page is the plain description. What the network is, the values you need in order to talk to it, and what actually exists around it today.

## The network at a glance

These are the values a wallet or a client library asks for.

- Network name: Nura Mainnet
- Chain ID: `1020`, which wallets want as the hex string `0x3fc`
- RPC endpoint: `https://rpc.nurachain.net`
- Block explorer: `https://explorer.nurachain.net`
- Native coin: Nura Coin, ticker `NURA`, 18 decimals
- Block time: approximately 3 seconds

Do not take any of that on trust, including from this page. The endpoint will state its own chain ID if you ask it:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

The reply is `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`, and `0x3fc` is 1020 in decimal. Checking a chain ID this way takes ten seconds, and it is the single most useful habit to have before you paste a network into a wallet. A wrong chain ID is how people end up broadcasting to a network they did not mean to use.

## What EVM compatibility means in practice

The Ethereum Virtual Machine is the execution environment Ethereum defined for smart contracts. A chain that runs it executes the same compiled bytecode, answers the same JSON-RPC method names, and uses the same 20-byte address format.

For anyone building, that has three concrete consequences.

- Contracts compile with the toolchain you already have. Solidity, Hardhat and Foundry target the EVM rather than one specific network, so a new chain is a configuration entry rather than a rewrite.
- Client libraries work unmodified. ethers.js, viem, web3.py and wagmi all speak JSON-RPC, so pointing them somewhere new is a one-line change.
- Keys and addresses carry over. The same secp256k1 keys, the same derivation paths, the same checksummed addresses.

What it does not mean is that the two chains share anything. An address you control on Ethereum is an address you control here, because it is derived from the same key — but the balances, the deployed contracts and the history are entirely separate ledgers. Sending an asset to "the same address on another chain" does not move it between them.

Blocks here carry an EIP-1559 base fee, so transactions are priced the way they have been on Ethereum since London: a base fee the protocol sets per block, plus whatever priority fee you choose to add. Any library written in the last few years does this by default. There is more detail in [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility).

## What exists around the network today

Three things are live and reachable right now, and it is worth being precise about which.

- The RPC endpoint. `https://rpc.nurachain.net` answers standard Ethereum JSON-RPC, and sends permissive CORS headers, so a page running in a browser can read from it directly. This is covered in [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc).
- The block explorer. [Nura Explorer](https://explorer.nurachain.net) indexes blocks, transactions and transfers. It is where you confirm that something you sent actually happened, and it is described in [how to read the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer).
- Nura Wallet, a self-custody wallet with builds for Android, Windows and Linux. It is not the only way in — any EVM wallet that accepts a custom network will do, which is what [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) walks through.

There is also a bridge that mints wrapped representations of BNB and USDT on Nura as ordinary ERC-20 contracts, and a swap interface at `https://swap.nurachain.net`.

## The native coin

Nura Coin, ticker `NURA`, is the network's native asset, with 18 decimals — the EVM convention rather than a choice made here. It pays for gas exactly as ether does on Ethereum. Every transaction consumes gas, gas is priced in NURA, and an account needs a balance before it can send anything at all, including its first contract deployment.

Total supply is 1,000,000,000 NURA. How that is divided, and what each portion is for, is set out in [Nura Coin supply and allocation](/blog/nura-coin-tokenomics).

## Common questions

### Is Nura Chain a fork of Ethereum?

It runs the same virtual machine and answers the same RPC interface, which is what lets Ethereum tooling work against it unmodified. That is a statement about compatibility, not about shared history or shared state. The two networks keep separate ledgers.

### Can I use MetaMask?

Yes. Any wallet that supports adding a custom EVM network can be pointed at Nura Chain with the values above, and the step-by-step is in [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet).

### Do I need NURA before I can do anything?

To read the chain, no. The RPC endpoint answers read calls from anyone, which is why a block explorer can show you the whole network without an account. To send a transaction or deploy a contract, yes: gas is paid in NURA.

### How fast are blocks?

About three seconds apart, measured across recent blocks. That is the interval at which the chain produces blocks, which is not the same as a guarantee about when any particular transaction gets included.

## Where to go next

If you are here to use the network, start with [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet). It takes about a minute, and everything else depends on it.

If you are here to build, begin at [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc), then move on to [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
