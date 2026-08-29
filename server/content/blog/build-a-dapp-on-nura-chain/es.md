Una dApp es una aplicación web corriente con una propiedad poco corriente: nunca guarda la clave del usuario. Lee de una cadena y, cuando quiere cambiar algo, le pide a una cartera que firme. Todo lo que sigue se deriva de esa separación.

## Las dos mitades

Leer y escribir son caminos separados, y confundirlos es el error estructural más común.

**Leer** pasa por tu propia conexión RPC. No necesita cartera, funciona antes de que nadie se conecte y debería dibujar todo lo posible de tu interfaz. Saldos, estado de contratos, precios, historial: todo es público.

**Escribir** pasa por la cartera del usuario. Necesita su aprobación, puede ser rechazado y es la única parte que requiere conexión.

Construye primero el camino de lectura. Una dApp que muestra una página en blanco hasta que alguien conecta es una dApp que muestra una página en blanco a todo el que está evaluando si conectarse.

## Leer

Usa un cliente público apuntado al endpoint, exactamente como en [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc):

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Chain',
    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

Ese objeto es la única definición de la red para toda la aplicación. Impórtalo en todas partes en lugar de repetir los valores.

## Conectar una cartera

Una cartera de navegador inyecta un proveedor EIP-1193. El mecanismo moderno de descubrimiento es EIP-6963, que anuncia cada cartera instalada en vez de pelearse por una variable global; vale la pena si puede haber más de una presente. La versión mínima:

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

Llama a esto desde un clic, nunca al cargar la página. Una dApp que lanza el aviso de la cartera nada más abrirse es una dApp que los usuarios cierran.

## Llevarlos a la red correcta

Este es el paso que la mayoría de guías se salta, y donde los usuarios reales se atascan. Una cartera conectada puede estar en cualquier cadena. Pídele que cambie, y contempla el caso de que nunca haya oído hablar de Nura Chain:

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
                    chainName: 'Nura Chain',
                    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
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

`0x3fc` es 1020 en hexadecimal, y las carteras quieren la forma hexadecimal. La rama `4902` es lo que convierte «no pasa nada al hacer clic» en una primera experiencia que funciona: es la misma petición descrita en [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet), emitida por tu página en vez de a mano.

Escucha también los cambios, porque el usuario puede cambiar de red o de cuenta a tus espaldas:

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

Recargar en `chainChanged` es tosco pero correcto: garantiza que no sobreviva ningún estado obsoleto ligado a una cadena.

## Enviar una transacción

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

Fíjate en dos cosas. El cliente de cartera envía; el cliente público espera. Y un recibo con estado `reverted` es una transacción que ocurrió, costó gas y no hizo lo que se le pidió: tratarla como éxito es un fallo que los usuarios encontrarán.

## Los estados que realmente ocurren

Contempla todos estos, porque cada uno pasa con regularidad:

- **Sin cartera instalada.** Muestra un enlace, no un botón roto.
- **Conexión rechazada.** El usuario dijo que no. Vuelve al estado desconectado sin ruido; no vuelvas a pedirlo.
- **Red equivocada.** Ofrece un botón de cambio en vez de un error. Es la mayor fuente de usuarios confundidos.
- **Transacción rechazada en la cartera.** No es una condición de error. Limpia el estado pendiente y sigue.
- **Pendiente.** Muestra el hash y un enlace a [Nura Explorer](https://explorer.nurachain.net) para que puedan seguirlo ellos mismos.
- **Revertida.** Dilo claramente. «La transacción falló» con el hash es mejor que un indicador que gira eternamente.

## Qué no hacer

- **No pidas una clave privada.** Nunca, por ningún motivo. Una dApp que la pide es indistinguible de una página de phishing.
- **No pidas aprobaciones de token ilimitadas por defecto.** Aprueba la cantidad que realmente hace falta. Si necesitas una asignación grande, dilo en la interfaz.
- **No te fíes de un ID de cadena guardado en el estado.** Léelo del proveedor antes de enviar nada que importe.
- **No bloquees toda la interfaz esperando una conexión de cartera.** Mira la primera sección.
- **No consultes la cadena en cada render.** Cachea las lecturas y comparte las peticiones en vuelo.

## Preguntas frecuentes

### ¿Necesito un backend?

No para leer ni escribir en la cadena: ambas cosas van directas desde el navegador, que es lo que hace posible el CORS permisivo del endpoint. Necesitas backend para lo que las cadenas hacen mal: búsqueda, agregación, datos fuera de cadena.

### ¿Puedo usar wagmi o RainbowKit?

Sí. Pásales la misma definición de cadena del primer fragmento. En su mayoría envuelven la lógica de conexión y cambio de red que se muestra arriba, y merece la pena entenderla una vez antes de delegarla.

### ¿Cómo muestro saldos de tokens?

Llama a `balanceOf` en el contrato del token y formatea con su propio `decimals()`. Nunca supongas la cantidad de decimales: [crear un ERC-20 en Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) explica por qué esa suposición sale cara aquí en concreto.

### ¿Cómo pruebo sin gastar nada?

Los caminos de lectura no necesitan fondos. Para escrituras, usa una cuenta desechable con saldo pequeño y confirma cada resultado en el explorador.

## Por dónde seguir

Si aún no has desplegado el contrato con el que hablará tu interfaz, empieza por [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).

Para confirmar qué hizo realmente tu aplicación, [cómo usar el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) es la herramienta. Y para los fundamentos de la red detrás de todo esto, [qué es Nura Chain](/blog/what-is-nura-chain).
