El software empezó a pagar cosas en la tercera semana de septiembre de 2026, por dos vías distintas. El 21 de septiembre, Mastercard y Danske Bank completaron lo que llamaron el primer pago de Dinamarca hecho por un agente de IA, y Mastercard anunció el primero de Canadá el mismo día. El 25 de septiembre, Block añadió la Lightning Network de Bitcoin a x402, el protocolo que permite a un agente pagar una única petición web. Los pagos de agentes de IA tienen ahora una respuesta con tarjeta y una respuesta cripto.

## Datos clave

- **Tarjetas:** el 21 de septiembre de 2026 un agente reservó y pagó una cata de café con una Mastercard de Danske Bank, usando Mastercard Agent Pay.
- **Canadá:** un asistente que actuaba en nombre de un titular de tarjeta de Rogers Bank compró un producto dentro de "límites de gasto predefinidos".
- **Cripto:** Block añadió soporte de Lightning a x402 el 25 de septiembre de 2026.
- **Escala de x402:** unos 75,4 millones de transacciones por valor de 24,2 millones de dólares en los 30 días anteriores, según las cifras del propio protocolo.
- **En qué se liquida:** USDC supuso el 99,3% del volumen de x402 en el segundo trimestre de 2026, según Circle.

## ¿Cómo paga un agente con tarjeta?

Tomando prestada la de una persona.

El agente actúa en nombre de un titular de tarjeta que ya ha sido verificado. El pago se autoriza contra la tarjeta de esa persona, dentro de las instrucciones y los límites que ella ha fijado, y el comercio recibe algo que parece un pago con tarjeta corriente. Todo lo que hay detrás es el sistema existente: un banco emisor, contracargos, reglas antifraude, un extracto a fin de mes.

Esa es su fortaleza. Una tienda no tiene que cambiar nada para aceptarlo, y una compra equivocada se puede reclamar.

## ¿Cómo paga un agente con x402?

Guardando una clave.

Un servidor responde a una petición con el estado HTTP `402 Payment Required` y un precio. El agente paga y reintenta. No hay cuenta, ni tarjeta, ni persona de por medio — la mecánica está en [cómo pagan por petición los agentes de IA con x402](/blog/ai-agents-onchain-payments-x402).

Divide las cifras del propio protocolo y la diferencia con las tarjetas salta a la vista: 24,2 millones de dólares entre 75,4 millones de transacciones son unos 32 centavos por cada una. Las redes de tarjetas no se construyeron para pagos de ese tamaño.

## Entonces, ¿cuál gana?

Probablemente las dos, para compras distintas.

- **Las tarjetas encajan** con lo que la gente ya compra: una reserva, un producto, cualquier cosa con un comercio, una política de reembolso y un precio por el que valga la pena reclamar.
- **x402 encaja** con lo que solo compra el software: una llamada de API, una página de datos, una inferencia, miles de veces por hora.

Añadir Lightning importa porque amplía la segunda categoría más allá de las stablecoins. Hasta ahora casi todo el volumen de x402 era USDC; ahora un agente puede pagar en bitcoin con el mismo protocolo.

## ¿Qué no cambia en ninguna de las dos vías?

Un agente que puede pagar es un firmante sin supervisión. La versión con tarjeta pone el límite en la red; la versión cripto lo pone en la cuenta. En ambos casos el control que importa es el techo, porque a un agente se le puede convencer de cosas y a un límite de gasto no.

En una cadena EVM ese techo es una cuenta inteligente con una clave de sesión que caduca — el patrón de [EIP-7702 y las cuentas inteligentes](/blog/eip-7702-smart-accounts). Nura Chain produce un bloque aproximadamente cada tres segundos, con comisiones fijadas por una comisión base EIP-1559, que es la forma que necesitan los pagos por petición. No ofrece ningún producto de pagos para agentes, y nada de lo dicho aquí debe leerse como tal.

Los volúmenes son pequeños y los comunica el propio protocolo. [x402.org](https://x402.org) publica las cifras del protocolo.
