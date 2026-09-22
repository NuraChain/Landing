Deux chiffres de 2026 sont cités l'un contre l'autre comme si l'un réfutait l'autre.

Le premier : les protocoles ayant mené un audit de sécurité indépendant concentrent environ 88 % de tous les fonds volés depuis janvier 2025 — 147 des 245 plateformes compromises avaient reçu le feu vert d'un auditeur avant l'arrivée de l'attaquant. Le second : environ 11 % seulement des incidents impliquaient une faille de contrat intelligent dans le périmètre audité, même si celles-ci ont coûté quelque 396 millions de dollars.

Les deux sont vrais, et ensemble ils disent quelque chose de précis : les audits font leur travail sur ce qu'ils auditent. L'argent sort par tout le reste.

## Par où il sort réellement

Les compromissions de chaîne d'approvisionnement et d'infrastructure ont emporté plus de 1,8 milliard de dollars sur la même période — la plus grosse catégorie à elle seule. Cela veut dire un pipeline de build compromis, une clé de déploiement volée, une dépendance malveillante, un front end qui sert un code différent de celui du dépôt, un employé hameçonné jusqu'à approuver quelque chose.

Rien de tout cela n'est un bug de contrat. Tout cela vide un contrat.

Les totaux s'améliorent d'ailleurs : les attaquants ont mené 207 intrusions distinctes au premier semestre 2026 mais emporté 972 millions de dollars, moins de la moitié des 2,3 milliards du premier semestre 2025. Plus d'incidents, moins d'argent. Les défenses fonctionnent au niveau du protocole et les attaquants se sont déplacés.

## Ce qu'un audit promet vraiment

Un audit est la revue d'un code donné, à un commit donné, face à un modèle de menace donné. Il est réellement utile et réellement étroit.

Il ne couvre pas la clé qui déploie le contrat, la CI qui le compile, le paquet npm qu'il importe, le domaine qui sert l'interface, le signataire du multisig qui approuve une mise à jour, ni l'oracle auquel il fait confiance pour un prix. Chacun de ces éléments est hors périmètre, et plusieurs sont plus faciles à attaquer que le code.

## Les contrôles ennuyeux qui tiennent vraiment

- **Traitez la clé de déploiement comme la trésorerie.** Matériel dédié, multisig, et un seuil qui survit à la perte d'une personne.
- **Épinglez vos dépendances.** Lockfiles, empreintes d'intégrité, et une décision délibérée à chaque mise à jour.
- **Rendez le front end vérifiable.** Un build qu'un tiers peut reproduire depuis la source taguée, et un moyen de remarquer que le bundle servi ne correspond plus.
- **Répétez le chemin de mise à jour.** Qui peut mettre en pause, qui peut mettre à jour, combien de temps cela prend, et ce qui se passe si deux d'entre eux sont injoignables.
- **Auditez le diff, pas la version.** L'artefact audité est un commit. Tout ce qui suit est par définition non relu.

## Lire un contrat vous-même

Rien de tout cela n'exige de faire confiance à un résumé. Sur une chaîne EVM, le bytecode déployé, la source vérifiée et chaque transaction qui s'y rapporte sont publics — c'est exactement à quoi sert un explorateur : [comment lire l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer) indique où regarder, et [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) traite de la vérification de l'autre côté.

L'habitude à prendre : avant d'approuver quoi que ce soit, vérifiez que l'adresse que vous approuvez est celle que le projet publie, et qu'elle est vérifiée. Cela prend une minute et cela attrape l'attaque qu'aucun audit n'allait jamais attraper.

Les chiffres proviennent de données d'incidents de tiers couvrant janvier 2025 à mi-2026 ; les méthodologies diffèrent d'un rapport à l'autre.
