Circle a ouvert sa blockchain Arc au public le 16 septembre 2026. Arc est une Layer 1 construite autour d'une seule décision de conception : les frais de transaction se paient en USDC, le stablecoin en dollars qu'émet Circle, plutôt que dans une monnaie native volatile. Parmi ses premiers validateurs figurent BlackRock, Visa et Mastercard. Elle arrive après Tempo, la chaîne de paiement de Stripe et Paradigm, mise en service en mars 2026.

## L'essentiel

- **Lancement :** réseau principal public le 16 septembre 2026, après une phase privée avec des institutions.
- **Frais :** payés en USDC. Un jeton ARC distinct existe, mais ce n'est pas avec lui que vous payez le gaz.
- **Compatibilité :** Arc exécute l'EVM, donc les contrats Solidity et les portefeuilles standards fonctionnent.
- **Validateurs :** des institutions nommément désignées, parmi lesquelles BlackRock, DTCC, Visa, Mastercard, ICE et Standard Chartered.
- **Pas terminé :** les fonctions de confidentialité sont optionnelles et encore en développement.

## Pourquoi payer le gaz en stablecoin ?

Parce qu'une direction financière ne peut pas établir un budget dans un actif qui fluctue.

Sur la plupart des chaînes, vous payez les frais dans la monnaie native. Son prix bouge, donc le coût d'une transaction en dollars bouge avec lui, et une entreprise doit détenir un actif dont elle ne veut pas par ailleurs, uniquement pour payer des transferts. Des frais en USDC suppriment les deux problèmes : le coût est exprimé dans l'unité dans laquelle l'entreprise tient déjà ses comptes, et il n'y a rien de plus au bilan.

C'est une vraie commodité, et il vaut la peine de dire clairement que c'est une commodité plutôt qu'une percée. Le fonctionnement des frais sur une chaîne EVM ordinaire — des frais de base qui s'ajustent à la demande, payés dans la monnaie native — est expliqué dans [combien coûte réellement le gaz en 2026](/blog/what-gas-actually-costs-in-2026).

## Qui la fait tourner ?

Des institutions nommément désignées, et c'est là le compromis.

Un ensemble de validateurs composé de grandes entreprises réglementées, c'est exactement ce qu'une banque a besoin de voir avant de régler des paiements sur un réseau. C'est aussi un petit groupe que l'on peut identifier, réglementer et à qui l'on peut donner des instructions. Que cela compte comme une force dépend de ce que vous attendez d'une chaîne : une entreprise veut une contrepartie qu'elle peut poursuivre en justice, et un utilisateur dans une juridiction difficile veut un réseau que personne ne peut recevoir l'ordre de lui couper.

Ni l'un ni l'autre n'a tort. Ce sont des produits différents qui partagent une machine virtuelle.

## Est-ce une chaîne EVM de plus ?

Oui, et c'est la partie la moins surprenante. Construire sur l'EVM signifie qu'Arc hérite dès le premier jour de tous les portefeuilles, de toutes les bibliothèques et de tous les cabinets d'audit, ce qui explique pourquoi presque chaque nouveau réseau fait le même choix — le raisonnement se trouve dans [pourquoi les chaînes EVM se multiplient](/blog/why-so-many-evm-chains).

Ce dont une nouvelle chaîne ne peut pas hériter, ce sont la liquidité et les utilisateurs. La réponse d'Arc, c'est la distribution : Circle a déjà le stablecoin et les relations institutionnelles. C'est une position de départ plus solide que celle de la plupart des lancements, et cela reste une position de départ.

## Qu'est-ce que cela signifie pour les chaînes généralistes ?

Que la « chaîne de paiement » devient une catégorie, tenue par les entreprises qui émettent les dollars ou qui gèrent les encaissements. Les réseaux généralistes ne gagneront pas cette compétition sur des frais exprimés en dollars.

Ce qu'ils gardent, c'est l'ouverture. Sur Nura Chain, n'importe qui peut déployer un contrat et n'importe qui peut le lire ; les frais se paient en NURA avec des frais de base EIP-1559, et les blocs arrivent environ toutes les trois secondes. C'est une promesse différente de celle d'Arc, faite à un utilisateur différent, et [ce qu'est Nura Chain](/blog/what-is-nura-chain) l'énonce clairement.

Les détails donnés ici sont ceux annoncés au lancement et ils changeront ; [Circle](https://www.circle.com) est la source pour ceux qui sont à jour.
