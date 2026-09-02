Nura Chain is a public blockchain: a shared record of who owns what, kept by computers rather than by a bank, that anyone can read and nobody can quietly rewrite. It adds a new page to that record every three seconds, it runs on the same engine as Ethereum, and it has its own coin, NURA, which pays the small fee every transaction costs. Around it sit a wallet, an explorer for looking things up, a swap for exchanging coins, and a bridge for bringing coins in from other networks.

This document explains all of that in plain words. It is written for someone who has never used a blockchain, for someone deciding whether to hold NURA, and for someone who just wants to know what they are looking at. Where a claim can be checked by anyone, we say how; where it cannot, we say that too.

## 1. What Nura Chain is

Think of a blockchain as a notebook that thousands of people hold identical copies of. When somebody sends coins, the transfer is written on a new page, every copy gets the same page, and once a page is in, it stays in. Nobody can tear one out or change an old entry without everyone noticing. That is the whole trick, and it is why a blockchain can keep money honest without a company in the middle.

Nura Chain is one such notebook. What makes it easy to use is that it runs the same engine as Ethereum, the most widely used blockchain platform. Any wallet, app or tool built for Ethereum works on Nura Chain too, so you do not need special software to use it. If you have ever used MetaMask or a similar wallet, you already know how.

One thing to keep clear: Nura Chain is the network. Nura Wallet, Nura Explorer and Nura Swap are products built on top of it, described in section 7. You can use the network with any wallet you like.

## 2. What we stand for

Four ideas shape everything below.

- **Your keys, your coins.** Your wallet holds your coins with a secret key that never leaves your device. Nobody at Nura, and nobody anywhere else, can move your coins, freeze them or take them. The other side of that coin is that nobody can recover them for you either.
- **Check, do not trust.** The important facts about the network can be checked by anyone with a wallet or a web browser. Where a number cannot be checked, this document says so instead of letting you assume it can.
- **Familiar tools.** Nothing about Nura Chain needs a new kind of app. The wallets and tools people already use work here.
- **Say it plainly.** Fewer promises, described honestly, including the parts that are not flattering.

## 3. How the network works

### 3.1 Blocks: a new page every three seconds

The pages of the notebook are called blocks. Nura Chain writes a new one every three seconds, on a fixed schedule, whether or not anybody sent anything in that time. The very first block was written on 6 June 2026, and the count has been climbing ever since. You can watch it climb on the home page of the site and in Nura Explorer.

### 3.2 Fees: a small charge for every transaction

Every transaction pays a fee in NURA, a bit like postage on a letter. The fee has two parts: a base amount the network sets, and an optional tip you can add if you want your transaction taken first. Your wallet works this out for you; you never calculate it by hand. At the time of writing the base amount is a tiny fraction of one NURA, but it is set by the network and can change, so treat the fee your wallet shows as the real number.

### 3.3 Who writes the blocks

Some blockchains, like Bitcoin, have computers race to solve puzzles for the right to write the next block, which is what people mean by "mining". Nura Chain does not work that way. Its blocks are written by an authorised block producer on the three-second schedule above, and every block records which account wrote it, so who produced any given block is public rather than a matter of trust.

Being straightforward about what that looks like today: at the time of this revision, every block we sampled was written by the same producer account. Whether more producers are added is a decision about how the network is run, not something this document promises either way. Any change is announced through the channels in section 10.

### 3.4 When is a transaction final?

Once your transaction is written into a block, it is done. It shows up in Nura Explorer within a few seconds, and it cannot be undone, reversed or cancelled by anyone, including us. That is what makes the record trustworthy, and it is also why section 9 asks you to double-check before you send.

## 4. The NURA coin

NURA is the network's own money, the way ether is Ethereum's. It pays the fees from section 3.2, and an account with no NURA at all cannot send anything, because it cannot pay the postage.

NURA is built into the network rather than being an app running on it. That has a practical consequence: there is no "NURA contract address" to add to your wallet. You add the network itself, using the values in section 10, and your NURA balance simply appears. If a page tells you to paste an address to "add NURA", be careful: it is asking for something that does not exist.

Like most coins of this kind, NURA can be split into very small fractions, so you can send a tenth, a thousandth, or far less of one coin.

## 5. How many NURA exist, and where they go

### 5.1 The total

The total supply is 1,000,000,000 NURA, one billion, and no more will be created beyond that.

That figure is published by the project. It is worth knowing that it is one of the few numbers here you cannot check yourself: a wallet or the explorer can show you the balance of any single address, but a coin built into the network has no counter that adds them all up. The individual balances are checkable; the total is the project's word.

We do not state a "circulating supply" in this revision. That number depends on which portions below count as unlocked on a given day, and that is a judgement rather than a measurement. Where the project publishes the addresses holding a portion, anyone can watch those balances instead.

### 5.2 The split

The billion coins are divided six ways. For each portion: the share, the number of coins, and what it is for.

- **Locked, 40%, 400,000,000 NURA.** Set aside and locked for one year. What happens to it afterwards is decided at the end of that year, and any decision about this portion needs the approval of at least 65% of the network in a vote.
- **Liquidity, 25%, 250,000,000 NURA.** Used over one year to keep enough NURA available in trading pools, so that buying and selling works smoothly and the price does not lurch on every trade.
- **Community, 10%, 100,000,000 NURA.** Given to people who help the network grow over one year: by being active, taking part, building things, or bringing others in. Each allocation is reviewed and approved by the management board.
- **Public sale, 10%, 100,000,000 NURA.** Sold to the public for $24,000 in total, which works out at $0.00024 per NURA. That is the price of that sale, not the market price, and it says nothing about what NURA is worth on any given day.
- **Treasury, 10%, 100,000,000 NURA.** The project's own budget over one year, for building, infrastructure, products and partnerships, overseen by the management board.
- **Airdrop, 5%, 50,000,000 NURA.** Given away over one year to people reached through selected channels and communities. The final list is confirmed by the management board.

Those six portions add up to 100%.

### 5.3 Checking a balance

Every balance on Nura Chain is public. Open Nura Explorer, paste any address, and you see exactly how many NURA it holds and every transfer in and out. That works for your own address, for a friend's, and for any address the project publishes for one of the portions above.

## 6. Who decides what

Two rules are in place at this revision, and both are about the coins in section 5 rather than about the network itself.

The locked 40% cannot be released, repurposed or spent without a vote in which at least 65% of the network approves. That is the one firm rule on the largest single portion of the supply.

The community, treasury and airdrop portions, a quarter of all coins between them, are handed out under the review of a management board, which signs off on each distribution.

We do not claim anything beyond that. There is no voting system for the network's own settings, such as how often blocks are written or who writes them. Those are decided by the people running the network, and this document says so rather than describing a system that does not exist.

## 7. The tools around the network

### 7.1 Nura Wallet

Nura Wallet is our own wallet app. It keeps your secret key on your device and only there; the app cannot spend your coins by itself, and neither can we. Its source code is public on GitHub, so anyone can read what it does.

It is available for Android, both on Google Play and as a direct download, for Windows, and for Linux. Versions for iPhone and Mac are not out yet. You do not have to use it: any wallet that lets you add a custom network, MetaMask included, works with Nura Chain.

### 7.2 Nura Explorer

Nura Explorer is the public window onto the notebook. Type in an address, a transaction or a block number and you see everything about it: balances, transfers, when a block was written and by whom. It is where you confirm that a payment really arrived, and it is the tool behind most of the "you can check this" statements in this document.

### 7.3 Nura Swap

Nura Swap is where you exchange NURA for other coins and back. It works from a shared pool of coins, and the price it shows is simply the balance of that pool at that moment.

The pool is small. That means one large trade can move the price a lot, in either direction. Treat the price on the swap as what one small pool happens to quote, not as a listing on an exchange, and do not read it as a valuation of NURA.

### 7.4 The bridge

The bridge lets you bring BNB and USDT onto Nura Chain from their home networks. It works like a cloakroom ticket: your original coins are locked on the other network, and you receive a matching "wrapped" coin here that you can spend on Nura Chain. Hand the wrapped coin back and the original is released.

A wrapped coin is only worth its original while the original is really there. The site shows the total value that has crossed the bridge, and that number counts the tickets, not the coats: it is correct as long as every wrapped coin is backed one for one on the other side. The addresses of the two wrapped coins are listed in section 10.

## 8. Getting started

1. Install a wallet. Nura Wallet from section 7.1, or any wallet you already use that can add a custom network.
2. Add Nura Chain to it. The "Add Nura Chain to wallet" button on the site does it in one tap; if you would rather do it by hand, the values are in section 10.
3. Check that the wallet shows chain ID 1020 for the network. If it shows any other number, you are on a different network, and anything you send will go somewhere you did not intend.
4. Get some NURA. Fees are paid in NURA, so an empty account cannot send anything yet.
5. Send a small amount first, then look it up in Nura Explorer. Seeing your own transfer on the public record is the best way to understand how all of this works.

If you are a developer, the site's blog has step-by-step guides for connecting to the network and deploying contracts; they are linked in section 10.

## 9. What to watch out for

- **A lost recovery phrase means lost coins.** Nobody can reset it, on this network or any other. Write it down and keep it somewhere safe.
- **A wrong chain ID means lost coins.** Always confirm 1020 before sending, and treat any page, including this one, as something to check rather than something to trust.
- **The same address on another network is not the same money.** Your address exists on Ethereum and other networks too, but the balances are separate. Sending coins to "the same address on another chain" does not move them across. Only the bridge does that, and only for BNB and USDT.
- **The swap price can swing.** One trade in a small pool can move it sharply.
- **A wrapped coin is a ticket, not the coat.** It is worth the original only while the bridge holds the original.
- **Some numbers are the project's word.** The total supply and the terms of the split cannot be checked in a wallet. Individual balances can.
- **Block production is in one account's hands today.** Section 3.3 says so plainly so you can weigh it now rather than find out later.

## 10. The facts, for reference

The values a wallet asks for when you add the network by hand:

- Network name: Nura Chain
- Chain ID: `1020` (some wallets show it as `0x3fc`, which is the same number written differently)
- RPC endpoint: `https://rpc.nurachain.net`
- Block explorer: `https://explorer.nurachain.net`
- Coin: Nura, ticker `NURA`, 18 decimal places
- Block time: 3 seconds

The two wrapped coins the bridge creates on Nura Chain:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

Where to go:

- [Nura Explorer](https://explorer.nurachain.net), for looking anything up
- [Nura Swap](https://swap.nurachain.net/), for exchanging coins
- [Nura Wallet downloads](https://github.com/NuraChain/Wallet/releases), every version and platform
- [Nura Chain on GitHub](https://github.com/NuraChain), the source code
- Community: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Guides: [what Nura Chain is](/blog/what-is-nura-chain), [adding the network to your wallet](/blog/add-nura-chain-to-your-wallet), [reading the explorer](/blog/how-to-use-nura-chain-explorer), [supply and allocation](/blog/nura-coin-tokenomics), and for developers, [connecting to the network](/blog/connect-to-nura-chain-rpc) and [deploying a contract](/blog/deploy-a-smart-contract-on-nura-chain)

## 11. A note on what this document is

This document describes the network as it is at the revision shown at the top. It is not an offer, a recommendation or investment advice, and nothing in it is a promise about what NURA will be worth, how easy it will be to buy or sell, or what the project will do next. Numbers described as the project's word are exactly that; every other number can be checked with the tools above. When we change something worth knowing, we publish a new revision, and the revision number and date tell you which one you are reading.
