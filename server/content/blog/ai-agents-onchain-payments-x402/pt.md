O HTTP carrega desde o início dos anos noventa um código de status chamado `402 Payment Required`. Ele foi reservado para um futuro que nunca chegou e, por trinta anos, a coisa certa a fazer com ele era nada. Em 2026 de repente ele sustenta carga: o x402 usa essa resposta para que um cliente pague por uma única requisição, em stablecoins, sem conta e sem chave de API.

## O mecanismo, em três passos

1. Um cliente pede um recurso. O servidor responde `402` com um corpo JSON estruturado indicando o preço e para onde pagar.
2. O cliente paga on-chain e repete a requisição levando a prova do pagamento.
3. O servidor verifica e entrega a resposta.

É todo o protocolo. Não há cadastro, ciclo de faturamento, cartão salvo nem valor mínimo. Quem precisa de uma inferência ou de uma página de dados paga por uma inferência ou uma página de dados.

## Por que isso apareceu agora

Porque quem chama deixou de ser uma pessoa. Um agente autônomo não preenche formulário de cadastro, não porta cartão corporativo e não espera uma fatura fechar no fim do mês. Ele consegue guardar uma chave e assinar uma transferência, e preço por requisição é o único modelo de cobrança que serve a algo que toma milhares de pequenas decisões por hora.

Os volumes já não são hipotéticos. Um beta de catorze semanas entre outubro de 2025 e janeiro de 2026 viu mais de mil participantes criarem mais de 9.500 agentes, que executaram entre si cerca de 187.000 transações autônomas.

## O que isso exige de uma rede

Três propriedades, e nenhuma delas glamourosa.

- **Transações baratas.** Um pagamento de uma fração de centavo não pode custar mais do que aquilo que compra.
- **Finalidade rápida.** A requisição está esperando. Uma janela de liquidação medida em minutos é um timeout.
- **Uma unidade estável.** Ninguém precifica uma chamada de API num ativo que se move dez por cento antes da retentativa.

Qualquer rede EVM que atenda a isso consegue carregar esse tráfego; não há nada exótico na transação em si. [Conectar-se ao RPC da Nura Chain](/blog/connect-to-nura-chain-rpc) usa o mesmo JSON-RPC que um agente usaria, e aqui os blocos caem a cada três segundos aproximadamente.

## O que acertar antes de colocar um no ar

Um agente com chave é um signatário sem supervisão. Trate-o assim.

- **Financie pouco.** Um saldo quente do tamanho de um dia de trabalho, recarregado de propósito, não uma tesouraria.
- **Limite-o.** Chaves de sessão com teto de gasto e expiração, que é exatamente o que as contas inteligentes tornaram prático — veja [EIP-7702 e contas inteligentes](/blog/eip-7702-smart-accounts).
- **Registre todo pagamento.** Um agente que gasta em silêncio é um agente que você não audita depois.
- **Separe a chave do prompt.** Tudo o que um agente lê pode tentar instruí-lo. O limite de gasto é o único controle que não discute.

O interessante nos pagamentos agênticos não é que máquinas possam pagar. É que o preço por requisição finalmente tem uma camada de liquidação embaixo.
