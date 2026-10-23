Em 21 de outubro de 2026 a plataforma de hospedagem em nuvem Railway divulgou que uma parte não autorizada pode ter acessado as variáveis de ambiente criptografadas que seus clientes armazenam e lido o conteúdo descriptografado de algumas delas. A investigadora de blockchain Taylor Monahan associou a violação da Railway a cerca de US$ 371 mil em criptomoedas drenadas em pelo menos 19 redes EVM, segundo estimativa dela relatada pelo crypto.news em 22 de outubro. A Railway não confirmou nenhum roubo de criptomoedas. O padrão é conhecido: uma chave privada guardada onde um servidor podia lê-la foi lida por outra pessoa.

## Principais fatos

- **A divulgação:** Railway, 21 de outubro de 2026 — atividade anômala nos sistemas que armazenam as variáveis de ambiente dos clientes, que podem conter chaves de API e credenciais de bancos de dados e de registros.
- **O roubo alegado:** cerca de US$ 371 mil em mais de 500 transações a partir de mais de 200 endereços em pelo menos 19 redes EVM, segundo Taylor Monahan em 22 de outubro. Um desenvolvedor que publica como ethereumdegen.eth estimou cerca de US$ 370 mil.
- **Cronologia:** pela linha do tempo de Monahan, o primeiro roubo ocorreu às 19:36 UTC de 21 de outubro; o aviso da Railway saiu por volta das 21:51 UTC.
- **A resposta da Railway:** implantações pausadas, todos os clientes orientados a trocar todas as variáveis armazenadas, todos os tokens de API da Railway invalidados às 04:17 UTC de 22 de outubro segundo o CryptoSlate, e credenciais dos buckets de armazenamento e tokens do GitHub redefinidos no mesmo dia.
- **Não estabelecido:** a causa raiz, o número de clientes afetados e se as chaves das carteiras drenadas vieram da Railway.

## O que a Railway divulgou de fato?

Que segredos que guardava para os clientes podem ter sido lidos.

O aviso da Railway diz que a empresa detectou a atividade na manhã de 21 de outubro e acredita que um terceiro não autorizado pode ter acessado variáveis de ambiente criptografadas e obtido o conteúdo descriptografado de algumas. Sua análise inicial aponta para um subconjunto de usuários, mas ela pediu a todos que trocassem todas as variáveis e credenciais de registros privados e verificassem os logs de seus serviços. A Railway acredita que o incidente faz parte de uma série de ataques a empresas de plataforma voltados a provedores de inferência de IA, e pediu aos provedores de origem que revogassem chaves. O aviso não menciona criptomoedas, carteiras nem chaves privadas.

## Como isso se liga ao roubo de criptomoedas?

Pelas carteiras que foram esvaziadas, não por algo que a Railway disse.

Monahan associou os saques ao incidente e descreveu as transações como feitas por um script varredor de carteiras bastante comum, segundo o crypto.news. O primeiro roubo que ela registrou é mais de duas horas anterior ao anúncio público da Railway. Os relatos não batem por completo: Noah Dunnagan, engenheiro de sucesso do cliente da Railway, escreveu no X que a empresa tinha motivos para acreditar que o ataque explorou apenas tokens de inferência de IA, conforme relatou o The Defiant. A Railway não confirmou as perdas, e o número de US$ 371 mil é uma estimativa externa.

## Por que uma variável de ambiente é um lugar ruim para uma chave privada?

Porque a plataforma precisa conseguir lê-la.

Uma variável de ambiente é a forma como uma plataforma de hospedagem entrega um segredo ao seu processo quando ele inicia. Para isso, a plataforma armazena o valor, criptografado em repouso, junto com o meio de descriptografá-lo. Isso é aceitável para uma chave de API que pode ser revogada em um minuto. Uma chave privada não pode ser revogada. Quem a lê uma vez controla o endereço para sempre, e o único remédio é mover os fundos antes — e um script varredor é feito para se mover primeiro.

É o mesmo argumento de [por que contratos auditados ainda são drenados](/blog/why-audited-contracts-get-drained): o código resiste, e o dinheiro sai pelo que está ao redor dele.

## Como os desenvolvedores devem manter as chaves fora da hospedagem?

- **Não coloque uma chave com saldo nas variáveis de uma plataforma.** Se um serviço precisa assinar, dê a ele uma chave que guarde só o que ele precisa hoje.
- **Assine em outro lugar.** Um serviço de gerenciamento de chaves ou um assinante separado guarda a chave e assina sob demanda, de modo que a aplicação nunca a vê.
- **Nunca armazene uma frase semente em um servidor.** Uma única frase deriva todos os endereços da carteira.
- **Separe chaves de implantação de chaves de tesouraria.** A chave que implanta um contrato não deve ser a que guarda seus fundos.
- **Troque ao saber de uma violação, e mova os fundos primeiro.** Para uma chave privada, trocar significa uma chave nova e uma transferência, não uma string nova.
- **Monitore os endereços.** Um alerta para qualquer transferência de saída é o que avisa você em minutos, e não em dias.

## O que isso significa para quem constrói na Nura Chain?

As mesmas regras valem. Nosso guia para [implantar um contrato inteligente na Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) lê a chave de implantação de uma variável de ambiente na sua própria máquina, e recomenda usar uma chave descartável na primeira implantação, não a que guarda o seu saldo. É uma chave local e de vida curta. Uma chave com saldo e de vida longa numa plataforma de hospedagem é um risco diferente, e os conselhos acima são para ela.

Os detalhes vão mudar conforme a investigação da Railway avançar. A fonte primária é [a divulgação de segurança da Railway de 21 de outubro de 2026](https://blog.railway.com/p/security-disclosure-wednesday-october-21st).
