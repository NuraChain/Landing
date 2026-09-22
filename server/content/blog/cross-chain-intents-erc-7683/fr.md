Il existe aujourd'hui plus de quatre-vingts chaînes compatibles EVM à l'activité réelle, sans compter plusieurs écosystèmes non EVM avec leurs propres utilisateurs. Déplacer de la valeur entre elles supposait de choisir un pont, d'en comprendre le modèle de confiance et d'espérer. En 2026, le schéma dominant est autre : vous signez ce que vous voulez, et quelqu'un d'autre s'occupe du comment.

## Ce qu'est un intent

Un intent est une déclaration signée portant sur un résultat. Non pas « appelle ce contrat sur ce pont avec ces paramètres », mais « j'ai 100 USDC ici, je veux au moins 99,4 USDC là-bas, avant cette échéance ».

Cet ordre part vers un réseau de solveurs qui se font concurrence pour l'exécuter. Un solveur qui détient déjà de l'USDC sur la chaîne de destination vous paie tout simplement là-bas, puis réclame vos fonds sur la chaîne d'origine. Rien de ce qui est à vous ne traverse quoi que ce soit. Ce qui a traversé, c'est l'inventaire du solveur, des jours plus tôt, au moment qu'il a choisi.

**ERC-7683**, rédigé par Uniswap Labs et Across Labs, est le standard qui a rendu cela portable : un format de données unique pour les ordres d'intent inter-chaînes, de sorte que tout protocole qui en émet puisse être servi par tout réseau de solveurs compatible. C'est le format le plus adopté du genre.

## Pourquoi c'est devenu la norme

Parce que le mode de défaillance de l'ancien modèle était le pire possible. Un pont à verrouillage et frappe conserve un grand réservoir statique d'actifs et publie son adresse, ce qui constitue une invitation permanente. Des années d'incidents sont sorties exactement de cette forme.

Le modèle des intents n'a pas de pot de miel permanent. Il se trouve en outre qu'il est plus rapide et qu'il cote un prix avant que vous ne vous engagiez, ce que l'utilisateur remarque réellement. Les paiements en stablecoins constituent l'usage inter-chaînes au plus gros volume en 2026, et NEAR Intents à lui seul a traité environ 5 milliards de dollars de volume sur 25 chaînes ou plus.

## À quoi vous faites confiance à la place

Pas à rien. Le risque s'est déplacé, il n'a pas disparu.

- **Le contrat de séquestre.** Vos fonds y restent jusqu'à ce que l'exécution soit prouvée. Ce contrat vaut ce que vaut son code.
- **La preuve d'exécution.** Comment la chaîne d'origine apprend que la destination a été payée. Parfois un oracle, parfois une fenêtre optimiste avec période de contestation, parfois un client léger. C'est là la véritable hypothèse de confiance, et elle diffère selon le protocole.
- **La concurrence entre solveurs.** La qualité du prix dépend du nombre de solveurs qui veulent votre ordre. Un marché mince cote mince.
- **L'échéance.** Si personne n'exécute, vos fonds reviennent à l'expiration — autrement dit, « non exécuté » est un délai et non une perte, pourvu que le séquestre se comporte correctement.

## Ce que cela signifie pour une chaîne comme celle-ci

Les intents expliquent qu'un nouveau réseau EVM ne soit plus isolé par défaut. Les solveurs gardent de l'inventaire là où il y a de la demande, et l'exigence technique envers une chaîne est la plus banale : un JSON-RPC standard, des blocs rapides, des transactions bon marché et un état lisible. [Se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) décrit cette interface, et [ce qu'est Nura Chain](/blog/what-is-nura-chain) couvre les autres valeurs dont un solveur ou un portefeuille aurait besoin.

Le résumé honnête : les intents n'ont pas supprimé le problème du pont, ils ont remplacé un réservoir statique d'actifs verrouillés par un marché de gens qui déplacent les leurs. C'est une meilleure forme, et cela reste une forme avec des hypothèses dedans.
