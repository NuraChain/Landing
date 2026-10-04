O Alpenglow, a mudança mais substancial no consenso da Solana até agora, entrou no ar na rede de testes da Solana em 22 de setembro de 2026. Não entrou no ar na rede principal em 28 de setembro, apesar de uma semana de manchetes dizendo que entraria. A atualização substitui a forma como os validadores votam e como os blocos se espalham, e mira uma finalidade de cerca de 100 a 150 milissegundos, contra cerca de 12,8 segundos hoje.

## Principais fatos

- **O que é:** um novo desenho de consenso, proposto como SIMD-0326, que substitui o TowerBFT.
- **Duas partes:** o Votor cuida da votação e da finalidade; o Rotor cuida de como os blocos são propagados.
- **Situação:** na rede de testes desde 22 de setembro de 2026. Não está na rede principal.
- **A confusão de datas:** 28 de setembro foi quando os desenvolvedores do cliente retomaram a ativação de recursos na rede principal em geral, não um lançamento do Alpenglow.
- **Próxima janela:** uma janela de ativação na rede principal se abre em 9 de novembro de 2026. Isso é uma janela, não um compromisso.

## O que é finalidade, e por que 150 ms importam?

Finalidade é o ponto a partir do qual uma transação não pode mais ser desfeita.

É diferente de um bloco ser produzido. Um bloco pode aparecer em menos de um segundo e ainda ser provisório; uma exchange que credita um depósito ou um lojista que libera uma mercadoria espera pela finalidade, não pela inclusão. Doze segundos é rápido para uma blockchain e lento para um checkout. Um décimo de segundo está na faixa em que uma pessoa não percebe espera nenhuma.

## Como o Alpenglow chega lá?

Tirando os votos da cadeia.

Hoje os validadores da Solana votam enviando transações, que são processadas como quaisquer outras e pagas como quaisquer outras. Com o Alpenglow, os validadores trocam votos diretamente e registram um certificado compacto assim que stake suficiente concorda. Um bloco que reúne uma fatia grande o bastante do stake na primeira rodada é final imediatamente; caso contrário, uma segunda rodada o conclui.

Um efeito colateral é econômico. Hoje os validadores pagam taxas a cada voto, um custo fixo que pesa mais sobre os operadores pequenos. Remover as transações de voto remove esse custo.

## Por que todo mundo achou que tinha sido lançado?

Porque um item de cronograma foi lido como um anúncio. O plano de lançamentos do cliente validador listava 28 de setembro como o dia em que a ativação de recursos seria retomada na rede principal. O Alpenglow era o recurso que as pessoas esperavam, então as duas coisas foram ligadas. Os desenvolvedores disseram com todas as letras que ele não aconteceria naquele dia.

A lição vale muito além da Solana: datas de atualização neste setor são metas até que o bloco em que elas são ativadas tenha sido produzido. A mesma cautela vale para o próximo fork da Ethereum, como observa [Glamsterdam, explicada](/blog/ethereum-glamsterdam-upgrade).

## Isso afeta as redes EVM?

Não diretamente. A Solana não é uma rede EVM; seus programas, contas e ferramental são separados, e nada do Alpenglow se transfere para elas.

A comparação ainda é útil, porque mostra o que "rápido" significa. Tempo de bloco e finalidade são números diferentes, e o número de destaque de uma rede costuma ser o primeiro. A Nura Chain produz um bloco a cada três segundos aproximadamente — esse é o seu tempo de bloco, informado em [o que é a Nura Chain](/blog/what-is-nura-chain) — e por que a compatibilidade com EVM não diz nada sobre consenso está explicado em [como a Nura Chain executa bytecode EVM](/blog/nura-chain-evm-compatibility). Quando comparar redes, pergunte qual dos dois números estão lhe mostrando.

As datas acima são as publicadas pelos desenvolvedores do cliente e podem mudar; a [Anza](https://www.anza.xyz) mantém o cronograma de lançamentos.
