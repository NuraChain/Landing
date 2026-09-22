Hoje existem mais de oitenta redes compatíveis com EVM com atividade real, e o número continua subindo. Vale explicar isso com honestidade, inclusive partindo de uma rede que é uma das entradas dessa lista.

## A metade barata

Tudo o que torna uma rede "compatível com EVM" está disponível para copiar. O cliente de execução é de código aberto, a semântica dos opcodes é especificada, os nomes dos métodos JSON-RPC são documentados e o formato de endereço é um hash de chave pública. Lançar uma rede para a qual o Solidity compila e à qual a MetaMask se conecta é, a esta altura, um exercício de configuração.

Isso não é reclamação. É a razão de um desenvolvedor conseguir mirar uma rede nova com uma mudança de uma linha em vez de uma reescrita, e é a coisa mais útil que a Ethereum deu ao resto do setor.

## A metade cara

Nada do que vem a seguir se copia.

- **Liquidez.** Um mercado existe onde estão os participantes. Não dá para implantá-lo.
- **Usuários.** As pessoas vão aonde os aplicativos que elas querem já rodam.
- **Orçamento de segurança.** Quanto custa atacar o consenso — uma grandeza econômica, não uma opção de configuração.
- **Histórico operacional.** Como a rede se comportou num incidente, num pico de congestionamento, numa atualização que deu errado. Só o tempo produz isso.
- **Contratos auditáveis já implantados.** Um padrão de token é código; um token em que as pessoas confiam é um histórico.

Uma rede nova começa com toda a primeira metade e nada da segunda. É essa lacuna que a maioria nunca fecha, e é por isso que a contagem sobe enquanto a lista de redes que importam muda devagar.

## Por que alguém lança uma assim mesmo

Às vezes por um motivo real: um mercado de taxas que um aplicativo específico exige, um tempo de bloco que um jogo pede, uma jurisdição, um conjunto de validadores permissionado que uma instituição é obrigada a ter, um rollup que herda segurança de outro lugar.

Às vezes sem motivo algum além de querer uma. As duas coisas parecem idênticas no primeiro dia, e esse é o problema de quem precisa escolher.

## Como avaliar uma que você acabou de conhecer

Pergunte à rede, não ao site de marketing.

- **O RPC responde honestamente?** Checar `eth_chainId` leva dez segundos e diz se o ID anunciado é o ID servido.
- **Existe um explorador que funciona?** Não um logo — um explorador onde você ache a sua própria transação.
- **Quem produz blocos, e quantos são?** Um número que dá para consultar vale mais que um adjetivo.
- **O que está de fato implantado?** Contratos verificados com histórico real de transações, ou um estado vazio com um roteiro.
- **E se o time sumir?** O software do nó é algo que você conseguiria rodar sozinho?

Todas essas perguntas se aplicam à Nura Chain. As respostas foram feitas para serem conferidas, não para serem aceitas: [o que é a Nura Chain](/blog/what-is-nura-chain) enuncia os valores, [conectar-se ao RPC](/blog/connect-to-nura-chain-rpc) mostra como verificá-los contra o nó, e [o guia do explorador](/blog/how-to-use-nura-chain-explorer) mostra como ler o que existe de fato.

A conclusão útil não é que oitenta redes sejam demais. É que "compatível com EVM" fala do ferramental e quase nada da rede — e nunca teve a intenção de falar.
