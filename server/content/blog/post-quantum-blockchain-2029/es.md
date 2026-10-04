El 7 de septiembre de 2026 la Ethereum Foundation fijó un plazo: para diciembre de 2029, las transacciones, los validadores y el almacenamiento de datos de Ethereum deberían resistir todos el ataque de una computadora cuántica. Diez días después circulaba una hoja de ruta poscuántica para Bitcoin con el mismo año objetivo. La criptografía poscuántica ha dejado de ser un tema de investigación para las blockchains y se ha convertido en un calendario.

## Datos clave

- **Ethereum:** el objetivo de la Fundación es diciembre de 2029, con una reevaluación a cargo de expertos externos prevista para enero de 2027.
- **Bitcoin:** una hoja de ruta de desarrolladores señala la misma fecha, articulada en torno a BIP 360, que añade formas de gastar resistentes a la computación cuántica.
- **La exposición:** aproximadamente 6,9 millones de BTC, cerca de un tercio del suministro, están en direcciones cuya clave pública ya es visible, según una estimación de investigadores.
- **No es solo cripto:** Google, Cloudflare y Microsoft tienen objetivos de migración en la misma ventana.

## ¿Qué rompería de verdad una computadora cuántica?

Las firmas, no las blockchains.

Cada cuenta de Bitcoin, de Ethereum y de cualquier cadena EVM está controlada por un par de claves de curva elíptica. Derivar la clave privada a partir de la pública es inviable para las computadoras corrientes y, en principio, abordable para una cuántica lo bastante grande. El hashing se ve mucho menos afectado, y por eso los bloques, las direcciones y la prueba de trabajo no son la parte urgente.

Eso explica también la cifra de exposición. Una dirección que nunca ha gastado revela solo un hash de su clave pública. Una que ha gastado, o que usa un formato que publica la clave directamente, ha mostrado la clave en sí, y eso es lo que necesitaría un atacante.

## ¿Por qué 2029, si esa máquina no existe?

Porque la migración lleva más tiempo del que dará el aviso.

Nadie puede decir cuándo existirá una computadora cuántica capaz de esto. El planteamiento de la propia Fundación es que las previsiones creíbles empiezan en torno a 2030, y que algunos investigadores dudan de que llegue siquiera. Pero sustituir el esquema de firmas de una red en funcionamiento implica carteras nuevas, hardware nuevo, infraestructura nueva en los exchanges, y después esperar a que millones de usuarios muevan sus fondos. Son años de trabajo, y tiene que terminar antes de que la amenaza sea real, no empezar entonces.

## ¿Por qué es difícil?

Las firmas poscuánticas son más grandes y más lentas de verificar que las que se usan ahora, y una blockchain guarda cada firma para siempre. Ethereum trabaja con esquemas basados en hash; la Fundación describe Hegotá, un fork previsto para 2027, como "no el fork PQ", sino "el fork que decide si los forks PQ llegan a tiempo".

Bitcoin tiene un segundo problema, que es político. Las monedas en direcciones expuestas cuyos dueños nunca migren seguirán pudiendo robarse. Si congelarlas o dejarlas como están es una cuestión de propiedad, no de criptografía, y no tiene una respuesta consensuada.

## ¿Qué deberías hacer hoy?

Nada drástico, y dos cosas que vale la pena convertir en hábito.

- **No reutilices direcciones** cuando el sistema te permita evitarlo. Una dirección que no ha gastado no ha mostrado su clave.
- **Mantén al día el software de tu cartera.** La migración llegará en forma de actualizaciones de la cartera, y quienes estarán en riesgo serán los que nunca las instalaron.

En las cadenas EVM, lo probable es que el camino pase por las cuentas programables, donde la regla que autoriza una transacción es código y no una curva fija: la dirección en la que ya apunta [EIP-7702 y las cuentas inteligentes](/blog/eip-7702-smart-accounts). Nura Chain usa el mismo modelo de cuentas que cualquier red EVM, así que afronta la misma pregunta y heredará las mismas herramientas. No ha anunciado ningún calendario propio, y esta página no se inventa uno.

Los plazos que aparecen aquí son objetivos, no garantías. El [blog de la Ethereum Foundation](https://blog.ethereum.org) y el [proyecto poscuántico del NIST](https://csrc.nist.gov/projects/post-quantum-cryptography) son las fuentes que hay que seguir.
