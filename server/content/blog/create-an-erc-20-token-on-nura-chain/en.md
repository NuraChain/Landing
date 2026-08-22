An ERC-20 token is not a special kind of asset the chain knows about. It is an ordinary smart contract that keeps a mapping of address to balance and exposes an agreed set of functions. Everything else — wallets showing it, exchanges listing it, explorers indexing it — follows from implementing that interface correctly.

This walks through writing one, deploying it to Nura Chain, and the part that causes the most real losses: decimals.

## What ERC-20 actually specifies

A handful of functions and two events:

```solidity
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

`name()`, `symbol()` and `decimals()` are optional in the standard but universally expected — a wallet with no symbol to show will show the address instead.

The `Transfer` event is what makes a token visible. Explorers do not scan storage; they index events. A contract that moves balances without emitting `Transfer` is a token nothing can see.

## The contract

Do not write the arithmetic yourself. Use a reviewed implementation:

```bash
npm install @openzeppelin/contracts
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Example Token", "EXM") {
        _mint(msg.sender, initialSupply);
    }
}
```

That is a complete, working token. The temptation to add minting, pausing, blacklists and fee-on-transfer should be resisted until you can say precisely who is allowed to call each one, because every added privilege is an added way for the token to be taken from its holders.

## Decimals are the part that bites

`decimals()` is display metadata. It does not affect arithmetic. The contract stores integers, and `decimals` tells interfaces where to put the point.

With the conventional 18:

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

So minting "one million tokens" means:

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

Passing `1_000_000` instead mints a millionth of a millionth of a token, and the mistake is invisible until a wallet displays it.

The trap is assuming a symbol implies a decimal count. It does not, and Nura Chain has a live example. The bridged USDT contract here reports 18 decimals:

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

USDT on Ethereum uses 6. Same ticker, different decimal count, different contract on a different chain. Any integration that hard-codes "USDT means 6 decimals" is off by a factor of a trillion here. Always read `decimals()` from the contract you are actually talking to.

## Deploying

The configuration is the one from [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) — chain ID `1020`, RPC `https://rpc.nurachain.net`. The deploy script differs only in passing a constructor argument:

```javascript
import { ethers } from 'hardhat';

async function main() {
    const supply = ethers.parseUnits('1000000', 18);
    const token = await ethers.deployContract('ExampleToken', [supply]);

    await token.waitForDeployment();

    console.log('token at', await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

`parseUnits` exists so you never write the zeros by hand. Use it.

Afterwards, confirm the contract answers as a token rather than merely existing:

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## Making a wallet show it

Wallets do not discover tokens automatically. A holder adds the contract address once, under "import token" or similar, and the wallet reads `symbol` and `decimals` from the contract itself.

If your wallet is not yet pointed at this network at all, [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet) comes first.

## Two ERC-20s already on this chain

Worth looking at real ones rather than only your own. Both of these are ordinary ERC-20 contracts deployed on Nura Chain, representing bridged assets:

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

Query them the same way you queried your own, or open them in [Nura Explorer](https://explorer.nurachain.net). They are useful precisely because they are not examples written for a tutorial — they answer `name()`, `symbol()`, `decimals()` and `totalSupply()` like any other token, which is the point of a standard.

## Mistakes that cost money

- **Minting without the decimal shift**, as above.
- **Assuming a ticker implies decimals.** Read `decimals()`. Every time.
- **Trusting the symbol.** Anyone can deploy a contract calling itself `USDT`. The address is the identity; the name is a label the deployer chose.
- **Keeping an owner who can mint.** Unlimited mint authority means the supply is whatever the key holder says it is. If you keep it, say so publicly; if you do not need it, renounce it.
- **Sending tokens to the token contract itself.** A common slip, and usually irrecoverable.

## Common questions

### Do I need to register the token anywhere?

No. Deploying it is publishing it. Wallets and explorers read it from the chain. Listing on any third-party service is that service's own process.

### Can I change the supply later?

Only if the contract has a mint or burn function you deliberately included. The example above does not: its supply is fixed at construction, which is the honest default.

### What does the token cost to run?

Deployment costs gas once. After that, each transfer costs gas paid by whoever sends it — in NURA, not in your token.

### Should I write my own ERC-20 from scratch?

Not for anything holding value. The interface is small enough to look simple and has enough sharp edges (return values, allowance races, decimals) that a reviewed implementation is the right default.

## Where to go next

To put a working interface in front of the token, see [building a dApp on Nura Chain](/blog/build-a-dapp-on-nura-chain), which covers wallet connection and sending transactions from a page.

To watch transfers land as they happen, [how to use the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) explains reading a token's event history. And for the mechanics underneath all of it, [how Nura Chain runs EVM bytecode](/blog/nura-chain-evm-compatibility).
