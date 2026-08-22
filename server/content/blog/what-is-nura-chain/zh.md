Nura Chain 是一条运行以太坊虚拟机（EVM）的公链。如果你写过 Solidity 合约、在 MetaMask 里添加过网络，或者调用过以太坊的 JSON-RPC 接口，那么你已有的大部分知识在这里可以原样使用：同样的账户模型、同样的交易格式、同样的工具链。

这篇文章只做直白的说明。这条网络是什么、要与它通信需要哪些参数，以及今天围绕它真正存在的东西有哪些。

## 网络概览

以下是钱包或客户端库会向你索取的参数。

- 网络名称：Nura Mainnet
- 链 ID：`1020`，钱包通常要求填写十六进制形式 `0x3fc`
- RPC 端点：`https://rpc.nurachain.net`
- 区块浏览器：`https://explorer.nurachain.net`
- 原生代币：Nura Coin，代号 `NURA`，18 位小数
- 出块时间：约 3 秒

不要凭信任接受上面任何一条，包括来自本页面的。你只要问，端点自己就会报出它的链 ID：

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

返回是 `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`，而 `0x3fc` 换算成十进制正是 1020。这项检查只要十秒钟，却是你在往钱包里添加网络之前最值得养成的习惯。链 ID 填错，正是人们把交易广播到本不打算使用的网络上的原因。

## EVM 兼容在实践中意味着什么

以太坊虚拟机是以太坊为智能合约定义的执行环境。运行它的链会执行同样的已编译字节码、响应同样的 JSON-RPC 方法名，并使用同样的 20 字节地址格式。

对开发者而言，这带来三个具体结果。

- 合约用你现有的工具链就能编译。Solidity、Hardhat 和 Foundry 面向的是 EVM 而非某一条特定网络，所以新链只是一条配置项，而不是一次重写。
- 客户端库无需修改即可工作。ethers.js、viem、web3.py 和 wagmi 讲的都是 JSON-RPC，把它们指向新地址只是改一行。
- 私钥和地址可以沿用。同样的 secp256k1 密钥、同样的派生路径、同样的校验和地址格式。

它不意味着两条链共享任何东西。你在以太坊上控制的地址在这里同样归你，因为它由同一把私钥派生——但余额、已部署的合约和历史记录是完全独立的账本。把资产发到「另一条链上的同一地址」，并不会让它在两者之间转移。

这里的区块带有 EIP-1559 基础费，因此交易定价方式与 London 升级之后的以太坊一致：协议逐块确定一个基础费，再加上你自己选择附加的优先费。近几年写成的库默认都会这样处理。更多细节见[Nura Chain 如何执行 EVM 字节码](/blog/nura-chain-evm-compatibility)。

## 今天围绕网络存在的东西

有三样东西现在就已上线且可访问，值得精确说明是哪三样。

- RPC 端点。`https://rpc.nurachain.net` 响应标准的以太坊 JSON-RPC，并发送宽松的 CORS 头，因此浏览器中运行的页面可以直接从它读取数据。这一点在[连接 Nura Chain RPC](/blog/connect-to-nura-chain-rpc)中有详细说明。
- 区块浏览器。[Nura Explorer](https://explorer.nurachain.net) 索引区块、交易和转账，是你确认自己发出的东西确实发生了的地方，具体用法见[如何读懂 Nura Chain 区块浏览器](/blog/how-to-use-nura-chain-explorer)。
- Nura Wallet，一款自托管钱包，提供 Android、Windows 和 Linux 版本。它并不是唯一入口——任何支持自定义网络的 EVM 钱包都可以，这正是[把 Nura Chain 添加到你的钱包](/blog/add-nura-chain-to-your-wallet)所讲的内容。

此外还有一座桥，会在 Nura 上以普通 ERC-20 合约的形式铸造 BNB 和 USDT 的封装表示，以及位于 `https://swap.nurachain.net` 的兑换界面。

## 原生代币

Nura Coin，代号 `NURA`，是网络的原生资产，采用 18 位小数——这是 EVM 的惯例，而非在此另作的选择。它支付 gas，方式与以太坊上的 ether 完全相同。每笔交易都会消耗 gas，gas 以 NURA 计价，账户必须先有余额才能发出任何东西，包括它的第一次合约部署。

总供应量为 1,000,000,000 NURA。这一数量如何划分、每一部分各作何用，详见[Nura Coin 的供应与分配](/blog/nura-coin-tokenomics)。

## 常见问题

### Nura Chain 是以太坊的分叉吗？

它运行同一个虚拟机、提供同一套 RPC 接口，这正是以太坊工具无需修改就能在其上工作的原因。这是关于兼容性的陈述，而不是关于共享历史或共享状态的陈述。两条网络各自维护独立的账本。

### 我可以用 MetaMask 吗？

可以。任何支持添加自定义 EVM 网络的钱包，都能用上面的参数指向 Nura Chain，逐步操作见[把 Nura Chain 添加到你的钱包](/blog/add-nura-chain-to-your-wallet)。

### 做任何事之前都需要先有 NURA 吗？

读取链上数据不需要。RPC 端点会响应任何人的只读调用，这也正是区块浏览器无需账户就能展示整个网络的原因。发送交易或部署合约则需要：gas 用 NURA 支付。

### 出块有多快？

根据近期区块测算，大约每三秒一个。这是链产生区块的节奏，与「某笔具体交易何时被打包」并不是一回事。

## 下一步

如果你是来使用这条网络的，请从[把 Nura Chain 添加到你的钱包](/blog/add-nura-chain-to-your-wallet)开始。大约一分钟，其余一切都以它为前提。

如果你是来开发的，请从[连接 Nura Chain RPC](/blog/connect-to-nura-chain-rpc)起步，然后继续阅读[在 Nura Chain 上部署智能合约](/blog/deploy-a-smart-contract-on-nura-chain)。
