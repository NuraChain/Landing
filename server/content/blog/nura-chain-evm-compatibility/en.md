"EVM-compatible" appears on the front page of almost every chain launched in the last five years, and it is used loosely enough to be worth pinning down. This is what it means on Nura Chain specifically, what you can verify for yourself, and what it does not give you.

## What the EVM actually is

The Ethereum Virtual Machine is a specification for a stack machine. It defines an instruction set, a gas cost for each instruction, a memory and storage model, and a set of precompiled contracts at fixed addresses.

Solidity and Vyper do not compile to "Ethereum". They compile to EVM bytecode. That separation is the entire reason chains can be compatible with one another at all: a contract is a blob of bytecode plus an ABI describing how to call it, and any machine implementing the same instruction set executes that blob the same way.

So "EVM-compatible" is a claim about the execution layer. It says nothing about consensus, validators, finality or governance, and a chain can be fully EVM-compatible while differing from Ethereum in every one of those.

## What Nura Chain implements

The network answers the standard Ethereum JSON-RPC interface, and you can establish that without installing anything.

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}'
```

The node identifies itself as a Go implementation, which is the lineage most EVM networks run — go-ethereum and the clients derived from it.

More is readable from a block header than from any marketing page. Ask for the latest one:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

The header that comes back carries `baseFeePerGas`, a `difficulty` of `0x0`, a zero `mixHash`, and a `withdrawalsRoot`. That is the shape modern Ethereum clients produce after the Merge and the London fee-market change, and two practical facts follow from it. Fees are EIP-1559 rather than a flat gas price, and proof-of-work fields such as `difficulty` carry no meaning here — code that branches on a non-zero difficulty will behave oddly, the same way it does on Ethereum today.

## Fees follow EIP-1559

Blocks carry a protocol-set base fee, and a sender adds a priority fee on top. Both the base fee and a suggested priority fee are readable:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_maxPriorityFeePerGas","params":[]}'
```

At the time of writing the base fee sits at 1 gwei and the block gas limit is 150,000,000. Both are values you should read at runtime rather than hard-code — that is what `eth_feeHistory` and a library's fee estimation are for, and a contract deployment script with a pinned `gasPrice` is the most common reason a transaction sits unmined.

Because the fee market is the standard one, `ethers`, `viem`, `web3.py` and every wallet built in the last few years construct type-2 transactions here without configuration. There is nothing Nura-specific to teach them.

## What compatibility does not give you

This is the part usually left out.

- It does not give you shared state. Your address exists on both networks because it derives from the same key, but balances, contract code and history are separate ledgers. An asset sent to "the same address on another chain" has not moved between them.
- It does not give you shared contracts. A contract deployed on Ethereum is not deployed here. You redeploy it, and it gets a different address unless you deliberately use a deterministic deployer.
- It does not give you Ethereum's security model or its validator set. Those are consensus properties, and EVM compatibility is a statement about execution.
- It does not guarantee identical gas costs forever. Chains adopt EVM upgrades on their own schedule, so a contract that is cheap on one may not be on another.

Treating the first of those as understood is where most real losses come from, and it is worth repeating for that reason alone.

## Checking any of this yourself

Every claim above is a single request away, which is the point. A chain that answers `eth_chainId`, `eth_getBlockByNumber` and `web3_clientVersion` honestly is a chain you can characterise in about a minute, without trusting a documentation page — including this one.

The habit worth forming: before deploying anything of value, read the chain ID from the endpoint you are about to use, and compare it to the one your framework config claims. They disagree more often than you would expect, usually because a config was copied from another project.

## Common questions

### Can I deploy an existing Solidity contract unchanged?

Usually yes, provided it does not depend on a specific chain ID, a hard-coded contract address on another network, or an oracle that does not exist here. Those three are the realistic sources of friction, not the bytecode.

### Which Solidity version should I target?

One whose EVM target the network supports. The safe approach is to compile for a well-established target rather than the newest available, and to test a deployment on a throwaway contract before committing a real one.

### Are gas costs the same as on Ethereum?

The instruction costs come from the EVM specification, so the shape is the same. What differs is the price of gas, which is set by this network's own fee market rather than Ethereum's.

## Where to go next

To start making calls, read [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc), which covers the endpoint, the client libraries and the errors worth recognising.

If you are still deciding whether an EVM chain is the right target at all, [why developers choose an EVM-compatible blockchain](/blog/why-build-on-an-evm-compatible-chain) takes that question head-on. And for a general description of the network, see [what Nura Chain is](/blog/what-is-nura-chain).

When you are ready to put something on chain, [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) is the next step.
