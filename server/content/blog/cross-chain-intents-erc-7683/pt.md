Hoje há mais de oitenta redes compatíveis com EVM com atividade on-chain relevante, além de vários ecossistemas não EVM com seus próprios usuários. Mover valor entre elas significava escolher uma ponte, entender seu modelo de confiança e torcer. Em 2026 o padrão dominante é outro: você assina o que quer, e outra pessoa resolve como.

## O que é um intent

Um intent é uma declaração assinada de um resultado. Não "chame este contrato desta ponte com estes parâmetros", mas "tenho 100 USDC aqui, quero pelo menos 99,4 USDC lá, antes deste prazo".

Essa ordem vai para uma rede de solvers, que competem para executá-la. Um solver que já tem USDC na rede de destino simplesmente paga você lá e depois reivindica seus fundos na rede de origem. Nada seu atravessa coisa alguma. O que atravessou foi o estoque do solver, dias antes, na hora que ele escolheu.

A **ERC-7683**, escrita pela Uniswap Labs e pela Across Labs, é o padrão que tornou isso portátil: um formato de dados para ordens de intent entre redes, de modo que qualquer protocolo que as emita possa ser atendido por qualquer rede de solvers compatível. É o formato mais adotado do gênero.

## Por que virou o padrão

Porque o modo de falha do modelo antigo era o pior possível. Uma ponte de travar e cunhar mantém um grande pool estático de ativos e publica seu endereço, o que é um convite permanente. Anos de incidentes saíram exatamente dessa forma.

O modelo de intents não tem pote de mel permanente. Também acaba sendo mais rápido e cota um preço antes de você se comprometer, que é o que o usuário de fato percebe. Pagamentos com stablecoins são o caso de uso entre redes de maior volume em 2026, e só o NEAR Intents já processou cerca de US$ 5 bilhões em volume por 25 ou mais redes.

## No que você confia em troca

Não em nada. O risco mudou de lugar, não sumiu.

- **O contrato de custódia.** Seus fundos ficam nele até a execução ser provada. Esse contrato vale o que valer o código dele.
- **A prova de execução.** Como a rede de origem fica sabendo que o destino foi pago. Às vezes um oráculo, às vezes uma janela otimista com período de contestação, às vezes um light client. Essa é a suposição de confiança real e varia por protocolo.
- **A concorrência entre solvers.** A qualidade do preço depende de haver vários interessados na sua ordem. Mercado raso cota preço raso.
- **O prazo.** Se ninguém executar, você recupera os fundos quando ele expirar — ou seja, "não executado" é atraso, não perda, desde que a custódia se comporte.

## O que isso significa para uma rede como esta

Intents são a razão de uma rede EVM nova não estar mais isolada por padrão. Solvers mantêm estoque onde há demanda, e a exigência técnica sobre uma rede é a de sempre: JSON-RPC padrão, blocos rápidos, transações baratas e estado legível. [Conectar-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc) é essa interface, e [o que é a Nura Chain](/blog/what-is-nura-chain) cobre o resto dos valores que um solver ou uma carteira precisariam.

O resumo honesto: intents não eliminaram o problema da ponte; trocaram um depósito estático de ativos travados por um mercado de gente que movimenta os próprios. É um formato melhor, e ainda assim um formato com suposições dentro.
