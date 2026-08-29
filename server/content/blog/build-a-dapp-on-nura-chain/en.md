A dApp is an ordinary web application with one unusual property: it never holds the user's key. It reads from a chain, and when it wants to change something it asks a wallet to sign. Everything below follows from that split.

## The two halves

Reading and writing are separate paths, and conflating them is the most common structural mistake.

**Reading** goes through your own RPC connection. It needs no wallet, works before anyone connects, and should render as much of your interface as possible. Balances, contract state, prices, history — all of it is public.

**Writing** goes through the user's wallet. It needs their approval, it can be rejected, and it is the only part that requires a connection at all.

Build the read path first. A dApp that shows a blank page until someone connects a wallet is a dApp that shows a blank page to everyone evaluating whether to connect.

## Reading

Use a public client pointed at the endpoint, exactly as in [connecting to the Nura Chain RPC](/blog/connect-to-nura-chain-rpc):

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

That object is the single definition of the network for the whole application. Import it everywhere rather than repeating the values.

## Connecting a wallet

A browser wallet injects an EIP-1193 provider. The modern discovery mechanism is EIP-6963, which announces every installed wallet rather than fighting over one global — worth using if more than one wallet might be present. The minimal version:

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

Call this from a click, never on page load. A dApp that pops a wallet prompt the moment the page opens is one users close.

## Getting them onto the right network

This is the step most guides skip, and it is where real users get stuck. A connected wallet may be on any chain. Ask it to switch, and handle the case where it has never heard of Nura Chain:

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

`0x3fc` is 1020 in hex, and wallets want the hex form. The `4902` branch is what turns "nothing happens when I click" into a working first-time experience — it is the same request described in [adding Nura Chain to your wallet](/blog/add-nura-chain-to-your-wallet), issued by your page instead of by hand.

Also listen for changes, because the user can switch networks or accounts behind your back:

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

Reloading on `chainChanged` is crude but correct: it guarantees no stale chain-specific state survives.

## Sending a transaction

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

Two things to notice. The wallet client sends; the public client waits. And a receipt with status `reverted` is a transaction that happened, cost gas and did not do what was asked — treating it as success is a bug users will find.

## The states that actually happen

Handle all of these, because each one occurs regularly:

- **No wallet installed.** Show a link, not a broken button.
- **Connection rejected.** The user said no. Return to the unconnected state quietly; do not re-prompt.
- **Wrong network.** Offer a switch button rather than an error. This is the single biggest source of confused users.
- **Transaction rejected in the wallet.** Not an error condition. Clear the pending state and carry on.
- **Pending.** Show the hash and a link to [Nura Explorer](https://explorer.nurachain.net) so they can watch it themselves.
- **Reverted.** Say so plainly. "Transaction failed" with the hash beats a spinner that never stops.

## What not to do

- **Do not ask for a private key.** Ever, for any reason. A dApp that asks is indistinguishable from a phishing page.
- **Do not request unlimited token approvals by default.** Approve the amount actually needed. If you must use a large allowance, say so in the interface.
- **Do not trust a chain ID from state.** Read it from the provider before sending anything that matters.
- **Do not block the whole interface on a wallet connection.** See the first section.
- **Do not poll the chain on every render.** Cache reads and share in-flight requests.

## Common questions

### Do I need a backend?

Not for reading or writing to the chain — both go directly from the browser, which is what the endpoint's permissive CORS makes possible. You need a backend for the things chains are bad at: search, aggregation, off-chain data.

### Can I use wagmi or RainbowKit?

Yes. Pass them the same chain definition from the first snippet. They mostly wrap the connection and network-switching logic shown above, which is worth understanding once before delegating it.

### How do I show token balances?

Call `balanceOf` on the token contract and format with its own `decimals()`. Never assume the decimal count — [creating an ERC-20 on Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) explains why that assumption is expensive here specifically.

### How do I test without spending anything?

Read paths need no funds at all. For writes, use a throwaway account with a small balance, and confirm each result on the explorer.

## Where to go next

If you have not deployed the contract your interface will talk to, start at [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).

To confirm what your application actually did, [how to use the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) is the tool for it. And for the network fundamentals behind all of this, [what Nura Chain is](/blog/what-is-nura-chain).
