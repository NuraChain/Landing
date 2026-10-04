The EU's Markets in Crypto-Assets Regulation, MiCA, has been fully in force since 1 July 2026, when its transition period ended. One visible result arrived on 16 September: Deutsche Bank said it had obtained MiCA authorisation in Germany and would offer regulated crypto custody to institutional and corporate clients before the end of the year. A bank of that size is now doing, under licence, what crypto companies did without one.

## Key facts

- **The rule:** MiCA's transition period ended on 1 July 2026. Offering crypto services in the EU now requires authorisation.
- **The bank:** Deutsche Bank announced its custody plans on 16 September 2026.
- **The assets:** Bitcoin and Ether, plus three stablecoins — USDC, EURC and EURAU.
- **The model:** the bank holds the wallets and manages the private keys for its clients.

## What does MiCA actually require?

A licence, and the obligations that come with being a financial firm.

A company that holds crypto for clients, runs a trading venue or executes orders needs authorisation from a national regulator, and that authorisation is valid across the EU. Stablecoin issuers have their own chapter, with reserve and redemption rules. Before July, firms already operating could continue under national rules while they applied. That grace period is what ended.

It is the same idea as the US stablecoin law described in [what the GENIUS Act changes onchain](/blog/genius-act-stablecoin-rules): regulate the firms that touch customers' money, not the ledger underneath.

## What is bank custody, mechanically?

Somebody else holding your keys, with a rulebook.

Deutsche Bank's description is ordinary, and that is the point: hardware-protected keys, approvals that need more than one person, separate warm and cold storage, backup and recovery procedures. A client sees a balance and gives instructions. The bank signs.

For an institution this solves a real problem. A pension fund cannot keep a seed phrase in a drawer; it needs a custodian that an auditor and a regulator will accept. That is what a licensed bank is.

## What do you give up?

The property that made the asset different.

With self-custody, a transaction needs your key and nothing else. With a custodian, it needs the custodian's agreement — and a custodian can be closed for the weekend, can freeze an account under an order, and can fail. The asset is the same and the guarantee is not.

Neither model is the correct one. They answer different needs.

- **Custody suits** money that belongs to other people, or that must be reported, insured and audited.
- **Self-custody suits** money you are prepared to be solely responsible for. There is no recovery desk for a lost seed phrase.

## Does any of this reach an EVM chain?

Only at the edges. MiCA regulates service providers, not networks, and its custody rules apply to firms that hold clients' keys. Software that never holds them is a tool, not a custodian.

That is the design of Nura Wallet — self-custody, with the keys staying on your device — and of any EVM wallet you connect yourself, which [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) walks through. The trade described above applies there in full: nobody can freeze the balance, and nobody can restore it.

This is a summary of a regulation, not legal advice. [ESMA](https://www.esma.europa.eu) maintains the register of authorised firms and the technical standards.
