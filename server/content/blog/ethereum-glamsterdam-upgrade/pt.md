A Ethereum hoje publica atualizações de protocolo num ritmo de cerca de seis meses, e a Glamsterdam é a próxima da fila. Entrou na fase final de desenvolvimento em junho de 2026 e deve ser ativada no segundo semestre do ano. Se você escreve Solidity ou opera um nó, vale saber o que vem nela antes que chegue.

## As duas mudanças que importam

Os destaques são as listas de acesso em nível de bloco e a separação entre propositor e construtor embutida no protocolo.

- **As listas de acesso em nível de bloco** publicam antecipadamente quais contas e quais posições de armazenamento um bloco vai tocar. Um nó que conhece a lista de antemão consegue ler esse estado em paralelo e executar ao mesmo tempo as transações que não se sobrepõem, em vez de estritamente uma após a outra.
- **A separação entre propositor e construtor embutida** escreve dentro do próprio protocolo a divisão entre o validador que propõe um bloco e o construtor que o monta, em vez de deixá-la a cargo de relays fora da cadeia em que todos confiam e que ninguém é obrigado a rodar.

Nenhuma das duas muda o bytecode para o qual seus contratos compilam. Ambas mudam o que cabe em um bloco.

## No fundo, isto é sobre o limite de gás

A execução sequencial é o motivo de o limite de gás da rede principal continuar conservador: cada nó reexecuta cada transação em ordem. Quando um bloco declara seus acessos de estado antecipadamente, essa reexecução deixa de ser o gargalo e o teto pode subir. Os números em discussão vão de cerca de 60 milhões de gás por bloco hoje para algo próximo de 200 milhões.

Mais gás por bloco é mais espaço para os mesmos contratos, não para outros. É uma mudança de capacidade, não de linguagem.

## O que você realmente precisa fazer

Muito pouco, se usa ferramentas comuns.

- Solidity, Hardhat e Foundry miram a EVM, e essas propostas não mudam a semântica dos opcodes contra os quais você escreve.
- Bibliotecas como ethers.js e viem já constroem transações EIP-1559 por padrão, que é a parte do mercado de taxas sentida pelo usuário.
- Se você opera o próprio nó ou um indexador, leia as notas de versão com atenção. O que muda é a estrutura do bloco, e estrutura de bloco é o que a infraestrutura analisa.

## O que isso significa em outras redes EVM

Redes EVM não herdam automaticamente as atualizações de upstream. Cada rede decide quais EIPs adota e quando. O que elas herdam é o ferramental, e é isso que torna uma rede nova uma linha de configuração em vez de uma reescrita.

A Nura Chain já precifica transações com taxa base EIP-1559, do mesmo jeito que a Ethereum desde London, então qualquer biblioteca escrita nos últimos anos funciona sem alteração. A mecânica está em [como a Nura Chain executa bytecode EVM](/blog/nura-chain-evm-compatibility), e o endpoint em [conectar-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc).

Cronogramas de atualização mudam. Confira o [ethereum.org](https://ethereum.org), e não esta página, antes de planejar em cima de uma data.
