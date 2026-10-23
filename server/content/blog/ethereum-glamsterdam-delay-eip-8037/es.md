El 22 de octubre de 2026 los desarrolladores principales de Ethereum aplazaron la activación de Glamsterdam en la testnet Hoodi, prevista para el 26 de octubre, para investigar cómo interactúa la EIP-8037 con los contratos inteligentes que ya están en la red principal. La decisión se tomó en la llamada All Core Devs Execution número 248, según la Ethereum Foundation. El detonante fue una revisión de seguridad, y ChainSecurity ha dicho después que encontró 13 contratos reales que podrían verse afectados. No hay nueva fecha ni para la testnet ni para la red principal.

## Datos clave

- **Qué:** el fork de Glamsterdam en Hoodi, programado para el 26 de octubre de 2026 a las 17:42:48 UTC, queda aplazado, junto con el paso que iba a elevar el límite de gas de Hoodi a 200 millones.
- **Quién lo decidió:** los desarrolladores principales en la llamada All Core Devs Execution (ACDE) número 248, el 22 de octubre, según la Ethereum Foundation.
- **Por qué:** la EIP-8037, que cambia el precio de la creación de estado y lo mide por separado. El análisis de ChainSecurity del 13 de octubre la estudia junto con la EIP-8038.
- **El riesgo:** los contratos que juzgan una llamada fallida por el gas que queda podrían tratar una operación reintentable como fallida para siempre, sin ningún cambio en su código.
- **La cifra:** 13 contratos reales potencialmente afectados, según ChainSecurity, que está llevando a cabo una divulgación responsable y no los ha nombrado.
- **Nueva fecha:** ninguna. El orden del día de la llamada incluía el 1, el 8 y el 9 de diciembre como fechas de red principal para debatir; ninguna se confirmó.

## ¿Qué cambia la EIP-8037?

Encarece la creación de estado nuevo (cuentas nuevas, posiciones de almacenamiento y código de contratos) y mide ese coste aparte del gas de ejecución ordinario. El objetivo declarado de la propuesta es contener el crecimiento del estado de Ethereum a medida que sube el límite de gas por bloque. La medición separada es lo que permite subir el límite sin que los cargos de estado más altos desplacen todo lo demás.

Según la lectura que ChainSecurity hacía de la especificación a 13 de octubre, escribir una posición de almacenamiento nueva llevaría un cargo de estado de 97.920 de gas además de su coste de ejecución. Ese cargo se paga primero desde una reserva de gas separada, y la reserva pasa entera a cada llamada que hace un contrato. Cuando la creación de estado se deshace dentro de una transacción, el gas vuelve de inmediato.

## ¿Por qué es un riesgo para contratos ya desplegados?

Porque algunos contratos toman decisiones según cuánto gas queda.

El ataque se llama insufficient gas griefing, o sabotaje por gas insuficiente. Alguien lanza una operación válida pero aporta justo un poco menos de gas del necesario para que tenga éxito, dejando suficiente para que el contrato que llama registre el fallo. Un contrato cuidadoso se defiende comprobando el gas restante tras una llamada fallida: si queda demasiado poco, supone que la llamada se quedó sin gas y revierte todo, para que la operación pueda intentarse otra vez.

Esa comprobación descansa en una suposición que ha valido durante años: el gas solo baja. Con las nuevas reglas puede volver, por una recarga o por un contrato intermedio que crea estado y luego revierte. Un manejador de fallos que antes se quedaba sin gas ahora podría terminar, y un contrato podría marcar el retiro o la reclamación de un usuario como fallidos para siempre. El investigador pcaversaccio lo resumió en un comentario en el orden del día de la llamada: «Lo fundamentalmente "roto" es que `gasleft()` puede aumentar».

Nada en el bytecode desplegado tiene que cambiar para que esto ocurra. Lo que cambia es el entorno que tiene debajo.

## ¿Qué ha cambiado desde nuestro artículo anterior sobre Glamsterdam?

Nuestra [explicación de septiembre sobre Glamsterdam](/blog/ethereum-glamsterdam-upgrade) cubría las dos piezas principales del fork, las listas de acceso a nivel de bloque y la separación proponente-constructor inscrita en el protocolo, y decía que no tocan los opcodes sobre los que escribes. Eso sigue siendo cierto para esas dos. No cubría el cambio de precios del gas de la EIP-8037 y la EIP-8038, que modifica lo que cuestan las operaciones y, como se ha visto, cómo se comporta el gas durante una llamada. Su previsión de que el fork se activaría en la segunda mitad del año queda ahora abierta, porque no hay fecha.

## ¿Qué deberías hacer?

- **Si escribes contratos:** el consejo de ChainSecurity es dejar que una llamada fallida revierta toda la operación cuando puedas y, cuando no, mantener una vía de recuperación en lugar de tomar una decisión irreversible basada en el gas restante. Prueba los manejadores de fallos con el esquema de gas actual y con el de Glamsterdam, y no tomes un umbral ajustado como prueba de seguridad.
- **Si operas un nodo o validador en Hoodi:** actualiza los clientes de ejecución y de consenso antes del 26 de octubre a versiones que eliminen explícitamente la activación, o vuelve a una versión anterior que no la incluya, según la Ethereum Foundation.
- **Si tienes ETH o usas la red principal:** nada, según la Foundation.

## ¿Afecta esto a otras cadenas EVM?

No automáticamente. Las redes EVM no heredan las actualizaciones de Ethereum; cada cadena decide qué EIP adopta y cuándo. Cómo ejecuta Nura Chain el bytecode EVM se explica en [la compatibilidad EVM de Nura Chain](/blog/nura-chain-evm-compatibility). La lección más amplia, que un código auditado puede fallar porque cambia lo que lo rodea, es el argumento de [por qué se vacían los contratos auditados](/blog/why-audited-contracts-get-drained).

El análisis técnico es de [ChainSecurity](https://www.chainsecurity.com/blog/glamsterdam-gas/), la propuesta es la [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037) y el orden del día de la llamada es [ACDE #248](https://github.com/ethereum/pm/issues/2267). La decisión y sus instrucciones están en el [anuncio de la Ethereum Foundation](https://blog.ethereum.org/2026/10/22/glamsterdam-hoodi-delay).
