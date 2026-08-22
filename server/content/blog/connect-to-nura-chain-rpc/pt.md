Tudo o que um programa faz com uma blockchain passa por um endpoint RPC. Este é o da Nura Chain: o que ele faz, o que não faz e como apontar as bibliotecas usuais para ele.

## O endpoint

```text
https://rpc.nurachain.net
```

Ele fala JSON-RPC do Ethereum sobre HTTPS POST e pertence ao ID de cadeia `1020`. Leia esse segundo valor do endpoint, e não daqui:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` é 1020. Cada biblioteca abaixo recebe esse número explicitamente, e isso é proposital: um cliente que sabe qual cadeia espera vai se recusar a prosseguir quando o endpoint discordar, o que transforma uma implantação silenciosa na rede errada num erro logo na inicialização.

## Uma primeira requisição sem instalar nada

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

Os resultados voltam como quantidades hexadecimais, não como números decimais, e isso pega as pessoas de surpresa o tempo todo. `0x3aecc` é 241.356. Qualquer biblioteca cliente converte para você; o `curl` puro não.

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

Passar a rede como segundo argumento faz duas coisas: economiza uma ida e volta de `eth_chainId` no primeiro uso e faz o provedor lançar erro se o endpoint informar outra cadeia. A segunda é a que vale ter.

## viem

A viem quer um objeto chain, e esse é um bom lugar para manter todos os valores numa única declaração:

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Mainnet',
    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

const client = createPublicClient({ chain: nura, transport: http() });

console.log(await client.getBlockNumber());
```

Esse mesmo objeto `nura` é o que você entrega depois ao wagmi e ao wallet client da viem.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

Escrever essa asserção leva três segundos e já salvou mais implantações do que qualquer outra linha deste artigo.

## Lendo pelo navegador

O endpoint envia cabeçalhos CORS permissivos, então uma página pode chamá-lo diretamente sem um proxy seu:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

Vale ser claro sobre o que isso permite. Chamadas de leitura funcionam pelo navegador. Qualquer coisa que exija uma chave privada não passa por este endpoint de forma alguma — passa pela carteira do usuário, que é um caminho totalmente diferente e o assunto de [construir um dApp na Nura Chain](/blog/build-a-dapp-on-nura-chain).

## Métodos recusados por projeto

Peça contas a um endpoint público e ele diz não:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

Isso é comportamento correto, não um recurso faltando. Um nó RPC público não guarda chaves em seu nome, então `eth_accounts`, `eth_sendTransaction` e `personal_*` não têm sobre o que operar. Um endpoint que as respondesse seria um endpoint custodiando o dinheiro de alguém.

O caminho de uma transação assinada é: monte localmente, assine localmente e envie os bytes assinados com `eth_sendRawTransaction`. Qualquer biblioteca faz isso por você assim que recebe uma carteira em vez de um provedor puro.

## Notas práticas

- Não consulte a cada renderização. Leituras de cadeia são chamadas de rede; guarde-as em cache por alguns segundos e compartilhe uma única requisição em voo entre chamadores que chegam juntos.
- Leia o ID da cadeia uma vez na inicialização e falhe ruidosamente se não bater, em vez de checar a cada chamada.
- Trate uma leitura falha como falha, não como zero. Um saldo exibido como 0 porque a requisição expirou é pior do que um exibido como erro.
- Não fixe preços de gás no código. Peça dados de taxa na hora do envio; veja [como as taxas funcionam aqui](/blog/nura-chain-evm-compatibility).

## Perguntas frequentes

### Existe limite de requisições?

Trate qualquer endpoint público como limitado, anuncie ele um número ou não, e projete para isso: cache, agrupamento e recuo em caso de falha. Uma aplicação que martela um endpoint compartilhado a cada tecla vai acabar estrangulada em algum ponto, e é razoável que um operador faça isso.

### Posso usar WebSockets ou assinaturas?

Teste em vez de supor. Se `eth_subscribe` não estiver disponível, consultar `eth_blockNumber` num intervalo sensato é o recurso portátil, e é o que a maioria das aplicações acaba fazendo de qualquer forma.

### Por que minha transação nunca confirma?

A causa usual é um preço de gás fixado, herdado de um template, abaixo da taxa base atual. Peça dados de taxa na hora do envio.

### Posso rodar meu próprio nó?

Nada aqui depende de usar um endpoint hospedado. Uma aplicação que lê do seu próprio nó precisa apenas de outra URL, e é exatamente essa propriedade que faz esta arquitetura valer a pena.

## Para onde ir agora

Com as leituras funcionando, o próximo passo é escrever: [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) cobre a configuração de Hardhat e Foundry construída sobre os valores acima.

Para confirmar o que de fato aterrissou na cadeia, [como usar o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) é a peça complementar. E se você chegou sem contexto, [o que é a Nura Chain](/blog/what-is-nura-chain) é o lugar para começar.
