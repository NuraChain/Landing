HTTP has carried a status code called `402 Payment Required` since the early nineties. It was reserved for a future that never arrived, and for thirty years the correct thing to do with it was nothing. In 2026 it is suddenly load-bearing: x402 uses that response to let a client pay for a single request, in stablecoins, with no account and no API key.

## The mechanism, in three steps

1. A client asks for a resource. The server answers `402` with a structured JSON body stating the price and where to pay.
2. The client pays on chain and retries the request, carrying proof of payment.
3. The server verifies and serves the response.

That is the whole protocol. There is no signup, no billing cycle, no card on file, and no minimum. A caller that needs one inference or one page of data pays for one inference or one page of data.

## Why this showed up now

Because the caller stopped being a person. An autonomous agent cannot complete a signup form, cannot hold a corporate card, and cannot wait for an invoice to clear at the end of the month. It can hold a key and sign a transfer, and per-request pricing is the only billing model that fits something making thousands of small decisions an hour.

The volumes are no longer hypothetical. One fourteen-week beta running from October 2025 into January 2026 saw over a thousand participants create more than 9,500 agents, which executed roughly 187,000 autonomous transactions between them.

## What this needs from a chain

Three properties, and they are unglamorous.

- **Cheap transactions.** A payment for a fraction of a cent cannot cost more than the thing it buys.
- **Fast finality.** The request is waiting. A settlement window measured in minutes is a timeout.
- **A stable unit.** Nobody prices an API call in an asset that moves ten percent before the retry.

Any EVM network that clears those can carry this traffic; there is nothing exotic in the transaction itself. [Connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc) is the same JSON-RPC an agent would use, and blocks here land roughly every three seconds.

## The part to get right before you ship one

An agent with a key is an unattended signer. Treat it that way.

- **Fund it thinly.** A hot balance sized to a day of work, topped up on purpose, not a treasury.
- **Bound it.** Session keys with a spend ceiling and an expiry, which is exactly what smart accounts now make practical — see [EIP-7702 and smart accounts](/blog/eip-7702-smart-accounts).
- **Log every payment.** An agent that silently spends is an agent you cannot audit after the fact.
- **Separate the key from the prompt.** Anything an agent reads can try to instruct it. The spending limit is the only control that does not argue back.

The interesting part of agentic payments is not that machines can pay. It is that per-request pricing finally has a settlement layer underneath it.
