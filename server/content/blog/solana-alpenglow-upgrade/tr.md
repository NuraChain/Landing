Solana'nın uzlaşısında bugüne kadarki en kapsamlı değişiklik olan Alpenglow, 22 Eylül 2026'da Solana'nın test ağında yayına girdi. Bir hafta boyunca gireceğini söyleyen manşetlere rağmen 28 Eylül'de ana ağda yayına girmedi. Yükseltme, doğrulayıcıların nasıl oy verdiğini ve blokların nasıl yayıldığını değiştiriyor; bugünkü yaklaşık 12,8 saniyeye karşılık kabaca 100 ila 150 milisaniyelik bir kesinlik hedefliyor.

## Temel bilgiler

- **Ne olduğu:** SIMD-0326 olarak önerilen, TowerBFT'nin yerini alan yeni bir uzlaşı tasarımı.
- **İki parça:** Votor oylamayı ve kesinliği üstleniyor; Rotor ise blokların nasıl yayıldığını.
- **Durum:** 22 Eylül 2026'dan beri test ağında. Ana ağda değil.
- **Tarih karışıklığı:** 28 Eylül, istemcinin geliştiricilerinin ana ağda genel olarak özellik etkinleştirmeye yeniden başladığı gündü; bir Alpenglow açılışı değil.
- **Sıradaki pencere:** 9 Kasım 2026'da bir ana ağ etkinleştirme penceresi açılıyor. Bu bir pencere, bir taahhüt değil.

## Kesinlik nedir ve 150 ms neden önemli?

Kesinlik, bir işlemin artık geri alınamadığı noktadır.

Bu, bir bloğun üretilmesinden farklı bir şeydir. Bir blok bir saniyeden kısa sürede ortaya çıkıp yine de geçici olabilir; bir yatırma işlemini hesaba geçiren bir borsa ya da malı teslim eden bir satıcı, işlemin bloğa girmesini değil kesinliği bekler. On iki saniye bir blok zinciri için hızlı, bir kasa için yavaştır. Saniyenin onda biri ise insanın beklediğini hiç algılamadığı aralıktadır.

## Alpenglow buraya nasıl varıyor?

Oyları zincirden çıkararak.

Bugün Solana doğrulayıcıları işlem göndererek oy veriyor; bu işlemler diğerleri gibi işleniyor ve diğerleri gibi ücrete tabi. Alpenglow'da doğrulayıcılar oyları doğrudan birbirleriyle paylaşıyor ve yeterli stake onay verdiğinde kompakt bir sertifika kaydediyor. İlk turda stake'in yeterince büyük bir payını toplayan blok hemen kesinleşir; aksi hâlde ikinci bir tur işi tamamlar.

Bir yan etki de ekonomik. Doğrulayıcılar şu anda her oy için ücret ödüyor; bu, en çok küçük işletmecilere ağır gelen sabit bir maliyet. Oy işlemlerini kaldırmak bu maliyeti de kaldırıyor.

## Neden herkes yayına girdiğini sandı?

Çünkü takvimdeki bir satır duyuru diye okundu. Doğrulayıcı istemcisinin sürüm planı, 28 Eylül'ü ana ağda özellik etkinleştirmenin yeniden başlayacağı gün olarak gösteriyordu. İnsanların beklediği özellik Alpenglow'du; dolayısıyla ikisi birleştirildi. Geliştiriciler bunun o gün olmayacağını açıkça söyledi.

Bu ders Solana'nın çok ötesinde de geçerli: bu sektörde yükseltme tarihleri, etkinleşecekleri blok üretilene kadar hedeftir. Aynı ihtiyat Ethereum'un bir sonraki çatallanması için de geçerli; [Glamsterdam yazısı](/blog/ethereum-glamsterdam-upgrade) da bunu belirtiyor.

## Bu, EVM zincirlerini etkiliyor mu?

Doğrudan değil. Solana bir EVM ağı değil; programları, hesapları ve araçları ayrı ve Alpenglow'daki hiçbir şey öbür tarafa taşınmıyor.

Karşılaştırma yine de yararlı, çünkü "hızlı"nın ne anlama geldiğini gösteriyor. Blok süresi ile kesinlik farklı sayılardır ve bir zincirin öne çıkardığı rakam genellikle birincisidir. Nura Chain yaklaşık üç saniyede bir blok üretir — bu onun blok süresidir ve [Nura Chain nedir](/blog/what-is-nura-chain) yazısında belirtilir — EVM uyumluluğunun uzlaşı hakkında neden hiçbir şey söylemediği ise [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) yazısında anlatılıyor. Ağları karşılaştırırken size bu iki sayıdan hangisinin gösterildiğini sorun.

Yukarıdaki tarihler istemcinin geliştiricilerinin yayımladığı gibidir ve kayabilir; sürüm takvimini [Anza](https://www.anza.xyz) tutuyor.
