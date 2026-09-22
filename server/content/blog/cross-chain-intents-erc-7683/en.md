There are now more than eighty EVM-compatible chains with meaningful onchain activity, plus several non-EVM ecosystems with their own users. Moving value between them used to mean picking a bridge, understanding its trust model, and hoping. In 2026 the dominant pattern is different: you sign what you want, and somebody else works out how.

## What an intent is

An intent is a signed declaration of an outcome. Not "call this contract on this bridge with these parameters", but "I have 100 USDC here, I want at least 99.4 USDC there, before this deadline".

That order goes to a network of solvers, who compete to fill it. A solver already holding USDC on the destination chain simply pays you there and claims your funds on the origin chain afterwards. Nothing of yours crosses anything. What crossed was the solver's inventory, days ago, at a time of their choosing.

**ERC-7683**, authored by Uniswap Labs and Across Labs, is the standard that made this portable: one data format for cross-chain intent orders, so any protocol that emits them can be filled by any compatible solver network. It is the most widely adopted format of its kind.

## Why this became the default

Because the failure mode of the old model was the worst one available. A lock-and-mint bridge holds a large, stationary pool of assets and publishes its address, which is a standing invitation. Years of incidents came from exactly that shape.

The intent model has no permanent honeypot. It also happens to be faster and to quote a price before you commit, which is what users actually notice. Stablecoin payments are the highest-volume cross-chain use case in 2026, and NEAR Intents alone has processed around $5 billion in volume across 25 or more chains.

## What you are trusting instead

Not nothing. The risk moved rather than vanished.

- **The escrow contract.** Your funds sit in one until the fill is proven. That contract is as good as its code.
- **The proof of fill.** How the origin chain learns the destination was paid. Sometimes an oracle, sometimes an optimistic window with a challenge period, sometimes a light client. This is the real trust assumption and it differs per protocol.
- **Solver competition.** Price quality depends on there being several solvers who want your order. A thin market quotes you a thin price.
- **The deadline.** If nobody fills, you get your funds back after it expires — which means "unfilled" is a delay, not a loss, provided the escrow behaves.

## What it means for a chain like this one

Intents are why a new EVM network is no longer isolated by default. Solvers hold inventory wherever there is demand, and the technical requirement on a chain is the ordinary one: standard JSON-RPC, fast blocks, cheap transactions and readable state. [Connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc) is that interface, and [what Nura Chain is](/blog/what-is-nura-chain) covers the rest of the values a solver or a wallet would need.

The honest summary: intents did not remove the bridge problem, they replaced a standing pool of locked assets with a market of people who move their own. That is a better shape, and it is still a shape with assumptions in it.
