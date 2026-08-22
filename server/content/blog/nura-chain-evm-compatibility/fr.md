« Compatible EVM » figure en première page de presque toutes les chaînes lancées ces cinq dernières années, et l'expression est employée assez librement pour mériter d'être précisée. Voici ce qu'elle signifie concrètement sur Nura Chain, ce que vous pouvez vérifier vous-même, et ce qu'elle ne vous donne pas.

## Ce qu'est réellement l'EVM

La machine virtuelle Ethereum est la spécification d'une machine à pile. Elle définit un jeu d'instructions, un coût en gaz par instruction, un modèle de mémoire et de stockage, et un ensemble de contrats précompilés à des adresses fixes.

Solidity et Vyper ne compilent pas vers « Ethereum ». Ils compilent vers du bytecode EVM. C'est cette séparation, et rien d'autre, qui rend la compatibilité entre chaînes possible : un contrat est un bloc de bytecode accompagné d'une ABI décrivant comment l'appeler, et toute machine implémentant le même jeu d'instructions exécutera ce bloc de la même façon.

« Compatible EVM » est donc une affirmation sur la couche d'exécution. Elle ne dit rien du consensus, des validateurs, de la finalité ou de la gouvernance, et une chaîne peut être pleinement compatible EVM tout en différant d'Ethereum sur chacun de ces points.

## Ce que Nura Chain implémente

Le réseau répond à l'interface JSON-RPC standard d'Ethereum, et vous pouvez l'établir sans rien installer.

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}'
```

Le nœud s'identifie comme une implémentation en Go, la lignée sur laquelle tourne la majorité des réseaux EVM : go-ethereum et les clients qui en dérivent.

Un en-tête de bloc en dit plus que n'importe quelle page marketing. Demandez le dernier :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

L'en-tête renvoyé porte `baseFeePerGas`, un `difficulty` à `0x0`, un `mixHash` nul et un `withdrawalsRoot`. C'est la forme que produisent les clients Ethereum modernes après la Fusion et après le changement de marché des frais de London, et deux faits pratiques en découlent. Les frais suivent l'EIP-1559 plutôt qu'un prix du gaz fixe, et les champs de preuve de travail comme `difficulty` n'ont aucun sens ici : du code qui se ramifie selon une difficulté non nulle se comportera bizarrement, exactement comme sur Ethereum aujourd'hui.

## Les frais suivent l'EIP-1559

Les blocs portent des frais de base fixés par le protocole, et l'expéditeur ajoute par-dessus des frais de priorité. Les deux sont lisibles :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_maxPriorityFeePerGas","params":[]}'
```

À l'heure où ces lignes sont écrites, les frais de base s'établissent à 1 gwei et la limite de gaz par bloc à 150 000 000. Ce sont deux valeurs à lire à l'exécution plutôt qu'à figer dans le code : c'est précisément le rôle de `eth_feeHistory` et de l'estimation de frais des bibliothèques, et un script de déploiement au `gasPrice` figé est la cause la plus fréquente d'une transaction qui reste sans être minée.

Comme le marché des frais est le marché standard, `ethers`, `viem`, `web3.py` et tout portefeuille conçu ces dernières années construisent ici des transactions de type 2 sans configuration. Il n'y a rien de propre à Nura à leur apprendre.

## Ce que la compatibilité ne donne pas

C'est la partie généralement passée sous silence.

- Elle ne donne pas d'état partagé. Votre adresse existe sur les deux réseaux parce qu'elle dérive de la même clé, mais soldes, code des contrats et historique sont des registres distincts. Un actif envoyé à « la même adresse sur une autre chaîne » n'a pas circulé entre elles.
- Elle ne donne pas de contrats partagés. Un contrat déployé sur Ethereum n'est pas déployé ici. Vous le redéployez, et il obtient une adresse différente, sauf recours délibéré à un déployeur déterministe.
- Elle ne donne ni le modèle de sécurité d'Ethereum ni son ensemble de validateurs. Ce sont des propriétés du consensus, alors que la compatibilité EVM porte sur l'exécution.
- Elle ne garantit pas des coûts en gaz identiques pour toujours. Chaque chaîne adopte les mises à niveau de l'EVM selon son propre calendrier, si bien qu'un contrat bon marché sur l'une peut ne pas l'être sur l'autre.

L'essentiel des pertes réelles vient de ce que le premier point est tenu pour acquis, et cela seul justifie de le répéter.

## Comment vérifier tout cela vous-même

Chaque affirmation ci-dessus est à une requête de distance, et c'est bien là l'idée. Une chaîne qui répond honnêtement à `eth_chainId`, `eth_getBlockByNumber` et `web3_clientVersion` est une chaîne que vous pouvez caractériser en une minute environ, sans faire confiance à la moindre page de documentation — celle-ci comprise.

L'habitude à prendre : avant de déployer quoi que ce soit de valeur, lisez le chain ID depuis le point de terminaison que vous allez utiliser et comparez-le à celui qu'annonce la configuration de votre framework. Ils divergent plus souvent qu'on ne le croit, en général parce que la configuration a été recopiée d'un autre projet.

## Questions fréquentes

### Puis-je déployer un contrat Solidity existant sans le modifier ?

En général oui, à condition qu'il ne dépende pas d'un chain ID particulier, d'une adresse de contrat figée sur un autre réseau, ou d'un oracle qui n'existe pas ici. Ce sont là les vraies sources de friction, pas le bytecode.

### Quelle version de Solidity viser ?

Une version dont la cible EVM est prise en charge par le réseau. L'approche prudente consiste à compiler vers une cible bien établie plutôt que vers la plus récente, et à tester un déploiement sur un contrat jetable avant d'en engager un vrai.

### Les coûts en gaz sont-ils les mêmes que sur Ethereum ?

Le coût des instructions vient de la spécification de l'EVM, donc la structure est identique. Ce qui diffère, c'est le prix du gaz, fixé par le marché des frais de ce réseau et non par celui d'Ethereum.

## Pour aller plus loin

Pour commencer à émettre des appels, lisez [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc), qui couvre le point de terminaison, les bibliothèques clientes et les erreurs qu'il vaut mieux savoir reconnaître.

Si vous hésitez encore sur le fait qu'une chaîne EVM soit la bonne cible, [pourquoi les développeurs choisissent une blockchain compatible EVM](/blog/why-build-on-an-evm-compatible-chain) traite la question de front. Et pour une description générale du réseau, voyez [ce qu'est Nura Chain](/blog/what-is-nura-chain).

Quand vous serez prêt à déposer quelque chose sur la chaîne, [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) est l'étape suivante.
