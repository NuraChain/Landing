Everything a program does with a blockchain goes through an RPC endpoint. This is the one for Nura Chain, what it will and will not do, and how to point the usual libraries at it.

## The endpoint

```text
https://rpc.nurachain.net
```

It speaks Ethereum JSON-RPC over HTTPS POST, and it belongs to chain ID `1020`. Read that second value from the endpoint rather than from here:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` is 1020. Every library below is given that number explicitly, and that is deliberate: a client told which chain it expects will refuse to proceed when the endpoint disagrees, which turns a silent wrong-network deployment into an error at startup.

## A first request with nothing installed

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

Results come back as hex quantities, not decimal numbers, and that catches people out constantly. `0x3aecc` is 241,356. Every client library converts for you; raw `curl` does not.

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

Passing the network as the second argument does two things. It skips an `eth_chainId` round trip on first use, and it makes the provider throw if the endpoint reports a different chain. The second is the one worth having.

## viem

viem wants a chain object, which is a good place to keep every value in one declaration:

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

That same `nura` object is what you hand to wagmi, and to viem's wallet client later.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

The assertion is three seconds of typing and has saved more deployments than any other line in this article.

## Reading from a browser

The endpoint sends permissive CORS headers, so a page can call it directly without a proxy of your own:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

Be clear about what that permits. Read calls work from the browser. Anything that requires a private key does not go through this endpoint at all — it goes through the user's wallet, which is a different path entirely and the subject of [building a dApp on Nura Chain](/blog/build-a-dapp-on-nura-chain).

## Methods that are refused, by design

Ask a public endpoint for accounts and it says no:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

That is correct behaviour rather than a missing feature. A public RPC node holds no keys on your behalf, so `eth_accounts`, `eth_sendTransaction` and `personal_*` have nothing to operate on. An endpoint that answered them would be an endpoint custodying somebody's funds.

The path for a signed transaction is: build it locally, sign it locally, and submit the signed bytes with `eth_sendRawTransaction`. Every library does this for you when you give it a wallet rather than a bare provider.

## Practical notes

- Do not poll on every render. Chain reads are network calls; cache them for a few seconds and share one in-flight request between callers that arrive together.
- Read the chain ID once at startup and fail loudly on a mismatch, rather than per call.
- Treat a failed read as a failed read, not as a zero. A balance that renders as 0 because a request timed out is worse than one that renders as an error.
- Do not hard-code gas prices. Ask for fee data at send time; see [how fees work here](/blog/nura-chain-evm-compatibility).

## Common questions

### Is there a rate limit?

Treat any public endpoint as rate-limited whether or not it advertises a number, and design for it: cache, batch, and back off on failure. An application that hammers a shared endpoint on every keystroke will eventually be throttled somewhere, and that is a reasonable thing for an operator to do.

### Can I use WebSockets or subscriptions?

Test for it rather than assuming. If `eth_subscribe` is not available, polling `eth_blockNumber` on a sensible interval is the portable fallback and is what most applications end up doing anyway.

### Why does my transaction never confirm?

The usual cause is a pinned gas price left over from a template, below the current base fee. Read fee data at send time instead.

### Can I run my own node?

Nothing here depends on using a hosted endpoint. An application that reads from your own node needs only a different URL, which is exactly the property that makes this architecture worth having.

## Where to go next

With reads working, the next step is writing: [deploying a smart contract on Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) covers Hardhat and Foundry configuration built on the values above.

To confirm what actually landed on chain, [how to use the Nura Chain explorer](/blog/how-to-use-nura-chain-explorer) is the companion piece. And if you arrived without context, [what Nura Chain is](/blog/what-is-nura-chain) is the place to start.
