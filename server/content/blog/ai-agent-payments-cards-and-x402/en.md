Software started paying for things in the third week of September 2026, on two different sets of rails. On 21 September, Mastercard and Danske Bank completed what they called Denmark's first payment made by an AI agent, and Mastercard announced Canada's first the same day. On 25 September, Block added Bitcoin's Lightning Network to x402, the protocol that lets an agent pay for a single web request. AI agent payments now have a card answer and a crypto answer.

## Key facts

- **Cards:** on 21 September 2026 an agent booked and paid for a coffee tasting with a Danske Bank Mastercard, using Mastercard Agent Pay.
- **Canada:** an assistant acting for a Rogers Bank cardholder bought a product within "predefined spending limits".
- **Crypto:** Block added Lightning support to x402 on 25 September 2026.
- **Scale of x402:** about 75.4 million transactions worth $24.2 million in the prior 30 days, by the protocol's own figures.
- **What it settles in:** USDC was 99.3% of x402 volume in the second quarter of 2026, according to Circle.

## How does an agent pay with a card?

By borrowing a person's.

The agent acts for a cardholder who has already been verified. The payment is authorised against that person's card, within instructions and limits they have set, and the merchant receives something that looks like an ordinary card payment. Everything behind it is the existing system: an issuing bank, chargebacks, fraud rules, a statement at the end of the month.

That is the strength. A shop does not have to change anything to accept it, and a mistaken purchase can be disputed.

## How does an agent pay with x402?

By holding a key.

A server answers a request with the HTTP status `402 Payment Required` and a price. The agent pays and retries. There is no account, no card and no person in the loop — the mechanics are in [how AI agents pay per request over x402](/blog/ai-agents-onchain-payments-x402).

Divide the protocol's own numbers and the difference from cards is obvious: $24.2 million across 75.4 million transactions is about 32 cents each. Card networks were not built for payments that size.

## So which one wins?

Probably both, for different purchases.

- **Cards fit** what people already buy: a booking, a product, anything with a merchant, a refund policy and a price worth disputing.
- **x402 fits** what only software buys: one API call, one page of data, one inference, thousands of times an hour.

Adding Lightning matters because it widens the second category beyond stablecoins. Until now nearly all x402 volume was USDC; an agent can now pay in bitcoin over the same protocol.

## What stays the same on both rails?

An agent that can pay is an unattended signer. The card version puts the limit at the network; the crypto version puts it in the account. Either way the control that matters is the ceiling, because an agent can be argued into things and a spending limit cannot.

On an EVM chain that ceiling is a smart account with a session key that expires — the pattern in [EIP-7702 and smart accounts](/blog/eip-7702-smart-accounts). Nura Chain produces a block about every three seconds, with fees set by an EIP-1559 base fee, which is the shape per-request payments need. It does not ship an agent payment product, and nothing here should be read as one.

Volumes are small and self-reported. [x402.org](https://x402.org) publishes the protocol's figures.
