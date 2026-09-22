Hoy hay más de ochenta cadenas compatibles con EVM con actividad real en cadena, además de varios ecosistemas no EVM con sus propios usuarios. Mover valor entre ellas significaba elegir un puente, entender su modelo de confianza y cruzar los dedos. En 2026 el patrón dominante es otro: firmas lo que quieres, y otro se encarga del cómo.

## Qué es un intent

Un intent es una declaración firmada de un resultado. No "llama a este contrato de este puente con estos parámetros", sino "tengo 100 USDC aquí, quiero al menos 99,4 USDC allí, antes de esta fecha límite".

Esa orden va a una red de solvers que compiten por ejecutarla. Un solver que ya tiene USDC en la cadena de destino simplemente te paga allí y después reclama tus fondos en la cadena de origen. Nada tuyo cruza nada. Lo que cruzó fue el inventario del solver, días antes, en el momento que él eligió.

**ERC-7683**, escrito por Uniswap Labs y Across Labs, es el estándar que hizo esto portátil: un formato de datos para órdenes de intent entre cadenas, de modo que cualquier protocolo que las emita pueda ser servido por cualquier red de solvers compatible. Es el formato más adoptado de su tipo.

## Por qué se volvió la opción por defecto

Porque el modo de fallo del modelo anterior era el peor disponible. Un puente de bloqueo y acuñación mantiene un gran fondo estático de activos y publica su dirección, lo que es una invitación permanente. Años de incidentes salieron exactamente de esa forma.

El modelo de intents no tiene un tarro de miel permanente. Además resulta más rápido y cotiza un precio antes de que te comprometas, que es lo que el usuario nota. Los pagos con stablecoins son el caso de uso entre cadenas de mayor volumen en 2026, y solo NEAR Intents ha procesado unos 5.000 millones de dólares a través de 25 cadenas o más.

## En qué confías a cambio

En algo, no en nada. El riesgo se movió, no desapareció.

- **El contrato de custodia.** Tus fondos se quedan ahí hasta que se prueba la ejecución. Ese contrato vale lo que valga su código.
- **La prueba de ejecución.** Cómo se entera la cadena de origen de que el destino se pagó. A veces un oráculo, a veces una ventana optimista con periodo de impugnación, a veces un cliente ligero. Esta es la suposición de confianza real y cambia según el protocolo.
- **La competencia entre solvers.** La calidad del precio depende de que varios quieran tu orden. Un mercado delgado cotiza delgado.
- **El plazo.** Si nadie ejecuta, recuperas los fondos al expirar — es decir, "sin ejecutar" es un retraso, no una pérdida, siempre que la custodia se comporte.

## Qué significa para una cadena como esta

Los intents son la razón de que una red EVM nueva ya no esté aislada por defecto. Los solvers mantienen inventario donde hay demanda, y el requisito técnico sobre una cadena es el de siempre: JSON-RPC estándar, bloques rápidos, transacciones baratas y estado legible. [Conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) es esa interfaz, y [qué es Nura Chain](/blog/what-is-nura-chain) cubre el resto de valores que un solver o una cartera necesitarían.

El resumen honesto: los intents no eliminaron el problema del puente, sustituyeron un depósito estático de activos bloqueados por un mercado de gente que mueve los suyos. Es una forma mejor, y sigue siendo una forma con supuestos dentro.
