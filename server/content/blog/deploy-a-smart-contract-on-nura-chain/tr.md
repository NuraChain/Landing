Nura Chain'e dağıtmak, bir EVM ağına dağıtmaktır; dolayısıyla araçlar zaten bildiğiniz araçlardır. Aşağıda yapılandırma, bir sözleşme, dağıtım adımı ve çoğu rehberin atladığı kısım var: işin gerçekten zincire indiğini nasıl doğrularsınız.

## Başlamadan önce

Üç şey.

- Bakiyesi olan bir hesap. Dağıtım bir işlemdir, işlemler gaz harcar ve gaz NURA ile ödenir. Boş bir hesap dağıtım yapamaz.
- Bir ortam değişkenine koymaya razı olduğunuz bir özel anahtar. İlk dağıtım için gözden çıkarılabilir bir anahtar kullanın, bakiyenizi tutan anahtarı değil.
- Node.js ve Hardhat ya da Foundry.

Bir anahtarı asla depoya işlemeyin. Aşağıdaki tüm örnekler ortamdan okur ve anahtarı tutan dosya, içine gerçek bir şey girmeden önce `.gitignore` içinde olmalıdır.

## Hardhat yapılandırması

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

`chainId` satırı süs değildir. Hardhat onu uç noktanın bildirdiğiyle karşılaştırır ve ayrılık varsa devam etmeyi reddeder; bir dağıtımın istemediğiniz bir ağa gitmesini engelleyen denetim tam olarak budur.

Solidity sürümü üzerine: mevcut en yeni sürüm yerine oturmuş bir hedefe derleyin. Ağın henüz benimsemediği bir EVM sürümünü varsayılan olarak hedefleyen yeni bir derleyici, dağıtılan ama sonra tuhaf davranan bir bayt kodu üretir — bu, derleme hatasından çok daha kötü bir başarısızlıktır.

## Dağıtmaya değer bir sözleşme

Çalıştığını anlamanın bir yolu olsun diye, durumu olan bir şey:

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

O olay bir sonraki bölüm için önemli: gezginin dizinlediği şey olaylardır, dolayısıyla olay yayan bir sözleşme, dışarıdan doğrulayabileceğiniz bir sözleşmedir.

## Dağıtım

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

Ardından:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

`waitForDeployment` satırını koruyun. O olmadan betik bir adres yazdırır ve işlem kazılmadan çıkar; elinizde kod bulunabilecek de bulunmayabilecek de bir adres kalır.

## İndiğini doğrulamak

Bir betiğin yazdırdığı adres bir tahmindir, olgu değil. Zincire sorun:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

Dağıtılmış bir sözleşme uzun bir onaltılık dizi döndürür. `0x` sonucu, o adreste kod olmadığı anlamına gelir — dağıtım geri alınmış, gazı bitmiş ya da başka bir ağa gitmiştir. Bu tek çağrı "işe yaradı" ile "betik hata fırlatmadı" arasını ayırır ve bunlar aynı şey değildir.

Sonra adresi [Nura Explorer](https://explorer.nurachain.net) üzerinde açıp işleme bakın. [Gezgini okumak](/blog/how-to-use-nura-chain-explorer) alanların ne anlama geldiğini anlatıyor.

## Aynısı Foundry ile

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

Ve sonrasında terminalden çıkmadan denetlemek için:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

İkincisi `1020` yazdırmalı. Bunu alışkanlık edinin.

## Gaz ve ücretler

Buradaki bloklar EIP-1559 taban ücreti taşır; bu yüzden `gasPrice` çakmak yerine aracınızın tahmin etmesine izin verin. Hem Hardhat hem Foundry ücret verisini uç noktadan okur ve varsayılan olarak tip-2 işlem kurar; bir dağıtımın kazılmadan asılı kalmasının olağan sebebi, başka bir projenin yapılandırmasından kopyalanmış ve şu anki taban ücretin altında kalan çakılı bir gaz fiyatıdır. İşleyişi [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) yazısında.

## Tanınmaya değer başarısızlıklar

- **"insufficient funds for gas".** Hesapta NURA yok. Önce fonlayın.
- **"invalid chain id" ya da ağ uyuşmazlığı.** Yapılandırmanız ile uç nokta ayrışıyor. `eth_chainId` okuyun ve yapılandırmayı düzeltin.
- **İşlem sonsuza dek bekliyor.** Ücret çok düşük ya da aynı hesapta daha önce takılmış bir işlemden kalan nonce boşluğu.
- **`eth_getCode` `0x` döndürüyor.** Betik ne yazdırmış olursa olsun dağıtım başarılı olmamıştır. İşlem makbuzunu bulun ve durumuna bakın.

## Sık sorulanlar

### Başka bir zincirde zaten olan bir sözleşmeyi dağıtabilir miyim?

Genellikle evet, değiştirmeden; yeter ki o ağdan bir adresi koda gömmüş olmasın ve burada bulunmayan bir hizmete bağlı olmasın. Bayt kodunun kendisi taşınabilirdir.

### Başka bir zincirdekiyle aynı adresi alır mı?

Yalnızca aynı hesaptan aynı nonce ile dağıtırsanız; çünkü sözleşme adresi bu ikisinden türer. Adresin bilerek eşleşmesi gerekiyorsa belirlenimci bir dağıtıcıyla `CREATE2` kullanın.

### Kaynak kodu gezginde nasıl doğrularım?

Gezginin doğrulama formuna bakın. Doğrulama okuyucu için bir kolaylıktır, sözleşmenin bir özelliği değil; sözleşme kaynağı yayımlansa da yayımlanmasa da aynı şekilde çalışır.

### Yükseltilebilirlik için vekil kullanmalı mıyım?

Yalnızca gerçekten gerekiyorsa. Vekiller depolama düzeni tehlikeleri ve sistemdeki en değerli şeye dönüşen bir yönetici anahtarı ekler. Yeniden dağıtabileceğiniz değişmez bir sözleşme çoğu proje için daha basit ve daha güvenlidir.

## Bundan sonra nereye

Sıradaki bariz dağıtım bir token: [Nura Chain üzerinde ERC-20 oluşturmak ve dağıtmak](/blog/create-an-erc-20-token-on-nura-chain) doğrudan bu yapılandırmanın üzerine kurulu.

Dağıttığınız şeyin önüne bir arayüz koymak için [Nura Chain üzerinde dApp geliştirmek](/blog/build-a-dapp-on-nura-chain) yazısına bakın. Yukarıdaki bağlantı ayrıntıları size yabancı geldiyse, [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) bunları gereğince ele alıyor.
