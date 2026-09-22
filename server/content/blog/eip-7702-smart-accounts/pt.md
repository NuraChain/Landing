Durante uma década uma conta Ethereum era uma de duas coisas. Ou uma conta de propriedade externa, controlada por uma chave privada e incapaz de executar lógica própria, ou um contrato, cheio de lógica e sem chave nenhuma a controlá-lo. A EIP-7702, que veio com a atualização Pectra em maio de 2025, acabou com a escolha: uma conta comum agora pode delegar a código de contrato enquanto a chave continua no controle.

A adoção foi mais rápida do que a de quase qualquer padrão. MetaMask, Rabby e Trust integraram o recurso ao longo de 2025 e 2026, e estimativas do setor já colocam as carteiras inteligentes do ecossistema na casa das centenas de milhões.

## O que a delegação é de fato

Uma transação 7702 carrega uma lista de autorização. Você assina uma tupla que diz: "chamadas ao meu endereço devem executar o código que está neste endereço de contrato". Dali em diante sua conta se comporta como aquele contrato, enquanto a chave privada continua sendo a dona — e continua podendo revogar a delegação depois, assinando outra.

O endereço não muda. É esse o ponto inteiro, e é exatamente o que a abordagem anterior não conseguia oferecer.

## O que você ganha

- **Uma assinatura em vez de três.** Aprovar e trocar viram uma única chamada agrupada, então a aprovação que antes ficava pendurada simplesmente deixa de existir.
- **Outra pessoa pode pagar o gás.** Um paymaster patrocina a taxa, ou a cobra num token que você já tem em vez da moeda nativa.
- **Chaves limitadas.** Uma chave de sessão que só faz uma coisa, por um dia, até um valor.
- **Recuperação.** Recuperação social ou por guardiões, montada sobre o endereço que você já usa.

## Onde entra o ERC-4337

O ERC-4337 construiu abstração de contas fora do protocolo: uma mempool separada de operações de usuário, bundlers e um contrato de ponto de entrada. Funciona, e é a resposta certa para uma conta que ainda não existe. Mas nada podia fazer pelo endereço que você usa há cinco anos, porque aquele endereço era uma EOA e não podia virar outra coisa.

Agora os dois dividem o trabalho: ERC-4337 para contas novas, 7702 para as que já estão em uso.

## A parte que merece cuidado

Uma delegação é uma procuração em branco para qualquer código que more naquele endereço. Se o contrato for malicioso, ou puder ser atualizado para algo malicioso, a conta não fica parcialmente em risco: ela se foi.

- Leia o que você assina. Uma autorização pode ser exibida de modo a parecer a assinatura de uma mensagem comum.
- Delegue para implementações que a sua própria carteira distribui e audita, não para um endereço que um site lhe entrega.
- Saiba como revogar. Assinar uma delegação para o endereço zero a apaga.

## Funciona na rede em que você está?

Não automaticamente. Cada rede EVM decide quais EIPs adota e quando, então se a 7702 está ativa numa rede específica é pergunta a se fazer à rede, não a supor. Contas comuns funcionam em toda parte, que é o que [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet) mostra, e contratos comuns são implantados do jeito de sempre — veja [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
