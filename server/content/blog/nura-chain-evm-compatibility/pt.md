"Compatível com EVM" aparece na primeira página de quase toda cadeia lançada nos últimos cinco anos, e é usado com folga suficiente para valer a pena definir com precisão. Isto é o que significa concretamente na Nura Chain, o que você pode verificar por conta própria e o que não lhe é dado.

## O que a EVM realmente é

A Máquina Virtual do Ethereum é a especificação de uma máquina de pilha. Ela define um conjunto de instruções, um custo de gás por instrução, um modelo de memória e armazenamento, e um conjunto de contratos pré-compilados em endereços fixos.

Solidity e Vyper não compilam para "Ethereum". Compilam para bytecode da EVM. Essa separação é toda a razão pela qual cadeias podem ser compatíveis entre si: um contrato é um bloco de bytecode mais uma ABI descrevendo como chamá-lo, e qualquer máquina que implemente o mesmo conjunto de instruções executa esse bloco do mesmo jeito.

Portanto "compatível com EVM" é uma afirmação sobre a camada de execução. Não diz nada sobre consenso, validadores, finalidade ou governança, e uma cadeia pode ser plenamente compatível com a EVM e diferir do Ethereum em cada um desses pontos.

## O que a Nura Chain implementa

A rede responde à interface JSON-RPC padrão do Ethereum, e você pode constatar isso sem instalar nada.

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}'
```

O nó se identifica como uma implementação em Go, que é a linhagem sobre a qual rodam a maioria das redes EVM: go-ethereum e os clientes derivados dele.

De um cabeçalho de bloco se lê mais do que de qualquer página de marketing. Peça o mais recente:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

O cabeçalho que volta carrega `baseFeePerGas`, um `difficulty` de `0x0`, um `mixHash` zerado e um `withdrawalsRoot`. Essa é a forma que os clientes modernos do Ethereum produzem depois do Merge e da mudança de mercado de taxas da London, e dois fatos práticos decorrem disso. As taxas são EIP-1559 em vez de um preço de gás fixo, e campos de prova de trabalho como `difficulty` não significam nada aqui — código que se ramifica com base numa dificuldade diferente de zero vai se comportar de modo estranho, exatamente como hoje no Ethereum.

## As taxas seguem o EIP-1559

Os blocos carregam uma taxa base definida pelo protocolo, e quem envia acrescenta uma taxa de prioridade por cima. Ambas são legíveis:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_maxPriorityFeePerGas","params":[]}'
```

No momento em que isto foi escrito, a taxa base estava em 1 gwei e o limite de gás por bloco em 150.000.000. Ambos são valores que convém ler em tempo de execução e não fixar no código — é para isso que existem o `eth_feeHistory` e a estimativa de taxas das bibliotecas, e um script de implantação com `gasPrice` fixado é o motivo mais comum de uma transação ficar sem ser minerada.

Como o mercado de taxas é o padrão, `ethers`, `viem`, `web3.py` e qualquer carteira construída nos últimos anos montam aqui transações do tipo 2 sem configuração. Não há nada específico da Nura para ensinar a elas.

## O que a compatibilidade não lhe dá

Esta é a parte normalmente omitida.

- Não lhe dá estado compartilhado. Seu endereço existe nas duas redes porque deriva da mesma chave, mas saldos, código de contratos e histórico são livros separados. Um ativo enviado ao "mesmo endereço em outra cadeia" não se moveu entre elas.
- Não lhe dá contratos compartilhados. Um contrato implantado no Ethereum não está implantado aqui. Você o implanta de novo e ele recebe outro endereço, a menos que use deliberadamente um implantador determinístico.
- Não lhe dá o modelo de segurança do Ethereum nem seu conjunto de validadores. Isso são propriedades de consenso, e compatibilidade com EVM é uma afirmação sobre execução.
- Não garante custos de gás idênticos para sempre. Cada cadeia adota as atualizações da EVM no próprio calendário, então um contrato barato numa pode não ser em outra.

A maior parte das perdas reais vem de tratar o primeiro ponto como sabido, e só por isso ele merece ser repetido.

## Como verificar tudo isso você mesmo

Cada afirmação acima está a uma requisição de distância, e é justamente esse o ponto. Uma cadeia que responde honestamente a `eth_chainId`, `eth_getBlockByNumber` e `web3_clientVersion` é uma cadeia que você consegue caracterizar em cerca de um minuto, sem confiar em nenhuma página de documentação — inclusive esta.

O hábito que vale formar: antes de implantar qualquer coisa de valor, leia o ID da cadeia a partir do endpoint que você vai usar e compare com o que a configuração do seu framework afirma. Eles divergem com mais frequência do que se esperaria, geralmente porque a configuração foi copiada de outro projeto.

## Perguntas frequentes

### Posso implantar um contrato Solidity existente sem alterações?

Normalmente sim, desde que ele não dependa de um ID de cadeia específico, de um endereço de contrato fixado em outra rede, ou de um oráculo que aqui não existe. Essas três são as fontes reais de atrito, não o bytecode.

### Qual versão do Solidity devo mirar?

Uma cujo alvo de EVM a rede suporte. O caminho seguro é compilar para um alvo bem estabelecido em vez do mais novo disponível, e testar a implantação num contrato descartável antes de comprometer um real.

### Os custos de gás são iguais aos do Ethereum?

Os custos por instrução vêm da especificação da EVM, então o formato é o mesmo. O que difere é o preço do gás, definido pelo mercado de taxas desta rede e não pelo do Ethereum.

## Para onde ir agora

Para começar a fazer chamadas, leia [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc), que cobre o endpoint, as bibliotecas cliente e os erros que vale reconhecer.

Se você ainda está decidindo se uma cadeia EVM é o alvo certo, [por que desenvolvedores escolhem uma blockchain compatível com EVM](/blog/why-build-on-an-evm-compatible-chain) enfrenta essa pergunta diretamente. E para uma descrição geral da rede, veja [o que é a Nura Chain](/blog/what-is-nura-chain).

Quando estiver pronto para colocar algo na cadeia, [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) é o próximo passo.
