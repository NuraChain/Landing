Blok gezgini, yaptığınız şeyin gerçekten olduğunu denetleme biçiminizdir. Cüzdanın iddia ettiği değil, bir betiğin yazdırdığı değil — zincirin kaydettiği. Bu yazı [Nura Explorer](https://explorer.nurachain.net) okumayı ve en çok önem taşıyan alışkanlığı ele alıyor: ona da körü körüne güvenmemek.

## Gezgin aslında nedir

O bir okuyucudur, merci değil. Gezgin bir düğüm çalıştırır, her bloğu izler ve gördüğünü arayabildiği bir veritabanına yazar — bloklar, işlemler ve transferler; bir insan hash ya da adresle arayabilsin diye dizinlenmiş halde.

Bu ayrım önemli. Gezgin hiçbir şeye karar vermez. Zincirle ayrışırsa haklı olan zincirdir; gezgin geride kalmıştır ya da bozuktur. Size gösterdiği her şey doğrudan RPC uç noktasından da alınabilir; son bölüm bununla ilgili.

## Bir işlemi bulmak

Her işlemin bir hash'i vardır — `0x` ile başlayan 66 karakterlik bir dizi. Cüzdanınız gönderimden sonra gösterir, dağıtım betiği yazdırır. Onu gezginin aramasına yapıştırın.

Hiçbir şey dönmezse, bir şeyin kaybolduğunu varsaymadan önce üç sıradan açıklama var:

- İşlem hâlâ beklemede ve henüz bir bloğa alınmadı.
- Gezgin, onu içeren bloğu henüz dizinlemedi.
- Başka bir ağa yayınlandı. Bu, açık ara en yaygın olanıdır ve zincir kimliği denetimlerinin önemi de buradan gelir.

## Bir işlemi okumak

Anlamaya değer alanlar:

- **Durum.** Başarı ya da başarısızlık. Başarısız bir işlem yine de gerçekleşmiştir, yine de blokta yer kaplar ve yine de gaz harcamıştır. "Başarısız", "olmadı" demek değil; ücret harcandıktan sonra kodun geri alındığı anlamına gelir.
- **Blok.** Hangi bloğun onu aldığı ve o zamandan beri üzerine kaç blok kurulduğu. Üstte ne kadar çok blok varsa o kadar oturmuştur.
- **Gönderen / Alıcı.** Gönderen ve ya bir alıcı ya da bir sözleşme. Dağıtımda `Alıcı` boştur ve oluşturulan sözleşme ayrıca görünür.
- **Değer.** Yerel varlık olarak ne kadar NURA hareket etti. Bir token transferi burada genellikle `0` gösterir; çünkü tokenlar yerel değer olarak değil sözleşmenin içinde hareket etmiştir. Bu insanları sürekli şaşırtır.
- **Harcanan gaz ve ücret.** Gerçekte neye mal olduğu; genellikle belirlenen sınırdan azdır.
- **Nonce.** Gönderenin işlem sayacı. Buradaki boşluklar, takılı bir işlemin aynı hesaptan gelen arkasındaki her şeyi tıkamasının sebebidir.

## Bir adresi okumak

İki tür vardır ve gezgin bunları ayırt eder.

Dışarıdan sahiplenilen hesap bir özel anahtarla denetlenir. Bakiyesi ve işlem geçmişi vardır, başka bir şeyi yoktur.

Sözleşme adresinde ise kod bulunur. Bir şey dağıttıysanız ve gezgin kod göstermiyorsa, betiğiniz ne bildirmiş olursa olsun dağıtım başarılı olmamıştır — bkz. [akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain).

Bir token sözleşmesinde ilginç kısım transfer geçmişidir; çünkü o bir bakiye tablosu değil `Transfer` olay günlüğüdür. Herhangi bir cüzdanın size token bakiyesi göstermek için kullandığı veriyle aynısıdır.

## Bir bloğu okumak

Blok sayfası yüksekliği, zaman damgasını, alınan işlemleri, sınıra karşı harcanan gazı ve o andaki taban ücreti gösterir.

Nura Chain'de bloklar aşağı yukarı üç saniyede bir gelir. Sınırın epey altında kalan gaz kullanımı yer olduğu anlamına gelir — alınmayan bir işlem kalabalıktan değil fiyattan dışarıda kalıyordur ve bu, parmağı trafiğe değil ücrete doğrultur.

## RPC ile karşılaştırmak

Saklamaya değer bölüm bu. Gezginin gösterdiği herhangi bir rakam doğrudan zincire sorulabilir:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getTransactionReceipt","params":["0xYourTxHash"]}'
```

Makbuz `status` taşır — başarı için `0x1`, geri alma için `0x0` — ayrıca blok numarası, harcanan gaz ve olay günlükleri. Yetkili yanıt budur.

Sözleşme için de aynısı:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xTheContract","latest"]}'
```

Gezgin ile uç nokta bir gün ayrışırsa uç noktaya inanın. Daha da yararlısı: değerli bir şey üzerinde harekete geçmek üzereyken ikisini de denetleyin. Birbirinden bağımsız iki okuyucunun aynı şeyi söylemesi, kendinden emin tek bir arayüzden çok daha güçlü bir işarettir. İşleyişi [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) yazısında.

## Gezginin size söyleyemeyecekleri

- **Bir sözleşmenin güvenli olup olmadığı.** Kodu ve geçmişi gösterir, niyeti değil. Doğrulanmış sözleşme okunabilir sözleşmedir, denetlenmiş değil.
- **Bir tokenın meşru olup olmadığı.** Herkes istediği adla bir sözleşme dağıtabilir. Kimlik adrestir.
- **Bir adresin kime ait olduğu.** Adresler takma adlıdır. Görünen etiketleri gezgin işletmecisi eklemiştir; bunlar olgu değil iddiadır.
- **Bir şeyin neden başarısız olduğu.** İşlemin geri alındığını gösterir; sebep sözleşmenin kendi mantığında yaşar.

## Sık sorulanlar

### İşlemim görünmüyor. Kayboldu mu?

Muhtemelen hayır. Hash'i `eth_getTransactionReceipt` ile RPC'ye sorun. Boş sonuç henüz kazılmadığı anlamına gelir — beklemede, kayıp değil. Hiç onaylanmıyorsa olağan sebep ücrettir.

### Gezgin token transferi gösteriyor ama değerim sıfır. Neden?

Çünkü token hareketleri yerel transfer değil sözleşme durumu değişiklikleridir. `Değer` alanı yalnızca NURA'yı izler. Bunun yerine aynı işlemin token transferi bölümüne bakın.

### Doğrulanmış olduğu için bir sözleşmeye güvenebilir miyim?

Doğrulama, yayımlanan kaynağın dağıtılmış bayt koduna derlendiği anlamına gelir. Kodun ne olduğunu söyler; kodun iyi olup olmadığı ya da yazarın dürüstlüğü hakkında hiçbir şey söylemez.

### Gezgin neden cüzdanımdan farklı bir bakiye gösteriyor?

Genellikle biri başka bir ağdadır ya da biri bayattır. `eth_getBalance` ile RPC'ye sorun ve meseleyi kapatın.

## Bundan sonra nereye

Ağa henüz bir cüzdan yöneltmediyseniz başlangıç noktası [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet), gezgin de bunun işe yaradığını doğrulama biçiminizdir.

Dağıtım yapıyorsanız, [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain) ve [ERC-20 oluşturmak](/blog/create-an-erc-20-token-on-nura-chain) yazılarının ikisi de bu sayfada biter — gezgin ile RPC bittiği konusunda anlaşana dek dağıtım bitmiş değildir.
