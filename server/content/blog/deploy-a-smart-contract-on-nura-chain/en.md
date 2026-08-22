Deploying to Nura Chain is deploying to an EVM network, so the tooling is the tooling you already know. What follows is the configuration, a contract, the deploy step, and — the part most guides skip — how to confirm the thing actually landed.

## Before you start

Three things.

- A funded account. Deployment is a transaction, transactions cost gas, and gas is paid in NURA. An empty account cannot deploy.
- A private key you are willing to put in an environment variable. Use a throwaway key for a first deployment, not the one holding your balance.
- Node.js and either Hardhat or Foundry.

Never commit a key. Every example below reads from the environment, and the file holding it belongs in `.gitignore` before it holds anything real.

## Hardhat configuration

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.24',
        settings: { optimizer: { enabled: true, runs: 200 } }
    },
    networks: {
        nura: {
            url: 'https://rpc.nurachain.net',
            chainId: 1020,
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : []
        }
    }
};

export default config;
```

The `chainId` line is not decoration. Hardhat compares it against what the endpoint reports and refuses to continue if they differ, which is the check that stops a deployment going to a network you did not mean.

On the Solidity version: compile for a well-established target rather than the newest release available. A recent compiler defaulting to an EVM version the network has not adopted produces bytecode that deploys and then behaves strangely, which is a far worse failure than a compile error.

## A contract worth deploying

Something with state, so there is a way to tell it works:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Registry {
    event Recorded(address indexed who, string note);

    mapping(address => string) private notes;

    function record(string calldata note) external {
        notes[msg.sender] = note;
        emit Recorded(msg.sender, note);
    }

    function noteOf(address who) external view returns (string memory) {
        return notes[who];
    }
}
```

The event matters for the next section: events are what an explorer indexes, so a contract that emits them is a contract you can verify from outside.

## Deploying

```javascript
import { ethers } from 'hardhat';

async function main() {
    const factory = await ethers.getContractFactory('Registry');
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log('deployed to', await contract.getAddress());
    console.log('tx', contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Then:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

`waitForDeployment` is the line to keep. Without it the script prints an address and exits before the transaction is mined, and you are left with an address that may or may not have code at it.

## Confirming it landed

An address printed by a script is a prediction, not a fact. Ask the chain:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

A deployed contract returns a long hex string. A result of `0x` means there is no code at that address — the deployment reverted, ran out of gas, or went to a different network. That single call distinguishes "it worked" from "the script did not throw", and those are not the same thing.

Then open the address in [Nura Explorer](https://explorer.nurachain.net) and look at the transaction. [Reading the explorer](/blog/how-to-use-nura-chain-explorer) covers what the fields mean.

## The same thing in Foundry

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

And to check it afterwards without leaving the terminal:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

The second should print `1020`. Make it a habit.

## Gas and fees

Blocks here carry an EIP-1559 base fee, so let your tooling estimate rather than pinning a `gasPrice`. Both Hardhat and Foundry read fee data from the endpoint and build a type-2 transaction by default; the usual reason a deployment hangs unmined is a hard-coded gas price copied from another project's config, sitting below the current base fee. The mechanics are in [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility).

## Failures worth recognising

- **"insufficient funds for gas".** The account has no NURA. Fund it first.
- **"invalid chain id" or a network mismatch.** Your config and the endpoint disagree. Read `eth_chainId` and fix the config.
- **The transaction is pending forever.** Fee too low, or a nonce gap from an earlier stuck transaction on the same account.
- **`eth_getCode` returns `0x`.** The deployment did not succeed, whatever the script printed. Look up the transaction receipt and check its status.

## Common questions

### Can I deploy a contract I already have on another chain?

Usually yes, unmodified, provided it does not hard-code an address from that other network or depend on a service that does not exist here. The bytecode itself is portable.

### Will it get the same address as on another chain?

Only if you deploy from the same account at the same nonce, because a contract address is derived from those two. Use `CREATE2` with a deterministic deployer if you need the address to match deliberately.

### How do I verify the source on the explorer?

Check the explorer for a verification form. Verification is a convenience for readers rather than a property of the contract, so a contract works identically whether or not its source is published.

### Should I use a proxy for upgradeability?

Only if you genuinely need it. Proxies add storage-layout hazards and an admin key that becomes the most valuable thing in the system. An immutable contract you can redeploy is simpler and safer for most projects.

## Where to go next

The obvious next deployment is a token: [creating and deploying an ERC-20 on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) builds directly on this configuration.

To put a frontend in front of what you deployed, see [building a dApp on Nura Chain](/blog/build-a-dapp-on-nura-chain). And if any of the connection details above were unfamiliar, [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc) covers them properly.
