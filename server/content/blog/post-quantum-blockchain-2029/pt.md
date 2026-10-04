Em 7 de setembro de 2026, a Ethereum Foundation fixou um prazo: até dezembro de 2029, as transações, os validadores e o armazenamento de dados da Ethereum devem todos resistir ao ataque de um computador quântico. Dez dias depois, circulava um roteiro pós-quântico para o Bitcoin com o mesmo ano como meta. A criptografia pós-quântica deixou de ser tema de pesquisa para as blockchains e virou cronograma.

## Principais fatos

- **Ethereum:** a meta da fundação é dezembro de 2029, com uma reavaliação por especialistas externos prevista para janeiro de 2027.
- **Bitcoin:** um roteiro de desenvolvedores aponta a mesma data, construído em torno da BIP 360, que acrescenta formas de gastar resistentes a computadores quânticos.
- **A exposição:** cerca de 6,9 milhões de BTC, aproximadamente um terço da oferta, estão em endereços cuja chave pública já é visível, segundo uma estimativa de pesquisa.
- **Não é só cripto:** Google, Cloudflare e Microsoft têm metas de migração na mesma janela.

## O que um computador quântico de fato quebraria?

Assinaturas, não blockchains.

Toda conta no Bitcoin, na Ethereum e em qualquer rede EVM é controlada por um par de chaves de curva elíptica. Derivar a chave privada a partir da pública é inviável para computadores comuns e, em princípio, viável para um computador quântico grande o bastante. O hashing é muito menos afetado, e é por isso que blocos, endereços e prova de trabalho não são a parte urgente.

Isso também explica o número da exposição. Um endereço que nunca gastou revela apenas um hash da sua chave pública. Um que já gastou, ou que usa um formato que publica a chave diretamente, mostrou a própria chave — e é dela que um atacante precisaria.

## Por que 2029, se essa máquina não existe?

Porque a migração leva mais tempo do que o aviso prévio que teremos.

Ninguém sabe dizer quando existirá um computador quântico capaz disso. A própria fundação coloca a questão assim: as previsões críveis começam por volta de 2030, e alguns pesquisadores duvidam que ele chegue algum dia. Mas trocar o esquema de assinatura de uma rede em operação significa novas carteiras, novo hardware, nova infraestrutura nas exchanges e, depois, esperar que milhões de usuários movam seus fundos. São anos de trabalho, e ele precisa terminar antes de a ameaça ser real, e não começar nessa hora.

## Por que é difícil?

As assinaturas pós-quânticas são maiores e mais lentas de verificar do que as usadas hoje, e uma blockchain guarda cada assinatura para sempre. A Ethereum está trabalhando com esquemas baseados em hash; a fundação descreve o Hegotá, um fork planejado para 2027, como "não o fork PQ", e sim "o fork que decide se os forks PQ acontecem no prazo."

O Bitcoin tem um segundo problema, que é político. As moedas em endereços expostos cujos donos nunca migrarem continuam podendo ser roubadas. Congelá-las ou deixá-las como estão é uma questão de propriedade, não de criptografia, e não há resposta de consenso.

## O que você deve fazer hoje?

Nada drástico, e duas coisas que vale transformar em hábito.

- **Não reutilize endereços** onde o sistema permitir evitar. Um endereço que nunca gastou não mostrou a sua chave.
- **Mantenha o software da sua carteira atualizado.** A migração vai chegar como atualizações de carteira, e quem estará em risco será quem nunca as instalou.

Nas redes EVM, o caminho provavelmente passará por contas programáveis, em que a regra que autoriza uma transação é código, e não uma curva fixa — a direção para a qual [EIP-7702 e contas inteligentes](/blog/eip-7702-smart-accounts) já aponta. A Nura Chain usa o mesmo modelo de contas de toda rede EVM, então enfrenta a mesma pergunta e vai herdar o mesmo ferramental. Ela não anunciou nenhum cronograma próprio, e esta página não inventa um.

Os prazos aqui são metas, não garantias. O [blog da Ethereum Foundation](https://blog.ethereum.org) e o [projeto pós-quântico do NIST](https://csrc.nist.gov/projects/post-quantum-cryptography) são as fontes a acompanhar.
