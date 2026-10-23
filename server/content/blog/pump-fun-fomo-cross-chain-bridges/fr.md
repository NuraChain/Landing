Le 21 octobre 2026, Pump.fun a fait de Pump Bridge, sa propre infrastructure cross-chain, la route par défaut des transactions cross-chain dans son application, à la place du prestataire externe Relay. Le lendemain, 22 octobre, son concurrent FOMO a lancé le déploiement public de son propre pont et affirmé que les transactions cross-chain dans son application « arrivent désormais en moins de 1 s ». Le chiffre de Pump.fun est un temps d'achat moyen de 1,95 seconde contre 3,88 secondes via Relay, tiré de ses propres tests. Aucune des deux entreprises n'a publié comment son pont détient ou déplace l'argent, et c'est cette question qui décide de quoi dépend réellement une transaction cross-chain.

## Points clés

- **Pump.fun, 21 octobre :** Pump Bridge est devenu la route cross-chain par défaut dans son application, à la place de Relay.
- **Le test de Pump.fun :** du 28 septembre au 7 octobre, plus de 400 000 résultats de transactions ; achat moyen de 1,95 s contre 3,88 s, erreurs d'achat de 0,9 % contre 11,2 %. Données de Pump.fun elle-même, non vérifiées de façon indépendante, comme l'a rapporté crypto.news le 22 octobre.
- **Réseaux de ce test :** Robinhood Chain, BNB Chain, Base, Arc et Ink, selon crypto.news.
- **Frais :** pas de frais de pont séparés pour l'instant ; les frais de trading habituels peuvent s'appliquer.
- **FOMO, 22 octobre :** déploiement public du « fomo bridge », après environ une semaine auprès d'une petite part des utilisateurs. FOMO s'appuyait auparavant sur des ponts externes, dont Relay.
- **Ce qu'affirme FOMO :** des transactions cross-chain en moins d'une seconde. Elle n'a donné ni période de comparaison ni chiffres audités, a relevé crypto.news le 23 octobre.
- **Ce qu'aucune n'a révélé :** d'où vient l'argent côté destination, le modèle de sécurité, ni aucun audit.

## Qu'est-ce qu'un pont cross-chain ?

Un moyen de se retrouver avec de la valeur sur une blockchain après être parti d'une autre.

Les chaînes ne se lisent pas entre elles. Une pièce sur BNB Chain ne peut pas simplement passer sur Base, il faut donc que quelque chose se tienne au milieu : la bloquer d'un côté et émettre une créance de l'autre, ou vous payer avec des fonds déjà présents de l'autre côté. Laquelle des deux il fait, c'est toute la question de sécurité.

## Comment un swap cross-chain peut-il prendre une ou deux secondes ?

Parce que rien n'a besoin de traverser d'abord.

Attendre qu'une chaîne confirme un dépôt puis qu'une autre émette prend plus de deux secondes. Les conceptions rapides sautent cette attente : un exécutant qui détient déjà des fonds sur la chaîne de destination vous paie là-bas sur son propre solde, puis récupère votre dépôt sur la chaîne d'origine. Relay, le prestataire qu'utilisaient les deux applications, documente exactement cela : un solver exécute avec son propre capital, un oracle atteste le dépôt et l'exécution, et le solver est remboursé plus tard. Le même schéma sous-tend [les intents cross-chain et ERC-7683](/blog/cross-chain-intents-erc-7683).

Pump.fun et FOMO n'ont pas dit si leurs ponts fonctionnent ainsi, ni avec l'argent de qui l'exécution se fait. C'est une déduction tirée de la vitesse, pas une information publiée.

## Qu'est-ce qui adosse un token ponté ?

Cela dépend du type de pont qui l'a créé.

- **Verrouillage et émission.** Votre pièce est verrouillée dans un contrat ou un portefeuille sur sa chaîne d'origine, et une copie enveloppée est émise pour vous sur l'autre. La copie ne vaut l'original que tant que l'original reste verrouillé. Vous faites confiance à qui peut lever ce verrou — un multisig, un groupe de signataires, un contrat.
- **Payé par un exécutant.** Vous recevez un actif réel sur la chaîne de destination, payé sur le stock de quelqu'un. Vous ne gardez pas une créance en main, mais pendant ces secondes vous faites confiance à l'exécutant pour payer, et au système qui règle avec lui pour vous rembourser s'il ne le fait pas.

Le premier type a la défaillance la plus lourde. Un fonds verrouillé est gros, immobile et public. [L'exploit de Liquid Network](/blog/liquid-network-exploit-explained) a retiré environ 4 000 BTC d'un portefeuille de garantie dont les signataires ont signé parce que le logiciel le leur disait.

## Plus rapide veut-il dire plus sûr ?

Non. La vitesse et le taux d'erreur sont ce que mesurent les annonces ; ni l'un ni l'autre ne dit ce qui arrive aux fonds si une étape échoue. Un pont exploité par l'application elle-même fait aussi de cette application la partie à qui vous vous fiez, là où c'était auparavant un prestataire externe. Cela peut être mieux ou pire. Sans conception publiée ni audits, personne à l'extérieur ne peut dire lequel.

## Avant d'utiliser un pont

- **Demandez ce que vous détiendrez à la fin.** L'actif natif, ou une créance enveloppée sur le verrou de quelqu'un d'autre ?
- **Cherchez qui peut déplacer la garantie,** et si l'offre enveloppée se lit sur la chaîne.
- **Envoyez d'abord un petit montant,** et vérifiez qu'il est arrivé avant d'envoyer le reste.
- **Lisez les chiffres de vitesse comme du marketing tant qu'ils ne sont pas vérifiés.** Les deux séries ici sont déclarées par les entreprises, issues de tests différents, et ne se comparent pas entre elles.

## Comment fonctionne le pont de Nura Chain ?

Le whitepaper le décrit comme un ticket de vestiaire : la pièce d'origine est verrouillée sur son réseau d'origine, et une pièce correspondante est émise sur Nura Chain. Les BNB, USDT, BTC et ETH pontés sur Nura Chain sont des tokens ERC-20 à émission et destruction, et leur offre est publique : n'importe qui peut la lire, comme le montre [comment utiliser l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer).

Les chiffres sont ceux des entreprises et peuvent évoluer au fil des déploiements. Les sources primaires sont [l'annonce de Pump.fun](https://x.com/Pumpfun/status/2112980077881266326) et [l'annonce de FOMO](https://x.com/fomo/status/2113385954631160071).
