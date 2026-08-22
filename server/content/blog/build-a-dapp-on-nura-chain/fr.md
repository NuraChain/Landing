Une dApp est une application web ordinaire dotée d'une propriété peu ordinaire : elle ne détient jamais la clé de l'utilisateur. Elle lit une chaîne et, lorsqu'elle veut modifier quelque chose, elle demande à un portefeuille de signer. Tout ce qui suit découle de cette séparation.

## Les deux moitiés

Lire et écrire sont deux chemins distincts, et les confondre est l'erreur structurelle la plus fréquente.

**Lire** passe par votre propre connexion RPC. Cela ne demande aucun portefeuille, fonctionne avant que quiconque se connecte, et devrait dessiner la plus grande part possible de votre interface. Soldes, état des contrats, prix, historique : tout cela est public.

**Écrire** passe par le portefeuille de l'utilisateur. Cela demande son accord, peut être refusé, et c'est la seule partie qui exige réellement une connexion.

Construisez d'abord le chemin de lecture. Une dApp qui affiche une page blanche tant que personne ne s'est connecté affiche une page blanche à quiconque évalue s'il faut se connecter.

## Lecture

Utilisez un client public dirigé vers le point de terminaison, exactement comme dans [se connecter au RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) :

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

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

Cet objet constitue la définition unique du réseau pour toute l'application. Importez-le partout plutôt que de répéter les valeurs.

## Connecter un portefeuille

Un portefeuille de navigateur injecte un fournisseur EIP-1193. Le mécanisme de découverte moderne est l'EIP-6963, qui annonce chaque portefeuille installé au lieu de se disputer une variable globale — utile dès que plusieurs portefeuilles peuvent être présents. La version minimale :

```javascript
async function connect() {
    const provider = window.ethereum;

    if (provider === undefined) {
        throw new Error('No wallet found');
    }

    const [account] = await provider.request({ method: 'eth_requestAccounts' });

    return account;
}
```

Appelez cela depuis un clic, jamais au chargement de la page. Une dApp qui ouvre la fenêtre du portefeuille dès l'ouverture de la page est une dApp que les utilisateurs ferment.

## Les amener sur le bon réseau

C'est l'étape que la plupart des guides sautent, et celle où les vrais utilisateurs se bloquent. Un portefeuille connecté peut se trouver sur n'importe quelle chaîne. Demandez-lui de basculer, et traitez le cas où il n'a jamais entendu parler de Nura Chain :

```javascript
const NURA_HEX = '0x3fc';

async function ensureNura(provider) {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NURA_HEX }]
        });
    } catch (error) {
        // 4902: the wallet does not know this chain yet. Offer to add it, then
        // the switch above succeeds on the next attempt.
        if (error.code === 4902) {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: NURA_HEX,
                    chainName: 'Nura Mainnet',
                    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
                    rpcUrls: ['https://rpc.nurachain.net'],
                    blockExplorerUrls: ['https://explorer.nurachain.net']
                }]
            });
        } else {
            throw error;
        }
    }
}
```

`0x3fc` vaut 1020 en hexadécimal, et les portefeuilles réclament la forme hexadécimale. La branche `4902` est ce qui transforme « il ne se passe rien quand je clique » en une première expérience réussie : c'est la même requête que celle décrite dans [ajouter Nura Chain à votre portefeuille](/blog/add-nura-chain-to-your-wallet), émise par votre page plutôt qu'à la main.

Écoutez aussi les changements, car l'utilisateur peut changer de réseau ou de compte dans votre dos :

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

Recharger sur `chainChanged` est brutal mais correct : cela garantit qu'aucun état périmé lié à une chaîne ne survit.

## Envoyer une transaction

```javascript
import { createWalletClient, custom, parseEther } from 'viem';

const walletClient = createWalletClient({
    chain: nura,
    transport: custom(window.ethereum)
});

const hash = await walletClient.sendTransaction({
    account,
    to: '0xRecipient',
    value: parseEther('1')
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });

if (receipt.status === 'reverted') {
    throw new Error('The transaction was included but reverted');
}
```

Deux choses à remarquer. Le client portefeuille envoie ; le client public attend. Et un reçu au statut `reverted` correspond à une transaction qui a eu lieu, a coûté du gaz et n'a pas fait ce qui était demandé — la traiter comme un succès est un défaut que les utilisateurs trouveront.

## Les états qui surviennent réellement

Traitez-les tous, car chacun se produit régulièrement :

- **Aucun portefeuille installé.** Affichez un lien, pas un bouton cassé.
- **Connexion refusée.** L'utilisateur a dit non. Revenez discrètement à l'état non connecté ; ne redemandez pas.
- **Mauvais réseau.** Proposez un bouton de bascule plutôt qu'une erreur. C'est la première source d'utilisateurs perdus.
- **Transaction refusée dans le portefeuille.** Ce n'est pas une erreur. Effacez l'état en attente et continuez.
- **En attente.** Affichez le hash et un lien vers [Nura Explorer](https://explorer.nurachain.net) pour qu'ils suivent eux-mêmes.
- **Annulée.** Dites-le clairement. « La transaction a échoué » avec le hash vaut mieux qu'un indicateur qui tourne sans fin.

## Ce qu'il ne faut pas faire

- **Ne demandez jamais de clé privée.** Jamais, pour aucune raison. Une dApp qui en demande une est indiscernable d'une page d'hameçonnage.
- **Ne demandez pas d'autorisations de jetons illimitées par défaut.** Approuvez le montant réellement nécessaire. Si une allocation importante est indispensable, dites-le dans l'interface.
- **Ne vous fiez pas à un chain ID conservé dans l'état.** Lisez-le auprès du fournisseur avant d'envoyer quoi que ce soit d'important.
- **Ne bloquez pas toute l'interface sur une connexion de portefeuille.** Voyez la première section.
- **N'interrogez pas la chaîne à chaque rendu.** Mettez les lectures en cache et partagez les requêtes en vol.

## Questions fréquentes

### Ai-je besoin d'un backend ?

Ni pour lire ni pour écrire sur la chaîne : les deux passent directement depuis le navigateur, ce que rend possible le CORS permissif du point de terminaison. Un backend sert pour ce que les chaînes font mal : recherche, agrégation, données hors chaîne.

### Puis-je utiliser wagmi ou RainbowKit ?

Oui. Passez-leur la même définition de chaîne que dans le premier extrait. Ils enveloppent pour l'essentiel la logique de connexion et de bascule réseau montrée ci-dessus, qu'il vaut la peine de comprendre une fois avant de la déléguer.

### Comment afficher des soldes de jetons ?

Appelez `balanceOf` sur le contrat du jeton et formatez avec son propre `decimals()`. Ne présumez jamais du nombre de décimales — [créer un ERC-20 sur Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) explique pourquoi cette hypothèse coûte cher ici en particulier.

### Comment tester sans rien dépenser ?

Les chemins de lecture ne demandent aucun fonds. Pour les écritures, utilisez un compte jetable au solde modeste et confirmez chaque résultat dans l'explorateur.

## Pour aller plus loin

Si le contrat auquel votre interface parlera n'est pas encore déployé, commencez par [déployer un contrat intelligent sur Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).

Pour confirmer ce que votre application a réellement fait, [comment utiliser l'explorateur Nura Chain](/blog/how-to-use-nura-chain-explorer) est l'outil adéquat. Et pour les fondamentaux du réseau derrière tout cela, [ce qu'est Nura Chain](/blog/what-is-nura-chain).
