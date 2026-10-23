On 22 October 2026 Ethereum's core developers postponed Glamsterdam's activation on the Hoodi testnet, which had been set for 26 October, to investigate how EIP-8037 interacts with smart contracts already on mainnet. The decision was taken on All Core Devs Execution call #248, according to the Ethereum Foundation. The trigger was a security review, and ChainSecurity has since said it found 13 real-world contracts that could be affected. No new testnet or mainnet date has been set.

## Key facts

- **What:** the Glamsterdam fork on Hoodi, scheduled for 26 October 2026 at 17:42:48 UTC, is postponed, together with the step that would have raised Hoodi's gas limit to 200 million.
- **Who decided:** core developers on All Core Devs Execution (ACDE) call #248 on 22 October, according to the Ethereum Foundation.
- **Why:** EIP-8037, which reprices state creation and meters it separately. ChainSecurity's analysis of 13 October covers it together with EIP-8038.
- **The risk:** contracts that judge a failed call by how much gas is left could treat a retryable operation as permanently failed, without any change to their code.
- **The count:** 13 real-world contracts potentially affected, according to ChainSecurity, which is working through responsible disclosure and has not named them.
- **New date:** none. Mainnet dates of 1, 8 and 9 December were listed on the call's agenda for discussion; none was confirmed.

## What does EIP-8037 change?

It makes creating new state (new accounts, storage slots and contract code) more expensive, and it meters that cost separately from ordinary execution gas. The proposal's stated aim is to keep the growth of Ethereum's state in check as the block gas limit rises. The separate meter is what lets the limit go up without the higher state charges crowding out everything else.

On ChainSecurity's reading of the specification as of 13 October, writing a fresh storage slot would carry a state charge of 97,920 gas on top of its execution cost. That charge is paid first from a separate reservoir of gas, and the reservoir travels in full into every call a contract makes. When state creation is undone within a transaction, the gas comes back immediately.

## Why is that a risk to contracts already deployed?

Because some contracts make decisions based on how much gas is left.

The attack is called insufficient gas griefing. Someone triggers a valid operation but supplies just too little gas for it to succeed, while leaving enough for the calling contract to record the failure. A careful contract defends against this by checking the remaining gas after a failed call: if too little is left, it assumes the call ran out of gas and reverts everything, so the operation can be tried again.

That check rests on an assumption that has held for years: gas only goes down. Under the new rules it can come back, from a refill or from an intermediate contract that creates state and then reverts. A failure handler that used to run out of gas could now finish, and a contract could mark a user's withdrawal or claim as permanently failed. The researcher pcaversaccio summed it up in a comment on the call's agenda: "The fundamental 'broken' thing is that `gasleft()` can increase."

Nothing in the deployed bytecode has to change for this to happen. The environment under it does.

## What changed since our earlier Glamsterdam article?

Our [September explainer on Glamsterdam](/blog/ethereum-glamsterdam-upgrade) covered the fork's two headline items, block-level access lists and enshrined proposer-builder separation, and said they leave the opcodes you write against alone. That still holds for those two. It did not cover the gas repricing in EIP-8037 and EIP-8038, which changes what operations cost and, as above, how gas behaves during a call. Its expectation that the fork would activate in the second half of the year is now open, because there is no date.

## What should you do?

- **If you write contracts:** ChainSecurity's advice is to let a failed call revert the whole operation where you can, and where you cannot, to keep a recovery path rather than make an irreversible decision based on remaining gas. Test failure handlers under both the current and the Glamsterdam gas schedules, and do not treat an adjusted threshold as proof of safety.
- **If you run a Hoodi node or validator:** update both execution and consensus clients before 26 October to releases that explicitly remove the activation, or go back to an older release without it, according to the Ethereum Foundation.
- **If you hold ETH or use mainnet:** nothing, according to the Foundation.

## Does this affect other EVM chains?

Not automatically. EVM networks do not inherit upstream upgrades; each chain decides which EIPs to adopt and when. How Nura Chain runs EVM bytecode is covered in [Nura Chain's EVM compatibility](/blog/nura-chain-evm-compatibility). The wider lesson, that audited code can fail because what surrounds it changes, is the argument of [why audited contracts still get drained](/blog/why-audited-contracts-get-drained).

The technical analysis is [ChainSecurity's](https://www.chainsecurity.com/blog/glamsterdam-gas/), the proposal is [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) and the call agenda is [ACDE #248](https://github.com/ethereum/pm/issues/2267). The decision and its instructions are in the [Ethereum Foundation's announcement](https://blog.ethereum.org/2026/10/22/glamsterdam-hoodi-delay).
