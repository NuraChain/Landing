Bugün her Ethereum düğümü bir bloğu aynı yolla denetliyor: her işlemi yeniden çalıştırıp sonucu karşılaştırıyor. EIP-8025 ikinci bir yol öneriyor. Uzmanlaşmış bir kanıtlayıcı bloğu bir kez çalıştırır ve yürütmenin doğru olduğuna dair bir zkEVM kanıtı üretir; diğer herkes de kanıtı denetler, bu da işi yinelemekten çok daha ucuzdur. Ethereum Vakfı'nın 16 Eylül 2026'daki protokol AMA oturumunda araştırmacılar zkEVM kanıtlamasının üretim aşamasına yaklaştığını söyledi; öneri de Hegotá çatallanmasının adaylarından biri.

## Temel bilgiler

- **Öneri:** EIP-8025, "İsteğe Bağlı Yürütme Kanıtları", uzlaşı düğümlerinin bir bloğu, eşler arası ağ üzerinden gönderilen zkEVM kanıtlarına dayanarak kabul etmesine izin veriyor.
- **İsteğe bağlı:** katılmayı seçmeyen doğrulayıcılar "hiçbir değişiklik görmez".
- **Hız:** Vakıf, Ethereum bloklarının %99'unun hedef donanımında 10 saniye içinde kanıtlanabildiğini bildirdi. Her 12 saniyede bir blok geliyor.
- **Zamanlama:** ethereum.org, Hegotá'yı planlama aşamasındaki bir yükseltme olarak listeliyor; beklenen dönem 2027'nin ikinci çeyreği, kesinleşmiş bir tarih yok.
- **Durum:** Hegotá'ya dahil edilmesi önerildi; takvime bağlanmadı.

## zkEVM kanıtı nedir?

Bir hesaplamanın doğru yapıldığına, siz o hesaplamayı yapmadan sizi ikna eden kısa bir veri parçası.

Kanıtlayıcı bloğun işlemlerini yürütür ve her adımı kaydeder. Bu kayıttan kriptografik bir kanıt oluşturur. Kanıtı denetlemek, yürütmenin gerektirdiği emeğin küçük bir bölümünü alır ve maliyeti bloğun boyutuyla neredeyse hiç artmaz. "Sıfır bilgi", işin içindeki matematik ailesinin adıdır; burada gizlenen hiçbir şey yok. İşe yarayan özellik, doğrulamanın ucuz olmasıdır.

## Ethereum bunu neden istiyor?

Çünkü blokları küçük tutan şey yeniden yürütmedir.

Her düğüm her işlemi mütevazı bir donanımda birkaç saniye içinde yeniden oynatmak zorundaysa, bir bloktaki hesaplama miktarının tavanını, dışarıda bırakmaya razı olmadığınız en yavaş makine belirler. Yeniden oynatmanın yerine doğrulamayı koyun, o tavan yerinden oynar: ethereum.org'un deyişiyle, "doğrulama ucuz olduğunda gaz limiti güvenle artabilir." Bu, bir sonraki çatallanmanın, [Glamsterdam yazısında](/blog/ethereum-glamsterdam-upgrade) anlatılan paralel yürütmesiyle aynı hedef; ona farklı bir yoldan varılıyor.

Ayrıca doğrulayıcı çalıştırmanın maliyetini düşürür; bu da kaç kişinin doğrulayıcı çalıştırabileceği açısından önemlidir.

## Burada "gerçek zamanlı" ne demek?

Zincire ayak uyduracak kadar hızlı. Bir sonraki bloktan sonra gelen bir kanıtın uzlaşı açısından faydası yoktur; dolayısıyla bütçe, bloklar arasındaki on iki saniyedir.

Zor olan kısım ortalama değil. EIP-8025'in yazarları, çoğu bloğu saniyeler içinde kanıtlamanın, "bir saldırgan kanıtlanması dakikalar süren bir blok hazırlayabiliyorsa sınırlı bir değer taşıdığını" belirtiyor. Bir ağ tipik bloğundan değil, en kötü bloğundan sağ çıkmak zorundadır.

## Hâlâ çözülmemiş olan ne?

- **Kanıtlayıcıların doğruluğu.** Bir kanıt sistemindeki hata, uzlaşıdaki bir hatadır. Bu yılki biçimsel doğrulama çalışmaları bir kanıtlayıcının RISC-V uygulamasının bazı bölümleri için güvenceler ortaya koydu; sonraki testler yine de onda bir sorun buldu.
- **Kanıtlamayı kimin yaptığı.** Ciddi donanım gerektiriyor. Bunu yalnızca birkaç işletmeci karşılayabilirse bir bloğu denetlemek daha merkeziyetsiz, bir bloğu kanıtlamak ise daha az merkeziyetsiz hâle gelir.
- **Çeşitlilik.** Ethereum, tek bir hata zinciri çatallayamasın diye birkaç bağımsız istemciye dayanır. Aynısı kanıtlayıcılar için de geçerli olmalı; ethereum.org geliştirme aşamasında beş tane listeliyor.

İlk adımın isteğe bağlı olmasının nedeni bu. Kanıt doğrulayan düğümler yeniden yürüten düğümlerle yan yana çalışır ve ikisi birbirini denetler.

## Sözleşmeler ya da diğer EVM zincirleri için bir şey değişiyor mu?

Sözleşmeler için hayır. Öneri açık: "EVM'in kendisi değiştirilmiyor." Solidity aynı bayt koduna derlenir ve o bayt kodu aynı şeyi yapar.

Diğer EVM ağları için hiçbir şey kendiliğinden devralınmaz. Kendi düğümlerinin blokları nasıl doğrulayacağına her zincir kendi karar verir ve buradaki hiçbir şey Nura Chain'in planlarına dair bir beyan değildir. Her EVM zincirinin paylaştığı şey yürütme katmanının kendisidir — [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) yazısının konusu — ve EVM yürütmesini kanıtlamak için kurulan her şey bu ortak belirtime göre kurulur.

Buradaki takvimler plandır. Güncel olanlar [Ethereum Vakfı'nın zkEVM blogunda](https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota) ve [ethereum.org](https://ethereum.org/roadmap/zkevm/) adresinde.
