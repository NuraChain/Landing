Le 24 septembre 2026, la plateforme d'échange Bitget a perdu 387,5 millions de dollars en 19 transferts non autorisés depuis ses portefeuilles chauds et tièdes. Aucun contrat intelligent n'a été exploité. L'attaquant s'est introduit dans un système backend auquel les portefeuilles faisaient confiance et s'en est servi pour falsifier des données de transfert. Chainalysis a attribué le piratage de Bitget à des acteurs liés à la Corée du Nord, ce qui porte le total volé par ces groupes en 2026 au-delà de 1 milliard de dollars.

## L'essentiel

- **Date et montant :** 24 septembre 2026 ; 387,5 millions de dollars ont atteint des adresses contrôlées par l'attaquant.
- **Comment :** 19 transferts sortis des systèmes de portefeuilles chauds et tièdes, après la compromission d'un système backend de portefeuilles.
- **Qui :** attribué par Chainalysis à des acteurs liés à la Corée du Nord.
- **Où l'argent est parti :** en trois heures, en 23 transferts, vers Ethereum (49,7 %), XRP (40,8 %), Zcash (7,6 %) et Tron (1,8 %).
- **Clients :** Bitget affirme que son fonds de protection, qui détient plus de 464 millions de dollars, couvre la perte.
- **Le mois :** septembre a été le pire mois de 2026 pour les vols — 766,5 millions de dollars selon le décompte de PeckShield, 768,4 millions selon celui de CertiK.

## Qu'est-ce qu'un portefeuille chaud, et pourquoi les plateformes d'échange en ont-elles un ?

Un portefeuille dont les clés sont en ligne, de sorte qu'il peut payer sans intervention humaine.

Une plateforme d'échange traite des retraits toute la journée. Elle ne peut pas aller chercher un appareil matériel dans un coffre pour chacun d'eux ; elle garde donc un solde de fonctionnement dans des systèmes qui signent automatiquement. Le stockage à froid conserve le reste hors ligne. Un portefeuille tiède se situe entre les deux, avec un délai ou une approbation en travers du chemin.

Cette répartition est le modèle de sécurité. Une brèche du côté chaud devrait coûter le solde de fonctionnement d'une journée. Quand elle coûte des centaines de millions, soit on gardait trop à chaud, soit les couches situées au-dessus pouvaient recevoir des instructions du même système compromis.

## Qu'est-ce qui a réellement failli ?

Ce que les portefeuilles croyaient.

Les systèmes de signature ne décident pas de ce qu'il faut payer. Quelque chose en amont le leur dit : ce client, ce montant, cette adresse. Si un attaquant contrôle ce système en amont, le portefeuille signe un vol comme s'il s'agissait d'un retrait, avec des clés valides et une procédure correcte. Rien n'a été piraté au sens d'une cryptographie cassée.

C'est le schéma derrière la plupart des grosses pertes aujourd'hui, et c'est l'argument de [pourquoi des contrats audités se font quand même vider](/blog/why-audited-contracts-get-drained) : le composant audité fonctionne, et l'argent sort par le logiciel qui l'entoure.

## Comment la trace a-t-elle été remontée si vite ?

Chaque transfert est public, et le traçage est désormais en partie automatisé.

Les fonds ont été répartis sur quatre réseaux en trois heures, ce qui aurait autrefois fait gagner des jours aux voleurs. Chainalysis indique que l'automatisation a ramené plus de 20 heures de traçage manuel à moins de dix minutes — et reste prudent dans son affirmation : « Nos enquêteurs ont tout de même défini la logique, examiné les résultats et dirigé l'enquête. »

Tracer n'est pas récupérer. Savoir où sont les fonds ne les fait pas revenir ; cela les rend plus difficiles à encaisser.

## Qu'est-ce que cela signifie si vous gardez de l'argent sur une plateforme d'échange ?

Un solde sur une plateforme d'échange est une écriture dans la base de données de la plateforme. Les pièces se trouvent dans des portefeuilles que la plateforme contrôle, mises en commun avec celles de tous les autres. Quand tout fonctionne, vous ne remarquez jamais la différence.

- **Gardez sur une plateforme d'échange ce que vous négociez.** Le reste n'a pas besoin d'y être.
- **Demandez ce qui couvre une perte.** Un fonds de protection est une promesse de la même entreprise.
- **Testez un retrait** avant d'en avoir besoin dans l'urgence.

L'alternative consiste à détenir la clé vous-même, ce qui supprime le risque de la plateforme et vous remet le vôtre. Nura Wallet est auto-dépositaire — les clés restent sur votre appareil — et n'importe quel portefeuille EVM peut être dirigé vers le réseau en suivant [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet). Il n'existe pas non plus de fonds de protection pour une phrase de récupération perdue.

Les détails changeront à mesure que l'enquête avance. Le récit du traçage est [celui de Chainalysis](https://www.chainalysis.com/blog/387m-bitget-theft-2026/) ; les totaux de pertes diffèrent d'une société de sécurité à l'autre parce qu'elles ne comptent pas de la même façon.
