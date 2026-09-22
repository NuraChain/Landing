A última semana de setembro de 2026 concentra um bom conjunto de liberações de tokens programadas. Calendários públicos de desbloqueio apontam um projeto liberando 1,76 bilhão de XPL em 25 de setembro, com outros dois colocando mais uns US$ 26 milhões em circulação na mesma janela.

Semanas de desbloqueio voltam o tempo todo, e a cobertura em torno delas costuma ser uma previsão de preço. O mais útil é entender o que o evento é de fato.

## Oferta total não é oferta circulante

Um token tem uma oferta total, fixada pelo contrato. E tem uma oferta circulante, que é a total menos tudo o que no momento não pode se mover: alocações de time em vesting, tranches de investidores atrás de um cliff, tesouraria sob um multisig, fundos de ecossistema atrás de um timelock.

Um desbloqueio não cria tokens. Nada é cunhado. O que muda é que uma parte do que já existia se torna transferível. A oferta total fica constante no evento; a circulante dá um degrau.

Essa distinção importa porque "avaliação totalmente diluída" precifica o primeiro número e o mercado negocia o segundo. Um projeto cuja oferta circulante é 8% do total tem 92% da sua oferta chegando conforme um cronograma que alguém escreveu.

## Como os cronogramas costumam ser montados

- **Um cliff.** Nada por um período fixo e depois um lote inteiro. É essa forma que gera um evento de calendário.
- **Vesting linear.** Um gotejamento contínuo, muitas vezes por bloco ou por mês, depois de vencido o cliff.
- **Liberações por marcos.** Atreladas a algo acontecer, o que faz da data uma estimativa e não um fato.

Escreve-se sobre o primeiro, porque é o único que se parece com uma data.

## O que um desbloqueio diz e o que não diz

Diz que a oferta que agora pode se mover, pode. Não diz que vai. Tokens liberados para uma tesouraria de longo prazo e tokens liberados para um investidor inicial não se comportam igual, e o cronograma sozinho não distingue os dois.

As perguntas que valem: quem recebe esta tranche, o que fizeram os recebedores anteriores da mesma tranche, e se algo disso já está protegido ou pré-vendido fora da cadeia. Nenhuma delas é respondida pelo número da manchete.

## Verifique contra a rede

Um cronograma costuma ser um contrato, e contrato dá para ler.

- Ache o contrato de vesting ou o timelock e olhe o saldo ao longo do tempo. Uma queda é uma liberação, e a transação mostra para onde foi.
- Verifique se o contrato do token pode cunhar. Um teto de oferta que só existe num documento não é um teto.
- Acompanhe depois o endereço recebedor, não só o bloco do desbloqueio. O movimento interessante é o salto seguinte.

[Como ler o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) cobre a mecânica de seguir um saldo e uma transferência, e o mesmo método funciona em qualquer rede EVM.

## Os números do próprio Nura Coin

A oferta total é de 1.000.000.000 NURA. Como isso se divide, para que serve cada parte e o que fica retido está em [oferta e alocação do Nura Coin](/blog/nura-coin-tokenomics), que é a página a ler no lugar desta para qualquer número específico desta rede.

O hábito geral é o que vale manter: leia o cronograma antes de precisar dele, confronte-o com o contrato, e trate qualquer artigo sobre desbloqueio — inclusive este — como um empurrão para ir olhar, não como uma conclusão.
