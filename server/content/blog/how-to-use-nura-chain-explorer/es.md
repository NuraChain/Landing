Un explorador de bloques es cómo compruebas que algo que hiciste ocurrió de verdad. No lo que afirma una cartera, ni lo que imprimió un script: lo que registró la cadena. Esto cubre cómo leer [Nura Explorer](https://explorer.nurachain.net) y el hábito que más importa: no fiarse tampoco de él a ciegas.

## Qué es realmente un explorador

Es un lector, no una autoridad. Un explorador ejecuta un nodo, observa cada bloque y guarda lo que ve en una base de datos que puede consultar: bloques, transacciones y transferencias, indexados para que una persona pueda buscar por hash o por dirección.

Esa distinción importa. El explorador no decide nada. Si discrepa de la cadena, la cadena tiene razón y el explorador va atrasado o está roto. Todo lo que te muestra está disponible directamente desde el endpoint RPC, que es de lo que trata la última sección.

## Encontrar una transacción

Toda transacción tiene un hash: una cadena de 66 caracteres que empieza por `0x`. Tu cartera lo enseña tras enviar; un script de despliegue lo imprime. Pégalo en el buscador del explorador.

Si no aparece nada, hay tres explicaciones corrientes antes de suponer que algo se ha perdido:

- La transacción sigue pendiente y todavía no se ha incluido en un bloque.
- El explorador aún no ha indexado el bloque que la contiene.
- Se emitió a otra red. Esta es con diferencia la más común, y por eso importan las comprobaciones de ID de cadena.

## Leer una transacción

Los campos que conviene entender:

- **Estado.** Éxito o fallo. Una transacción fallida ocurrió igualmente, ocupa sitio en un bloque y costó gas. «Fallida» no significa «no pasó»: significa que el código revirtió después de gastarse la comisión.
- **Bloque.** Qué bloque la incluyó y cuántos bloques se han construido encima desde entonces. Más bloques encima significa más asentada.
- **De / Para.** El remitente, y o bien un destinatario o bien un contrato. En un despliegue, `Para` va vacío y el contrato creado aparece por separado.
- **Valor.** Cuánto NURA se movió como activo nativo. Una transferencia de token suele mostrar `0` aquí, porque los tokens se movieron dentro del contrato y no como valor nativo. Esto sorprende a la gente constantemente.
- **Gas usado y comisión.** Lo que costó realmente, que suele ser menos que el límite fijado.
- **Nonce.** El contador de transacciones del remitente. Los huecos en él son la razón de que una transacción atascada bloquee todo lo que viene detrás desde la misma cuenta.

## Leer una dirección

Existen dos clases, y el explorador las distingue.

Una cuenta de propiedad externa la controla una clave privada. Tiene un saldo y un historial de transacciones, y nada más.

Una dirección de contrato tiene código. Si desplegaste algo y el explorador no muestra código, el despliegue no salió bien diga lo que diga tu script: mira [desplegar un contrato inteligente](/blog/deploy-a-smart-contract-on-nura-chain).

En un contrato de token, la parte interesante es el historial de transferencias, porque es el registro del evento `Transfer` y no una tabla de saldos. Son los mismos datos que usa cualquier cartera para mostrarte el saldo de un token.

## Leer un bloque

La página de un bloque muestra la altura, la marca de tiempo, las transacciones incluidas, el gas usado frente al límite y la tarifa base en ese momento.

En Nura Chain los bloques llegan aproximadamente cada tres segundos. Un gas usado muy por debajo del límite significa que hay sitio: una transacción que no entra está quedándose fuera por precio y no por congestión, lo que apunta a la comisión y no al tráfico.

## Contrastar con el RPC

Esta es la sección que conviene retener. Cualquier dato que muestre el explorador se le puede preguntar a la cadena directamente:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xYourTxHash"]}'
```

El recibo lleva `status` —`0x1` para éxito, `0x0` para reversión— más el número de bloque, el gas usado y los registros de eventos. Esa es la respuesta autorizada.

Lo mismo para un contrato:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xTheContract","latest"]}'
```

Si alguna vez el explorador y el endpoint discrepan, cree al endpoint. Más útil todavía: cuando vayas a actuar sobre algo valioso, comprueba los dos. Que dos lectores independientes coincidan es una señal mucho más fuerte que una sola interfaz segura de sí misma. La mecánica está en [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc).

## Qué no puede decirte un explorador

- **Si un contrato es seguro.** Muestra código e historial, no intenciones. Un contrato verificado es un contrato legible, no auditado.
- **Si un token es legítimo.** Cualquiera puede desplegar un contrato con cualquier nombre. La identidad es la dirección.
- **Quién es dueño de una dirección.** Las direcciones son seudónimas. Las etiquetas, donde aparezcan, las añade quien opera el explorador y son una afirmación, no un hecho.
- **Por qué falló algo.** Muestra que una transacción revirtió; el motivo vive en la lógica del propio contrato.

## Preguntas frecuentes

### Mi transacción no aparece. ¿Se ha perdido?

Probablemente no. Comprueba el hash contra el RPC con `eth_getTransactionReceipt`. Un resultado nulo significa que aún no se ha minado: pendiente, no perdida. Si nunca confirma, la comisión es la causa habitual.

### El explorador muestra una transferencia de token pero mi valor es cero. ¿Por qué?

Porque los movimientos de token son cambios de estado del contrato, no transferencias nativas. El campo `Valor` sigue solo al NURA. Mira en su lugar la sección de transferencias de token de esa misma transacción.

### ¿Puedo fiarme de un contrato porque esté verificado?

Verificar significa que el código publicado compila al bytecode desplegado. Te dice qué es el código; no dice nada sobre si el código es bueno ni sobre si su autor es honesto.

### ¿Por qué el explorador muestra un saldo distinto al de mi cartera?

Normalmente una de las dos está en otra red, o una está desactualizada. Pregúntale al RPC con `eth_getBalance` y zanja la duda.

## Por dónde seguir

Si todavía no has apuntado una cartera a la red, [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet) es el punto de partida, y el explorador es cómo verificas que funcionó.

Si estás desplegando, [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) y [crear un ERC-20](/blog/create-an-erc-20-token-on-nura-chain) terminan ambos en esta página: el despliegue no está hecho hasta que el explorador y el RPC coinciden en que lo está.
