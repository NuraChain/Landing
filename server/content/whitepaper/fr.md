Nura Chain est une blockchain publique qui exécute la machine virtuelle Ethereum. Elle est identifiée par le chain ID `1020`, scelle un bloc toutes les trois secondes, tarife les transactions selon le marché des frais EIP-1559 et paie le calcul dans sa monnaie native, NURA. Autour du réseau se trouvent un portefeuille auto-dépositaire, un explorateur de blocs, un swap et un pont, tous accessibles dès aujourd'hui.

Ce document est la description de référence du réseau : ce qu'il est, comment il fonctionne, à quoi sert sa monnaie et comment l'offre est répartie, ce qui existe autour de lui, et ce qu'un lecteur peut vérifier sur la chaîne plutôt qu'accepter sur parole. Il s'adresse à trois lecteurs à la fois — celui qui décide de détenir ou non des NURA, celui qui s'apprête à développer sur le réseau, et celui qui veut simplement savoir ce qu'il a sous les yeux.

## 1. Introduction

La plupart des gens découvrent une nouvelle blockchain par une boîte de dialogue de portefeuille qui réclame cinq valeurs, et ils les collent sans savoir ce que chacune d'elles signifie. Nura Chain est conçue pour offrir l'expérience inverse. Chaque chiffre énoncé dans ce document est soit lisible sur la chaîne elle-même, soit clairement signalé comme une affirmation publiée, et l'outillage autour du réseau est celui que l'écosystème EVM au sens large utilise déjà.

Le nom désigne une seule chose : le réseau. Les produits construits dessus — Nura Wallet, Nura Explorer, Nura Swap — sont décrits dans la section 7 et sont distincts de la chaîne qu'ils servent. Tout portefeuille EVM acceptant un réseau personnalisé peut utiliser Nura Chain ; le portefeuille du projet est une porte d'entrée, pas la seule.

## 2. Principes de conception

Quatre choix façonnent tout ce qui suit.

- **Une exécution familière.** Le réseau exécute l'EVM sans modification, si bien que les contrats, les bibliothèques, les clés et les adresses se transposent depuis Ethereum telles quelles. La première journée d'un développeur sur Nura Chain est une entrée de configuration, pas une réécriture.
- **L'auto-conservation par défaut.** Nura Wallet ne détient jamais de clé et ne peut pas déplacer un solde. Le réseau n'a ni récupération de compte, ni gel, ni voie de dépense privilégiée ; qui détient la clé détient la monnaie.
- **Vérifiable avant d'être cru.** Le chain ID, l'intervalle de bloc, le marché des frais et l'identité de chaque producteur de blocs sont lisibles via le RPC public. Là où un chiffre ne peut pas être lu sur la chaîne — l'offre totale est le cas important — ce document le dit plutôt que de laisser entendre le contraire.
- **Une surface réduite, décrite honnêtement.** Le réseau livre moins de pièces qu'une page marketing n'en énumérerait, et chacune est décrite ici avec ses limites, y compris celles qui dérangent.

## 3. Le réseau

### 3.1 Exécution : la machine virtuelle Ethereum

Nura Chain exécute du bytecode EVM. Un contrat compilé pour l'EVM avec Solidity ou Vyper s'exécute ici avec la même sémantique, les mêmes coûts d'instruction et le même espace d'adresses sur 20 octets que sur Ethereum. Le nœud répond à l'interface JSON-RPC Ethereum standard, si bien qu'ethers.js, viem, web3.py, wagmi, Hardhat et Foundry fonctionnent avec lui sans rien de plus qu'un point de terminaison et un chain ID.

La compatibilité est une affirmation qui ne porte que sur la couche d'exécution. Une adresse contrôlée sur Ethereum est contrôlée ici, parce qu'elle dérive de la même clé secp256k1 — mais les soldes, les contrats déployés et l'historique sont des registres distincts. Rien de ce qui est envoyé vers « la même adresse sur une autre chaîne » ne passe de l'une à l'autre. La section 9 y revient, car c'est de là que viennent la plupart des pertes réelles.

### 3.2 Blocs, temps et frais

Le réseau scelle un bloc toutes les trois secondes. L'intervalle est fixe et non une cible : deux en-têtes consécutifs diffèrent d'exactement trois secondes. Le premier bloc de la chaîne porte l'horodatage du 6 juin 2026 à 00:00 UTC.

Les transactions sont tarifées selon le marché des frais EIP-1559. Chaque bloc porte des frais de base fixés par le protocole, et l'expéditeur y ajoute des frais de priorité ; le champ `baseFeePerGas` de chaque en-tête et les méthodes `eth_maxPriorityFeePerGas` et `eth_feeHistory` exposent les deux. À la date de cette révision, les frais de base s'établissent à 1 gwei et la limite de gaz par bloc est de 150 000 000 gaz. Ce sont deux valeurs à lire à l'exécution plutôt qu'à coder en dur, ce que fait par défaut l'estimation des frais d'une bibliothèque.

Les en-têtes ont la forme que produisent les clients Ethereum modernes : une `difficulty` à zéro, un `nonce` vide, un `mixHash` à zéro, et les champs introduits par les mises à niveau Shanghai, Cancun et Prague — `withdrawalsRoot`, `parentBeaconBlockRoot`, `blobGasUsed` et `requestsHash`. Un code qui se branche sur une difficulté non nulle, ou qui attend des champs de preuve de travail qu'ils signifient quelque chose, se comportera mal ici exactement comme il le fait aujourd'hui sur Ethereum.

### 3.3 Production des blocs

Nura Chain n'utilise pas la preuve de travail ; les champs d'en-tête ci-dessus l'excluent. Les blocs sont scellés par un producteur de blocs autorisé, selon le calendrier fixe décrit plus haut. Le compte qui a scellé un bloc est enregistré dans son champ `miner`, de sorte que le producteur de n'importe quel bloc est un fait public et non une affirmation dans un document.

À la date de cette révision, tous les blocs échantillonnés ont été scellés par le même compte producteur. La taille de l'ensemble des producteurs relève de la manière dont le réseau est exploité, non de sa couche d'exécution, et ce document ne la fixe pas. Tout changement à ce sujet est annoncé par les canaux du projet listés dans la section 11.

Le réseau n'expose aucun signal de finalité distinct via le RPC. L'inclusion dans un bloc scellé est la confirmation qu'affichent les portefeuilles et l'explorateur, et comme les blocs arrivent selon un calendrier, une transaction incluse est visible en l'espace d'un intervalle.

### 3.4 Identité du réseau

Voici les valeurs qu'un portefeuille ou une bibliothèque cliente demande. Ce sont celles que porte la carte réseau du site, et celles que Nura Wallet enregistre.

- Nom du réseau : Nura Chain
- Chain ID : `1020`, que les portefeuilles réclament sous la forme hexadécimale `0x3fc`
- Point de terminaison RPC : `https://rpc.nurachain.net`
- Explorateur de blocs : `https://explorer.nurachain.net`
- Monnaie native : Nura, symbole `NURA`, 18 décimales
- Temps de bloc : 3 secondes

Le chain ID est plus qu'une étiquette. En vertu de l'EIP-155, il est signé dans chaque transaction, si bien qu'une transaction signée pour la chaîne 1020 ne peut être rejouée sur aucun autre réseau, et qu'une transaction signée pour un autre réseau est rejetée ici. C'est aussi la valeur à vérifier avant de faire confiance à tout le reste, y compris cette page :

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La réponse est `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. Un portefeuille prenant en charge l'EIP-3085 peut recevoir toutes les valeurs ci-dessus en une seule requête, ce que fait le bouton « Ajouter Nura Chain au portefeuille » du site.

## 4. La monnaie native

NURA est la monnaie native du réseau. Elle paie le gaz : chaque transaction consomme du gaz, le gaz est tarifé en NURA, et un compte doit disposer d'un solde avant de pouvoir envoyer quoi que ce soit, y compris son premier déploiement de contrat. C'est le rôle que joue l'ether sur Ethereum, et la plus petite unité est, de même, un milliardième de milliardième de NURA.

Parce qu'elle est native et non un contrat, NURA n'a pas d'adresse de jeton. Une page qui réclame « l'adresse du contrat NURA » pour ajouter la monnaie demande quelque chose qui n'existe pas ; c'est l'ajout du réseau qui fait apparaître le solde. Des jetons ERC-20 existent sur Nura Chain sous forme de contrats ordinaires, et NURA n'en fait pas partie.

## 5. Offre et répartition

### 5.1 Offre totale

L'offre totale publiée est de 1 000 000 000 NURA — un milliard.

C'est un chiffre publié, non un chiffre lisible sur la chaîne, et la distinction compte. Un ERC-20 expose `totalSupply()` parce qu'il s'agit d'un contrat tenant son propre registre ; l'émission d'une monnaie native réside dans la configuration du client et l'état de genèse, et il n'existe pas de `eth_totalSupply`. N'importe quel solde particulier se lit avec `eth_getBalance` ; le total, non.

L'offre en circulation n'est volontairement pas indiquée dans cette révision. Elle dépend des allocations considérées comme débloquées à un instant donné, ce qui relève du jugement et non de la mesure, à moins que chaque allocation bloquée ne repose sur une adresse publiée que n'importe qui peut surveiller.

### 5.2 Répartition

Le total est divisé en six parts. Les pourcentages, le nombre de jetons qu'ils impliquent et les conditions annoncées de chaque part sont les suivants :

- **Bloqué — 40 %, 400 000 000 NURA.** Bloqué pendant un an. Le sort de cette part sera décidé à l'issue de cette période, et toute décision la concernant requiert l'approbation d'un vote d'au moins 65 % du réseau.
- **Liquidité — 25 %, 250 000 000 NURA.** Alloué sur un an à la fourniture et à la gestion de la liquidité, avec pour objectif une liquidité d'échange exploitable et un écosystème NURA plus stable.
- **Communauté — 10 %, 100 000 000 NURA.** Distribué aux membres de la communauté sur un an, pour ceux qui font grandir le réseau par leur activité, leur participation, le développement, le parrainage ou tout autre apport utile plutôt qu'en payant. L'allocation suit l'examen et l'approbation du conseil de gestion.
- **Vente publique — 10 %, 100 000 000 NURA.** Proposé lors d'une vente publique au prix total de 24 000 dollars, soit 0,00024 dollar par NURA.
- **Trésorerie — 10 %, 100 000 000 NURA.** Alloué sur un an, sous la supervision du conseil de gestion, au développement de l'écosystème, à l'infrastructure, aux produits, aux partenariats et aux autres besoins du projet.
- **Airdrop — 5 %, 50 000 000 NURA.** Distribué en airdrop sur un an. Les bénéficiaires sont identifiés via des canaux et des communautés sélectionnés, et l'allocation finale est confirmée par le conseil de gestion.

Ces six parts totalisent 100 %. Le prix de la vente publique est une condition fixe de cette vente, non une cotation de marché, et il ne doit pas être lu comme une valorisation de la monnaie.

### 5.3 Vérifier un solde

Chaque solde du réseau est public. N'importe quelle adresse, y compris toute adresse que le projet publie pour une allocation, peut être lue par n'importe qui :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

La réponse est en wei, encodée en hexadécimal ; divisez par 10^18 pour obtenir des NURA. Le même chiffre est affiché par Nura Explorer, et lire les deux est l'habitude que ce document recommande d'un bout à l'autre.

## 6. Gouvernance

Deux règles de gouvernance sont énoncées pour le réseau à cette révision, et toutes deux concernent la répartition ci-dessus plutôt que le protocole.

Les 40 % bloqués de l'offre ne peuvent être libérés, réaffectés ni faire l'objet d'une quelconque décision sans l'approbation d'un vote d'au moins 65 % du réseau. Ce seuil est la seule règle contraignante portant sur la plus grande part de l'offre.

Les parts communauté, trésorerie et airdrop — 25 % de l'offre à elles trois — sont allouées sous l'examen et la supervision d'un conseil de gestion, qui confirme chaque distribution.

Aucun autre mécanisme de gouvernance n'est revendiqué ici. Les paramètres propres au protocole — l'intervalle de bloc, le marché des frais, l'ensemble des producteurs — sont fixés par les opérateurs du réseau, et ce document ne décrit pas de système de vote sur la chaîne à leur sujet parce qu'aucun n'est déployé.

## 7. L'écosystème

### 7.1 Nura Wallet

Nura Wallet est un portefeuille auto-dépositaire conçu pour le réseau. Les clés privées sont générées et conservées sur l'appareil, et le portefeuille ne peut pas dépenser un solde de lui-même. Son code source et ses versions sont publiés sur GitHub.

Il est construit comme une application native et non comme une extension de navigateur. Des versions sont publiées pour Android, à la fois sur Google Play et sous forme d'APK universel, pour Windows en installateur x64, et pour Linux en paquet Debian amd64. Les versions iOS et macOS ne sont pas encore publiées. Chaque version et chaque architecture figurent sur la page des versions du portefeuille.

Parce qu'il s'agit d'une application, une page web n'a rien dans quoi s'injecter en dehors du navigateur intégré au portefeuille. Le site l'atteint donc de deux manières : par l'annonce de fournisseur EIP-6963 à l'intérieur de ce navigateur, et partout ailleurs par un lien profond `nurawallet://` qui transporte la requête jusqu'à l'application et renvoie la réponse à la page. Tout autre portefeuille EVM atteint le réseau par la requête d'ajout de chaîne EIP-3085 ordinaire.

### 7.2 Nura Explorer

Nura Explorer indexe les blocs, les transactions et les transferts du réseau. C'est là qu'une transaction est confirmée comme ayant eu lieu, là que le code et les appels d'un contrat peuvent être lus, et là que le producteur de blocs de la section 3.3 se voit sur chaque bloc. Il lit la même chaîne que sert le point de terminaison RPC, et c'est précisément pourquoi vérifier les deux vaut les dix secondes que cela prend.

### 7.3 Nura Swap

Nura Swap est une interface d'échange pour le réseau. Son pool cote le prix du NURA face à une représentation encapsulée de la monnaie, et cette cotation est ce que le site affiche comme prix du NURA.

Le pool est petit, si bien qu'une seule transaction peut déplacer fortement la cotation. C'est un prix de marché issu d'un seul pool, non une cotation en bourse, et ce document n'indique aucun prix pour cette raison.

### 7.4 Le pont

Un pont émet des représentations de BNB et d'USDT sur Nura Chain sous forme de contrats ERC-20 ordinaires. Ce sont deux jetons à émission et destruction plutôt que des coffres : une unité n'existe sur Nura que parce qu'une unité a été bloquée sur la chaîne d'origine. Leurs contrats sur Nura sont :

- BNB : `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT : `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

La valeur transférée sur le réseau via le pont est donc le `totalSupply()` de chaque jeton, et c'est ainsi que le site calcule la valeur totale verrouillée. Ce chiffre mesure la créance émise sur Nura ; il n'égale le collatéral que tant que le pont est solvable et adossé un pour un. Le solde du dépositaire sur la chaîne d'origine est le côté qui fait foi, et c'est le chiffre qu'un lecteur attentif vérifie.

## 8. Développer sur Nura Chain

Rien dans une chaîne d'outils Solidity n'est propre à ce réseau. Un déploiement est une entrée de réseau avec le point de terminaison RPC et le chain ID de la section 3.4, approvisionnée avec assez de NURA pour payer le gaz. Trois points de friction méritent d'être connus avant le premier déploiement.

- Lisez le chain ID depuis le point de terminaison et comparez-le à la configuration du framework. Les deux divergent plus souvent qu'on ne le pense, généralement parce qu'une configuration a été copiée d'un autre projet.
- Laissez la bibliothèque estimer les frais. Les frais de base et les frais de priorité sont lisibles à l'exécution, et un prix du gaz figé est la cause la plus fréquente d'une transaction qui reste non minée.
- Un contrat déployé ailleurs n'est pas déployé ici. Le redéployer lui attribue une nouvelle adresse, sauf à utiliser délibérément un déployeur déterministe, et toute dépendance codée en dur envers les contrats ou les oracles d'un autre réseau doit être revue.

Le point de terminaison RPC renvoie des en-têtes CORS permissifs, si bien qu'une page ouverte dans un navigateur peut lire directement la chaîne sans serveur intermédiaire. Le blog du projet propose des guides pas à pas pour se connecter, déployer un contrat et émettre un ERC-20.

## 9. Sécurité et risques

- **L'auto-conservation est une responsabilité.** Il n'existe aucune voie de récupération pour une phrase de récupération perdue, sur ce réseau comme sur tout autre, et aucune partie ne peut annuler une transaction une fois scellée.
- **Un chain ID erroné, c'est ainsi que les fonds se perdent.** Vérifiez `1020` auprès du point de terminaison avant d'enregistrer le réseau dans un portefeuille, et traitez toute page — y compris celle-ci — comme une affirmation à contrôler.
- **La compatibilité n'est pas un état partagé.** Les actifs ne passent pas d'une chaîne à l'autre parce qu'on les envoie à la même adresse. Seul le pont de la section 7.4 transfère du BNB ou de l'USDT sur le réseau, et seulement dans les limites qui y sont énoncées.
- **La cotation du swap est mince.** Un prix lu sur un seul petit pool n'est pas une valorisation, et une seule transaction peut le déplacer.
- **Le pont comporte un risque de dépositaire.** Une représentation émise ne vaut son collatéral que tant que le dépositaire côté origine le détient un pour un.
- **Certains chiffres sont des affirmations publiées.** L'offre totale et les conditions de répartition de la section 5 ne peuvent pas être confirmées via le RPC. Là où le projet publie des adresses d'allocation, leurs soldes se lisent avec l'appel de la section 5.3.
- **La production des blocs est concentrée.** La section 3.3 énonce clairement l'ensemble des producteurs observé afin qu'un lecteur puisse le peser dès maintenant plutôt que le découvrir plus tard.

## 10. Avertissement

Ce document décrit le réseau tel qu'il est à la révision indiquée. Il ne constitue ni une offre, ni une sollicitation, ni un conseil en investissement, et rien de ce qu'il contient ne doit être lu comme une promesse quant au prix, à la liquidité ou à la disponibilité futurs de NURA. Les chiffres signalés comme des affirmations publiées sont des déclarations du projet ; tout autre chiffre peut être vérifié sur la chaîne à l'aide des appels présentés. Les révisions ultérieures remplacent celle-ci, et le numéro et la date de révision en tête du document identifient celle qu'un lecteur a entre les mains.

## 11. Références

- Point de terminaison RPC : `https://rpc.nurachain.net`
- Explorateur de blocs : [Nura Explorer](https://explorer.nurachain.net)
- Swap : [Nura Swap](https://swap.nurachain.net/)
- Versions du portefeuille : [Nura Wallet sur GitHub](https://github.com/NuraChain/Wallet/releases)
- Code source : [NuraChain sur GitHub](https://github.com/NuraChain)
- Communauté : [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Standards : [EIP-155](https://eips.ethereum.org/EIPS/eip-155) (protection contre le rejeu), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) (marché des frais), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) (ajout d'une chaîne à un portefeuille), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) (découverte des portefeuilles)
- Guides : [ce qu'est Nura Chain](/blog/what-is-nura-chain), [se connecter au RPC](/blog/connect-to-nura-chain-rpc), [ajouter le réseau à un portefeuille](/blog/add-nura-chain-to-your-wallet), [déployer un contrat](/blog/deploy-a-smart-contract-on-nura-chain), [offre et répartition](/blog/nura-coin-tokenomics)
