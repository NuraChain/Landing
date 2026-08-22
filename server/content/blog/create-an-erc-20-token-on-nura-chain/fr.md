Un jeton ERC-20 n'est pas un type d'actif particulier que la chaîne connaîtrait. C'est un contrat intelligent ordinaire qui tient une correspondance adresse-solde et expose un ensemble convenu de fonctions. Tout le reste — les portefeuilles qui l'affichent, les plateformes qui le listent, les explorateurs qui l'indexent — découle d'une implémentation correcte de cette interface.

Cet article passe par l'écriture d'un jeton, son déploiement sur Nura Chain, et la partie qui cause le plus de pertes réelles : les décimales.

## Ce que l'ERC-20 spécifie réellement

Une poignée de fonctions et deux événements :

```solidity
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

`name()`, `symbol()` et `decimals()` sont facultatives dans le standard mais universellement attendues : un portefeuille sans symbole à afficher montrera l'adresse à la place.

L'événement `Transfer` est ce qui rend un jeton visible. Les explorateurs ne parcourent pas le stockage, ils indexent les événements. Un contrat qui déplace des soldes sans émettre `Transfer` est un jeton que rien ne peut voir.

## Le contrat

N'écrivez pas l'arithmétique vous-même. Utilisez une implémentation relue :

```bash
npm install @openzeppelin/contracts
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Example Token", "EXM") {
        _mint(msg.sender, initialSupply);
    }
}
```

Voilà un jeton complet et fonctionnel. Il faut résister à la tentation d'ajouter émission, mise en pause, listes noires et frais sur transfert tant que vous ne pouvez pas dire précisément qui a le droit d'appeler chacune, car chaque privilège ajouté est un moyen supplémentaire de retirer le jeton à ses détenteurs.

## Les décimales, voilà ce qui mord

`decimals()` est une métadonnée d'affichage. Elle n'influe pas sur l'arithmétique. Le contrat stocke des entiers, et `decimals` indique aux interfaces où placer la virgule.

Avec les 18 conventionnelles :

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

Émettre « un million de jetons » signifie donc :

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

Passer `1_000_000` à la place émet un millionième de millionième de jeton, et l'erreur reste invisible jusqu'à ce qu'un portefeuille l'affiche.

Le piège consiste à croire qu'un symbole implique un nombre de décimales. Ce n'est pas le cas, et Nura Chain en offre un exemple vivant. Le contrat USDT ponté ici annonce 18 décimales :

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

USDT sur Ethereum en utilise 6. Même symbole, nombre de décimales différent, contrat différent sur une chaîne différente. Toute intégration qui code en dur « USDT signifie 6 décimales » se trompe ici d'un facteur mille milliards. Lisez toujours `decimals()` sur le contrat auquel vous parlez réellement.

## Déployer

La configuration est celle de [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) : chain ID `1020`, RPC `https://rpc.nurachain.net`. Le script ne diffère que par l'argument passé au constructeur :

```javascript
import { ethers } from 'hardhat';

async function main() {
    const supply = ethers.parseUnits('1000000', 18);
    const token = await ethers.deployContract('ExampleToken', [supply]);

    await token.waitForDeployment();

    console.log('token at', await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

`parseUnits` existe pour que vous n'écriviez jamais les zéros à la main. Servez-vous-en.

Ensuite, confirmez que le contrat répond en tant que jeton et pas seulement qu'il existe :

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## Faire en sorte qu'un portefeuille l'affiche

Les portefeuilles ne découvrent pas les jetons tout seuls. Le détenteur ajoute l'adresse du contrat une fois, via « importer un jeton » ou équivalent, et le portefeuille lit `symbol` et `decimals` sur le contrat lui-même.

Si votre portefeuille ne pointe pas encore vers ce réseau, [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet) vient d'abord.

## Deux ERC-20 déjà présents sur cette chaîne

Il vaut la peine de regarder de vrais jetons, pas seulement le vôtre. Les deux suivants sont des contrats ERC-20 ordinaires déployés sur Nura Chain, représentant des actifs pontés :

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

Interrogez-les comme vous avez interrogé le vôtre, ou ouvrez-les dans [Nura Explorer](https://explorer.nurachain.net). Ils sont utiles précisément parce qu'ils ne sont pas des exemples écrits pour un tutoriel : ils répondent à `name()`, `symbol()`, `decimals()` et `totalSupply()` comme n'importe quel autre jeton, ce qui est tout l'intérêt d'un standard.

## Des erreurs qui coûtent de l'argent

- **Émettre sans le décalage décimal**, comme ci-dessus.
- **Supposer qu'un symbole implique les décimales.** Lisez `decimals()`. À chaque fois.
- **Se fier au symbole.** N'importe qui peut déployer un contrat se nommant `USDT`. L'identité, c'est l'adresse ; le nom est une étiquette choisie par le déployeur.
- **Conserver un propriétaire capable d'émettre.** Un droit d'émission illimité signifie que l'offre vaut ce que dit le détenteur de la clé. Si vous le gardez, dites-le publiquement ; si vous n'en avez pas besoin, renoncez-y.
- **Envoyer des jetons au contrat du jeton lui-même.** Faux pas courant, et généralement irrécupérable.

## Questions fréquentes

### Dois-je enregistrer le jeton quelque part ?

Non. Le déployer, c'est le publier. Portefeuilles et explorateurs le lisent depuis la chaîne. Un référencement sur un service tiers relève de la procédure de ce service.

### Puis-je changer l'offre plus tard ?

Seulement si le contrat comporte une fonction d'émission ou de destruction que vous avez délibérément incluse. L'exemple ci-dessus n'en a pas : son offre est figée à la construction, ce qui est la valeur par défaut honnête.

### Combien coûte le fonctionnement du jeton ?

Le déploiement coûte du gaz une fois. Ensuite, chaque transfert coûte du gaz payé par l'expéditeur — en NURA, pas dans votre jeton.

### Devrais-je écrire mon propre ERC-20 de zéro ?

Pas pour quoi que ce soit détenant de la valeur. L'interface est assez petite pour paraître simple et comporte assez d'aspérités (valeurs de retour, course sur les allocations, décimales) pour qu'une implémentation relue soit le choix par défaut.

## Pour aller plus loin

Pour placer une interface fonctionnelle devant le jeton, voyez [construire une dApp sur Nura Chain](/blog/build-a-dapp-on-nura-chain), qui traite la connexion du portefeuille et l'envoi de transactions depuis une page.

Pour suivre les transferts au fil de l'eau, [comment utiliser l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer) explique la lecture de l'historique d'événements d'un jeton. Et pour la mécanique sous-jacente, [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility).
