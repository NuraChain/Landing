On 21 October 2026 Pump.fun made Pump Bridge, its own cross-chain infrastructure, the default route for cross-chain trades in its app, replacing the outside provider Relay. A day later, on 22 October, its rival FOMO began the public rollout of its own bridge and said cross-chain transactions in its app "now land in <1s". Pump.fun's figure is an average buy time of 1.95 seconds against 3.88 seconds through Relay, from its own tests. Neither company has published how its bridge holds or moves money, which is the question that decides what a cross-chain trade actually depends on.

## Key facts

- **Pump.fun, 21 October:** Pump Bridge became the default cross-chain route in its app, replacing Relay.
- **Pump.fun's test:** 28 September to 7 October, more than 400,000 trade outcomes; average buy 1.95 s against 3.88 s, buy errors 0.9% against 11.2%. Pump.fun's own data, not independently verified, as crypto.news reported on 22 October.
- **Chains in that test:** Robinhood Chain, BNB Chain, Base, Arc and Ink, according to crypto.news.
- **Fees:** no separate bridging fee for now; ordinary trading fees may still apply.
- **FOMO, 22 October:** public rollout of "fomo bridge", after about a week with a small share of users. It had relied on outside bridging, including Relay.
- **FOMO's claim:** cross-chain transactions under one second. It gave no comparison period and no audited figures, crypto.news noted on 23 October.
- **Not disclosed by either:** where the destination-side money comes from, the security model, or any audit.

## What is a cross-chain bridge?

A way to end up with value on one blockchain after starting on another.

Chains do not read each other. A coin on BNB Chain cannot simply walk onto Base, so something has to stand in the middle: lock it on one side and issue a claim on the other, or pay you out of funds already sitting on the far side. Which of those it does is the whole security question.

## How can a cross-chain swap take one or two seconds?

Because nothing has to cross first.

Waiting for one chain to confirm a deposit and then for another to mint takes longer than two seconds. The fast designs skip the wait: a filler that already holds funds on the destination chain pays you there out of its own balance, and collects your deposit on the origin chain afterwards. Relay, the provider both apps used before, documents exactly this: a solver fills from its own capital, an oracle attests the deposit and the fill, and the solver is repaid later. The same pattern underlies [cross-chain intents and ERC-7683](/blog/cross-chain-intents-erc-7683).

Pump.fun and FOMO have not said whether their bridges work this way, or whose money does the filling. That is an inference from the speed, not a disclosure.

## What backs a bridged token?

It depends on which kind of bridge made it.

- **Lock-and-mint.** Your coin is locked in a contract or a wallet on its home chain, and a wrapped copy is minted for you on the other. The copy is worth the original only while the original is still locked. You are trusting whoever can release that lock — a multisig, a set of signers, a contract.
- **Filler-paid.** You receive a real asset on the destination chain, paid from someone's inventory. You are not left holding a claim, but for those seconds you trust the filler to pay, and the system that settles with it to refund you if it does not.

The first kind has the bigger failure. A locked pool is large, stationary and public. The [Liquid Network exploit](/blog/liquid-network-exploit-explained) took about 4,000 BTC from a backing wallet whose signers signed because the software told them to.

## Does faster mean safer?

No. Speed and error rate are what the announcements measure; neither says anything about what happens to funds if a leg fails. A bridge an app runs itself also makes that app the party you trust, where before it was an outside provider. That can be better or worse. Without published design or audits, nobody outside can say which.

## Before you bridge

- **Ask what you will hold at the end.** The native asset, or a wrapped claim on someone else's lock?
- **Find out who can move the backing,** and whether the wrapped supply can be read on the chain.
- **Send a small amount first,** and confirm it arrived before sending the rest.
- **Read speed figures as marketing until checked.** Both sets here are company-reported, from different tests, and cannot be compared with each other.

## How does Nura Chain's bridge work?

The whitepaper describes it as a cloakroom ticket: the original coin is locked on its home network, and a matching one is issued on Nura Chain. Bridged BNB, USDT, BTC and ETH on Nura Chain are mint-and-burn ERC-20 tokens, and their supply is public: anyone can read it, as [how to use the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) shows.

The figures are the companies' own and may change as the rollouts continue. The primary sources are [Pump.fun's announcement](https://x.com/Pumpfun/status/2112980077881266326) and [FOMO's announcement](https://x.com/fomo/status/2113385954631160071).
