Nura Chain es una blockchain pública que ejecuta la Máquina Virtual de Ethereum. Se identifica con el ID de cadena `1020`, sella un bloque cada tres segundos, tarifica las transacciones con el mercado de tarifas EIP-1559 y paga la computación en su moneda nativa, NURA. Alrededor de la red hay una cartera de autocustodia, un explorador de bloques, un swap y un puente, todos accesibles hoy.

Este documento es la descripción de referencia de la red: qué es, cómo funciona, para qué sirve su moneda y cómo se reparte el suministro, qué existe a su alrededor y qué puede verificar un lector contra la cadena en lugar de aceptarlo por confianza. Está escrito para tres lectores a la vez: quien está decidiendo si tener NURA, quien está a punto de construir sobre la red y quien simplemente quiere saber qué está mirando.

## 1. Introducción

La mayoría de la gente conoce una blockchain nueva a través de un diálogo de cartera que pide cinco valores, y los pega sin saber qué significa ninguno de ellos. Nura Chain está construida para ser la experiencia contraria. Cada cifra que afirma este documento o bien puede leerse de la propia cadena o bien está claramente marcada como una afirmación publicada, y las herramientas que rodean la red son las que el ecosistema EVM en general ya utiliza.

El nombre designa una sola cosa: la red. Los productos construidos sobre ella —Nura Wallet, Nura Explorer, Nura Swap— se describen en la sección 7 y son independientes de la cadena a la que sirven. Cualquier cartera EVM que acepte una red personalizada puede usar Nura Chain; la cartera del propio proyecto es una puerta de entrada, no la única.

## 2. Principios de diseño

Cuatro decisiones dan forma a todo lo que sigue.

- **Ejecución familiar.** La red ejecuta la EVM sin cambios, de modo que los contratos, las librerías, las claves y las direcciones se trasladan desde Ethereum sin modificación. El primer día de un desarrollador en Nura Chain es una entrada de configuración, no una reescritura.
- **Autocustodia por defecto.** Nura Wallet nunca guarda una clave y no puede mover un saldo. La red no tiene recuperación de cuentas, ni congelación, ni ninguna vía de gasto privilegiada; quien tiene la clave tiene la moneda.
- **Verificable antes que confiable.** El ID de cadena, el intervalo de bloque, el mercado de tarifas y la identidad de cada productor de bloques pueden leerse por RPC público. Donde una cifra no puede leerse de la cadena —el suministro total es el caso importante— este documento lo dice en lugar de insinuar lo contrario.
- **Una superficie pequeña, descrita con honestidad.** La red entrega menos piezas de las que podría enumerar una página de marketing, y cada una de ellas se describe aquí con sus límites, incluidos los incómodos.

## 3. La red

### 3.1 Ejecución: la Máquina Virtual de Ethereum

Nura Chain ejecuta bytecode de la EVM. Un contrato compilado con Solidity o Vyper para la EVM corre aquí con la misma semántica, los mismos costes de instrucción y el mismo espacio de direcciones de 20 bytes que tendría en Ethereum. El nodo responde a la interfaz JSON-RPC estándar de Ethereum, así que ethers.js, viem, web3.py, wagmi, Hardhat y Foundry funcionan contra él sin más que un endpoint y un ID de cadena.

La compatibilidad es una afirmación únicamente sobre la capa de ejecución. Una dirección que se controla en Ethereum se controla aquí, porque deriva de la misma clave secp256k1, pero los saldos, los contratos desplegados y el historial son libros contables separados. Nada de lo que se envíe a «la misma dirección en otra cadena» se traslada entre ellas. La sección 9 vuelve sobre esto porque es de donde proceden la mayoría de las pérdidas reales.

### 3.2 Bloques, tiempo y tarifas

La red sella un bloque cada tres segundos. El intervalo es fijo y no un objetivo: las cabeceras consecutivas difieren exactamente en tres segundos. El primer bloque de la cadena lleva una marca de tiempo del 6 de junio de 2026, 00:00 UTC.

Las transacciones se tarifican con el mercado de tarifas EIP-1559. Cada bloque lleva una tarifa base fijada por el protocolo, y el remitente añade encima una tarifa de prioridad; el campo `baseFeePerGas` de cada cabecera y los métodos `eth_maxPriorityFeePerGas` y `eth_feeHistory` exponen ambas. En el momento de esta revisión, la tarifa base está en 1 gwei y el límite de gas por bloque es de 150.000.000 de gas. Ambos son valores para leer en tiempo de ejecución y no para fijar en el código, que es lo que hace por defecto la estimación de tarifas de una librería.

Las cabeceras tienen la forma que producen los clientes modernos de Ethereum: un `difficulty` de cero, un `nonce` vacío, un `mixHash` de cero y los campos introducidos por las actualizaciones Shanghai, Cancun y Prague: `withdrawalsRoot`, `parentBeaconBlockRoot`, `blobGasUsed` y `requestsHash`. El código que se bifurca ante una dificultad distinta de cero, o que espera que los campos de prueba de trabajo signifiquen algo, se comportará mal aquí exactamente igual que lo hace hoy en Ethereum.

### 3.3 Producción de bloques

Nura Chain no usa prueba de trabajo; los campos de cabecera de arriba lo descartan. Los bloques los sella un productor de bloques autorizado según el calendario fijo descrito arriba. La cuenta que selló un bloque queda registrada en su campo `miner`, de modo que el productor de cualquier bloque es un hecho público y no una afirmación en un documento.

En esta revisión, cada bloque muestreado fue sellado por la misma cuenta productora. El tamaño del conjunto de productores es una cuestión de cómo se opera la red, no de su capa de ejecución, y este documento no lo fija. Cualquier cambio en él se anuncia por los canales del proyecto enumerados en la sección 11.

La red no expone ninguna señal de finalidad separada por RPC. La inclusión en un bloque sellado es la confirmación que muestran las carteras y el explorador, y como los bloques llegan según un calendario, una transacción incluida es visible en el plazo de un intervalo.

### 3.4 Identidad de la red

Estos son los valores que pide una cartera o una librería cliente. Son los mismos valores que lleva la tarjeta de la red en el sitio, y los mismos que guarda Nura Wallet.

- Nombre de la red: Nura Chain
- ID de cadena: `1020`, que las carteras piden en hexadecimal como `0x3fc`
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de bloques: `https://explorer.nurachain.net`
- Moneda nativa: Nura, símbolo `NURA`, 18 decimales
- Tiempo de bloque: 3 segundos

El ID de cadena es más que una etiqueta. Bajo EIP-155 se firma dentro de cada transacción, de modo que una transacción firmada para la cadena 1020 no puede reproducirse en ninguna otra red, y una transacción firmada para otra red se rechaza aquí. Es también el valor que hay que comprobar antes de confiar en todo lo demás, incluida esta página:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La respuesta es `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. A una cartera compatible con EIP-3085 se le pueden entregar todos los valores de arriba en una sola petición, que es lo que hace el control «Añadir Nura Chain a la billetera» del sitio.

## 4. La moneda nativa

NURA es la moneda nativa de la red. Paga el gas: cada transacción consume gas, el gas se tarifica en NURA y una cuenta necesita saldo antes de poder enviar nada en absoluto, incluido su primer despliegue de contrato. Es el papel que juega el ether en Ethereum, y la unidad más pequeña es igualmente una milmillonésima de milmillonésima de moneda.

Como es nativa y no un contrato, NURA no tiene dirección de token. Una página que pide «la dirección del contrato de NURA» para añadir la moneda está pidiendo algo que no existe; lo que hace aparecer el saldo es añadir la red. Los tokens ERC-20 existen en Nura Chain como contratos corrientes, y NURA no es uno de ellos.

## 5. Suministro y asignación

### 5.1 Suministro total

El suministro total publicado es de 1.000.000.000 NURA: mil millones.

Es una cifra publicada, no legible en cadena, y la distinción importa. Un ERC-20 expone `totalSupply()` porque es un contrato que lleva su propio libro; la emisión de una moneda nativa vive en la configuración del cliente y en el estado génesis, y no existe `eth_totalSupply`. Cualquier saldo individual puede leerse con `eth_getBalance`; el total, no.

El suministro circulante no se indica en esta revisión a propósito. El circulante depende de qué asignaciones cuentan como desbloqueadas en un momento dado, y eso es un juicio y no una medición, salvo que cada asignación bloqueada esté en una dirección publicada que cualquiera pueda vigilar.

### 5.2 Asignación

El total se divide en seis partes. Los porcentajes, el número de tokens que implican y las condiciones declaradas de cada porción son:

- **Bloqueado — 40%, 400.000.000 NURA.** Bloqueado durante un año. Qué ocurre con él se decidirá al terminar ese periodo, y cualquier decisión sobre esta porción requiere la aprobación de un voto de al menos el 65% de la red.
- **Liquidez — 25%, 250.000.000 NURA.** Asignado a lo largo de un año a proveer y gestionar liquidez, con el objetivo de una liquidez de negociación funcional y un ecosistema NURA más estable.
- **Comunidad — 10%, 100.000.000 NURA.** Distribuido entre miembros de la comunidad durante un año, para quienes ayudan a crecer la red con actividad, participación, desarrollo, referidos u otras aportaciones efectivas en lugar de pagando. La asignación sigue a la revisión y aprobación del consejo de gestión.
- **Venta pública — 10%, 100.000.000 NURA.** Ofrecido en una venta pública con un precio total de 24.000 dólares, lo que sale a 0,00024 dólares por NURA.
- **Tesorería — 10%, 100.000.000 NURA.** Asignado a lo largo de un año, bajo supervisión del consejo de gestión, a desarrollo del ecosistema, infraestructura, productos, alianzas y otras necesidades del proyecto.
- **Airdrop — 5%, 50.000.000 NURA.** Distribuido como airdrop a lo largo de un año. Los receptores se identifican mediante canales y comunidades seleccionados, y la asignación final la confirma el consejo de gestión.

Esas seis partes suman el 100%. El precio de la venta pública es una condición fija de esa venta, no una cotización de mercado, y no debe leerse como una valoración de la moneda.

### 5.3 Verificar un saldo

Todos los saldos de la red son públicos. Cualquier dirección, incluida cualquiera que el proyecto publique para una asignación, puede leerla cualquiera:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

La respuesta va en wei, codificada en hexadecimal; divide entre 10^18 para obtener NURA. Nura Explorer muestra la misma cifra, y leer ambas es la costumbre que este documento recomienda de principio a fin.

## 6. Gobernanza

En esta revisión se declaran dos reglas de gobernanza para la red, y ambas conciernen a la asignación de arriba y no al protocolo.

El 40% bloqueado del suministro no puede liberarse, reasignarse ni decidirse de ningún otro modo sin la aprobación de un voto de al menos el 65% de la red. Ese umbral es la única regla vinculante sobre la mayor porción individual del suministro.

Las porciones de comunidad, tesorería y airdrop —el 25% del suministro entre las tres— se asignan bajo la revisión y supervisión de un consejo de gestión, que confirma cada distribución.

No se reclama aquí ningún otro mecanismo de gobernanza. Los parámetros propios del protocolo —el intervalo de bloque, el mercado de tarifas, el conjunto de productores— los fijan los operadores de la red, y este documento no describe un sistema de votación en cadena para ellos porque no hay ninguno desplegado.

## 7. El ecosistema

### 7.1 Nura Wallet

Nura Wallet es una cartera de autocustodia hecha para la red. Las claves privadas se generan y se guardan en el dispositivo, y la cartera no puede gastar un saldo por sí sola. Su código fuente y sus versiones se publican en GitHub.

Está construida como aplicación nativa y no como extensión de navegador. Se publican compilaciones para Android, tanto en Google Play como en APK universal, para Windows como instalador x64 y para Linux como paquete Debian amd64. Las compilaciones para iOS y macOS aún no están publicadas. Cada compilación y arquitectura figura en la página de versiones de la cartera.

Como es una aplicación, una página web no tiene dónde inyectarse fuera del navegador integrado de la propia cartera. Por eso el sitio la alcanza de dos maneras: mediante el anuncio de proveedor EIP-6963 dentro de ese navegador, y en todos los demás casos mediante un enlace profundo `nurawallet://` que lleva la petición a la app y devuelve la respuesta a la página. Cualquier otra cartera EVM alcanza la red mediante la petición corriente de añadir cadena de EIP-3085.

### 7.2 Nura Explorer

Nura Explorer indexa bloques, transacciones y transferencias de la red. Es donde se confirma que una transacción ocurrió, donde pueden leerse el código y las llamadas de un contrato, y donde el productor de bloques de la sección 3.3 puede verse en cada bloque. Lee la misma cadena que sirve el endpoint RPC, y por eso comprobar ambos merece los diez segundos.

### 7.3 Nura Swap

Nura Swap es una interfaz de intercambio para la red. Su pool cotiza el precio de NURA frente a una representación envuelta de la moneda, y esa cotización es la que el sitio muestra como precio de NURA.

El pool es pequeño, así que una sola operación puede mover mucho la cotización. Es un precio de mercado de un solo pool, no un listado en un exchange, y por esa razón este documento no indica un precio.

### 7.4 El puente

Un puente acuña representaciones de BNB y USDT en Nura Chain como contratos ERC-20 corrientes. Ambos son tokens de acuñación y quema, no bóvedas: una unidad existe en Nura solo porque una unidad quedó bloqueada en la cadena de origen. Sus contratos en Nura son:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

El valor puenteado a la red es, por tanto, el `totalSupply()` de cada token, que es como el sitio calcula el valor total bloqueado. Esa cifra mide el derecho acuñado en Nura; solo equivale al colateral mientras el puente sea solvente y esté respaldado uno a uno. El saldo del custodio en la cadena de origen es el lado autoritativo, y es la cifra que comprueba un lector cuidadoso.

## 8. Construir en Nura Chain

Nada en una cadena de herramientas de Solidity es específico de esta red. Un despliegue es una entrada de red con el endpoint RPC y el ID de cadena de la sección 3.4, financiada con NURA suficiente para pagar el gas. Hay tres puntos de fricción que conviene conocer antes del primer despliegue.

- Lee el ID de cadena del endpoint y compáralo con la configuración del framework. Los dos discrepan más a menudo de lo esperado, normalmente porque la configuración se copió de otro proyecto.
- Deja que la librería estime las tarifas. La tarifa base y la tarifa de prioridad pueden leerse en tiempo de ejecución, y un precio de gas fijado a mano es la razón más común de que una transacción se quede sin minar.
- Un contrato desplegado en otro sitio no está desplegado aquí. Volver a desplegarlo asigna una dirección nueva salvo que se use deliberadamente un desplegador determinista, y cualquier dependencia fija de contratos u oráculos de otra red debe revisarse.

El endpoint RPC envía cabeceras CORS permisivas, de modo que una página que corre en el navegador puede leer directamente de la cadena sin un servidor en medio. El blog del proyecto lleva guías paso a paso para conectarse, desplegar un contrato y emitir un ERC-20.

## 9. Seguridad y riesgo

- **La autocustodia es una responsabilidad.** No hay vía de recuperación para una frase semilla perdida, ni en esta red ni en ninguna otra, y ninguna parte puede revertir una transacción una vez sellada.
- **Un ID de cadena equivocado es como se pierden fondos.** Verifica `1020` contra el endpoint antes de guardar la red en una cartera, y trata cualquier página —incluida esta— como una afirmación que comprobar.
- **La compatibilidad no es estado compartido.** Los activos no se trasladan entre cadenas por enviarse a la misma dirección. Solo el puente de la sección 7.4 lleva BNB o USDT a la red, y solo dentro de los límites indicados allí.
- **La cotización del swap es poco profunda.** Un precio leído de un solo pool pequeño no es una valoración, y una sola operación puede moverlo.
- **El puente conlleva riesgo de custodia.** Una representación acuñada vale su colateral solo mientras el custodio del lado de origen lo mantenga uno a uno.
- **Algunas cifras son afirmaciones publicadas.** El suministro total y las condiciones de asignación de la sección 5 no pueden confirmarse por RPC. Donde el proyecto publique direcciones de asignación, sus saldos pueden leerse con la llamada de la sección 5.3.
- **La producción de bloques está concentrada.** La sección 3.3 declara sin rodeos el conjunto de productores observado, para que un lector pueda sopesarlo ahora en lugar de descubrirlo más tarde.

## 10. Aviso legal

Este documento describe la red tal como es en la revisión indicada. No es una oferta, una solicitud ni asesoramiento de inversión, y nada en él debe leerse como una promesa sobre el precio, la liquidez o la disponibilidad futuros de NURA. Las cifras marcadas como afirmaciones publicadas son declaraciones del proyecto; cualquier otra cifra puede comprobarse contra la cadena con las llamadas mostradas. Las revisiones posteriores sustituyen a esta, y el número y la fecha de revisión al principio del documento identifican cuál tiene el lector en sus manos.

## 11. Referencias

- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de bloques: [Nura Explorer](https://explorer.nurachain.net)
- Swap: [Nura Swap](https://swap.nurachain.net/)
- Versiones de la cartera: [Nura Wallet en GitHub](https://github.com/NuraChain/Wallet/releases)
- Código fuente: [NuraChain en GitHub](https://github.com/NuraChain)
- Comunidad: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Estándares: [EIP-155](https://eips.ethereum.org/EIPS/eip-155) (protección contra repetición), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) (mercado de tarifas), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) (añadir una cadena a una cartera), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) (descubrimiento de carteras)
- Guías: [Qué es Nura Chain](/blog/what-is-nura-chain), [conectarse al RPC](/blog/connect-to-nura-chain-rpc), [añadir la red a una cartera](/blog/add-nura-chain-to-your-wallet), [desplegar un contrato](/blog/deploy-a-smart-contract-on-nura-chain), [suministro y asignación](/blog/nura-coin-tokenomics)
