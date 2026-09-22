For a decade an Ethereum account was one of two things. Either an externally owned account, controlled by a private key and unable to run any logic of its own, or a contract, full of logic and controlled by no key at all. EIP-7702, which shipped with the Pectra upgrade in May 2025, put an end to the choice: an ordinary account can now delegate to contract code while the key keeps control of it.

Adoption moved faster than most standards do. MetaMask, Rabby and Trust integrated it through 2025 and into 2026, and industry estimates now put smart wallets across the ecosystem in the hundreds of millions.

## What the delegation actually is

A 7702 transaction carries an authorization list. You sign a tuple that says "calls to my address should execute the code at this contract address". From then on your account behaves like that contract, while the private key still owns it — and still gets to revoke the delegation later by signing a new one.

The address does not change. That is the whole point, and it is what the earlier approach could not offer.

## What it buys you

- **One signature instead of three.** Approve and swap become a single batched call, so the approval that used to sit around unspent no longer exists.
- **Someone else can pay the gas.** A paymaster sponsors the fee, or takes it in a token you already hold rather than the native coin.
- **Limited keys.** A session key that can only do one thing, for one day, up to one amount.
- **Recovery.** Social or guardian recovery bolted onto the address you already use.

## Where ERC-4337 fits

ERC-4337 built account abstraction outside the protocol: a separate mempool of user operations, bundlers, an entry-point contract. It works, and it is the right answer for an account that does not exist yet. It could do nothing for the address you have been using for five years, because that address was an EOA and could not become anything else.

The two now split the work. ERC-4337 for fresh accounts, 7702 for the ones already in use.

## The part worth being careful about

A delegation is a blanket grant to whatever code lives at that address. If the contract is malicious, or is upgradeable into something malicious, the account is not partly at risk — it is gone.

- Read what you are signing. An authorization can be presented to look like an ordinary message signature.
- Prefer delegating to implementations your wallet ships and audits, not to an address a website hands you.
- Know how to revoke. Signing a delegation to the zero address clears it.

## Does it work on the chain you are on?

Not automatically. Each EVM network decides which upstream EIPs to adopt and when, so whether 7702 is live on a given chain is a question to ask the chain rather than to assume. Ordinary accounts work everywhere, which is what [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) walks through, and ordinary contracts deploy the usual way — see [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
