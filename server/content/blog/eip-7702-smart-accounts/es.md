Durante una década una cuenta de Ethereum era una de dos cosas. O una cuenta de propiedad externa, controlada por una clave privada e incapaz de ejecutar lógica propia, o un contrato, lleno de lógica y sin ninguna clave que lo controlara. EIP-7702, que llegó con la actualización Pectra en mayo de 2025, acabó con la disyuntiva: una cuenta normal ya puede delegar en código de contrato mientras la clave sigue controlándola.

La adopción fue más rápida de lo habitual. MetaMask, Rabby y Trust lo integraron a lo largo de 2025 y 2026, y las estimaciones del sector sitúan hoy las carteras inteligentes del ecosistema en centenares de millones.

## Qué es exactamente la delegación

Una transacción 7702 lleva una lista de autorización. Firmas una tupla que dice: "las llamadas a mi dirección deben ejecutar el código que hay en esta dirección de contrato". A partir de ahí tu cuenta se comporta como ese contrato, mientras la clave privada sigue siendo su dueña — y sigue pudiendo revocar la delegación más adelante firmando otra.

La dirección no cambia. Ese es todo el sentido, y es justo lo que el enfoque anterior no podía ofrecer.

## Qué ganas

- **Una firma en lugar de tres.** Aprobar e intercambiar se convierten en una única llamada agrupada, así que la aprobación que antes quedaba pendiente ya ni existe.
- **Otro puede pagar el gas.** Un paymaster patrocina la comisión, o la cobra en un token que ya tienes en lugar de en la moneda nativa.
- **Claves limitadas.** Una clave de sesión que solo hace una cosa, durante un día, hasta un importe.
- **Recuperación.** Recuperación social o con guardianes, montada sobre la dirección que ya usas.

## Dónde encaja ERC-4337

ERC-4337 construyó la abstracción de cuentas fuera del protocolo: una mempool aparte de operaciones de usuario, bundlers y un contrato de punto de entrada. Funciona, y es la respuesta correcta para una cuenta que aún no existe. Pero no podía hacer nada por la dirección que llevas cinco años usando, porque esa dirección era una EOA y no podía convertirse en otra cosa.

Ahora se reparten el trabajo: ERC-4337 para cuentas nuevas, 7702 para las que ya están en uso.

## La parte que conviene mirar con cuidado

Una delegación es una autorización en blanco al código que viva en esa dirección. Si el contrato es malicioso, o es actualizable a algo malicioso, la cuenta no queda parcialmente en riesgo: se ha perdido.

- Lee lo que firmas. Una autorización puede presentarse de modo que parezca la firma de un mensaje corriente.
- Delega en implementaciones que tu propia cartera distribuye y audita, no en una dirección que te pasa una web.
- Ten claro cómo revocar. Firmar una delegación a la dirección cero la borra.

## ¿Funciona en la cadena en la que estás?

No automáticamente. Cada red EVM decide qué EIP adopta y cuándo, así que si 7702 está activo en una cadena concreta es algo que se pregunta a la cadena, no algo que se supone. Las cuentas normales funcionan en todas partes, que es lo que explica [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet), y los contratos normales se despliegan como siempre — ver [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain).
