Desplegar en Nura Chain es desplegar en una red EVM, así que las herramientas son las que ya conoces. Lo que sigue es la configuración, un contrato, el paso de despliegue y —la parte que la mayoría de guías se salta— cómo confirmar que la cosa aterrizó de verdad.

## Antes de empezar

Tres cosas.

- Una cuenta con fondos. Desplegar es una transacción, las transacciones cuestan gas y el gas se paga en NURA. Una cuenta vacía no puede desplegar.
- Una clave privada que estés dispuesto a poner en una variable de entorno. Usa una clave desechable para un primer despliegue, no la que guarda tu saldo.
- Node.js y Hardhat o Foundry.

Nunca subas una clave al repositorio. Todos los ejemplos de abajo leen del entorno, y el fichero que la contenga debe estar en `.gitignore` antes de contener nada real.

## Configuración de Hardhat

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.24',
        settings: { optimizer: { enabled: true, runs: 200 } }
    },
    networks: {
        nura: {
            url: 'https://rpc.nurachain.net',
            chainId: 1020,
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : []
        }
    }
};

export default config;
```

La línea `chainId` no es decorativa. Hardhat la compara con lo que declara el endpoint y se niega a continuar si difieren, que es justo la comprobación que evita que un despliegue acabe en una red que no pretendías.

Sobre la versión de Solidity: compila hacia un objetivo asentado en lugar de la versión más reciente disponible. Un compilador nuevo que por defecto apunte a una versión de la EVM que la red no ha adoptado produce bytecode que se despliega y luego se comporta de forma extraña, un fallo mucho peor que un error de compilación.

## Un contrato que merezca desplegarse

Algo con estado, para que haya manera de saber que funciona:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Registry {
    event Recorded(address indexed who, string note);

    mapping(address => string) private notes;

    function record(string calldata note) external {
        notes[msg.sender] = note;
        emit Recorded(msg.sender, note);
    }

    function noteOf(address who) external view returns (string memory) {
        return notes[who];
    }
}
```

El evento importa para la siguiente sección: los eventos son lo que indexa un explorador, así que un contrato que los emite es un contrato que puedes verificar desde fuera.

## Desplegar

```javascript
import { ethers } from 'hardhat';

async function main() {
    const factory = await ethers.getContractFactory('Registry');
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log('deployed to', await contract.getAddress());
    console.log('tx', contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

Y entonces:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

Conserva la línea `waitForDeployment`. Sin ella el script imprime una dirección y termina antes de que la transacción se mine, y te quedas con una dirección que puede tener código o no.

## Confirmar que aterrizó

Una dirección impresa por un script es una predicción, no un hecho. Pregúntale a la cadena:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

Un contrato desplegado devuelve una cadena hexadecimal larga. Un resultado de `0x` significa que no hay código en esa dirección: el despliegue revirtió, se quedó sin gas o fue a otra red. Esa única llamada distingue «funcionó» de «el script no lanzó una excepción», que no son lo mismo.

Después abre la dirección en [Nura Explorer](https://explorer.nurachain.net) y mira la transacción. [Leer el explorador](/blog/how-to-use-nura-chain-explorer) explica qué significan los campos.

## Lo mismo en Foundry

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

Y para comprobarlo después sin salir de la terminal:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

El segundo debería imprimir `1020`. Conviértelo en costumbre.

## Gas y comisiones

Los bloques aquí llevan una tarifa base EIP-1559, así que deja que tu herramienta estime en lugar de clavar un `gasPrice`. Tanto Hardhat como Foundry leen los datos de comisión del endpoint y construyen una transacción de tipo 2 por defecto; el motivo habitual de que un despliegue quede colgado sin minar es un precio de gas fijado a mano, copiado de la configuración de otro proyecto y por debajo de la tarifa base actual. La mecánica está en [cómo ejecuta Nura Chain el bytecode de la EVM](/blog/nura-chain-evm-compatibility).

## Fallos que conviene reconocer

- **«insufficient funds for gas».** La cuenta no tiene NURA. Fináncialas primero.
- **«invalid chain id» o un desajuste de red.** Tu configuración y el endpoint discrepan. Lee `eth_chainId` y corrige la configuración.
- **La transacción queda pendiente para siempre.** Comisión demasiado baja, o un hueco de nonce de una transacción anterior atascada en la misma cuenta.
- **`eth_getCode` devuelve `0x`.** El despliegue no salió bien, diga lo que diga el script. Busca el recibo de la transacción y comprueba su estado.

## Preguntas frecuentes

### ¿Puedo desplegar un contrato que ya tengo en otra cadena?

Normalmente sí, sin modificar, siempre que no fije una dirección de esa otra red ni dependa de un servicio que aquí no existe. El bytecode en sí es portable.

### ¿Obtendrá la misma dirección que en otra cadena?

Solo si despliegas desde la misma cuenta con el mismo nonce, porque la dirección de un contrato deriva de esos dos. Usa `CREATE2` con un desplegador determinista si necesitas que la dirección coincida a propósito.

### ¿Cómo verifico el código fuente en el explorador?

Busca el formulario de verificación del explorador. La verificación es una comodidad para quien lee, no una propiedad del contrato, así que este funciona igual tenga o no el código publicado.

### ¿Debería usar un proxy para poder actualizar?

Solo si de verdad lo necesitas. Los proxies añaden riesgos de disposición de almacenamiento y una clave de administración que pasa a ser lo más valioso del sistema. Un contrato inmutable que puedes volver a desplegar es más simple y más seguro para la mayoría de proyectos.

## Por dónde seguir

El siguiente despliegue evidente es un token: [crear y desplegar un ERC-20 en Nura Chain](/blog/create-an-erc-20-token-on-nura-chain) se construye directamente sobre esta configuración.

Para poner una interfaz delante de lo que has desplegado, mira [construir una dApp en Nura Chain](/blog/build-a-dapp-on-nura-chain). Y si alguno de los detalles de conexión de arriba te resultó nuevo, [conectarse al RPC de Nura Chain](/blog/connect-to-nura-chain-rpc) los cubre como es debido.
