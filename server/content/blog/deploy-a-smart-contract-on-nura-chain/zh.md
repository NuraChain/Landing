部署到 Nura Chain 就是部署到一条 EVM 网络，因此工具还是你熟悉的那一套。下面是配置、一份合约、部署步骤，以及大多数教程会略过的一环：如何确认东西真的落到了链上。

## 开始之前

三样东西。

- 一个有余额的账户。部署是一笔交易，交易要消耗 gas，而 gas 用 NURA 支付。空账户无法部署。
- 一把你愿意放进环境变量的私钥。第一次部署请用可丢弃的私钥，而不是存着你余额的那把。
- Node.js，以及 Hardhat 或 Foundry 其中之一。

永远不要把私钥提交进仓库。下面所有示例都从环境读取，而承载它的文件应当在装进任何真实内容之前就进入 `.gitignore`。

## Hardhat 配置

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

`chainId` 这一行不是装饰。Hardhat 会把它和端点报告的值对照，不一致就拒绝继续——正是这项检查，能拦住一次本不打算发往某条网络的部署。

关于 Solidity 版本：请编译到一个成熟的目标，而不是可用的最新版本。较新的编译器默认指向一个网络尚未采纳的 EVM 版本时，产出的字节码会成功部署、随后行为诡异，这种失败远比编译报错糟糕。

## 一份值得部署的合约

要带状态，这样才有办法判断它是否工作：

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

那个事件对下一节很关键：事件正是区块浏览器索引的对象，因此一个会发出事件的合约，才是你能从外部核验的合约。

## 部署

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

然后：

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

请保留 `waitForDeployment` 这一行。没有它，脚本会在交易被打包之前就打印出一个地址并退出，你手上便留下一个可能有代码、也可能没有代码的地址。

## 确认它已落地

脚本打印出的地址是一个预测，不是事实。去问链本身：

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

已部署的合约会返回一长串十六进制。结果为 `0x` 则表示该地址上没有代码——部署回滚了、gas 用尽了，或者发往了另一条网络。这一次调用就把「成功了」和「脚本没有抛错」区分开来，而这两者并不是一回事。

接着在 [Nura Explorer](https://explorer.nurachain.net) 中打开该地址并查看这笔交易。[如何读懂浏览器](/blog/how-to-use-nura-chain-explorer)会讲清各字段的含义。

## 在 Foundry 里做同样的事

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

事后不离开终端就能核对：

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

第二条应当打印 `1020`。把它变成习惯。

## gas 与手续费

这里的区块带 EIP-1559 基础费，所以让工具去估算，别写死 `gasPrice`。Hardhat 与 Foundry 都会从端点读取手续费数据并默认构造 type-2 交易；部署迟迟不被打包的常见原因，是从别的项目配置里抄来的写死 gas 价格，低于当前基础费。原理见[Nura Chain 如何执行 EVM 字节码](/blog/nura-chain-evm-compatibility)。

## 值得辨认的失败

- **「insufficient funds for gas」。** 账户没有 NURA。先充值。
- **「invalid chain id」或网络不匹配。** 你的配置与端点不一致。读一次 `eth_chainId` 并修正配置。
- **交易永远挂着。** 手续费过低，或同一账户上早前卡住的交易造成了 nonce 空洞。
- **`eth_getCode` 返回 `0x`。** 无论脚本打印了什么，部署都没有成功。去查交易回执并检查其状态。

## 常见问题

### 我能部署一份已经在别的链上的合约吗？

通常可以，原样即可，前提是它没有写死那条网络上的地址，也不依赖这里并不存在的服务。字节码本身是可移植的。

### 它会拿到和另一条链上相同的地址吗？

只有当你用同一账户、在同一 nonce 上部署时才会，因为合约地址正是由这两者派生的。若你需要地址刻意一致，请配合确定性部署器使用 `CREATE2`。

### 怎么在浏览器上验证源码？

看看浏览器是否提供验证表单。验证是给阅读者的便利，而不是合约的属性，所以合约无论源码是否公开，运行方式都一样。

### 我该用代理来做可升级吗？

只有在确有需要时。代理带来存储布局的隐患，以及一把会成为系统中最有价值之物的管理员私钥。对多数项目而言，一个可以重新部署的不可变合约更简单也更安全。

## 下一步

下一个顺理成章的部署是代币：[在 Nura Chain 上创建并部署 ERC-20](/blog/create-an-erc-20-token-on-nura-chain) 正是直接建立在这份配置之上。

想给已部署的东西加上前端，请看[在 Nura Chain 上构建 dApp](/blog/build-a-dapp-on-nura-chain)。若上面的连接细节对你还比较陌生，[连接 Nura Chain RPC](/blog/connect-to-nura-chain-rpc) 会把它们讲透。
