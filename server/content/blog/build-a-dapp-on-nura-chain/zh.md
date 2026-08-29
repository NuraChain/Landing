dApp 就是一个普通的网页应用，只有一点不寻常：它从不持有用户的私钥。它从链上读取，而当它想改变什么时，就请钱包来签名。下面的一切都源自这个分工。

## 两个半边

读与写是两条独立路径，把它们混为一谈是最常见的结构性错误。

**读**走你自己的 RPC 连接。它不需要钱包，在任何人连接之前就能工作，并且应当尽可能多地把界面渲染出来。余额、合约状态、价格、历史——这些都是公开的。

**写**走用户的钱包。它需要用户批准，可能被拒绝，而且这是唯一真正需要连接的部分。

先把读的路径做好。一个在有人连接之前只显示空白页的 dApp，会把空白页展示给每一个正在评估「要不要连接」的人。

## 读取

用一个指向端点的 public client，与[连接 Nura Chain RPC](/blog/connect-to-nura-chain-rpc) 中完全一致：

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

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

这个对象就是整个应用对该网络的唯一定义。请在各处导入它，而不要到处重复这些取值。

## 连接钱包

浏览器钱包会注入一个 EIP-1193 provider。现代的发现机制是 EIP-6963，它会announce每一个已安装的钱包，而不是争抢同一个全局变量——如果可能同时存在多个钱包，值得采用。最简版本：

```javascript
async function connect() {
    const provider = window.ethereum;

    if (provider === undefined) {
        throw new Error('No wallet found');
    }

    const [account] = await provider.request({ method: 'eth_requestAccounts' });

    return account;
}
```

请从点击事件里调用它，绝不要在页面加载时调用。页面一打开就弹出钱包提示的 dApp，用户会直接关掉。

## 让用户切到正确的网络

这是多数教程略过的一步，也是真实用户卡住的地方。已连接的钱包可能处在任意一条链上。请求它切换，并处理它从没听说过 Nura Chain 的情况：

```javascript
const NURA_HEX = '0x3fc';

async function ensureNura(provider) {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NURA_HEX }]
        });
    } catch (error) {
        // 4902: the wallet does not know this chain yet. Offer to add it, then
        // the switch above succeeds on the next attempt.
        if (error.code === 4902) {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: NURA_HEX,
                    chainName: 'Nura Chain',
                    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
                    rpcUrls: ['https://rpc.nurachain.net'],
                    blockExplorerUrls: ['https://explorer.nurachain.net']
                }]
            });
        } else {
            throw error;
        }
    }
}
```

`0x3fc` 是十六进制的 1020，钱包要的正是十六进制形式。`4902` 这一分支，正是把「点了没反应」变成一次可用的首次体验的关键——它就是[把 Nura Chain 添加到你的钱包](/blog/add-nura-chain-to-your-wallet)里描述的那个请求，只不过由你的页面发起，而不是让用户手动来做。

同时也要监听变更，因为用户可能在你不知情时切换网络或账户：

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

在 `chainChanged` 时重新加载虽然粗暴但正确：它保证不会有任何与链绑定的陈旧状态残留下来。

## 发送交易

```javascript
import { createWalletClient, custom, parseEther } from 'viem';

const walletClient = createWalletClient({
    chain: nura,
    transport: custom(window.ethereum)
});

const hash = await walletClient.sendTransaction({
    account,
    to: '0xRecipient',
    value: parseEther('1')
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });

if (receipt.status === 'reverted') {
    throw new Error('The transaction was included but reverted');
}
```

注意两点。钱包客户端负责发送，public client 负责等待。以及，状态为 `reverted` 的回执意味着这笔交易发生过、花掉了 gas，却没有完成要求的事——把它当作成功，是用户迟早会撞上的缺陷。

## 真正会出现的状态

以下每一种都要处理，因为它们都会经常发生：

- **没装钱包。** 给一个链接，而不是一个坏掉的按钮。
- **连接被拒绝。** 用户说了不。安静地回到未连接状态，不要再次弹窗。
- **网络不对。** 给一个切换按钮，而不是一条报错。这是造成用户困惑的最大单一来源。
- **交易在钱包里被拒绝。** 这不是错误状态。清掉待处理状态，继续。
- **待处理。** 显示哈希并附上 [Nura Explorer](https://explorer.nurachain.net) 的链接，让他们自己看。
- **已回滚。** 明说。带上哈希的「交易失败」，胜过一个永不停止的转圈动画。

## 不要做的事

- **不要索取私钥。** 永远不要，出于任何理由都不要。索取私钥的 dApp 与钓鱼页面无法区分。
- **不要默认申请无限额度的代币授权。** 只批准实际所需的数额。若确需较大额度，请在界面上说明。
- **不要相信保存在状态里的链 ID。** 在发送任何要紧的东西之前，从 provider 读一次。
- **不要让整个界面卡在钱包连接上。** 见第一节。
- **不要在每次渲染时轮询链。** 缓存读取结果，并共享在途请求。

## 常见问题

### 我需要后端吗？

读链和写链都不需要——两者都直接从浏览器发出，这正是该端点宽松的 CORS 所允许的。你需要后端的是链不擅长的事：搜索、聚合、链下数据。

### 我能用 wagmi 或 RainbowKit 吗？

可以。把第一段代码里那个 chain 定义传给它们即可。它们大体上封装的正是上面展示的连接与切换网络逻辑，在交给它们之前值得先自己理解一遍。

### 怎么显示代币余额？

在代币合约上调用 `balanceOf`，并用它自己的 `decimals()` 来格式化。永远不要假定小数位数——[在 Nura Chain 上创建 ERC-20](/blog/create-an-erc-20-token-on-nura-chain) 解释了这个假设在这里为何格外昂贵。

### 怎样在不花钱的情况下测试？

读取路径完全不需要资金。写入则用一个只放少量余额的一次性账户，并在浏览器上逐一确认结果。

## 下一步

如果你还没部署界面将要对话的那份合约，请从[在 Nura Chain 上部署智能合约](/blog/deploy-a-smart-contract-on-nura-chain)开始。

想确认你的应用究竟做了什么，[如何使用 Nura Chain 区块浏览器](/blog/how-to-use-nura-chain-explorer)就是相应的工具。至于这一切背后的网络基础，见[什么是 Nura Chain](/blog/what-is-nura-chain)。
