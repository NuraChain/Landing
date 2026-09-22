Dois números de 2026 são citados um contra o outro como se um refutasse o outro.

O primeiro: protocolos que haviam concluído uma auditoria de segurança independente respondem por cerca de 88% de todos os fundos roubados desde janeiro de 2025 — 147 das 245 plataformas invadidas tinham passado por um auditor antes de o atacante chegar. O segundo: apenas cerca de 11% dos incidentes envolveram uma falha de contrato inteligente dentro do escopo auditado, embora essas tenham custado cerca de US$ 396 milhões.

Ambos são verdadeiros e, juntos, dizem algo preciso: as auditorias funcionam sobre aquilo que auditam. O dinheiro sai por todo o resto.

## Por onde o dinheiro realmente sai

Brechas de cadeia de suprimentos e de infraestrutura levaram mais de US$ 1,8 bilhão no mesmo período — a maior categoria isolada. Isso quer dizer pipeline de build comprometido, chave de implantação roubada, dependência maliciosa, front end servindo um código diferente do que está no repositório, funcionário levado por phishing a aprovar algo.

Nada disso é bug de contrato. Tudo isso drena um contrato.

Os totais, aliás, estão melhorando: os atacantes realizaram 207 invasões distintas no primeiro semestre de 2026, mas levaram US$ 972 milhões, menos da metade dos US$ 2,3 bilhões do primeiro semestre de 2025. Mais incidentes, menos dinheiro. As defesas funcionam na camada de protocolo e os atacantes se deslocaram.

## O que uma auditoria de fato promete

Uma auditoria é a revisão de um código determinado, num commit determinado, contra um modelo de ameaças determinado. É genuinamente útil e genuinamente estreita.

Ela não cobre a chave que implanta o contrato, a CI que o compila, o pacote npm que ele importa, o domínio que serve a interface, o signatário do multisig que aprova uma atualização, nem o oráculo em que ele confia para um preço. Cada um desses está fora do escopo, e vários são mais fáceis de atacar do que o código.

## Os controles chatos que realmente seguram

- **Trate a chave de implantação como o tesouro.** Hardware, multisig e um limiar que sobreviva à ausência de uma pessoa.
- **Fixe suas dependências.** Lockfiles, hashes de integridade e uma decisão deliberada a cada atualização.
- **Torne o front end verificável.** Um build que outra pessoa consiga reproduzir a partir do código com tag, e um jeito de perceber quando o bundle servido deixa de bater.
- **Ensaie o caminho de upgrade.** Quem pode pausar, quem pode atualizar, quanto tempo leva e o que acontece se dois deles estiverem inacessíveis.
- **Audite o diff, não a release.** O artefato auditado é um commit. Tudo depois dele está, por definição, sem revisão.

## Ler um contrato você mesmo

Nada disso exige confiar num resumo. Numa rede EVM, o bytecode implantado, o código verificado e cada transação contra ele são públicos, que é exatamente para o que serve um explorador — [como ler o explorador da Nura Chain](/blog/how-to-use-nura-chain-explorer) mostra onde olhar, e [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) cobre a verificação pelo outro lado.

O hábito que vale formar: antes de aprovar qualquer coisa, confirme que o endereço que você está aprovando é o endereço que o projeto publica e que ele está verificado. Leva um minuto e pega o ataque que auditoria nenhuma pegaria.

Os números são dados de incidentes de terceiros cobrindo janeiro de 2025 até meados de 2026; as metodologias variam entre relatórios.
