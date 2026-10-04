Bitcoin'in Lightning Network'ünün başlıca uygulamalarından biri olan Core Lightning, düğüm işletmecilerine 22 Eylül 2026'da yayımlanan 26.06.8 sürümüne derhal yükseltme yapmalarını söyledi. Proje, 26.06.7 ya da daha eski sürümleri çalıştıran düğümleri hedef alan saldırganlara ilişkin bildirimler aldığını belirtti. Hangi açığın kullanıldığını ya da fon çalınıp çalınmadığını söylemedi.

## Temel bilgiler

- **Talimat:** hemen Core Lightning v26.06.8 sürümüne yükseltin.
- **Kimler açıkta:** v26.06.7 ya da daha eski sürümdeki düğümler.
- **Sürüm neyi düzeltiyor:** bir düğümü çökertebilen hatalar, REST arayüzü üzerinden belleğini tüketebilen istekler ve Lightning'in ceza mekanizması yoluyla fon kaybına yol açabilen bir kanal kapatma sorunu.
- **Bilinmeyen:** hangi hatanın saldırı altında olduğu ve doğrulanmış bir hırsızlık olup olmadığı.
- **Arka plan:** proje Ağustos'ta on gün boyunca yapay zekâ üretimi bir güvenlik açığı raporu dalgasını ayıkladı, birkaçını doğruladı ve 28 Ağustos'ta v26.06.7 sürümünü yayımladı.

## Bir Lightning düğümü neden cüzdandan farklı?

Çünkü her an çevrimiçi ve anahtar tutuyor.

Bir Lightning ödemesi kanallardan geçer; kanal ise iki taraf arasında kilitlenmiş bitcoin'dir ve taraflar aralarındaki paylaşımı zincir dışında günceller. Ödemeleri yönlendirebilmek için bir düğümün bağlı kalması ve anında imzalayabilmesi gerekir. Bu, onu yapısı gereği bir sıcak cüzdan yapar: fonları denetleyen anahtarlar, internetten gelen isteklere yanıt veren bir makinede durur.

## Ceza mekanizması nedir?

Lightning'in hileye karşı savunması ve eski yazılımın tehlikeli olmasının nedeni.

Bir kanalın bakiyesi her değiştiğinde önceki durum iptal edilir. Taraflardan biri sonradan iptal edilmiş bir durumu yayımlarsa — daha eski ve kendisi için daha elverişli bir paylaşımı almaya çalışarak — karşı taraf ceza olarak kanalın tamamını alabilir. Bu güçlü bir caydırıcıdır.

Hataları da affetmez. Bir hata yüzünden yanlış durumu yayımlayan bir düğüm, hile yapan bir düğümden ayırt edilemez ve aynı şekilde cezalandırılır. Kanal kapatmadaki bir kusurun fon kaybı kusuru olmasının nedeni budur.

## Proje hatayı neden açıklamadı?

Çünkü açıklamak saldırganı silahlandırırdı.

Bir düzeltmenin yayımlanması bile dikkatli bir okura sorunun kabaca nerede olduğunu söyler. Ayrıntıları ve testleri yayımlamak ise, düğümlerin bir bölümü hâlâ yamasızken, onu tam olarak nasıl tetikleyeceğini herkese söyler. Core Lightning bunların bir kısmını bilerek açıklamadı. Bu değiş tokuş rahatsız edici — işletmecilerden güvene dayanarak yükseltme yapmaları isteniyor — ve standart olan da bu.

Yeni olan kısım Ağustos'ta yaşananlar. Makine üretimi bir rapor seli çoğunlukla gürültüdür; birkaçı ise gerçekti. Kusur bulmak ucuzladı. Bakımcıların zamanı ucuzlamadı.

## Altyapı çalıştıran herkes bundan ne çıkarmalı?

- **Çalıştırdığınız ve anahtar tutan her şeyin sürüm kanalına abone olun.** Uyarı, onu hiç görmeyen birinin işine yaramaz.
- **Yamayı aynı gün uygulayın,** bir sonraki bakım penceresinde değil. Açıklanmış bir düzeltmeye yönelik saldırılar günler içinde başlayabilir.
- **Sıcak bakiyeyi küçük tutun.** Bir düğümün yalnızca yönlendirdiği kadarına ihtiyacı vardır.
- **Kullanmadığınız arayüzleri kapatın.** Bu hatalardan birine bir REST uç noktası üzerinden ulaşılabiliyordu.

Bunların hiçbiri Lightning'e özgü değil. Herhangi bir ağdaki bir düğüm ya da indeksleyici, internete açık bir yazılımdır ve zararın çoğu, bir düzeltmenin yayımlanması ile bir işletmecinin onu kurması arasındaki boşlukta oluşur — [denetlenmiş sözleşmeler neden hâlâ boşaltılıyor](/blog/why-audited-contracts-get-drained) yazısının arkasındaki kalıp. Bir zincirden yalnızca okuyorsanız, hiç düğüm çalıştırmayarak bu sorundan kaçınabilirsiniz: [Nura Chain RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) herkese açık bir uç nokta kullanır; bu da size yamalanacak ve tutulacak hiçbir şey bırakmaz.

Sürüm notları ve güvenlik duyuruları [Core Lightning deposunda](https://github.com/ElementsProject/lightning/releases) yayımlanıyor. Bir özeti değil, onları takip edin.
