Em 22 de outubro de 2026 os desenvolvedores centrais da Ethereum adiaram a ativação da Glamsterdam na testnet Hoodi, marcada para 26 de outubro, para investigar como a EIP-8037 interage com os contratos inteligentes que já estão na rede principal. A decisão foi tomada na chamada All Core Devs Execution número 248, segundo a Ethereum Foundation. O gatilho foi uma revisão de segurança, e a ChainSecurity disse depois ter encontrado 13 contratos reais que podem ser afetados. Não há nova data para a testnet nem para a rede principal.

## Fatos principais

- **O quê:** o fork da Glamsterdam na Hoodi, programado para 26 de outubro de 2026 às 17:42:48 UTC, foi adiado, junto com a etapa que elevaria o limite de gás da Hoodi para 200 milhões.
- **Quem decidiu:** os desenvolvedores centrais na chamada All Core Devs Execution (ACDE) número 248, em 22 de outubro, segundo a Ethereum Foundation.
- **Por quê:** a EIP-8037, que reprecifica a criação de estado e a mede separadamente. A análise da ChainSecurity de 13 de outubro trata dela junto com a EIP-8038.
- **O risco:** contratos que julgam uma chamada que falhou pelo gás restante podem tratar uma operação que poderia ser repetida como falha definitiva, sem nenhuma mudança no código.
- **A contagem:** 13 contratos reais potencialmente afetados, segundo a ChainSecurity, que está fazendo divulgação responsável e não os nomeou.
- **Nova data:** nenhuma. As datas de 1, 8 e 9 de dezembro para a rede principal constavam da pauta da chamada para discussão; nenhuma foi confirmada.

## O que a EIP-8037 muda?

Ela encarece a criação de estado novo (contas novas, slots de armazenamento e código de contratos) e mede esse custo separadamente do gás de execução comum. O objetivo declarado da proposta é conter o crescimento do estado da Ethereum à medida que o limite de gás por bloco sobe. A medição separada é o que permite subir o limite sem que as cobranças de estado mais altas espremam todo o resto.

Pela leitura da ChainSecurity da especificação em 13 de outubro, gravar um slot de armazenamento novo teria uma cobrança de estado de 97.920 de gás além do custo de execução. Essa cobrança é paga primeiro a partir de um reservatório de gás separado, e o reservatório passa inteiro para cada chamada que um contrato faz. Quando a criação de estado é desfeita dentro de uma transação, o gás volta imediatamente.

## Por que isso é um risco para contratos já implantados?

Porque alguns contratos tomam decisões com base em quanto gás resta.

O ataque se chama insufficient gas griefing, ou sabotagem por gás insuficiente. Alguém dispara uma operação válida mas fornece um pouco menos de gás do que ela precisa para ter sucesso, deixando o suficiente para o contrato chamador registrar a falha. Um contrato cuidadoso se defende verificando o gás restante após uma chamada que falhou: se sobrou pouco demais, presume que a chamada ficou sem gás e reverte tudo, para que a operação possa ser tentada de novo.

Essa verificação se apoia numa suposição que vale há anos: o gás só diminui. Com as novas regras ele pode voltar, por uma recarga ou por um contrato intermediário que cria estado e depois reverte. Um tratador de falhas que antes ficava sem gás agora poderia terminar, e um contrato poderia marcar o saque ou o resgate de um usuário como falha definitiva. O pesquisador pcaversaccio resumiu isso num comentário na pauta da chamada: "A coisa fundamentalmente 'quebrada' é que `gasleft()` pode aumentar."

Nada no bytecode implantado precisa mudar para isso acontecer. O que muda é o ambiente por baixo dele.

## O que mudou desde nosso artigo anterior sobre a Glamsterdam?

Nossa [explicação de setembro sobre a Glamsterdam](/blog/ethereum-glamsterdam-upgrade) cobriu os dois destaques do fork, as listas de acesso em nível de bloco e a separação propositor-construtor inscrita no protocolo, e disse que eles não mexem nos opcodes com que você escreve. Isso continua valendo para esses dois. O artigo não cobriu a reprecificação de gás da EIP-8037 e da EIP-8038, que muda quanto as operações custam e, como visto acima, como o gás se comporta durante uma chamada. A expectativa de que o fork seria ativado no segundo semestre agora está em aberto, porque não há data.

## O que você deve fazer?

- **Se você escreve contratos:** o conselho da ChainSecurity é deixar que uma chamada que falhou reverta toda a operação sempre que possível e, quando não for, manter um caminho de recuperação em vez de tomar uma decisão irreversível com base no gás restante. Teste os tratadores de falhas tanto com a tabela de gás atual quanto com a da Glamsterdam, e não trate um limiar ajustado como prova de segurança.
- **Se você opera um nó ou validador na Hoodi:** atualize os clientes de execução e de consenso antes de 26 de outubro para versões que removam explicitamente a ativação, ou volte a uma versão anterior sem ela, segundo a Ethereum Foundation.
- **Se você tem ETH ou usa a rede principal:** nada, segundo a Foundation.

## Isso afeta outras redes EVM?

Não automaticamente. Redes EVM não herdam as atualizações da Ethereum; cada rede decide quais EIPs adotar e quando. Como a Nura Chain executa bytecode EVM está em [a compatibilidade EVM da Nura Chain](/blog/nura-chain-evm-compatibility). A lição mais ampla, de que um código auditado pode falhar porque o que está ao redor dele muda, é o argumento de [por que contratos auditados ainda são drenados](/blog/why-audited-contracts-get-drained).

A análise técnica é da [ChainSecurity](https://www.chainsecurity.com/blog/glamsterdam-gas/), a proposta é a [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) e a pauta da chamada é [ACDE #248](https://github.com/ethereum/pm/issues/2267). A decisão e suas instruções estão no [anúncio da Ethereum Foundation](https://blog.ethereum.org/2026/10/22/glamsterdam-hoodi-delay).
