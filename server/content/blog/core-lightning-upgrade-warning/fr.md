Core Lightning, l'une des principales implémentations du Lightning Network de Bitcoin, a demandé aux opérateurs de nœuds de passer immédiatement à la version 26.06.8, publiée le 22 septembre 2026. Le projet a indiqué avoir reçu des signalements d'attaquants visant des nœuds en version 26.06.7 ou antérieure. Il n'a pas dit quelle faille est utilisée, ni si des fonds ont été volés.

## L'essentiel

- **La consigne :** passer dès maintenant à Core Lightning v26.06.8.
- **Qui est exposé :** les nœuds en v26.06.7 ou plus ancienne.
- **Ce que la version corrige :** des bugs qui pouvaient faire planter un nœud, des requêtes qui pouvaient épuiser sa mémoire via l'interface REST, et un problème de fermeture de canal qui pouvait coûter des fonds par le mécanisme de pénalité de Lightning.
- **Ce que l'on ne sait pas :** quel bug est attaqué, et si un vol est confirmé.
- **Contexte :** en août, le projet a trié en dix jours une vague de rapports de vulnérabilité générés par IA, en a confirmé plusieurs et a publié la v26.06.7 le 28 août.

## Pourquoi un nœud Lightning est-il différent d'un portefeuille ?

Parce qu'il est en ligne, avec des clés, en permanence.

Un paiement Lightning circule par des canaux, et un canal, ce sont des bitcoins verrouillés entre deux parties qui mettent à jour hors chaîne la répartition entre elles. Pour router des paiements, un nœud doit rester connecté et doit pouvoir signer instantanément. Cela en fait un portefeuille chaud par construction : les clés qui contrôlent les fonds se trouvent sur une machine qui répond à des requêtes venues d'internet.

## Qu'est-ce que le mécanisme de pénalité ?

La défense de Lightning contre la triche, et la raison pour laquelle un logiciel ancien est dangereux.

Chaque fois que le solde d'un canal change, l'état précédent est révoqué. Si une partie diffuse plus tard un état révoqué — pour tenter de faire valoir une répartition plus ancienne et plus favorable — l'autre côté peut prendre la totalité du canal à titre de pénalité. C'est une dissuasion forte.

Elle ne pardonne pas non plus les erreurs. Un nœud qui diffuse le mauvais état à cause d'un bug ne se distingue pas d'un nœud qui triche, et il est puni de la même manière. C'est pourquoi une faille de fermeture de canal est une faille de perte de fonds.

## Pourquoi le projet n'a-t-il pas expliqué le bug ?

Parce que l'expliquer armerait l'attaquant.

Publier un correctif indique déjà à un lecteur attentif à peu près où se trouvait le problème. Publier les détails et les tests indique à tout le monde exactement comment le déclencher, alors qu'une partie des nœuds n'est pas encore corrigée. Core Lightning en a retenu une partie à dessein. Le compromis est inconfortable — on demande aux opérateurs de mettre à jour sur parole — et c'est le compromis habituel.

L'épisode d'août, c'est la nouveauté. Un déluge de rapports générés par machine est surtout du bruit, et plusieurs étaient réels. Trouver des failles est devenu bon marché. Le temps des mainteneurs, non.

## Que doit en retenir quiconque exploite une infrastructure ?

- **Abonnez-vous au canal de publication des versions** de tout ce que vous exploitez et qui détient des clés. L'avertissement ne sert à rien à qui ne le voit jamais.
- **Appliquez le correctif le jour même,** pas à la prochaine fenêtre de maintenance. Les attaques contre un correctif divulgué peuvent commencer en quelques jours.
- **Gardez le solde chaud petit.** Un nœud n'a besoin que de ce qu'il route.
- **Fermez les interfaces que vous n'utilisez pas.** L'un de ces bugs était accessible par un point de terminaison REST.

Rien de cela n'est propre à Lightning. Un nœud ou un indexeur, sur n'importe quel réseau, est un logiciel exposé à internet, et c'est dans l'intervalle entre la publication d'un correctif et son installation par un opérateur que se fait l'essentiel des dégâts — le schéma décrit dans [pourquoi des contrats audités se font quand même vider](/blog/why-audited-contracts-get-drained). Si vous ne faites que lire une chaîne, vous pouvez éviter le problème en ne faisant tourner aucun nœud : [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) utilise un point de terminaison public, ce qui ne vous laisse rien à corriger et rien à détenir.

Les notes de version et les avis de sécurité sont publiés dans le [dépôt de Core Lightning](https://github.com/ElementsProject/lightning/releases). Suivez ceux-là, pas un résumé.
