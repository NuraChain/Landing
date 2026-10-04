Circle abrió al público su blockchain Arc el 16 de septiembre de 2026. Arc es una Layer 1 construida en torno a una decisión de diseño: las comisiones de las transacciones se pagan en USDC, la stablecoin en dólares que emite Circle, y no en una moneda nativa volátil. Entre sus primeros validadores están BlackRock, Visa y Mastercard. Llega después de Tempo, la cadena de pagos de Stripe y Paradigm, que entró en funcionamiento en marzo de 2026.

## Datos clave

- **Lanzamiento:** red principal pública el 16 de septiembre de 2026, tras una fase privada con instituciones.
- **Comisiones:** se pagan en USDC. Existe un token ARC aparte, pero no es con lo que pagas el gas.
- **Compatibilidad:** Arc ejecuta la EVM, así que los contratos en Solidity y las carteras estándar funcionan.
- **Validadores:** instituciones con nombre propio, entre ellas BlackRock, DTCC, Visa, Mastercard, ICE y Standard Chartered.
- **Sin terminar:** las funciones de privacidad son opcionales y siguen en desarrollo.

## ¿Por qué querría alguien pagar el gas en una stablecoin?

Porque un departamento financiero no puede presupuestar en un activo que fluctúa.

En la mayoría de las cadenas pagas las comisiones en la moneda nativa. Su precio se mueve, así que el coste de una transacción en dólares se mueve con él, y una empresa tiene que mantener un activo que por lo demás no quiere, solo para pagar transferencias. Las comisiones en USDC eliminan ambos problemas: el coste se expresa en la unidad en la que la empresa ya presenta sus cuentas, y no hay nada adicional en el balance.

Es una comodidad real, y conviene dejar claro que es una comodidad y no un avance decisivo. Cómo funcionan las comisiones en una cadena EVM corriente —una comisión base que se ajusta con la demanda, pagada en la moneda nativa— está explicado en [cuánto cuesta el gas de verdad en 2026](/blog/what-gas-actually-costs-in-2026).

## ¿Quién la opera?

Instituciones con nombre propio, y esa es la contrapartida.

Un conjunto de validadores formado por grandes firmas reguladas es exactamente lo que un banco necesita ver antes de liquidar pagos en una red. También es un grupo pequeño al que se puede identificar, regular y dar instrucciones. Que eso cuente como una fortaleza depende de lo que quieras de una cadena: una empresa quiere una contraparte a la que pueda demandar, y un usuario en una jurisdicción difícil quiere una red sin nadie a quien se le pueda ordenar que se la apague.

Ninguno de los dos se equivoca. Son productos distintos que comparten una máquina virtual.

## ¿Es otra cadena EVM más?

Sí, y esa es la parte menos sorprendente. Construir sobre la EVM significa que Arc hereda desde el primer día todas las carteras, librerías y firmas de auditoría, y por eso casi todas las redes nuevas toman la misma decisión — el razonamiento está en [por qué las cadenas EVM no dejan de multiplicarse](/blog/why-so-many-evm-chains).

Lo que una cadena nueva no puede heredar es la liquidez y los usuarios. La respuesta de Arc es la distribución: Circle ya tiene la stablecoin y las relaciones institucionales. Es una posición de partida más fuerte que la de la mayoría de los lanzamientos, y sigue siendo una posición de partida.

## ¿Qué significa para las cadenas de propósito general?

Que "cadena de pagos" se está convirtiendo en una categoría, en manos de las empresas que emiten los dólares o gestionan los cobros. Las redes de propósito general no ganarán esa competición con comisiones expresadas en dólares.

Lo que conservan es la apertura. En Nura Chain cualquiera puede desplegar un contrato y cualquiera puede leerlo; las comisiones se pagan en NURA con una comisión base EIP-1559, y los bloques llegan aproximadamente cada tres segundos. Es una promesa distinta de la de Arc, hecha a un usuario distinto, y [qué es Nura Chain](/blog/what-is-nura-chain) la enuncia con claridad.

Los detalles que aparecen aquí son los anunciados en el lanzamiento y cambiarán; [Circle](https://www.circle.com) es la fuente de los actuales.
