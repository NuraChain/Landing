"EVM uyumlu bir zincir üzerine mi kuralım?" sorusu genellikle bir teknoloji sorusu olarak sorulur. Oysa büyük ölçüde bir ekosistem sorusudur ve ona dürüstçe yanıt vermek, uyumluluğun neyi satın aldığı, neye mal olduğu ve bir kategoriyi değil belirli bir zinciri nasıl yargılayacağınız konusunda açık olmayı gerektirir.

## EVM uyumluluğu gerçekte neyi satın alır

Ethereum Sanal Makinesi, komut kümesi tanımlanmış bir yürütme ortamıdır. Onu uygulayan bir zincir, başka herhangi bir EVM zinciri için derlenmiş bayt kodunu çalıştırabilir. Bundan beş pratik sonuç çıkar.

**Araç zinciri zaten var.** Solidity, Hardhat, Foundry, ethers, viem, web3.py — hiçbiri belirli bir ağı hedeflemez. EVM'yi hedefler. Bir zincir eklemek bir yapılandırma satırıdır, bir taşıma işi değil.

**Standartlar zaten var.** ERC-20, ERC-721 ve ERC-1155 uygulama değil arayüzdür; dolayısıyla yazdığınız token, her cüzdanın ve her gezginin hâlihazırda anladığı geleneklere uyar. Kimseden özel bir biçimi entegre etmesini istemiyorsunuz.

**Denetçiler zaten var.** Bu madde hafife alınıyor. Yeni bir yürütme modeline sahip EVM dışı bir zincirin sözleşmelerini gözden geçirebilecek nitelikte insan havuzu küçüktür ve değer taşıyan herhangi bir şeyi yayına almayı asıl kısıtlayan şey güvenlik incelemesidir.

**Geliştiriciler zaten var.** Solidity bilen birini işe almak, dört projenin kullandığı bir dili öğrenmeye razı birini işe almaktan farklı bir sorundur.

**Kullanıcıların zaten cüzdanı var.** MetaMask'i olan biri, yeni bir şey kurup anahtar taşımak yerine bir ağ ekleyerek — bir dakikalık iş — uygulamanıza ulaşır.

Bunlar bir arada, teknik bir üstünlükten çok bileşik bir üstünlüktür: bütün EVM zincirleri aynı araçları paylaşır, dolayısıyla o araçlardaki iyileştirmeler hepsine yarar.

## Bedeli nedir

Uyumluluk bedava değildir ve onu pazarlayan yazılar bunu pek söylemez.

**EVM'nin kısıtlarını devralırsınız.** Görece pahalı depolamaya sahip 256 bitlik sözcük makinesi, bugün kimsenin sıfırdan seçeceği bir tasarım değil. Farklı seçimler yapan EVM dışı zincirlerin gerçek gerekçeleri vardı.

**Kalabalık bir kategoride yarışırsınız.** Zinciriniz diğer her zincirle aynı bayt kodunu çalıştırıyorsa yürütme sizin farkınız değildir ve farkınızın başka bir yerde olması gerekir — ücretler, kesinlik, yönetişim, belirli bir uygulama.

**EVM'nin bilinen hata biçimlerini de devralırsınız.** Yeniden giriş, onay yarışı, tam sayı işleme, öne geçme. Bunları yönetecek araçların olgun olması tam da tehlikelerin iyi belgelenmiş olmasındandır; bu gerçek bir avantajdır ama tehlikeler yerinde durur.

**Parçalanma gerçektir.** Birçok zincirde aynı adres, farklı sözleşmeleri gösteren aynı sembol, aynı görünen ama ondalıkları farklı token. Çok zincirli sistemlerde kullanıcı kayıplarının çoğu kriptografinin çökmesinden değil, bu tür bir karışıklıktan doğar.

## EVM dışı bir zincirle karşılaştırınca

Dürüst özet: EVM uyumluluğu, ilk dağıtıma kadar geçen süreyi ve hazır bir ekosistemi ödünç almayı iyileştirir. Belirli bir amaç için yapılmış EVM dışı bir zincir ise iyi yapmak üzere tasarlandığı şeyi iyileştirir; bedeli her aracı ya kurmak ya da içe aktarmaktır.

Projenizin değeri yeni bir yürütme anlambiliminde değil uygulamada ise — çoğu projede öyledir — EVM'nin ekosistemi genellikle daha güçlü gerekçedir. EVM'nin gerçekten ifade edemediği bir şeye ihtiyacınız varsa uyumluluk, kabul edilecek yanlış kısıttır.

## Belirli bir EVM zinciri nasıl değerlendirilir

Saklanmaya değer kısım budur; çünkü herhangi bir zincire uygulanır ve yaklaşık on dakika sürer. Aşağıdaki her denetim, ağın kendisi hakkında yanıtladığı bir sorudur; tanıtım metninden bir iddia değil.

1. **Zincir kimliği belgelerin söylediğiyle örtüşüyor mu?** Uç noktaya `eth_chainId` ile sorun. Belgeler eskir; uç nokta bu konuda yalan söylemez.
2. **Hangi istemciyi çalıştırıyor?** `web3_clientVersion` soyu söyler, soy da hangi EVM yükseltmelerini bekleyeceğinizi söyler.
3. **Blok başlığı neye benziyor?** `eth_getBlockByNumber`, EIP-1559 taban ücreti var mı, biçim Birleşme sonrası mı ve gaz sınırı ne, hepsini açığa çıkarır. Bu, bir özellik listesinden çok daha bilgilendiricidir.
4. **Gerçek blok süresi kaç?** Manşet bir sayıya güvenmek yerine bin blok boyunca zaman damgalarını karşılaştırın.
5. **Bir tarayıcı doğrudan okuyabiliyor mu?** İzin verici CORS, ön yüzünüzün kendi vekil sunucusuna ihtiyaç duyup duymayacağına karar verir.
6. **Çalışan bir gezgin var mı?** İçiniz rahat etsin diye değil, hata ayıklamak için. Denetleyemediğiniz bir zincir, üretimde ayakta tutamayacağınız bir zincirdir.
7. **Kendi düğümünüzü çalıştırabiliyor musunuz?** Yanıt hayırsa, o zincirdeki her uygulama kalıcı olarak başkasının altyapısına bağımlıdır.
8. **Ne çalışmayı reddediyor?** `eth_accounts` isteğini reddeden herkese açık bir uç nokta doğru davranıyordur. Ona yanıt veren ise anahtar tutuyordur ve bu bir tehlike işaretidir.

## Aynı liste, uygulanmış hali

Yöntem soyut değil somut olsun diye bunu Nura Chain üzerinde çalıştıralım:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

Bu `0x3fc` döndürür, yani 1020; ağın belgelediğiyle örtüşür. `web3_clientVersion` bir Go uygulaması bildirir. Blok başlığı `baseFeePerGas`, sıfır bir `difficulty` ve bir `withdrawalsRoot` taşır; dolayısıyla ücretler EIP-1559'a göre işler ve biçim Birleşme sonrasıdır. Bloklar yaklaşık üç saniyede bir gelir. Uç nokta izin verici CORS başlıkları gönderdiğinden bir sayfa doğrudan ondan okuyabilir ve `eth_accounts` isteğini açık bir hatayla reddeder — herkese açık bir düğüm için doğru davranış.

Bunların hiçbiri herhangi bir zinciri sizin projeniz için doğru seçim yapmaz. Ama bir zinciri teknik doküman okumak yerine dakikalar içinde betimleyebileceğiniz anlamına gelir ve bu bölümün meselesi de o alışkanlıktır. [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) aynı zemini daha ayrıntılı geçiyor.

## Sık sorulanlar

### EVM uyumluluğu, Layer 2 olmakla aynı şey mi?

Hayır. Layer 2, güvenliğin nereden geldiğiyle ilgilidir — başka bir zincirde uzlaşma. EVM uyumluluğu ise sözleşmelerin nasıl yürütüldüğüyle ilgilidir. Bir zincir bunlardan biri, ikisi birden ya da hiçbiri olabilir.

### Ethereum sözleşmem değiştirilmeden çalışır mı?

Genellikle evet; bir zincir kimliğini koda gömmüyorsa, yalnızca başka bir ağda var olan bir sözleşme adresine atıfta bulunmuyorsa ve dağıtılmamış bir oracle'a bağlı değilse. Gerçekçi sürtünme bu üçüdür, bayt kodu değil.

### Uyumluluk, varlıklarımın zincirler arasında hareket ettiği anlamına mı gelir?

Hayır ve en pahalıya mal olan yanlış anlama budur. Aynı adres her yerde vardır çünkü anahtarınızdan türer; ama bakiyeler ve sözleşmeler zincir başına ayrı defterlerdir. Aralarında değer taşımak bir köprü gerektirir ve köprü, kendi riskleri olan bir sistemdir.

### Denemek ne kadara mal olur?

Düşük ücretli bir zincirde gözden çıkarılabilir bir sözleşme dağıtmak çok az tutar ve ne kadar okursanız okuyun yanıtlanmayacak soruları yanıtlar. [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain) baştan sona yirmi dakika kadar sürer.

## Bundan sonra nereye

Bir EVM zincirinin uygun olduğuna karar verdiyseniz, pratik başlangıç noktası [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc), ardından da [akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain).

Bu ağın kendisine dair bir tarif için — değerleri, üzerinde ne çalıştığı, neyi iddia etmediği — [Nura Chain nedir](/blog/what-is-nura-chain) yazısına bakın.
