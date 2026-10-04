Hoy, todos los nodos de Ethereum comprueban un bloque de la misma manera: vuelven a ejecutar cada transacción y comparan el resultado. EIP-8025 propone una segunda vía. Un probador especializado ejecuta el bloque una vez y produce una prueba zkEVM de que la ejecución fue correcta, y todos los demás comprueban la prueba, lo cual es mucho más barato que repetir el trabajo. En el AMA sobre el protocolo que la Ethereum Foundation celebró el 16 de septiembre de 2026, los investigadores describieron la generación de pruebas zkEVM como algo cercano a producción, y la propuesta es candidata para el fork Hegotá.

## Datos clave

- **La propuesta:** EIP-8025, "Pruebas de ejecución opcionales", permite que los nodos de consenso acepten un bloque basándose en pruebas zkEVM enviadas por la red peer-to-peer.
- **Opcional:** los validadores que no se adhieran "no ven ningún cambio".
- **Velocidad:** la Fundación ha informado de que el 99% de los bloques de Ethereum pueden probarse en un plazo de 10 segundos en su hardware objetivo. Llega un bloque cada 12 segundos.
- **Calendario:** ethereum.org recoge Hegotá como una actualización en planificación, con el segundo trimestre de 2027 como periodo previsto y sin fecha confirmada.
- **Estado:** propuesta para su inclusión en Hegotá, no programada.

## ¿Qué es una prueba zkEVM?

Un dato breve que te convence de que un cálculo se hizo correctamente, sin que tú lo hagas.

El probador ejecuta las transacciones del bloque y registra cada paso. A partir de ese registro construye una prueba criptográfica. Comprobar la prueba exige una fracción del esfuerzo de la ejecución, y su coste apenas crece con el tamaño del bloque. "Conocimiento cero" es la familia de matemáticas implicada; aquí no se está ocultando nada. La propiedad útil es que verificar es barato.

## ¿Por qué quiere esto Ethereum?

Porque la reejecución es lo que mantiene pequeños los bloques.

Si cada nodo debe reejecutar cada transacción en unos pocos segundos con hardware modesto, la cantidad de cómputo de un bloque queda limitada por la máquina más lenta que no estás dispuesto a excluir. Sustituye reejecutar por verificar y ese límite se mueve: como dice ethereum.org, "cuando la verificación es barata, el límite de gas puede aumentar de forma segura". Es el mismo objetivo que el de la ejecución en paralelo del próximo fork, descrita en [Glamsterdam, explicada](/blog/ethereum-glamsterdam-upgrade), alcanzado por otra ruta.

También reduce lo que cuesta operar un validador, lo cual importa para cuánta gente puede hacerlo.

## ¿Qué significa aquí "en tiempo real"?

Lo bastante rápido para seguir el ritmo de la cadena. Una prueba que llega después del siguiente bloque no sirve para el consenso, así que el presupuesto son los doce segundos entre bloques.

La media no es lo difícil. Los autores de EIP-8025 señalan que probar la mayoría de los bloques en segundos "tiene un valor limitado si un atacante puede fabricar un bloque que tarde minutos en probarse". Una red tiene que sobrevivir a su peor bloque, no al típico.

## ¿Qué sigue sin resolverse?

- **La corrección de los probadores.** Un bug en un sistema de pruebas es un bug en el consenso. El trabajo de verificación formal de este año estableció garantías para partes de la implementación RISC-V de un probador, y aun así unas comprobaciones posteriores encontraron un problema en ella.
- **Quién genera las pruebas.** Hace falta hardware serio. Si solo unos pocos operadores pueden permitírselo, comprobar un bloque se descentraliza más mientras que probarlo se descentraliza menos.
- **Diversidad.** Ethereum se apoya en varios clientes independientes para que un solo bug no pueda bifurcar la cadena. Lo mismo tiene que valer para los probadores, y ethereum.org recoge cinco en desarrollo.

Por eso el primer paso es opcional. Los nodos que verifican pruebas funcionan junto a los nodos que reejecutan, y unos y otros se comprueban entre sí.

## ¿Cambia algo para los contratos o para otras cadenas EVM?

Para los contratos, no. La propuesta es explícita: "La EVM en sí no se modifica". Solidity compila al mismo bytecode y este hace lo mismo.

Para otras redes EVM, nada se hereda automáticamente. Cada cadena decide cómo validan los bloques sus propios nodos, y nada de lo dicho aquí es una afirmación sobre los planes de Nura Chain. Lo que todas las cadenas EVM comparten es la propia capa de ejecución —el tema de [cómo ejecuta Nura Chain el bytecode de la EVM](/blog/nura-chain-evm-compatibility)—, y todo lo que se construya para probar la ejecución de la EVM se construye contra esa especificación compartida.

Los plazos que aparecen aquí son planes. El [blog sobre zkEVM de la Ethereum Foundation](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota) y [ethereum.org](https://ethereum.org/roadmap/zkevm/) recogen los actuales.
