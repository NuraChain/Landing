Nura Chain est une blockchain publique : un registre partagé de qui possède quoi, tenu par des ordinateurs plutôt que par une banque, que tout le monde peut lire et que personne ne peut réécrire en douce. Elle ajoute une nouvelle page à ce registre toutes les trois secondes, elle tourne sur le même moteur qu'Ethereum, et elle a sa propre monnaie, le NURA, qui paie les petits frais que coûte chaque transaction. Autour d'elle, il y a un portefeuille, un explorateur pour consulter les informations, un swap pour échanger des jetons et un pont pour faire venir des jetons d'autres réseaux.

Ce document explique tout cela avec des mots simples. Il s'adresse à quelqu'un qui n'a jamais utilisé de blockchain, à quelqu'un qui hésite à détenir des NURA, et à quelqu'un qui veut simplement savoir ce qu'il a sous les yeux. Quand une affirmation peut être vérifiée par n'importe qui, nous disons comment ; quand elle ne le peut pas, nous le disons aussi.

## 1. Ce qu'est Nura Chain

Imaginez une blockchain comme un carnet dont des milliers de personnes détiennent des copies identiques. Quand quelqu'un envoie des jetons, le transfert est inscrit sur une nouvelle page, chaque copie reçoit la même page, et une fois qu'une page est ajoutée, elle y reste. Personne ne peut en arracher une ni modifier une ancienne ligne sans que tout le monde s'en aperçoive. Voilà toute l'astuce, et c'est pourquoi une blockchain peut garder l'argent honnête sans entreprise au milieu.

Nura Chain est l'un de ces carnets. Ce qui la rend facile à utiliser, c'est qu'elle tourne sur le même moteur qu'Ethereum, la plateforme blockchain la plus utilisée. Tout portefeuille, application ou outil conçu pour Ethereum fonctionne aussi sur Nura Chain, vous n'avez donc pas besoin d'un logiciel particulier pour l'utiliser. Si vous avez déjà utilisé MetaMask ou un portefeuille du même genre, vous savez déjà comment faire.

Une chose à garder en tête : Nura Chain est le réseau. Nura Wallet, Nura Explorer et Nura Swap sont des produits construits par-dessus, décrits dans la section 7. Vous pouvez utiliser le réseau avec le portefeuille de votre choix.

## 2. Ce que nous défendons

Quatre idées guident tout ce qui suit.

- **Vos clés, vos jetons.** Votre portefeuille garde vos jetons grâce à une clé secrète qui ne quitte jamais votre appareil. Personne chez Nura, et personne ailleurs, ne peut déplacer vos jetons, les geler ou vous les prendre. Le revers de la médaille, c'est que personne ne peut non plus les récupérer à votre place.
- **Vérifiez, ne faites pas confiance.** Les faits importants sur le réseau peuvent être vérifiés par quiconque dispose d'un portefeuille ou d'un navigateur web. Quand un chiffre ne peut pas être vérifié, ce document le dit au lieu de vous laisser croire qu'il le peut.
- **Des outils familiers.** Rien dans Nura Chain n'exige un nouveau genre d'application. Les portefeuilles et les outils que les gens utilisent déjà fonctionnent ici.
- **Dire les choses simplement.** Moins de promesses, décrites honnêtement, y compris les parties qui ne sont pas flatteuses.

## 3. Comment fonctionne le réseau

### 3.1 Les blocs : une nouvelle page toutes les trois secondes

Les pages du carnet s'appellent des blocs. Nura Chain en écrit un nouveau toutes les trois secondes, à un rythme fixe, que quelqu'un ait envoyé quelque chose ou non pendant ce temps. Le tout premier bloc a été écrit le 6 juin 2026, et le compteur n'a cessé de monter depuis. Vous pouvez le regarder monter sur la page d'accueil du site et dans Nura Explorer.

### 3.2 Les frais : une petite somme pour chaque transaction

Chaque transaction paie des frais en NURA, un peu comme le timbre sur une lettre. Ces frais ont deux parties : un montant de base fixé par le réseau, et un pourboire facultatif que vous pouvez ajouter si vous voulez que votre transaction passe en premier. Votre portefeuille calcule tout cela pour vous ; vous n'avez jamais à le faire à la main. Au moment où nous écrivons, le montant de base est une infime fraction d'un NURA, mais il est fixé par le réseau et peut changer : considérez donc les frais affichés par votre portefeuille comme le vrai chiffre.

### 3.3 Qui écrit les blocs

Sur certaines blockchains, comme Bitcoin, des ordinateurs font la course pour résoudre des énigmes et gagner le droit d'écrire le bloc suivant ; c'est ce que l'on appelle le « minage ». Nura Chain ne fonctionne pas ainsi. Ses blocs sont écrits par un producteur de blocs autorisé, au rythme de trois secondes décrit plus haut, et chaque bloc indique quel compte l'a écrit : savoir qui a produit tel ou tel bloc est donc public, et non une question de confiance.

Pour être francs sur la situation d'aujourd'hui : au moment de cette révision, tous les blocs que nous avons examinés ont été écrits par le même compte producteur. Ajouter d'autres producteurs ou non est une décision sur la façon dont le réseau est géré, et ce document ne promet rien dans un sens ni dans l'autre. Tout changement est annoncé par les canaux indiqués dans la section 10.

### 3.4 Quand une transaction est-elle définitive ?

Une fois votre transaction inscrite dans un bloc, c'est fait. Elle apparaît dans Nura Explorer en quelques secondes, et personne ne peut la défaire, l'inverser ou l'annuler, nous y compris. C'est ce qui rend le registre digne de confiance, et c'est aussi pourquoi la section 9 vous demande de vérifier deux fois avant d'envoyer.

## 4. La monnaie NURA

Le NURA est la monnaie propre du réseau, comme l'ether est celle d'Ethereum. Il paie les frais de la section 3.2, et un compte sans aucun NURA ne peut rien envoyer, parce qu'il ne peut pas payer le timbre.

Le NURA est intégré au réseau lui-même, ce n'est pas une application qui tourne dessus. Cela a une conséquence pratique : il n'existe pas d'« adresse du contrat NURA » à ajouter à votre portefeuille. Vous ajoutez le réseau lui-même, avec les valeurs de la section 10, et votre solde en NURA apparaît tout simplement. Si une page vous demande de coller une adresse pour « ajouter NURA », méfiance : elle réclame quelque chose qui n'existe pas.

Comme la plupart des monnaies de ce type, le NURA peut être divisé en très petites fractions : vous pouvez envoyer un dixième, un millième, ou bien moins encore d'un seul NURA.

## 5. Combien de NURA existent, et où ils vont

### 5.1 Le total

L'offre totale est de 1 000 000 000 NURA, un milliard, et il n'en sera pas créé davantage.

Ce chiffre est publié par le projet. Il faut savoir que c'est l'un des rares chiffres de ce document que vous ne pouvez pas vérifier vous-même : un portefeuille ou l'explorateur peut vous montrer le solde de n'importe quelle adresse, mais une monnaie intégrée au réseau n'a pas de compteur qui les additionne toutes. Les soldes individuels sont vérifiables ; le total, c'est la parole du projet.

Nous n'indiquons pas d'« offre en circulation » dans cette révision. Ce chiffre dépend des parts ci-dessous que l'on considère comme débloquées un jour donné, et cela relève du jugement, pas de la mesure. Là où le projet publie les adresses qui détiennent une part, chacun peut surveiller ces soldes à la place.

### 5.2 La répartition

Le milliard de jetons est divisé en six parts. Pour chacune : la proportion, le nombre de jetons, et à quoi elle sert.

- **Bloqué, 40 %, 400 000 000 NURA.** Mis de côté et bloqués pendant un an. Ce qu'il en advient ensuite sera décidé à la fin de cette année, et toute décision sur cette part exige l'approbation d'au moins 65 % du réseau lors d'un vote.
- **Liquidité, 25 %, 250 000 000 NURA.** Utilisés sur un an pour garder assez de NURA disponibles dans les pools d'échange, afin que l'achat et la vente se passent sans heurts et que le prix ne fasse pas un bond à chaque transaction.
- **Communauté, 10 %, 100 000 000 NURA.** Donnés sur un an aux personnes qui aident le réseau à grandir : en étant actives, en participant, en construisant des choses ou en amenant d'autres personnes. Chaque attribution est examinée et approuvée par le conseil de gestion.
- **Vente publique, 10 %, 100 000 000 NURA.** Vendus au public pour 24 000 dollars au total, soit 0,00024 dollar par NURA. C'est le prix de cette vente, pas le prix du marché, et il ne dit rien de ce que vaut le NURA un jour donné.
- **Trésorerie, 10 %, 100 000 000 NURA.** Le budget propre du projet sur un an, pour le développement, l'infrastructure, les produits et les partenariats, sous la supervision du conseil de gestion.
- **Airdrop, 5 %, 50 000 000 NURA.** Distribués gratuitement sur un an aux personnes touchées par des canaux et des communautés sélectionnés. La liste finale est confirmée par le conseil de gestion.

Ces six parts totalisent 100 %.

### 5.3 Vérifier un solde

Chaque solde sur Nura Chain est public. Ouvrez Nura Explorer, collez n'importe quelle adresse, et vous voyez exactement combien de NURA elle détient et chaque transfert entrant et sortant. Cela vaut pour votre propre adresse, pour celle d'un ami, et pour toute adresse que le projet publie pour l'une des parts ci-dessus.

## 6. Qui décide de quoi

Deux règles sont en place à cette révision, et toutes deux concernent les jetons de la section 5 plutôt que le réseau lui-même.

Les 40 % bloqués ne peuvent pas être libérés, réaffectés ni dépensés sans un vote où au moins 65 % du réseau donne son accord. C'est la seule règle ferme sur la plus grosse part de l'offre.

Les parts communauté, trésorerie et airdrop, un quart de tous les jetons à elles trois, sont distribuées sous le contrôle d'un conseil de gestion, qui valide chaque distribution.

Nous ne prétendons rien de plus. Il n'existe pas de système de vote pour les réglages du réseau lui-même, comme la fréquence d'écriture des blocs ou qui les écrit. Ces choix reviennent aux personnes qui font tourner le réseau, et ce document le dit plutôt que de décrire un système qui n'existe pas.

## 7. Les outils autour du réseau

### 7.1 Nura Wallet

Nura Wallet est notre propre application de portefeuille. Elle garde votre clé secrète sur votre appareil et nulle part ailleurs ; l'application ne peut pas dépenser vos jetons toute seule, et nous non plus. Son code source est public sur GitHub, donc n'importe qui peut lire ce qu'elle fait.

Elle est disponible pour Android, à la fois sur Google Play et en téléchargement direct, pour Windows et pour Linux. Les versions pour iPhone et Mac ne sont pas encore sorties. Vous n'êtes pas obligé de l'utiliser : tout portefeuille qui permet d'ajouter un réseau personnalisé, MetaMask compris, fonctionne avec Nura Chain.

### 7.2 Nura Explorer

Nura Explorer est la fenêtre publique sur le carnet. Tapez une adresse, une transaction ou un numéro de bloc et vous voyez tout ce qui s'y rapporte : les soldes, les transferts, quand un bloc a été écrit et par qui. C'est là que vous confirmez qu'un paiement est bien arrivé, et c'est l'outil derrière la plupart des « vous pouvez le vérifier » de ce document.

### 7.3 Nura Swap

Nura Swap est l'endroit où vous échangez des NURA contre d'autres jetons, et inversement. Il fonctionne à partir d'une réserve commune de jetons, un pool, et le prix qu'il affiche est simplement l'état de ce pool à cet instant.

Ce pool est petit. Cela veut dire qu'une seule grosse transaction peut faire beaucoup bouger le prix, dans un sens comme dans l'autre. Considérez le prix du swap comme ce qu'un petit pool se trouve coter à ce moment-là, pas comme une cotation en bourse, et ne le lisez pas comme une estimation de la valeur du NURA.

### 7.4 Le pont

Le pont vous permet de faire venir des BNB et des USDT sur Nura Chain depuis leurs réseaux d'origine. Il fonctionne comme un ticket de vestiaire : vos jetons d'origine sont bloqués sur l'autre réseau, et vous recevez ici un jeton « encapsulé » équivalent que vous pouvez dépenser sur Nura Chain. Rendez le jeton encapsulé et l'original est libéré.

Un jeton encapsulé ne vaut son original que tant que l'original est vraiment là. Le site affiche la valeur totale qui a traversé le pont, et ce chiffre compte les tickets, pas les manteaux : il est juste tant que chaque jeton encapsulé est couvert un pour un de l'autre côté. Les adresses des deux jetons encapsulés figurent dans la section 10.

## 8. Premiers pas

1. Installez un portefeuille. Nura Wallet, décrit dans la section 7.1, ou n'importe quel portefeuille que vous utilisez déjà et qui permet d'ajouter un réseau personnalisé.
2. Ajoutez-y Nura Chain. Le bouton « Ajouter Nura Chain au portefeuille » du site le fait en un geste ; si vous préférez le faire à la main, les valeurs sont dans la section 10.
3. Vérifiez que le portefeuille affiche le chain ID 1020 pour le réseau. S'il affiche un autre nombre, vous êtes sur un autre réseau, et tout ce que vous enverrez partira là où vous ne le vouliez pas.
4. Procurez-vous quelques NURA. Les frais se paient en NURA, donc un compte vide ne peut encore rien envoyer.
5. Envoyez d'abord une petite somme, puis retrouvez-la dans Nura Explorer. Voir votre propre transfert sur le registre public est la meilleure façon de comprendre comment tout cela fonctionne.

Si vous êtes développeur, le blog du site propose des guides pas à pas pour se connecter au réseau et déployer des contrats ; ils sont indiqués dans la section 10.

## 9. À quoi faire attention

- **Une phrase de récupération perdue, ce sont des jetons perdus.** Personne ne peut la réinitialiser, ni sur ce réseau ni sur un autre. Notez-la et gardez-la en lieu sûr.
- **Un mauvais chain ID, ce sont des jetons perdus.** Confirmez toujours 1020 avant d'envoyer, et considérez toute page, celle-ci comprise, comme quelque chose à vérifier plutôt qu'à croire sur parole.
- **La même adresse sur un autre réseau, ce n'est pas le même argent.** Votre adresse existe aussi sur Ethereum et sur d'autres réseaux, mais les soldes sont séparés. Envoyer des jetons vers « la même adresse sur une autre chaîne » ne les fait pas changer de réseau. Seul le pont le fait, et seulement pour BNB et USDT.
- **Le prix du swap peut osciller.** Une seule transaction dans un petit pool peut le faire bouger brusquement.
- **Un jeton encapsulé est un ticket, pas le manteau.** Il ne vaut l'original que tant que le pont détient l'original.
- **Certains chiffres reposent sur la parole du projet.** L'offre totale et les conditions de la répartition ne se vérifient pas dans un portefeuille. Les soldes individuels, si.
- **La production des blocs est aujourd'hui entre les mains d'un seul compte.** La section 3.3 le dit clairement pour que vous puissiez en tenir compte maintenant plutôt que de le découvrir plus tard.

## 10. Les faits, pour référence

Les valeurs qu'un portefeuille demande quand vous ajoutez le réseau à la main :

- Nom du réseau : Nura Chain
- Chain ID : `1020` (certains portefeuilles l'affichent sous la forme `0x3fc`, qui est le même nombre écrit autrement)
- Point de terminaison RPC : `https://rpc.nurachain.net`
- Explorateur de blocs : `https://explorer.nurachain.net`
- Monnaie : Nura, symbole `NURA`, 18 décimales
- Temps de bloc : 3 secondes

Les deux jetons encapsulés que le pont crée sur Nura Chain :

- BNB : `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT : `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

Où aller :

- [Nura Explorer](https://explorer.nurachain.net), pour consulter n'importe quelle information
- [Nura Swap](https://swap.nurachain.net/), pour échanger des jetons
- [Téléchargements de Nura Wallet](https://github.com/NuraChain/Wallet/releases), toutes les versions et toutes les plateformes
- [Nura Chain sur GitHub](https://github.com/NuraChain), le code source
- Communauté : [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Guides : [ce qu'est Nura Chain](/blog/what-is-nura-chain), [ajouter le réseau à votre portefeuille](/blog/add-nura-chain-to-your-wallet), [lire l'explorateur](/blog/how-to-use-nura-chain-explorer), [offre et répartition](/blog/nura-coin-tokenomics), et pour les développeurs, [se connecter au réseau](/blog/connect-to-nura-chain-rpc) et [déployer un contrat](/blog/deploy-a-smart-contract-on-nura-chain)

## 11. Une note sur ce qu'est ce document

Ce document décrit le réseau tel qu'il est à la révision indiquée en haut. Ce n'est ni une offre, ni une recommandation, ni un conseil en investissement, et rien ici ne promet ce que vaudra le NURA, la facilité avec laquelle on pourra l'acheter ou le vendre, ni ce que le projet fera ensuite. Les chiffres présentés comme la parole du projet sont exactement cela ; tout autre chiffre peut être vérifié avec les outils ci-dessus. Quand nous changeons quelque chose qui mérite d'être su, nous publions une nouvelle révision, et le numéro et la date de révision vous disent laquelle vous lisez.
