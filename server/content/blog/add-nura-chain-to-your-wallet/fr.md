Les portefeuilles ne connaissent pas d'avance tous les réseaux. Avant de pouvoir détenir un solde, envoyer quoi que ce soit ou ouvrir une application sur Nura Chain, il faut indiquer à votre portefeuille que le réseau existe. Cela prend environ une minute.

## Ce que votre portefeuille va demander

Six valeurs, chaque portefeuille en demandant un sous-ensemble :

- Nom du réseau : Nura Chain
- URL RPC : `https://rpc.nurachain.net`
- Chain ID : `1020`
- Symbole de la monnaie : `NURA`
- URL de l'explorateur de blocs : `https://explorer.nurachain.net`
- Décimales : 18, que la plupart des portefeuilles remplissent seuls

Gardez cette page ouverte pendant l'opération ou, mieux, vérifiez le chain ID de manière indépendante : la section suivante explique pourquoi ces trente secondes en valent la peine.

## La voie en un clic

La plupart des portefeuilles de navigateur prennent en charge une requête standard, EIP-3085, qui permet à une page de transmettre toute la définition du réseau d'un coup. Le site Nura Chain l'utilise : le bouton « Add Nura Chain to wallet » de la page d'accueil et du pied de page envoie exactement les valeurs ci-dessus, et votre portefeuille vous les présente pour approbation.

C'est la voie à privilégier, pour une raison qui n'a rien à voir avec le confort. Saisir un chain ID à la main est l'étape où les erreurs se produisent, et une URL RPC mal orthographiée est un cran pire : elle dirige votre portefeuille vers un serveur choisi par le propriétaire de ce domaine fautif.

Quand la fenêtre de confirmation apparaît, lisez-la plutôt que de la survoler. Un portefeuille qui vous montre une définition de réseau vous montre exactement ce à quoi il s'apprête à faire confiance.

## L'ajouter à la main

Si votre portefeuille ne gère pas la requête automatique, ou si vous préférez ne pas laisser une page l'émettre, chacun dispose d'un chemin manuel. Dans MetaMask, cela ressemble à ceci :

1. Ouvrez le sélecteur de réseau en haut de l'extension.
2. Choisissez « Add a custom network » (anciennes versions : Paramètres, puis Réseaux, puis Ajouter un réseau, puis manuellement).
3. Renseignez les six valeurs ci-dessus.
4. Enregistrez, puis basculez sur le nouveau réseau.

Les autres portefeuilles emploient d'autres mots mais demandent les mêmes champs, car ces champs viennent du standard et non du portefeuille.

## Vérifiez que vous êtes bien sur Nura Chain

Ne sautez pas cette étape. Un portefeuille conservera très volontiers un réseau dont le nom dit une chose et dont le RPC pointe ailleurs, parce que le nom est une étiquette que vous avez tapée alors que le RPC est ce à quoi il parle réellement.

Le point de terminaison annonce lui-même son identité :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La réponse est `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. `0x3fc` vaut 1020 en décimal, et cela doit correspondre au chain ID affiché par votre portefeuille. En cas de désaccord, arrêtez-vous et corrigez l'entrée réseau avant d'envoyer quoi que ce soit.

Si vous préférez éviter un terminal, ouvrez [Nura Explorer](https://explorer.nurachain.net) et comparez un numéro de bloc récent à celui que rapporte votre portefeuille. L'explorateur et le portefeuille lisant la même chaîne, c'est la même vérification par un autre chemin.

## Nura Wallet

Il existe aussi un portefeuille conçu spécifiquement pour ce réseau. Nura Wallet est auto-dépositaire — les clés restent sur votre appareil — et propose des versions Android, Windows et Linux, liées depuis la page d'accueil. Le réseau y est déjà configuré, ce qui supprime toute cette procédure.

Il n'est pas obligatoire. Nura Chain est un réseau EVM ordinaire et n'importe quel portefeuille acceptant un réseau personnalisé conviendra, ce qui est précisément l'intérêt d'[être compatible EVM](/blog/nura-chain-evm-compatibility). Utilisez celui auquel vous faites déjà confiance.

## Quand quelque chose cloche

- **Le portefeuille refuse le chain ID.** Presque toujours une confusion entre les formes décimale et hexadécimale. `1020` et `0x3fc` sont le même nombre ; saisir `0x1020` ne l'est pas.
- **Les soldes s'affichent à zéro.** Vérifiez quel réseau est sélectionné. La même adresse existe sur toutes les chaînes EVM : un portefeuille pointé sur la mauvaise vous montre une adresse réelle et un solde sans rapport.
- **Une transaction ne se confirme jamais.** Généralement un prix du gaz hérité d'un autre réseau. Laissez le portefeuille estimer plutôt que d'écraser sa valeur.
- **Le symbole s'affiche autrement.** C'est cosmétique et se corrige en modifiant l'entrée réseau. Cela n'affecte pas le fonctionnement du réseau.

## Questions fréquentes

### Ajouter un réseau est-il risqué en soi ?

Ajouter un réseau ne déplace aucun fonds et n'accorde aucune permission à une application. Ce qui compte, c'est l'URL RPC visée, car c'est le serveur auquel votre portefeuille demande les soldes et par lequel il envoie les transactions. Utilisez-en une à laquelle vous avez des raisons de vous fier, et vérifiez son chain ID.

### Ai-je besoin de NURA avant d'ajouter le réseau ?

Non. L'ajout ne coûte rien. Il vous faudra un solde en NURA avant de pouvoir envoyer une transaction, puisque le gaz se paie dans la monnaie native.

### Puis-je utiliser l'adresse que j'ai déjà ?

Oui. Votre adresse dérive de votre clé : elle est identique sur tous les réseaux EVM. Les soldes et l'historique, en revanche, sont propres à chaque chaîne — voyez [ce qu'est Nura Chain](/blog/what-is-nura-chain) pour comprendre pourquoi cette distinction compte.

### Comment retirer le réseau plus tard ?

Depuis le même écran de paramètres que celui de l'ajout. Retirer un réseau n'affecte aucun solde ; cela empêche seulement ce portefeuille d'afficher la chaîne.

## Étapes suivantes

Le réseau ajouté, [Nura Explorer](https://explorer.nurachain.net) est le moyen le plus rapide de confirmer que ce que vous avez fait a bien eu lieu — [comment le lire](/blog/how-to-use-nura-chain-explorer) explique le sens des colonnes.

Si vous êtes ici pour développer plutôt que pour détenir, passez directement à [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc). Et pour savoir ce qu'est NURA et comment l'offre est répartie, voyez [offre et répartition de Nura Coin](/blog/nura-coin-tokenomics).
