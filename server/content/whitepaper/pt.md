A Nura Chain é uma blockchain pública: um registro compartilhado de quem tem o quê, mantido por computadores em vez de por um banco, que qualquer pessoa pode ler e que ninguém consegue reescrever em silêncio. Ela acrescenta uma página nova a esse registro a cada três segundos, roda com o mesmo motor do Ethereum e tem a própria moeda, o NURA, que paga a pequena taxa cobrada em cada transação. Ao redor dela existem uma carteira, um explorador para consultar informações, um swap para trocar moedas e uma ponte para trazer moedas de outras redes.

Este documento explica tudo isso em palavras simples. Foi escrito para quem nunca usou uma blockchain, para quem está decidindo se guarda NURA e para quem só quer entender o que está vendo. Onde uma afirmação pode ser conferida por qualquer pessoa, dizemos como; onde não pode, dizemos isso também.

## 1. O que é a Nura Chain

Pense numa blockchain como um caderno do qual milhares de pessoas guardam cópias idênticas. Quando alguém envia moedas, a transferência é escrita numa página nova, todas as cópias recebem a mesma página e, uma vez que a página entrou, ela fica. Ninguém consegue arrancar uma folha ou mudar um registro antigo sem que todo mundo perceba. Esse é o truque todo, e é por isso que uma blockchain consegue manter o dinheiro honesto sem uma empresa no meio.

A Nura Chain é um caderno desses. O que a torna fácil de usar é que ela roda com o mesmo motor do Ethereum, a plataforma de blockchain mais usada do mundo. Qualquer carteira, aplicativo ou ferramenta feita para o Ethereum funciona na Nura Chain também, então você não precisa de nenhum programa especial para usá-la. Se você já usou a MetaMask ou uma carteira parecida, já sabe como funciona.

Uma coisa para não confundir: a Nura Chain é a rede. A Nura Wallet, o Nura Explorer e a Nura Swap são produtos construídos em cima dela, descritos na seção 7. Você pode usar a rede com a carteira que preferir.

## 2. No que acreditamos

Quatro ideias moldam tudo o que vem abaixo.

- **Suas chaves, suas moedas.** Sua carteira guarda suas moedas com uma chave secreta que nunca sai do seu aparelho. Ninguém na Nura, e ninguém em lugar nenhum, consegue movimentar suas moedas, congelá-las ou tomá-las. O outro lado dessa moeda é que ninguém consegue recuperá-las para você também.
- **Confira, não confie.** Os fatos importantes sobre a rede podem ser conferidos por qualquer pessoa com uma carteira ou um navegador. Onde um número não pode ser conferido, este documento diz isso em vez de deixar você supor que pode.
- **Ferramentas conhecidas.** Nada na Nura Chain exige um tipo novo de aplicativo. As carteiras e ferramentas que as pessoas já usam funcionam aqui.
- **Falar com clareza.** Menos promessas, descritas com honestidade, inclusive as partes que não ficam bonitas.

## 3. Como a rede funciona

### 3.1 Blocos: uma página nova a cada três segundos

As páginas do caderno se chamam blocos. A Nura Chain escreve um bloco novo a cada três segundos, num ritmo fixo, tenha alguém enviado alguma coisa nesse tempo ou não. O primeiro bloco foi escrito em 6 de junho de 2026, e a contagem não parou de subir desde então. Você pode ver esse número subindo na página inicial do site e no Nura Explorer.

### 3.2 Taxas: uma pequena cobrança em cada transação

Toda transação paga uma taxa em NURA, um pouco como o selo de uma carta. A taxa tem duas partes: um valor base que a rede define e uma gorjeta opcional que você pode acrescentar se quiser que sua transação passe na frente. Sua carteira calcula isso para você; você nunca faz a conta na mão. No momento em que escrevemos, o valor base é uma fração minúscula de um NURA, mas ele é definido pela rede e pode mudar, então trate a taxa que sua carteira mostra como o número real.

### 3.3 Quem escreve os blocos

Algumas blockchains, como o Bitcoin, colocam computadores para competir resolvendo quebra-cabeças pelo direito de escrever o próximo bloco, que é o que as pessoas chamam de "mineração". A Nura Chain não funciona assim. Seus blocos são escritos por um produtor de blocos autorizado, no ritmo de três segundos descrito acima, e cada bloco registra qual conta o escreveu, então quem produziu qualquer bloco é informação pública, e não uma questão de confiança.

Para ser direto sobre como isso está hoje: no momento desta revisão, todos os blocos que examinamos foram escritos pela mesma conta produtora. Se mais produtores serão adicionados é uma decisão sobre como a rede é operada, não algo que este documento promete num sentido ou no outro. Qualquer mudança é anunciada pelos canais da seção 10.

### 3.4 Quando uma transação é definitiva?

Assim que sua transação é escrita num bloco, está feita. Ela aparece no Nura Explorer em poucos segundos, e não pode ser desfeita, revertida ou cancelada por ninguém, inclusive por nós. É isso que torna o registro confiável, e é também por isso que a seção 9 pede que você confira duas vezes antes de enviar.

## 4. A moeda NURA

O NURA é o dinheiro da própria rede, assim como o ether é o do Ethereum. Ele paga as taxas da seção 3.2, e uma conta sem nenhum NURA não consegue enviar nada, porque não consegue pagar o selo.

O NURA faz parte da própria rede, em vez de ser um aplicativo rodando sobre ela. Isso tem uma consequência prática: não existe "endereço de contrato do NURA" para adicionar à sua carteira. Você adiciona a própria rede, usando os valores da seção 10, e seu saldo em NURA simplesmente aparece. Se alguma página mandar você colar um endereço para "adicionar o NURA", cuidado: ela está pedindo algo que não existe.

Como a maioria das moedas desse tipo, o NURA pode ser dividido em frações muito pequenas, então você pode enviar um décimo, um milésimo ou muito menos de uma moeda.

## 5. Quantos NURA existem, e para onde vão

### 5.1 O total

O fornecimento total é de 1.000.000.000 NURA, um bilhão, e nenhum outro será criado além disso.

Esse número é publicado pelo projeto. Vale saber que ele é um dos poucos números aqui que você não consegue conferir sozinho: uma carteira ou o explorador mostram o saldo de qualquer endereço individual, mas uma moeda que faz parte da rede não tem um contador que some todos eles. Os saldos individuais são conferíveis; o total é a palavra do projeto.

Não declaramos um "fornecimento circulante" nesta revisão. Esse número depende de quais das parcelas abaixo contam como desbloqueadas num dado dia, e isso é um julgamento, não uma medição. Onde o projeto publicar os endereços que guardam uma parcela, qualquer pessoa pode acompanhar esses saldos em vez disso.

### 5.2 A divisão

O bilhão de moedas é dividido em seis partes. Para cada parcela: a fatia, o número de moedas e para que serve.

- **Bloqueado, 40%, 400.000.000 NURA.** Reservado e bloqueado por um ano. O que acontece com ele depois é decidido ao fim desse ano, e qualquer decisão sobre essa parcela precisa da aprovação de pelo menos 65% da rede em votação.
- **Liquidez, 25%, 250.000.000 NURA.** Usado ao longo de um ano para manter NURA suficiente disponível para compra e venda, de modo que negociar funcione sem sustos e o preço não dê um solavanco a cada negociação.
- **Comunidade, 10%, 100.000.000 NURA.** Dado a quem ajuda a rede a crescer ao longo de um ano: sendo ativo, participando, construindo coisas ou trazendo outras pessoas. Cada alocação é analisada e aprovada pelo conselho de gestão.
- **Venda pública, 10%, 100.000.000 NURA.** Vendido ao público por US$ 24.000 no total, o que dá US$ 0,00024 por NURA. Esse é o preço daquela venda, não o preço de mercado, e ele não diz nada sobre quanto o NURA vale num dia qualquer.
- **Tesouraria, 10%, 100.000.000 NURA.** O orçamento do próprio projeto ao longo de um ano, para desenvolvimento, infraestrutura, produtos e parcerias, sob supervisão do conselho de gestão.
- **Airdrop, 5%, 50.000.000 NURA.** Distribuído de graça ao longo de um ano a pessoas alcançadas por canais e comunidades selecionados. A lista final é confirmada pelo conselho de gestão.

Essas seis parcelas somam 100%.

### 5.3 Conferindo um saldo

Todo saldo na Nura Chain é público. Abra o Nura Explorer, cole qualquer endereço e você vê exatamente quantos NURA ele guarda e cada transferência que entrou e saiu. Isso funciona para o seu próprio endereço, para o de um amigo e para qualquer endereço que o projeto publique para uma das parcelas acima.

## 6. Quem decide o quê

Duas regras estão em vigor nesta revisão, e as duas são sobre as moedas da seção 5, não sobre a rede em si.

Os 40% bloqueados não podem ser liberados, redirecionados ou gastos sem uma votação em que pelo menos 65% da rede aprove. Essa é a única regra firme sobre a maior parcela isolada do fornecimento.

As parcelas da comunidade, da tesouraria e do airdrop, um quarto de todas as moedas somadas, são distribuídas sob a análise de um conselho de gestão, que aprova cada distribuição.

Não afirmamos nada além disso. Não existe um sistema de votação para as configurações da própria rede, como a frequência com que os blocos são escritos ou quem os escreve. Isso é decidido pelas pessoas que operam a rede, e este documento diz isso em vez de descrever um sistema que não existe.

## 7. As ferramentas ao redor da rede

### 7.1 Nura Wallet

A Nura Wallet é o nosso próprio aplicativo de carteira. Ela guarda sua chave secreta no seu aparelho e só nele; o aplicativo não consegue gastar suas moedas sozinho, e nós também não. Seu código-fonte é público no GitHub, então qualquer pessoa pode ler o que ele faz.

Ela está disponível para Android, tanto na Google Play quanto por download direto, para Windows e para Linux. As versões para iPhone e Mac ainda não saíram. Você não é obrigado a usá-la: qualquer carteira que permita adicionar uma rede personalizada, inclusive a MetaMask, funciona com a Nura Chain.

### 7.2 Nura Explorer

O Nura Explorer é a janela pública para o caderno. Digite um endereço, uma transação ou um número de bloco e você vê tudo sobre ele: saldos, transferências, quando um bloco foi escrito e por quem. É onde você confirma que um pagamento realmente chegou, e é a ferramenta por trás da maioria das frases "você pode conferir isso" deste documento.

### 7.3 Nura Swap

A Nura Swap é onde você troca NURA por outras moedas e vice-versa. Ela funciona a partir de uma reserva compartilhada de moedas, o pool, e o preço que mostra é simplesmente o saldo desse pool naquele momento.

O pool é pequeno. Isso significa que uma única negociação grande pode mover o preço bastante, para qualquer lado. Trate o preço do swap como o que um pool pequeno está cotando naquele instante, não como uma listagem em corretora, e não o leia como uma avaliação do NURA.

### 7.4 A ponte

A ponte permite trazer BNB e USDT para a Nura Chain a partir de suas redes de origem. Ela funciona como a ficha de um guarda-volumes: suas moedas originais ficam trancadas na outra rede, e você recebe aqui uma moeda "encapsulada" equivalente, que pode gastar na Nura Chain. Devolva a moeda encapsulada e a original é liberada.

Uma moeda encapsulada só vale o mesmo que a original enquanto a original estiver realmente lá. O site mostra o valor total que atravessou a ponte, e esse número conta as fichas, não os casacos: ele está certo enquanto cada moeda encapsulada tiver, do outro lado, uma original guardada para ela. Os endereços das duas moedas encapsuladas estão na seção 10.

## 8. Primeiros passos

1. Instale uma carteira. A Nura Wallet da seção 7.1, ou qualquer carteira que você já use e que permita adicionar uma rede personalizada.
2. Adicione a Nura Chain a ela. O botão "Adicionar a Nura Chain à carteira" no site faz isso num toque; se preferir fazer à mão, os valores estão na seção 10.
3. Confira se a carteira mostra o ID de cadeia 1020 para a rede. Se mostrar qualquer outro número, você está em outra rede, e tudo o que enviar vai parar num lugar que você não queria.
4. Consiga alguns NURA. As taxas são pagas em NURA, então uma conta vazia ainda não consegue enviar nada.
5. Envie uma quantia pequena primeiro, depois procure por ela no Nura Explorer. Ver sua própria transferência no registro público é o melhor jeito de entender como tudo isso funciona.

Se você é desenvolvedor, o blog do site tem guias passo a passo para se conectar à rede e implantar contratos; os links estão na seção 10.

## 9. Com o que tomar cuidado

- **Uma frase de recuperação perdida significa moedas perdidas.** Ninguém consegue redefini-la, nesta rede nem em nenhuma outra. Anote-a e guarde num lugar seguro.
- **Um ID de cadeia errado significa moedas perdidas.** Sempre confirme o 1020 antes de enviar, e trate qualquer página, inclusive esta, como algo a conferir, não como algo em que confiar.
- **O mesmo endereço em outra rede não é o mesmo dinheiro.** Seu endereço existe no Ethereum e em outras redes também, mas os saldos são separados. Enviar moedas para "o mesmo endereço em outra cadeia" não as transfere de uma para a outra. Só a ponte faz isso, e só para BNB e USDT.
- **O preço do swap pode oscilar.** Uma única negociação num pool pequeno pode movê-lo bruscamente.
- **Uma moeda encapsulada é a ficha, não o casaco.** Ela vale o mesmo que a original só enquanto a ponte guardar a original.
- **Alguns números são a palavra do projeto.** O fornecimento total e as condições da divisão não podem ser conferidos numa carteira. Os saldos individuais, sim.
- **A produção de blocos está nas mãos de uma única conta hoje.** A seção 3.3 diz isso com clareza para que você possa pesar isso agora, em vez de descobrir depois.

## 10. Os fatos, para consulta

Os valores que uma carteira pede quando você adiciona a rede à mão:

- Nome da rede: Nura Chain
- ID da cadeia: `1020` (algumas carteiras mostram como `0x3fc`, que é o mesmo número escrito de outro jeito)
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de blocos: `https://explorer.nurachain.net`
- Moeda: Nura, sigla `NURA`, 18 casas decimais
- Tempo de bloco: 3 segundos

As duas moedas encapsuladas que a ponte cria na Nura Chain:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

Para onde ir:

- [Nura Explorer](https://explorer.nurachain.net), para consultar qualquer coisa
- [Nura Swap](https://swap.nurachain.net/), para trocar moedas
- [Downloads da Nura Wallet](https://github.com/NuraChain/Wallet/releases), todas as versões e plataformas
- [Nura Chain no GitHub](https://github.com/NuraChain), o código-fonte
- Comunidade: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Guias: [o que é a Nura Chain](/blog/what-is-nura-chain), [adicionar a rede à sua carteira](/blog/add-nura-chain-to-your-wallet), [como ler o explorador](/blog/how-to-use-nura-chain-explorer), [fornecimento e alocação](/blog/nura-coin-tokenomics) e, para desenvolvedores, [conectar-se à rede](/blog/connect-to-nura-chain-rpc) e [implantar um contrato](/blog/deploy-a-smart-contract-on-nura-chain)

## 11. Uma nota sobre o que é este documento

Este documento descreve a rede como ela é na revisão indicada no topo. Ele não é uma oferta, uma recomendação nem aconselhamento de investimento, e nada nele é uma promessa sobre quanto o NURA vai valer, quão fácil será comprá-lo ou vendê-lo, ou o que o projeto fará em seguida. Os números descritos como a palavra do projeto são exatamente isso; todos os outros podem ser conferidos com as ferramentas acima. Quando mudamos algo que vale a pena saber, publicamos uma revisão nova, e o número e a data da revisão dizem qual delas você está lendo.
