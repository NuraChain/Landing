Ledger dice que algunas carteras de hardware vendidas a través de CryptoBilis, un revendedor autorizado de Ledger con sede en Malasia que opera en todo el sudeste asiático, llevaban un implante de hardware no autorizado que copiaba la frase de recuperación de 24 palabras del propietario durante la configuración y la enviaba por una red móvil. Ledger abrió una investigación el 9 de octubre de 2026, tras denuncias de que las carteras de los compradores habían sido vaciadas, y confirmó el implante en un dispositivo afectado el 10 de octubre. Ledger no ha publicado una cifra de pérdidas; los rastreadores en cadena la sitúan entre más de 86 millones de dólares y 103,4 millones de dólares.

## Datos clave

- **Qué:** un implante dentro de la carcasa del dispositivo, que Ledger describe como un ataque físico a la cadena de suministro, no una brecha en su software ni en sus sistemas.
- **Dónde:** toda pérdida confirmada corresponde a un firmador vendido por CryptoBilis, según dijo Ledger en una actualización posterior; sus propios sistemas y sus ventas directas no se vieron afectados.
- **Cuándo:** investigación abierta el 9 de octubre de 2026; implante confirmado el 10 de octubre; el equipo de seguridad de Ledger, Donjon, explicó cómo funcionaba el 13 de octubre.
- **Cuánto:** Bitquery contó 93,2 millones de dólares sustraídos de 315 carteras en seis blockchains, a precios del 9 de octubre, según ForkLog el 12 de octubre. Ledger dice que las cifras proceden de terceros y que no las ha verificado por completo.
- **Congelado:** Tether congeló unos 10 millones de dólares en USDT vinculados al robo, según CoinDesk el 13 de octubre.
- **El revendedor:** CryptoBilis dejó de vender todas las marcas de carteras de hardware mientras dure la investigación.

## ¿Qué hacía el implante?

Leía la frase de recuperación en la pantalla.

Una cartera de hardware genera la frase dentro de su chip seguro y la muestra una sola vez, en su propia pantalla, para que el propietario la apunte. Según la actualización de Ledger del 13 de octubre, el microcontrolador del implante leía y decodificaba esas 24 palabras a medida que aparecían durante la configuración y las transmitía por LTE mediante una tarjeta SIM integrada. Con la frase, el atacante puede reconstruir la cartera en cualquier lugar y sacar los fondos sin volver a tocar el dispositivo.

Ledger dice que el implante no modificó el Secure Element ni el sistema operativo del dispositivo, y no alteró transacciones ni firmas.

## ¿Por qué no lo detuvo la seguridad del propio dispositivo?

Porque nada de lo que comprueba había cambiado.

El chip seguro hizo su trabajo: mantuvo las claves selladas. La fuga se produjo entre el chip y los ojos del propietario, en el único momento en que el secreto se muestra en claro. Según BleepingComputer, que cita un artículo de soporte de Ledger, el Genuine Check de Ledger no puede detectar hardware añadido cuando el Secure Element original está intacto. Un dispositivo puede superar todas las comprobaciones de software y aun así llevar un pasajero.

Es la misma lección que [por qué se vacían los contratos auditados](/blog/why-audited-contracts-get-drained): el componente fuerte aguanta y el dinero sale por lo que lo rodea.

## ¿Cuánto se robó?

Nadie oficial lo ha dicho, y los rastreadores no coinciden.

La primera estimación vino del investigador Specter, que situó las pérdidas en más de 86 millones de dólares el 9 de octubre. Bitquery contó 93,2 millones de dólares en 315 carteras a precios del 9 de octubre, sin incluir los intercambios ni las transferencias entre carteras del propio atacante; para el 12 de octubre su recuento había llegado a 102,0 millones de dólares en 324 carteras, según Genfinity el 13 de octubre. YFarmX situó el total en 103,4 millones de dólares en 530 carteras, según ForkLog el 12 de octubre, sin describir su método. Los rastreadores no cuentan lo mismo, así que la cifra seguirá moviéndose.

## ¿Es solo CryptoBilis?

Es lo que Ledger ha confirmado hasta ahora, y está examinando otras denuncias.

El 13 de octubre Ledger dijo que el minorista MediaMarkt Saturn había dejado de vender dispositivos Ledger después de que un cliente en Alemania denunciara un implante; en ese caso no se denunció ninguna pérdida de fondos. Mark Karpelès, antiguo responsable de Mt. Gox, dijo que un Ledger Flex comprado en el aeropuerto de Singapur contenía uno; Ledger no lo ha vinculado a este incidente. Trezor dijo que no tenía denuncias de dispositivos Trezor manipulados, pero retiró a CryptoBilis de sus revendedores, y OneKey revocó su autorización y ofreció reemplazos gratuitos.

## ¿Qué debes hacer si tienes una cartera de hardware?

El consejo de la propia Ledger, más la regla que hay detrás.

- **¿Lo compraste en CryptoBilis y no lo has configurado?** No lo inicialices.
- **¿Ya lo usas?** Mueve tus activos a un dispositivo nuevo con una frase de recuperación recién generada.
- **¿Perdiste fondos?** Contacta con el soporte de Ledger, presenta una denuncia policial y coordínate con las autoridades antes de abrir el dispositivo.
- **¿Vas a comprar uno nuevo?** Cómpralo directamente al fabricante siempre que puedas —CryptoBilis era un revendedor autorizado, y eso no lo impidió— y desconfía de un precio muy por debajo del habitual.
- **Nunca reutilices una frase** que te haya mostrado un dispositivo sospechoso. Un dispositivo nuevo con una frase antigua sigue comprometido.

## ¿Qué significa esto para la autocustodia?

La autocustodia traslada el riesgo de una empresa a ti, y parte de ese riesgo es el dispositivo que te muestra el secreto.

Nura Wallet es de autocustodia —las claves se quedan en tu dispositivo— y se le aplica la misma regla que a cualquier cartera: una frase de recuperación solo es tan privada como el dispositivo que la mostró por primera vez. Si tienes activos en Nura Chain, cualquier cartera EVM puede llegar a la red siguiendo [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet).

La investigación sigue abierta y las cifras cambiarán. La fuente primaria es [la actualización de Ledger Donjon del 13 de octubre](https://x.com/Ledger/status/2109896739985453358).
