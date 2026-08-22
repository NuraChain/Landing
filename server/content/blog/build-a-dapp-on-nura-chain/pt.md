Um dApp é uma aplicação web comum com uma propriedade incomum: ele nunca guarda a chave do usuário. Ele lê de uma cadeia e, quando quer mudar algo, pede a uma carteira que assine. Tudo o que segue decorre dessa divisão.

## As duas metades

Ler e escrever são caminhos separados, e confundi-los é o erro estrutural mais comum.

**Ler** passa pela sua própria conexão RPC. Não precisa de carteira, funciona antes de alguém conectar e deveria desenhar o máximo possível da sua interface. Saldos, estado de contratos, preços, histórico — tudo isso é público.

**Escrever** passa pela carteira do usuário. Precisa da aprovação dele, pode ser recusado, e é a única parte que exige conexão.

Construa primeiro o caminho de leitura. Um dApp que mostra uma página em branco até alguém conectar é um dApp que mostra uma página em branco a todos que estão avaliando se conectam.

## Lendo

Use um cliente público apontado ao endpoint, exatamente como em [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc):

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

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

Esse objeto é a definição única da rede para toda a aplicação. Importe-o em todo lugar em vez de repetir os valores.

## Conectando uma carteira

Uma carteira de navegador injeta um provedor EIP-1193. O mecanismo moderno de descoberta é o EIP-6963, que anuncia cada carteira instalada em vez de brigar por uma variável global — vale usar se mais de uma carteira puder estar presente. A versão mínima:

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

Chame isso a partir de um clique, nunca no carregamento da página. Um dApp que abre o pop-up da carteira no instante em que a página abre é um dApp que os usuários fecham.

## Levando-os à rede certa

Este é o passo que a maioria dos guias pula, e onde usuários reais empacam. Uma carteira conectada pode estar em qualquer cadeia. Peça a troca e trate o caso em que ela nunca ouviu falar da Nura Chain:

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
                    chainName: 'Nura Mainnet',
                    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
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

`0x3fc` é 1020 em hexadecimal, e as carteiras querem a forma hexadecimal. O ramo `4902` é o que transforma "não acontece nada quando eu clico" numa primeira experiência que funciona — é a mesma requisição descrita em [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet), emitida pela sua página em vez de na mão.

Escute também as mudanças, porque o usuário pode trocar de rede ou de conta pelas suas costas:

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

Recarregar no `chainChanged` é rude, mas correto: garante que nenhum estado obsoleto ligado a uma cadeia sobreviva.

## Enviando uma transação

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

Repare em duas coisas. O cliente de carteira envia; o cliente público espera. E um recibo com status `reverted` é uma transação que aconteceu, custou gás e não fez o que foi pedido — tratá-la como sucesso é um bug que os usuários vão encontrar.

## Os estados que de fato acontecem

Trate todos estes, porque cada um ocorre com regularidade:

- **Nenhuma carteira instalada.** Mostre um link, não um botão quebrado.
- **Conexão recusada.** O usuário disse não. Volte ao estado desconectado em silêncio; não peça de novo.
- **Rede errada.** Ofereça um botão de troca em vez de um erro. É a maior fonte isolada de usuários confusos.
- **Transação recusada na carteira.** Não é condição de erro. Limpe o estado pendente e siga.
- **Pendente.** Mostre o hash e um link para o [Nura Explorer](https://explorer.nurachain.net) para que possam acompanhar sozinhos.
- **Revertida.** Diga isso claramente. "A transação falhou" com o hash é melhor que um spinner que nunca para.

## O que não fazer

- **Não peça chave privada.** Nunca, por motivo nenhum. Um dApp que pede é indistinguível de uma página de phishing.
- **Não peça aprovações de token ilimitadas por padrão.** Aprove o valor realmente necessário. Se precisar de uma permissão grande, diga isso na interface.
- **Não confie num ID de cadeia guardado no estado.** Leia do provedor antes de enviar qualquer coisa que importe.
- **Não deixe toda a interface refém de uma conexão de carteira.** Veja a primeira seção.
- **Não consulte a cadeia a cada renderização.** Faça cache das leituras e compartilhe requisições em voo.

## Perguntas frequentes

### Preciso de um backend?

Não para ler nem escrever na cadeia — as duas coisas vão direto do navegador, o que o CORS permissivo do endpoint torna possível. Você precisa de backend para o que as cadeias fazem mal: busca, agregação, dados fora da cadeia.

### Posso usar wagmi ou RainbowKit?

Sim. Passe a eles a mesma definição de cadeia do primeiro trecho. Eles em boa parte embrulham a lógica de conexão e troca de rede mostrada acima, que vale entender uma vez antes de delegar.

### Como mostro saldos de tokens?

Chame `balanceOf` no contrato do token e formate com o `decimals()` dele. Nunca presuma a contagem de casas — [criar um ERC-20 na Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) explica por que essa presunção sai cara aqui em particular.

### Como testo sem gastar nada?

Caminhos de leitura não precisam de fundos. Para escritas, use uma conta descartável com saldo pequeno e confirme cada resultado no explorador.

## Para onde ir agora

Se você ainda não implantou o contrato com que sua interface vai falar, comece por [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).

Para confirmar o que sua aplicação de fato fez, [como usar o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) é a ferramenta. E para os fundamentos da rede por trás de tudo isso, [o que é a Nura Chain](/blog/what-is-nura-chain).
