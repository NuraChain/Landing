Cada afirmación de que una cadena es barata cita un número. Una comisión está hecha de tres, y los dos que faltan suelen ser donde vive la afirmación.

```
comisión en moneda = unidades de gas x precio del gas x precio de la moneda nativa
```

Las unidades de gas las fija lo que hace la transacción. El precio del gas lo fija el mercado del espacio de bloque. El precio de la moneda lo fija todo lo demás. Una cadena con un precio de gas minúsculo y una moneda cara no es barata; una con precio de gas alto y moneda sin valor no es cara.

## Los tres números, por separado

**Las unidades de gas** son deterministas. Una transferencia simple son 21.000. Una transferencia ERC-20 suele estar entre 45.000 y 65.000, según si la ranura de saldo del destinatario ya es distinta de cero. Un despliegue de contrato va de miles a millones según el tamaño del bytecode. Son propiedades de la EVM y son iguales en toda cadena EVM.

**El precio del gas** es el mercado. Desde EIP-1559 se divide en una comisión base que el protocolo fija por bloque y quema, y una comisión de prioridad que añades para entrar antes. En la red principal de Ethereum, durante 2026 la comisión base ha pasado largos tramos en torno a 0,15 gwei, lo que deja una transferencia básica por debajo de un céntimo. Es otro mundo respecto a 2021, y es consecuencia directa de que la demanda se mudó a los rollups y de que existe espacio de blobs para sus datos.

**El precio de la moneda** es la parte que nadie controla y todos olvidan. También es la razón de que una comisión citada en gwei no diga nada hasta que multiplicas.

## Estímalo tú mismo

Dos llamadas JSON-RPC tarifican cualquier transacción en cualquier red EVM. No hace falta panel.

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

El resultado es una cadena hexadecimal en wei. Divide por 10^9 para gwei, multiplica por tus unidades de gas y divide por 10^18 para obtener una cifra en monedas enteras. `eth_estimateGas` hace la primera mitad de la multiplicación si le pasas un objeto de transacción.

Hacer esto una vez, contra la propia cadena, vale más que cualquier tabla comparativa — incluido este artículo.

## Por qué el límite de gas afecta al precio

El precio del gas es una subasta por espacio en un bloque. Amplía el espacio y, en igualdad de condiciones, el precio de equilibrio baja. Por eso exactamente la próxima subida del límite de gas por bloque de Ethereum — de unos 60 millones hacia algo cercano a 200 millones, habilitada por los cambios de [la actualización Glamsterdam](/blog/ethereum-glamsterdam-upgrade) — es tanto una historia de comisiones como de capacidad.

## En Nura Chain

El gas se paga en NURA, los bloques caen cada tres segundos aproximadamente y las transacciones llevan una comisión base EIP-1559, así que la aritmética anterior se aplica sin cambios. Los valores que necesitas están en [qué es Nura Chain](/blog/what-is-nura-chain), y [conectarse al RPC](/blog/connect-to-nura-chain-rpc) cubre el endpoint con el que habla el curl de arriba.

Un hábito práctico: estima antes de enviar, no después. Las unidades de gas se pueden saber de antemano, y la transacción que te sorprende es casi siempre la que tocó más almacenamiento del que esperabas.
