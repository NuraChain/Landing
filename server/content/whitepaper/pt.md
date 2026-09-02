A Nura Chain é uma blockchain pública que executa a Máquina Virtual do Ethereum. É identificada pelo ID de cadeia `1020`, sela um bloco a cada três segundos, precifica as transações com o mercado de taxas da EIP-1559 e paga a computação em sua moeda nativa, o NURA. Ao redor da rede há uma carteira de autocustódia, um explorador de blocos, uma interface de troca e uma ponte, todos acessíveis hoje.

Este documento é a descrição de referência da rede: o que ela é, como funciona, para que serve sua moeda e como o fornecimento é dividido, o que existe ao redor dela e o que um leitor pode verificar na própria cadeia em vez de aceitar por confiança. Foi escrito para três leitores ao mesmo tempo — quem está decidindo se guarda NURA, quem está prestes a construir na rede e quem simplesmente quer saber o que está vendo.

## 1. Introdução

A maioria das pessoas conhece uma blockchain nova por meio de uma janela da carteira pedindo cinco valores, e cola esses valores sem saber o que qualquer um deles significa. A Nura Chain foi construída para ser a experiência oposta. Todo número que este documento declara ou pode ser lido da própria cadeia ou está claramente marcado como afirmação publicada, e as ferramentas ao redor da rede são as que o ecossistema EVM mais amplo já usa.

O nome designa uma única coisa: a rede. Os produtos construídos sobre ela — Nura Wallet, Nura Explorer, Nura Swap — estão descritos na seção 7 e são separados da cadeia que servem. Qualquer carteira EVM que aceite uma rede personalizada pode usar a Nura Chain; a carteira do próprio projeto é uma porta de entrada, não a única.

## 2. Princípios de projeto

Quatro escolhas moldam tudo o que vem abaixo.

- **Execução familiar.** A rede executa a EVM sem alterações, de modo que contratos, bibliotecas, chaves e endereços passam do Ethereum para cá sem modificação. O primeiro dia de um desenvolvedor na Nura Chain é uma entrada de configuração, não uma reescrita.
- **Autocustódia por padrão.** A Nura Wallet nunca guarda uma chave e não consegue movimentar um saldo. A rede não tem recuperação de conta, congelamento nem caminho privilegiado de gasto; quem detém a chave detém a moeda.
- **Verificável antes de confiável.** O ID da cadeia, o intervalo entre blocos, o mercado de taxas e a identidade de cada produtor de blocos podem ser lidos por RPC público. Onde um número não pode ser lido da cadeia — o fornecimento total é o caso importante — este documento diz isso em vez de sugerir o contrário.
- **Uma superfície pequena, descrita com honestidade.** A rede entrega menos peças do que uma página de marketing listaria, e cada uma delas é descrita aqui com seus limites, inclusive os desconfortáveis.

## 3. A rede

### 3.1 Execução: a Máquina Virtual do Ethereum

A Nura Chain executa bytecode da EVM. Um contrato compilado com Solidity ou Vyper para a EVM roda aqui com a mesma semântica, os mesmos custos de instrução e o mesmo espaço de endereços de 20 bytes que teria no Ethereum. O nó responde à interface JSON-RPC padrão do Ethereum, então ethers.js, viem, web3.py, wagmi, Hardhat e Foundry funcionam com ele sem precisar de nada além de um endpoint e um ID de cadeia.

Compatibilidade é uma afirmação apenas sobre a camada de execução. Um endereço controlado no Ethereum é controlado aqui, porque deriva da mesma chave secp256k1 — mas saldos, contratos implantados e histórico são livros-razão separados. Nada enviado para "o mesmo endereço em outra cadeia" se move entre elas. A seção 9 volta a esse ponto porque é de onde vem a maioria das perdas reais.

### 3.2 Blocos, tempo e taxas

A rede sela um bloco a cada três segundos. O intervalo é fixo, não uma meta: cabeçalhos consecutivos diferem em exatamente três segundos. O primeiro bloco da cadeia carrega o timestamp de 6 de junho de 2026, 00:00 UTC.

As transações são precificadas com o mercado de taxas da EIP-1559. Cada bloco carrega uma taxa base definida pelo protocolo, e o remetente acrescenta uma taxa de prioridade por cima; o campo `baseFeePerGas` em cada cabeçalho e os métodos `eth_maxPriorityFeePerGas` e `eth_feeHistory` expõem as duas. No momento desta revisão, a taxa base está em 1 gwei e o limite de gás por bloco é de 150.000.000 de gás. Ambos são valores a ler em tempo de execução, não a fixar no código, que é o que a estimativa de taxas de uma biblioteca faz por padrão.

Os cabeçalhos têm o formato que os clientes modernos do Ethereum produzem: `difficulty` igual a zero, `nonce` vazio, `mixHash` zerado e os campos introduzidos pelas atualizações Shanghai, Cancun e Prague — `withdrawalsRoot`, `parentBeaconBlockRoot`, `blobGasUsed` e `requestsHash`. Código que ramifica com base numa dificuldade diferente de zero, ou que espera que os campos de prova de trabalho signifiquem alguma coisa, vai se comportar mal aqui exatamente como já se comporta no Ethereum hoje.

### 3.3 Produção de blocos

A Nura Chain não usa prova de trabalho; os campos de cabeçalho acima a descartam. Os blocos são selados por um produtor de blocos autorizado, no cronograma fixo descrito acima. A conta que selou um bloco fica registrada em seu campo `miner`, então o produtor de qualquer bloco é um fato público, e não uma afirmação num documento.

Até esta revisão, todo bloco amostrado foi selado pela mesma conta produtora. O tamanho do conjunto de produtores é uma questão de como a rede é operada, não de sua camada de execução, e este documento não o fixa. Qualquer mudança nele é anunciada pelos canais do projeto listados na seção 11.

A rede não expõe nenhum sinal de finalidade separado por RPC. A inclusão num bloco selado é a confirmação que as carteiras e o explorador mostram, e, como os blocos chegam num cronograma, uma transação incluída fica visível dentro de um intervalo.

### 3.4 Identidade da rede

Estes são os valores que uma carteira ou uma biblioteca cliente pede. São os mesmos valores que o cartão da rede no site traz, e os mesmos que a Nura Wallet armazena.

- Nome da rede: Nura Chain
- ID da cadeia: `1020`, que as carteiras pedem como a string hexadecimal `0x3fc`
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de blocos: `https://explorer.nurachain.net`
- Moeda nativa: Nura, sigla `NURA`, 18 casas decimais
- Tempo de bloco: 3 segundos

O ID da cadeia é mais do que um rótulo. Pela EIP-155, ele é assinado em cada transação, de modo que uma transação assinada para a cadeia 1020 não pode ser reproduzida em nenhuma outra rede, e uma transação assinada para outra rede é rejeitada aqui. É também o valor a conferir antes de confiar em todo o resto, inclusive nesta página:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

A resposta é `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. Uma carteira que suporte a EIP-3085 pode receber todos os valores acima numa única requisição, que é o que o controle "Adicionar a Nura Chain à carteira" do site faz.

## 4. A moeda nativa

O NURA é a moeda nativa da rede. Ele paga o gás: toda transação consome gás, o gás é precificado em NURA, e uma conta precisa de saldo antes de conseguir enviar qualquer coisa, inclusive sua primeira implantação de contrato. É o papel que o ether cumpre no Ethereum, e a menor unidade é igualmente um bilionésimo de um bilionésimo de uma moeda.

Por ser nativo e não um contrato, o NURA não tem endereço de token. Uma página que pede "o endereço de contrato do NURA" para adicionar a moeda está pedindo algo que não existe; o que faz o saldo aparecer é adicionar a rede. Tokens ERC-20 existem na Nura Chain como contratos comuns, e o NURA não é um deles.

## 5. Fornecimento e alocação

### 5.1 Fornecimento total

O fornecimento total publicado é de 1.000.000.000 NURA — um bilhão.

Esse é um número publicado, não legível da cadeia, e a distinção importa. Um ERC-20 expõe `totalSupply()` porque é um contrato mantendo o próprio livro-razão; a emissão de uma moeda nativa vive na configuração do cliente e no estado gênese, e não existe `eth_totalSupply`. Qualquer saldo individual pode ser lido com `eth_getBalance`; o total, não.

O fornecimento circulante deliberadamente não é declarado nesta revisão. O circulante depende de quais alocações contam como destravadas num dado momento, e isso é um julgamento, não uma medição, a menos que cada alocação bloqueada esteja num endereço publicado que qualquer pessoa possa observar.

### 5.2 Alocação

O total é dividido em seis partes. Os percentuais, as quantidades de tokens que eles implicam e as condições declaradas de cada parcela são:

- **Bloqueado — 40%, 400.000.000 NURA.** Bloqueado por um ano. O que acontece com ele será decidido ao fim desse período, e qualquer decisão sobre essa parcela exige aprovação por voto de ao menos 65% da rede.
- **Liquidez — 25%, 250.000.000 NURA.** Alocado ao longo de um ano para prover e administrar liquidez, com o objetivo de uma liquidez de negociação funcional e um ecossistema NURA mais estável.
- **Comunidade — 10%, 100.000.000 NURA.** Distribuído a membros da comunidade ao longo de um ano, para quem ajuda a rede a crescer por meio de atividade, participação, desenvolvimento, indicações ou outra contribuição efetiva, em vez de pagar. A alocação segue revisão e aprovação do conselho de gestão.
- **Venda pública — 10%, 100.000.000 NURA.** Oferecido numa venda pública com preço total de US$ 24.000, o que dá US$ 0,00024 por NURA.
- **Tesouraria — 10%, 100.000.000 NURA.** Alocado ao longo de um ano, sob supervisão do conselho de gestão, para desenvolvimento do ecossistema, infraestrutura, produtos, parcerias e outras necessidades do projeto.
- **Airdrop — 5%, 50.000.000 NURA.** Distribuído como airdrop ao longo de um ano. Os destinatários são identificados por canais e comunidades selecionados, e a alocação final é confirmada pelo conselho de gestão.

Essas seis partes somam 100%. O preço da venda pública é uma condição fixa daquela venda, não uma cotação de mercado, e não deve ser lido como uma avaliação da moeda.

### 5.3 Verificando um saldo

Todo saldo na rede é público. Qualquer endereço, inclusive qualquer endereço que o projeto publique para uma alocação, pode ser lido por qualquer pessoa:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

A resposta vem em wei, codificada em hexadecimal; divida por 10^18 para obter NURA. O mesmo número é mostrado pelo Nura Explorer, e conferir os dois é o hábito que este documento recomenda do início ao fim.

## 6. Governança

Duas regras de governança são declaradas para a rede nesta revisão, e ambas dizem respeito à alocação acima, não ao protocolo.

Os 40% bloqueados do fornecimento não podem ser liberados, redirecionados ou de qualquer outro modo decididos sem aprovação por voto de ao menos 65% da rede. Esse limiar é a única regra vinculante sobre a maior parcela isolada do fornecimento.

As parcelas da comunidade, da tesouraria e do airdrop — 25% do fornecimento somadas — são alocadas sob revisão e supervisão de um conselho de gestão, que confirma cada distribuição.

Nenhum outro mecanismo de governança é reivindicado aqui. Os parâmetros do próprio protocolo — o intervalo entre blocos, o mercado de taxas, o conjunto de produtores — são definidos pelos operadores da rede, e este documento não descreve um sistema de votação on-chain para eles porque nenhum está implantado.

## 7. O ecossistema

### 7.1 Nura Wallet

A Nura Wallet é uma carteira de autocustódia feita para a rede. As chaves privadas são geradas e mantidas no dispositivo, e a carteira não consegue gastar um saldo por conta própria. Seu código-fonte e suas versões são publicados no GitHub.

Ela é construída como aplicativo nativo, não como extensão de navegador. Há versões publicadas para Android, tanto na Google Play quanto como APK universal, para Windows como instalador x64 e para Linux como pacote Debian amd64. Versões para iOS e macOS ainda não foram publicadas. Cada versão e arquitetura está listada na página de releases da carteira.

Por ser um aplicativo, uma página web não tem onde injetar nada fora do navegador interno da própria carteira. O site, portanto, a alcança de duas maneiras: pelo anúncio de provedor da EIP-6963 dentro desse navegador e, em todos os outros lugares, por um deep link `nurawallet://` que leva a requisição ao aplicativo e devolve a resposta à página. Qualquer outra carteira EVM alcança a rede pela requisição comum de adição de cadeia da EIP-3085.

### 7.2 Nura Explorer

O Nura Explorer indexa blocos, transações e transferências na rede. É onde se confirma que uma transação de fato aconteceu, onde o código e as chamadas de um contrato podem ser lidos e onde o produtor de blocos da seção 3.3 pode ser visto em cada bloco. Ele lê a mesma cadeia que o endpoint RPC serve, e é por isso que conferir os dois vale os dez segundos.

### 7.3 Nura Swap

A Nura Swap é uma interface de troca para a rede. Seu pool cota o preço do NURA contra uma representação encapsulada da moeda, e essa cotação é o que o site mostra como preço do NURA.

O pool é pequeno, então uma única negociação pode mover a cotação bruscamente. É uma cotação de mercado de um único pool, não uma listagem em corretora, e por essa razão este documento não declara um preço.

### 7.4 A ponte

Uma ponte emite representações de BNB e USDT na Nura Chain como contratos ERC-20 comuns. Ambos são tokens de emissão e queima, não cofres: uma unidade existe na Nura apenas porque uma unidade foi bloqueada na cadeia de origem. Seus contratos na Nura são:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

O valor transferido pela ponte para a rede é, portanto, o `totalSupply()` de cada token, que é como o site calcula o valor total bloqueado. Esse número mede o direito emitido na Nura; ele só é igual ao colateral enquanto a ponte estiver solvente e lastreada um para um. O saldo do custodiante na cadeia de origem é o lado autoritativo, e é o número que um leitor cuidadoso confere.

## 8. Construindo na Nura Chain

Nada numa cadeia de ferramentas Solidity é específico desta rede. Uma implantação é uma entrada de rede com o endpoint RPC e o ID de cadeia da seção 3.4, financiada com NURA suficiente para pagar o gás. Três pontos de atrito valem ser conhecidos antes da primeira implantação.

- Leia o ID da cadeia do endpoint e compare-o com a configuração do framework. Os dois discordam com mais frequência do que se espera, geralmente porque uma configuração foi copiada de outro projeto.
- Deixe a biblioteca estimar as taxas. A taxa base e a taxa de prioridade podem ser lidas em tempo de execução, e um preço de gás fixado é o motivo mais comum para uma transação ficar sem ser minerada.
- Um contrato implantado em outro lugar não está implantado aqui. Reimplantar atribui um novo endereço, a menos que um implantador determinístico seja usado de propósito, e qualquer dependência fixada no código de contratos ou oráculos de outra rede precisa ser revisada.

O endpoint RPC envia cabeçalhos CORS permissivos, de modo que uma página rodando no navegador pode ler da cadeia diretamente, sem um servidor no meio. O blog do projeto traz guias passo a passo para conectar-se, implantar um contrato e emitir um ERC-20.

## 9. Segurança e risco

- **Autocustódia é uma responsabilidade.** Não há caminho de recuperação para uma frase semente perdida, nesta rede nem em nenhuma outra, e nenhuma parte pode reverter uma transação depois que ela foi selada.
- **Um ID de cadeia errado é como fundos se perdem.** Verifique `1020` contra o endpoint antes de armazenar a rede numa carteira, e trate qualquer página — inclusive esta — como uma afirmação a conferir.
- **Compatibilidade não é estado compartilhado.** Ativos não se movem entre cadeias por serem enviados ao mesmo endereço. Só a ponte da seção 7.4 leva BNB ou USDT para a rede, e só dentro dos limites declarados ali.
- **A cotação do swap é rasa.** Um preço lido de um único pool pequeno não é uma avaliação, e pode ser movido por uma única negociação.
- **A ponte carrega risco de custódia.** Uma representação emitida vale seu colateral apenas enquanto o custodiante do lado de origem o mantiver um para um.
- **Alguns números são afirmações publicadas.** O fornecimento total e as condições de alocação da seção 5 não podem ser confirmados por RPC. Onde o projeto publicar endereços de alocação, seus saldos podem ser lidos com a chamada da seção 5.3.
- **A produção de blocos é concentrada.** A seção 3.3 declara com clareza o conjunto de produtores observado, para que o leitor possa ponderá-lo agora em vez de descobri-lo depois.

## 10. Aviso legal

Este documento descreve a rede como ela é na revisão indicada. Não é uma oferta, uma solicitação nem aconselhamento de investimento, e nada nele deve ser lido como promessa sobre o preço, a liquidez ou a disponibilidade futuros do NURA. Os números marcados como afirmações publicadas são declarações do projeto; todos os outros podem ser conferidos na cadeia com as chamadas mostradas. Revisões posteriores substituem esta, e o número e a data da revisão no topo do documento identificam qual delas o leitor tem em mãos.

## 11. Referências

- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de blocos: [Nura Explorer](https://explorer.nurachain.net)
- Troca: [Nura Swap](https://swap.nurachain.net/)
- Versões da carteira: [Nura Wallet no GitHub](https://github.com/NuraChain/Wallet/releases)
- Código-fonte: [NuraChain no GitHub](https://github.com/NuraChain)
- Comunidade: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Padrões: [EIP-155](https://eips.ethereum.org/EIPS/eip-155) (proteção contra replay), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) (mercado de taxas), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) (adição de uma cadeia a uma carteira), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) (descoberta de carteiras)
- Guias: [O que é a Nura Chain](/blog/what-is-nura-chain), [conectando-se ao RPC](/blog/connect-to-nura-chain-rpc), [adicionando a rede a uma carteira](/blog/add-nura-chain-to-your-wallet), [implantando um contrato](/blog/deploy-a-smart-contract-on-nura-chain), [fornecimento e alocação](/blog/nura-coin-tokenomics)
