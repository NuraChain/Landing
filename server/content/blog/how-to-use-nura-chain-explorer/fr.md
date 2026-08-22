Un explorateur de blocs, c'est la façon de vérifier que ce que vous avez fait a réellement eu lieu. Pas ce qu'affirme un portefeuille, ni ce qu'a affiché un script : ce que la chaîne a enregistré. Cet article couvre la lecture de [Nura Explorer](https://explorer.nurachain.net) et l'habitude qui compte le plus : ne pas lui faire aveuglément confiance non plus.

## Ce qu'est réellement un explorateur

C'est un lecteur, pas une autorité. Un explorateur fait tourner un nœud, observe chaque bloc et range ce qu'il voit dans une base qu'il sait interroger — blocs, transactions et transferts, indexés pour qu'un humain puisse chercher par hash ou par adresse.

Cette distinction compte. L'explorateur ne décide rien. S'il diverge de la chaîne, c'est la chaîne qui a raison et l'explorateur qui est en retard ou cassé. Tout ce qu'il vous montre est disponible directement depuis le point de terminaison RPC, ce dont traite la dernière section.

## Trouver une transaction

Chaque transaction possède un hash : une chaîne de 66 caractères commençant par `0x`. Votre portefeuille l'affiche après l'envoi, un script de déploiement l'imprime. Collez-le dans la recherche de l'explorateur.

Si rien ne revient, il existe trois explications ordinaires avant de supposer une perte :

- La transaction est encore en attente et n'a pas été incluse dans un bloc.
- L'explorateur n'a pas encore indexé le bloc qui la contient.
- Elle a été diffusée sur un autre réseau. C'est de loin le cas le plus fréquent, et c'est pourquoi les vérifications de chain ID comptent.

## Lire une transaction

Les champs à comprendre :

- **Statut.** Succès ou échec. Une transaction en échec a quand même eu lieu, occupe quand même une place dans un bloc et a quand même coûté du gaz. « Échec » ne veut pas dire « n'a pas eu lieu » : cela veut dire que le code a été annulé après que les frais ont été dépensés.
- **Bloc.** Quel bloc l'a incluse, et combien de blocs ont été construits par-dessus depuis. Plus il y a de blocs au-dessus, plus c'est établi.
- **De / Vers.** L'expéditeur, puis soit un destinataire, soit un contrat. Lors d'un déploiement, `Vers` est vide et le contrat créé apparaît séparément.
- **Valeur.** Combien de NURA a circulé en tant qu'actif natif. Un transfert de jeton affiche généralement `0` ici, parce que les jetons ont bougé à l'intérieur du contrat et non comme valeur native. Cela surprend constamment.
- **Gaz consommé et frais.** Ce que cela a réellement coûté, en général moins que la limite fixée.
- **Nonce.** Le compteur de transactions de l'expéditeur. Les trous dans ce compteur expliquent qu'une transaction bloquée retienne tout ce qui suit depuis le même compte.

## Lire une adresse

Il en existe deux sortes, et l'explorateur les distingue.

Un compte détenu en externe est contrôlé par une clé privée. Il a un solde et un historique de transactions, rien de plus.

Une adresse de contrat porte du code. Si vous avez déployé quelque chose et que l'explorateur n'affiche aucun code, le déploiement n'a pas abouti, quoi qu'ait rapporté votre script — voyez [déployer un contrat intelligent](/blog/deploy-a-smart-contract-on-nura-chain).

Pour un contrat de jeton, la partie intéressante est l'historique des transferts, car il s'agit du journal de l'événement `Transfer` et non d'une table de soldes. Ce sont les mêmes données que tout portefeuille utilise pour vous montrer un solde de jeton.

## Lire un bloc

La page d'un bloc affiche la hauteur, l'horodatage, les transactions incluses, le gaz consommé par rapport à la limite, et les frais de base à cet instant.

Sur Nura Chain, les blocs arrivent environ toutes les trois secondes. Un gaz consommé nettement sous la limite signifie qu'il reste de la place : une transaction qui n'est pas incluse est écartée par le prix et non par l'encombrement, ce qui désigne les frais plutôt que le trafic.

## Recouper avec le RPC

Voici la section à retenir. Tout chiffre affiché par l'explorateur peut être demandé directement à la chaîne :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xYourTxHash"]}'
```

Le reçu porte `status` — `0x1` pour un succès, `0x0` pour une annulation — plus le numéro de bloc, le gaz consommé et les journaux d'événements. C'est la réponse qui fait foi.

De même pour un contrat :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xTheContract","latest"]}'
```

Si l'explorateur et le point de terminaison venaient à diverger, croyez le point de terminaison. Plus utile encore : au moment d'agir sur quelque chose de précieux, vérifiez les deux. Deux lecteurs indépendants qui concordent constituent un signal bien plus fort qu'une interface sûre d'elle. La mécanique se trouve dans [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).

## Ce qu'un explorateur ne peut pas vous dire

- **Si un contrat est sûr.** Il montre du code et un historique, pas une intention. Un contrat vérifié est un contrat lisible, pas un contrat audité.
- **Si un jeton est légitime.** N'importe qui peut déployer un contrat portant n'importe quel nom. L'identité, c'est l'adresse.
- **À qui appartient une adresse.** Les adresses sont pseudonymes. Les étiquettes, là où elles apparaissent, sont ajoutées par l'opérateur de l'explorateur : ce sont des affirmations, pas des faits.
- **Pourquoi quelque chose a échoué.** Il montre qu'une transaction a été annulée ; la raison réside dans la logique du contrat lui-même.

## Questions fréquentes

### Ma transaction n'apparaît pas. Est-elle perdue ?

Probablement pas. Vérifiez le hash auprès du RPC avec `eth_getTransactionReceipt`. Un résultat nul signifie qu'elle n'a pas encore été minée : en attente, pas disparue. Si elle ne se confirme jamais, les frais en sont la cause habituelle.

### L'explorateur montre un transfert de jeton mais ma valeur est zéro. Pourquoi ?

Parce que les mouvements de jetons sont des changements d'état de contrat et non des transferts natifs. Le champ `Valeur` ne suit que le NURA. Regardez plutôt la section des transferts de jetons de la même transaction.

### Puis-je faire confiance à un contrat parce qu'il est vérifié ?

La vérification signifie que les sources publiées compilent vers le bytecode déployé. Elle vous dit ce qu'est le code ; elle ne dit rien sur sa qualité ni sur l'honnêteté de son auteur.

### Pourquoi l'explorateur affiche-t-il un solde différent de mon portefeuille ?

En général l'un des deux se trouve sur un autre réseau, ou l'un est périmé. Interrogez le RPC avec `eth_getBalance` et tranchez.

## Pour aller plus loin

Si vous n'avez pas encore dirigé un portefeuille vers ce réseau, [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet) est le point de départ, et l'explorateur est ce qui vous confirme que cela a fonctionné.

Si vous déployez, [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) et [créer un ERC-20](/blog/create-an-erc-20-token-on-nura-chain) se terminent tous deux sur cette page : un déploiement n'est pas fini tant que l'explorateur et le RPC ne s'accordent pas à dire qu'il l'est.
