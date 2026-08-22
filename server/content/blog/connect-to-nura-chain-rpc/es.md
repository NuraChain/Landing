Todo lo que un programa hace con una blockchain pasa por un endpoint RPC. Este es el de Nura Chain: qué hace, qué no hace y cómo apuntar hacia él las librerías habituales.

## El endpoint

```text
https://rpc.nurachain.net
```

Habla JSON-RPC de Ethereum sobre HTTPS POST y pertenece al ID de cadena `1020`. Lee ese segundo valor del endpoint y no de aquí:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` es 1020. A cada librería de abajo se le pasa ese número de forma explícita, y es deliberado: un cliente al que se le dice qué cadena espera se negará a continuar cuando el endpoint discrepe, lo que convierte un despliegue silencioso en la red equivocada en un error al arrancar.

## Una primera petición sin instalar nada

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

Los resultados vuelven como cantidades hexadecimales, no como números decimales, y eso pilla a la gente constantemente. `0x3aecc` es 241.356. Cualquier librería cliente convierte por ti; `curl` a secas no.

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

Pasar la red como segundo argumento hace dos cosas: ahorra una ida y vuelta de `eth_chainId` en el primer uso, y hace que el proveedor lance un error si el endpoint declara otra cadena. La segunda es la que merece la pena.

## viem

viem quiere un objeto chain, que es un buen sitio para tener todos los valores en una sola declaración:

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

Ese mismo objeto `nura` es el que luego le pasas a wagmi y al wallet client de viem.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

Escribir esa aserción cuesta tres segundos y ha salvado más despliegues que cualquier otra línea de este artículo.

## Leer desde el navegador

El endpoint envía cabeceras CORS permisivas, así que una página puede llamarlo directamente sin un proxy propio:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

Conviene ser claro sobre qué permite eso. Las llamadas de lectura funcionan desde el navegador. Todo lo que requiere una clave privada no pasa por este endpoint en absoluto: pasa por la cartera del usuario, que es una ruta completamente distinta y el tema de [construir una dApp en Nura Chain](/blog/build-a-dapp-on-nura-chain).

## Métodos rechazados por diseño

Pídele cuentas a un endpoint público y dice que no:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

Eso es comportamiento correcto, no una funcionalidad que falte. Un nodo RPC público no guarda claves en tu nombre, así que `eth_accounts`, `eth_sendTransaction` y `personal_*` no tienen sobre qué operar. Un endpoint que las respondiera sería un endpoint custodiando el dinero de alguien.

El camino de una transacción firmada es: constrúyela en local, fírmala en local y envía los bytes firmados con `eth_sendRawTransaction`. Cualquier librería hace esto por ti en cuanto le das una cartera en lugar de un proveedor pelado.

## Notas prácticas

- No consultes en cada render. Las lecturas de cadena son llamadas de red; cachéalas unos segundos y comparte una misma petición en vuelo entre quienes lleguen a la vez.
- Lee el ID de cadena una vez al arrancar y falla ruidosamente si no coincide, en lugar de comprobarlo en cada llamada.
- Trata una lectura fallida como fallida, no como un cero. Un saldo que se pinta como 0 porque expiró la petición es peor que uno que se pinta como error.
- No fijes precios de gas en el código. Pide datos de comisión en el momento del envío; mira [cómo funcionan las comisiones aquí](/blog/nura-chain-evm-compatibility).

## Preguntas frecuentes

### ¿Hay límite de peticiones?

Da por hecho que cualquier endpoint público está limitado, anuncie o no una cifra, y diseña para ello: caché, agrupación y retroceso ante fallos. Una aplicación que golpea un endpoint compartido en cada pulsación acabará estrangulada en algún punto, y es razonable que un operador lo haga.

### ¿Puedo usar WebSockets o suscripciones?

Compruébalo en lugar de asumirlo. Si `eth_subscribe` no está disponible, consultar `eth_blockNumber` en un intervalo sensato es el recurso portátil, y es lo que la mayoría de aplicaciones acaba haciendo de todos modos.

### ¿Por qué mi transacción nunca confirma?

La causa habitual es un precio de gas clavado, heredado de una plantilla, por debajo de la tarifa base actual. Pide datos de comisión en el momento del envío.

### ¿Puedo ejecutar mi propio nodo?

Nada de lo anterior depende de usar un endpoint alojado. Una aplicación que lea de tu propio nodo solo necesita otra URL, y esa es precisamente la propiedad que hace que esta arquitectura merezca la pena.

## Por dónde seguir

Con las lecturas funcionando, el siguiente paso es escribir: [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) cubre la configuración de Hardhat y Foundry construida sobre los valores de arriba.

Para confirmar qué aterrizó realmente en la cadena, [cómo usar el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) es la pieza complementaria. Y si llegaste sin contexto, [qué es Nura Chain](/blog/what-is-nura-chain) es el sitio por donde empezar.
