Le 22 octobre 2026, les développeurs principaux d'Ethereum ont reporté l'activation de Glamsterdam sur le testnet Hoodi, prévue le 26 octobre, pour étudier comment l'EIP-8037 interagit avec les contrats intelligents déjà présents sur le réseau principal. La décision a été prise lors de l'appel All Core Devs Execution n° 248, selon l'Ethereum Foundation. L'élément déclencheur est un examen de sécurité, et ChainSecurity a depuis indiqué avoir trouvé 13 contrats réels susceptibles d'être touchés. Aucune nouvelle date n'est fixée, ni pour le testnet ni pour le réseau principal.

## Points clés

- **Quoi :** le fork Glamsterdam sur Hoodi, programmé le 26 octobre 2026 à 17:42:48 UTC, est reporté, de même que l'étape qui devait porter la limite de gaz de Hoodi à 200 millions.
- **Qui a décidé :** les développeurs principaux lors de l'appel All Core Devs Execution (ACDE) n° 248 du 22 octobre, selon l'Ethereum Foundation.
- **Pourquoi :** l'EIP-8037, qui change le prix de la création d'état et la mesure à part. L'analyse de ChainSecurity du 13 octobre la traite avec l'EIP-8038.
- **Le risque :** les contrats qui jugent un appel échoué au gaz restant pourraient considérer une opération qui pouvait être retentée comme définitivement échouée, sans aucune modification de leur code.
- **Le décompte :** 13 contrats réels potentiellement touchés, selon ChainSecurity, qui mène une divulgation responsable et ne les a pas nommés.
- **Nouvelle date :** aucune. Les dates du 1er, du 8 et du 9 décembre pour le réseau principal figuraient à l'ordre du jour de l'appel pour discussion ; aucune n'a été confirmée.

## Que change l'EIP-8037 ?

Elle rend plus coûteuse la création d'état nouveau (nouveaux comptes, emplacements de stockage et code de contrat) et mesure ce coût séparément du gaz d'exécution ordinaire. L'objectif affiché de la proposition est de contenir la croissance de l'état d'Ethereum à mesure que la limite de gaz par bloc augmente. C'est la mesure séparée qui permet de relever la limite sans que des frais d'état plus élevés évincent tout le reste.

D'après la lecture de la spécification par ChainSecurity au 13 octobre, écrire un emplacement de stockage neuf entraînerait des frais d'état de 97 920 unités de gaz en plus de son coût d'exécution. Ces frais sont d'abord payés sur une réserve de gaz distincte, et cette réserve est transmise en entier à chaque appel que fait un contrat. Quand la création d'état est annulée au sein d'une transaction, le gaz revient immédiatement.

## Pourquoi est-ce un risque pour les contrats déjà déployés ?

Parce que certains contrats prennent des décisions selon la quantité de gaz restante.

L'attaque s'appelle insufficient gas griefing, le sabotage par gaz insuffisant. Quelqu'un déclenche une opération valide mais fournit juste un peu moins de gaz qu'il n'en faut pour qu'elle réussisse, tout en laissant assez pour que le contrat appelant enregistre l'échec. Un contrat prudent se défend en vérifiant le gaz restant après un appel échoué : s'il en reste trop peu, il suppose que l'appel a manqué de gaz et annule tout, pour que l'opération puisse être retentée.

Cette vérification repose sur une hypothèse qui tient depuis des années : le gaz ne fait que baisser. Avec les nouvelles règles, il peut revenir, par un remboursement immédiat ou par un contrat intermédiaire qui crée de l'état puis annule. Un gestionnaire d'échec qui manquait de gaz jusque-là pourrait désormais aller au bout, et un contrat pourrait marquer le retrait ou la réclamation d'un utilisateur comme définitivement échoués. Le chercheur pcaversaccio l'a résumé dans un commentaire sur l'ordre du jour de l'appel : « Ce qui est fondamentalement "cassé", c'est que `gasleft()` peut augmenter. »

Rien dans le bytecode déployé n'a besoin de changer pour que cela arrive. C'est l'environnement en dessous qui change.

## Qu'est-ce qui a changé depuis notre article précédent sur Glamsterdam ?

Notre [explication de septembre sur Glamsterdam](/blog/ethereum-glamsterdam-upgrade) couvrait les deux éléments phares du fork, les listes d'accès au niveau du bloc et la séparation proposeur-constructeur inscrite dans le protocole, et disait qu'ils ne touchent pas aux opcodes sur lesquels vous écrivez. C'est toujours vrai pour ces deux-là. L'article ne couvrait pas la nouvelle tarification du gaz des EIP-8037 et EIP-8038, qui modifie le coût des opérations et, comme vu plus haut, le comportement du gaz pendant un appel. Son attente d'une activation au second semestre est désormais ouverte, puisqu'il n'y a pas de date.

## Que faire ?

- **Si vous écrivez des contrats :** le conseil de ChainSecurity est de laisser un appel échoué annuler toute l'opération quand c'est possible et, sinon, de garder une voie de récupération plutôt que de prendre une décision irréversible fondée sur le gaz restant. Testez les gestionnaires d'échec avec le barème de gaz actuel et avec celui de Glamsterdam, et ne prenez pas un seuil ajusté pour une preuve de sécurité.
- **Si vous exploitez un nœud ou un validateur Hoodi :** mettez à jour les clients d'exécution et de consensus avant le 26 octobre vers des versions qui retirent explicitement l'activation, ou revenez à une version antérieure qui ne la contient pas, selon l'Ethereum Foundation.
- **Si vous détenez de l'ETH ou utilisez le réseau principal :** rien, selon la Foundation.

## Cela touche-t-il les autres chaînes EVM ?

Pas automatiquement. Les réseaux EVM n'héritent pas des mises à jour d'Ethereum ; chaque chaîne décide quelles EIP adopter et quand. La manière dont Nura Chain exécute le bytecode EVM est décrite dans [la compatibilité EVM de Nura Chain](/blog/nura-chain-evm-compatibility). La leçon plus large, qu'un code audité peut échouer parce que ce qui l'entoure change, est la thèse de [pourquoi des contrats audités se font quand même vider](/blog/why-audited-contracts-get-drained).

L'analyse technique est celle de [ChainSecurity](https://www.chainsecurity.com/blog/glamsterdam-gas/), la proposition est l'[EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) et l'ordre du jour de l'appel est [ACDE #248](https://github.com/ethereum/pm/issues/2267). La décision et ses instructions figurent dans l'[annonce de l'Ethereum Foundation](https://blog.ethereum.org/2026/10/22/glamsterdam-hoodi-delay).
