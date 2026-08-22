Nura Chain es una blockchain pública que ejecuta la Máquina Virtual de Ethereum (EVM). Si alguna vez has escrito un contrato en Solidity, has añadido una red a MetaMask o has llamado a un endpoint JSON-RPC de Ethereum, casi todo lo que ya sabes se aplica aquí sin cambios: el mismo modelo de cuentas, el mismo formato de transacción, las mismas herramientas.

Esta página es la descripción llana. Qué es la red, qué valores necesitas para hablar con ella y qué existe realmente a su alrededor hoy.

## La red de un vistazo

Estos son los valores que te pedirá una cartera o una librería cliente.

- Nombre de la red: Nura Mainnet
- ID de cadena: `1020`, que las carteras piden en hexadecimal como `0x3fc`
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de bloques: `https://explorer.nurachain.net`
- Moneda nativa: Nura Coin, símbolo `NURA`, 18 decimales
- Tiempo de bloque: unos 3 segundos

No des nada de eso por bueno sin comprobarlo, tampoco viniendo de esta página. El propio endpoint declara su ID de cadena si se lo preguntas:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La respuesta es `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`, y `0x3fc` es 1020 en decimal. Esa comprobación cuesta diez segundos y es la costumbre más útil que puedes adquirir antes de añadir una red a tu cartera. Un ID de cadena equivocado es exactamente lo que hace que alguien acabe firmando en una red que no pretendía usar.

## Qué significa en la práctica ser compatible con la EVM

La Máquina Virtual de Ethereum es el entorno de ejecución que Ethereum definió para los contratos inteligentes. Una cadena que la ejecuta corre el mismo bytecode compilado, responde a los mismos nombres de método JSON-RPC y usa el mismo formato de dirección de 20 bytes.

Para quien construye, esto tiene tres consecuencias concretas.

- Los contratos compilan con las herramientas que ya tienes. Solidity, Hardhat y Foundry apuntan a la EVM y no a una red concreta, así que una cadena nueva es una entrada de configuración, no una reescritura.
- Las librerías cliente funcionan sin modificar. ethers.js, viem, web3.py y wagmi hablan JSON-RPC, de modo que apuntarlas a otro sitio es un cambio de una línea.
- Las claves y las direcciones te acompañan. Las mismas claves secp256k1, las mismas rutas de derivación, las mismas direcciones con checksum.

Lo que no significa es que ambas cadenas compartan nada. Una dirección que controlas en Ethereum también la controlas aquí, porque deriva de la misma clave, pero los saldos, los contratos desplegados y el historial son libros contables completamente separados. Enviar un activo a la misma dirección en otra cadena no lo traslada de una a otra.

Los bloques aquí llevan una tarifa base EIP-1559, así que las transacciones se tarifican como en Ethereum desde London: una tarifa base que el protocolo fija por bloque, más la tarifa de prioridad que decidas añadir. Cualquier librería escrita en los últimos años lo hace por defecto. Hay más detalle en [cómo ejecuta Nura Chain el bytecode de la EVM](/blog/nura-chain-evm-compatibility).

## Qué existe hoy alrededor de la red

Hay tres cosas vivas y accesibles ahora mismo, y conviene ser preciso sobre cuáles son.

- El endpoint RPC. `https://rpc.nurachain.net` responde al JSON-RPC estándar de Ethereum y envía cabeceras CORS permisivas, de modo que una página en el navegador puede leer directamente de él. Lo tratamos en [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).
- El explorador de bloques. [Nura Explorer](https://explorer.nurachain.net) indexa bloques, transacciones y transferencias. Es donde confirmas que algo que enviaste ocurrió de verdad, y se explica en [cómo leer el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer).
- Nura Wallet, una cartera de autocustodia con versiones para Android, Windows y Linux. No es la única puerta de entrada: sirve cualquier cartera EVM que acepte una red personalizada, que es lo que recorre [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet).

También existe un puente que acuña representaciones envueltas de BNB y USDT sobre Nura como contratos ERC-20 corrientes, y una interfaz de intercambio en `https://swap.nurachain.net`.

## La moneda nativa

Nura Coin, con símbolo `NURA`, es el activo nativo de la red, con 18 decimales, que es la convención de la EVM y no una decisión tomada aquí. Paga el gas igual que el ether en Ethereum. Cada transacción consume gas, el gas se tarifica en NURA y una cuenta necesita saldo antes de poder enviar nada en absoluto, incluido su primer despliegue de contrato.

El suministro total es de 1.000.000.000 NURA. Cómo se reparte y para qué sirve cada porción está detallado en [suministro y asignación de Nura Coin](/blog/nura-coin-tokenomics).

## Preguntas frecuentes

### ¿Es Nura Chain un fork de Ethereum?

Ejecuta la misma máquina virtual y responde a la misma interfaz RPC, que es lo que permite que las herramientas de Ethereum funcionen sin modificar. Eso es una afirmación sobre compatibilidad, no sobre historial ni estado compartidos. Las dos redes llevan libros separados.

### ¿Puedo usar MetaMask?

Sí. Cualquier cartera que permita añadir una red EVM personalizada puede apuntarse a Nura Chain con los valores de arriba, y el paso a paso está en [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet).

### ¿Necesito NURA antes de poder hacer algo?

Para leer la cadena, no. El endpoint RPC responde llamadas de lectura a cualquiera, y por eso un explorador puede mostrarte la red entera sin que tengas cuenta. Para enviar una transacción o desplegar un contrato, sí: el gas se paga en NURA.

### ¿Cómo de rápidos son los bloques?

Unos tres segundos entre uno y otro, medido sobre bloques recientes. Ese es el ritmo al que la cadena produce bloques, que no es lo mismo que una garantía sobre cuándo se incluirá una transacción concreta.

## Por dónde seguir

Si has venido a usar la red, empieza por [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet). Lleva alrededor de un minuto y todo lo demás depende de ello.

Si has venido a construir, arranca en [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) y sigue con [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
