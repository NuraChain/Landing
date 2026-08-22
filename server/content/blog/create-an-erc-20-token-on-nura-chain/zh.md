ERC-20 代币并不是链本身认识的某种特殊资产。它就是一份普通的智能合约，维护一张「地址到余额」的映射，并暴露一组约定好的函数。其余一切——钱包显示它、交易所上架它、浏览器索引它——都源自把那个接口正确实现出来。

本文走一遍：怎么写一个、怎么部署到 Nura Chain，以及造成最多真实损失的那一环：小数位。

## ERC-20 究竟规定了什么

寥寥几个函数和两个事件：

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

`name()`、`symbol()` 和 `decimals()` 在标准里是可选的，但所有人都默认它们存在——钱包若没有符号可显示，就会改而显示地址。

`Transfer` 事件正是让代币「可见」的东西。浏览器不会去扫描存储，它们索引事件。一份挪动余额却不发出 `Transfer` 的合约，是任何工具都看不见的代币。

## 合约

不要自己写算术。用一份经过审阅的实现：

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

这已经是一份完整可用的代币。在你还说不清每个权限「究竟允许谁调用」之前，请克制住添加增发、暂停、黑名单和转账手续费的冲动——每多一项特权，就多一条把代币从持有者手中拿走的路径。

## 小数位是会咬人的那一环

`decimals()` 是显示用的元数据，不影响算术。合约里存的是整数，`decimals` 只是告诉界面把小数点放在哪儿。

按惯例的 18 位：

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

所以增发「一百万枚代币」意味着：

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

若改传 `1_000_000`，铸出来的是一枚代币的一万亿分之一，而这个错误在钱包显示出来之前是看不见的。

真正的陷阱是以为符号能推断出小数位数。它不能，而 Nura Chain 上就有一个活生生的例子。这里跨链而来的 USDT 合约报告的是 18 位小数：

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

而以太坊上的 USDT 用的是 6 位。同样的代号、不同的小数位数、不同链上的不同合约。任何把「USDT 就是 6 位小数」写死的集成，在这里会差出一万亿倍。永远从你真正在对话的那份合约里读取 `decimals()`。

## 部署

配置就是[在 Nura Chain 上部署智能合约](/blog/deploy-a-smart-contract-on-nura-chain)那一套——链 ID `1020`，RPC 为 `https://rpc.nurachain.net`。部署脚本只多了一个构造函数参数：

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

`parseUnits` 存在的意义就是让你永远不必手写那串零。用它。

之后，确认这份合约是「以代币的身份作答」，而不只是「存在」：

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## 让钱包显示它

钱包不会自动发现代币。持有者在「导入代币」之类的入口把合约地址添加一次，钱包便会从合约本身读取 `symbol` 和 `decimals`。

如果你的钱包还没指向这条网络，那么[把 Nura Chain 添加到你的钱包](/blog/add-nura-chain-to-your-wallet)要排在前面。

## 这条链上已有的两份 ERC-20

值得看看真实的代币，而不只是你自己的。下面两份都是部署在 Nura Chain 上的普通 ERC-20 合约，代表跨链而来的资产：

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

用你查询自己代币的方式去查询它们，或在 [Nura Explorer](https://explorer.nurachain.net) 中打开。它们有用，恰恰因为它们不是为教程写的例子——它们和任何别的代币一样回应 `name()`、`symbol()`、`decimals()` 和 `totalSupply()`，而这正是「标准」的意义所在。

## 会让人赔钱的错误

- **增发时忘了小数位移**，如上所述。
- **以为代号能推断小数位。** 读 `decimals()`。每一次都读。
- **相信符号。** 任何人都能部署一份自称 `USDT` 的合约。身份是地址；名字只是部署者挑的标签。
- **保留一个能增发的所有者。** 无上限的增发权意味着供应量就是持钥人说了算。若你保留它，请公开说明；若不需要，就放弃它。
- **把代币发送到代币合约本身。** 常见的手滑，而且通常不可挽回。

## 常见问题

### 我需要去哪里登记这个代币吗？

不需要。部署即发布。钱包和浏览器都从链上读取它。至于在任何第三方服务上架，那是该服务自己的流程。

### 之后能改变供应量吗？

只有当合约里有你刻意加入的增发或销毁函数时才行。上面的例子没有：它的供应量在构造时就固定了，而这是诚实的默认。

### 运行这个代币要花多少钱？

部署时消耗一次 gas。此后每笔转账的 gas 由发送方支付——用 NURA，而不是用你的代币。

### 我该从零手写 ERC-20 吗？

凡是承载价值的东西，都不该。这个接口小到看起来很简单，却有足够多的尖角（返回值、allowance 竞态、小数位），所以采用经过审阅的实现才是正确的默认选择。

## 下一步

想给代币配上可用的界面，请看[在 Nura Chain 上构建 dApp](/blog/build-a-dapp-on-nura-chain)，其中涵盖钱包连接与从页面发送交易。

想实时看着转账落链，[如何使用 Nura Chain 区块浏览器](/blog/how-to-use-nura-chain-explorer)讲解了如何读取代币的事件历史。至于这一切底下的机制，见[Nura Chain 如何执行 EVM 字节码](/blog/nura-chain-evm-compatibility)。
