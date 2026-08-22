Déployer sur Nura Chain, c'est déployer sur un réseau EVM : les outils sont donc ceux que vous connaissez déjà. Suivent la configuration, un contrat, l'étape de déploiement et — la partie que la plupart des guides sautent — comment confirmer que la chose a réellement atterri.

## Avant de commencer

Trois choses.

- Un compte approvisionné. Déployer est une transaction, les transactions coûtent du gaz, et le gaz se paie en NURA. Un compte vide ne peut pas déployer.
- Une clé privée que vous acceptez de placer dans une variable d'environnement. Utilisez une clé jetable pour un premier déploiement, pas celle qui détient votre solde.
- Node.js et Hardhat ou Foundry.

Ne versionnez jamais une clé. Tous les exemples ci-dessous lisent l'environnement, et le fichier qui la contient doit figurer dans `.gitignore` avant de contenir quoi que ce soit de réel.

## Configuration Hardhat

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.24',
        settings: { optimizer: { enabled: true, runs: 200 } }
    },
    networks: {
        nura: {
            url: 'https://rpc.nurachain.net',
            chainId: 1020,
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : []
        }
    }
};

export default config;
```

La ligne `chainId` n'est pas décorative. Hardhat la compare à ce qu'annonce le point de terminaison et refuse de continuer en cas de divergence : c'est précisément la vérification qui empêche un déploiement de partir vers un réseau non voulu.

Sur la version de Solidity : compilez vers une cible bien établie plutôt que vers la version la plus récente. Un compilateur récent visant par défaut une version de l'EVM que le réseau n'a pas adoptée produit un bytecode qui se déploie puis se comporte étrangement — un échec bien pire qu'une erreur de compilation.

## Un contrat qui mérite d'être déployé

Quelque chose avec un état, pour avoir un moyen de vérifier que ça marche :

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Registry {
    event Recorded(address indexed who, string note);

    mapping(address => string) private notes;

    function record(string calldata note) external {
        notes[msg.sender] = note;
        emit Recorded(msg.sender, note);
    }

    function noteOf(address who) external view returns (string memory) {
        return notes[who];
    }
}
```

L'événement compte pour la section suivante : ce sont les événements qu'un explorateur indexe, donc un contrat qui en émet est un contrat vérifiable de l'extérieur.

## Déployer

```javascript
import { ethers } from 'hardhat';

async function main() {
    const factory = await ethers.getContractFactory('Registry');
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log('deployed to', await contract.getAddress());
    console.log('tx', contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Puis :

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

Gardez la ligne `waitForDeployment`. Sans elle, le script affiche une adresse et se termine avant que la transaction soit minée, vous laissant avec une adresse qui contient peut-être du code, peut-être pas.

## Confirmer que c'est bien passé

Une adresse affichée par un script est une prédiction, pas un fait. Interrogez la chaîne :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

Un contrat déployé renvoie une longue chaîne hexadécimale. Un résultat `0x` signifie qu'il n'y a pas de code à cette adresse : le déploiement a échoué, manqué de gaz, ou est parti sur un autre réseau. Cet appel unique distingue « ça a marché » de « le script n'a pas levé d'exception », et ce n'est pas la même chose.

Ouvrez ensuite l'adresse dans [Nura Explorer](https://explorer.nurachain.net) et regardez la transaction. [Lire l'explorateur](/blog/how-to-use-nura-chain-explorer) explique le sens des champs.

## La même chose avec Foundry

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

Et pour vérifier ensuite sans quitter le terminal :

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

La seconde doit afficher `1020`. Prenez-en l'habitude.

## Gaz et frais

Les blocs portent ici des frais de base EIP-1559 : laissez donc votre outillage estimer plutôt que de figer un `gasPrice`. Hardhat comme Foundry lisent les données de frais depuis le point de terminaison et construisent une transaction de type 2 par défaut ; la raison habituelle d'un déploiement qui reste non miné est un prix du gaz codé en dur, recopié depuis la configuration d'un autre projet et inférieur aux frais de base actuels. La mécanique se trouve dans [comment Nura Chain exécute le bytecode EVM](/blog/nura-chain-evm-compatibility).

## Échecs à savoir reconnaître

- **« insufficient funds for gas ».** Le compte n'a pas de NURA. Approvisionnez-le d'abord.
- **« invalid chain id » ou incohérence de réseau.** Votre configuration et le point de terminaison divergent. Lisez `eth_chainId` et corrigez la configuration.
- **La transaction reste indéfiniment en attente.** Frais trop bas, ou trou de nonce dû à une transaction bloquée plus tôt sur le même compte.
- **`eth_getCode` renvoie `0x`.** Le déploiement n'a pas abouti, quoi qu'ait affiché le script. Retrouvez le reçu de la transaction et vérifiez son statut.

## Questions fréquentes

### Puis-je déployer un contrat que j'ai déjà sur une autre chaîne ?

En général oui, tel quel, à condition qu'il ne code pas en dur une adresse de cet autre réseau et ne dépende pas d'un service absent ici. Le bytecode lui-même est portable.

### Obtiendra-t-il la même adresse que sur une autre chaîne ?

Seulement si vous déployez depuis le même compte au même nonce, car l'adresse d'un contrat en dérive. Utilisez `CREATE2` avec un déployeur déterministe si vous voulez délibérément faire correspondre l'adresse.

### Comment vérifier les sources sur l'explorateur ?

Cherchez le formulaire de vérification de l'explorateur. La vérification est un confort pour le lecteur, pas une propriété du contrat : celui-ci fonctionne à l'identique, sources publiées ou non.

### Faut-il un proxy pour pouvoir mettre à jour ?

Seulement si vous en avez réellement besoin. Les proxys ajoutent des pièges de disposition du stockage et une clé d'administration qui devient l'objet le plus précieux du système. Un contrat immuable que l'on peut redéployer est plus simple et plus sûr pour la plupart des projets.

## Pour aller plus loin

Le déploiement suivant évident est un jeton : [créer et déployer un ERC-20 sur Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) s'appuie directement sur cette configuration.

Pour placer une interface devant ce que vous avez déployé, voyez [construire une dApp sur Nura Chain](/blog/build-a-dapp-on-nura-chain). Et si certains détails de connexion ci-dessus vous étaient inconnus, [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) les traite comme il faut.
