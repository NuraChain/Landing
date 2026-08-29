程序与区块链之间的一切往来，都要经过一个 RPC 端点。这就是 Nura Chain 的端点：它能做什么、不能做什么，以及如何把常用的库指向它。

## 端点

```text
https://rpc.nurachain.net
```

它通过 HTTPS POST 讲以太坊 JSON-RPC，隶属于链 ID `1020`。第二个值请从端点读取，而不是从这里：

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` 即 1020。下面每个库都显式地拿到了这个数字，这是有意为之：一个被告知自己预期哪条链的客户端，会在端点与之不符时拒绝继续，从而把「悄无声息地部署到错误网络」变成启动时的一个报错。

## 什么都不装的第一个请求

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

返回值是十六进制数量而不是十进制数字，这一点总有人栽跟头。`0x3aecc` 是 241,356。任何客户端库都会替你转换，裸 `curl` 不会。

## ethers.js

```javascript
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://rpc.nurachain.net', {
    chainId: 1020,
    name: 'nura'
});

const [height, fees] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData()
]);

console.log(height, fees.maxFeePerGas);
```

把网络作为第二个参数传入有两个作用：省掉首次使用时的一次 `eth_chainId` 往返；以及在端点报告的链不同时让 provider 抛错。真正值得的是第二点。

## viem

viem 需要一个 chain 对象，这正是把所有取值集中在一处声明的好地方：

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Chain',
    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

const client = createPublicClient({ chain: nura, transport: http() });

console.log(await client.getBlockNumber());
```

同一个 `nura` 对象，之后你会交给 wagmi，也会交给 viem 的 wallet client。

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

写下这句断言只要三秒钟，而它挽救过的部署比本文任何一行都多。

## 从浏览器读取

该端点发送宽松的 CORS 头，因此页面可以直接调用它，不需要你自建代理：

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

要说清楚这允许什么。只读调用可以从浏览器发起。任何需要私钥的操作根本不走这个端点——它走用户的钱包，那是完全不同的一条路径，也是[在 Nura Chain 上构建 dApp](/blog/build-a-dapp-on-nura-chain) 的主题。

## 被有意拒绝的方法

向公共端点索要账户，它会拒绝：

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

这是正确行为，而不是缺失的功能。公共 RPC 节点不代你保管任何私钥，所以 `eth_accounts`、`eth_sendTransaction` 和 `personal_*` 根本无从下手。一个会响应它们的端点，就是一个在托管别人资金的端点。

签名交易的路径是：在本地构造、在本地签名，然后用 `eth_sendRawTransaction` 提交已签名的字节。只要你给库的是钱包而不是裸 provider，这些库都会替你完成。

## 实务要点

- 不要在每次渲染时轮询。链上读取是网络调用；缓存几秒，并让同时到达的调用方共享同一个在途请求。
- 在启动时读一次链 ID，不匹配就大声失败，而不是每次调用都查。
- 把失败的读取当作失败，而不是当作零。因请求超时而显示为 0 的余额，比显示为错误的余额更糟。
- 不要把 gas 价格写死。在发送时索取手续费数据；参见[这里的手续费如何运作](/blog/nura-chain-evm-compatibility)。

## 常见问题

### 有速率限制吗？

无论是否公布了具体数字，都把任何公共端点当作有速率限制的来对待，并据此设计：缓存、批量、失败退避。一个每次按键都去猛敲共享端点的应用，迟早会在某处被限流，而运营方这样做是合理的。

### 我能用 WebSocket 或订阅吗？

去测试，而不要假设。如果 `eth_subscribe` 不可用，以合理间隔轮询 `eth_blockNumber` 是可移植的退路，而大多数应用最终采用的也正是这个办法。

### 为什么我的交易一直不确认？

常见原因是从模板里沿用下来的写死 gas 价格，低于当前基础费。改为在发送时读取手续费数据。

### 我可以自己跑节点吗？

以上内容没有一处依赖托管端点。一个从你自己的节点读取的应用，只需要换一个 URL——而这恰恰是这套架构值得采用的原因。

## 下一步

读取跑通之后，下一步就是写入：[在 Nura Chain 上部署智能合约](/blog/deploy-a-smart-contract-on-nura-chain)涵盖了基于上述取值的 Hardhat 与 Foundry 配置。

要确认链上究竟落下了什么，[如何使用 Nura Chain 区块浏览器](/blog/how-to-use-nura-chain-explorer)是配套的一篇。如果你是毫无背景地来到这里，[什么是 Nura Chain](/blog/what-is-nura-chain) 才是起点。
