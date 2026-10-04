Alpenglow, le changement le plus important apporté jusqu'ici au consensus de Solana, a été mis en service sur le réseau de test de Solana le 22 septembre 2026. Il n'a pas été mis en service sur le réseau principal le 28 septembre, malgré une semaine de gros titres affirmant qu'il le serait. La mise à jour remplace la façon dont les validateurs votent et dont les blocs se propagent, et elle vise une finalité d'environ 100 à 150 millisecondes, contre environ 12,8 secondes aujourd'hui.

## L'essentiel

- **Ce que c'est :** une nouvelle conception du consensus, proposée sous le nom SIMD-0326, qui remplace TowerBFT.
- **Deux parties :** Votor gère le vote et la finalité ; Rotor gère la propagation des blocs.
- **Statut :** sur le réseau de test depuis le 22 septembre 2026. Pas sur le réseau principal.
- **La confusion sur la date :** le 28 septembre est le jour où les développeurs du client ont repris l'activation de fonctionnalités sur le réseau principal en général, pas un lancement d'Alpenglow.
- **Prochaine fenêtre :** une fenêtre d'activation sur le réseau principal s'ouvre le 9 novembre 2026. C'est une fenêtre, pas un engagement.

## Qu'est-ce que la finalité, et pourquoi 150 ms comptent-elles ?

La finalité est le point à partir duquel une transaction ne peut plus être annulée.

Ce n'est pas la même chose que la production d'un bloc. Un bloc peut apparaître en moins d'une seconde et rester provisoire ; une plateforme d'échange qui crédite un dépôt ou un commerçant qui remet une marchandise attend la finalité, pas l'inclusion. Douze secondes, c'est rapide pour une blockchain et lent pour un passage en caisse. Un dixième de seconde se situe dans la plage où une personne ne perçoit aucune attente.

## Comment Alpenglow y parvient-il ?

En sortant les votes de la chaîne.

Aujourd'hui, les validateurs de Solana votent en envoyant des transactions, qui sont traitées comme n'importe quelles autres et payées comme n'importe quelles autres. Avec Alpenglow, les validateurs échangent leurs votes directement et enregistrent un certificat compact dès qu'une part suffisante du stake a donné son accord. Un bloc qui réunit une part assez grande du stake au premier tour est final immédiatement ; sinon, un second tour le complète.

Un effet secondaire est économique. Les validateurs paient actuellement des frais sur chaque vote, un coût fixe qui pèse surtout sur les petits opérateurs. Supprimer les transactions de vote supprime ce coût.

## Pourquoi tout le monde a-t-il cru au lancement ?

Parce qu'une ligne de calendrier a été lue comme une annonce. Le plan de publication du client validateur indiquait le 28 septembre comme le jour où l'activation de fonctionnalités reprendrait sur le réseau principal. Alpenglow était la fonctionnalité que l'on attendait, alors on a relié les deux. Les développeurs ont dit clairement que cela n'aurait pas lieu ce jour-là.

La leçon vaut bien au-delà de Solana : dans ce secteur, les dates de mise à jour sont des objectifs tant que le bloc dans lequel elles s'activent n'a pas été produit. La même prudence vaut pour le prochain fork d'Ethereum, comme le note [la mise à jour Glamsterdam](/blog/ethereum-glamsterdam-upgrade).

## Cela touche-t-il les chaînes EVM ?

Pas directement. Solana n'est pas un réseau EVM ; ses programmes, ses comptes et son outillage sont distincts, et rien dans Alpenglow ne se transpose.

La comparaison reste utile, parce qu'elle montre ce que « rapide » veut dire. Le temps de bloc et la finalité sont des chiffres différents, et celui qu'une chaîne met en avant est généralement le premier. Nura Chain produit un bloc environ toutes les trois secondes — c'est son temps de bloc, indiqué dans [ce qu'est Nura Chain](/blog/what-is-nura-chain) — et la raison pour laquelle la compatibilité EVM ne dit rien du consensus est expliquée dans [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility). Quand vous comparez des réseaux, demandez lequel des deux chiffres on vous montre.

Les dates ci-dessus sont celles publiées par les développeurs du client et peuvent bouger ; [Anza](https://www.anza.xyz) tient le calendrier des versions.
