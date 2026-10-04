O Core Lightning, uma das principais implementações da Lightning Network do Bitcoin, orientou os operadores de nós a atualizar imediatamente para a versão 26.06.8, lançada em 22 de setembro de 2026. O projeto disse ter recebido relatos de atacantes mirando nós que rodam a 26.06.7 ou anteriores. Não disse qual falha está sendo usada, nem se fundos foram roubados.

## Principais fatos

- **A instrução:** atualize para o Core Lightning v26.06.8 agora.
- **Quem está exposto:** nós na v26.06.7 ou mais antigos.
- **O que a versão corrige:** bugs que podiam derrubar um nó, requisições que podiam esgotar a memória dele pela interface REST e um problema no fechamento de canais que podia custar fundos por meio do mecanismo de penalidade da Lightning.
- **O que não se sabe:** qual bug está sendo atacado, e se há algum roubo confirmado.
- **Contexto:** em agosto, o projeto fez a triagem de uma onda de relatórios de vulnerabilidade gerados por IA ao longo de dez dias, confirmou vários e lançou a v26.06.7 em 28 de agosto.

## Por que um nó da Lightning é diferente de uma carteira?

Porque ele fica online, guardando chaves, o tempo todo.

Um pagamento na Lightning passa por canais, e um canal é bitcoin travado entre duas partes que atualizam fora da cadeia a divisão entre elas. Para rotear pagamentos, um nó precisa ficar conectado e precisa conseguir assinar na hora. Isso faz dele uma carteira quente por construção: as chaves que controlam os fundos ficam numa máquina que responde a requisições vindas da internet.

## O que é o mecanismo de penalidade?

A defesa da Lightning contra trapaça, e o motivo de software antigo ser perigoso.

Cada vez que o saldo de um canal muda, o estado anterior é revogado. Se uma parte depois transmitir um estado revogado — tentando reivindicar uma divisão mais antiga e mais favorável — o outro lado pode ficar com o canal inteiro como penalidade. É um forte fator de dissuasão.

Ele também não perdoa erros. Um nó que transmite o estado errado por causa de um bug é indistinguível de um que está trapaceando, e é punido do mesmo jeito. É por isso que uma falha no fechamento de canais é uma falha de perda de fundos.

## Por que o projeto não explicou o bug?

Porque explicá-lo armaria o atacante.

Publicar uma correção já diz a um leitor atento mais ou menos onde estava o problema. Publicar os detalhes e os testes diz a todo mundo exatamente como dispará-lo, enquanto uma parte dos nós ainda está sem a correção. O Core Lightning reteve parte disso de propósito. A troca é desconfortável — pede-se aos operadores que atualizem na base da confiança — e é a troca padrão.

O episódio de agosto é a parte nova. Uma enxurrada de relatórios gerados por máquina é em sua maior parte ruído, e vários eram reais. Encontrar falhas ficou barato. O tempo dos mantenedores, não.

## O que quem opera infraestrutura deve tirar disso?

- **Assine o canal de lançamentos** de tudo o que você roda e que guarda chaves. O aviso é inútil para quem nunca o vê.
- **Aplique a correção no mesmo dia,** não na próxima janela de manutenção. Ataques contra uma correção divulgada podem começar em poucos dias.
- **Mantenha o saldo quente pequeno.** Um nó só precisa do que ele roteia.
- **Feche as interfaces que você não usa.** Um desses bugs podia ser alcançado por um endpoint REST.

Nada disso é específico da Lightning. Um nó ou um indexador em qualquer rede é software exposto à internet, e o intervalo entre uma correção ser lançada e um operador instalá-la é onde acontece a maior parte do dano — o padrão por trás de [por que contratos auditados continuam sendo drenados](/blog/why-audited-contracts-get-drained). Se você só lê de uma rede, pode evitar o problema simplesmente não rodando um nó: [conectar-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc) usa um endpoint público, o que não lhe deixa nada para corrigir e nada para guardar.

As notas de versão e os avisos de segurança são publicados no [repositório do Core Lightning](https://github.com/ElementsProject/lightning/releases). Siga-os, não um resumo.
