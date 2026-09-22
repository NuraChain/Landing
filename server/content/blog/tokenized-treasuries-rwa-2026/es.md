Los activos del mundo real fueron durante años una diapositiva. En 2026 son una cifra: unos 37.900 millones de dólares en valor distribuido a 6 de agosto de 2026, frente a unos 4.100 millones en enero de 2025. Sin contar stablecoins, el mercado creció en torno a un 30% solo en el primer trimestre de 2026, hasta unos 29.000 millones: un 263% más que el año anterior.

Una sola clase de activo es la mayor parte. Los bonos del Tesoro estadounidense tokenizados superaron los 10.000 millones a finales de febrero de 2026 y los 13.400 millones a comienzos de abril, cerca del 45% del total.

## Qué es realmente un tesoro tokenizado

Quitada la jerga, la estructura es corriente.

- Un fondo o emisor tiene el instrumento real: deuda pública a corto plazo, custodiada en el sistema tradicional.
- Se emite en cadena un token que representa una participación en esa tenencia.
- Las transferencias del token se registran en cadena, normalmente con una restricción para que solo direcciones aprobadas puedan tenerlo.
- El rescate ocurre fuera de la cadena, frente al emisor y en sus términos.

La cadena hace de registro y de liquidación. No hace de custodio, y no asume el crédito.

## Dónde reside la confianza

Aquí conviene ser directo. Un tesoro tokenizado no es sin confianza. El token es un derecho frente a un emisor que tiene el activo en otro sitio. Lo que la cadena te da es un mecanismo de transferencia que liquida en segundos y un registro que cualquiera puede leer; lo que no te da es garantía alguna sobre la cosa registrada.

No es una crítica, es el diseño. Pero implica que las preguntas que importan son las aburridas: quién es el emisor, cómo es el proceso de rescate, quién custodia y qué pasa si el emisor deja de responder.

## Por qué las instituciones entraron en 2026

El primer trimestre trajo compromisos de infraestructura, no pilotos. Nasdaq, la NYSE y la DTCC avanzaron hacia integrar valores tokenizados en la fontanería de los mercados regulados ya existentes. BUIDL de BlackRock ya estaba ahí; JPMorgan lanzó su propio fondo de rendimiento en cadena en enero de 2026 con cien millones de dólares iniciales, y Goldman Sachs y BNY Mellon compiten por el mismo mandato.

El mercado tampoco es ya una sola categoría. Al menos seis superan hoy cada una los mil millones de dólares en cadena, y esa es una forma distinta a la de un único producto con una cifra grande al lado.

## Qué significa para una cadena EVM corriente

Mecánicamente, casi nada es exótico. Un token de transferencia restringida es un ERC-20 con una comprobación en `transfer`, y se despliega como cualquier contrato — ver [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) y [crear un token ERC-20](/blog/create-an-erc-20-token-on-nura-chain).

Lo que no es corriente es todo lo que queda fuera de la cadena: el emisor, el custodio, el auditor, el envoltorio legal y la jurisdicción. El token es la mitad fácil. Quien te venda el token como si fuera el conjunto te está vendiendo la mitad fácil.

Las cifras de arriba son mediciones de terceros a las fechas indicadas y se mueven deprisa: léelas como una foto, no como una constante.
