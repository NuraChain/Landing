La última actualización de protocolo de Bitcoin fue Taproot, en noviembre de 2021. Desde entonces no se ha activado nada. Los principales candidatos para la siguiente son los covenants de Bitcoin —reglas que restringen cómo puede gastarse una moneda en el futuro— en dos formas que compiten, OP_CAT y OP_CTV. El 1 de octubre de 2026 Adam Back, director ejecutivo de Blockstream, respaldó los opcodes de covenants como un posible "último soft fork". Las propuestas están maduras. El proceso para adoptar una es la parte que está atascada.

## Datos clave

- **Último soft fork:** Taproot, noviembre de 2021.
- **OP_CAT (BIP 347):** une dos fragmentos de datos en un script. Su especificación se marcó como completa en marzo de 2026 y se ha probado en signet.
- **OP_CTV (BIP 119):** compromete una moneda con una plantilla de gasto predefinida.
- **Ninguno de los dos está activo** en la red principal de Bitcoin.
- **Un fracaso reciente:** BIP 110, una propuesta para limitar durante un año los datos arbitrarios en las transacciones, obtuvo alrededor de un 2,5% de apoyo de los mineros frente al 55% que necesitaba, y la rama que la aplicaba se detuvo tras dos bloques en agosto de 2026.

## ¿Qué es un covenant?

Una condición que viaja con la moneda.

Hoy un script de Bitcoin decide quién puede gastar una moneda. No puede decir nada sobre adónde va la moneda después. Un covenant sí: "esta moneda solo puede enviarse a una de estas direcciones", o "esta moneda solo puede moverse tras un plazo de espera, y durante ese plazo el dueño puede cancelar".

Ese segundo ejemplo es una bóveda. Si un ladrón se hace con tu clave, la retirada se anuncia en cadena y espera; tú la ves y recuperas los fondos con una clave de recuperación. Es el uso más citado de los covenants porque aborda el robo, que es lo que de verdad temen quienes tienen bitcoin.

## ¿En qué se diferencian OP_CAT y CTV?

En cuánto permiten.

- **CTV es estrecho.** Fija, por adelantado, la forma exacta de la transacción que puede gastar una moneda. Es fácil razonar sobre él y se limita a lo que se planeó.
- **OP_CAT es general.** Concatenar datos suena trivial, pero combinado con los opcodes existentes permite que un script inspeccione la transacción que lo gasta, y a partir de ahí se puede construir muchísimo.

La discusión entre ambos es la de siempre sobre las herramientas. Una herramienta estrecha es más segura de aprobar y puede que haya que sustituirla. Una general puede ser el último cambio necesario, y es más difícil de acotar. Back defiende la segunda: "construir una vez un conjunto de herramientas general, verificarlo con rigor y dejar que la innovación futura ocurra sobre él".

## ¿Por qué no se activa nada?

Porque Bitcoin no tiene un procedimiento de decisión, por diseño.

No hay una fundación que programe los forks ni una votación que obligue a nadie. Un soft fork necesita que los desarrolladores lo integren, que los mineros señalicen a su favor y que los operadores de nodos lo ejecuten, y cualquiera de esos grupos puede simplemente no hacerlo. Desde Taproot no ha habido acuerdo ni siquiera sobre cómo debería activarse una actualización.

BIP 110 mostró lo que pasa cuando una propuesta sigue adelante sin ese acuerdo. No cambió Bitcoin. Produjo una rama que dos bloques después no era de nadie.

Que esto sea un defecto depende de lo que quieras. Una red casi imposible de cambiar es también casi imposible de cambiar a peor.

## ¿En qué es distinto esto en una cadena EVM?

Todo lo que hace un covenant es corriente allí. Un contrato puede guardar fondos y aplicar cualquier regla sobre adónde van: timelocks, listas de direcciones permitidas, bóvedas, límites de gasto. Nada necesita un cambio de protocolo, porque las reglas viven en el contrato y no en el consenso de la cadena — [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) muestra la poca ceremonia que exige, y [EIP-7702 y las cuentas inteligentes](/blog/eip-7702-smart-accounts) trata la versión para carteras de la misma idea.

El coste es la imagen en el espejo. Contratos más expresivos significan más formas de equivocarse, y las actualizaciones de una cadena EVM las decide un grupo más pequeño que el de Bitcoin. La cautela de Bitcoin y la flexibilidad de la EVM son el mismo intercambio hecho en direcciones opuestas.

Los textos de las propuestas están en el [repositorio de BIP de Bitcoin](https://github.com/bitcoin/bips); el estado que figura allí es el que vale, y los comentarios, este incluido, no.
