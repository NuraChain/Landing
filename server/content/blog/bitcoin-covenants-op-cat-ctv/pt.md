A última atualização de protocolo do Bitcoin foi o Taproot, em novembro de 2021. Nada foi ativado desde então. Os principais candidatos à próxima são os covenants do Bitcoin — regras que restringem como uma moeda poderá ser gasta no futuro — em duas formas concorrentes, OP_CAT e OP_CTV. Em 1º de outubro de 2026, Adam Back, diretor-executivo da Blockstream, endossou os opcodes de covenant como um possível "último soft fork". As propostas estão maduras. O processo para adotar uma delas é a parte que está travada.

## Principais fatos

- **Último soft fork:** Taproot, novembro de 2021.
- **OP_CAT (BIP 347):** junta dois pedaços de dados num script. Sua especificação foi marcada como concluída em março de 2026, e ele foi testado na signet.
- **OP_CTV (BIP 119):** vincula uma moeda a um modelo de gasto predefinido.
- **Nenhum dos dois está ativo** na rede principal do Bitcoin.
- **Um fracasso recente:** a BIP 110, uma proposta para limitar dados arbitrários em transações por um ano, obteve cerca de 2,5% de apoio dos mineradores contra os 55% de que precisava, e o ramo que a aplicava parou depois de dois blocos em agosto de 2026.

## O que é um covenant?

Uma condição que viaja com a moeda.

Hoje um script do Bitcoin decide quem pode gastar uma moeda. Ele não pode dizer nada sobre para onde a moeda vai em seguida. Um covenant pode: "esta moeda só pode ser enviada a um destes endereços", ou "esta moeda só pode ser movida depois de um prazo de espera, e durante esse prazo o dono pode cancelar".

Esse segundo exemplo é um cofre. Se um ladrão pega a sua chave, o saque é anunciado on-chain e fica esperando; você o vê e puxa os fundos de volta com uma chave de recuperação. É o uso mais citado para os covenants porque trata do roubo, que é o que os detentores de Bitcoin realmente temem.

## Em que OP_CAT e CTV diferem?

No quanto permitem.

- **O CTV é estreito.** Ele fixa, de antemão, o formato exato da transação que pode gastar uma moeda. É fácil de analisar e limitado ao que foi planejado.
- **O OP_CAT é geral.** Concatenar dados parece trivial, mas, combinado com opcodes existentes, permite que um script inspecione a transação que o está gastando, e a partir disso dá para construir muita coisa.

A discussão entre os dois é a velha discussão sobre ferramentas. Uma ferramenta estreita é mais segura de aprovar e pode precisar ser substituída. Uma geral pode ser a última mudança necessária, e é mais difícil de delimitar. O argumento de Back é a favor da segunda: "construir um conjunto geral de ferramentas uma vez, verificá-lo com rigor e deixar que a inovação futura aconteça em cima dele."

## Por que nada é ativado?

Porque o Bitcoin não tem um procedimento de decisão, e isso é proposital.

Não há uma fundação que agende forks nem uma votação que obrigue alguém. Um soft fork precisa que os desenvolvedores o incorporem ao código, que os mineradores sinalizem a favor dele e que os operadores de nós o rodem, e qualquer um desses grupos pode simplesmente não fazer isso. Desde o Taproot, não houve acordo nem sequer sobre como uma atualização deveria ser ativada.

A BIP 110 mostrou o que acontece quando uma proposta segue em frente sem esse acordo. Ela não mudou o Bitcoin. Produziu um ramo que, dois blocos depois, não era de ninguém.

Se isso é um defeito depende do que você quer. Uma rede quase impossível de mudar é também quase impossível de mudar para pior.

## Como isso é diferente numa rede EVM?

Tudo o que um covenant faz é comum ali. Um contrato pode guardar fundos e impor qualquer regra sobre para onde eles vão: timelocks, listas de permissão, cofres, limites de gasto. Nada exige uma mudança de protocolo, porque as regras vivem no contrato e não no consenso da rede — [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) mostra como isso exige pouca cerimônia, e [EIP-7702 e contas inteligentes](/blog/eip-7702-smart-accounts) cobre a versão da mesma ideia para carteiras.

O custo é a imagem no espelho. Contratos mais expressivos significam mais maneiras de errar, e as atualizações de uma rede EVM são decididas por um grupo menor do que as do Bitcoin. A cautela do Bitcoin e a flexibilidade da EVM são a mesma troca feita em direções opostas.

Os textos das propostas ficam no [repositório de BIPs do Bitcoin](https://github.com/bitcoin/bips); a situação registrada lá é a que vale, e os comentários, inclusive este, não.
