Every claim that a chain is cheap quotes one number. A fee is made of three, and the missing two are usually where the claim lives.

```
fee in currency = gas units x gas price x price of the native coin
```

Gas units are set by what the transaction does. Gas price is set by the market for block space. The coin price is set by everything else. A chain with a tiny gas price and an expensive coin is not cheap; a chain with a high gas price and a worthless coin is not expensive.

## The three numbers, separately

**Gas units** are deterministic. A plain transfer is 21,000. An ERC-20 transfer is usually 45,000–65,000 depending on whether the recipient's balance slot is already non-zero. A contract deployment is thousands to millions, depending on bytecode size. These are properties of the EVM and they are the same on every EVM chain.

**Gas price** is the market. Since EIP-1559 it splits into a base fee the protocol sets per block and burns, and a priority fee you add to be included sooner. On Ethereum mainnet in 2026 the base fee has spent long stretches around 0.15 gwei, which puts a basic transfer under a cent. That is a different world from 2021, and it is the direct result of demand moving to rollups and of blob space existing for their data.

**Coin price** is the part nobody controls and everybody forgets. It is also why a fee quoted in gwei tells you nothing until you multiply.

## Estimate it yourself

Two JSON-RPC calls price any transaction on any EVM network. No dashboard required.

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

The result is a hex string in wei. Divide by 10^9 for gwei, multiply by your gas units, divide by 10^18 for a figure in whole coins. `eth_estimateGas` does the first half of the multiplication for you if you hand it a transaction object.

Doing this once, against the chain itself, is worth more than any comparison table — including this article.

## Why the gas limit matters to the price

Gas price is an auction for space in a block. Raise the space and, all else equal, the clearing price falls. This is exactly why the upcoming raise of Ethereum's block gas limit — from roughly 60 million toward something nearer 200 million, enabled by the changes in [the Glamsterdam upgrade](/blog/ethereum-glamsterdam-upgrade) — is a fee story as much as a throughput one.

## On Nura Chain

Gas is paid in NURA, blocks land roughly every three seconds, and transactions carry an EIP-1559 base fee, so the arithmetic above applies unchanged. The values you need are in [what Nura Chain is](/blog/what-is-nura-chain), and [connecting to the RPC](/blog/connect-to-nura-chain-rpc) covers the endpoint the curl above talks to.

One practical habit: estimate before you send, not after. Gas units are knowable in advance, and the transaction that surprises you is almost always the one that touched more storage than you expected.
