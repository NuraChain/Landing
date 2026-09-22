Pendant dix ans, un compte Ethereum était l'un ou l'autre. Soit un compte détenu en externe, contrôlé par une clé privée et incapable d'exécuter la moindre logique, soit un contrat, plein de logique et contrôlé par aucune clé. EIP-7702, arrivée avec la mise à jour Pectra en mai 2025, a mis fin au choix : un compte ordinaire peut désormais déléguer à du code de contrat pendant que la clé en garde le contrôle.

L'adoption a été plus rapide que celle de la plupart des standards. MetaMask, Rabby et Trust l'ont intégrée au fil de 2025 et 2026, et les estimations du secteur chiffrent aujourd'hui les portefeuilles intelligents de l'écosystème en centaines de millions.

## Ce qu'est réellement la délégation

Une transaction 7702 porte une liste d'autorisations. Vous signez un tuple qui dit : « les appels vers mon adresse doivent exécuter le code situé à cette adresse de contrat ». À partir de là, votre compte se comporte comme ce contrat, tandis que la clé privée en reste propriétaire — et peut révoquer la délégation plus tard en en signant une autre.

L'adresse ne change pas. C'est tout l'intérêt, et c'est précisément ce que l'approche précédente ne savait pas offrir.

## Ce que cela vous apporte

- **Une signature au lieu de trois.** L'approbation et l'échange deviennent un seul appel groupé, si bien que l'approbation qui traînait sans être consommée n'existe plus.
- **Quelqu'un d'autre peut payer le gaz.** Un paymaster prend les frais en charge, ou les prélève dans un jeton que vous détenez déjà plutôt que dans la monnaie native.
- **Des clés limitées.** Une clé de session qui ne fait qu'une chose, pendant une journée, jusqu'à un montant.
- **La récupération.** Récupération sociale ou par gardiens, greffée sur l'adresse que vous utilisez déjà.

## Où se situe ERC-4337

ERC-4337 a construit l'abstraction de comptes hors du protocole : une mempool distincte d'opérations utilisateur, des bundlers, un contrat point d'entrée. Cela fonctionne, et c'est la bonne réponse pour un compte qui n'existe pas encore. Mais cela ne pouvait rien pour l'adresse dont vous vous servez depuis cinq ans, parce que cette adresse était une EOA et ne pouvait devenir autre chose.

Les deux se partagent désormais le travail : ERC-4337 pour les comptes neufs, 7702 pour ceux déjà en usage.

## La partie à regarder de près

Une délégation est un blanc-seing donné au code qui réside à cette adresse. Si le contrat est malveillant, ou peut être mis à jour vers quelque chose de malveillant, le compte n'est pas partiellement en danger : il est perdu.

- Lisez ce que vous signez. Une autorisation peut être présentée de façon à ressembler à la signature d'un message ordinaire.
- Déléguez à des implémentations que votre propre portefeuille distribue et audite, pas à une adresse qu'un site vous tend.
- Sachez révoquer. Signer une délégation vers l'adresse zéro l'efface.

## Est-ce actif sur la chaîne que vous utilisez ?

Pas automatiquement. Chaque réseau EVM décide des EIP qu'il adopte et du moment, donc savoir si 7702 est actif sur une chaîne donnée est une question à poser à la chaîne, pas une hypothèse. Les comptes ordinaires fonctionnent partout, ce que détaille [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet), et les contrats ordinaires se déploient comme d'habitude — voir [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
