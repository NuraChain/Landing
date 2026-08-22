Implantar na Nura Chain é implantar numa rede EVM, então as ferramentas são as que você já conhece. O que segue é a configuração, um contrato, o passo de implantação e — a parte que a maioria dos guias pula — como confirmar que a coisa realmente aterrissou.

## Antes de começar

Três coisas.

- Uma conta com saldo. Implantar é uma transação, transações custam gás e o gás é pago em NURA. Uma conta vazia não implanta.
- Uma chave privada que você aceite colocar numa variável de ambiente. Use uma chave descartável na primeira implantação, não a que guarda seu saldo.
- Node.js e Hardhat ou Foundry.

Nunca faça commit de uma chave. Todos os exemplos abaixo leem do ambiente, e o arquivo que a contém precisa estar no `.gitignore` antes de conter qualquer coisa real.

## Configuração do Hardhat

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

A linha `chainId` não é enfeite. O Hardhat a compara com o que o endpoint informa e se recusa a continuar se divergirem — é exatamente a checagem que impede uma implantação de ir para uma rede que você não pretendia.

Sobre a versão do Solidity: compile para um alvo bem estabelecido em vez da versão mais recente disponível. Um compilador novo que por padrão mire uma versão da EVM que a rede ainda não adotou produz bytecode que implanta e depois se comporta de forma estranha, uma falha bem pior que um erro de compilação.

## Um contrato que vale implantar

Algo com estado, para haver um jeito de saber que funciona:

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

O evento importa para a próxima seção: eventos são o que um explorador indexa, então um contrato que os emite é um contrato que você consegue verificar de fora.

## Implantando

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

Então:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

Mantenha a linha `waitForDeployment`. Sem ela o script imprime um endereço e sai antes de a transação ser minerada, e você fica com um endereço que pode ou não ter código.

## Confirmando que aterrissou

Um endereço impresso por um script é uma previsão, não um fato. Pergunte à cadeia:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

Um contrato implantado devolve uma longa string hexadecimal. Um resultado `0x` significa que não há código naquele endereço — a implantação reverteu, ficou sem gás ou foi para outra rede. Essa única chamada separa "funcionou" de "o script não lançou erro", e não são a mesma coisa.

Depois abra o endereço no [Nura Explorer](https://explorer.nurachain.net) e veja a transação. [Ler o explorador](/blog/how-to-use-nura-chain-explorer) explica o que significam os campos.

## A mesma coisa no Foundry

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

E para conferir depois sem sair do terminal:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

O segundo deve imprimir `1020`. Faça disso um hábito.

## Gás e taxas

Os blocos aqui carregam uma taxa base EIP-1559, então deixe sua ferramenta estimar em vez de fixar um `gasPrice`. Tanto Hardhat quanto Foundry leem dados de taxa do endpoint e montam uma transação do tipo 2 por padrão; o motivo usual de uma implantação ficar pendurada sem ser minerada é um preço de gás fixado no código, copiado da configuração de outro projeto e abaixo da taxa base atual. A mecânica está em [como a Nura Chain executa bytecode da EVM](/blog/nura-chain-evm-compatibility).

## Falhas que vale reconhecer

- **"insufficient funds for gas".** A conta não tem NURA. Financie-a primeiro.
- **"invalid chain id" ou uma divergência de rede.** Sua configuração e o endpoint discordam. Leia `eth_chainId` e corrija a configuração.
- **A transação fica pendente para sempre.** Taxa baixa demais, ou uma lacuna de nonce vinda de uma transação travada antes na mesma conta.
- **`eth_getCode` devolve `0x`.** A implantação não deu certo, não importa o que o script imprimiu. Busque o recibo da transação e verifique o status.

## Perguntas frequentes

### Posso implantar um contrato que já tenho em outra cadeia?

Normalmente sim, sem alterações, desde que ele não fixe um endereço daquela outra rede nem dependa de um serviço que aqui não existe. O bytecode em si é portátil.

### Ele vai receber o mesmo endereço que em outra cadeia?

Só se você implantar da mesma conta com o mesmo nonce, porque o endereço de um contrato deriva desses dois. Use `CREATE2` com um implantador determinístico se precisar que o endereço coincida de propósito.

### Como verifico o código-fonte no explorador?

Procure o formulário de verificação do explorador. Verificação é uma conveniência para quem lê, não uma propriedade do contrato, então ele funciona igual com ou sem o código publicado.

### Devo usar um proxy para poder atualizar?

Só se você realmente precisar. Proxies acrescentam riscos de layout de armazenamento e uma chave de administração que passa a ser a coisa mais valiosa do sistema. Um contrato imutável que você pode reimplantar é mais simples e mais seguro para a maioria dos projetos.

## Para onde ir agora

A próxima implantação óbvia é um token: [criar e implantar um ERC-20 na Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) se apoia diretamente nesta configuração.

Para colocar uma interface na frente do que você implantou, veja [construir um dApp na Nura Chain](/blog/build-a-dapp-on-nura-chain). E se algum detalhe de conexão acima foi novidade, [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc) cobre isso direito.
