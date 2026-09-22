HTTP lleva desde principios de los noventa con un código de estado llamado `402 Payment Required`. Se reservó para un futuro que nunca llegó, y durante treinta años lo correcto fue no hacer nada con él. En 2026 de pronto sostiene peso: x402 usa esa respuesta para que un cliente pague una única petición, en stablecoins, sin cuenta y sin clave de API.

## El mecanismo, en tres pasos

1. Un cliente pide un recurso. El servidor responde `402` con un cuerpo JSON estructurado que indica el precio y dónde pagar.
2. El cliente paga en cadena y reintenta la petición llevando la prueba del pago.
3. El servidor verifica y sirve la respuesta.

Ese es todo el protocolo. No hay registro, ni ciclo de facturación, ni tarjeta guardada, ni mínimo. Quien necesita una inferencia o una página de datos paga una inferencia o una página de datos.

## Por qué aparece ahora

Porque quien llama dejó de ser una persona. Un agente autónomo no puede rellenar un formulario de alta, ni llevar una tarjeta corporativa, ni esperar a que una factura se liquide a fin de mes. Sí puede guardar una clave y firmar una transferencia, y el precio por petición es el único modelo de cobro que encaja con algo que toma miles de decisiones pequeñas por hora.

Los volúmenes ya no son hipotéticos. En una beta de catorce semanas entre octubre de 2025 y enero de 2026, más de mil participantes crearon más de 9.500 agentes, que ejecutaron entre todos unas 187.000 transacciones autónomas.

## Qué le pide esto a una cadena

Tres propiedades, y ninguna es vistosa.

- **Transacciones baratas.** Un pago de una fracción de céntimo no puede costar más que lo que compra.
- **Finalidad rápida.** La petición está esperando. Una ventana de liquidación medida en minutos es un timeout.
- **Una unidad estable.** Nadie tarifica una llamada de API en un activo que se mueve un diez por ciento antes del reintento.

Cualquier red EVM que cumpla eso puede llevar este tráfico; no hay nada exótico en la transacción. [Conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) usa el mismo JSON-RPC que usaría un agente, y aquí los bloques caen cada tres segundos aproximadamente.

## Lo que hay que resolver antes de desplegar uno

Un agente con una clave es un firmante sin supervisión. Trátalo como tal.

- **Fondéalo poco.** Un saldo caliente del tamaño de un día de trabajo, recargado a propósito, no una tesorería.
- **Acótalo.** Claves de sesión con techo de gasto y caducidad, que es justo lo que las cuentas inteligentes han hecho práctico — ver [EIP-7702 y las cuentas inteligentes](/blog/eip-7702-smart-accounts).
- **Registra cada pago.** Un agente que gasta en silencio es un agente que no puedes auditar después.
- **Separa la clave del prompt.** Todo lo que un agente lee puede intentar darle órdenes. El límite de gasto es el único control que no discute.

Lo interesante de los pagos agénticos no es que las máquinas puedan pagar. Es que el precio por petición por fin tiene una capa de liquidación debajo.
