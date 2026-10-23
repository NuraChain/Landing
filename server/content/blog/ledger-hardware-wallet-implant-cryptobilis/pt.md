A Ledger diz que algumas carteiras de hardware vendidas pela CryptoBilis, uma revendedora autorizada da Ledger sediada na Malásia que atua em todo o Sudeste Asiático, traziam um implante de hardware não autorizado que copiava a frase de recuperação de 24 palavras do dono durante a configuração e a enviava por uma rede de telefonia móvel. A Ledger abriu uma investigação em 9 de outubro de 2026, após relatos de que carteiras de compradores tinham sido esvaziadas, e confirmou o implante em um aparelho afetado em 10 de outubro. A Ledger não divulgou um valor de perdas; rastreadores on-chain o situam entre mais de US$ 86 milhões e US$ 103,4 milhões.

## Principais fatos

- **O quê:** um implante dentro da carcaça do aparelho, que a Ledger descreve como um ataque físico à cadeia de suprimentos, e não uma violação do seu software ou dos seus sistemas.
- **Onde:** toda perda confirmada envolve um assinador vendido pela CryptoBilis, segundo a Ledger em uma atualização posterior; os sistemas e as vendas diretas da própria Ledger não foram afetados.
- **Quando:** investigação aberta em 9 de outubro de 2026; implante confirmado em 10 de outubro; a equipe de segurança da Ledger, a Donjon, descreveu como ele funcionava em 13 de outubro.
- **Quanto:** a Bitquery contou US$ 93,2 milhões retirados de 315 carteiras em seis blockchains, a preços de 9 de outubro, segundo a ForkLog em 12 de outubro. A Ledger diz que os números vêm de terceiros e que não os verificou totalmente.
- **Congelado:** a Tether congelou cerca de US$ 10 milhões em USDT ligados ao roubo, segundo o CoinDesk em 13 de outubro.
- **A revendedora:** a CryptoBilis parou de vender todas as marcas de carteiras de hardware enquanto a investigação estiver em curso.

## O que o implante fazia?

Lia a frase de recuperação na tela.

Uma carteira de hardware gera a frase dentro do seu chip seguro e a mostra uma única vez, na própria tela, para que o dono a anote. Segundo a atualização da Ledger de 13 de outubro, o microcontrolador do implante lia e decodificava essas 24 palavras à medida que apareciam durante a configuração e as transmitia por LTE usando um chip SIM embutido. Com a frase, o atacante pode reconstruir a carteira em qualquer lugar e retirar os fundos sem tocar no aparelho de novo.

A Ledger diz que o implante não modificou o Secure Element nem o sistema operacional do aparelho, e não alterou transações nem assinaturas.

## Por que a segurança do próprio aparelho não o impediu?

Porque nada do que ele verifica tinha mudado.

O chip seguro fez o seu trabalho: manteve as chaves lacradas. O vazamento aconteceu entre o chip e os olhos do dono, no único momento em que o segredo é exibido às claras. Segundo o BleepingComputer, citando um artigo de suporte da Ledger, o Genuine Check da Ledger não consegue detectar hardware adicionado quando o Secure Element original está intacto. Um aparelho pode passar em todas as verificações de software e ainda levar um passageiro.

É a mesma lição de [por que contratos auditados ainda são esvaziados](/blog/why-audited-contracts-get-drained): o componente forte resiste, e o dinheiro sai pelo que está ao redor dele.

## Quanto foi roubado?

Ninguém oficial disse, e os rastreadores discordam.

A primeira estimativa veio do investigador Specter, que situou as perdas em mais de US$ 86 milhões em 9 de outubro. A Bitquery contou US$ 93,2 milhões em 315 carteiras a preços de 9 de outubro, excluindo swaps e transferências entre carteiras do próprio atacante; até 12 de outubro a contagem tinha chegado a US$ 102,0 milhões em 324 carteiras, segundo a Genfinity em 13 de outubro. A YFarmX situou o total em US$ 103,4 milhões em 530 carteiras, segundo a ForkLog em 12 de outubro, sem descrever seu método. Os rastreadores não contam as mesmas coisas, então o número vai continuar mudando.

## É só a CryptoBilis?

É o que a Ledger confirmou até agora, e ela está examinando outros relatos.

Em 13 de outubro a Ledger disse que a varejista MediaMarkt Saturn tinha parado de vender aparelhos Ledger depois que um cliente na Alemanha relatou um implante; nesse caso não foi relatada perda de fundos. Mark Karpelès, ex-chefe da Mt. Gox, disse que um Ledger Flex comprado no aeroporto de Singapura continha um; a Ledger não o ligou a este incidente. A Trezor disse não ter relatos de aparelhos Trezor adulterados, mas retirou a CryptoBilis de suas revendedoras, e a OneKey revogou sua autorização e ofereceu substituições gratuitas.

## O que fazer se você tem uma carteira de hardware?

O conselho da própria Ledger, mais a regra por trás dele.

- **Comprou na CryptoBilis e ainda não configurou?** Não o inicialize.
- **Já está usando?** Transfira seus ativos para um aparelho novo com uma frase de recuperação recém-gerada.
- **Perdeu fundos?** Entre em contato com o suporte da Ledger, registre um boletim de ocorrência e coordene com as autoridades antes de abrir o aparelho.
- **Vai comprar um novo?** Compre diretamente do fabricante sempre que puder — a CryptoBilis era uma revendedora autorizada, e isso não impediu o ataque — e desconfie de um preço muito abaixo do normal.
- **Nunca reutilize uma frase** que um aparelho suspeito tenha mostrado. Um aparelho novo com uma frase antiga continua comprometido.

## O que isso significa para a autocustódia?

A autocustódia transfere o risco de uma empresa para você, e parte desse risco é o aparelho que mostra o segredo.

A Nura Wallet é de autocustódia — as chaves ficam no seu dispositivo — e vale para ela a mesma regra que para qualquer carteira: uma frase de recuperação só é tão privada quanto o aparelho que a exibiu pela primeira vez. Se você tem ativos na Nura Chain, qualquer carteira EVM pode chegar à rede seguindo [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet).

A investigação continua e os números vão mudar. A fonte primária é [a atualização da Ledger Donjon de 13 de outubro](https://x.com/Ledger/status/2109896739985453358).
