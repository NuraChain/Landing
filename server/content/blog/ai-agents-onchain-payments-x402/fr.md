HTTP transporte depuis le début des années quatre-vingt-dix un code de statut nommé `402 Payment Required`. Il avait été réservé à un avenir qui n'est jamais venu, et pendant trente ans la bonne chose à en faire était : rien. En 2026, il devient soudain porteur : x402 se sert de cette réponse pour qu'un client paie une requête unique, en stablecoins, sans compte et sans clé d'API.

## Le mécanisme, en trois étapes

1. Un client demande une ressource. Le serveur répond `402` avec un corps JSON structuré indiquant le prix et où payer.
2. Le client paie en chaîne et réémet la requête en joignant la preuve de paiement.
3. Le serveur vérifie et sert la réponse.

C'est tout le protocole. Pas d'inscription, pas de cycle de facturation, pas de carte enregistrée, pas de minimum. Celui qui a besoin d'une inférence ou d'une page de données paie une inférence ou une page de données.

## Pourquoi maintenant

Parce que l'appelant a cessé d'être une personne. Un agent autonome ne remplit pas un formulaire d'inscription, ne porte pas de carte d'entreprise et n'attend pas qu'une facture soit réglée en fin de mois. Il peut en revanche détenir une clé et signer un transfert, et la tarification à la requête est le seul modèle de facturation compatible avec une chose qui prend des milliers de petites décisions à l'heure.

Les volumes ne relèvent plus de l'hypothèse. Une bêta de quatorze semaines, d'octobre 2025 à janvier 2026, a vu plus de mille participants créer plus de 9 500 agents, qui ont exécuté entre eux environ 187 000 transactions autonomes.

## Ce que cela demande à une chaîne

Trois propriétés, et aucune n'est glamour.

- **Des transactions bon marché.** Un paiement d'une fraction de centime ne peut pas coûter plus cher que ce qu'il achète.
- **Une finalité rapide.** La requête attend. Une fenêtre de règlement mesurée en minutes, c'est un timeout.
- **Une unité stable.** Personne ne tarife un appel d'API dans un actif qui bouge de dix pour cent avant la nouvelle tentative.

Tout réseau EVM qui remplit ces conditions peut porter ce trafic ; la transaction elle-même n'a rien d'exotique. [Se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) utilise le même JSON-RPC qu'emploierait un agent, et les blocs y tombent environ toutes les trois secondes.

## Ce qu'il faut régler avant d'en déployer un

Un agent muni d'une clé est un signataire sans surveillance. Traitez-le comme tel.

- **Financez-le mince.** Un solde chaud de la taille d'une journée de travail, rechargé délibérément, pas une trésorerie.
- **Bornez-le.** Des clés de session avec plafond de dépense et expiration, ce que les comptes intelligents rendent justement praticable — voir [EIP-7702 et les comptes intelligents](/blog/eip-7702-smart-accounts).
- **Journalisez chaque paiement.** Un agent qui dépense en silence est un agent que vous ne pourrez pas auditer après coup.
- **Séparez la clé du prompt.** Tout ce qu'un agent lit peut tenter de lui donner des ordres. Le plafond de dépense est le seul contrôle qui ne discute pas.

L'intéressant dans les paiements agentiques n'est pas que des machines puissent payer. C'est que la tarification à la requête a enfin une couche de règlement sous elle.
