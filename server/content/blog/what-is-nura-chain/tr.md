Nura Chain, Ethereum Sanal Makinesi'ni (EVM) çalıştıran herkese açık bir blok zinciridir. Daha önce Solidity ile sözleşme yazdıysanız, MetaMask'e bir ağ eklediyseniz ya da bir Ethereum JSON-RPC uç noktasını çağırdıysanız, bildiklerinizin büyük bölümü burada değişmeden geçerlidir: aynı hesap modeli, aynı işlem biçimi, aynı araçlar.

Bu sayfa doğrudan bir tarif. Ağ nedir, onunla konuşmak için hangi değerlere ihtiyacınız var ve bugün çevresinde gerçekten ne var.

## Ağa kısa bir bakış

Bir cüzdanın ya da istemci kütüphanesinin sizden isteyeceği değerler bunlar.

- Ağ adı: Nura Chain
- Zincir kimliği: `1020`, cüzdanların onaltılık biçimde `0x3fc` olarak istediği değer
- RPC uç noktası: `https://rpc.nurachain.net`
- Blok gezgini: `https://explorer.nurachain.net`
- Yerel coin: Nura Coin, sembolü `NURA`, 18 ondalık basamak
- Blok süresi: yaklaşık 3 saniye

Bunların hiçbirini güvene dayanarak kabul etmeyin — bu sayfadan geldiği için bile. Sorarsanız uç noktanın kendisi zincir kimliğini söyler:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

Yanıt `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}` olur ve `0x3fc`, onluk tabanda 1020 demektir. Bu denetim on saniye sürer ve bir ağı cüzdana eklemeden önce edinebileceğiniz en yararlı alışkanlıktır. Yanlış zincir kimliği, insanların kullanmayı hiç düşünmedikleri bir ağa işlem yayınlamasının tam olarak sebebidir.

## EVM uyumluluğu pratikte ne demek

Ethereum Sanal Makinesi, Ethereum'un akıllı sözleşmeler için tanımladığı yürütme ortamıdır. Onu çalıştıran bir zincir aynı derlenmiş bayt kodunu yürütür, aynı JSON-RPC metot adlarına yanıt verir ve aynı 20 baytlık adres biçimini kullanır.

Geliştirenler için bunun üç somut sonucu var.

- Sözleşmeler zaten sahip olduğunuz araç zinciriyle derlenir. Solidity, Hardhat ve Foundry belirli bir ağı değil EVM'yi hedefler; dolayısıyla yeni bir zincir, yeniden yazım değil bir yapılandırma satırıdır.
- İstemci kütüphaneleri değiştirilmeden çalışır. ethers.js, viem, web3.py ve wagmi hepsi JSON-RPC konuşur, onları başka bir yere yöneltmek tek satırlık bir değişikliktir.
- Anahtarlar ve adresler sizinle gelir. Aynı secp256k1 anahtarları, aynı türetme yolları, aynı sağlama toplamlı adresler.

Bunun anlamına gelmediği şey, iki zincirin herhangi bir şeyi paylaştığıdır. Ethereum'da denetlediğiniz bir adres burada da sizindir, çünkü aynı anahtardan türer — ama bakiyeler, dağıtılmış sözleşmeler ve geçmiş tümüyle ayrı defterlerdir. Bir varlığı başka bir zincirdeki aynı adrese göndermek onu ikisi arasında taşımaz.

Buradaki bloklar EIP-1559 taban ücreti taşır; yani işlemler London'dan bu yana Ethereum'da olduğu gibi fiyatlanır: protokolün her blok için belirlediği bir taban ücret, artı eklemeyi seçtiğiniz öncelik ücreti. Son birkaç yılda yazılmış herhangi bir kütüphane bunu zaten varsayılan olarak yapar. Ayrıntısı [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) yazısında.

## Bugün ağın çevresinde ne var

Şu anda çalışan ve erişilebilir üç şey var; hangileri olduğunu tam söylemekte yarar var.

- RPC uç noktası. `https://rpc.nurachain.net` standart Ethereum JSON-RPC'ye yanıt verir ve izin verici CORS başlıkları gönderir, böylece tarayıcıda çalışan bir sayfa doğrudan ondan okuyabilir. Bu konu [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) yazısında ele alınıyor.
- Blok gezgini. [Nura Explorer](https://explorer.nurachain.net) blokları, işlemleri ve transferleri dizinler. Gönderdiğiniz şeyin gerçekten olduğunu orada doğrularsınız; anlatımı [Nura Chain gezgini nasıl okunur](/blog/how-to-use-nura-chain-explorer) yazısında.
- Nura Wallet, Android, Windows ve Linux sürümleri olan kendi saklamalı bir cüzdan. Tek giriş yolu değil — özel ağ kabul eden herhangi bir EVM cüzdanı iş görür; bunu [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) adım adım anlatıyor.

Ayrıca BNB ve USDT'nin sarmalanmış temsillerini Nura üzerinde sıradan ERC-20 sözleşmeleri olarak basan bir köprü ve `https://swap.nurachain.net` adresinde bir takas arayüzü var.

## Yerel coin

Nura Coin, sembolü `NURA`, ağın yerel varlığıdır ve 18 ondalık basamağı vardır — bu burada alınmış bir karar değil, EVM'nin yerleşik geleneğidir. Ethereum'da ether ne yapıyorsa o da onu yapar: gaz öder. Her işlem gaz tüketir, gaz NURA cinsinden fiyatlanır ve bir hesabın herhangi bir şey gönderebilmesi için — ilk sözleşme dağıtımı dahil — önce bakiyesi olmalıdır.

Toplam arz 1.000.000.000 NURA'dır. Bunun nasıl bölündüğü ve her payın ne işe yaradığı [Nura Coin arzı ve dağılımı](/blog/nura-coin-tokenomics) yazısında anlatılıyor.

## Sık sorulanlar

### Nura Chain, Ethereum'un bir çatallanması mı?

Aynı sanal makineyi çalıştırır ve aynı RPC arayüzüne yanıt verir; Ethereum araçlarının üzerinde değiştirilmeden çalışmasını sağlayan da budur. Bu, uyumluluk hakkında bir ifadedir; ortak geçmiş ya da ortak durum hakkında değil. İki ağ ayrı defterler tutar.

### MetaMask kullanabilir miyim?

Evet. Özel EVM ağı eklemeyi destekleyen herhangi bir cüzdan yukarıdaki değerlerle Nura Chain'e yöneltilebilir; adım adım anlatım [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) yazısında.

### Herhangi bir şey yapmadan önce NURA'ya ihtiyacım var mı?

Zinciri okumak için hayır. RPC uç noktası herkesin okuma çağrılarına yanıt verir; bir blok gezgininin size tüm ağı hesapsız gösterebilmesinin sebebi de budur. İşlem göndermek ya da sözleşme dağıtmak için evet: gaz NURA ile ödenir.

### Bloklar ne kadar hızlı?

Son bloklar üzerinden ölçüldüğünde aralarında yaklaşık üç saniye var. Bu, zincirin blok üretme temposudur; belirli bir işlemin ne zaman dahil edileceğine dair bir güvence ile aynı şey değildir.

## Bundan sonra nereye

Ağı kullanmak için buradaysanız [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) ile başlayın. Yaklaşık bir dakika sürer ve geri kalan her şey buna bağlıdır.

Geliştirmek için buradaysanız [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) ile başlayın, ardından [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain) yazısına geçin.
