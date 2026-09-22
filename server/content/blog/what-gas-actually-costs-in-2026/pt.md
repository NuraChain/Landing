Toda afirmação de que uma rede é barata cita um número. Uma taxa é feita de três, e os dois que faltam costumam ser onde a afirmação mora.

```
taxa em moeda = unidades de gás x preço do gás x preço da moeda nativa
```

As unidades de gás são definidas pelo que a transação faz. O preço do gás é definido pelo mercado de espaço em bloco. O preço da moeda é definido por todo o resto. Uma rede com preço de gás minúsculo e moeda cara não é barata; uma com preço de gás alto e moeda sem valor não é cara.

## Os três números, separadamente

**Unidades de gás** são determinísticas. Uma transferência simples são 21.000. Uma transferência ERC-20 costuma ficar entre 45.000 e 65.000, dependendo de a posição de saldo do destinatário já ser diferente de zero. Uma implantação de contrato vai de milhares a milhões, conforme o tamanho do bytecode. São propriedades da EVM e valem igual em qualquer rede EVM.

**Preço do gás** é o mercado. Desde a EIP-1559 ele se divide em uma taxa base que o protocolo define por bloco e queima, e uma taxa de prioridade que você acrescenta para ser incluído antes. Na rede principal da Ethereum, em 2026 a taxa base passou longos períodos em torno de 0,15 gwei, o que deixa uma transferência básica abaixo de um centavo. É um mundo diferente de 2021, e é resultado direto de a demanda ter migrado para rollups e de existir espaço de blob para os dados deles.

**Preço da moeda** é a parte que ninguém controla e todo mundo esquece. É também por isso que uma taxa citada em gwei não diz nada até você multiplicar.

## Estime você mesmo

Duas chamadas JSON-RPC precificam qualquer transação em qualquer rede EVM. Nenhum painel necessário.

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

O resultado é uma string hexadecimal em wei. Divida por 10^9 para gwei, multiplique pelas suas unidades de gás e divida por 10^18 para chegar a um número em moedas inteiras. O `eth_estimateGas` faz a primeira metade da multiplicação se você lhe entregar um objeto de transação.

Fazer isso uma vez, contra a própria rede, vale mais do que qualquer tabela comparativa — inclusive este artigo.

## Por que o limite de gás importa para o preço

Preço do gás é um leilão por espaço num bloco. Aumente o espaço e, tudo mais constante, o preço de equilíbrio cai. É exatamente por isso que a futura elevação do limite de gás por bloco da Ethereum — de cerca de 60 milhões para algo próximo de 200 milhões, viabilizada pelas mudanças da [atualização Glamsterdam](/blog/ethereum-glamsterdam-upgrade) — é tanto uma história de taxas quanto de capacidade.

## Na Nura Chain

O gás é pago em NURA, os blocos caem a cada três segundos aproximadamente e as transações levam taxa base EIP-1559, então a aritmética acima se aplica sem mudança. Os valores de que você precisa estão em [o que é a Nura Chain](/blog/what-is-nura-chain), e [conectar-se ao RPC](/blog/connect-to-nura-chain-rpc) cobre o endpoint com o qual o curl acima conversa.

Um hábito prático: estime antes de enviar, não depois. Unidades de gás são conhecíveis de antemão, e a transação que surpreende quase sempre é a que tocou mais armazenamento do que você esperava.
