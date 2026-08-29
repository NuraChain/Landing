Carteiras não conhecem todas as redes de antemão. Antes de você poder manter um saldo, enviar qualquer coisa ou abrir uma aplicação na Nura Chain, é preciso avisar sua carteira de que a rede existe. Leva cerca de um minuto.

## O que a carteira vai pedir

Seis valores, e cada carteira pede algum subconjunto deles:

- Nome da rede: Nura Chain
- URL do RPC: `https://rpc.nurachain.net`
- ID da cadeia: `1020`
- Símbolo da moeda: `NURA`
- URL do explorador de blocos: `https://explorer.nurachain.net`
- Casas decimais: 18, que a maioria das carteiras preenche sozinha

Deixe esta página aberta enquanto faz isso ou, melhor, verifique o ID da cadeia de forma independente — a próxima seção explica por que vale trinta segundos.

## O caminho de um clique

A maioria das carteiras de navegador aceita uma requisição padrão, a EIP-3085, que permite a uma página entregar a definição inteira da rede de uma vez. O site da Nura Chain usa isso: o botão "Adicionar a Nura Chain à carteira" na página inicial e no rodapé envia exatamente os valores acima, e sua carteira os exibe para você aprovar.

Este é o caminho preferível, por um motivo que nada tem a ver com comodidade. Digitar um ID de cadeia à mão é a etapa em que os erros acontecem, e uma URL de RPC digitada errado é um grau pior — ela aponta sua carteira para um servidor escolhido por quem for dono daquele domínio com o erro de digitação.

Quando o aviso aparecer, leia em vez de passar batido. Uma carteira que mostra a definição de uma rede está mostrando exatamente aquilo em que está prestes a confiar.

## Adicionando manualmente

Se sua carteira não aceita a requisição automática, ou você prefere não deixar uma página fazê-la, toda carteira tem um caminho manual. Na MetaMask é mais ou menos assim:

1. Abra o seletor de rede no topo da extensão.
2. Escolha "Adicionar uma rede personalizada" (em versões antigas: Configurações, depois Redes, depois Adicionar rede, depois Adicionar manualmente).
3. Preencha os seis valores acima.
4. Salve e mude para a rede nova.

Outras carteiras usam palavras diferentes, mas pedem os mesmos campos, porque os campos vêm do padrão e não da carteira.

## Confirme que você está mesmo na Nura Chain

Não pule esta etapa. Uma carteira guarda tranquilamente uma rede cujo nome diz uma coisa e cujo RPC aponta para outro lugar, porque o nome é um rótulo que você digitou e o RPC é com quem ela realmente conversa.

O endpoint declara a própria identidade:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

A resposta é `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. `0x3fc` é 1020 em decimal, e precisa bater com o ID de cadeia que sua carteira mostra. Se divergirem, pare e corrija a entrada da rede antes de enviar qualquer coisa.

Se preferir não usar um terminal, abra o [Nura Explorer](https://explorer.nurachain.net) e compare um número de bloco recente com o que sua carteira informa. O explorador e a carteira lendo a mesma cadeia é a mesma verificação por outro caminho.

## Nura Wallet

Existe também uma carteira feita especificamente para esta rede. A Nura Wallet é de autocustódia — as chaves ficam no seu dispositivo — e tem versões para Android, Windows e Linux, linkadas na página inicial. Ela já vem com a rede configurada, o que elimina todo este procedimento.

Não é obrigatória. A Nura Chain é uma rede EVM comum e qualquer carteira que aceite uma rede personalizada serve, o que é justamente o sentido de [ser compatível com EVM](/blog/nura-chain-evm-compatibility). Use aquela em que você já confia.

## Quando algo dá errado

- **A carteira rejeita o ID da cadeia.** Quase sempre uma confusão entre a forma decimal e a hexadecimal. `1020` e `0x3fc` são o mesmo número; digitar `0x1020` não é.
- **Os saldos aparecem zerados.** Verifique qual rede está selecionada. O mesmo endereço existe em toda cadeia EVM, então uma carteira apontada para a rede errada mostra um endereço real com um saldo que não tem relação nenhuma.
- **Uma transação nunca confirma.** Normalmente um preço de gás herdado de outra rede. Deixe a carteira estimar em vez de sobrescrever.
- **O símbolo aparece como outra coisa.** É cosmético e se resolve editando a entrada da rede. Não afeta o que a rede faz.

## Perguntas frequentes

### Adicionar uma rede é arriscado por si só?

Adicionar uma rede não move fundos nem concede permissão a nenhuma aplicação. O que importa é para qual URL de RPC você aponta, porque esse é o servidor a quem sua carteira pergunta sobre saldos e por onde envia transações. Use um em que tenha motivos para confiar e verifique o ID da cadeia dele.

### Preciso de NURA antes de adicionar a rede?

Não. Adicionar não custa nada. Você vai precisar de saldo em NURA antes de enviar uma transação, porque o gás é pago na moeda nativa.

### Posso usar o mesmo endereço que já tenho?

Sim. Seu endereço deriva da sua chave, então é o mesmo em toda rede EVM. Os saldos e o histórico, porém, são separados por cadeia — veja [o que é a Nura Chain](/blog/what-is-nura-chain) para entender por que essa distinção importa.

### Como removo a rede depois?

Pela mesma tela de configurações em que você a adicionou. Remover uma rede não afeta saldo algum; apenas faz aquela carteira deixar de exibir a cadeia.

## Próximos passos

Com a rede adicionada, o [Nura Explorer](https://explorer.nurachain.net) é o jeito mais rápido de confirmar que o que você fez realmente aconteceu — [como lê-lo](/blog/how-to-use-nura-chain-explorer) explica o que significam as colunas.

Se você está aqui para construir e não para guardar, pule para [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc). E para saber o que é o NURA e como o fornecimento é dividido, veja [fornecimento e alocação da Nura Coin](/blog/nura-coin-tokenomics).
