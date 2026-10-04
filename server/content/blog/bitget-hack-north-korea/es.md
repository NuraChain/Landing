El 24 de septiembre de 2026 el exchange Bitget perdió 387,5 millones de dólares en 19 transferencias no autorizadas desde sus carteras calientes y templadas. No se explotó ningún contrato inteligente. El atacante entró en un sistema de backend en el que las carteras confiaban y lo usó para falsificar datos de transferencias. Chainalysis ha atribuido el hackeo de Bitget a actores vinculados a Corea del Norte, lo que eleva el total robado por esos grupos en 2026 por encima de los 1.000 millones de dólares.

## Datos clave

- **Fecha e importe:** 24 de septiembre de 2026; 387,5 millones de dólares llegaron a direcciones controladas por el atacante.
- **Cómo:** 19 transferencias desde los sistemas de carteras calientes y templadas, después de que se comprometiera un sistema de backend de carteras.
- **Quién:** atribuido por Chainalysis a actores vinculados a Corea del Norte.
- **Adónde fue:** en un plazo de tres horas, en 23 transferencias, a Ethereum (49,7%), XRP (40,8%), Zcash (7,6%) y Tron (1,8%).
- **Clientes:** Bitget dice que su fondo de protección, que tiene más de 464 millones de dólares, cubre la pérdida.
- **El mes:** septiembre fue el peor de 2026 en robos: 766,5 millones de dólares según el recuento de PeckShield, 768,4 millones de dólares según el de CertiK.

## ¿Qué es una cartera caliente y por qué los exchanges tienen una?

Una cartera cuyas claves están en línea, de modo que puede pagar sin que intervenga una persona.

Un exchange procesa retiradas todo el día. No puede ir a buscar un dispositivo de hardware a una bóveda para cada una, así que mantiene un saldo operativo en sistemas que firman automáticamente. El almacenamiento en frío guarda el resto fuera de línea. Una cartera templada queda entre las dos, con algún retraso o aprobación de por medio.

Esa división es el modelo de seguridad. Una brecha en el lado caliente debería costar el saldo operativo de un día. Cuando cuesta cientos de millones, o se mantenía demasiado en caliente o las capas de encima podían recibir instrucciones del mismo sistema comprometido.

## ¿Qué falló en realidad?

Aquello en lo que creían las carteras.

Los sistemas de firma no deciden qué pagar. Algo situado antes se lo dice: este cliente, este importe, esta dirección. Si un atacante controla ese sistema previo, la cartera firma un robo como si fuera una retirada, con claves válidas y el procedimiento correcto. No se hackeó nada en el sentido de criptografía rota.

Este es el patrón que hay hoy detrás de la mayoría de las grandes pérdidas, y es el argumento de [por qué los contratos auditados siguen vaciándose](/blog/why-audited-contracts-get-drained): el componente auditado funciona, y el dinero se va por el software que lo rodea.

## ¿Cómo se rastreó tan rápido?

Cada transferencia es pública, y el rastreo está ahora en parte automatizado.

Los fondos se repartieron entre cuatro redes en un plazo de tres horas, lo que en otro tiempo habría dado días de ventaja a los ladrones. Chainalysis dice que la automatización redujo más de 20 horas de rastreo manual a menos de diez minutos, y es cuidadosa con la afirmación: "Nuestros investigadores siguieron definiendo la lógica, revisando los resultados y dirigiendo la investigación".

Rastrear no es recuperar. Saber dónde están los fondos no los devuelve; hace más difícil convertirlos en efectivo.

## ¿Qué significa si guardas dinero en un exchange?

Un saldo en un exchange es un asiento en la base de datos del exchange. Las monedas están en carteras que controla el exchange, mezcladas con las de todos los demás. Cuando funciona, nunca notas la diferencia.

- **Deja en un exchange lo que estés negociando.** El resto no necesita estar ahí.
- **Pregunta qué cubre una pérdida.** Un fondo de protección es una promesa de la misma empresa.
- **Prueba una retirada** antes de necesitar una con prisas.

La alternativa es guardar la clave tú mismo, lo que elimina el riesgo del exchange y te entrega el tuyo. Nura Wallet es de autocustodia —las claves se quedan en tu dispositivo— y cualquier cartera EVM puede conectarse a la red siguiendo [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet). Tampoco hay fondo de protección para una frase semilla perdida.

Los detalles cambiarán a medida que avance la investigación. El relato del rastreo es [el de Chainalysis](https://www.chainalysis.com/blog/387m-bitget-theft-2026/); los totales de pérdidas difieren entre firmas de seguridad porque cuentan de forma distinta.
