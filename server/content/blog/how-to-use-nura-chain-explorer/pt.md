Um explorador de blocos é como você confere que algo que fez realmente aconteceu. Não o que uma carteira afirma, nem o que um script imprimiu — o que a cadeia registrou. Este texto cobre a leitura do [Nura Explorer](https://explorer.nurachain.net) e o hábito que mais importa: não confiar nele cegamente também.

## O que um explorador realmente é

É um leitor, não uma autoridade. Um explorador roda um nó, observa cada bloco e guarda o que vê num banco de dados pesquisável — blocos, transações e transferências, indexados para uma pessoa procurar por hash ou endereço.

Essa distinção importa. O explorador não decide nada. Se ele discordar da cadeia, a cadeia está certa e o explorador está atrasado ou quebrado. Tudo o que ele mostra está disponível diretamente pelo endpoint RPC, que é o assunto da última seção.

## Encontrando uma transação

Toda transação tem um hash — uma string de 66 caracteres começando com `0x`. Sua carteira mostra depois do envio; um script de implantação imprime. Cole na busca do explorador.

Se nada voltar, há três explicações comuns antes de supor que algo se perdeu:

- A transação ainda está pendente e não foi incluída num bloco.
- O explorador ainda não indexou o bloco que a contém.
- Ela foi transmitida para outra rede. Essa é de longe a mais comum, e é por isso que checar o ID da cadeia importa.

## Lendo uma transação

Os campos que vale entender:

- **Status.** Sucesso ou falha. Uma transação falha ainda aconteceu, ainda ocupa espaço num bloco e ainda custou gás. "Falha" não significa "não aconteceu" — significa que o código reverteu depois de a taxa ter sido gasta.
- **Bloco.** Qual bloco a incluiu e quantos blocos foram construídos por cima desde então. Mais blocos por cima significa mais assentada.
- **De / Para.** O remetente, e ou um destinatário ou um contrato. Numa implantação, `Para` fica vazio e o contrato criado aparece separadamente.
- **Valor.** Quanto NURA se moveu como ativo nativo. Uma transferência de token costuma mostrar `0` aqui, porque os tokens se moveram dentro do contrato e não como valor nativo. Isso surpreende as pessoas o tempo todo.
- **Gás usado e taxa.** O que de fato custou, geralmente menos que o limite definido.
- **Nonce.** O contador de transações do remetente. Lacunas nele são o motivo de uma transação travada bloquear tudo o que vem atrás da mesma conta.

## Lendo um endereço

Existem dois tipos, e o explorador os distingue.

Uma conta de propriedade externa é controlada por uma chave privada. Tem saldo e histórico de transações, e nada mais.

Um endereço de contrato tem código. Se você implantou algo e o explorador não mostra código, a implantação não deu certo, não importa o que seu script relatou — veja [implantar um contrato inteligente](/blog/deploy-a-smart-contract-on-nura-chain).

Num contrato de token, a parte interessante é o histórico de transferências, porque ele é o registro do evento `Transfer` e não uma tabela de saldos. São os mesmos dados que qualquer carteira usa para mostrar seu saldo de um token.

## Lendo um bloco

A página de um bloco mostra a altura, o carimbo de tempo, as transações incluídas, o gás usado contra o limite e a taxa base naquele momento.

Na Nura Chain os blocos chegam a cada três segundos aproximadamente. Gás usado bem abaixo do limite significa que há espaço — uma transação que não está sendo incluída está ficando de fora por preço e não por congestionamento, o que aponta para a taxa e não para o tráfego.

## Conferindo contra o RPC

Esta é a seção que vale guardar. Qualquer número que o explorador mostre pode ser perguntado diretamente à cadeia:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xYourTxHash"]}'
```

O recibo carrega `status` — `0x1` para sucesso, `0x0` para reversão — mais o número do bloco, o gás usado e os registros de eventos. Essa é a resposta autoritativa.

O mesmo para um contrato:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xTheContract","latest"]}'
```

Se o explorador e o endpoint algum dia discordarem, acredite no endpoint. Mais útil ainda: quando estiver prestes a agir sobre algo valioso, confira os dois. Dois leitores independentes concordando é um sinal muito mais forte que uma interface confiante sozinha. A mecânica está em [conectando-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc).

## O que um explorador não pode lhe dizer

- **Se um contrato é seguro.** Ele mostra código e histórico, não intenção. Um contrato verificado é um contrato legível, não auditado.
- **Se um token é legítimo.** Qualquer um pode implantar um contrato com qualquer nome. A identidade é o endereço.
- **Quem é dono de um endereço.** Endereços são pseudônimos. Rótulos, onde aparecem, são adicionados por quem opera o explorador e são uma alegação, não um fato.
- **Por que algo falhou.** Ele mostra que uma transação reverteu; o motivo mora na lógica do próprio contrato.

## Perguntas frequentes

### Minha transação não aparece. Ela se perdeu?

Provavelmente não. Confira o hash contra o RPC com `eth_getTransactionReceipt`. Um resultado nulo significa que ainda não foi minerada — pendente, não perdida. Se nunca confirmar, a taxa é a causa usual.

### O explorador mostra uma transferência de token mas meu valor é zero. Por quê?

Porque movimentos de token são mudanças de estado do contrato, não transferências nativas. O campo `Valor` acompanha apenas o NURA. Olhe a seção de transferências de token da mesma transação.

### Posso confiar num contrato porque ele está verificado?

Verificação significa que o código publicado compila para o bytecode implantado. Ela diz o que o código é; não diz nada sobre o código ser bom nem sobre o autor ser honesto.

### Por que o explorador mostra saldo diferente da minha carteira?

Normalmente um dos dois está em outra rede, ou um está desatualizado. Pergunte ao RPC com `eth_getBalance` e resolva.

## Para onde ir agora

Se você ainda não apontou uma carteira para a rede, [adicionar a Nura Chain à sua carteira](/blog/add-nura-chain-to-your-wallet) é o ponto de partida, e o explorador é como você verifica que funcionou.

Se está implantando, [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) e [criar um ERC-20](/blog/create-an-erc-20-token-on-nura-chain) terminam ambos nesta página — a implantação não está pronta até o explorador e o RPC concordarem que está.
