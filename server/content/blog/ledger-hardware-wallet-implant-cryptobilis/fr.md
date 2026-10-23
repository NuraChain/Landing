Ledger indique que certains portefeuilles matériels vendus par CryptoBilis, un revendeur agréé de Ledger basé en Malaisie et actif dans toute l'Asie du Sud-Est, contenaient un implant matériel non autorisé qui copiait la phrase de récupération de 24 mots du propriétaire pendant la configuration et l'envoyait par un réseau mobile. Ledger a ouvert une enquête le 9 octobre 2026, après des signalements de portefeuilles d'acheteurs vidés, et a confirmé l'implant dans un appareil touché le 10 octobre. Ledger n'a publié aucun montant de pertes ; les outils de suivi on-chain l'estiment entre plus de 86 millions de dollars et 103,4 millions de dollars.

## L'essentiel

- **Quoi :** un implant à l'intérieur du boîtier de l'appareil, que Ledger décrit comme une attaque physique de la chaîne d'approvisionnement, et non une faille de ses logiciels ou de ses systèmes.
- **Où :** chaque perte confirmée concerne un signataire vendu par CryptoBilis, a précisé Ledger dans une mise à jour ultérieure ; ses propres systèmes et ses ventes directes n'ont pas été touchés.
- **Quand :** enquête ouverte le 9 octobre 2026 ; implant confirmé le 10 octobre ; l'équipe de sécurité de Ledger, Donjon, a décrit son fonctionnement le 13 octobre.
- **Combien :** Bitquery a compté 93,2 millions de dollars retirés de 315 portefeuilles sur six blockchains, aux prix du 9 octobre, selon ForkLog le 12 octobre. Ledger indique que ces chiffres viennent de tiers et qu'elle ne les a pas entièrement vérifiés.
- **Gelé :** Tether a gelé environ 10 millions de dollars en USDT liés au vol, selon CoinDesk le 13 octobre.
- **Le revendeur :** CryptoBilis a cessé de vendre toutes les marques de portefeuilles matériels pendant l'enquête.

## Que faisait l'implant ?

Il lisait la phrase de récupération sur l'écran.

Un portefeuille matériel génère la phrase dans sa puce sécurisée et l'affiche une seule fois, sur son propre écran, pour que le propriétaire la note. Selon la mise à jour de Ledger du 13 octobre, le microcontrôleur de l'implant lisait et décodait ces 24 mots au moment où ils s'affichaient pendant la configuration, puis les transmettait en LTE au moyen d'une carte SIM intégrée. Avec la phrase, l'attaquant peut reconstituer le portefeuille n'importe où et sortir les fonds sans retoucher l'appareil.

Ledger indique que l'implant n'a modifié ni le Secure Element ni le système d'exploitation de l'appareil, et n'a altéré ni les transactions ni les signatures.

## Pourquoi la sécurité de l'appareil ne l'a-t-elle pas arrêté ?

Parce que rien de ce qu'elle vérifie n'avait changé.

La puce sécurisée a fait son travail : elle a gardé les clés scellées. La fuite s'est produite entre la puce et les yeux du propriétaire, au seul moment où le secret s'affiche en clair. Selon BleepingComputer, qui cite un article d'assistance de Ledger, le Genuine Check de Ledger ne peut pas détecter du matériel ajouté lorsque le Secure Element d'origine est intact. Un appareil peut réussir tous les contrôles logiciels et transporter quand même un passager.

C'est la même leçon que [pourquoi des contrats audités se font quand même vider](/blog/why-audited-contracts-get-drained) : le composant solide tient, et l'argent part par ce qui l'entoure.

## Combien a été volé ?

Aucune source officielle ne l'a dit, et les outils de suivi ne s'accordent pas.

La première estimation est venue de l'enquêteur Specter, qui a chiffré les pertes à plus de 86 millions de dollars le 9 octobre. Bitquery a compté 93,2 millions de dollars sur 315 portefeuilles aux prix du 9 octobre, sans les swaps ni les transferts entre portefeuilles de l'attaquant lui-même ; au 12 octobre, son décompte atteignait 102,0 millions de dollars sur 324 portefeuilles, selon Genfinity le 13 octobre. YFarmX a chiffré le total à 103,4 millions de dollars sur 530 portefeuilles, selon ForkLog le 12 octobre, sans décrire sa méthode. Les outils de suivi ne comptent pas la même chose, si bien que le chiffre va continuer de bouger.

## Est-ce seulement CryptoBilis ?

C'est ce que Ledger a confirmé jusqu'ici, et elle examine d'autres signalements.

Le 13 octobre, Ledger a indiqué que le distributeur MediaMarkt Saturn avait cessé de vendre des appareils Ledger après qu'un client en Allemagne a signalé un implant ; aucune perte de fonds n'a été signalée dans ce cas. Mark Karpelès, ancien dirigeant de Mt. Gox, a déclaré qu'un Ledger Flex acheté à l'aéroport de Singapour en contenait un ; Ledger ne l'a pas relié à cet incident. Trezor a dit n'avoir aucun signalement d'appareils Trezor trafiqués, mais a retiré CryptoBilis de ses revendeurs, et OneKey a révoqué son autorisation et proposé des remplacements gratuits.

## Que faire si vous possédez un portefeuille matériel ?

Les conseils de Ledger elle-même, plus la règle qui les sous-tend.

- **Acheté chez CryptoBilis et pas encore configuré ?** Ne l'initialisez pas.
- **Déjà en service ?** Transférez vos actifs vers un nouvel appareil avec une phrase de récupération nouvellement générée.
- **Vous avez perdu des fonds ?** Contactez l'assistance de Ledger, déposez plainte auprès de la police et coordonnez-vous avec les forces de l'ordre avant d'ouvrir l'appareil.
- **Vous en achetez un nouveau ?** Achetez directement auprès du fabricant quand vous le pouvez — CryptoBilis était un revendeur agréé, et cela ne l'a pas empêché — et méfiez-vous d'un prix nettement inférieur à l'habitude.
- **Ne réutilisez jamais une phrase** qu'un appareil suspect vous a affichée. Un nouvel appareil avec une ancienne phrase reste compromis.

## Qu'est-ce que cela signifie pour l'auto-conservation ?

L'auto-conservation déplace le risque d'une entreprise vers vous, et une partie de ce risque est l'appareil qui vous montre le secret.

Nura Wallet est auto-dépositaire — les clés restent sur votre appareil — et la même règle s'y applique qu'à tout portefeuille : une phrase de récupération n'est jamais plus privée que l'appareil qui l'a affichée en premier. Si vous détenez des actifs sur Nura Chain, n'importe quel portefeuille EVM peut rejoindre le réseau en suivant [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet).

L'enquête se poursuit et les chiffres changeront. La source primaire est [la mise à jour de Ledger Donjon du 13 octobre](https://x.com/Ledger/status/2109896739985453358).
