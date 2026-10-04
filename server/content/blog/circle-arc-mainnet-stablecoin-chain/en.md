Circle opened its Arc blockchain to the public on 16 September 2026. Arc is a Layer 1 built around one design decision: transaction fees are paid in USDC, the dollar stablecoin Circle issues, rather than in a volatile native coin. Its first validators include BlackRock, Visa and Mastercard. It follows Tempo, the payments chain from Stripe and Paradigm, which went live in March 2026.

## Key facts

- **Launch:** public mainnet on 16 September 2026, after a private phase with institutions.
- **Fees:** paid in USDC. A separate ARC token exists, but it is not what you pay gas with.
- **Compatibility:** Arc runs the EVM, so Solidity contracts and standard wallets work.
- **Validators:** named institutions, among them BlackRock, DTCC, Visa, Mastercard, ICE and Standard Chartered.
- **Not finished:** privacy features are opt-in and still in development.

## Why would anyone pay gas in a stablecoin?

Because a finance department cannot budget in a floating asset.

On most chains you pay fees in the native coin. Its price moves, so the cost of a transaction in dollars moves with it, and a company must hold an asset it does not otherwise want purely to pay for transfers. Fees in USDC remove both problems: the cost is quoted in the unit the business already reports in, and there is nothing extra on the balance sheet.

That is a real convenience, and it is worth being clear that it is a convenience rather than a breakthrough. How fees work on an ordinary EVM chain — a base fee that adjusts with demand, paid in the native coin — is covered in [what gas actually costs in 2026](/blog/what-gas-actually-costs-in-2026).

## Who runs it?

Named institutions do, and that is the trade.

A validator set of large, regulated firms is exactly what a bank needs to see before it settles payments on a network. It is also a small group that can be identified, regulated and instructed. Whether that counts as a strength depends on what you want from a chain: a company wants a counterparty it can sue, and a user in a difficult jurisdiction wants a network nobody can be told to switch off for them.

Neither is wrong. They are different products that share a virtual machine.

## Is it another EVM chain?

Yes, and that is the least surprising part. Building on the EVM means Arc inherits every wallet, library and audit firm on day one, which is why almost every new network makes the same choice — the reasoning is in [why EVM chains keep multiplying](/blog/why-so-many-evm-chains).

What a new chain cannot inherit is liquidity and users. Arc's answer is distribution: Circle already has the stablecoin and the institutional relationships. That is a stronger starting position than most launches have, and it is still a starting position.

## What does it mean for general-purpose chains?

That "payments chain" is becoming a category, owned by the companies that issue the dollars or run the checkouts. General-purpose networks will not win that contest on fees quoted in dollars.

What they keep is openness. On Nura Chain anybody can deploy a contract and anybody can read it; fees are paid in NURA under an EIP-1559 base fee, and blocks arrive roughly every three seconds. That is a different promise from Arc's, made to a different user, and [what Nura Chain is](/blog/what-is-nura-chain) states it plainly.

Details here are as announced at launch and will change; [Circle](https://www.circle.com) is the source for the current ones.
