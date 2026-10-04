Core Lightning, one of the main implementations of Bitcoin's Lightning Network, has told node operators to upgrade immediately to version 26.06.8, released on 22 September 2026. The project said it had received reports of attackers targeting nodes running 26.06.7 or earlier. It has not said which flaw is being used, or whether funds have been stolen.

## Key facts

- **The instruction:** upgrade to Core Lightning v26.06.8 now.
- **Who is exposed:** nodes on v26.06.7 or older.
- **What the release fixes:** bugs that could crash a node, requests that could exhaust its memory through the REST interface, and a channel-closing problem that could cost funds through Lightning's penalty mechanism.
- **What is not known:** which bug is under attack, and whether any theft is confirmed.
- **Background:** in August the project triaged a wave of AI-generated vulnerability reports over ten days, confirmed several, and shipped v26.06.7 on 28 August.

## Why is a Lightning node different from a wallet?

Because it is online, holding keys, all the time.

A Lightning payment moves through channels, and a channel is bitcoin locked between two parties who update the split between them offchain. To route payments a node must stay connected and must be able to sign instantly. That makes it a hot wallet by construction: the keys that control the funds sit on a machine that answers requests from the internet.

## What is the penalty mechanism?

Lightning's defence against cheating, and the reason old software is dangerous.

Each time a channel's balance changes, the previous state is revoked. If a party later broadcasts a revoked state — trying to claim an older, more favourable split — the other side can take the entire channel as a penalty. It is a strong deterrent.

It is also unforgiving of mistakes. A node that broadcasts the wrong state because of a bug is indistinguishable from one that is cheating, and it is punished the same way. That is why a channel-closing flaw is a fund-loss flaw.

## Why hasn't the project explained the bug?

Because explaining it would arm the attacker.

Publishing a fix already tells a careful reader roughly where the problem was. Publishing the details and the tests tells everyone exactly how to trigger it, while a share of nodes are still unpatched. Core Lightning withheld some of that on purpose. The trade is uncomfortable — operators are asked to upgrade on trust — and it is the standard one.

The August episode is the new part. A flood of machine-generated reports is mostly noise, and several were real. Finding flaws has become cheap. Maintainers' time has not.

## What should anyone running infrastructure take from this?

- **Subscribe to the release channel** of everything you run that holds keys. The warning is useless to someone who never sees it.
- **Patch on the day,** not at the next maintenance window. Attacks on a disclosed fix can start within days.
- **Keep the hot balance small.** A node needs only what it routes.
- **Close off interfaces you do not use.** One of these bugs was reachable through a REST endpoint.

None of that is specific to Lightning. A node or an indexer on any network is software exposed to the internet, and the gap between a fix shipping and an operator installing it is where most damage is done — the pattern behind [why audited contracts still get drained](/blog/why-audited-contracts-get-drained). If you only read from a chain, you can avoid the problem by not running a node at all: [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc) uses a public endpoint, which leaves you nothing to patch and nothing to hold.

Release notes and advisories are published in the [Core Lightning repository](https://github.com/ElementsProject/lightning/releases). Follow those, not a summary.
