Core Lightning, una de las principales implementaciones de la Lightning Network de Bitcoin, ha indicado a los operadores de nodos que actualicen de inmediato a la versión 26.06.8, publicada el 22 de septiembre de 2026. El proyecto dijo que había recibido informes de atacantes que tenían como objetivo nodos con la versión 26.06.7 o anteriores. No ha dicho qué fallo se está utilizando, ni si se han robado fondos.

## Datos clave

- **La instrucción:** actualizar ya a Core Lightning v26.06.8.
- **Quién está expuesto:** los nodos con v26.06.7 o anterior.
- **Qué corrige la versión:** bugs que podían hacer caer un nodo, peticiones que podían agotar su memoria a través de la interfaz REST, y un problema en el cierre de canales que podía costar fondos por el mecanismo de penalización de Lightning.
- **Qué no se sabe:** qué bug está siendo atacado, y si hay algún robo confirmado.
- **Antecedentes:** en agosto el proyecto cribó durante diez días una oleada de informes de vulnerabilidades generados por IA, confirmó varios y publicó la v26.06.7 el 28 de agosto.

## ¿Por qué un nodo de Lightning es distinto de una cartera?

Porque está en línea, guardando claves, todo el tiempo.

Un pago de Lightning se mueve por canales, y un canal es bitcoin bloqueado entre dos partes que actualizan fuera de la cadena el reparto entre ellas. Para enrutar pagos, un nodo debe permanecer conectado y debe poder firmar al instante. Eso lo convierte en una cartera caliente por construcción: las claves que controlan los fondos están en una máquina que responde a peticiones de internet.

## ¿Qué es el mecanismo de penalización?

La defensa de Lightning contra las trampas, y la razón de que el software antiguo sea peligroso.

Cada vez que cambia el saldo de un canal, el estado anterior queda revocado. Si una parte difunde más tarde un estado revocado —intentando reclamar un reparto antiguo y más favorable—, la otra parte puede quedarse con todo el canal como penalización. Es un elemento disuasorio fuerte.

También es implacable con los errores. Un nodo que difunde el estado equivocado por un bug es indistinguible de uno que hace trampa, y se le castiga igual. Por eso un fallo en el cierre de canales es un fallo de pérdida de fondos.

## ¿Por qué el proyecto no ha explicado el bug?

Porque explicarlo armaría al atacante.

Publicar una corrección ya le dice a un lector atento más o menos dónde estaba el problema. Publicar los detalles y los tests le dice a todo el mundo exactamente cómo provocarlo, mientras una parte de los nodos sigue sin parchear. Core Lightning retuvo parte de eso a propósito. El intercambio es incómodo —a los operadores se les pide que actualicen a base de confianza— y es el habitual.

El episodio de agosto es la parte nueva. Una avalancha de informes generados por máquinas es sobre todo ruido, y varios eran reales. Encontrar fallos se ha vuelto barato. El tiempo de los mantenedores no.

## ¿Qué debería sacar de esto cualquiera que opere infraestructura?

- **Suscríbete al canal de versiones** de todo lo que operes y guarde claves. El aviso no le sirve de nada a quien nunca lo ve.
- **Parchea el mismo día,** no en la siguiente ventana de mantenimiento. Los ataques contra una corrección ya divulgada pueden empezar en cuestión de días.
- **Mantén pequeño el saldo caliente.** Un nodo solo necesita lo que enruta.
- **Cierra las interfaces que no uses.** Uno de estos bugs era alcanzable a través de un endpoint REST.

Nada de eso es específico de Lightning. Un nodo o un indexador en cualquier red es software expuesto a internet, y el intervalo entre que se publica una corrección y un operador la instala es donde se hace la mayor parte del daño — el patrón que hay detrás de [por qué los contratos auditados siguen vaciándose](/blog/why-audited-contracts-get-drained). Si solo lees de una cadena, puedes evitar el problema no operando ningún nodo: [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) usa un endpoint público, lo que no te deja nada que parchear ni nada que guardar.

Las notas de versión y los avisos se publican en el [repositorio de Core Lightning](https://github.com/ElementsProject/lightning/releases). Sigue esos, no un resumen.
