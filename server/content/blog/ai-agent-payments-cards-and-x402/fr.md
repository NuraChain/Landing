Les logiciels ont commencé à payer des choses durant la troisième semaine de septembre 2026, sur deux jeux de rails différents. Le 21 septembre, Mastercard et Danske Bank ont réalisé ce qu'ils ont présenté comme le premier paiement effectué par un agent IA au Danemark, et Mastercard a annoncé le premier au Canada le même jour. Le 25 septembre, Block a ajouté le Lightning Network de Bitcoin à x402, le protocole qui permet à un agent de payer une seule requête web. Les paiements par agents IA ont désormais une réponse par carte et une réponse crypto.

## L'essentiel

- **Cartes :** le 21 septembre 2026, un agent a réservé et payé une dégustation de café avec une Mastercard de Danske Bank, au moyen de Mastercard Agent Pay.
- **Canada :** un assistant agissant pour le compte d'un titulaire de carte Rogers Bank a acheté un produit dans le cadre de « limites de dépenses prédéfinies ».
- **Crypto :** Block a ajouté la prise en charge de Lightning à x402 le 25 septembre 2026.
- **Ampleur de x402 :** environ 75,4 millions de transactions pour une valeur de 24,2 millions de dollars sur les 30 jours précédents, selon les chiffres du protocole lui-même.
- **En quoi il règle :** l'USDC représentait 99,3 % du volume de x402 au deuxième trimestre 2026, selon Circle.

## Comment un agent paie-t-il par carte ?

En empruntant celle d'une personne.

L'agent agit pour un titulaire de carte qui a déjà été vérifié. Le paiement est autorisé sur la carte de cette personne, dans le cadre des instructions et des limites qu'elle a fixées, et le commerçant reçoit quelque chose qui ressemble à un paiement par carte ordinaire. Tout ce qu'il y a derrière, c'est le système existant : une banque émettrice, des rétrofacturations, des règles antifraude, un relevé à la fin du mois.

C'est là sa force. Un commerce n'a rien à changer pour l'accepter, et un achat fait par erreur peut être contesté.

## Comment un agent paie-t-il avec x402 ?

En détenant une clé.

Un serveur répond à une requête par le statut HTTP `402 Payment Required` et un prix. L'agent paie et réessaie. Il n'y a ni compte, ni carte, ni personne dans la boucle — la mécanique est décrite dans [comment les agents IA paient à la requête avec x402](/blog/ai-agents-onchain-payments-x402).

Divisez les chiffres du protocole lui-même et la différence avec les cartes saute aux yeux : 24,2 millions de dollars répartis sur 75,4 millions de transactions, cela fait environ 32 cents chacune. Les réseaux de cartes n'ont pas été conçus pour des paiements de cette taille.

## Alors, lequel l'emporte ?

Probablement les deux, pour des achats différents.

- **Les cartes conviennent** à ce que les gens achètent déjà : une réservation, un produit, tout ce qui a un commerçant, une politique de remboursement et un prix qui vaut la peine d'être contesté.
- **x402 convient** à ce que seuls les logiciels achètent : un appel d'API, une page de données, une inférence, des milliers de fois par heure.

L'ajout de Lightning compte parce qu'il élargit la seconde catégorie au-delà des stablecoins. Jusqu'ici, presque tout le volume de x402 était en USDC ; un agent peut désormais payer en bitcoin avec le même protocole.

## Qu'est-ce qui reste identique sur les deux rails ?

Un agent qui peut payer est un signataire sans surveillance. La version carte place la limite au niveau du réseau ; la version crypto la place dans le compte. Dans les deux cas, le contrôle qui compte est le plafond, car un agent peut se laisser convaincre de faire des choses, et une limite de dépenses, non.

Sur une chaîne EVM, ce plafond est un compte intelligent doté d'une clé de session qui expire — le schéma décrit dans [EIP-7702 et les comptes intelligents](/blog/eip-7702-smart-accounts). Nura Chain produit un bloc environ toutes les trois secondes, avec des frais fixés par des frais de base EIP-1559, ce qui est la forme dont les paiements à la requête ont besoin. Elle ne propose pas de produit de paiement pour agents, et rien ici ne doit être lu comme tel.

Les volumes sont faibles et déclarés par le protocole lui-même. [x402.org](https://x402.org) publie les chiffres du protocole.
