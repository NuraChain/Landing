As stablecoins passaram uma década como a coisa mais usada do cripto e a menos definida. Isso acabou com a GENIUS Act, assinada em julho de 2025 como o primeiro marco federal norte-americano para stablecoins de pagamento, e 2026 é o ano em que o detalhe está sendo escrito: o Tesouro e o OCC colocaram propostas em consulta, com o prazo de comentários da regra antilavagem do Tesouro correndo até 19 de outubro de 2026.

A lei em si passa a valer em 18 de janeiro de 2027. A partir dessa data, emitir uma stablecoin de pagamento nos Estados Unidos sem licença federal ou estadual fica proibido.

## O que o marco realmente exige

Três coisas, em termos simples.

- **Uma licença.** Só um emissor autorizado de stablecoin de pagamento pode emitir. É um status que se requer, não uma estrutura que se alega.
- **Reservas que se possam apontar.** Uma stablecoin de pagamento é um direito resgatável ao par, e as regras tratam do que sustenta esse direito.
- **O aparato de conformidade de uma instituição financeira.** Emissores passam a estar sob o Bank Secrecy Act, com obrigações antilavagem e um programa de conformidade com sanções.

Nada disso é estranho para transmissão de dinheiro. O novo é que se aplica a um token e não a uma conta em banco.

## O que ele não faz

É um regulamento para emissores, não para as redes por onde os tokens circulam nem para quem os detém. Não transforma uma blockchain em entidade regulada e não alcança todo token que mantém preço estável — desenhos algorítmicos ou com rendimento são outra pergunta, sob outro título.

Além disso, é uma jurisdição só. O regime MiCA da UE e o licenciamento de Hong Kong vieram em seus próprios calendários e não dizem a mesma coisa. Um token conforme num lugar não fica por isso conforme em todos.

## A parte que importa se você tem uma na rede

Uma stablecoin embrulhada não é o token do emissor. Quando uma ponte cunha uma representação de USDT em outra rede, o que você tem é um contrato ERC-20 cujo valor depende de aquela ponte continuar honrando-o. As reservas do emissor lastreiam o original. O seu direito é contra a ponte.

Nada do acima muda essa distinção, e vale ser concreto, porque "USDT na rede X" se lê como um ativo e na verdade são dois.

- Verifique qual endereço de contrato você tem de fato, e quem o implantou.
- Entenda como funciona o resgate antes de precisar dele, não depois.
- Trate um saldo em ponte como exposição à ponte além de ao emissor.

A Nura Chain tem representações embrulhadas de BNB e USDT, cunhadas pela sua ponte como contratos ERC-20 comuns — o mesmo formato de qualquer token aqui, descrito em [criar um token ERC-20 na Nura Chain](/blog/create-an-erc-20-token-on-nura-chain). Você mesmo pode conferir tudo isso no [explorador](https://explorer.nurachain.net); [como ler o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) mostra onde olhar.

Nada disto é aconselhamento jurídico. As propostas são públicas, os prazos de comentário são reais e as datas acima devem ser conferidas junto ao [Tesouro dos EUA](https://home.treasury.gov), não num post de blog.
