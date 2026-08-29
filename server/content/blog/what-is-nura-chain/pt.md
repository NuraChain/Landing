Nura Chain é uma blockchain pública que executa a Máquina Virtual do Ethereum (EVM). Se você já escreveu um contrato em Solidity, adicionou uma rede à MetaMask ou chamou um endpoint JSON-RPC do Ethereum, quase tudo o que já sabe se aplica aqui sem mudanças: o mesmo modelo de contas, o mesmo formato de transação, as mesmas ferramentas.

Esta página é a descrição direta. O que é a rede, quais valores você precisa para conversar com ela e o que de fato existe ao redor dela hoje.

## A rede em resumo

Estes são os valores que uma carteira ou uma biblioteca cliente vai pedir.

- Nome da rede: Nura Chain
- ID da cadeia: `1020`, que as carteiras pedem em hexadecimal como `0x3fc`
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de blocos: `https://explorer.nurachain.net`
- Moeda nativa: Nura Coin, sigla `NURA`, 18 casas decimais
- Tempo de bloco: cerca de 3 segundos

Não aceite nada disso por confiança, inclusive vindo desta página. O próprio endpoint informa o ID da cadeia se você perguntar:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

A resposta é `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`, e `0x3fc` é 1020 em decimal. Essa verificação leva dez segundos e é o hábito mais útil que você pode adquirir antes de adicionar uma rede à carteira. Um ID de cadeia errado é exatamente o que faz alguém assinar numa rede que não pretendia usar.

## O que compatibilidade com a EVM significa na prática

A Máquina Virtual do Ethereum é o ambiente de execução que o Ethereum definiu para contratos inteligentes. Uma cadeia que a executa roda o mesmo bytecode compilado, responde aos mesmos nomes de método JSON-RPC e usa o mesmo formato de endereço de 20 bytes.

Para quem constrói, isso tem três consequências concretas.

- Os contratos compilam com as ferramentas que você já usa. Solidity, Hardhat e Foundry miram a EVM e não uma rede específica, então uma cadeia nova é uma linha de configuração, não uma reescrita.
- As bibliotecas cliente funcionam sem modificação. ethers.js, viem, web3.py e wagmi falam JSON-RPC, então apontá-las para outro lugar é uma mudança de uma linha.
- Chaves e endereços vão junto. As mesmas chaves secp256k1, os mesmos caminhos de derivação, os mesmos endereços com checksum.

O que isso não significa é que as duas cadeias compartilhem algo. Um endereço que você controla no Ethereum também é seu aqui, porque deriva da mesma chave — mas saldos, contratos implantados e histórico são livros-razão completamente separados. Enviar um ativo para o mesmo endereço em outra cadeia não o transfere entre elas.

Os blocos aqui carregam uma taxa base EIP-1559, então as transações são precificadas como no Ethereum desde a London: uma taxa base que o protocolo define por bloco, mais a taxa de prioridade que você escolher acrescentar. Qualquer biblioteca escrita nos últimos anos já faz isso por padrão. Há mais detalhes em [como a Nura Chain executa bytecode da EVM](/blog/nura-chain-evm-compatibility).

## O que existe hoje ao redor da rede

Três coisas estão no ar e acessíveis agora, e vale ser preciso sobre quais são.

- O endpoint RPC. `https://rpc.nurachain.net` responde ao JSON-RPC padrão do Ethereum e envia cabeçalhos CORS permissivos, de modo que uma página rodando no navegador pode ler dele diretamente. Isso é tratado em [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc).
- O explorador de blocos. O [Nura Explorer](https://explorer.nurachain.net) indexa blocos, transações e transferências. É onde você confirma que algo enviado realmente aconteceu, e está descrito em [como ler o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer).
- A Nura Wallet, uma carteira de autocustódia com versões para Android, Windows e Linux. Não é a única porta de entrada — qualquer carteira EVM que aceite uma rede personalizada serve, que é o que [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet) percorre.

Existe também uma ponte que emite representações encapsuladas de BNB e USDT na Nura como contratos ERC-20 comuns, e uma interface de troca em `https://swap.nurachain.net`.

## A moeda nativa

Nura Coin, sigla `NURA`, é o ativo nativo da rede, com 18 casas decimais — convenção da EVM, não uma escolha feita aqui. Ela paga o gás exatamente como o ether faz no Ethereum. Toda transação consome gás, o gás é precificado em NURA, e uma conta precisa de saldo antes de conseguir enviar qualquer coisa, inclusive a primeira implantação de contrato.

O fornecimento total é de 1.000.000.000 NURA. Como isso é dividido e para que serve cada parte está detalhado em [fornecimento e alocação da Nura Coin](/blog/nura-coin-tokenomics).

## Perguntas frequentes

### A Nura Chain é um fork do Ethereum?

Ela executa a mesma máquina virtual e responde à mesma interface RPC, que é o que permite às ferramentas do Ethereum funcionarem sem modificação. Isso é uma afirmação sobre compatibilidade, não sobre histórico ou estado compartilhados. As duas redes mantêm livros separados.

### Posso usar a MetaMask?

Sim. Qualquer carteira que permita adicionar uma rede EVM personalizada pode ser apontada para a Nura Chain com os valores acima, e o passo a passo está em [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet).

### Preciso de NURA antes de fazer qualquer coisa?

Para ler a cadeia, não. O endpoint RPC responde chamadas de leitura de qualquer um, e é por isso que um explorador consegue mostrar a rede inteira sem que você tenha conta. Para enviar uma transação ou implantar um contrato, sim: o gás é pago em NURA.

### Qual a velocidade dos blocos?

Cerca de três segundos entre um e outro, medido sobre blocos recentes. Esse é o ritmo em que a cadeia produz blocos, o que não é o mesmo que uma garantia sobre quando uma transação específica será incluída.

## Para onde ir agora

Se você veio para usar a rede, comece por [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet). Leva cerca de um minuto e todo o resto depende disso.

Se veio para construir, comece em [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc) e siga para [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
