Nura Chain est une blockchain publique qui exécute la machine virtuelle Ethereum (EVM). Si vous avez déjà écrit un contrat en Solidity, ajouté un réseau à MetaMask ou appelé un point de terminaison JSON-RPC Ethereum, l'essentiel de ce que vous savez déjà s'applique ici sans changement : le même modèle de comptes, le même format de transaction, les mêmes outils.

Cette page est la description simple. Ce qu'est le réseau, les valeurs nécessaires pour dialoguer avec lui, et ce qui existe réellement autour de lui aujourd'hui.

## Le réseau en un coup d'œil

Voici les valeurs qu'un portefeuille ou une bibliothèque cliente vous demandera.

- Nom du réseau : Nura Chain
- Chain ID : `1020`, que les portefeuilles réclament sous la forme hexadécimale `0x3fc`
- Point de terminaison RPC : `https://rpc.nurachain.net`
- Explorateur de blocs : `https://explorer.nurachain.net`
- Monnaie native : Nura Coin, symbole `NURA`, 18 décimales
- Temps de bloc : environ 3 secondes

N'accordez votre confiance à aucune de ces valeurs, y compris venant de cette page. Le point de terminaison annonce lui-même son chain ID si vous le lui demandez :

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La réponse est `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`, et `0x3fc` vaut 1020 en décimal. Cette vérification prend dix secondes et reste la meilleure habitude à prendre avant d'ajouter un réseau à un portefeuille. Un chain ID erroné, c'est précisément ce qui amène quelqu'un à diffuser une transaction sur un réseau qu'il n'avait pas l'intention d'utiliser.

## Ce que la compatibilité EVM signifie concrètement

La machine virtuelle Ethereum est l'environnement d'exécution qu'Ethereum a défini pour les contrats intelligents. Une chaîne qui l'exécute fait tourner le même bytecode compilé, répond aux mêmes noms de méthodes JSON-RPC et utilise le même format d'adresse sur 20 octets.

Pour qui développe, cela a trois conséquences concrètes.

- Les contrats se compilent avec la chaîne d'outils que vous avez déjà. Solidity, Hardhat et Foundry visent l'EVM et non un réseau particulier, si bien qu'une nouvelle chaîne est une ligne de configuration et non une réécriture.
- Les bibliothèques clientes fonctionnent sans modification. ethers.js, viem, web3.py et wagmi parlent tous JSON-RPC ; les pointer ailleurs tient en une ligne.
- Les clés et les adresses vous suivent. Les mêmes clés secp256k1, les mêmes chemins de dérivation, les mêmes adresses avec somme de contrôle.

Ce que cela ne signifie pas, c'est que les deux chaînes partagent quoi que ce soit. Une adresse que vous contrôlez sur Ethereum vous appartient aussi ici, puisqu'elle dérive de la même clé — mais les soldes, les contrats déployés et l'historique sont des registres entièrement distincts. Envoyer un actif vers la même adresse sur une autre chaîne ne le déplace pas de l'une à l'autre.

Les blocs portent ici des frais de base EIP-1559 : la tarification des transactions suit donc le modèle en vigueur sur Ethereum depuis London, à savoir des frais de base fixés par le protocole à chaque bloc, plus les frais de priorité que vous choisissez d'ajouter. Toute bibliothèque écrite ces dernières années le fait par défaut. Plus de détails dans [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility).

## Ce qui existe autour du réseau aujourd'hui

Trois choses sont en service et accessibles dès maintenant, et il vaut la peine de préciser lesquelles.

- Le point de terminaison RPC. `https://rpc.nurachain.net` répond au JSON-RPC Ethereum standard et renvoie des en-têtes CORS permissifs, si bien qu'une page ouverte dans un navigateur peut y lire directement. C'est le sujet de [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).
- L'explorateur de blocs. [Nura Explorer](https://explorer.nurachain.net) indexe les blocs, les transactions et les transferts. C'est là que vous confirmez que ce que vous avez envoyé a bien eu lieu, et il est décrit dans [comment lire l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer).
- Nura Wallet, un portefeuille auto-dépositaire disponible pour Android, Windows et Linux. Ce n'est pas la seule porte d'entrée : n'importe quel portefeuille EVM acceptant un réseau personnalisé fera l'affaire, ce que détaille [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet).

Il existe également un pont qui émet des représentations encapsulées de BNB et d'USDT sur Nura sous forme de contrats ERC-20 ordinaires, ainsi qu'une interface d'échange à l'adresse `https://swap.nurachain.net`.

## La monnaie native

Nura Coin, symbole `NURA`, est l'actif natif du réseau, avec 18 décimales — la convention EVM, et non un choix propre à ce réseau. Elle paie le gaz exactement comme l'ether sur Ethereum. Chaque transaction consomme du gaz, le gaz est tarifé en NURA, et un compte doit disposer d'un solde avant de pouvoir envoyer quoi que ce soit, y compris son premier déploiement de contrat.

L'offre totale s'élève à 1 000 000 000 NURA. La façon dont elle est répartie, et l'usage de chaque part, est exposée dans [offre et répartition de Nura Coin](/blog/nura-coin-tokenomics).

## Questions fréquentes

### Nura Chain est-elle un fork d'Ethereum ?

Elle exécute la même machine virtuelle et répond à la même interface RPC, ce qui permet aux outils Ethereum de fonctionner sans modification. C'est une affirmation sur la compatibilité, non sur un historique ou un état partagés. Les deux réseaux tiennent des registres séparés.

### Puis-je utiliser MetaMask ?

Oui. Tout portefeuille permettant d'ajouter un réseau EVM personnalisé peut être dirigé vers Nura Chain avec les valeurs ci-dessus, et la marche à suivre figure dans [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet).

### Ai-je besoin de NURA avant de pouvoir faire quoi que ce soit ?

Pour lire la chaîne, non. Le point de terminaison RPC répond aux appels de lecture de n'importe qui, et c'est bien pourquoi un explorateur peut vous montrer l'ensemble du réseau sans compte. Pour envoyer une transaction ou déployer un contrat, oui : le gaz se paie en NURA.

### À quelle vitesse les blocs arrivent-ils ?

Environ trois secondes d'écart, mesuré sur des blocs récents. C'est le rythme auquel la chaîne produit des blocs, ce qui n'équivaut pas à une garantie sur le moment où une transaction donnée sera incluse.

## Pour aller plus loin

Si vous êtes ici pour utiliser le réseau, commencez par [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet). Cela prend environ une minute, et tout le reste en dépend.

Si vous êtes ici pour développer, partez de [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc), puis enchaînez avec [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
