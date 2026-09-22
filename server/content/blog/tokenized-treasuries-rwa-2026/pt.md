Ativos do mundo real foram por anos um slide de apresentação. Em 2026 são um número: cerca de US$ 37,9 bilhões em valor de ativos distribuídos em 6 de agosto de 2026, contra aproximadamente US$ 4,1 bilhões em janeiro de 2025. Excluindo stablecoins, o mercado cresceu em torno de 30% só no primeiro trimestre de 2026, chegando a algo como US$ 29 bilhões — alta de 263% na comparação anual.

Uma única classe responde pela maior parte. Os títulos do Tesouro norte-americano tokenizados passaram de US$ 10 bilhões no fim de fevereiro de 2026 e de US$ 13,4 bilhões no início de abril, perto de 45% do total.

## O que é de fato um tesouro tokenizado

Tirado o vocabulário, a estrutura é banal.

- Um fundo ou emissor detém o instrumento real — dívida pública de curto prazo, custodiada no sistema tradicional.
- Emite-se on-chain um token que representa uma fração dessa posição.
- As transferências do token são registradas on-chain, em geral com restrição para que só endereços aprovados possam detê-lo.
- O resgate acontece fora da cadeia, contra o emissor e nos termos dele.

A cadeia faz o registro e a liquidação. Não faz a custódia e não assume o crédito.

## Onde mora a confiança

Aqui vale ser direto. Um tesouro tokenizado não é sem confiança. O token é um direito contra um emissor que guarda o ativo em outro lugar. O que a cadeia lhe dá é um mecanismo de transferência que liquida em segundos e um registro que qualquer um pode ler; o que ela não dá é garantia alguma sobre a coisa registrada.

Isso não é crítica, é o projeto. Mas significa que as perguntas que importam são as chatas: quem é o emissor, como é o resgate, quem é o custodiante e o que acontece se o emissor parar de responder.

## Por que as instituições entraram em 2026

O primeiro trimestre trouxe compromissos de infraestrutura, não pilotos. Nasdaq, NYSE e DTCC caminharam para integrar valores mobiliários tokenizados ao encanamento dos mercados regulados existentes. O BUIDL da BlackRock já estava lá; o JPMorgan lançou seu próprio fundo de rendimento on-chain em janeiro de 2026 com cem milhões de dólares iniciais, e Goldman Sachs e BNY Mellon disputam o mesmo mandato.

O mercado também deixou de ser uma categoria só. Pelo menos seis já ultrapassam, cada uma, um bilhão de dólares em valor on-chain — formato diferente do de um produto único com um número grande ao lado.

## O que isso significa para uma rede EVM comum

Mecanicamente, quase nada é exótico. Um token de transferência restrita é um ERC-20 com uma verificação em `transfer`, e é implantado como qualquer contrato — veja [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) e [criar um token ERC-20](/blog/create-an-erc-20-token-on-nura-chain).

O que não é comum é tudo o que fica fora da cadeia: o emissor, o custodiante, o auditor, o invólucro jurídico e a jurisdição. O token é a metade fácil. Quem lhe vende o token como se fosse o conjunto está lhe vendendo a metade fácil.

Os números acima são medições de terceiros nas datas indicadas e mudam rápido — leia-os como uma foto, não como uma constante.
