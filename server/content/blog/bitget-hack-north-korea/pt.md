Em 24 de setembro de 2026, a exchange Bitget perdeu US$ 387,5 milhões em 19 transferências não autorizadas a partir das suas carteiras quentes e mornas. Nenhum contrato inteligente foi explorado. O atacante entrou num sistema de backend em que as carteiras confiavam e o usou para falsificar dados de transferência. A Chainalysis atribuiu o hack da Bitget a agentes ligados à Coreia do Norte, o que leva o total roubado por esses grupos em 2026 a mais de US$ 1 bilhão.

## Principais fatos

- **Data e valor:** 24 de setembro de 2026; US$ 387,5 milhões chegaram a endereços controlados pelo atacante.
- **Como:** 19 transferências a partir dos sistemas de carteiras quentes e mornas, depois que um sistema de backend das carteiras foi comprometido.
- **Quem:** atribuído pela Chainalysis a agentes ligados à Coreia do Norte.
- **Para onde foi:** em três horas, ao longo de 23 transferências, para Ethereum (49,7%), XRP (40,8%), Zcash (7,6%) e Tron (1,8%).
- **Clientes:** a Bitget diz que seu fundo de proteção, que tem mais de US$ 464 milhões, cobre a perda.
- **O mês:** setembro foi o pior de 2026 em roubos — US$ 766,5 milhões pela contagem da PeckShield, US$ 768,4 milhões pela da CertiK.

## O que é uma carteira quente, e por que as exchanges têm uma?

Uma carteira cujas chaves ficam online, para que ela possa pagar sem depender de uma pessoa.

Uma exchange processa saques o dia inteiro. Ela não pode buscar um dispositivo de hardware num cofre a cada saque, então mantém um saldo operacional em sistemas que assinam automaticamente. O armazenamento a frio guarda o resto offline. Uma carteira morna fica entre os dois, com algum atraso ou alguma aprovação no caminho.

Essa divisão é o modelo de segurança. Uma invasão do lado quente deveria custar o saldo operacional de um dia. Quando custa centenas de milhões, ou se mantinha demais no lado quente, ou as camadas acima dele podiam receber instruções do mesmo sistema comprometido.

## O que de fato falhou?

Aquilo em que as carteiras acreditavam.

Os sistemas de assinatura não decidem o que pagar. Algo que vem antes deles lhes diz: este cliente, este valor, este endereço. Se um atacante controla esse sistema anterior, a carteira assina um roubo como se fosse um saque, com chaves válidas e procedimento correto. Nada foi hackeado no sentido de criptografia quebrada.

Esse é o padrão por trás da maioria das grandes perdas de hoje, e é o argumento de [por que contratos auditados continuam sendo drenados](/blog/why-audited-contracts-get-drained): o componente auditado funciona, e o dinheiro sai pelo software ao redor dele.

## Como foi rastreado tão rápido?

Toda transferência é pública, e o rastreamento agora é em parte automatizado.

Os fundos foram divididos entre quatro redes em três horas, o que antes teria rendido dias aos ladrões. A Chainalysis diz que a automação reduziu mais de 20 horas de rastreamento manual a menos de dez minutos — e é cuidadosa com a afirmação: "Nossos investigadores ainda definiram a lógica, revisaram os resultados e dirigiram a investigação."

Rastrear não é recuperar. Saber onde os fundos estão não os devolve; torna mais difícil convertê-los em dinheiro.

## O que isso significa se você deixa dinheiro numa exchange?

Um saldo numa exchange é um lançamento no banco de dados da exchange. As moedas estão em carteiras que a exchange controla, misturadas com as de todos os outros. Quando funciona, você nunca nota a diferença.

- **Deixe numa exchange o que você está negociando.** O resto não precisa estar lá.
- **Pergunte o que cobre uma perda.** Um fundo de proteção é uma promessa da mesma empresa.
- **Teste um saque** antes de precisar de um com pressa.

A alternativa é guardar a chave você mesmo, o que elimina o risco da exchange e lhe entrega o seu próprio. A Nura Wallet é de autocustódia — as chaves ficam no seu dispositivo — e qualquer carteira EVM pode ser apontada para a rede seguindo [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet). Também não existe fundo de proteção para uma frase semente perdida.

Os detalhes vão mudar à medida que a investigação continua. O relato do rastreamento é [da Chainalysis](https://www.chainalysis.com/blog/387m-bitget-theft-2026/); os totais de perdas diferem entre as empresas de segurança porque elas contam de forma diferente.
