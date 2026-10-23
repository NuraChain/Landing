On 21 October 2026 the cloud hosting platform Railway disclosed that an unauthorised party may have accessed the encrypted environment variables its customers store, and read the decrypted contents of some of them. Blockchain investigator Taylor Monahan has linked the Railway breach to about $371,000 in crypto drained across at least 19 EVM chains, on her estimate as reported by crypto.news on 22 October. Railway has not confirmed any crypto theft. The pattern is a familiar one: a private key kept where a server could read it was read by someone else.

## Key facts

- **The disclosure:** Railway, 21 October 2026 — anomalous activity in the systems that store customer environment variables, which can hold API keys and database and registry credentials.
- **The alleged theft:** about $371,000 in more than 500 transactions from over 200 addresses on at least 19 EVM networks, according to Taylor Monahan as of 22 October. A developer posting as ethereumdegen.eth put it at roughly $370,000.
- **Timing:** on Monahan's timeline the first theft landed at 19:36 UTC on 21 October; Railway's notice went up at about 21:51 UTC.
- **Railway's response:** deployments paused, every customer told to rotate all stored variables, all Railway API tokens invalidated at 04:17 UTC on 22 October according to CryptoSlate, and storage bucket credentials and GitHub tokens reset the same day.
- **Not established:** the root cause, the number of affected customers, and whether the drained wallets' keys came from Railway.

## What did Railway actually disclose?

That secrets it held for customers may have been read.

Railway's notice says it detected the activity on the morning of 21 October and believes an unauthorised third party may have accessed encrypted environment variables and obtained the decrypted contents of some of them. Its initial analysis points to a subset of users, but it asked everyone to roll all variables and private registry credentials and to check their service logs. It believes the incident is part of a series of attacks on platform companies aimed at AI inference providers, and has asked upstream providers to revoke keys. The notice does not mention crypto, wallets or private keys.

## How is it linked to crypto theft?

Through the wallets that were swept, not through anything Railway said.

Monahan linked the drains to the incident and described the transactions as using a fairly standard wallet sweeper script, according to crypto.news. Her first theft sits more than two hours before Railway went public. The accounts do not fully agree: Railway customer success engineer Noah Dunnagan wrote on X that the company had reason to believe the attack exploited only AI inference tokens, as reported by The Defiant. Railway has not confirmed the losses, and the $371,000 figure is an outside estimate.

## Why is an environment variable a bad place for a private key?

Because the platform has to be able to read it.

An environment variable is how a hosting platform hands a secret to your process when it starts. To do that, the platform stores the value, encrypted at rest, together with the means to decrypt it. That is acceptable for an API key that can be revoked in a minute. A private key cannot be revoked. Whoever reads it once controls the address for good, and the only remedy is to move the funds before they do — and a sweeper script is built to move first.

This is the same argument as [why audited contracts still get drained](/blog/why-audited-contracts-get-drained): the code holds, and the money leaves through what is around it.

## How should developers keep keys out of hosting?

- **Do not put a funded key in a platform's variables.** If a service must sign, give it a key that holds only what it needs today.
- **Sign somewhere else.** A key management service or a separate signer holds the key and signs on request, so the application never sees it.
- **Never store a seed phrase on a server.** One phrase derives every address in the wallet.
- **Separate deploy keys from treasury keys.** The key that deploys a contract should not be the key that holds its funds.
- **Rotate on disclosure, and move funds first.** For a private key, rotating means a new key and a transfer, not a new string.
- **Watch the addresses.** An alert on any outgoing transfer is how you learn in minutes rather than days.

## What does this mean for building on Nura Chain?

The same rules apply. Our guide to [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) reads the deployer key from an environment variable on your own machine, and says to use a throwaway key for a first deployment, not the one holding your balance. That is a local, short-lived key. A funded, long-lived key on a hosted platform is a different risk, and the advice above is for that one.

Details will change as Railway's investigation continues. The primary source is [Railway's security disclosure of 21 October 2026](https://blog.railway.com/p/security-disclosure-wednesday-october-21st).
