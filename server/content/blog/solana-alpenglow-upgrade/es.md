Alpenglow, el cambio más importante hasta ahora en el consenso de Solana, se activó en la red de pruebas de Solana el 22 de septiembre de 2026. No se activó en la red principal el 28 de septiembre, pese a una semana de titulares que decían que lo haría. La actualización sustituye la forma en que votan los validadores y la forma en que se propagan los bloques, y apunta a una finalidad de aproximadamente 100 a 150 milisegundos, frente a unos 12,8 segundos hoy.

## Datos clave

- **Qué es:** un nuevo diseño de consenso, propuesto como SIMD-0326, que sustituye a TowerBFT.
- **Dos partes:** Votor se encarga de la votación y la finalidad; Rotor se encarga de cómo se propagan los bloques.
- **Estado:** en la red de pruebas desde el 22 de septiembre de 2026. No en la red principal.
- **La confusión con la fecha:** el 28 de septiembre fue cuando los desarrolladores del cliente reanudaron la activación de funciones en la red principal en general, no un lanzamiento de Alpenglow.
- **Próxima ventana:** el 9 de noviembre de 2026 se abre una ventana de activación en la red principal. Es una ventana, no un compromiso.

## ¿Qué es la finalidad y por qué importan 150 ms?

La finalidad es el punto a partir del cual una transacción ya no puede deshacerse.

No es lo mismo que la producción de un bloque. Un bloque puede aparecer en menos de un segundo y seguir siendo provisional; un exchange que acredita un depósito o un comercio que entrega la mercancía espera a la finalidad, no a la inclusión. Doce segundos es rápido para una blockchain y lento para un cobro en caja. Una décima de segundo está en el rango en el que una persona no percibe ninguna espera.

## ¿Cómo lo consigue Alpenglow?

Sacando los votos de la cadena.

Hoy los validadores de Solana votan enviando transacciones, que se procesan como cualquier otra y se pagan como cualquier otra. Con Alpenglow, los validadores intercambian votos directamente y registran un certificado compacto una vez que suficiente stake está de acuerdo. Un bloque que reúne una proporción suficiente del stake en la primera ronda es final de inmediato; si no, una segunda ronda lo completa.

Hay un efecto secundario económico. Los validadores pagan hoy comisiones por cada voto, un coste fijo que pesa sobre todo en los operadores pequeños. Eliminar las transacciones de voto elimina ese coste.

## ¿Por qué todo el mundo creyó que se había lanzado?

Porque una entrada de calendario se leyó como un anuncio. El plan de versiones del cliente validador señalaba el 28 de septiembre como el día en que se reanudaría la activación de funciones en la red principal. Alpenglow era la función que la gente esperaba, así que se unieron las dos cosas. Los desarrolladores dijeron con claridad que no iba a ocurrir ese día.

La lección sirve mucho más allá de Solana: en este sector, las fechas de actualización son objetivos hasta que se ha producido el bloque en el que se activan. La misma cautela vale para el próximo fork de Ethereum, como señala [Glamsterdam, explicada](/blog/ethereum-glamsterdam-upgrade).

## ¿Afecta esto a las cadenas EVM?

No directamente. Solana no es una red EVM; sus programas, sus cuentas y sus herramientas son otros, y nada de Alpenglow se puede trasladar.

Aun así la comparación es útil, porque muestra qué significa "rápido". El tiempo de bloque y la finalidad son números distintos, y la cifra de titular de una cadena suele ser el primero. Nura Chain produce un bloque aproximadamente cada tres segundos —ese es su tiempo de bloque, enunciado en [qué es Nura Chain](/blog/what-is-nura-chain)—, y por qué la compatibilidad con EVM no dice nada sobre el consenso se explica en [cómo ejecuta Nura Chain el bytecode de la EVM](/blog/nura-chain-evm-compatibility). Cuando compares redes, pregunta cuál de los dos números te están enseñando.

Las fechas de arriba son las publicadas por los desarrolladores del cliente y pueden moverse; [Anza](https://www.anza.xyz) mantiene el calendario de versiones.
