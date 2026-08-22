Nura Coin, con símbolo `NURA`, es el activo nativo de Nura Chain. Esta página expone qué hace, cuáles son las cifras de suministro publicadas y —la parte que la mayoría de páginas de tokenomics omite— cuáles de esas cifras puedes comprobar por tu cuenta y cuáles estás aceptando por la palabra del proyecto.

## Para qué sirve NURA

Paga el gas. Cada transacción en la red consume gas, el gas se tarifa en NURA, y una cuenta con saldo cero no puede enviar absolutamente nada, incluido su primer despliegue de contrato. Es el mismo papel que juega el ether en Ethereum.

Tiene 18 decimales, que es la convención de la EVM y no una decisión tomada aquí. La unidad más pequeña es, por tanto, una milmillonésima de milmillonésima de NURA, y cualquier cartera o librería hace esa conversión por ti.

Como es el activo nativo y no un contrato, no tiene dirección de token. Si una página te pide «la dirección del contrato de NURA» para añadir la moneda nativa, ten cuidado: lo que hace aparecer NURA es añadir la red, y [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet) explica todo el procedimiento.

## Suministro total

El suministro total publicado es de 1.000.000.000 NURA: mil millones.

## Cómo se reparte el suministro

El proyecto publica un reparto en seis partes. Estas son sus asignaciones declaradas y sus propósitos declarados:

- **Bloqueado — 40%.** Bloqueado durante un año. Qué ocurre con él se decidirá al terminar ese periodo, y se indica que cualquier decisión sobre esta porción requiere la aprobación de un voto de al menos el 65% de la red.
- **Liquidez — 25%.** Asignado a lo largo de un año a proveer y gestionar liquidez, con el objetivo de una liquidez de negociación funcional.
- **Comunidad — 10%.** Distribuido entre miembros de la comunidad durante un año, para quienes contribuyen con actividad, participación, desarrollo o referidos en lugar de pagando. La asignación sigue a la revisión y aprobación del consejo de gestión.
- **Venta pública — 10%.** Ofrecido en una venta pública con un precio total de 24.000 dólares. Esa parte son 100.000.000 de tokens, lo que sale a 0,00024 dólares por NURA.
- **Tesorería — 10%.** Asignado a lo largo de un año bajo supervisión del consejo de gestión, para financiar desarrollo del ecosistema, infraestructura, productos y alianzas.
- **Airdrop — 5%.** Distribuido a lo largo de un año, identificando a los receptores mediante canales y comunidades seleccionados, con la asignación final confirmada por el consejo de gestión.

Esas partes suman el 100%.

## Qué puedes verificar y qué no

Esta es la sección que conviene leer dos veces, porque se aplica a cualquier cadena y no solo a esta.

**Puedes verificar cualquier saldo concreto.** Los saldos están en cadena y son públicos:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

La respuesta va en wei, codificada en hexadecimal. Divide entre 10^18 para obtener NURA.

**No puedes verificar el suministro total de una moneda nativa por RPC estándar.** No existe `eth_totalSupply`. Un ERC-20 tiene una función `totalSupply()` porque es un contrato que lleva su propio libro; la emisión de una moneda nativa vive en las reglas de consenso y en el estado génesis, no en un contrato consultable. Así que la cifra de mil millones de arriba es una afirmación publicada, no algo que una llamada JSON-RPC vaya a confirmarte.

Esa distinción merece interiorizarse. En cualquier cadena, el «suministro total» del activo nativo es una afirmación del proyecto y solo es verificable leyendo la configuración del cliente o el bloque génesis. El suministro de un token, en cambio, siempre es comprobable, y por eso [crear un ERC-20 en Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) puede enseñarte exactamente cómo.

**El suministro circulante no se indica aquí a propósito.** Una cifra de circulante depende de qué asignaciones se consideren desbloqueadas en un momento dado, y eso es un juicio y no una medición, salvo que cada asignación bloqueada esté en una dirección publicada que puedas vigilar. Donde tales direcciones se publiquen, pueden comprobarse con la llamada de saldo de arriba.

## Guardar NURA

Cualquier cartera que acepte una red EVM personalizada puede guardarlo; los valores de red están en [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet). También existe Nura Wallet, una cartera de autocustodia hecha para esta red con versiones para Android, Windows y Linux.

Uses lo que uses, autocustodia significa que las claves son tuyas y la responsabilidad también. No hay vía de recuperación para una frase semilla perdida, ni en esta red ni en ninguna otra.

## Preguntas frecuentes

### ¿Es NURA un token ERC-20?

No. Es la moneda nativa de la red, igual que el ether es nativo de Ethereum. Los tokens ERC-20 existen en Nura Chain como contratos separados, pero NURA no es uno de ellos.

### ¿Necesito NURA para usar la red?

Para leerla no: el endpoint RPC responde llamadas de lectura a cualquiera. Para enviar una transacción o desplegar un contrato sí, porque es lo que paga el gas.

### ¿Dónde veo el precio actual?

Esta página no cita un precio en vivo, y cualquier página que lo haga debería contrastarse con un exchange en el que realmente puedas operar. La única cifra indicada arriba es el precio publicado de la venta pública, que es una condición histórica fija de esa venta y no una cotización de mercado.

### ¿Cómo compruebo el saldo de una cartera concreta?

Usa la llamada `eth_getBalance` de arriba, o pega la dirección en [Nura Explorer](https://explorer.nurachain.net). Ambos leen la misma cadena; [cómo usar el explorador](/blog/how-to-use-nura-chain-explorer) explica por qué comprobar los dos es una buena costumbre.

## Por dónde seguir

Para tener o mover NURA de verdad, empieza por [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet).

Para saber qué es lo que la moneda está pagando —la propia red, su ID de cadena y su RPC— mira [qué es Nura Chain](/blog/what-is-nura-chain). Y si la distinción sobre el suministro te ha interesado, [crear un ERC-20 en Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) muestra el caso contrario, donde el suministro sí es totalmente comprobable.
