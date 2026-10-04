Hoje todo nó da Ethereum confere um bloco do mesmo jeito: executa de novo cada transação e compara o resultado. A EIP-8025 propõe um segundo jeito. Um provador especializado executa o bloco uma vez e produz uma prova zkEVM de que a execução foi correta, e todos os demais conferem a prova, o que é muito mais barato do que repetir o trabalho. No AMA de protocolo da Ethereum Foundation, em 16 de setembro de 2026, pesquisadores descreveram a geração de provas zkEVM como próxima da produção, e a proposta é candidata ao fork Hegotá.

## Principais fatos

- **A proposta:** a EIP-8025, "Provas de Execução Opcionais", permite que os nós de consenso aceitem um bloco com base em provas zkEVM enviadas pela rede ponto a ponto.
- **Opcional:** os validadores que não aderirem "não veem mudança alguma".
- **Velocidade:** a fundação informou que 99% dos blocos da Ethereum podem ser provados em até 10 segundos no hardware que ela tem como alvo. Um bloco chega a cada 12 segundos.
- **Calendário:** o ethereum.org lista o Hegotá como uma atualização em planejamento, com o segundo trimestre de 2027 como período esperado e sem data confirmada.
- **Situação:** proposta para inclusão no Hegotá, não agendada.

## O que é uma prova zkEVM?

Um pequeno conjunto de dados que convence você de que uma computação foi feita corretamente, sem que você a faça.

O provador executa as transações do bloco e registra cada passo. A partir desse registro, ele constrói uma prova criptográfica. Conferir a prova exige uma fração do esforço da execução, e seu custo quase não cresce com o tamanho do bloco. "Conhecimento zero" é a família de matemática envolvida; nada aqui está sendo escondido. A propriedade útil é que a verificação é barata.

## Por que a Ethereum quer isso?

Porque a reexecução é o que mantém os blocos pequenos.

Se todo nó precisa reexecutar cada transação em poucos segundos num hardware modesto, a quantidade de computação num bloco fica limitada pela máquina mais lenta que você não está disposto a excluir. Troque reexecutar por verificar e esse limite se move: como diz o ethereum.org, "quando a verificação é barata, o limite de gás pode aumentar com segurança." É o mesmo objetivo da execução paralela do próximo fork, descrita em [Glamsterdam, explicada](/blog/ethereum-glamsterdam-upgrade), alcançado por outro caminho.

Isso também reduz o custo de operar um validador, o que importa para quantas pessoas conseguem fazê-lo.

## O que "tempo real" significa aqui?

Rápido o bastante para acompanhar a rede. Uma prova que chega depois do bloco seguinte não serve para o consenso, então o orçamento são os doze segundos entre um bloco e outro.

A média não é a parte difícil. Os autores da EIP-8025 observam que provar a maioria dos blocos em segundos "tem valor limitado se um atacante consegue montar um bloco que leva minutos para ser provado." Uma rede precisa sobreviver ao seu pior bloco, não ao típico.

## O que ainda não está resolvido?

- **Se os provadores estão corretos.** Um bug num sistema de provas é um bug no consenso. Um trabalho de verificação formal deste ano estabeleceu garantias para partes da implementação RISC-V de um provador, e testes posteriores ainda encontraram um problema nela.
- **Quem gera as provas.** Isso exige hardware pesado. Se só alguns operadores puderem bancá-lo, conferir um bloco fica mais descentralizado, enquanto provar um bloco fica menos.
- **Diversidade.** A Ethereum depende de vários clientes independentes para que um único bug não consiga bifurcar a rede. O mesmo precisa valer para os provadores, e o ethereum.org lista cinco em desenvolvimento.

É por isso que o primeiro passo é opcional. Nós que verificam provas rodam ao lado de nós que reexecutam, e os dois se conferem mutuamente.

## Muda alguma coisa para os contratos ou para outras redes EVM?

Para os contratos, não. A proposta é explícita: "A EVM em si não é modificada." O Solidity compila para o mesmo bytecode, e ele faz a mesma coisa.

Para outras redes EVM, nada é herdado automaticamente. Cada rede decide como os seus próprios nós validam blocos, e nada aqui é uma afirmação sobre os planos da Nura Chain. O que toda rede EVM compartilha é a própria camada de execução — o assunto de [como a Nura Chain executa bytecode EVM](/blog/nura-chain-evm-compatibility) — e tudo o que for construído para provar a execução da EVM é construído contra essa especificação compartilhada.

Os cronogramas aqui são planos. O [blog de zkEVM da Ethereum Foundation](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota) e o [ethereum.org](https://ethereum.org/roadmap/zkevm/) trazem os atuais.
