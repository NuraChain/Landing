ERC-20 token, zincirin bildiği özel bir varlık türü değildir. Adresten bakiyeye bir eşleme tutan ve üzerinde anlaşılmış bir dizi fonksiyonu dışarı açan sıradan bir akıllı sözleşmedir. Geri kalan her şey — cüzdanların onu göstermesi, borsaların listelemesi, gezginlerin dizinlemesi — o arayüzün doğru uygulanmasından doğar.

Bu yazı bir token yazmayı, onu Nura Chain'e dağıtmayı ve en çok gerçek kayba yol açan kısmı ele alıyor: ondalık basamaklar.

## ERC-20 aslında neyi belirler

Bir avuç fonksiyon ve iki olay:

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

`name()`, `symbol()` ve `decimals()` standartta isteğe bağlıdır ama herkesçe beklenir — gösterecek sembolü olmayan bir cüzdan onun yerine adresi gösterir.

`Transfer` olayı, bir tokenı görünür kılan şeydir. Gezginler depolamayı taramaz; olayları dizinler. Bakiyeleri `Transfer` yaymadan oynatan bir sözleşme, hiçbir şeyin göremediği bir tokendır.

## Sözleşme

Aritmetiği kendiniz yazmayın. Gözden geçirilmiş bir uygulama kullanın:

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

Bu, eksiksiz ve çalışan bir tokendır. Basım, duraklatma, kara liste ve transfer ücreti ekleme dürtüsüne, her birini kimin çağırabileceğini tam olarak söyleyebilene dek direnmek gerekir; çünkü eklenen her ayrıcalık, tokenın sahiplerinden alınması için eklenmiş bir yoldur.

## Isıran kısım ondalık basamaklar

`decimals()` bir görüntüleme üstverisidir. Aritmetiği etkilemez. Sözleşme tam sayı saklar; `decimals` ise arayüzlere noktanın nereye konacağını söyler.

Alışılmış 18 ile:

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

Yani "bir milyon token" basmak şu demektir:

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

Bunun yerine `1_000_000` vermek, tokenın milyonda birinin milyonda birini basar ve bu hata bir cüzdan gösterene kadar görünmez kalır.

Tuzak, sembolün ondalık sayısını ima ettiğini varsaymaktır. Etmez ve Nura Chain'de bunun canlı bir örneği var. Buradaki köprülenmiş USDT sözleşmesi 18 ondalık bildiriyor:

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

Ethereum'daki USDT ise 6 kullanır. Aynı sembol, farklı ondalık sayısı, farklı zincirde farklı sözleşme. "USDT 6 ondalık demektir" ifadesini koda gömen herhangi bir entegrasyon burada bir trilyon kat yanılır. `decimals()` değerini her zaman gerçekten konuştuğunuz sözleşmeden okuyun.

## Dağıtım

Yapılandırma [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain) yazısındakinin aynısı: zincir kimliği `1020`, RPC `https://rpc.nurachain.net`. Dağıtım betiği yalnızca yapıcıya bir argüman geçmesiyle ayrılır:

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

`parseUnits`, sıfırları asla elle yazmayasınız diye vardır. Kullanın.

Ardından sözleşmenin yalnızca var olmakla kalmayıp bir token gibi yanıt verdiğini doğrulayın:

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## Cüzdanın onu göstermesini sağlamak

Cüzdanlar tokenları kendiliğinden keşfetmez. Sahibi, sözleşme adresini "token içe aktar" ya da benzeri bir yerden bir kez ekler; cüzdan `symbol` ve `decimals` değerlerini sözleşmenin kendisinden okur.

Cüzdanınız bu ağa henüz hiç yöneltilmemişse, önce [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) gelir.

## Bu zincirde hâlihazırda bulunan iki ERC-20

Yalnızca kendinizinkine değil, gerçek tokenlara bakmakta yarar var. Aşağıdakilerin ikisi de Nura Chain üzerinde dağıtılmış, köprülenmiş varlıkları temsil eden sıradan ERC-20 sözleşmeleridir:

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

Kendi tokenınızı sorguladığınız gibi bunları da sorgulayın ya da [Nura Explorer](https://explorer.nurachain.net) üzerinde açın. Tam da bir ders için yazılmış örnekler olmadıkları için yararlılar — `name()`, `symbol()`, `decimals()` ve `totalSupply()` sorularına başka herhangi bir token gibi yanıt verirler; standardın anlamı da budur.

## Paraya mal olan hatalar

- **Ondalık kaydırması olmadan basmak**, yukarıdaki gibi.
- **Sembolün ondalıkları ima ettiğini sanmak.** `decimals()` okuyun. Her seferinde.
- **Sembole güvenmek.** Herkes kendine `USDT` diyen bir sözleşme dağıtabilir. Kimlik adrestir; ad, dağıtanın seçtiği bir etikettir.
- **Basım yapabilen bir sahibi elde tutmak.** Sınırsız basım yetkisi, arzın anahtar sahibinin dediği kadar olması demektir. Elde tutuyorsanız açıkça söyleyin; gerekmiyorsa vazgeçin.
- **Tokenları tokenın kendi sözleşmesine göndermek.** Yaygın bir sürçme ve genellikle geri alınamaz.

## Sık sorulanlar

### Tokenı bir yere kaydettirmem gerekir mi?

Hayır. Dağıtmak yayımlamaktır. Cüzdanlar ve gezginler onu zincirden okur. Herhangi bir üçüncü taraf hizmetinde listelenmek ise o hizmetin kendi sürecidir.

### Arzı sonradan değiştirebilir miyim?

Yalnızca sözleşmede bilerek eklediğiniz bir basım ya da yakım fonksiyonu varsa. Yukarıdaki örnekte yok: arzı yapım anında sabitlenir, ki dürüst varsayılan budur.

### Tokenı çalıştırmanın maliyeti nedir?

Dağıtım bir kez gaz harcar. Sonrasında her transfer, gönderenin ödediği gazı harcar — NURA ile, sizin tokenınızla değil.

### Kendi ERC-20 sözleşmemi sıfırdan yazmalı mıyım?

Değer taşıyan hiçbir şey için hayır. Arayüz basit görünecek kadar küçük, ama gözden geçirilmiş bir uygulamayı doğru varsayılan yapacak kadar keskin köşesi var (dönüş değerleri, allowance yarışı, ondalıklar).

## Bundan sonra nereye

Tokenın önüne çalışan bir arayüz koymak için, cüzdan bağlantısını ve sayfadan işlem göndermeyi ele alan [Nura Chain üzerinde dApp geliştirmek](/blog/build-a-dapp-on-nura-chain) yazısına bakın.

Transferleri gerçekleştikçe izlemek içinse [Nura Chain gezginini nasıl kullanırsınız](/blog/how-to-use-nura-chain-explorer) bir tokenın olay geçmişini okumayı anlatıyor. Bütün bunların altındaki mekanizma için de [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility).
