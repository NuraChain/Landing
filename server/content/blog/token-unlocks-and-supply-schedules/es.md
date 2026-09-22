La última semana de septiembre de 2026 concentra un buen grupo de liberaciones de tokens programadas. Los calendarios públicos de desbloqueo señalan un proyecto que libera 1.760 millones de XPL el 25 de septiembre, y otros dos que ponen en circulación unos 26 millones de dólares adicionales en la misma ventana.

Las semanas de desbloqueo vuelven constantemente, y la cobertura que las rodea suele ser una predicción de precio. Lo útil es entender qué es realmente el evento.

## Oferta total no es oferta circulante

Un token tiene una oferta total, fijada por el contrato. Y tiene una oferta circulante, que es la total menos todo lo que ahora mismo no puede moverse: asignaciones del equipo en vesting, tramos de inversores tras un cliff, tesorería en manos de un multisig, fondos de ecosistema detrás de un timelock.

Un desbloqueo no crea tokens. No se acuña nada. Lo que cambia es que una parte de lo que ya existía pasa a ser transferible. La oferta total es plana durante el evento; la circulante da un escalón.

Esa distinción importa porque la "valoración totalmente diluida" pone precio al primer número y el mercado negocia el segundo. Un proyecto cuya oferta circulante es el 8% del total tiene el 92% de su oferta llegando según un calendario que alguien escribió.

## Cómo se construyen los calendarios

- **Un cliff.** Nada durante un periodo fijo y luego un bloque entero de golpe. Esta es la forma que produce un evento de calendario.
- **Vesting lineal.** Un goteo continuo, a menudo por bloque o por mes, una vez pasado el cliff.
- **Liberaciones por hitos.** Atadas a que ocurra algo, lo que convierte la fecha en una estimación y no en un hecho.

De la primera es de la que se escribe, porque es la única que se parece a una fecha.

## Qué dice y qué no dice un desbloqueo

Dice que la oferta que ahora puede moverse, puede moverse. No dice que vaya a hacerlo. Tokens liberados a una tesorería de largo plazo y tokens liberados a un inversor temprano no se comportan igual, y el calendario por sí solo no los distingue.

Las preguntas que valen son: quién recibe este tramo, qué hicieron los receptores anteriores del mismo tramo, y si algo de eso ya está cubierto o prevendido fuera de la cadena. Ninguna la responde el titular.

## Verifícalo contra la cadena

Un calendario suele ser un contrato, y un contrato se puede leer.

- Localiza el contrato de vesting o el timelock y mira su saldo a lo largo del tiempo. Una caída es una liberación, y la transacción enseña adónde fue.
- Comprueba si el contrato del token puede acuñar. Un tope de oferta que solo vive en un documento no es un tope.
- Vigila después la dirección receptora, no solo el bloque del desbloqueo. El movimiento interesante es el salto siguiente.

[Cómo leer el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) cubre la mecánica de seguir un saldo y una transferencia, y el mismo método sirve en cualquier cadena EVM.

## Las cifras de Nura Coin

La oferta total es de 1.000.000.000 NURA. Cómo se reparte, para qué es cada porción y qué queda retenido está en [oferta y asignación de Nura Coin](/blog/nura-coin-tokenomics), que es la página a leer en lugar de esta para cualquier cifra propia de esta red.

El hábito general es el que conviene conservar: lee el calendario antes de necesitarlo, contrástalo con el contrato, y toma cualquier artículo sobre desbloqueos — este incluido — como un empujón para ir a mirar, no como una conclusión.
