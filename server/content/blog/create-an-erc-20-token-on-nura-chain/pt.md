Um token ERC-20 não é um tipo especial de ativo que a cadeia conheça. É um contrato inteligente comum que mantém um mapa de endereço para saldo e expõe um conjunto acordado de funções. Todo o resto — carteiras exibindo, exchanges listando, exploradores indexando — decorre de implementar essa interface corretamente.

Este texto percorre a escrita de um, a implantação na Nura Chain, e a parte que causa mais perdas reais: as casas decimais.

## O que o ERC-20 realmente especifica

Um punhado de funções e dois eventos:

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

`name()`, `symbol()` e `decimals()` são opcionais no padrão, mas universalmente esperadas — uma carteira sem símbolo para mostrar exibirá o endereço no lugar.

O evento `Transfer` é o que torna um token visível. Exploradores não varrem o armazenamento; eles indexam eventos. Um contrato que movimenta saldos sem emitir `Transfer` é um token que nada consegue enxergar.

## O contrato

Não escreva a aritmética você mesmo. Use uma implementação revisada:

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

Isso é um token completo e funcional. A tentação de acrescentar emissão, pausa, listas negras e taxa na transferência deve ser resistida até você conseguir dizer com precisão quem pode chamar cada uma, porque todo privilégio acrescentado é mais um jeito de o token ser tirado de quem o detém.

## As casas decimais são a parte que morde

`decimals()` é metadado de exibição. Não afeta a aritmética. O contrato guarda inteiros, e `decimals` diz às interfaces onde colocar a vírgula.

Com os 18 convencionais:

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

Portanto, emitir "um milhão de tokens" significa:

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

Passar `1_000_000` em vez disso emite um milionésimo de milionésimo de token, e o erro fica invisível até uma carteira exibi-lo.

A armadilha é supor que um símbolo implica uma quantidade de casas. Não implica, e a Nura Chain tem um exemplo vivo. O contrato de USDT em ponte aqui informa 18 casas decimais:

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

O USDT no Ethereum usa 6. Mesmo ticker, contagem de casas diferente, contrato diferente em cadeia diferente. Qualquer integração que fixe no código "USDT significa 6 casas" erra aqui por um fator de um trilhão. Sempre leia `decimals()` do contrato com o qual você está de fato falando.

## Implantando

A configuração é a de [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) — ID de cadeia `1020`, RPC `https://rpc.nurachain.net`. O script de implantação difere apenas por passar um argumento ao construtor:

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

`parseUnits` existe para você nunca escrever os zeros à mão. Use.

Depois, confirme que o contrato responde como token e não que apenas existe:

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## Fazer uma carteira exibi-lo

Carteiras não descobrem tokens sozinhas. Quem o detém adiciona o endereço do contrato uma vez, em "importar token" ou equivalente, e a carteira lê `symbol` e `decimals` do próprio contrato.

Se sua carteira ainda nem aponta para esta rede, [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet) vem antes.

## Dois ERC-20 que já estão nesta cadeia

Vale olhar tokens reais, não só o seu. Ambos abaixo são contratos ERC-20 comuns implantados na Nura Chain, representando ativos em ponte:

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

Consulte-os do mesmo jeito que consultou o seu, ou abra-os no [Nura Explorer](https://explorer.nurachain.net). São úteis justamente por não serem exemplos escritos para um tutorial — respondem a `name()`, `symbol()`, `decimals()` e `totalSupply()` como qualquer outro token, que é exatamente o sentido de um padrão.

## Erros que custam dinheiro

- **Emitir sem o deslocamento decimal**, como acima.
- **Supor que um ticker implica casas decimais.** Leia `decimals()`. Toda vez.
- **Confiar no símbolo.** Qualquer um pode implantar um contrato que se chame `USDT`. A identidade é o endereço; o nome é um rótulo escolhido por quem implantou.
- **Manter um dono que pode emitir.** Autoridade de emissão ilimitada significa que o fornecimento é o que quem tem a chave disser. Se você mantém, diga publicamente; se não precisa, renuncie.
- **Enviar tokens para o próprio contrato do token.** Um deslize comum e normalmente irrecuperável.

## Perguntas frequentes

### Preciso registrar o token em algum lugar?

Não. Implantar é publicar. Carteiras e exploradores leem da cadeia. Listar em qualquer serviço de terceiros é o processo daquele serviço.

### Posso mudar o fornecimento depois?

Só se o contrato tiver uma função de emissão ou queima que você incluiu de propósito. O exemplo acima não tem: seu fornecimento é fixado na construção, que é o padrão honesto.

### Quanto custa manter o token?

A implantação custa gás uma vez. Depois, cada transferência custa gás pago por quem a envia — em NURA, não no seu token.

### Devo escrever meu próprio ERC-20 do zero?

Não para nada que guarde valor. A interface é pequena o bastante para parecer simples e tem arestas suficientes (valores de retorno, corrida de allowance, casas decimais) para que uma implementação revisada seja o padrão certo.

## Para onde ir agora

Para colocar uma interface funcional na frente do token, veja [construir um dApp na Nura Chain](/blog/build-a-dapp-on-nura-chain), que cobre conexão de carteira e envio de transações a partir de uma página.

Para acompanhar transferências conforme acontecem, [como usar o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) explica como ler o histórico de eventos de um token. E para a mecânica por baixo de tudo isso, [como a Nura Chain executa bytecode da EVM](/blog/nura-chain-evm-compatibility).
