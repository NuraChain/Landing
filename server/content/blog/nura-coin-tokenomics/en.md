Nura Coin, ticker `NURA`, is the native asset of Nura Chain. This page sets out what it does, what the published supply figures are, and — the part most tokenomics pages leave out — which of those figures you can check for yourself and which you are taking on the project's word.

## What NURA is for

It pays for gas. Every transaction on the network consumes gas, gas is priced in NURA, and an account with a zero balance cannot send anything at all, including its first contract deployment. That is the same role ether plays on Ethereum.

It has 18 decimals, which is the EVM convention rather than a decision made here. The smallest unit is therefore one billionth of one billionth of a NURA, and every wallet and library handles that conversion for you.

Because it is the native asset rather than a contract, it has no token address. If a page asks you for "the NURA contract address" in order to add the native coin, be careful: adding the network is what makes NURA appear, and [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) is the whole procedure.

## Total supply

The published total supply is 1,000,000,000 NURA — one billion.

## How the supply is divided

The project publishes a six-way split. These are its stated allocations and stated purposes:

- **Locked — 40%.** Locked for one year. What happens to it is to be decided once that period ends, and any decision about this portion is stated to require approval by a vote of at least 65% of the network.
- **Liquidity — 25%.** Allocated over a one-year period to providing and managing liquidity, with the aim of workable trading liquidity.
- **Community — 10%.** Distributed to community members over one year, for people who contribute through activity, participation, development or referrals rather than by paying. Allocation follows review and approval by the management board.
- **Public sale — 10%.** Offered in a public sale priced at $24,000 in total. That share is 100,000,000 tokens, which works out at $0.00024 per NURA.
- **Treasury — 10%.** Allocated over one year under the oversight of the management board, to fund ecosystem development, infrastructure, products and partnerships.
- **Airdrop — 5%.** Distributed over one year, with recipients identified through selected channels and communities and the final allocation confirmed by the management board.

Those add to 100%.

## What you can verify, and what you cannot

This is the section worth reading twice, because it applies to every chain and not just this one.

**You can verify any individual balance.** Balances are on-chain and public:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

The answer is in wei, hex-encoded. Divide by 10^18 for NURA.

**You cannot verify the total supply of a native coin over standard RPC.** There is no `eth_totalSupply`. An ERC-20 has a `totalSupply()` function because it is a contract keeping its own ledger; a native coin's issuance lives in consensus rules and genesis state, not in a queryable contract. So the one-billion figure above is a published claim, not something a JSON-RPC call will confirm for you.

That distinction is worth internalising. On any chain, "total supply" for the native asset is a statement made by the project and verifiable only by reading the client's configuration or the genesis block. Token supply, by contrast, is always checkable — which is why [creating an ERC-20 on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) can show you exactly how.

**Circulating supply is not stated here on purpose.** A circulating figure depends on which allocations are considered unlocked at a given moment, and that is a judgement rather than a measurement unless every locked allocation sits at a published address you can watch. Where such addresses are published, they can be checked with the balance call above.

## Holding NURA

Any wallet that accepts a custom EVM network can hold it — the network values are in [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet). There is also Nura Wallet, a self-custody wallet built for this network with builds for Android, Windows and Linux.

Whatever you use, self-custody means the keys are yours and the responsibility is too. There is no recovery path for a lost seed phrase, on this network or any other.

## Common questions

### Is NURA an ERC-20 token?

No. It is the network's native coin, in the same way ether is native to Ethereum. ERC-20 tokens exist on Nura Chain as separate contracts, but NURA itself is not one of them.

### Do I need NURA to use the network?

To read from it, no — the RPC endpoint answers read calls from anyone. To send a transaction or deploy a contract, yes, because that is what pays the gas.

### Where can I see the current price?

This page does not quote a live price, and any page that does should be cross-checked against an exchange you can actually trade on. The only figure stated above is the published public sale price, which is a fixed historical term of that sale rather than a market quote.

### How do I check a specific wallet's balance?

Use the `eth_getBalance` call above, or paste the address into [Nura Explorer](https://explorer.nurachain.net). Both read the same chain — [how to use the explorer](/blog/how-to-use-nura-chain-explorer) explains why checking both is a good habit.

## Where to go next

To actually hold or move NURA, start with [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet).

For what the coin is paying for — the network itself, its chain ID and its RPC — see [what Nura Chain is](/blog/what-is-nura-chain). And if the supply distinction above interested you, [creating an ERC-20 on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) shows the contrasting case where supply is fully checkable.
