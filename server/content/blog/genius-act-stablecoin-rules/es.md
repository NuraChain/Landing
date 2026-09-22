Las stablecoins pasaron una década siendo lo más usado del cripto y lo menos definido. Eso terminó con la GENIUS Act, firmada en julio de 2025 como el primer marco federal estadounidense para stablecoins de pago, y 2026 es el año en que se escribe el detalle: el Tesoro y la OCC sacaron propuestas a consulta, y el plazo de comentarios sobre la norma antiblanqueo del Tesoro corre hasta el 19 de octubre de 2026.

La ley en sí se aplica desde el 18 de enero de 2027. A partir de esa fecha, emitir una stablecoin de pago en Estados Unidos sin licencia federal o estatal queda prohibido.

## Qué exige realmente el marco

Tres cosas, en términos llanos.

- **Una licencia.** Solo un emisor autorizado de stablecoins de pago puede emitir. Es una condición que se solicita, no una estructura que uno se atribuye.
- **Reservas que se puedan señalar.** Una stablecoin de pago es un derecho redimible a la par, y las normas tratan de qué hay detrás de ese derecho.
- **El aparato de cumplimiento de una entidad financiera.** Los emisores quedan bajo la Bank Secrecy Act, con obligaciones antiblanqueo y un programa de cumplimiento de sanciones.

Nada de eso es raro en transmisión de dinero. Lo nuevo es que se aplica a un token y no a una cuenta en un banco.

## Qué no hace

Es un reglamento para emisores, no para las cadenas por las que se mueven los tokens ni para quien los tiene. No convierte una blockchain en entidad regulada y no alcanza a todo token que mantenga un precio estable: un diseño algorítmico o con rendimiento es otra pregunta bajo otro epígrafe.

Además es una sola jurisdicción. El régimen MiCA de la UE y el esquema de licencias de Hong Kong llegaron con sus propios calendarios y no dicen lo mismo. Un token conforme en un sitio no es por ello conforme en todos.

## La parte que importa si tienes una en cadena

Una stablecoin envuelta no es el token del emisor. Cuando un puente acuña una representación de USDT en otra red, lo que tienes es un contrato ERC-20 cuyo valor depende de que ese puente siga respondiendo por él. Las reservas del emisor respaldan el original. Tu derecho es contra el puente.

Nada de lo anterior cambia esa distinción, y conviene ser concreto, porque "USDT en la cadena X" se lee como un activo y en realidad son dos.

- Comprueba qué dirección de contrato tienes de verdad, y quién la desplegó.
- Averigua cómo funciona el rescate antes de necesitarlo, no después.
- Trata un saldo puenteado como exposición al puente además de al emisor.

Nura Chain tiene representaciones envueltas de BNB y USDT, acuñadas por su puente como contratos ERC-20 corrientes: la misma forma que adopta cualquier token aquí, que describe [crear un token ERC-20 en Nura Chain](/blog/create-an-erc-20-token-on-nura-chain). Puedes confirmarlo tú mismo en [el explorador](https://explorer.nurachain.net); [cómo leer el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) enseña dónde mirar.

Nada de esto es asesoramiento legal. Las propuestas son públicas, los plazos de comentarios son reales y las fechas de arriba conviene contrastarlas con el [Tesoro de EE. UU.](https://home.treasury.gov) y no con una entrada de blog.
