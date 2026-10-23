El 21 de octubre de 2026 la plataforma de alojamiento en la nube Railway reveló que un tercero no autorizado pudo acceder a las variables de entorno cifradas que guardan sus clientes y leer el contenido descifrado de algunas. La investigadora de blockchain Taylor Monahan ha vinculado la brecha de Railway con unos 371.000 dólares en criptomonedas drenados en al menos 19 cadenas EVM, según su estimación recogida por crypto.news el 22 de octubre. Railway no ha confirmado ningún robo de criptomonedas. El patrón es conocido: una clave privada guardada donde un servidor podía leerla fue leída por otra persona.

## Datos clave

- **La revelación:** Railway, 21 de octubre de 2026 — actividad anómala en los sistemas que almacenan las variables de entorno de los clientes, que pueden contener claves de API y credenciales de bases de datos y de registros.
- **El robo alegado:** unos 371.000 dólares en más de 500 transacciones desde más de 200 direcciones en al menos 19 redes EVM, según Taylor Monahan a 22 de octubre. Un desarrollador que publica como ethereumdegen.eth lo cifró en unos 370.000 dólares.
- **Cronología:** según la línea de tiempo de Monahan, el primer robo se produjo a las 19:36 UTC del 21 de octubre; el aviso de Railway se publicó hacia las 21:51 UTC.
- **La respuesta de Railway:** despliegues pausados, petición a todos los clientes de rotar todas las variables guardadas, invalidación de todos los tokens de API de Railway a las 04:17 UTC del 22 de octubre según CryptoSlate, y restablecimiento ese mismo día de las credenciales de los buckets de almacenamiento y de los tokens de GitHub.
- **Sin establecer:** la causa raíz, el número de clientes afectados y si las claves de las carteras drenadas procedían de Railway.

## ¿Qué reveló Railway exactamente?

Que los secretos que guardaba para sus clientes pudieron ser leídos.

El aviso de Railway dice que detectó la actividad la mañana del 21 de octubre y cree que un tercero no autorizado pudo acceder a variables de entorno cifradas y obtener el contenido descifrado de algunas. Su análisis inicial apunta a un subconjunto de usuarios, pero pidió a todos rotar todas las variables y las credenciales de registros privados y revisar los registros de sus servicios. Cree que el incidente forma parte de una serie de ataques contra empresas de plataformas dirigidos a proveedores de inferencia de IA, y ha pedido a los proveedores de origen que revoquen claves. El aviso no menciona criptomonedas, carteras ni claves privadas.

## ¿Cómo se vincula con el robo de criptomonedas?

A través de las carteras vaciadas, no de nada que dijera Railway.

Monahan vinculó los drenajes con el incidente y describió las transacciones como obra de un script barredor de carteras bastante estándar, según crypto.news. Su primer robo es más de dos horas anterior a que Railway lo hiciera público. Los relatos no coinciden del todo: Noah Dunnagan, ingeniero de éxito del cliente de Railway, escribió en X que la empresa tenía motivos para creer que el ataque solo aprovechó tokens de inferencia de IA, según informó The Defiant. Railway no ha confirmado las pérdidas, y la cifra de 371.000 dólares es una estimación externa.

## ¿Por qué una variable de entorno es mal lugar para una clave privada?

Porque la plataforma tiene que poder leerla.

Una variable de entorno es la forma en que una plataforma de alojamiento entrega un secreto a tu proceso al arrancar. Para hacerlo, la plataforma guarda el valor, cifrado en reposo, junto con el medio para descifrarlo. Eso es aceptable para una clave de API que se revoca en un minuto. Una clave privada no se puede revocar. Quien la lee una vez controla la dirección para siempre, y el único remedio es mover los fondos antes que él — y un script barredor está hecho para moverse primero.

Es el mismo argumento de [por qué se vacían incluso los contratos auditados](/blog/why-audited-contracts-get-drained): el código aguanta y el dinero sale por lo que lo rodea.

## ¿Cómo deben los desarrolladores mantener las claves fuera del alojamiento?

- **No pongas una clave con fondos en las variables de una plataforma.** Si un servicio tiene que firmar, dale una clave que guarde solo lo que necesita hoy.
- **Firma en otro lugar.** Un servicio de gestión de claves o un firmante separado guarda la clave y firma bajo petición, de modo que la aplicación nunca la ve.
- **Nunca guardes una frase semilla en un servidor.** Una sola frase deriva todas las direcciones de la cartera.
- **Separa las claves de despliegue de las de tesorería.** La clave que despliega un contrato no debería ser la que guarda sus fondos.
- **Rota al conocer una brecha, y mueve primero los fondos.** Con una clave privada, rotar significa una clave nueva y una transferencia, no una cadena nueva.
- **Vigila las direcciones.** Una alerta ante cualquier transferencia saliente es lo que te avisa en minutos y no en días.

## ¿Qué significa esto para construir en Nura Chain?

Rigen las mismas reglas. Nuestra guía para [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain) lee la clave de despliegue de una variable de entorno en tu propia máquina, y recomienda usar una clave desechable para un primer despliegue, no la que guarda tu saldo. Es una clave local y de vida corta. Una clave con fondos y de larga vida en una plataforma de alojamiento es un riesgo distinto, y los consejos de arriba son para esa.

Los detalles cambiarán a medida que avance la investigación de Railway. La fuente primaria es [la revelación de seguridad de Railway del 21 de octubre de 2026](https://blog.railway.com/p/security-disclosure-wednesday-october-21st).
