A block explorer is how you check that something you did actually happened. Not what a wallet claims, not what a script printed — what the chain recorded. This covers reading [Nura Explorer](https://explorer.nurachain.net), and the habit that matters most: not trusting it blindly either.

## What an explorer actually is

It is a reader, not an authority. An explorer runs a node, watches every block, and stores what it sees in a database it can search — blocks, transactions and transfers, indexed so a human can look things up by hash or address.

That distinction matters. The explorer does not decide anything. If it disagrees with the chain, the chain is right and the explorer is behind or broken. Everything it shows you is available directly from the RPC endpoint, which is what the last section is about.

## Finding a transaction

Every transaction has a hash — a 66-character string starting `0x`. Your wallet shows it after sending; a deploy script prints it. Paste it into the explorer's search.

If nothing comes back, there are three ordinary explanations before you assume something is lost:

- The transaction is still pending and has not been included in a block yet.
- The explorer has not indexed the block containing it yet.
- It was broadcast to a different network. This is by far the most common, and it is why chain ID checks matter.

## Reading a transaction

The fields worth understanding:

- **Status.** Success or failed. A failed transaction still happened, still occupies a block, and still cost gas. "Failed" does not mean "did not happen" — it means the code reverted after the fee was spent.
- **Block.** Which block included it, and how many blocks have been built on top since. More blocks on top means more settled.
- **From / To.** The sender, and either a recipient or a contract. On a deployment, `To` is empty and the created contract appears separately.
- **Value.** How much NURA moved as the native asset. A token transfer usually shows `0` here, because the tokens moved inside the contract rather than as native value. That surprises people constantly.
- **Gas used and fee.** What it actually cost, which is usually less than the limit that was set.
- **Nonce.** The sender's transaction counter. Gaps in it are why a stuck transaction blocks everything behind it from the same account.

## Reading an address

Two kinds exist, and the explorer distinguishes them.

An externally owned account is controlled by a private key. It has a balance and a transaction history, and nothing else.

A contract address has code. If you deployed something and the explorer shows no code, the deployment did not succeed regardless of what your script reported — see [deploying a smart contract](/blog/deploy-a-smart-contract-on-nura-chain).

For a token contract, the interesting part is the transfer history, because that is the `Transfer` event log rather than a balance table. It is the same data any wallet uses to show you a token balance.

## Reading a block

A block page shows the height, the timestamp, the transactions included, the gas used against the limit, and the base fee at that moment.

Blocks on Nura Chain arrive roughly every three seconds. Gas used well below the limit means there is room — a transaction that is not being included is being priced out rather than crowded out, which points at the fee rather than at congestion.

## Cross-checking against the RPC

This is the section worth keeping. Any figure the explorer shows can be asked of the chain directly:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xYourTxHash"]}'
```

The receipt carries `status` — `0x1` for success, `0x0` for a revert — plus the block number, gas used and the event logs. That is the authoritative answer.

Likewise for a contract:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xTheContract","latest"]}'
```

If the explorer and the endpoint ever disagree, believe the endpoint. More useful still: when you are about to act on something valuable, check both. Two independent readers agreeing is a much stronger signal than one confident interface. The mechanics are in [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc).

## What an explorer cannot tell you

- **Whether a contract is safe.** It shows code and history, not intent. A verified contract is a readable contract, not an audited one.
- **Whether a token is legitimate.** Anyone can deploy a contract with any name. The address is the identity.
- **Who owns an address.** Addresses are pseudonymous. Labels, where they appear, are added by the explorer operator and are a claim, not a fact.
- **Why something failed.** It shows that a transaction reverted; the reason lives in the contract's own logic.

## Common questions

### My transaction is not showing up. Is it lost?

Probably not. Check the hash against the RPC with `eth_getTransactionReceipt`. A null result means it has not been mined yet — pending, not gone. If it never confirms, the fee is the usual cause.

### The explorer shows a token transfer but my value is zero. Why?

Because token movements are contract state changes, not native transfers. The `Value` field tracks NURA only. Look at the token transfer section of the same transaction instead.

### Can I trust a contract because it is verified?

Verification means the published source compiles to the deployed bytecode. It tells you what the code is; it says nothing about whether the code is good or the author is honest.

### Why does the explorer show a different balance than my wallet?

Usually one of them is on a different network, or one is stale. Ask the RPC with `eth_getBalance` and settle it.

## Where to go next

If you have not pointed a wallet at the network yet, [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) is the starting point, and the explorer is how you verify it worked.

If you are deploying, [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) and [creating an ERC-20](/blog/create-an-erc-20-token-on-nura-chain) both end at this page — the deploy is not done until the explorer and the RPC agree it is.
