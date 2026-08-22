Nura Coin, sembolü `NURA`, Nura Chain'in yerel varlığıdır. Bu sayfa onun ne işe yaradığını, yayımlanmış arz rakamlarını ve çoğu tokenomik sayfasının atladığı kısmı ortaya koyuyor: bu rakamlardan hangilerini kendiniz denetleyebilirsiniz, hangilerini projenin sözüne güvenerek kabul edersiniz.

## NURA ne işe yarar

Gaz öder. Ağdaki her işlem gaz tüketir, gaz NURA cinsinden fiyatlanır ve bakiyesi sıfır olan bir hesap hiçbir şey gönderemez — ilk sözleşme dağıtımı dahil. Ethereum'da ether'in oynadığı rolün aynısıdır.

18 ondalık basamağı vardır; bu, burada alınmış bir karar değil EVM'nin yerleşik geleneğidir. Dolayısıyla en küçük birim bir NURA'nın milyarda birinin milyarda biridir ve bu dönüşümü her cüzdan ve kütüphane sizin için yapar.

Bir sözleşme değil yerel varlık olduğu için token adresi yoktur. Yerel coini eklemek üzere bir sayfa sizden "NURA'nın sözleşme adresini" isterse dikkatli olun: NURA'yı görünür kılan şey ağı eklemektir ve [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) bütün süreci anlatır.

## Toplam arz

Yayımlanan toplam arz 1.000.000.000 NURA'dır — bir milyar.

## Arz nasıl bölünmüş

Proje altı parçalı bir dağılım yayımlıyor. Beyan ettiği paylar ve beyan ettiği amaçlar şunlar:

- **Kilitli — %40.** Bir yıllığına kilitli. Bu payın akıbeti sürenin bitiminde kararlaştırılacak ve bu pay hakkındaki herhangi bir kararın ağın en az %65'inin oyuyla onaylanmasının gerektiği beyan ediliyor.
- **Likidite — %25.** Bir yıllık süre boyunca likidite sağlamak ve yönetmek için tahsis ediliyor; amaç işleyen bir işlem likiditesi.
- **Topluluk — %10.** Bir yıl içinde topluluk üyelerine dağıtılıyor; ödeme yaparak değil etkinlik, katılım, geliştirme ya da yönlendirme yoluyla katkı sunanlar için. Tahsis, yönetim kurulunun incelemesi ve onayının ardından yapılıyor.
- **Halka satış — %10.** Toplam 24.000 dolar fiyatla halka satışa sunuluyor. Bu pay 100.000.000 token eder, yani NURA başına 0,00024 dolar.
- **Hazine — %10.** Yönetim kurulunun gözetiminde bir yıllık süre boyunca tahsis ediliyor; ekosistem geliştirme, altyapı, ürünler ve ortaklıkları finanse etmek için.
- **Airdrop — %5.** Bir yıllık süre boyunca dağıtılıyor; alıcılar seçilmiş kanallar ve topluluklar üzerinden belirleniyor, nihai tahsisi yönetim kurulu onaylıyor.

Bunların toplamı %100'dür.

## Neyi doğrulayabilirsiniz, neyi doğrulayamazsınız

Bu bölüm iki kez okunmayı hak ediyor; çünkü yalnızca bu zincir için değil her zincir için geçerli.

**Herhangi bir bakiyeyi doğrulayabilirsiniz.** Bakiyeler zincir üzerinde ve herkese açıktır:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

Yanıt wei cinsinden ve onaltılık kodlanmış gelir. NURA için 10 üzeri 18'e bölün.

**Ama yerel bir coinin toplam arzını standart RPC ile doğrulayamazsınız.** `eth_totalSupply` diye bir şey yok. Bir ERC-20'nin `totalSupply()` fonksiyonu vardır, çünkü kendi defterini tutan bir sözleşmedir; yerel bir coinin ihracı ise sorgulanabilir bir sözleşmede değil, uzlaşı kurallarında ve genesis durumunda yaşar. Dolayısıyla yukarıdaki bir milyar rakamı yayımlanmış bir iddiadır, bir JSON-RPC çağrısının size doğrulayacağı bir şey değil.

Bu ayrım içselleştirilmeye değer. Herhangi bir zincirde yerel varlığın "toplam arzı" projenin yaptığı bir beyandır ve yalnızca istemcinin yapılandırması ya da genesis bloğu okunarak doğrulanabilir. Buna karşılık token arzı her zaman denetlenebilir — [Nura Chain üzerinde ERC-20 oluşturmak](/blog/create-an-erc-20-token-on-nura-chain) yazısının size tam olarak nasıl yapılacağını gösterebilmesinin sebebi de budur.

**Dolaşımdaki arz burada bilerek belirtilmedi.** Dolaşım rakamı, belirli bir anda hangi payların kilidi açılmış sayıldığına bağlıdır ve her kilitli pay izleyebileceğiniz yayımlanmış bir adreste durmuyorsa bu bir ölçüm değil bir yargıdır. Böyle adreslerin yayımlandığı yerlerde, yukarıdaki bakiye çağrısıyla denetlenebilirler.

## NURA tutmak

Özel EVM ağı kabul eden herhangi bir cüzdan onu tutabilir — ağ değerleri [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) yazısında. Ayrıca bu ağ için yapılmış, Android, Windows ve Linux sürümleri olan kendi saklamalı bir cüzdan olan Nura Wallet da var.

Hangisini kullanırsanız kullanın, kendi saklama anahtarların sizin olması demektir; sorumluluğun da öyle. Kaybolmuş bir kurtarma ifadesi için ne bu ağda ne başka bir ağda bir geri kazanım yolu vardır.

## Sık sorulanlar

### NURA bir ERC-20 token mı?

Hayır. Ether'in Ethereum'a yerel olduğu anlamda ağın yerel coinidir. ERC-20 tokenlar Nura Chain üzerinde ayrı sözleşmeler olarak vardır, ama NURA'nın kendisi onlardan biri değildir.

### Ağı kullanmak için NURA'ya ihtiyacım var mı?

Ondan okumak için hayır — RPC uç noktası herkesin okuma çağrılarına yanıt verir. İşlem göndermek ya da sözleşme dağıtmak için evet; çünkü gazı ödeyen odur.

### Güncel fiyatı nerede görürüm?

Bu sayfa canlı fiyat vermez ve veren herhangi bir sayfa, gerçekten işlem yapabileceğiniz bir borsayla karşılaştırılmalıdır. Yukarıda verilen tek rakam yayımlanmış halka satış fiyatıdır; bu, o satışın sabit tarihsel bir koşuludur, piyasa kotasyonu değil.

### Belirli bir cüzdanın bakiyesini nasıl denetlerim?

Yukarıdaki `eth_getBalance` çağrısını kullanın ya da adresi [Nura Explorer](https://explorer.nurachain.net) içine yapıştırın. İkisi de aynı zinciri okur — [gezgini nasıl kullanırsınız](/blog/how-to-use-nura-chain-explorer) ikisini birden denetlemenin neden iyi bir alışkanlık olduğunu anlatıyor.

## Bundan sonra nereye

Gerçekten NURA tutmak ya da hareket ettirmek için [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) ile başlayın.

Coinin neyin bedelini ödediğini — ağın kendisini, zincir kimliğini ve RPC'sini — öğrenmek için [Nura Chain nedir](/blog/what-is-nura-chain) yazısına bakın. Yukarıdaki arz ayrımı ilginizi çektiyse, [Nura Chain üzerinde ERC-20 oluşturmak](/blog/create-an-erc-20-token-on-nura-chain) arzın tümüyle denetlenebildiği karşıt durumu gösteriyor.
