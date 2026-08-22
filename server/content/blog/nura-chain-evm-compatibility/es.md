«Compatible con EVM» aparece en la portada de casi toda cadena lanzada en los últimos cinco años, y se usa con suficiente holgura como para merecer una definición precisa. Esto es lo que significa concretamente en Nura Chain, lo que puedes verificar por tu cuenta y lo que no te da.

## Qué es realmente la EVM

La Máquina Virtual de Ethereum es la especificación de una máquina de pila. Define un conjunto de instrucciones, un coste de gas por instrucción, un modelo de memoria y almacenamiento, y un conjunto de contratos precompilados en direcciones fijas.

Solidity y Vyper no compilan a «Ethereum». Compilan a bytecode de la EVM. Esa separación es toda la razón por la que las cadenas pueden ser compatibles entre sí: un contrato es un bloque de bytecode más una ABI que describe cómo llamarlo, y cualquier máquina que implemente el mismo conjunto de instrucciones ejecuta ese bloque igual.

Así que «compatible con EVM» es una afirmación sobre la capa de ejecución. No dice nada sobre consenso, validadores, finalidad o gobernanza, y una cadena puede ser plenamente compatible con la EVM y diferir de Ethereum en todos esos puntos.

## Qué implementa Nura Chain

La red responde a la interfaz JSON-RPC estándar de Ethereum, y puedes comprobarlo sin instalar nada.

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}'
```

El nodo se identifica como una implementación en Go, que es el linaje sobre el que corren la mayoría de las redes EVM: go-ethereum y los clientes derivados de él.

De una cabecera de bloque se lee más que de cualquier página de marketing. Pide la última:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

La cabecera que vuelve lleva `baseFeePerGas`, un `difficulty` de `0x0`, un `mixHash` a cero y un `withdrawalsRoot`. Esa es la forma que producen los clientes modernos de Ethereum tras la Fusión y tras el cambio de mercado de comisiones de London, y de ahí se siguen dos hechos prácticos. Las comisiones son EIP-1559 en lugar de un precio de gas plano, y los campos de prueba de trabajo como `difficulty` no significan nada aquí: el código que se bifurca según una dificultad distinta de cero se comportará de forma extraña, igual que hoy en Ethereum.

## Las comisiones siguen EIP-1559

Los bloques llevan una tarifa base fijada por el protocolo, y quien envía añade encima una tarifa de prioridad. Ambas son legibles:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_maxPriorityFeePerGas","params":[]}'
```

En el momento de escribir esto la tarifa base está en 1 gwei y el límite de gas por bloque en 150.000.000. Ambos son valores que conviene leer en tiempo de ejecución y no fijar en el código: para eso están `eth_feeHistory` y la estimación de comisiones de las librerías, y un script de despliegue con un `gasPrice` clavado es la causa más común de que una transacción se quede sin minar.

Como el mercado de comisiones es el estándar, `ethers`, `viem`, `web3.py` y cualquier cartera construida en los últimos años arman aquí transacciones de tipo 2 sin configuración. No hay nada específico de Nura que enseñarles.

## Qué no te da la compatibilidad

Esta es la parte que suele omitirse.

- No te da estado compartido. Tu dirección existe en ambas redes porque deriva de la misma clave, pero saldos, código de contratos e historial son libros separados. Un activo enviado a «la misma dirección en otra cadena» no se ha movido entre ellas.
- No te da contratos compartidos. Un contrato desplegado en Ethereum no está desplegado aquí. Lo vuelves a desplegar y obtiene otra dirección, salvo que uses deliberadamente un desplegador determinista.
- No te da el modelo de seguridad de Ethereum ni su conjunto de validadores. Eso son propiedades del consenso, y la compatibilidad EVM es una afirmación sobre la ejecución.
- No garantiza costes de gas idénticos para siempre. Cada cadena adopta las actualizaciones de la EVM en su propio calendario, así que un contrato barato en una puede no serlo en otra.

La mayoría de las pérdidas reales vienen de dar el primer punto por sabido, y solo por eso merece repetirse.

## Cómo comprobar todo esto tú mismo

Cada afirmación de arriba está a una petición de distancia, y ese es justamente el punto. Una cadena que responde con honestidad a `eth_chainId`, `eth_getBlockByNumber` y `web3_clientVersion` es una cadena que puedes caracterizar en un minuto, sin confiar en ninguna página de documentación, incluida esta.

El hábito que conviene adquirir: antes de desplegar algo de valor, lee el ID de cadena del endpoint que vas a usar y compáralo con el que declara la configuración de tu framework. Discrepan más a menudo de lo que uno esperaría, normalmente porque la configuración se copió de otro proyecto.

## Preguntas frecuentes

### ¿Puedo desplegar un contrato Solidity existente sin cambios?

Normalmente sí, siempre que no dependa de un ID de cadena concreto, de una dirección de contrato fijada en otra red, o de un oráculo que aquí no existe. Esas tres son las fuentes reales de fricción, no el bytecode.

### ¿Qué versión de Solidity debería usar?

Una cuyo objetivo de EVM soporte la red. Lo prudente es compilar para un objetivo bien asentado en lugar del más nuevo disponible, y probar el despliegue con un contrato desechable antes de comprometer uno real.

### ¿Los costes de gas son iguales que en Ethereum?

Los costes por instrucción vienen de la especificación de la EVM, así que la forma es la misma. Lo que cambia es el precio del gas, que lo fija el mercado de comisiones de esta red y no el de Ethereum.

## Por dónde seguir

Para empezar a hacer llamadas, lee [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc), que cubre el endpoint, las librerías cliente y los errores que conviene reconocer.

Si todavía estás decidiendo si una cadena EVM es el objetivo adecuado, [por qué los desarrolladores eligen una blockchain compatible con EVM](/blog/why-build-on-an-evm-compatible-chain) aborda esa pregunta de frente. Y para una descripción general de la red, mira [qué es Nura Chain](/blog/what-is-nura-chain).

Cuando estés listo para poner algo en cadena, [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) es el siguiente paso.
