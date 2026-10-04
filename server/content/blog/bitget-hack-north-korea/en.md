On 24 September 2026 the exchange Bitget lost $387.5 million in 19 unauthorised transfers from its hot and warm wallets. No smart contract was exploited. The attacker got into a backend system that the wallets trusted and used it to falsify transfer data. Chainalysis has attributed the Bitget hack to actors linked to North Korea, which takes the total stolen by those groups in 2026 past $1 billion.

## Key facts

- **Date and amount:** 24 September 2026; $387.5 million reached addresses the attacker controlled.
- **How:** 19 transfers out of hot and warm wallet systems, after a backend wallet system was compromised.
- **Who:** attributed by Chainalysis to North Korea-linked actors.
- **Where it went:** within three hours, across 23 transfers, to Ethereum (49.7%), XRP (40.8%), Zcash (7.6%) and Tron (1.8%).
- **Customers:** Bitget says its protection fund, which holds more than $464 million, covers the loss.
- **The month:** September was the worst of 2026 for thefts — $766.5 million by PeckShield's count, $768.4 million by CertiK's.

## What is a hot wallet, and why do exchanges have one?

A wallet whose keys are online, so it can pay out without a person.

An exchange processes withdrawals all day. It cannot fetch a hardware device from a vault for each one, so it keeps a working balance in systems that sign automatically. Cold storage holds the rest offline. A warm wallet sits between the two, with some delay or approval in the way.

The split is the security model. A breach of the hot side should cost a day's working balance. When it costs hundreds of millions, either too much was kept hot or the layers above it could be instructed by the same compromised system.

## What actually failed?

The thing the wallets believed.

Signing systems do not decide what to pay. Something upstream tells them: this customer, this amount, this address. If an attacker controls that upstream system, the wallet signs a theft as though it were a withdrawal, with valid keys and correct procedure. Nothing was hacked in the sense of broken cryptography.

This is the pattern behind most large losses now, and it is the argument of [why audited contracts still get drained](/blog/why-audited-contracts-get-drained): the audited component works, and the money leaves through the software around it.

## How was it traced so quickly?

Every transfer is public, and the tracing is now partly automated.

The funds were split across four networks within three hours, which once would have bought the thieves days. Chainalysis says automation reduced more than 20 hours of manual tracing to under ten minutes — and is careful about the claim: "Our investigators still defined the logic, reviewed the outputs, and directed the investigation."

Tracing is not recovery. Knowing where funds are does not return them; it makes them harder to cash out.

## What does it mean if you keep money on an exchange?

A balance on an exchange is an entry in the exchange's database. The coins are in wallets the exchange controls, pooled with everyone else's. When it works you never notice the difference.

- **Keep on an exchange what you are trading.** The rest does not need to be there.
- **Ask what covers a loss.** A protection fund is a promise by the same company.
- **Test a withdrawal** before you need one in a hurry.

The alternative is holding the key yourself, which removes the exchange's risk and hands you your own. Nura Wallet is self-custody — the keys stay on your device — and any EVM wallet can be pointed at the network by [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet). There is no protection fund for a lost seed phrase either.

Details will change as the investigation continues. The tracing account is [Chainalysis's](https://www.chainalysis.com/blog/387m-bitget-theft-2026/); loss totals differ between security firms because they count differently.
