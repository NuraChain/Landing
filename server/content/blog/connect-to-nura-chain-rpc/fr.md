Tout ce qu'un programme fait avec une blockchain passe par un point de terminaison RPC. Voici celui de Nura Chain : ce qu'il fait, ce qu'il ne fait pas, et comment y diriger les bibliothèques habituelles.

## Le point de terminaison

```text
https://rpc.nurachain.net
```

Il parle le JSON-RPC d'Ethereum en HTTPS POST et appartient au chain ID `1020`. Lisez cette seconde valeur depuis le point de terminaison plutôt qu'ici :

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` vaut 1020. Chaque bibliothèque ci-dessous reçoit ce nombre explicitement, et c'est délibéré : un client à qui l'on a dit quelle chaîne il attend refusera de continuer si le point de terminaison le contredit, ce qui transforme un déploiement silencieux sur le mauvais réseau en une erreur au démarrage.

## Une première requête sans rien installer

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

Les résultats reviennent sous forme de quantités hexadécimales et non de nombres décimaux, et cela prend les gens en défaut sans arrêt. `0x3aecc` vaut 241 356. Toute bibliothèque cliente convertit pour vous ; un `curl` brut, non.

## ethers.js

```javascript
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://rpc.nurachain.net', {
    chainId: 1020,
    name: 'nura'
});

const [height, fees] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData()
]);

console.log(height, fees.maxFeePerGas);
```

Passer le réseau en deuxième argument fait deux choses : cela évite un aller-retour `eth_chainId` à la première utilisation, et cela fait lever une exception au fournisseur si le point de terminaison annonce une autre chaîne. C'est la seconde qui compte.

## viem

viem attend un objet chain, et c'est un bon endroit pour rassembler toutes les valeurs en une seule déclaration :

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Mainnet',
    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

const client = createPublicClient({ chain: nura, transport: http() });

console.log(await client.getBlockNumber());
```

C'est ce même objet `nura` que vous confierez ensuite à wagmi et au wallet client de viem.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

Écrire cette assertion prend trois secondes et a sauvé plus de déploiements que n'importe quelle autre ligne de cet article.

## Lire depuis un navigateur

Le point de terminaison renvoie des en-têtes CORS permissifs : une page peut donc l'appeler directement, sans proxy de votre côté.

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

Soyons clairs sur ce que cela autorise. Les appels de lecture fonctionnent depuis le navigateur. Tout ce qui exige une clé privée ne passe pas du tout par ce point de terminaison : cela passe par le portefeuille de l'utilisateur, un chemin entièrement différent qui fait l'objet de [construire une dApp sur Nura Chain](/blog/build-a-dapp-on-nura-chain).

## Des méthodes refusées à dessein

Demandez des comptes à un point de terminaison public, il refuse :

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

C'est le comportement correct, pas une fonctionnalité manquante. Un nœud RPC public ne détient aucune clé pour votre compte : `eth_accounts`, `eth_sendTransaction` et `personal_*` n'ont donc rien sur quoi opérer. Un point de terminaison qui y répondrait serait un point de terminaison conservant les fonds de quelqu'un.

Le chemin d'une transaction signée est : la construire localement, la signer localement, puis soumettre les octets signés avec `eth_sendRawTransaction`. Toute bibliothèque s'en charge dès que vous lui donnez un portefeuille plutôt qu'un simple fournisseur.

## Notes pratiques

- N'interrogez pas la chaîne à chaque rendu. Les lectures sont des appels réseau : mettez-les en cache quelques secondes et partagez une même requête en vol entre les appelants qui arrivent ensemble.
- Lisez le chain ID une fois au démarrage et échouez bruyamment en cas d'écart, plutôt qu'à chaque appel.
- Traitez une lecture échouée comme un échec, pas comme un zéro. Un solde affiché à 0 parce que la requête a expiré est pire qu'un solde affiché en erreur.
- Ne figez pas les prix du gaz. Demandez les données de frais au moment de l'envoi ; voyez [comment fonctionnent les frais ici](/blog/nura-chain-evm-compatibility).

## Questions fréquentes

### Y a-t-il une limite de débit ?

Considérez tout point de terminaison public comme limité, qu'un chiffre soit annoncé ou non, et concevez en conséquence : cache, regroupement, temporisation en cas d'échec. Une application qui martèle un point de terminaison partagé à chaque frappe finira étranglée quelque part, et c'est une décision raisonnable de la part d'un opérateur.

### Puis-je utiliser les WebSockets ou les abonnements ?

Testez plutôt que de supposer. Si `eth_subscribe` n'est pas disponible, interroger `eth_blockNumber` à un intervalle raisonnable est le repli portable, et c'est de toute façon ce que la plupart des applications finissent par faire.

### Pourquoi ma transaction ne se confirme-t-elle jamais ?

La cause habituelle est un prix du gaz figé, hérité d'un modèle, passé sous les frais de base actuels. Lisez plutôt les données de frais au moment de l'envoi.

### Puis-je faire tourner mon propre nœud ?

Rien de ce qui précède ne dépend d'un point de terminaison hébergé. Une application qui lit depuis votre nœud n'a besoin que d'une autre URL, et c'est exactement la propriété qui rend cette architecture intéressante.

## Pour aller plus loin

Les lectures fonctionnant, l'étape suivante est l'écriture : [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) couvre la configuration de Hardhat et Foundry bâtie sur les valeurs ci-dessus.

Pour confirmer ce qui a réellement atterri sur la chaîne, [comment utiliser l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer) est l'article complémentaire. Et si vous arrivez sans contexte, [ce qu'est Nura Chain](/blog/what-is-nura-chain) est le point de départ.
