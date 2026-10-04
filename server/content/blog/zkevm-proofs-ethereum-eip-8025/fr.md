Aujourd'hui, chaque nœud Ethereum vérifie un bloc de la même façon : il réexécute chaque transaction et compare le résultat. EIP-8025 propose une seconde méthode. Un prouveur spécialisé exécute le bloc une fois et produit une preuve zkEVM attestant que l'exécution était correcte, et tous les autres vérifient la preuve, ce qui coûte bien moins cher que de refaire le travail. Lors de la session AMA de l'Ethereum Foundation sur le protocole, le 16 septembre 2026, des chercheurs ont décrit la preuve zkEVM comme proche de la production, et la proposition est candidate au fork Hegotá.

## L'essentiel

- **La proposition :** EIP-8025, « Optional Execution Proofs », permet aux nœuds de consensus d'accepter un bloc sur la foi de preuves zkEVM transmises sur le réseau pair-à-pair.
- **Facultatif :** les validateurs qui n'activent pas l'option « ne voient aucun changement ».
- **Vitesse :** la Fondation a indiqué que 99 % des blocs Ethereum peuvent être prouvés dans un délai de 10 secondes sur son matériel cible. Un bloc arrive toutes les 12 secondes.
- **Calendrier :** ethereum.org présente Hegotá comme une mise à jour en cours de planification, avec le deuxième trimestre 2027 comme période attendue et aucune date confirmée.
- **Statut :** proposée pour inclusion dans Hegotá, pas programmée.

## Qu'est-ce qu'une preuve zkEVM ?

Une courte donnée qui vous convainc qu'un calcul a été fait correctement, sans que vous ayez à le refaire.

Le prouveur exécute les transactions du bloc et enregistre chaque étape. À partir de cet enregistrement, il construit une preuve cryptographique. Vérifier la preuve demande une fraction de l'effort de l'exécution, et son coût augmente à peine avec la taille du bloc. « Zero-knowledge » désigne la famille de mathématiques en jeu ; ici, rien n'est caché. La propriété utile, c'est que la vérification est bon marché.

## Pourquoi Ethereum veut-il cela ?

Parce que c'est la réexécution qui maintient les blocs petits.

Si chaque nœud doit rejouer chaque transaction en quelques secondes sur du matériel modeste, la quantité de calcul dans un bloc est plafonnée par la machine la plus lente que l'on refuse d'exclure. Remplacez le rejeu par la vérification et ce plafond se déplace : comme le dit ethereum.org, « quand la vérification est bon marché, la limite de gaz peut augmenter en toute sécurité ». C'est le même objectif que l'exécution parallèle du prochain fork, décrite dans [la mise à jour Glamsterdam](/blog/ethereum-glamsterdam-upgrade), atteint par un autre chemin.

Cela réduit aussi ce qu'il en coûte de faire tourner un validateur, ce qui compte pour le nombre de personnes qui peuvent le faire.

## Que signifie « temps réel » ici ?

Assez rapide pour suivre la chaîne. Une preuve qui arrive après le bloc suivant ne sert à rien pour le consensus, donc le budget, ce sont les douze secondes entre deux blocs.

La moyenne n'est pas la partie difficile. Les auteurs d'EIP-8025 notent que prouver la plupart des blocs en quelques secondes « n'a qu'une valeur limitée si un attaquant peut fabriquer un bloc qui prend des minutes à prouver ». Un réseau doit survivre à son pire bloc, pas à son bloc typique.

## Qu'est-ce qui reste à résoudre ?

- **La justesse des prouveurs.** Un bug dans un système de preuve est un bug dans le consensus. Des travaux de vérification formelle menés cette année ont établi des garanties pour certaines parties de l'implémentation RISC-V d'un prouveur, et des tests ultérieurs y ont tout de même trouvé un problème.
- **Qui produit les preuves.** Il faut du matériel sérieux. Si seuls quelques opérateurs peuvent se l'offrir, vérifier un bloc devient plus décentralisé tandis qu'en prouver un le devient moins.
- **La diversité.** Ethereum s'appuie sur plusieurs clients indépendants afin qu'un seul bug ne puisse pas forker la chaîne. Il doit en aller de même pour les prouveurs, et ethereum.org en recense cinq en développement.

C'est pourquoi la première étape est facultative. Les nœuds qui vérifient des preuves tournent aux côtés de ceux qui réexécutent, et les deux se contrôlent mutuellement.

## Quelque chose change-t-il pour les contrats ou les autres chaînes EVM ?

Pour les contrats, non. La proposition est explicite : « L'EVM elle-même n'est pas modifiée. » Solidity compile vers le même bytecode, et celui-ci fait la même chose.

Pour les autres réseaux EVM, rien n'est hérité automatiquement. Chaque chaîne décide de la façon dont ses propres nœuds valident les blocs, et rien ici n'est une déclaration sur les projets de Nura Chain. Ce que toutes les chaînes EVM partagent, c'est la couche d'exécution elle-même — le sujet de [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility) — et tout ce qui est construit pour prouver l'exécution EVM l'est par rapport à cette spécification commune.

Les calendriers donnés ici sont des plans. Le [blog zkEVM de l'Ethereum Foundation](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota) et [ethereum.org](https://ethereum.org/roadmap/zkevm/) portent ceux qui sont à jour.
