Ledger says some hardware wallets sold through CryptoBilis, an authorised Ledger reseller based in Malaysia and operating across Southeast Asia, carried an unauthorised hardware implant that copied the owner's 24-word recovery phrase during setup and sent it out over a mobile network. Ledger opened an investigation on 9 October 2026, after reports that buyers' wallets had been drained, and confirmed the implant in one affected device on 10 October. Ledger has not published a loss figure; on-chain trackers put it between more than $86 million and $103.4 million.

## Key facts

- **What:** an implant inside the device enclosure, which Ledger describes as a physical supply-chain attack, not a breach of its software or systems.
- **Where:** every confirmed loss involves a signer sold by CryptoBilis, Ledger said in a follow-up; its own systems and direct sales were unaffected.
- **When:** investigation opened on 9 October 2026; implant confirmed on 10 October; Ledger's security team, Donjon, described how it worked on 13 October.
- **How much:** Bitquery counted $93.2 million taken from 315 wallets on six blockchains, at 9 October prices, according to ForkLog on 12 October. Ledger says the figures come from third parties and it has not fully verified them.
- **Frozen:** Tether froze about $10 million in USDT tied to the theft, according to CoinDesk on 13 October.
- **The reseller:** CryptoBilis stopped selling all hardware wallet brands while the investigation runs.

## What did the implant do?

It read the recovery phrase off the screen.

A hardware wallet generates the phrase inside its secure chip and shows it once, on its own display, so the owner can write it down. According to Ledger's 13 October update, the implant's microcontroller read and decoded those 24 words as they appeared during setup and transmitted them over LTE using an embedded SIM card. With the phrase, the attacker can rebuild the wallet anywhere and move the funds out, without touching the device again.

Ledger says the implant did not modify the Secure Element or the device's operating system, and did not alter transactions or signatures.

## Why did the device's own security not stop it?

Because nothing it checks was changed.

The secure chip did its job: it kept the keys sealed. The leak happened between the chip and the owner's eyes, at the one moment the secret is shown in the clear. According to BleepingComputer, citing a Ledger support article, Ledger's Genuine Check cannot detect added hardware when the original Secure Element is intact. A device can pass every software check and still have a passenger.

This is the same lesson as [why audited contracts still get drained](/blog/why-audited-contracts-get-drained): the strong component holds, and the money leaves through what surrounds it.

## How much was stolen?

Nobody official has said, and the trackers disagree.

The early estimate came from the investigator Specter, who put losses at more than $86 million on 9 October. Bitquery counted $93.2 million across 315 wallets at 9 October prices, leaving out swaps and transfers between the attacker's own wallets; by 12 October its count had reached $102.0 million across 324 wallets, according to Genfinity on 13 October. YFarmX put the total at $103.4 million across 530 wallets, according to ForkLog on 12 October, without describing its method. The trackers do not count the same things, so the number will keep moving.

## Is it only CryptoBilis?

That is what Ledger has confirmed so far, and it is examining other reports.

On 13 October Ledger said the retailer MediaMarkt Saturn had stopped selling Ledger devices after a customer in Germany reported an implant; no loss of funds was reported in that case. Mark Karpelès, the former head of Mt. Gox, said a Ledger Flex bought at Singapore's airport contained one; Ledger has not linked it to this incident. Trezor said it had no reports of tampered Trezor devices but removed CryptoBilis from its resellers, and OneKey revoked its authorisation and offered free replacements.

## What should you do if you own a hardware wallet?

Ledger's own advice, plus the rule behind it.

- **Bought from CryptoBilis and not set it up?** Do not initialise it.
- **Already using one?** Move your assets to a new device with a newly generated recovery phrase.
- **Lost funds?** Contact Ledger's support, file a police report, and coordinate with law enforcement before opening the device.
- **Buying a new one?** Buy from the manufacturer directly where you can — CryptoBilis was an authorised reseller, and that did not prevent this — and be wary of a price well below the usual one.
- **Never reuse a phrase** a suspect device has shown you. A new device with an old phrase is still compromised.

## What does this mean for self-custody?

Self-custody moves the risk from a company to you, and part of that risk is the device that shows you the secret.

Nura Wallet is self-custody — the keys stay on your device — and the same rule applies to it as to any wallet: a recovery phrase is only as private as the device that first displayed it. If you hold assets on Nura Chain, any EVM wallet can reach the network by [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet).

The investigation is ongoing and the figures will change. The primary source is [Ledger's 13 October update from Ledger Donjon](https://x.com/Ledger/status/2109896739985453358).
