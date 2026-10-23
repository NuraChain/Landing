Le 21 octobre 2026, la plateforme d'hébergement cloud Railway a révélé qu'un tiers non autorisé avait pu accéder aux variables d'environnement chiffrées que stockent ses clients, et lire le contenu déchiffré de certaines d'entre elles. L'enquêtrice blockchain Taylor Monahan a relié la brèche de Railway à environ 371 000 dollars de cryptomonnaies siphonnés sur au moins 19 chaînes EVM, selon son estimation rapportée par crypto.news le 22 octobre. Railway n'a confirmé aucun vol de cryptomonnaies. Le schéma est connu : une clé privée conservée là où un serveur pouvait la lire a été lue par quelqu'un d'autre.

## Les faits clés

- **La divulgation :** Railway, 21 octobre 2026 — une activité anormale dans les systèmes qui stockent les variables d'environnement des clients, lesquelles peuvent contenir des clés d'API et des identifiants de bases de données et de registres.
- **Le vol allégué :** environ 371 000 dollars en plus de 500 transactions depuis plus de 200 adresses sur au moins 19 réseaux EVM, selon Taylor Monahan au 22 octobre. Un développeur publiant sous le nom ethereumdegen.eth l'a chiffré à environ 370 000 dollars.
- **Chronologie :** selon la chronologie de Monahan, le premier vol a eu lieu à 19:36 UTC le 21 octobre ; l'avis de Railway a été publié vers 21:51 UTC.
- **La réponse de Railway :** déploiements suspendus, tous les clients invités à renouveler toutes les variables stockées, tous les jetons d'API Railway invalidés à 04:17 UTC le 22 octobre selon CryptoSlate, et identifiants des buckets de stockage et jetons GitHub réinitialisés le même jour.
- **Non établi :** la cause profonde, le nombre de clients touchés, et la question de savoir si les clés des portefeuilles vidés venaient de Railway.

## Qu'a réellement divulgué Railway ?

Que des secrets qu'elle conservait pour ses clients ont pu être lus.

L'avis de Railway indique qu'elle a détecté l'activité le matin du 21 octobre et pense qu'un tiers non autorisé a pu accéder à des variables d'environnement chiffrées et en obtenir, pour certaines, le contenu déchiffré. Son analyse initiale désigne une partie des utilisateurs, mais elle a demandé à tous de renouveler toutes les variables et les identifiants de registres privés, et de vérifier les journaux de leurs services. Elle estime que l'incident s'inscrit dans une série d'attaques contre des entreprises de plateforme visant des fournisseurs d'inférence d'IA, et a demandé aux fournisseurs en amont de révoquer des clés. L'avis ne mentionne ni cryptomonnaies, ni portefeuilles, ni clés privées.

## Quel est le lien avec le vol de cryptomonnaies ?

Par les portefeuilles vidés, et non par une déclaration de Railway.

Monahan a relié les siphonnages à l'incident et décrit les transactions comme l'œuvre d'un script de balayage de portefeuilles assez standard, selon crypto.news. Son premier vol précède de plus de deux heures l'annonce publique de Railway. Les récits ne concordent pas entièrement : Noah Dunnagan, ingénieur réussite client chez Railway, a écrit sur X que l'entreprise avait des raisons de penser que l'attaque n'avait exploité que des jetons d'inférence d'IA, selon The Defiant. Railway n'a pas confirmé les pertes, et le chiffre de 371 000 dollars est une estimation extérieure.

## Pourquoi une variable d'environnement est-elle un mauvais endroit pour une clé privée ?

Parce que la plateforme doit pouvoir la lire.

Une variable d'environnement est le moyen par lequel une plateforme d'hébergement remet un secret à votre processus au démarrage. Pour cela, la plateforme stocke la valeur, chiffrée au repos, avec de quoi la déchiffrer. C'est acceptable pour une clé d'API révocable en une minute. Une clé privée ne se révoque pas. Quiconque la lit une fois contrôle l'adresse pour de bon, et le seul remède est de déplacer les fonds avant lui — et un script de balayage est conçu pour bouger le premier.

C'est le même argument que [pourquoi des contrats audités se font encore vider](/blog/why-audited-contracts-get-drained) : le code tient, et l'argent sort par ce qui l'entoure.

## Comment les développeurs peuvent-ils garder les clés hors de l'hébergement ?

- **Ne mettez pas une clé approvisionnée dans les variables d'une plateforme.** Si un service doit signer, donnez-lui une clé qui ne détient que ce dont il a besoin aujourd'hui.
- **Signez ailleurs.** Un service de gestion de clés ou un signataire séparé détient la clé et signe sur demande, de sorte que l'application ne la voit jamais.
- **Ne stockez jamais une phrase de récupération sur un serveur.** Une seule phrase dérive toutes les adresses du portefeuille.
- **Séparez les clés de déploiement des clés de trésorerie.** La clé qui déploie un contrat ne doit pas être celle qui détient ses fonds.
- **Renouvelez dès la divulgation, et déplacez d'abord les fonds.** Pour une clé privée, renouveler signifie une nouvelle clé et un transfert, pas une nouvelle chaîne de caractères.
- **Surveillez les adresses.** Une alerte sur tout transfert sortant vous prévient en quelques minutes plutôt qu'en quelques jours.

## Qu'est-ce que cela signifie pour construire sur Nura Chain ?

Les mêmes règles s'appliquent. Notre guide pour [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) lit la clé de déploiement depuis une variable d'environnement sur votre propre machine, et conseille d'utiliser une clé jetable pour un premier déploiement, pas celle qui détient votre solde. C'est une clé locale et de courte durée. Une clé approvisionnée et durable sur une plateforme d'hébergement est un risque différent, et les conseils ci-dessus la concernent.

Les détails évolueront à mesure que l'enquête de Railway avance. La source primaire est [la divulgation de sécurité de Railway du 21 octobre 2026](https://blog.railway.com/p/security-disclosure-wednesday-october-21st).
