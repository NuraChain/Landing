El 21 de octubre de 2026 Pump.fun convirtió Pump Bridge, su propia infraestructura entre cadenas, en la ruta por defecto para las operaciones entre cadenas de su app, en sustitución del proveedor externo Relay. Un día después, el 22 de octubre, su rival FOMO inició el despliegue público de su propio puente y dijo que las transacciones entre cadenas en su app «ahora llegan en menos de 1 s». La cifra de Pump.fun es un tiempo medio de compra de 1,95 segundos frente a 3,88 segundos con Relay, según sus propias pruebas. Ninguna de las dos empresas ha publicado cómo guarda o mueve el dinero su puente, y esa es la pregunta que decide de qué depende de verdad una operación entre cadenas.

## Datos clave

- **Pump.fun, 21 de octubre:** Pump Bridge pasó a ser la ruta entre cadenas por defecto en su app, en lugar de Relay.
- **La prueba de Pump.fun:** del 28 de septiembre al 7 de octubre, más de 400.000 resultados de operaciones; compra media de 1,95 s frente a 3,88 s, errores de compra del 0,9 % frente al 11,2 %. Datos de la propia Pump.fun, sin verificación independiente, según informó crypto.news el 22 de octubre.
- **Cadenas de esa prueba:** Robinhood Chain, BNB Chain, Base, Arc e Ink, según crypto.news.
- **Comisiones:** por ahora no hay comisión de puente aparte; las comisiones normales de trading pueden seguir aplicándose.
- **FOMO, 22 de octubre:** despliegue público de «fomo bridge», tras cerca de una semana en manos de una pequeña parte de los usuarios. Antes dependía de puentes externos, entre ellos Relay.
- **Lo que afirma FOMO:** transacciones entre cadenas en menos de un segundo. No dio periodo de comparación ni cifras auditadas, señaló crypto.news el 23 de octubre.
- **Lo que ninguna ha revelado:** de dónde sale el dinero del lado de destino, el modelo de seguridad ni auditoría alguna.

## ¿Qué es un puente entre cadenas?

Una forma de acabar con valor en una blockchain después de empezar en otra.

Las cadenas no se leen entre sí. Una moneda en BNB Chain no puede pasar sin más a Base, así que algo tiene que ponerse en medio: bloquearla en un lado y emitir un derecho en el otro, o pagarte con fondos que ya están en el lado contrario. Cuál de las dos cosas hace es toda la cuestión de seguridad.

## ¿Cómo puede un swap entre cadenas tardar uno o dos segundos?

Porque no hace falta que nada cruce primero.

Esperar a que una cadena confirme un depósito y luego a que otra acuñe lleva más de dos segundos. Los diseños rápidos se saltan la espera: un ejecutor que ya tiene fondos en la cadena de destino te paga allí de su propio saldo y cobra tu depósito en la cadena de origen después. Relay, el proveedor que ambas apps usaban antes, documenta exactamente esto: un solver ejecuta con su propio capital, un oráculo certifica el depósito y la ejecución, y al solver se le reembolsa más tarde. El mismo patrón está detrás de [los intents entre cadenas y ERC-7683](/blog/cross-chain-intents-erc-7683).

Pump.fun y FOMO no han dicho si sus puentes funcionan así, ni con el dinero de quién se ejecuta. Es una inferencia a partir de la velocidad, no una revelación.

## ¿Qué respalda un token puenteado?

Depende de qué tipo de puente lo creó.

- **Bloqueo y acuñación.** Tu moneda queda bloqueada en un contrato o una cartera de su cadena de origen, y se acuña para ti una copia envuelta en la otra. La copia vale lo que el original solo mientras el original siga bloqueado. Confías en quien pueda liberar ese bloqueo: una multifirma, un grupo de firmantes, un contrato.
- **Pagado por un ejecutor.** Recibes un activo real en la cadena de destino, pagado del inventario de alguien. No te quedas con un derecho, pero durante esos segundos confías en que el ejecutor pague, y en que el sistema que liquida con él te devuelva el dinero si no lo hace.

El primer tipo tiene el fallo más grande. Un fondo bloqueado es grande, inmóvil y público. [El exploit de Liquid Network](/blog/liquid-network-exploit-explained) se llevó unos 4.000 BTC de una cartera de respaldo cuyos firmantes firmaron porque el software se lo indicó.

## ¿Más rápido significa más seguro?

No. La velocidad y la tasa de errores son lo que miden los anuncios; ninguna dice nada de qué pasa con los fondos si falla un tramo. Un puente que gestiona la propia app convierte además a esa app en la parte en la que confías, cuando antes lo era un proveedor externo. Eso puede ser mejor o peor. Sin un diseño publicado ni auditorías, nadie desde fuera puede decir cuál.

## Antes de usar un puente

- **Pregunta qué tendrás al final.** ¿El activo nativo, o un derecho envuelto sobre el bloqueo de otro?
- **Averigua quién puede mover el respaldo,** y si el suministro envuelto se puede leer en la cadena.
- **Envía primero una cantidad pequeña,** y confirma que ha llegado antes de enviar el resto.
- **Trata las cifras de velocidad como marketing hasta comprobarlas.** Las dos series de aquí las comunican las propias empresas, salen de pruebas distintas y no se pueden comparar entre sí.

## ¿Cómo funciona el puente de Nura Chain?

El whitepaper lo describe como un ticket de guardarropa: la moneda original queda bloqueada en su red de origen y se emite una equivalente en Nura Chain. BNB, USDT, BTC y ETH puenteados en Nura Chain son tokens ERC-20 de acuñación y quema, y su suministro es público: cualquiera puede leerlo, como muestra [cómo usar el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer).

Las cifras son de las propias empresas y pueden cambiar a medida que avancen los despliegues. Las fuentes primarias son [el anuncio de Pump.fun](https://x.com/Pumpfun/status/2112980077881266326) y [el anuncio de FOMO](https://x.com/fomo/status/2113385954631160071).
