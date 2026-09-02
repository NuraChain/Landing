Nura Chain es una blockchain pública: un registro compartido de quién tiene qué, guardado por ordenadores en lugar de por un banco, que cualquiera puede leer y nadie puede reescribir a escondidas. Añade una página nueva a ese registro cada tres segundos, funciona con el mismo motor que Ethereum y tiene su propia moneda, NURA, que paga la pequeña comisión que cuesta cada transacción. A su alrededor hay una cartera, un explorador para consultar cosas, un swap para cambiar monedas y un puente para traer monedas desde otras redes.

Este documento explica todo eso con palabras sencillas. Está escrito para quien nunca ha usado una blockchain, para quien está decidiendo si tener NURA y para quien solo quiere saber qué está mirando. Cuando una afirmación puede comprobarla cualquiera, decimos cómo; cuando no, también lo decimos.

## 1. Qué es Nura Chain

Piensa en una blockchain como en un cuaderno del que miles de personas guardan copias idénticas. Cuando alguien envía monedas, la transferencia se escribe en una página nueva, todas las copias reciben la misma página y, una vez que una página está dentro, se queda dentro. Nadie puede arrancar una ni cambiar una anotación antigua sin que todos lo noten. Ese es todo el truco, y es lo que permite que una blockchain mantenga el dinero honesto sin una empresa en medio.

Nura Chain es uno de esos cuadernos. Lo que lo hace fácil de usar es que funciona con el mismo motor que Ethereum, la plataforma de blockchain más usada. Cualquier cartera, app o herramienta hecha para Ethereum funciona también en Nura Chain, así que no necesitas ningún programa especial para usarla. Si alguna vez has usado MetaMask o una cartera parecida, ya sabes cómo.

Una cosa que conviene tener clara: Nura Chain es la red. Nura Wallet, Nura Explorer y Nura Swap son productos construidos encima de ella, y se describen en la sección 7. Puedes usar la red con la cartera que prefieras.

## 2. En qué creemos

Cuatro ideas dan forma a todo lo que sigue.

- **Tus llaves, tus monedas.** Tu cartera guarda tus monedas con una clave secreta que nunca sale de tu dispositivo. Nadie en Nura, y nadie en ningún otro sitio, puede mover tus monedas, congelarlas ni quitártelas. La otra cara de la moneda es que tampoco nadie puede recuperarlas por ti.
- **Comprueba, no confíes.** Los datos importantes de la red puede comprobarlos cualquiera con una cartera o un navegador web. Cuando una cifra no se puede comprobar, este documento lo dice, en lugar de dejar que supongas que sí.
- **Herramientas conocidas.** Nada en Nura Chain necesita un tipo nuevo de app. Las carteras y herramientas que la gente ya usa funcionan aquí.
- **Decirlo claro.** Menos promesas, contadas con honestidad, incluidas las partes que no son halagadoras.

## 3. Cómo funciona la red

### 3.1 Bloques: una página nueva cada tres segundos

Las páginas del cuaderno se llaman bloques. Nura Chain escribe uno nuevo cada tres segundos, con un horario fijo, haya enviado alguien algo en ese tiempo o no. El primer bloque se escribió el 6 de junio de 2026, y la cuenta no ha dejado de subir desde entonces. Puedes verla subir en la página de inicio del sitio y en Nura Explorer.

### 3.2 Comisiones: un pequeño cargo por cada transacción

Cada transacción paga una comisión en NURA, un poco como el sello de una carta. La comisión tiene dos partes: una cantidad base que fija la red y una propina opcional que puedes añadir si quieres que tu transacción se atienda antes. Tu cartera lo calcula por ti; nunca tienes que hacerlo a mano. En el momento de escribir esto, la cantidad base es una fracción diminuta de un NURA, pero la fija la red y puede cambiar, así que toma la comisión que te muestra tu cartera como la cifra real.

### 3.3 Quién escribe los bloques

En algunas blockchains, como Bitcoin, los ordenadores compiten por resolver acertijos para ganarse el derecho a escribir el siguiente bloque; a eso se refiere la gente cuando habla de «minar». Nura Chain no funciona así. Sus bloques los escribe un productor de bloques autorizado, con el horario de tres segundos de arriba, y cada bloque deja constancia de qué cuenta lo escribió, de modo que quién produjo un bloque concreto es público y no una cuestión de confianza.

Para ser claros sobre cómo es eso hoy: en el momento de esta revisión, todos los bloques que muestreamos fueron escritos por la misma cuenta productora. Si se añadirán más productores es una decisión sobre cómo se gestiona la red, no algo que este documento prometa en un sentido ni en otro. Cualquier cambio se anuncia por los canales de la sección 10.

### 3.4 ¿Cuándo es definitiva una transacción?

Una vez que tu transacción queda escrita en un bloque, está hecha. Aparece en Nura Explorer en pocos segundos y nadie puede deshacerla, revertirla ni cancelarla, nosotros incluidos. Eso es lo que hace fiable el registro, y también es la razón por la que la sección 9 te pide que compruebes dos veces antes de enviar.

## 4. La moneda NURA

NURA es el dinero propio de la red, igual que el ether lo es de Ethereum. Paga las comisiones de la sección 3.2, y una cuenta sin nada de NURA no puede enviar nada, porque no puede pagar el sello.

NURA forma parte de la propia red, no es una app que funciona sobre ella. Eso tiene una consecuencia práctica: no existe una «dirección del contrato de NURA» que añadir a tu cartera. Añades la red en sí, con los valores de la sección 10, y tu saldo de NURA simplemente aparece. Si una página te dice que pegues una dirección para «añadir NURA», ten cuidado: te está pidiendo algo que no existe.

Como la mayoría de monedas de este tipo, NURA se puede dividir en fracciones muy pequeñas, así que puedes enviar una décima, una milésima o mucho menos de una moneda.

## 5. Cuántos NURA existen y a dónde van

### 5.1 El total

El suministro total es de 1.000.000.000 NURA, mil millones, y no se crearán más allá de esa cifra.

Esa cifra la publica el proyecto. Conviene saber que es uno de los pocos números de aquí que no puedes comprobar por tu cuenta: una cartera o el explorador pueden mostrarte el saldo de cualquier dirección concreta, pero una moneda que forma parte de la red no tiene un contador que los sume todos. Los saldos individuales son comprobables; el total es la palabra del proyecto.

En esta revisión no indicamos un «suministro circulante». Esa cifra depende de cuáles de las porciones de abajo se consideran desbloqueadas en un día dado, y eso es un juicio y no una medición. Allí donde el proyecto publica las direcciones que guardan una porción, cualquiera puede vigilar esos saldos.

### 5.2 El reparto

Los mil millones de monedas se dividen en seis partes. Para cada porción: la parte que le corresponde, el número de monedas y para qué sirve.

- **Bloqueado, 40%, 400.000.000 NURA.** Apartado y bloqueado durante un año. Qué se hace con él después se decide al terminar ese año, y cualquier decisión sobre esta porción necesita la aprobación de al menos el 65% de la red en una votación.
- **Liquidez, 25%, 250.000.000 NURA.** Se usa a lo largo de un año para mantener suficiente NURA disponible en los fondos de intercambio, de modo que comprar y vender funcione con fluidez y el precio no dé bandazos con cada operación.
- **Comunidad, 10%, 100.000.000 NURA.** Se entrega a lo largo de un año a quienes ayudan a crecer a la red: siendo activos, participando, construyendo cosas o trayendo a otros. Cada asignación la revisa y aprueba el consejo de gestión.
- **Venta pública, 10%, 100.000.000 NURA.** Se vende al público por 24.000 dólares en total, lo que sale a 0,00024 dólares por NURA. Ese es el precio de esa venta, no el precio de mercado, y no dice nada sobre lo que vale NURA un día cualquiera.
- **Tesorería, 10%, 100.000.000 NURA.** El presupuesto propio del proyecto a lo largo de un año, para desarrollo, infraestructura, productos y alianzas, bajo la supervisión del consejo de gestión.
- **Airdrop, 5%, 50.000.000 NURA.** Se regala a lo largo de un año a personas alcanzadas a través de canales y comunidades seleccionados. La lista final la confirma el consejo de gestión.

Esas seis porciones suman el 100%.

### 5.3 Comprobar un saldo

Todos los saldos de Nura Chain son públicos. Abre Nura Explorer, pega cualquier dirección y verás exactamente cuántos NURA tiene y cada transferencia que entra y sale. Funciona con tu propia dirección, con la de un amigo y con cualquier dirección que el proyecto publique para una de las porciones de arriba.

## 6. Quién decide qué

En esta revisión hay dos reglas en vigor, y las dos tratan de las monedas de la sección 5, no de la red en sí.

El 40% bloqueado no se puede liberar, destinar a otro fin ni gastar sin una votación en la que lo apruebe al menos el 65% de la red. Esa es la única regla firme sobre la porción más grande del suministro.

Las porciones de comunidad, tesorería y airdrop, una cuarta parte de todas las monedas entre las tres, se reparten bajo la revisión de un consejo de gestión, que da el visto bueno a cada distribución.

No afirmamos nada más allá de eso. No hay un sistema de votación para los ajustes de la propia red, como cada cuánto se escriben los bloques o quién los escribe. Eso lo deciden las personas que gestionan la red, y este documento lo dice así en lugar de describir un sistema que no existe.

## 7. Las herramientas alrededor de la red

### 7.1 Nura Wallet

Nura Wallet es nuestra propia app de cartera. Guarda tu clave secreta en tu dispositivo y solo ahí; la app no puede gastar tus monedas por su cuenta, y nosotros tampoco. Su código fuente es público en GitHub, así que cualquiera puede leer qué hace.

Está disponible para Android, tanto en Google Play como en descarga directa, para Windows y para Linux. Las versiones para iPhone y Mac todavía no han salido. No estás obligado a usarla: cualquier cartera que permita añadir una red personalizada, MetaMask incluida, funciona con Nura Chain.

### 7.2 Nura Explorer

Nura Explorer es la ventana pública al cuaderno. Escribe una dirección, una transacción o un número de bloque y verás todo sobre ello: saldos, transferencias, cuándo se escribió un bloque y quién lo hizo. Es donde confirmas que un pago llegó de verdad, y es la herramienta que hay detrás de la mayoría de los «esto puedes comprobarlo» de este documento.

### 7.3 Nura Swap

Nura Swap es donde cambias NURA por otras monedas y al revés. Funciona a partir de un fondo común de monedas (un «pool»), y el precio que muestra es simplemente el saldo de ese fondo en ese momento.

El fondo es pequeño. Eso significa que una sola operación grande puede mover mucho el precio, en cualquier dirección. Toma el precio del swap como lo que un fondo pequeño cotiza en ese momento, no como la cotización de un exchange, y no lo leas como una valoración de NURA.

### 7.4 El puente

El puente te permite traer BNB y USDT a Nura Chain desde sus redes de origen. Funciona como el ticket de un guardarropa: tus monedas originales quedan bloqueadas en la otra red y aquí recibes una moneda «envuelta» equivalente que puedes gastar en Nura Chain. Devuelve la moneda envuelta y la original se libera.

Una moneda envuelta solo vale lo que su original mientras el original esté realmente ahí. El sitio muestra el valor total que ha cruzado el puente, y esa cifra cuenta los tickets, no los abrigos: es correcta siempre que cada moneda envuelta esté respaldada una a una al otro lado. Las direcciones de las dos monedas envueltas están en la sección 10.

## 8. Primeros pasos

1. Instala una cartera. Nura Wallet, de la sección 7.1, o cualquier cartera que ya uses y que permita añadir una red personalizada.
2. Añade Nura Chain. El botón «Añadir Nura Chain a la billetera» del sitio lo hace con un toque; si prefieres hacerlo a mano, los valores están en la sección 10.
3. Comprueba que la cartera muestra el ID de cadena 1020 para la red. Si muestra cualquier otro número, estás en otra red, y todo lo que envíes irá a un sitio al que no querías.
4. Consigue algo de NURA. Las comisiones se pagan en NURA, así que una cuenta vacía todavía no puede enviar nada.
5. Envía primero una cantidad pequeña y luego búscala en Nura Explorer. Ver tu propia transferencia en el registro público es la mejor manera de entender cómo funciona todo esto.

Si eres desarrollador, el blog del sitio tiene guías paso a paso para conectarse a la red y desplegar contratos; están enlazadas en la sección 10.

## 9. A qué prestar atención

- **Perder la frase de recuperación es perder las monedas.** Nadie puede restablecerla, ni en esta red ni en ninguna otra. Apúntala y guárdala en un lugar seguro.
- **Un ID de cadena equivocado es perder las monedas.** Confirma siempre el 1020 antes de enviar, y trata cualquier página, incluida esta, como algo que comprobar y no como algo en lo que confiar.
- **La misma dirección en otra red no es el mismo dinero.** Tu dirección existe también en Ethereum y en otras redes, pero los saldos son independientes. Enviar monedas a «la misma dirección en otra cadena» no las traslada. Solo el puente hace eso, y solo con BNB y USDT.
- **El precio del swap puede oscilar.** Una sola operación en un fondo pequeño puede moverlo de golpe.
- **Una moneda envuelta es el ticket, no el abrigo.** Vale lo que la original solo mientras el puente guarde la original.
- **Algunas cifras son la palabra del proyecto.** El suministro total y las condiciones del reparto no se pueden comprobar en una cartera. Los saldos individuales, sí.
- **Hoy la producción de bloques está en manos de una sola cuenta.** La sección 3.3 lo dice sin rodeos para que puedas tenerlo en cuenta ahora en vez de descubrirlo después.

## 10. Los datos, para consultar

Los valores que te pide una cartera cuando añades la red a mano:

- Nombre de la red: Nura Chain
- ID de cadena: `1020` (algunas carteras lo muestran como `0x3fc`, que es el mismo número escrito de otra forma)
- Endpoint RPC: `https://rpc.nurachain.net`
- Explorador de bloques: `https://explorer.nurachain.net`
- Moneda: Nura, símbolo `NURA`, 18 decimales
- Tiempo de bloque: 3 segundos

Las dos monedas envueltas que el puente crea en Nura Chain:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

A dónde ir:

- [Nura Explorer](https://explorer.nurachain.net), para consultar cualquier cosa
- [Nura Swap](https://swap.nurachain.net/), para cambiar monedas
- [Descargas de Nura Wallet](https://github.com/NuraChain/Wallet/releases), todas las versiones y plataformas
- [Nura Chain en GitHub](https://github.com/NuraChain), el código fuente
- Comunidad: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Guías: [qué es Nura Chain](/blog/what-is-nura-chain), [añadir la red a tu cartera](/blog/add-nura-chain-to-your-wallet), [leer el explorador](/blog/how-to-use-nura-chain-explorer), [suministro y asignación](/blog/nura-coin-tokenomics) y, para desarrolladores, [conectarse a la red](/blog/connect-to-nura-chain-rpc) y [desplegar un contrato](/blog/deploy-a-smart-contract-on-nura-chain)

## 11. Una nota sobre qué es este documento

Este documento describe la red tal como es en la revisión indicada arriba. No es una oferta, una recomendación ni un consejo de inversión, y nada de lo que contiene es una promesa sobre lo que valdrá NURA, lo fácil que será comprarla o venderla, o qué hará el proyecto a continuación. Las cifras descritas como la palabra del proyecto son exactamente eso; todas las demás pueden comprobarse con las herramientas de arriba. Cuando cambiamos algo que merece saberse, publicamos una revisión nueva, y el número y la fecha de la revisión te dicen cuál estás leyendo.
