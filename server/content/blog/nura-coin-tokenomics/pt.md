A Nura Coin, sigla `NURA`, é o ativo nativo da Nura Chain. Esta página expõe o que ela faz, quais são os números de fornecimento publicados e — a parte que a maioria das páginas de tokenomics deixa de fora — quais desses números você pode conferir sozinho e quais está aceitando na palavra do projeto.

## Para que serve o NURA

Ele paga o gás. Toda transação na rede consome gás, o gás é precificado em NURA, e uma conta com saldo zero não consegue enviar absolutamente nada, inclusive sua primeira implantação de contrato. É o mesmo papel que o ether cumpre no Ethereum.

Tem 18 casas decimais, o que é convenção da EVM e não uma decisão tomada aqui. A menor unidade é, portanto, um bilionésimo de um bilionésimo de NURA, e qualquer carteira ou biblioteca faz essa conversão por você.

Como é o ativo nativo e não um contrato, ele não tem endereço de token. Se alguma página pedir "o endereço de contrato do NURA" para adicionar a moeda nativa, desconfie: o que faz o NURA aparecer é adicionar a rede, e [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet) descreve o procedimento inteiro.

## Fornecimento total

O fornecimento total publicado é de 1.000.000.000 NURA — um bilhão.

## Como o fornecimento é dividido

O projeto publica uma divisão em seis partes. Estas são as alocações declaradas e seus propósitos declarados:

- **Bloqueado — 40%.** Bloqueado por um ano. O que acontece com ele será decidido ao fim desse período, e está declarado que qualquer decisão sobre essa parcela exige aprovação por voto de ao menos 65% da rede.
- **Liquidez — 25%.** Alocado ao longo de um ano para prover e administrar liquidez, com o objetivo de uma liquidez de negociação funcional.
- **Comunidade — 10%.** Distribuído a membros da comunidade ao longo de um ano, para quem contribui com atividade, participação, desenvolvimento ou indicações em vez de pagar. A alocação segue revisão e aprovação do conselho de gestão.
- **Venda pública — 10%.** Oferecido numa venda pública com preço total de US$ 24.000. Essa parcela são 100.000.000 de tokens, o que dá US$ 0,00024 por NURA.
- **Tesouraria — 10%.** Alocado ao longo de um ano sob supervisão do conselho de gestão, para financiar desenvolvimento do ecossistema, infraestrutura, produtos e parcerias.
- **Airdrop — 5%.** Distribuído ao longo de um ano, com destinatários identificados por canais e comunidades selecionados e a alocação final confirmada pelo conselho de gestão.

Essas partes somam 100%.

## O que você pode verificar e o que não pode

Esta é a seção que vale ler duas vezes, porque se aplica a qualquer cadeia e não só a esta.

**Você pode verificar qualquer saldo específico.** Saldos estão na cadeia e são públicos:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

A resposta vem em wei, codificada em hexadecimal. Divida por 10^18 para obter NURA.

**Você não pode verificar o fornecimento total de uma moeda nativa pelo RPC padrão.** Não existe `eth_totalSupply`. Um ERC-20 tem uma função `totalSupply()` porque é um contrato mantendo o próprio livro; a emissão de uma moeda nativa vive nas regras de consenso e no estado gênese, não num contrato consultável. Então o número de um bilhão acima é uma afirmação publicada, não algo que uma chamada JSON-RPC vá lhe confirmar.

Essa distinção merece ser internalizada. Em qualquer cadeia, "fornecimento total" do ativo nativo é uma afirmação feita pelo projeto e verificável apenas lendo a configuração do cliente ou o bloco gênese. Já o fornecimento de um token é sempre conferível — e é por isso que [criar um ERC-20 na Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) consegue mostrar exatamente como.

**O fornecimento circulante não é declarado aqui de propósito.** Um número de circulante depende de quais alocações são consideradas destravadas num dado momento, e isso é um julgamento e não uma medição, a menos que cada alocação bloqueada esteja num endereço publicado que você possa observar. Onde tais endereços forem publicados, dá para conferi-los com a chamada de saldo acima.

## Guardando NURA

Qualquer carteira que aceite uma rede EVM personalizada pode guardá-lo — os valores da rede estão em [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet). Existe também a Nura Wallet, uma carteira de autocustódia feita para esta rede com versões para Android, Windows e Linux.

Seja qual for a escolha, autocustódia significa que as chaves são suas e a responsabilidade também. Não há caminho de recuperação para uma frase semente perdida, nesta rede nem em nenhuma outra.

## Perguntas frequentes

### O NURA é um token ERC-20?

Não. É a moeda nativa da rede, do mesmo modo que o ether é nativo do Ethereum. Tokens ERC-20 existem na Nura Chain como contratos separados, mas o próprio NURA não é um deles.

### Preciso de NURA para usar a rede?

Para ler dela, não — o endpoint RPC responde chamadas de leitura de qualquer um. Para enviar transação ou implantar contrato, sim, porque é o que paga o gás.

### Onde vejo o preço atual?

Esta página não cita preço ao vivo, e qualquer página que cite deveria ser confrontada com uma exchange onde você realmente possa negociar. O único número indicado acima é o preço publicado da venda pública, que é uma condição histórica fixa daquela venda e não uma cotação de mercado.

### Como confiro o saldo de uma carteira específica?

Use a chamada `eth_getBalance` acima, ou cole o endereço no [Nura Explorer](https://explorer.nurachain.net). Os dois leem a mesma cadeia — [como usar o explorador](/blog/how-to-use-nura-chain-explorer) explica por que conferir ambos é um bom hábito.

## Para onde ir agora

Para de fato guardar ou movimentar NURA, comece por [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet).

Para saber o que a moeda está pagando — a própria rede, seu ID de cadeia e seu RPC — veja [o que é a Nura Chain](/blog/what-is-nura-chain). E se a distinção sobre fornecimento lhe interessou, [criar um ERC-20 na Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) mostra o caso oposto, em que o fornecimento é totalmente conferível.
