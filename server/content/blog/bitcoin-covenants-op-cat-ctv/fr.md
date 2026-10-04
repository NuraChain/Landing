La dernière mise à jour du protocole Bitcoin a été Taproot, en novembre 2021. Rien n'a été activé depuis. Les principaux candidats à la suivante sont les covenants Bitcoin — des règles qui restreignent la façon dont une pièce pourra être dépensée à l'avenir — sous deux formes concurrentes, OP_CAT et OP_CTV. Le 1er octobre 2026, Adam Back, directeur général de Blockstream, a apporté son soutien aux opcodes de covenant comme possible « dernier soft fork ». Les propositions sont mûres. C'est le processus pour en adopter une qui est bloqué.

## L'essentiel

- **Dernier soft fork :** Taproot, novembre 2021.
- **OP_CAT (BIP 347) :** joint deux éléments de données dans un script. Sa spécification a été marquée comme complète en mars 2026 et il a été testé sur signet.
- **OP_CTV (BIP 119) :** engage une pièce sur un modèle de dépense prédéfini.
- **Aucun des deux n'est actif** sur le réseau principal de Bitcoin.
- **Un échec récent :** BIP 110, une proposition visant à limiter pendant un an les données arbitraires dans les transactions, a recueilli environ 2,5 % de soutien des mineurs contre les 55 % nécessaires, et la branche qui l'appliquait s'est arrêtée après deux blocs en août 2026.

## Qu'est-ce qu'un covenant ?

Une condition qui voyage avec la pièce.

Aujourd'hui, un script Bitcoin décide qui peut dépenser une pièce. Il ne peut rien dire de l'endroit où la pièce ira ensuite. Un covenant le peut : « cette pièce ne peut être envoyée qu'à l'une de ces adresses », ou « cette pièce ne peut être déplacée qu'après un délai, et pendant ce délai le propriétaire peut annuler ».

Ce second exemple est un coffre-fort. Si un voleur prend votre clé, le retrait est annoncé en chaîne et attend ; vous le voyez et vous récupérez les fonds avec une clé de récupération. C'est l'usage des covenants le plus cité parce qu'il répond au vol, qui est ce que les détenteurs de bitcoins craignent réellement.

## En quoi OP_CAT et CTV diffèrent-ils ?

Par l'étendue de ce qu'ils permettent.

- **CTV est étroit.** Il fixe, à l'avance, la forme exacte de la transaction qui peut dépenser une pièce. Il est facile à analyser et limité à ce qui a été prévu.
- **OP_CAT est général.** Concaténer des données paraît trivial, mais combiné aux opcodes existants, cela permet à un script d'inspecter la transaction qui le dépense, et à partir de là on peut construire beaucoup de choses.

Le débat entre les deux est le vieux débat sur les outils. Un outil étroit est plus sûr à approuver et devra peut-être être remplacé. Un outil général est peut-être le dernier changement nécessaire, et il est plus difficile à borner. Back plaide pour le second : « construire une boîte à outils générale une seule fois, la vérifier rigoureusement, et laisser l'innovation future se faire par-dessus ».

## Pourquoi rien ne s'active-t-il ?

Parce que Bitcoin n'a pas de procédure de décision, et c'est voulu.

Il n'y a pas de fondation qui programme les forks, ni de vote qui engage qui que ce soit. Un soft fork a besoin que des développeurs l'intègrent, que des mineurs le signalent et que des opérateurs de nœuds l'exécutent, et chacun de ces groupes peut tout simplement ne pas le faire. Depuis Taproot, il n'y a même pas eu d'accord sur la façon dont une mise à jour devrait être activée.

BIP 110 a montré ce qui arrive quand une proposition avance sans cet accord. Elle n'a pas changé Bitcoin. Elle a produit une branche qui, deux blocs plus tard, n'était plus celle de personne.

Que ce soit un défaut dépend de ce que vous voulez. Un réseau presque impossible à changer est aussi presque impossible à changer en pire.

## En quoi est-ce différent sur une chaîne EVM ?

Tout ce que fait un covenant y est ordinaire. Un contrat peut détenir des fonds et imposer n'importe quelle règle sur leur destination : verrous temporels, listes d'autorisation, coffres-forts, limites de dépenses. Rien n'exige de changer le protocole, parce que les règles vivent dans le contrat et non dans le consensus de la chaîne — [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) montre combien cela demande peu de cérémonie, et [EIP-7702 et les comptes intelligents](/blog/eip-7702-smart-accounts) traite de la version portefeuille de la même idée.

Le coût en est l'image inversée. Des contrats plus expressifs, ce sont plus de façons de se tromper, et les mises à jour d'une chaîne EVM sont décidées par un groupe plus restreint que celles de Bitcoin. La prudence de Bitcoin et la souplesse de l'EVM sont le même compromis, fait dans des sens opposés.

Les textes des propositions se trouvent dans le [dépôt des BIP de Bitcoin](https://github.com/bitcoin/bips) ; le statut qui y figure fait autorité, et les commentaires, celui-ci compris, non.
