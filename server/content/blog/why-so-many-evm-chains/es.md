Hoy hay más de ochenta cadenas compatibles con EVM con actividad real, y el número sigue subiendo. Vale la pena explicarlo con honestidad, incluso desde una red que es una de las entradas de esa lista.

## La mitad barata

Todo lo que hace que una cadena sea "compatible con EVM" está disponible para copiar. El cliente de ejecución es de código abierto, la semántica de los opcodes está especificada, los nombres de los métodos JSON-RPC están documentados y el formato de dirección es un hash de una clave pública. Lanzar una red para la que Solidity compile y a la que MetaMask se conecte es, a estas alturas, un ejercicio de configuración.

No es una queja. Es la razón por la que un desarrollador puede apuntar a una cadena nueva con un cambio de una línea en vez de una reescritura, y es lo más útil que Ethereum le dio al resto del sector.

## La mitad cara

Nada de lo siguiente se copia.

- **Liquidez.** Un mercado existe donde están los que operan. No se despliega.
- **Usuarios.** La gente va donde ya funcionan las aplicaciones que quiere.
- **Presupuesto de seguridad.** Lo que cuesta atacar el consenso, que es una magnitud económica y no un interruptor.
- **Historial operativo.** Cómo se comportó la cadena durante un incidente, un pico de congestión, una actualización que salió mal. Solo el tiempo lo produce.
- **Contratos auditables ya desplegados.** Un estándar de token es código; un token en el que la gente confía es una historia.

Una cadena nueva arranca con toda la primera mitad y nada de la segunda. Esa brecha es la que la mayoría nunca cierra, y por eso el recuento sube mientras la lista de cadenas que importan cambia despacio.

## Por qué alguien lanza una de todos modos

A veces por una razón real: un mercado de comisiones que una aplicación concreta necesita, un tiempo de bloque que un juego exige, una jurisdicción, un conjunto de validadores con permisos que una institución está obligada a tener, un rollup que hereda su seguridad de otra parte.

A veces sin más razón que querer una. Ambas cosas se ven idénticas el primer día, y ese es el problema de quien tiene que elegir.

## Cómo juzgar una que acabas de conocer

Pregúntale a la cadena, no a la web de marketing.

- **¿El RPC responde con sinceridad?** Comprobar `eth_chainId` lleva diez segundos y te dice si el ID anunciado es el que se sirve.
- **¿Hay un explorador que funcione?** No un logo: un explorador donde encuentres tu propia transacción.
- **¿Quién produce bloques y cuántos son?** Un número que puedas consultar vale más que un adjetivo.
- **¿Qué hay realmente desplegado?** Contratos verificados con historial real de transacciones, o un estado vacío con una hoja de ruta.
- **¿Qué pasa si el equipo desaparece?** ¿El software del nodo es algo que podrías ejecutar tú?

Todas esas preguntas se aplican a Nura Chain. Las respuestas están pensadas para comprobarse, no para creerse: [qué es Nura Chain](/blog/what-is-nura-chain) enuncia los valores, [conectarse al RPC](/blog/connect-to-nura-chain-rpc) muestra cómo verificarlos contra el nodo, y [la guía del explorador](/blog/how-to-use-nura-chain-explorer) enseña a leer lo que hay de verdad.

La conclusión útil no es que ochenta cadenas sean demasiadas. Es que "compatible con EVM" te habla del conjunto de herramientas y casi nada de la red — y nunca pretendió hacerlo.
