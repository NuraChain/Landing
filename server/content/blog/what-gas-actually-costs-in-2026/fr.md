Toute affirmation selon laquelle une chaîne est bon marché cite un chiffre. Des frais sont faits de trois, et les deux manquants sont souvent là où l'affirmation habite.

```
frais en devise = unités de gaz x prix du gaz x prix de la monnaie native
```

Les unités de gaz sont fixées par ce que fait la transaction. Le prix du gaz est fixé par le marché de l'espace de bloc. Le prix de la monnaie est fixé par tout le reste. Une chaîne au prix du gaz minuscule et à la monnaie chère n'est pas bon marché ; une chaîne au prix du gaz élevé et à la monnaie sans valeur n'est pas chère.

## Les trois chiffres, séparément

**Les unités de gaz** sont déterministes. Un transfert simple, c'est 21 000. Un transfert ERC-20 tourne généralement entre 45 000 et 65 000 selon que l'emplacement de solde du destinataire est déjà non nul. Un déploiement de contrat va de milliers à millions selon la taille du bytecode. Ce sont des propriétés de l'EVM, identiques sur toute chaîne EVM.

**Le prix du gaz**, c'est le marché. Depuis EIP-1559 il se divise en des frais de base que le protocole fixe par bloc et brûle, et des frais de priorité que vous ajoutez pour être inclus plus tôt. Sur le réseau principal d'Ethereum, en 2026, les frais de base ont passé de longues périodes autour de 0,15 gwei, ce qui met un transfert basique sous le centime. C'est un autre monde qu'en 2021, et c'est le résultat direct du déplacement de la demande vers les rollups et de l'existence d'un espace de blobs pour leurs données.

**Le prix de la monnaie** est la partie que personne ne contrôle et que tout le monde oublie. C'est aussi pourquoi des frais annoncés en gwei ne vous disent rien tant que vous n'avez pas multiplié.

## Estimez vous-même

Deux appels JSON-RPC tarifent n'importe quelle transaction sur n'importe quel réseau EVM. Aucun tableau de bord requis.

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

Le résultat est une chaîne hexadécimale en wei. Divisez par 10^9 pour des gwei, multipliez par vos unités de gaz, divisez par 10^18 pour un chiffre en monnaies entières. `eth_estimateGas` fait la première moitié de la multiplication si vous lui passez un objet de transaction.

Le faire une fois, contre la chaîne elle-même, vaut mieux que n'importe quel tableau comparatif — y compris cet article.

## Pourquoi la limite de gaz agit sur le prix

Le prix du gaz est une enchère pour de la place dans un bloc. Augmentez la place et, toutes choses égales, le prix d'équilibre baisse. C'est exactement pourquoi la hausse à venir de la limite de gaz par bloc d'Ethereum — d'environ 60 millions vers quelque chose de proche de 200 millions, rendue possible par les changements de [la mise à jour Glamsterdam](/blog/ethereum-glamsterdam-upgrade) — est autant une histoire de frais que de débit.

## Sur Nura Chain

Le gaz se paie en NURA, les blocs tombent environ toutes les trois secondes, et les transactions portent des frais de base EIP-1559 : l'arithmétique ci-dessus s'applique sans changement. Les valeurs dont vous avez besoin figurent dans [ce qu'est Nura Chain](/blog/what-is-nura-chain), et [se connecter au RPC](/blog/connect-to-nura-chain-rpc) couvre le point d'accès auquel le curl ci-dessus s'adresse.

Une habitude utile : estimez avant d'envoyer, pas après. Les unités de gaz sont connaissables à l'avance, et la transaction qui vous surprend est presque toujours celle qui a touché plus de stockage que prévu.
