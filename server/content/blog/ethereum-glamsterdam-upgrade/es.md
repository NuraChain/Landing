Ethereum publica actualizaciones de protocolo con una cadencia de unos seis meses, y Glamsterdam es la siguiente de la lista. Entró en su fase final de desarrollo en junio de 2026 y se espera que se active en la segunda mitad del año. Si escribes Solidity o ejecutas un nodo, conviene saber qué trae antes de que llegue.

## Los dos cambios que importan

Los puntos destacados son las listas de acceso a nivel de bloque y la separación entre proponente y constructor integrada en el protocolo.

- **Las listas de acceso a nivel de bloque** publican por adelantado qué cuentas y qué ranuras de almacenamiento tocará un bloque. Un nodo que conoce la lista de antemano puede leer ese estado en paralelo y ejecutar a la vez las transacciones que no se solapan, en lugar de estrictamente una detrás de otra.
- **La separación entre proponente y constructor integrada** escribe dentro del propio protocolo la división entre el validador que propone un bloque y el constructor que lo ensambla, en vez de dejarla en manos de relés fuera de la cadena en los que todos confían y que nadie está obligado a operar.

Ninguno de los dos cambia el bytecode al que compilan tus contratos. Ambos cambian lo que cabe en un bloque.

## En el fondo, esto va del límite de gas

La ejecución secuencial es la razón de que el límite de gas de la red principal siga siendo conservador: cada nodo reejecuta cada transacción en orden. Cuando un bloque declara por adelantado sus accesos al estado, esa reejecución deja de ser el cuello de botella y el techo puede subir. Las cifras que se discuten van desde unos 60 millones de gas por bloque hoy hasta algo cercano a 200 millones.

Más gas por bloque es más espacio para los mismos contratos, no para otros distintos. Es un cambio de capacidad, no de lenguaje.

## Qué tienes que hacer realmente

Muy poco, si usas herramientas habituales.

- Solidity, Hardhat y Foundry apuntan a la EVM, y estas propuestas no cambian la semántica de los opcodes contra los que escribes.
- Librerías como ethers.js y viem ya construyen transacciones EIP-1559 por defecto, que es la parte del mercado de comisiones que nota tu usuario.
- Si operas tu propio nodo o un indexador, lee bien las notas de la versión. Lo que cambia es la estructura del bloque, y la estructura del bloque es lo que parsea la infraestructura.

## Qué significa en otras cadenas EVM

Las redes EVM no heredan automáticamente las actualizaciones de Ethereum. Cada cadena decide qué EIP adopta y cuándo. Lo que sí heredan es el conjunto de herramientas, y eso es lo que convierte una red nueva en una entrada de configuración en lugar de una reescritura.

Nura Chain ya tarifica las transacciones con una comisión base EIP-1559, igual que Ethereum desde London, así que cualquier librería escrita en los últimos años funciona sin modificaciones. La mecánica está en [cómo Nura Chain ejecuta bytecode EVM](/blog/nura-chain-evm-compatibility), y el endpoint en [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).

Los calendarios de actualización se mueven. Consulta [ethereum.org](https://ethereum.org) y no esta página antes de planificar sobre una fecha.
