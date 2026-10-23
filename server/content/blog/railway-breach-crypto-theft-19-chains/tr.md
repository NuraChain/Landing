Bulut barındırma platformu Railway, 21 Ekim 2026'da yetkisiz bir tarafın müşterilerinin sakladığı şifreli ortam değişkenlerine erişmiş ve bazılarının çözülmüş içeriğini okumuş olabileceğini açıkladı. Blokzincir araştırmacısı Taylor Monahan, Railway ihlalini en az 19 EVM zincirinde boşaltılan yaklaşık 371.000 dolarlık kriptoyla ilişkilendirdi; bu, crypto.news'in 22 Ekim'de aktardığı kendi tahmini. Railway herhangi bir kripto hırsızlığını doğrulamadı. Örüntü tanıdık: bir sunucunun okuyabileceği yerde tutulan özel anahtarı başka biri okudu.

## Temel bilgiler

- **Açıklama:** Railway, 21 Ekim 2026 — müşteri ortam değişkenlerini saklayan sistemlerde olağandışı etkinlik; bu değişkenler API anahtarları ile veritabanı ve kayıt defteri kimlik bilgilerini içerebilir.
- **İddia edilen hırsızlık:** Taylor Monahan'a göre 22 Ekim itibarıyla en az 19 EVM ağında, 200'den fazla adresten 500'ü aşkın işlemle yaklaşık 371.000 dolar. ethereumdegen.eth adıyla paylaşım yapan bir geliştirici rakamı yaklaşık 370.000 dolar olarak verdi.
- **Zamanlama:** Monahan'ın zaman çizelgesine göre ilk hırsızlık 21 Ekim'de 19:36 UTC'de gerçekleşti; Railway'in duyurusu yaklaşık 21:51 UTC'de yayımlandı.
- **Railway'in yanıtı:** dağıtımlar durduruldu, tüm müşterilerden saklanan tüm değişkenleri yenilemeleri istendi, CryptoSlate'e göre tüm Railway API belirteçleri 22 Ekim'de 04:17 UTC'de geçersiz kılındı, depolama bucket kimlik bilgileri ve GitHub belirteçleri de aynı gün sıfırlandı.
- **Netleşmeyenler:** kök neden, etkilenen müşteri sayısı ve boşaltılan cüzdanların anahtarlarının Railway'den gelip gelmediği.

## Railway tam olarak ne açıkladı?

Müşterileri için sakladığı sırların okunmuş olabileceğini.

Railway'in duyurusu, etkinliği 21 Ekim sabahı tespit ettiğini ve yetkisiz bir üçüncü tarafın şifreli ortam değişkenlerine erişip bazılarının çözülmüş içeriğini elde etmiş olabileceğine inandığını söylüyor. İlk analizi kullanıcıların bir bölümüne işaret ediyor, ancak herkesten tüm değişkenleri ve özel kayıt defteri kimlik bilgilerini yenilemesini ve hizmet günlüklerini incelemesini istedi. Olayın, yapay zekâ çıkarım sağlayıcılarını hedef alan ve platform şirketlerine yönelen bir saldırı dizisinin parçası olduğuna inanıyor ve üst kademe sağlayıcılardan anahtarları iptal etmelerini istedi. Duyuruda kripto, cüzdan ya da özel anahtardan söz edilmiyor.

## Bu, kripto hırsızlığına nasıl bağlanıyor?

Railway'in söylediği bir şeyle değil, boşaltılan cüzdanlar üzerinden.

crypto.news'e göre Monahan boşaltmaları olayla ilişkilendirdi ve işlemlerin oldukça standart bir cüzdan süpürme betiğiyle yapıldığını söyledi. Onun kaydettiği ilk hırsızlık, Railway'in kamuya açıklamasından iki saatten fazla önce. Anlatımlar tam örtüşmüyor: Railway müşteri başarı mühendisi Noah Dunnagan, X'te şirketin saldırının yalnızca yapay zekâ çıkarım belirteçlerini istismar ettiğine inanmak için nedeni olduğunu yazdı; bunu The Defiant aktardı. Railway kayıpları doğrulamadı ve 371.000 dolarlık rakam dışarıdan bir tahmin.

## Ortam değişkeni neden özel anahtar için kötü bir yer?

Çünkü platformun onu okuyabilmesi gerekir.

Ortam değişkeni, barındırma platformunun bir sırrı süreciniz başlarken ona teslim etme yoludur. Bunun için platform değeri, depoda şifreli olarak, onu çözecek araçla birlikte saklar. Bir dakikada iptal edilebilen bir API anahtarı için bu kabul edilebilir. Özel anahtar iptal edilemez. Onu bir kez okuyan adresi kalıcı olarak kontrol eder ve tek çare fonları ondan önce taşımaktır — süpürme betiği de tam olarak önce davranmak için yazılır.

Bu, [denetlenmiş sözleşmeler neden yine de boşaltılıyor](/blog/why-audited-contracts-get-drained) yazısındaki argümanın aynısı: kod sağlam kalır, para onu çevreleyen şeylerden çıkar.

## Geliştiriciler anahtarları barındırmanın dışında nasıl tutmalı?

- **Bakiyeli bir anahtarı platform değişkenlerine koymayın.** Bir hizmetin imzalaması gerekiyorsa, ona yalnızca bugün ihtiyaç duyduğu kadarını tutan bir anahtar verin.
- **Başka bir yerde imzalayın.** Bir anahtar yönetim hizmeti ya da ayrı bir imzalayıcı anahtarı tutar ve istek üzerine imzalar; böylece uygulama anahtarı hiç görmez.
- **Kurtarma ifadesini asla sunucuda saklamayın.** Tek bir ifade cüzdandaki her adresi türetir.
- **Dağıtım anahtarlarını hazine anahtarlarından ayırın.** Sözleşmeyi dağıtan anahtar, fonlarını tutan anahtar olmamalı.
- **Açıklama gelince anahtarı değiştirin ve önce fonları taşıyın.** Özel anahtarda değiştirmek, yeni bir dize değil, yeni bir anahtar ve bir transfer demektir.
- **Adresleri izleyin.** Her giden transfer için bir uyarı, günler yerine dakikalar içinde haberdar olmanın yoludur.

## Bu, Nura Chain üzerinde geliştirme için ne anlama geliyor?

Aynı kurallar geçerli. [Nura Chain'de akıllı sözleşme dağıtma](/blog/deploy-a-smart-contract-on-nura-chain) rehberimiz dağıtım anahtarını kendi makinenizdeki bir ortam değişkeninden okur ve ilk dağıtım için bakiyenizi tutan anahtarı değil, tek kullanımlık bir anahtarı kullanmanızı söyler. Bu yerel ve kısa ömürlü bir anahtardır. Barındırma platformunda duran, bakiyeli ve uzun ömürlü bir anahtar başka bir risktir ve yukarıdaki öneriler onun içindir.

Railway'in soruşturması sürdükçe ayrıntılar değişecek. Birincil kaynak [Railway'in 21 Ekim 2026 tarihli güvenlik açıklamasıdır](https://blog.railway.com/p/security-disclosure-wednesday-october-21st).
