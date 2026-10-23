22 Ekim 2026'da Ethereum çekirdek geliştiricileri, 26 Ekim'e planlanan Glamsterdam'ın Hoodi test ağındaki etkinleştirmesini, EIP-8037'nin ana ağda zaten çalışan akıllı sözleşmelerle nasıl etkileştiğini incelemek için erteledi. Ethereum Foundation'a göre karar 248 numaralı All Core Devs Execution görüşmesinde alındı. Tetikleyici bir güvenlik incelemesiydi ve ChainSecurity o zamandan beri etkilenebilecek 13 gerçek sözleşme bulduğunu söyledi. Ne test ağı ne de ana ağ için yeni bir tarih belirlendi.

## Temel bilgiler

- **Ne:** Hoodi'de 26 Ekim 2026 saat 17:42:48 UTC'ye planlanan Glamsterdam çatallanması, Hoodi'nin gaz limitini 200 milyona çıkaracak adımla birlikte ertelendi.
- **Kim karar verdi:** Ethereum Foundation'a göre çekirdek geliştiriciler, 22 Ekim'deki 248 numaralı All Core Devs Execution (ACDE) görüşmesinde.
- **Neden:** durum oluşturmayı yeniden fiyatlayan ve ayrı ölçen EIP-8037. ChainSecurity'nin 13 Ekim tarihli analizi onu EIP-8038 ile birlikte ele alıyor.
- **Risk:** başarısız bir çağrıyı kalan gaza bakarak değerlendiren sözleşmeler, yeniden denenebilecek bir işlemi kalıcı olarak başarısız sayabilir; üstelik kodlarında hiçbir değişiklik olmadan.
- **Sayı:** ChainSecurity'ye göre 13 gerçek sözleşme potansiyel olarak etkileniyor; şirket sorumlu ifşa sürecini yürütüyor ve isimlerini açıklamadı.
- **Yeni tarih:** yok. Ana ağ için 1, 8 ve 9 Aralık tarihleri görüşmenin gündeminde tartışma için yer aldı; hiçbiri onaylanmadı.

## EIP-8037 neyi değiştiriyor?

Yeni durum oluşturmayı (yeni hesaplar, depolama yuvaları ve sözleşme kodu) pahalılaştırıyor ve bu maliyeti olağan yürütme gazından ayrı ölçüyor. Önerinin belirtilen amacı, blok gaz limiti yükselirken Ethereum durumunun büyümesini kontrol altında tutmak. Ayrı ölçüm, daha yüksek durum ücretlerinin geri kalan her şeyi dışarı itmeden limitin yükselmesini sağlayan şey.

ChainSecurity'nin 13 Ekim itibarıyla şartnameyi okuyuşuna göre, yeni bir depolama yuvasına yazmak, yürütme maliyetine ek olarak 97.920 gazlık bir durum ücreti taşıyacak. Bu ücret önce ayrı bir gaz rezervinden ödeniyor ve rezerv, sözleşmenin yaptığı her çağrıya bütünüyle aktarılıyor. Bir işlem içinde durum oluşturma geri alındığında gaz anında geri dönüyor.

## Bu neden zaten dağıtılmış sözleşmeler için bir risk?

Çünkü bazı sözleşmeler ne kadar gaz kaldığına göre karar veriyor.

Saldırının adı insufficient gas griefing, yani yetersiz gazla sabotaj. Biri geçerli bir işlemi başlatıyor ama başarılı olması için gerekenden biraz daha az gaz veriyor, çağıran sözleşmenin başarısızlığı kaydetmesine yetecek kadarını da bırakıyor. Dikkatli bir sözleşme, başarısız bir çağrıdan sonra kalan gazı kontrol ederek kendini korur: çok az kaldıysa çağrının gazının bittiğini varsayar ve her şeyi geri alır, böylece işlem yeniden denenebilir.

Bu kontrol yıllardır geçerli olan bir varsayıma dayanıyor: gaz yalnızca azalır. Yeni kurallarda gaz geri gelebiliyor; bir anında iadeyle ya da durum oluşturup sonra geri alan bir ara sözleşme üzerinden. Eskiden gazı tükenen bir hata işleyici artık sonuna kadar çalışabilir ve bir sözleşme bir kullanıcının çekimini ya da talebini kalıcı olarak başarısız diye işaretleyebilir. Araştırmacı pcaversaccio bunu görüşme gündemine yazdığı bir yorumda tek cümleyle özetledi: "Temelde 'bozuk' olan şey, `gasleft()` değerinin artabilmesi."

Bunun olması için dağıtılmış bayt kodda hiçbir şeyin değişmesi gerekmiyor. Değişen, altındaki ortam.

## Glamsterdam hakkındaki önceki yazımızdan bu yana ne değişti?

[Glamsterdam üzerine eylül tarihli açıklamamız](/blog/ethereum-glamsterdam-upgrade) çatallanmanın iki ana başlığını, blok düzeyinde erişim listelerini ve protokole yazılmış öneren-inşacı ayrımını ele aldı ve bunların üzerine kod yazdığınız işlem kodlarına dokunmadığını söyledi. Bu ikisi için bu hâlâ doğru. Ancak yazı, EIP-8037 ve EIP-8038'deki gaz yeniden fiyatlamasını kapsamıyordu; bu değişiklik işlemlerin maliyetini ve yukarıda anlatıldığı gibi bir çağrı sırasında gazın nasıl davrandığını değiştiriyor. Çatallanmanın yılın ikinci yarısında etkinleşeceği beklentisi de artık belirsiz, çünkü bir tarih yok.

## Ne yapmalısınız?

- **Sözleşme yazıyorsanız:** ChainSecurity'nin tavsiyesi, mümkün olan her yerde başarısız bir çağrının tüm işlemi geri almasına izin vermek, mümkün olmayan yerde ise kalan gaza dayanan geri dönüşsüz bir karar yerine bir kurtarma yolu bırakmak. Hata işleyicileri hem mevcut hem de Glamsterdam gaz tarifesiyle test edin ve ayarlanmış bir eşiği güvenliğin kanıtı saymayın.
- **Hoodi düğümü ya da doğrulayıcısı çalıştırıyorsanız:** Ethereum Foundation'a göre, 26 Ekim'den önce hem yürütme hem de uzlaşı istemcilerini etkinleştirmeyi açıkça kaldıran sürümlere güncelleyin ya da onu içermeyen daha eski bir sürüme dönün.
- **ETH tutuyor ya da ana ağı kullanıyorsanız:** Foundation'a göre hiçbir şey.

## Bu diğer EVM zincirlerini etkiler mi?

Kendiliğinden değil. EVM ağları Ethereum'un yükseltmelerini miras almaz; her zincir hangi EIP'leri ne zaman benimseyeceğine kendisi karar verir. Nura Chain'in EVM bayt kodunu nasıl çalıştırdığı [Nura Chain'in EVM uyumluluğu](/blog/nura-chain-evm-compatibility) yazısında anlatılıyor. Daha geniş ders, yani denetlenmiş kodun çevresindeki şeyler değiştiği için başarısız olabileceği, [denetlenmiş sözleşmeler neden yine de boşaltılıyor](/blog/why-audited-contracts-get-drained) yazısının savı.

Teknik analiz [ChainSecurity'nin](https://www.chainsecurity.com/blog/glamsterdam-gas/), öneri [EIP-8037](https://eips.ethereum.org/EIPS/eip-8037), görüşme gündemi ise [ACDE #248](https://github.com/ethereum/pm/issues/2267). Karar ve talimatları [Ethereum Foundation'ın duyurusunda](https://blog.ethereum.org/2026/10/22/glamsterdam-hoodi-delay) yer alıyor.
