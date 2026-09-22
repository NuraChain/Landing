Two figures from 2026 get quoted against each other as though one refutes the other.

The first: protocols that had completed an independent security audit account for about 88% of all funds stolen since January 2025 — 147 of 245 breached platforms had been cleared by an auditor before the attacker arrived. The second: only around 11% of incidents involved an in-scope smart contract flaw, though those still cost about $396 million.

Both are true, and together they say something precise. Audits are working on the thing they audit. The money is leaving through everything else.

## Where it actually goes

Supply chain and infrastructure breaches took more than $1.8 billion over the same period — the single largest category. That means a compromised build pipeline, a stolen deployment key, a malicious dependency, a front end serving different code than the repository holds, an employee phished into approving something.

None of that is a contract bug. All of it drains a contract.

The totals are improving, incidentally: attackers carried out 207 separate hacks in the first half of 2026 but took $972 million, less than half the $2.3 billion of the first half of 2025. More incidents, less money. Defences are working at the protocol layer and the attackers have moved.

## What an audit actually promises

An audit is a review of specified code at a specified commit against a specified threat model. It is genuinely useful and it is genuinely narrow.

It does not cover the key that deploys the contract, the CI that builds it, the npm package it imports, the domain that serves the interface, the multisig signer who approves an upgrade, or the oracle it trusts for a price. Every one of those is outside the scope, and several of them are easier to attack than the code.

## The boring controls that actually hold

- **Treat the deployment key like the treasury.** Hardware, multisig, and a threshold that survives losing one person.
- **Pin your dependencies.** Lockfiles, integrity hashes, and a deliberate decision every time something updates.
- **Make the front end verifiable.** A build somebody else can reproduce from the tagged source, and a way to notice when the served bundle stops matching.
- **Rehearse the upgrade path.** Who can pause, who can upgrade, how long it takes, and what happens if two of them are unreachable.
- **Re-audit the diff, not the release.** The audited artefact is a commit. Anything after it is unreviewed by definition.

## Reading a contract yourself

None of this requires trusting a summary. On an EVM chain the deployed bytecode, the verified source and every transaction against it are public, which is exactly what a block explorer is for — [how to read the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) covers where to look, and [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) covers verification from the other side.

The habit worth forming: before you approve anything, check that the address you are approving is the address the project publishes, and that it is verified. It takes a minute and it catches the attack that no audit was ever going to.

Figures are third-party incident data covering January 2025 to mid-2026; methodologies differ between reports.
