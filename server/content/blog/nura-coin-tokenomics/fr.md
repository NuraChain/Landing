Nura Coin, symbole `NURA`, est l'actif natif de Nura Chain. Cette page expose à quoi il sert, quels sont les chiffres d'offre publiés et — la partie que la plupart des pages de tokenomics laissent de côté — lesquels de ces chiffres vous pouvez vérifier vous-même et lesquels vous acceptez sur parole.

## À quoi sert NURA

Il paie le gaz. Chaque transaction sur le réseau consomme du gaz, le gaz est tarifé en NURA, et un compte au solde nul ne peut rien envoyer du tout, y compris son premier déploiement de contrat. C'est le rôle que joue l'ether sur Ethereum.

Il compte 18 décimales, ce qui relève de la convention EVM et non d'un choix propre à ce réseau. La plus petite unité est donc un milliardième de milliardième de NURA, et tout portefeuille ou bibliothèque effectue cette conversion pour vous.

Comme il s'agit de l'actif natif et non d'un contrat, il n'a pas d'adresse de jeton. Si une page vous réclame « l'adresse du contrat NURA » pour ajouter la monnaie native, méfiance : ce qui fait apparaître NURA, c'est l'ajout du réseau, et [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet) décrit toute la procédure.

## Offre totale

L'offre totale publiée est de 1 000 000 000 NURA — un milliard.

## Comment l'offre est répartie

Le projet publie une répartition en six parts. Voici ses allocations annoncées et leurs finalités annoncées :

- **Bloqué — 40 %.** Bloqué pendant un an. Le sort de cette part sera décidé à l'issue de cette période, et il est annoncé que toute décision la concernant requiert l'approbation d'un vote d'au moins 65 % du réseau.
- **Liquidité — 25 %.** Alloué sur un an à la fourniture et à la gestion de la liquidité, avec pour objectif une liquidité d'échange exploitable.
- **Communauté — 10 %.** Distribué aux membres de la communauté sur un an, pour ceux qui contribuent par leur activité, leur participation, le développement ou le parrainage plutôt qu'en payant. L'allocation suit l'examen et l'approbation du conseil de gestion.
- **Vente publique — 10 %.** Proposé lors d'une vente publique au prix total de 24 000 dollars. Cette part représente 100 000 000 de jetons, soit 0,00024 dollar par NURA.
- **Trésorerie — 10 %.** Alloué sur un an sous la supervision du conseil de gestion, pour financer le développement de l'écosystème, l'infrastructure, les produits et les partenariats.
- **Airdrop — 5 %.** Distribué sur un an, les bénéficiaires étant identifiés via des canaux et communautés sélectionnés, l'allocation finale étant confirmée par le conseil de gestion.

Ces parts totalisent 100 %.

## Ce que vous pouvez vérifier, et ce que vous ne pouvez pas

Voici la section à lire deux fois, car elle vaut pour toute chaîne et pas seulement pour celle-ci.

**Vous pouvez vérifier n'importe quel solde particulier.** Les soldes sont sur la chaîne et publics :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

La réponse est en wei, encodée en hexadécimal. Divisez par 10 puissance 18 pour obtenir des NURA.

**Vous ne pouvez pas vérifier l'offre totale d'une monnaie native via le RPC standard.** Il n'existe pas de `eth_totalSupply`. Un ERC-20 possède une fonction `totalSupply()` parce qu'il s'agit d'un contrat tenant son propre registre ; l'émission d'une monnaie native, elle, réside dans les règles de consensus et l'état de genèse, non dans un contrat interrogeable. Le chiffre d'un milliard ci-dessus est donc une affirmation publiée, et non quelque chose qu'un appel JSON-RPC vous confirmera.

Cette distinction mérite d'être intériorisée. Sur n'importe quelle chaîne, l'« offre totale » de l'actif natif est une déclaration du projet, vérifiable seulement en lisant la configuration du client ou le bloc de genèse. L'offre d'un jeton, à l'inverse, est toujours contrôlable — et c'est pourquoi [créer un ERC-20 sur Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) peut vous montrer exactement comment.

**L'offre en circulation n'est volontairement pas indiquée ici.** Un chiffre de circulation dépend des allocations considérées comme débloquées à un instant donné, ce qui relève du jugement et non de la mesure, à moins que chaque allocation bloquée ne repose sur une adresse publiée que vous pouvez surveiller. Là où de telles adresses sont publiées, elles se vérifient avec l'appel de solde ci-dessus.

## Détenir des NURA

Tout portefeuille acceptant un réseau EVM personnalisé peut en détenir — les valeurs du réseau figurent dans [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet). Il existe aussi Nura Wallet, un portefeuille auto-dépositaire conçu pour ce réseau, avec des versions Android, Windows et Linux.

Quel que soit votre choix, l'auto-conservation signifie que les clés sont à vous, et la responsabilité aussi. Il n'existe aucune voie de récupération pour une phrase de récupération perdue, ni sur ce réseau ni sur un autre.

## Questions fréquentes

### NURA est-il un jeton ERC-20 ?

Non. C'est la monnaie native du réseau, au même sens où l'ether est natif d'Ethereum. Des jetons ERC-20 existent sur Nura Chain sous forme de contrats distincts, mais NURA n'en fait pas partie.

### Ai-je besoin de NURA pour utiliser le réseau ?

Pour le lire, non : le point de terminaison RPC répond aux appels de lecture de n'importe qui. Pour envoyer une transaction ou déployer un contrat, oui, puisque c'est ce qui paie le gaz.

### Où voir le prix actuel ?

Cette page ne cite aucun prix en direct, et toute page qui le fait devrait être recoupée avec une plateforme où vous pouvez réellement échanger. Le seul chiffre indiqué plus haut est le prix publié de la vente publique, une condition historique fixe de cette vente et non une cotation de marché.

### Comment vérifier le solde d'un portefeuille précis ?

Utilisez l'appel `eth_getBalance` ci-dessus, ou collez l'adresse dans [Nura Explorer](https://explorer.nurachain.net). Les deux lisent la même chaîne — [comment utiliser l'explorateur](/blog/how-to-use-nura-chain-explorer) explique pourquoi vérifier les deux est une bonne habitude.

## Pour aller plus loin

Pour détenir ou déplacer réellement des NURA, commencez par [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet).

Pour savoir ce que la monnaie paie exactement — le réseau lui-même, son chain ID et son RPC — voyez [ce qu'est Nura Chain](/blog/what-is-nura-chain). Et si la distinction sur l'offre vous a intéressé, [créer un ERC-20 sur Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) présente le cas inverse, où l'offre est entièrement vérifiable.
