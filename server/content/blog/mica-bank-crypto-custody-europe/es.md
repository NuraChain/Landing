El Reglamento de la UE relativo a los mercados de criptoactivos, MiCA, está plenamente en vigor desde el 1 de julio de 2026, cuando terminó su periodo transitorio. Un resultado visible llegó el 16 de septiembre: Deutsche Bank dijo que había obtenido la autorización MiCA en Alemania y que ofrecería custodia regulada de criptoactivos a clientes institucionales y corporativos antes de que acabe el año. Un banco de ese tamaño hace ahora, con licencia, lo que las empresas cripto hacían sin ella.

## Datos clave

- **La norma:** el periodo transitorio de MiCA terminó el 1 de julio de 2026. Ofrecer servicios de criptoactivos en la UE requiere ahora autorización.
- **El banco:** Deutsche Bank anunció sus planes de custodia el 16 de septiembre de 2026.
- **Los activos:** Bitcoin y Ether, más tres stablecoins: USDC, EURC y EURAU.
- **El modelo:** el banco tiene las carteras y gestiona las claves privadas en nombre de sus clientes.

## ¿Qué exige realmente MiCA?

Una licencia, y las obligaciones que conlleva ser una entidad financiera.

Una empresa que guarda criptoactivos para clientes, gestiona una plataforma de negociación o ejecuta órdenes necesita la autorización de un regulador nacional, y esa autorización es válida en toda la UE. Los emisores de stablecoins tienen su propio capítulo, con normas de reservas y de rescate. Antes de julio, las firmas que ya operaban podían seguir bajo las normas nacionales mientras presentaban su solicitud. Ese periodo de gracia es lo que terminó.

Es la misma idea que la de la ley estadounidense de stablecoins descrita en [qué cambia la GENIUS Act en cadena](/blog/genius-act-stablecoin-rules): regular a las firmas que tocan el dinero de los clientes, no el libro mayor que hay debajo.

## ¿Qué es, mecánicamente, la custodia bancaria?

Otro que guarda tus claves, con un reglamento.

La descripción de Deutsche Bank es corriente, y de eso se trata: claves protegidas por hardware, aprobaciones que requieren a más de una persona, almacenamiento templado y en frío separados, procedimientos de copia de seguridad y de recuperación. El cliente ve un saldo y da instrucciones. El banco firma.

Para una institución esto resuelve un problema real. Un fondo de pensiones no puede guardar una frase semilla en un cajón; necesita un custodio que un auditor y un regulador acepten. Eso es un banco con licencia.

## ¿A qué renuncias?

A la propiedad que hacía distinto al activo.

Con autocustodia, una transacción necesita tu clave y nada más. Con un custodio, necesita el visto bueno del custodio, y un custodio puede estar cerrado el fin de semana, puede congelar una cuenta por una orden y puede quebrar. El activo es el mismo y la garantía no.

Ninguno de los dos modelos es el correcto. Responden a necesidades distintas.

- **La custodia encaja** con dinero que pertenece a otras personas, o que debe declararse, asegurarse y auditarse.
- **La autocustodia encaja** con dinero del que estás dispuesto a ser el único responsable. No hay ventanilla de recuperación para una frase semilla perdida.

## ¿Llega algo de esto a una cadena EVM?

Solo en los bordes. MiCA regula a los proveedores de servicios, no a las redes, y sus normas de custodia se aplican a las firmas que guardan las claves de los clientes. El software que nunca las guarda es una herramienta, no un custodio.

Ese es el diseño de Nura Wallet —autocustodia, con las claves en tu dispositivo— y el de cualquier cartera EVM que conectes tú mismo, que es lo que recorre [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet). La contrapartida descrita arriba se aplica ahí por completo: nadie puede congelar el saldo, y nadie puede restaurarlo.

Esto es un resumen de un reglamento, no asesoramiento legal. La [ESMA](https://www.esma.europa.eu) mantiene el registro de firmas autorizadas y las normas técnicas.
