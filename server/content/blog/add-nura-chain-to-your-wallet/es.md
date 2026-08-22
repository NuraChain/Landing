Las carteras no conocen de antemano todas las redes. Antes de que puedas tener un saldo, enviar algo o abrir una aplicación en Nura Chain, hay que decirle a tu cartera que la red existe. Lleva alrededor de un minuto.

## Qué te va a pedir la cartera

Seis valores, y cada cartera pide algún subconjunto de ellos:

- Nombre de la red: Nura Mainnet
- URL del RPC: `https://rpc.nurachain.net`
- ID de cadena: `1020`
- Símbolo de la moneda: `NURA`
- URL del explorador de bloques: `https://explorer.nurachain.net`
- Decimales: 18, que la mayoría de carteras rellena sola

Deja esta página abierta mientras lo haces o, mejor, verifica el ID de cadena de forma independiente: la siguiente sección explica por qué merece treinta segundos.

## La vía de un clic

La mayoría de carteras de navegador admiten una petición estándar, EIP-3085, que permite a una página entregar la definición completa de la red de una vez. El sitio de Nura Chain la usa: el control «Añadir Nura Chain a la cartera» de la página principal y del pie envía exactamente los valores de arriba, y tu cartera te los muestra para que los apruebes.

Esta es la vía preferible, por un motivo que nada tiene que ver con la comodidad. Teclear un ID de cadena a mano es el paso donde se cometen los errores, y una URL de RPC mal escrita es un grado peor: apunta tu cartera a un servidor elegido por quien sea dueño de ese dominio con la errata.

Cuando aparezca el aviso, léelo en lugar de pasar de largo. Una cartera que te muestra la definición de una red te está mostrando exactamente aquello en lo que está a punto de confiar.

## Añadirla a mano

Si tu cartera no admite la petición automática, o prefieres no dejar que una página la haga, todas tienen una ruta manual. En MetaMask es más o menos así:

1. Abre el selector de red en la parte superior de la extensión.
2. Elige «Añadir una red personalizada» (en versiones antiguas: Ajustes, luego Redes, luego Añadir red, luego Añadir manualmente).
3. Rellena los seis valores de arriba.
4. Guarda y cambia a la red nueva.

Otras carteras lo llaman distinto pero piden los mismos campos, porque los campos vienen del estándar y no de la cartera.

## Confirma que estás realmente en Nura Chain

No te saltes esto. Una cartera guardará tan tranquila una red cuyo nombre dice una cosa y cuyo RPC apunta a otra, porque el nombre es una etiqueta que escribiste tú y el RPC es con quien habla de verdad.

El endpoint declara su propia identidad:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

La respuesta es `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}`. `0x3fc` es 1020 en decimal, y debe coincidir con el ID de cadena que muestra tu cartera. Si no coinciden, para y corrige la entrada de red antes de enviar nada.

Si prefieres no usar una terminal, abre [Nura Explorer](https://explorer.nurachain.net) y compara un número de bloque reciente con el que reporta tu cartera. Que el explorador y la cartera lean la misma cadena es la misma comprobación por otra vía.

## Nura Wallet

También existe una cartera hecha específicamente para esta red. Nura Wallet es de autocustodia —las claves se quedan en tu dispositivo— y tiene versiones para Android, Windows y Linux, enlazadas desde la página principal. Viene con la red ya configurada, lo que elimina todo este procedimiento.

No es obligatoria. Nura Chain es una red EVM corriente y sirve cualquier cartera que acepte una red personalizada, que es justamente el sentido de [ser compatible con EVM](/blog/nura-chain-evm-compatibility). Usa la que ya te merezca confianza.

## Cuando algo falla

- **La cartera rechaza el ID de cadena.** Casi siempre una confusión entre la forma decimal y la hexadecimal. `1020` y `0x3fc` son el mismo número; escribir `0x1020` no.
- **Los saldos salen a cero.** Comprueba qué red está seleccionada. La misma dirección existe en toda cadena EVM, así que una cartera apuntada a la red equivocada te enseña una dirección real con un saldo que no tiene nada que ver.
- **Una transacción no confirma nunca.** Suele ser un precio de gas heredado de otra red. Deja que la cartera estime en lugar de sobrescribirlo.
- **El símbolo aparece como otra cosa.** Es cosmético y se arregla editando la entrada de red. No afecta a lo que hace la red.

## Preguntas frecuentes

### ¿Añadir una red es arriesgado en sí mismo?

Añadir una red no mueve fondos ni concede permiso a ninguna aplicación. Lo que importa es a qué URL de RPC apuntas, porque ese es el servidor al que tu cartera pregunta por los saldos y por el que envía transacciones. Usa una en la que tengas motivos para confiar y verifica su ID de cadena.

### ¿Necesito NURA antes de añadir la red?

No. Añadirla no cuesta nada. Necesitarás saldo en NURA antes de poder enviar una transacción, porque el gas se paga en la moneda nativa.

### ¿Puedo usar la misma dirección que ya tengo?

Sí. Tu dirección deriva de tu clave, así que es la misma en toda red EVM. Los saldos y el historial, en cambio, son separados por cadena; en [qué es Nura Chain](/blog/what-is-nura-chain) se explica por qué importa esa distinción.

### ¿Cómo quito la red más adelante?

Desde la misma pantalla de ajustes en la que la añadiste. Quitar una red no afecta a ningún saldo; solo hace que esa cartera deje de mostrar la cadena.

## Siguientes pasos

Con la red añadida, [Nura Explorer](https://explorer.nurachain.net) es la forma más rápida de confirmar que lo que hiciste ocurrió de verdad; [cómo leerlo](/blog/how-to-use-nura-chain-explorer) explica qué significan las columnas.

Si estás aquí para construir y no para custodiar, salta a [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc). Y para saber qué es NURA y cómo se reparte el suministro, mira [suministro y asignación de Nura Coin](/blog/nura-coin-tokenomics).
