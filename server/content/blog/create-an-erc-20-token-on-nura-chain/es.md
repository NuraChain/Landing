Un token ERC-20 no es un tipo especial de activo que la cadena conozca. Es un contrato inteligente corriente que mantiene un mapa de dirección a saldo y expone un conjunto acordado de funciones. Todo lo demás —que las carteras lo muestren, que los exchanges lo listen, que los exploradores lo indexen— se deriva de implementar bien esa interfaz.

Esto recorre cómo escribir uno, desplegarlo en Nura Chain y la parte que provoca más pérdidas reales: los decimales.

## Qué especifica realmente ERC-20

Un puñado de funciones y dos eventos:

```solidity
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

`name()`, `symbol()` y `decimals()` son opcionales en el estándar pero se esperan universalmente: una cartera sin símbolo que mostrar enseñará la dirección en su lugar.

El evento `Transfer` es lo que hace visible un token. Los exploradores no escanean el almacenamiento; indexan eventos. Un contrato que mueve saldos sin emitir `Transfer` es un token que nada puede ver.

## El contrato

No escribas la aritmética tú mismo. Usa una implementación revisada:

```bash
npm install @openzeppelin/contracts
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Example Token", "EXM") {
        _mint(msg.sender, initialSupply);
    }
}
```

Eso es un token completo y funcional. Conviene resistir la tentación de añadir minteo, pausas, listas negras y comisiones por transferencia hasta poder decir con precisión quién puede llamar a cada una, porque cada privilegio añadido es una vía añadida para quitarle el token a quien lo tiene.

## Los decimales son la parte que muerde

`decimals()` son metadatos de presentación. No afectan a la aritmética. El contrato guarda enteros, y `decimals` le dice a las interfaces dónde poner la coma.

Con los 18 convencionales:

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

Así que mintear «un millón de tokens» significa:

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

Pasar `1_000_000` en su lugar mintea una millonésima de millonésima de token, y el error es invisible hasta que una cartera lo muestra.

La trampa está en suponer que un símbolo implica una cantidad de decimales. No lo hace, y Nura Chain tiene un ejemplo vivo. El contrato de USDT puenteado aquí declara 18 decimales:

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

USDT en Ethereum usa 6. Mismo ticker, distinta cantidad de decimales, distinto contrato en distinta cadena. Cualquier integración que fije en el código «USDT significa 6 decimales» se equivoca aquí por un factor de un billón. Lee siempre `decimals()` del contrato con el que realmente estás hablando.

## Desplegar

La configuración es la de [desplegar un contrato inteligente en Nura Chain](/blog/deploy-a-smart-contract-on-nura-chain): ID de cadena `1020`, RPC `https://rpc.nurachain.net`. El script de despliegue solo difiere en pasar un argumento al constructor:

```javascript
import { ethers } from 'hardhat';

async function main() {
    const supply = ethers.parseUnits('1000000', 18);
    const token = await ethers.deployContract('ExampleToken', [supply]);

    await token.waitForDeployment();

    console.log('token at', await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

`parseUnits` existe para que nunca escribas los ceros a mano. Úsala.

Después, confirma que el contrato responde como token y no que meramente existe:

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## Hacer que una cartera lo muestre

Las carteras no descubren tokens solas. Quien lo tiene añade la dirección del contrato una vez, en «importar token» o similar, y la cartera lee `symbol` y `decimals` del propio contrato.

Si tu cartera todavía no apunta a esta red, [añadir Nura Chain a tu cartera](/blog/add-nura-chain-to-your-wallet) va primero.

## Dos ERC-20 que ya están en esta cadena

Merece la pena mirar tokens reales y no solo el tuyo. Los dos siguientes son contratos ERC-20 corrientes desplegados en Nura Chain, que representan activos puenteados:

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

Consúltalos igual que consultaste el tuyo, o ábrelos en [Nura Explorer](https://explorer.nurachain.net). Son útiles precisamente porque no son ejemplos escritos para un tutorial: responden a `name()`, `symbol()`, `decimals()` y `totalSupply()` como cualquier otro token, que es justamente el sentido de un estándar.

## Errores que cuestan dinero

- **Mintear sin el desplazamiento decimal**, como arriba.
- **Suponer que un ticker implica decimales.** Lee `decimals()`. Siempre.
- **Fiarse del símbolo.** Cualquiera puede desplegar un contrato que se llame `USDT`. La identidad es la dirección; el nombre es una etiqueta que eligió quien desplegó.
- **Conservar un propietario que puede mintear.** Autoridad de minteo ilimitada significa que el suministro es lo que diga quien tiene la clave. Si la conservas, dilo públicamente; si no la necesitas, renuncia a ella.
- **Enviar tokens al propio contrato del token.** Un desliz común y normalmente irrecuperable.

## Preguntas frecuentes

### ¿Tengo que registrar el token en algún sitio?

No. Desplegarlo es publicarlo. Carteras y exploradores lo leen de la cadena. Listarlo en cualquier servicio de terceros es el proceso propio de ese servicio.

### ¿Puedo cambiar el suministro después?

Solo si el contrato tiene una función de minteo o quema que incluiste a propósito. El ejemplo de arriba no la tiene: su suministro queda fijado en la construcción, que es el valor por defecto honesto.

### ¿Qué cuesta mantener el token?

Desplegarlo cuesta gas una vez. Después, cada transferencia cuesta gas que paga quien la envía, en NURA y no en tu token.

### ¿Debería escribir mi propio ERC-20 desde cero?

Para nada que guarde valor, no. La interfaz es lo bastante pequeña como para parecer simple y tiene bastantes aristas (valores de retorno, carreras de allowance, decimales) como para que una implementación revisada sea el valor por defecto correcto.

## Por dónde seguir

Para poner una interfaz funcional delante del token, mira [construir una dApp en Nura Chain](/blog/build-a-dapp-on-nura-chain), que cubre la conexión de cartera y el envío de transacciones desde una página.

Para ver las transferencias según ocurren, [cómo usar el explorador de Nura Chain](/blog/how-to-use-nura-chain-explorer) explica cómo leer el historial de eventos de un token. Y para la mecánica que hay debajo de todo esto, [cómo ejecuta Nura Chain el bytecode de la EVM](/blog/nura-chain-evm-compatibility).
