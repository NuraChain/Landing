Wallets do not know about every network in advance. Before you can hold a balance, send anything, or open an application on Nura Chain, your wallet needs to be told the network exists. It takes about a minute.

## What your wallet will ask for

Six values, and every wallet asks for some subset of them:

- Network name: Nura Chain
- RPC URL: `https://rpc.nurachain.net`
- Chain ID: `1020`
- Currency symbol: `NURA`
- Block explorer URL: `https://explorer.nurachain.net`
- Decimals: 18, which most wallets fill in for you

Keep this page open while you do it, or better, verify the chain ID independently — the next section explains why that is worth thirty seconds.

## The one-click route

Most browser wallets support a standard request, EIP-3085, that lets a page hand over the whole network definition at once. The Nura Chain site uses it: the "Add Nura Chain to wallet" control on the home page and in the footer sends exactly the values above, and your wallet shows them to you for approval.

This is the route to prefer, for a reason that has nothing to do with convenience. Typing a chain ID by hand is the step where mistakes happen, and a mistyped RPC URL is a step worse — it points your wallet at a server chosen by whoever owns that typo'd domain.

When the prompt appears, read it rather than clicking through. A wallet showing you a network definition is showing you exactly what it is about to trust.

## Adding it by hand

If your wallet does not support the automatic request, or you would rather not let a page make the request at all, every wallet has a manual path. In MetaMask it is roughly:

1. Open the network selector at the top of the extension.
2. Choose "Add a custom network" (older versions: Settings, then Networks, then Add network, then Add a network manually).
3. Fill in the six values above.
4. Save, then switch to the new network.

Other wallets word it differently but ask for the same fields, because the fields come from the standard rather than from the wallet.

## Confirm you are actually on Nura Chain

Do not skip this. A wallet will happily hold a network whose name says one thing and whose RPC points somewhere else, because the name is a label you typed and the RPC is what it actually talks to.

The endpoint will state its own identity:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

The answer is `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. `0x3fc` is 1020 in decimal, and it must match the chain ID your wallet shows. If those two disagree, stop and fix the network entry before you send anything.

If you would rather not use a terminal, open [Nura Explorer](https://explorer.nurachain.net) and compare a recent block number against what your wallet reports. The explorer and your wallet reading the same chain is the same check by a different route.

## Nura Wallet

There is also a wallet built for this network specifically. Nura Wallet is self-custody — the keys stay on your device — and ships for Android, Windows and Linux, with builds linked from the home page. It comes with the network already configured, which removes this whole procedure.

It is not required. Nura Chain is an ordinary EVM network and any wallet that accepts a custom network works, which is rather the point of [being EVM-compatible](/blog/nura-chain-evm-compatibility). Use whichever you already trust.

## When something goes wrong

- **The wallet rejects the chain ID.** Almost always a mismatch between the decimal and hex forms. `1020` and `0x3fc` are the same number; entering `0x1020` is not.
- **Balances show as zero.** Check which network is selected. The same address exists on every EVM chain, so a wallet pointed at the wrong one shows you a real address with an unrelated balance.
- **A transaction never confirms.** Usually a gas price left over from another network. Let the wallet estimate rather than overriding it.
- **The symbol shows as something else.** Cosmetic, and fixable by editing the network entry. It does not affect what the network does.

## Common questions

### Is adding a network risky in itself?

Adding a network does not move funds and does not grant an application any permission. What matters is which RPC URL you point at, because that is the server your wallet asks about balances and sends transactions through. Use one you have reason to trust and verify its chain ID.

### Do I need NURA before adding the network?

No. Adding it costs nothing. You will need a NURA balance before you can send a transaction, because gas is paid in the native coin.

### Can I use the same address I already have?

Yes. Your address derives from your key, so it is the same across every EVM network. The balances and history are separate per chain, though — see [what Nura Chain is](/blog/what-is-nura-chain) for why that distinction matters.

### How do I remove the network later?

Through the same settings screen you added it in. Removing a network does not affect any balance; it only stops that wallet from displaying the chain.

## Next steps

With the network added, [Nura Explorer](https://explorer.nurachain.net) is the fastest way to confirm anything you do actually happened — [how to read it](/blog/how-to-use-nura-chain-explorer) covers what the columns mean.

If you are here to build rather than to hold, skip ahead to [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc). And for what NURA is and how the supply is divided, see [Nura Coin supply and allocation](/blog/nura-coin-tokenomics).
