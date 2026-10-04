O software começou a pagar por coisas na terceira semana de setembro de 2026, sobre dois trilhos diferentes. Em 21 de setembro, a Mastercard e o Danske Bank concluíram o que chamaram de o primeiro pagamento da Dinamarca feito por um agente de IA, e a Mastercard anunciou o primeiro do Canadá no mesmo dia. Em 25 de setembro, a Block adicionou a Lightning Network do Bitcoin ao x402, o protocolo que permite a um agente pagar por uma única requisição web. Os pagamentos por agentes de IA agora têm uma resposta em cartão e uma resposta em cripto.

## Principais fatos

- **Cartões:** em 21 de setembro de 2026, um agente reservou e pagou uma degustação de café com um Mastercard do Danske Bank, usando o Mastercard Agent Pay.
- **Canadá:** um assistente agindo em nome de um titular de cartão do Rogers Bank comprou um produto dentro de "limites de gasto predefinidos".
- **Cripto:** a Block adicionou suporte à Lightning ao x402 em 25 de setembro de 2026.
- **Escala do x402:** cerca de 75,4 milhões de transações, no valor de US$ 24,2 milhões, nos 30 dias anteriores, pelos números do próprio protocolo.
- **Em que ele liquida:** o USDC foi 99,3% do volume do x402 no segundo trimestre de 2026, segundo a Circle.

## Como um agente paga com cartão?

Pegando emprestado o de uma pessoa.

O agente age em nome de um titular de cartão que já foi verificado. O pagamento é autorizado no cartão dessa pessoa, dentro das instruções e dos limites que ela definiu, e o lojista recebe algo que parece um pagamento com cartão comum. Tudo o que está por trás é o sistema existente: um banco emissor, estornos, regras antifraude, uma fatura no fim do mês.

Esse é o ponto forte. Uma loja não precisa mudar nada para aceitá-lo, e uma compra errada pode ser contestada.

## Como um agente paga com o x402?

Guardando uma chave.

Um servidor responde a uma requisição com o status HTTP `402 Payment Required` e um preço. O agente paga e tenta de novo. Não há conta, nem cartão, nem pessoa no meio — a mecânica está em [como agentes de IA pagam por requisição com o x402](/blog/ai-agents-onchain-payments-x402).

Divida os números do próprio protocolo e a diferença em relação aos cartões fica óbvia: US$ 24,2 milhões em 75,4 milhões de transações dão cerca de 32 centavos cada. As redes de cartão não foram construídas para pagamentos desse tamanho.

## Então, qual dos dois vence?

Provavelmente os dois, para compras diferentes.

- **Os cartões servem** para o que as pessoas já compram: uma reserva, um produto, qualquer coisa com um lojista, uma política de reembolso e um preço que valha a pena contestar.
- **O x402 serve** para o que só software compra: uma chamada de API, uma página de dados, uma inferência, milhares de vezes por hora.

A chegada da Lightning importa porque amplia a segunda categoria para além das stablecoins. Até agora, quase todo o volume do x402 era USDC; agora um agente pode pagar em bitcoin pelo mesmo protocolo.

## O que continua igual nos dois trilhos?

Um agente que pode pagar é um signatário sem supervisão. A versão em cartão põe o limite na rede; a versão em cripto o põe na conta. De um jeito ou de outro, o controle que importa é o teto, porque um agente pode ser convencido de coisas e um limite de gasto não.

Numa rede EVM, esse teto é uma conta inteligente com uma chave de sessão que expira — o padrão descrito em [EIP-7702 e contas inteligentes](/blog/eip-7702-smart-accounts). A Nura Chain produz um bloco a cada três segundos aproximadamente, com taxas definidas por uma taxa base EIP-1559, que é o formato de que os pagamentos por requisição precisam. Ela não oferece um produto de pagamento para agentes, e nada aqui deve ser lido como tal.

Os volumes são pequenos e autodeclarados. O [x402.org](https://x402.org) publica os números do protocolo.
