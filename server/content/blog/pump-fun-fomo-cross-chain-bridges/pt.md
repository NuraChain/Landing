Em 21 de outubro de 2026 a Pump.fun tornou a Pump Bridge, sua própria infraestrutura entre redes, a rota padrão para as negociações entre redes no seu app, substituindo o provedor externo Relay. Um dia depois, em 22 de outubro, a rival FOMO começou a liberação pública da sua própria ponte e disse que as transações entre redes no seu app “agora chegam em menos de 1 s”. O número da Pump.fun é um tempo médio de compra de 1,95 segundo contra 3,88 segundos pela Relay, segundo testes próprios. Nenhuma das duas empresas publicou como sua ponte guarda ou move o dinheiro, e é essa a pergunta que decide do que uma negociação entre redes realmente depende.

## Fatos principais

- **Pump.fun, 21 de outubro:** a Pump Bridge virou a rota padrão entre redes no app, no lugar da Relay.
- **O teste da Pump.fun:** de 28 de setembro a 7 de outubro, mais de 400.000 resultados de negociações; compra média de 1,95 s contra 3,88 s, erros de compra de 0,9% contra 11,2%. Dados da própria Pump.fun, sem verificação independente, como noticiou o crypto.news em 22 de outubro.
- **Redes nesse teste:** Robinhood Chain, BNB Chain, Base, Arc e Ink, segundo o crypto.news.
- **Taxas:** por enquanto não há taxa de ponte separada; as taxas normais de negociação ainda podem se aplicar.
- **FOMO, 22 de outubro:** liberação pública da “fomo bridge”, depois de cerca de uma semana com uma pequena parcela dos usuários. Antes dependia de pontes externas, entre elas a Relay.
- **O que a FOMO afirma:** transações entre redes em menos de um segundo. Não deu período de comparação nem números auditados, observou o crypto.news em 23 de outubro.
- **O que nenhuma revelou:** de onde vem o dinheiro do lado de destino, o modelo de segurança ou qualquer auditoria.

## O que é uma ponte entre redes?

Uma forma de terminar com valor em uma blockchain depois de começar em outra.

As redes não leem umas às outras. Uma moeda na BNB Chain não pode simplesmente passar para a Base, então algo precisa ficar no meio: travá-la de um lado e emitir um direito do outro, ou pagar você com fundos que já estão do outro lado. Qual das duas coisas ela faz é toda a questão de segurança.

## Como um swap entre redes pode levar um ou dois segundos?

Porque nada precisa atravessar primeiro.

Esperar uma rede confirmar um depósito e depois outra cunhar leva mais de dois segundos. Os desenhos rápidos pulam a espera: um executor que já tem fundos na rede de destino paga você lá com o próprio saldo e recolhe seu depósito na rede de origem depois. A Relay, o provedor que os dois apps usavam antes, documenta exatamente isso: um solver executa com capital próprio, um oráculo atesta o depósito e a execução, e o solver é reembolsado mais tarde. O mesmo padrão está por trás dos [intents entre redes e do ERC-7683](/blog/cross-chain-intents-erc-7683).

A Pump.fun e a FOMO não disseram se suas pontes funcionam assim, nem com o dinheiro de quem a execução é feita. É uma inferência a partir da velocidade, não uma divulgação.

## O que lastreia um token em ponte?

Depende de que tipo de ponte o criou.

- **Travar e cunhar.** Sua moeda fica travada em um contrato ou carteira na rede de origem, e uma cópia encapsulada é cunhada para você na outra. A cópia vale o original só enquanto o original continuar travado. Você confia em quem pode liberar essa trava: uma multisig, um grupo de signatários, um contrato.
- **Pago por um executor.** Você recebe um ativo real na rede de destino, pago do estoque de alguém. Não fica segurando um direito, mas durante esses segundos confia que o executor vai pagar, e que o sistema que liquida com ele vai devolver seu dinheiro se ele não pagar.

O primeiro tipo tem a falha maior. Um fundo travado é grande, parado e público. O [exploit da Liquid Network](/blog/liquid-network-exploit-explained) levou cerca de 4.000 BTC de uma carteira de lastro cujos signatários assinaram porque o software mandou.

## Mais rápido significa mais seguro?

Não. Velocidade e taxa de erro são o que os anúncios medem; nenhuma das duas diz nada sobre o que acontece com os fundos se uma etapa falhar. Uma ponte operada pelo próprio app também faz desse app a parte em quem você confia, quando antes era um provedor externo. Isso pode ser melhor ou pior. Sem desenho publicado nem auditorias, ninguém de fora consegue dizer qual.

## Antes de usar uma ponte

- **Pergunte o que você vai ter no fim.** O ativo nativo, ou um direito encapsulado sobre a trava de outra pessoa?
- **Descubra quem pode mover o lastro,** e se a oferta encapsulada pode ser lida na rede.
- **Envie primeiro um valor pequeno,** e confirme que chegou antes de enviar o resto.
- **Leia números de velocidade como marketing até serem conferidos.** Os dois conjuntos aqui são informados pelas próprias empresas, vêm de testes diferentes e não podem ser comparados entre si.

## Como funciona a ponte da Nura Chain?

O whitepaper a descreve como uma ficha de chapelaria: a moeda original fica travada na sua rede de origem, e uma equivalente é emitida na Nura Chain. BNB, USDT, BTC e ETH em ponte na Nura Chain são tokens ERC-20 de cunhagem e queima, e sua oferta é pública: qualquer pessoa pode lê-la, como mostra [como usar o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer).

Os números são das próprias empresas e podem mudar conforme as liberações avançam. As fontes primárias são [o anúncio da Pump.fun](https://x.com/Pumpfun/status/2112980077881266326) e [o anúncio da FOMO](https://x.com/fomo/status/2113385954631160071).
