Le 7 septembre 2026, l'Ethereum Foundation a fixé une échéance : d'ici décembre 2029, les transactions, les validateurs et le stockage des données d'Ethereum devraient tous résister à l'attaque d'un ordinateur quantique. Dix jours plus tard, une feuille de route post-quantique pour Bitcoin circulait avec la même année cible. Pour les blockchains, la cryptographie post-quantique a cessé d'être un sujet de recherche et elle est devenue un calendrier.

## L'essentiel

- **Ethereum :** l'objectif de la Fondation est décembre 2029, avec une réévaluation par des experts extérieurs prévue pour janvier 2027.
- **Bitcoin :** une feuille de route de développeurs retient la même date, autour de BIP 360, qui ajoute des façons de dépenser résistantes au quantique.
- **L'exposition :** environ 6,9 millions de BTC, soit à peu près un tiers de l'offre, se trouvent dans des adresses dont la clé publique est déjà visible, selon une estimation issue de la recherche.
- **Pas seulement la crypto :** Google, Cloudflare et Microsoft ont des objectifs de migration dans la même fenêtre.

## Que casserait réellement un ordinateur quantique ?

Les signatures, pas les blockchains.

Chaque compte sur Bitcoin, sur Ethereum et sur toute chaîne EVM est contrôlé par une paire de clés sur courbe elliptique. Déduire la clé privée de la clé publique est irréalisable pour des ordinateurs ordinaires et, en principe, à la portée d'un ordinateur quantique assez grand. Le hachage est bien moins touché, et c'est pourquoi les blocs, les adresses et la preuve de travail ne sont pas la partie urgente.

Cela explique aussi le chiffre de l'exposition. Une adresse qui n'a jamais dépensé ne révèle qu'un hachage de sa clé publique. Une adresse qui a dépensé, ou qui utilise un format publiant directement la clé, a montré la clé elle-même — et c'est ce dont un attaquant aurait besoin.

## Pourquoi 2029, si aucune machine de ce genre n'existe ?

Parce que la migration prendra plus de temps que le préavis n'en laissera.

Personne ne peut dire quand existera un ordinateur quantique capable de cela. La Fondation présente elle-même les choses ainsi : les prévisions crédibles commencent vers 2030, et certains chercheurs doutent qu'il arrive un jour. Mais remplacer le schéma de signature d'un réseau en service suppose de nouveaux portefeuilles, du nouveau matériel, une nouvelle infrastructure pour les plateformes d'échange, puis d'attendre que des millions d'utilisateurs déplacent leurs fonds. Ce sont des années de travail, et ce travail doit être terminé avant que la menace soit réelle, et non commencer à ce moment-là.

## Pourquoi est-ce difficile ?

Les signatures post-quantiques sont plus volumineuses et plus lentes à vérifier que celles utilisées aujourd'hui, et une blockchain conserve chaque signature pour toujours. Ethereum travaille avec des schémas fondés sur le hachage ; la Fondation décrit Hegotá, un fork prévu pour 2027, comme n'étant « pas le fork PQ » mais « le fork qui décide si les forks PQ arrivent à l'heure ».

Bitcoin a un second problème, qui est politique. Les pièces situées dans des adresses exposées, et dont les propriétaires ne migrent jamais, restent volables. Les geler ou les laisser en l'état est une question de propriété, pas de cryptographie, et elle n'a pas de réponse qui fasse consensus.

## Que devez-vous faire aujourd'hui ?

Rien de spectaculaire, et deux choses dont il vaut la peine de faire une habitude.

- **Ne réutilisez pas vos adresses** lorsque le système vous permet de l'éviter. Une adresse qui n'a pas dépensé n'a pas montré sa clé.
- **Gardez le logiciel de votre portefeuille à jour.** La migration arrivera sous forme de mises à jour de portefeuille, et les personnes exposées seront celles qui ne les auront jamais installées.

Sur les chaînes EVM, le chemin passera probablement par des comptes programmables, où la règle qui autorise une transaction est du code plutôt qu'une courbe fixe — la direction qu'indique déjà [EIP-7702 et les comptes intelligents](/blog/eip-7702-smart-accounts). Nura Chain utilise le même modèle de compte que tous les réseaux EVM : elle fait donc face à la même question et héritera du même outillage. Elle n'a annoncé aucun calendrier propre, et cette page n'en invente pas.

Les échéances citées ici sont des objectifs, pas des garanties. Le [blog de l'Ethereum Foundation](https://blog.ethereum.org) et le [projet post-quantique du NIST](https://csrc.nist.gov/projects/post-quantum-cryptography) sont les sources à suivre.
