Dos cifras de 2026 se citan una contra otra como si una refutara a la otra.

La primera: los protocolos que habían completado una auditoría de seguridad independiente concentran cerca del 88% de todos los fondos robados desde enero de 2025 — 147 de 245 plataformas vulneradas habían pasado por un auditor antes de que llegara el atacante. La segunda: solo alrededor del 11% de los incidentes implicó un fallo de contrato inteligente dentro del alcance auditado, aunque esos costaron unos 396 millones de dólares.

Ambas son ciertas, y juntas dicen algo preciso: las auditorías funcionan sobre lo que auditan. El dinero se va por todo lo demás.

## Por dónde se va de verdad

Las brechas de cadena de suministro e infraestructura se llevaron más de 1.800 millones de dólares en el mismo periodo, la mayor categoría individual. Eso significa una tubería de compilación comprometida, una clave de despliegue robada, una dependencia maliciosa, un front end que sirve un código distinto al del repositorio, un empleado engañado para aprobar algo.

Nada de eso es un bug de contrato. Todo eso vacía un contrato.

Los totales, por cierto, mejoran: los atacantes ejecutaron 207 ataques distintos en el primer semestre de 2026 pero se llevaron 972 millones, menos de la mitad de los 2.300 millones del primer semestre de 2025. Más incidentes, menos dinero. Las defensas funcionan en la capa de protocolo y los atacantes se han movido.

## Qué promete realmente una auditoría

Una auditoría es la revisión de un código concreto, en un commit concreto, frente a un modelo de amenazas concreto. Es genuinamente útil y genuinamente estrecha.

No cubre la clave que despliega el contrato, la CI que lo compila, el paquete npm que importa, el dominio que sirve la interfaz, el firmante del multisig que aprueba una actualización ni el oráculo en el que confía para un precio. Todo eso queda fuera del alcance, y varias de esas cosas son más fáciles de atacar que el código.

## Los controles aburridos que sí aguantan

- **Trata la clave de despliegue como la tesorería.** Hardware, multisig y un umbral que sobreviva a perder a una persona.
- **Fija tus dependencias.** Lockfiles, hashes de integridad y una decisión deliberada cada vez que algo se actualiza.
- **Haz verificable el front end.** Una compilación que otro pueda reproducir desde el código etiquetado, y una forma de notar cuándo el bundle servido deja de coincidir.
- **Ensaya la ruta de actualización.** Quién puede pausar, quién puede actualizar, cuánto tarda y qué pasa si dos de ellos están ilocalizables.
- **Audita el diff, no la release.** El artefacto auditado es un commit. Todo lo posterior está, por definición, sin revisar.

## Leer un contrato tú mismo

Nada de esto exige fiarse de un resumen. En una cadena EVM el bytecode desplegado, el código verificado y cada transacción contra él son públicos, que es exactamente para lo que sirve un explorador — [cómo leer el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) enseña dónde mirar, y [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) explica la verificación desde el otro lado.

El hábito que vale la pena adquirir: antes de aprobar nada, comprueba que la dirección que apruebas es la que publica el proyecto y que está verificada. Cuesta un minuto y atrapa el ataque que ninguna auditoría iba a atrapar.

Las cifras son datos de incidentes de terceros entre enero de 2025 y mediados de 2026; las metodologías difieren entre informes.
