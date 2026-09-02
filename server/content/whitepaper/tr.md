Nura Chain, Ethereum Sanal Makinesi'ni (EVM) çalıştıran herkese açık bir blok zinciridir. `1020` zincir kimliğiyle tanınır, her üç saniyede bir blok mühürler, işlemleri EIP-1559 ücret piyasasıyla fiyatlar ve hesaplamanın bedelini yerel coini NURA ile öder. Ağın çevresinde kendi saklamalı bir cüzdan, bir blok gezgini, bir takas arayüzü ve bir köprü var; hepsine bugün erişilebilir.

Bu belge ağın başvuru niteliğindeki tanımıdır: ağ nedir, nasıl çalışır, coini ne işe yarar ve arz nasıl bölünmüştür, çevresinde ne var ve okuyan kişi neyi güvene dayanarak kabul etmek yerine zincirin kendisinden doğrulayabilir. Aynı anda üç okuyucu için yazıldı — NURA tutup tutmamaya karar veren biri, ağ üzerinde geliştirmeye başlamak üzere olan biri ve yalnızca neye baktığını bilmek isteyen biri.

## 1. Giriş

Çoğu insan yeni bir blok zinciriyle beş değer isteyen bir cüzdan iletişim kutusu üzerinden tanışır ve o değerleri hiçbirinin ne anlama geldiğini bilmeden yapıştırır. Nura Chain bunun tam tersi bir deneyim olmak üzere kuruldu. Bu belgenin belirttiği her rakam ya zincirin kendisinden okunabilir ya da yayımlanmış bir iddia olarak açıkça işaretlenmiştir; ağın çevresindeki araçlar da daha geniş EVM ekosisteminin zaten kullandığı araçlardır.

Bu ad tek bir şeyi kapsar: ağı. Üzerine kurulan ürünler — Nura Wallet, Nura Explorer, Nura Swap — Bölüm 7'de anlatılıyor ve hizmet ettikleri zincirden ayrıdırlar. Özel ağ kabul eden herhangi bir EVM cüzdanı Nura Chain'i kullanabilir; projenin kendi cüzdanı giriş yollarından biridir, tek yol değil.

## 2. Tasarım ilkeleri

Aşağıdaki her şeyi dört tercih biçimlendiriyor.

- **Tanıdık yürütme.** Ağ EVM'yi değiştirmeden çalıştırır; dolayısıyla sözleşmeler, kütüphaneler, anahtarlar ve adresler Ethereum'dan hiçbir değişiklik gerekmeden taşınır. Bir geliştiricinin Nura Chain'deki ilk günü bir yeniden yazım değil, bir yapılandırma girdisidir.
- **Varsayılan olarak kendi saklama.** Nura Wallet hiçbir zaman bir anahtar tutmaz ve bir bakiyeyi hareket ettiremez. Ağda hesap kurtarma, dondurma ya da ayrıcalıklı bir harcama yolu yoktur; anahtar kimdeyse coin de ondadır.
- **Güvenmeden önce doğrulanabilir.** Zincir kimliği, blok aralığı, ücret piyasası ve her blok üreticisinin kimliği herkese açık RPC üzerinden okunabilir. Bir rakamın zincirden okunamadığı yerde — önemli örnek toplam arzdır — bu belge aksini ima etmek yerine bunu açıkça söyler.
- **Küçük bir yüzey, dürüstçe anlatılmış.** Ağ, bir pazarlama sayfasının sıralayabileceğinden daha az parça sunar ve her biri burada sınırlarıyla birlikte — rahatsız edici olanlar dahil — anlatılır.

## 3. Ağ

### 3.1 Yürütme: Ethereum Sanal Makinesi

Nura Chain EVM bayt kodunu yürütür. EVM için Solidity ya da Vyper ile derlenmiş bir sözleşme burada, Ethereum'da sahip olacağı aynı anlambilimle, aynı komut maliyetleriyle ve aynı 20 baytlık adres alanıyla çalışır. Düğüm standart Ethereum JSON-RPC arayüzüne yanıt verir; dolayısıyla ethers.js, viem, web3.py, wagmi, Hardhat ve Foundry bir uç nokta ve bir zincir kimliğinden fazlasına ihtiyaç duymadan onunla çalışır.

Uyumluluk yalnızca yürütme katmanı hakkında bir ifadedir. Ethereum'da denetlediğiniz bir adres burada da sizindir, çünkü aynı secp256k1 anahtarından türer — ama bakiyeler, dağıtılmış sözleşmeler ve geçmiş ayrı defterlerdir. "Başka bir zincirdeki aynı adrese" gönderilen hiçbir şey ikisi arasında taşınmaz. Bölüm 9 bu konuya geri döner, çünkü gerçek kayıpların çoğu buradan kaynaklanır.

### 3.2 Bloklar, zaman ve ücretler

Ağ her üç saniyede bir blok mühürler. Aralık bir hedef değil, sabit bir değerdir: ardışık başlıklar arasında tam olarak üç saniye fark vardır. Zincirin ilk bloğu 6 Haziran 2026, 00:00 UTC zaman damgasını taşır.

İşlemler EIP-1559 ücret piyasasıyla fiyatlanır. Her blok protokolün belirlediği bir taban ücret taşır ve gönderen bunun üzerine bir öncelik ücreti ekler; her başlıktaki `baseFeePerGas` alanı ile `eth_maxPriorityFeePerGas` ve `eth_feeHistory` metotları ikisini de açığa çıkarır. Bu revizyon itibarıyla taban ücret 1 gwei, blok gaz sınırı ise 150.000.000 gazdır. İkisi de sabit kodlanacak değil, çalışma zamanında okunacak değerlerdir; bir kütüphanenin ücret tahmini de varsayılan olarak tam bunu yapar.

Başlıklar modern Ethereum istemcilerinin ürettiği biçimdedir: sıfır değerinde bir `difficulty`, boş bir `nonce`, sıfır bir `mixHash` ve Shanghai, Cancun ve Prague yükseltmeleriyle gelen alanlar — `withdrawalsRoot`, `parentBeaconBlockRoot`, `blobGasUsed` ve `requestsHash`. Sıfırdan farklı bir zorluk değerine göre dallanan ya da iş ispatı alanlarının bir anlam taşımasını bekleyen kod, burada da bugün Ethereum'da olduğu gibi hatalı davranır.

### 3.3 Blok üretimi

Nura Chain iş ispatı kullanmaz; yukarıdaki başlık alanları bunu dışlar. Bloklar, yukarıda anlatılan sabit takvimde yetkili bir blok üreticisi tarafından mühürlenir. Bir bloğu mühürleyen hesap o bloğun `miner` alanına kaydedilir; dolayısıyla herhangi bir bloğun üreticisi bir belgedeki iddia değil, herkese açık bir olgudur.

Bu revizyon itibarıyla örneklenen her blok aynı üretici hesabı tarafından mühürlenmişti. Üretici kümesinin büyüklüğü ağın yürütme katmanının değil, nasıl işletildiğinin meselesidir ve bu belge onu sabitlemez. Ondaki herhangi bir değişiklik Bölüm 11'de sıralanan proje kanallarından duyurulur.

Ağ RPC üzerinden ayrı bir kesinlik sinyali sunmaz. Cüzdanların ve gezginin gösterdiği onay, mühürlenmiş bir bloğa dahil edilmedir ve bloklar bir takvime göre geldiği için dahil edilen bir işlem tek aralık içinde görünür olur.

### 3.4 Ağın kimliği

Bir cüzdanın ya da istemci kütüphanesinin sizden isteyeceği değerler bunlar. Sitedeki ağ kartının taşıdığı ve Nura Wallet'ın sakladığı değerlerle aynıdırlar.

- Ağ adı: Nura Chain
- Zincir kimliği: `1020`, cüzdanların onaltılık biçimde `0x3fc` olarak istediği değer
- RPC uç noktası: `https://rpc.nurachain.net`
- Blok gezgini: `https://explorer.nurachain.net`
- Yerel coin: Nura, sembolü `NURA`, 18 ondalık basamak
- Blok süresi: 3 saniye

Zincir kimliği bir etiketten fazlasıdır. EIP-155 uyarınca her işlemin imzasına dahil edilir; dolayısıyla 1020 zinciri için imzalanmış bir işlem başka hiçbir ağda yeniden oynatılamaz ve başka bir ağ için imzalanmış bir işlem burada reddedilir. Ayrıca, bu sayfa dahil geri kalan her şeye güvenmeden önce denetlenecek değer de odur:

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

Yanıt `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}` olur. EIP-3085'i destekleyen bir cüzdana yukarıdaki değerlerin tümü tek istekte verilebilir; sitedeki "Nura Chain'i cüzdana ekle" denetiminin yaptığı da budur.

## 4. Yerel coin

NURA ağın yerel coinidir. Gaz öder: her işlem gaz tüketir, gaz NURA cinsinden fiyatlanır ve bir hesabın herhangi bir şey gönderebilmesi için — ilk sözleşme dağıtımı dahil — önce bakiyesi olmalıdır. Bu, ether'in Ethereum'da oynadığı rolün aynısıdır ve en küçük birim de aynı şekilde bir coinin milyarda birinin milyarda biridir.

Bir sözleşme değil yerel varlık olduğu için NURA'nın token adresi yoktur. Coini eklemek üzere "NURA sözleşme adresini" isteyen bir sayfa var olmayan bir şeyi istiyordur; bakiyeyi görünür kılan şey ağı eklemektir. ERC-20 tokenlar Nura Chain üzerinde sıradan sözleşmeler olarak vardır ve NURA onlardan biri değildir.

## 5. Arz ve dağılım

### 5.1 Toplam arz

Yayımlanan toplam arz 1.000.000.000 NURA'dır — bir milyar.

Bu, zincirden okunabilen değil yayımlanmış bir rakamdır ve bu ayrım önemlidir. Bir ERC-20, kendi defterini tutan bir sözleşme olduğu için `totalSupply()` sunar; yerel bir coinin ihracı ise istemcinin yapılandırmasında ve genesis durumunda yaşar ve `eth_totalSupply` diye bir şey yoktur. Herhangi bir bakiye tek tek `eth_getBalance` ile okunabilir; toplam okunamaz.

Bu revizyonda dolaşımdaki arz bilerek belirtilmemiştir. Dolaşımdaki arz, belirli bir anda hangi payların kilidi açılmış sayıldığına bağlıdır ve her kilitli pay herkesin izleyebileceği yayımlanmış bir adreste durmuyorsa bu bir ölçüm değil, bir yargıdır.

### 5.2 Dağılım

Toplam altı parçaya bölünmüştür. Yüzdeler, bunların karşılık geldiği token sayıları ve her payın beyan edilen koşulları şunlardır:

- **Kilitli — %40, 400.000.000 NURA.** Bir yıllığına kilitli. Akıbeti bu sürenin bitiminde kararlaştırılacak ve bu pay hakkındaki herhangi bir karar, ağın en az %65'inin oyuyla onaylanmalıdır.
- **Likidite — %25, 250.000.000 NURA.** Bir yıllık süre boyunca likidite sağlamaya ve yönetmeye tahsis edilmiştir; amaç işleyen bir işlem likiditesi ve daha istikrarlı bir NURA ekosistemidir.
- **Topluluk — %10, 100.000.000 NURA.** Bir yıl içinde topluluk üyelerine dağıtılır; ödeme yaparak değil etkinlik, katılım, geliştirme, yönlendirme ya da başka etkili katkılarla ağın büyümesine yardım edenler için. Tahsis, yönetim kurulunun incelemesi ve onayının ardından yapılır.
- **Halka satış — %10, 100.000.000 NURA.** Toplam 24.000 dolar fiyatla halka satışa sunulur; bu, NURA başına 0,00024 dolar eder.
- **Hazine — %10, 100.000.000 NURA.** Bir yıl boyunca, yönetim kurulunun gözetiminde ekosistem geliştirme, altyapı, ürünler, ortaklıklar ve projenin diğer ihtiyaçlarına tahsis edilir.
- **Airdrop — %5, 50.000.000 NURA.** Bir yıl boyunca airdrop olarak dağıtılır. Alıcılar seçilmiş kanallar ve topluluklar üzerinden belirlenir, nihai tahsisi yönetim kurulu onaylar.

Bu altı payın toplamı %100'dür. Halka satış fiyatı o satışın sabit bir koşuludur, piyasa kotasyonu değil; coinin bir değerlemesi olarak okunmamalıdır.

### 5.3 Bir bakiyeyi doğrulamak

Ağdaki her bakiye herkese açıktır. Projenin bir pay için yayımladığı adresler dahil herhangi bir adres herkes tarafından okunabilir:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBalance","params":["0xSomeAddress","latest"]}'
```

Yanıt wei cinsinden ve onaltılık kodlanmış gelir; NURA için 10^18'e bölün. Aynı rakamı Nura Explorer da gösterir ve ikisini birden okumak, bu belgenin baştan sona önerdiği alışkanlıktır.

## 6. Yönetişim

Bu revizyonda ağ için iki yönetişim kuralı beyan edilmiştir ve ikisi de protokolü değil, yukarıdaki dağılımı ilgilendirir.

Arzın kilitli %40'ı, ağın en az %65'inin oyuyla onaylanmadan serbest bırakılamaz, başka bir amaca yönlendirilemez ya da hakkında başka bir karar verilemez. Bu eşik, arzın en büyük tek payı üzerindeki tek bağlayıcı kuraldır.

Topluluk, hazine ve airdrop payları — birlikte arzın %25'i — her dağıtımı onaylayan bir yönetim kurulunun incelemesi ve gözetimi altında tahsis edilir.

Burada başka bir yönetişim mekanizması iddia edilmiyor. Protokolün kendi parametreleri — blok aralığı, ücret piyasası, üretici kümesi — ağın işletmecileri tarafından belirlenir ve bu belge onlar için zincir üstü bir oylama sistemi tarif etmez, çünkü dağıtılmış böyle bir sistem yoktur.

## 7. Ekosistem

### 7.1 Nura Wallet

Nura Wallet, bu ağ için yapılmış kendi saklamalı bir cüzdandır. Özel anahtarlar cihazda üretilir ve cihazda tutulur; cüzdan bir bakiyeyi kendi başına harcayamaz. Kaynak kodu ve sürümleri GitHub'da yayımlanır.

Bir tarayıcı eklentisi değil, yerel bir uygulama olarak geliştirilmiştir. Derlemeler Android için hem Google Play'de hem evrensel APK olarak, Windows için x64 yükleyici olarak ve Linux için amd64 Debian paketi olarak yayımlanır. iOS ve macOS derlemeleri henüz yayımlanmadı. Her derleme ve mimari cüzdanın sürümler sayfasında listelenir.

Bir uygulama olduğu için, cüzdanın kendi uygulama içi tarayıcısı dışında bir web sayfasının içine enjekte edeceği bir şey yoktur. Site bu yüzden ona iki yoldan ulaşır: o tarayıcının içinde EIP-6963 sağlayıcı duyurusu üzerinden, başka her yerde ise isteği uygulamaya taşıyıp yanıtı sayfaya geri getiren bir `nurawallet://` derin bağlantısı üzerinden. Diğer her EVM cüzdanı ağa olağan EIP-3085 zincir ekleme isteğiyle ulaşır.

### 7.2 Nura Explorer

Nura Explorer ağdaki blokları, işlemleri ve transferleri dizinler. Bir işlemin gerçekten olduğunun doğrulandığı, bir sözleşmenin kodunun ve çağrılarının okunabildiği ve Bölüm 3.3'teki blok üreticisinin her blokta görülebildiği yerdir. RPC uç noktasının sunduğu zincirin aynısını okur; ikisini birden denetlemenin harcanan on saniyeye değmesinin sebebi de budur.

### 7.3 Nura Swap

Nura Swap, ağ için bir takas arayüzüdür. Havuzu NURA'nın fiyatını coinin sarmalanmış bir temsiline karşı kote eder ve sitenin NURA fiyatı olarak gösterdiği de bu kotasyondur.

Havuz küçüktür; dolayısıyla tek bir işlem kotasyonu belirgin biçimde oynatabilir. Bu, borsa listelemesi değil tek bir havuzdan alınan piyasa kotasyonudur ve bu belge bu sebeple bir fiyat belirtmez.

### 7.4 Köprü

Bir köprü, BNB ve USDT'nin temsillerini Nura Chain üzerinde sıradan ERC-20 sözleşmeleri olarak basar. İkisi de kasa değil, bas-ve-yak tokenlarıdır: Nura üzerinde bir birim yalnızca kaynak zincirde bir birim kilitlendiği için vardır. Nura üzerindeki sözleşmeleri şunlardır:

- BNB: `0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc`
- USDT: `0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC`

Dolayısıyla ağa köprülenen değer her tokenin `totalSupply()` değeridir; sitenin kilitli toplam değeri hesaplama yolu da budur. Bu rakam Nura üzerinde basılan alacağı ölçer; teminata yalnızca köprü ödeme gücünü koruduğu ve bire bir desteklendiği sürece eşittir. Kaynak zincirdeki saklayıcı bakiyesi yetkili taraftır ve dikkatli bir okuyucunun denetlediği rakam odur.

## 8. Nura Chain üzerinde geliştirmek

Bir Solidity araç zincirindeki hiçbir şey bu ağa özgü değildir. Bir dağıtım, Bölüm 3.4'teki RPC uç noktası ve zincir kimliğiyle tanımlanmış, gazı ödemeye yetecek NURA ile fonlanmış bir ağ girdisidir. İlk dağıtımdan önce üç sürtünme noktasını bilmekte yarar var.

- Zincir kimliğini uç noktadan okuyun ve kullandığınız çerçevenin yapılandırmasıyla karşılaştırın. İkisi beklenenden daha sık uyuşmaz; genellikle yapılandırma başka bir projeden kopyalandığı için.
- Ücretleri kütüphane tahmin etsin. Taban ücret ve öncelik ücreti çalışma zamanında okunabilir; sabitlenmiş bir gaz fiyatı, bir işlemin bloğa alınmadan beklemesinin en yaygın sebebidir.
- Başka yerde dağıtılmış bir sözleşme burada dağıtılmış değildir. Bilerek deterministik bir dağıtıcı kullanılmadıkça yeniden dağıtmak yeni bir adres verir ve başka bir ağın sözleşmelerine ya da oracle'larına sabit kodlanmış her bağımlılık yeniden gözden geçirilmelidir.

RPC uç noktası izin verici CORS başlıkları gönderir; böylece tarayıcıda çalışan bir sayfa arada bir sunucu olmadan doğrudan zincirden okuyabilir. Projenin blogunda bağlanmak, sözleşme dağıtmak ve ERC-20 çıkarmak için adım adım rehberler var.

## 9. Güvenlik ve risk

- **Kendi saklama bir sorumluluktur.** Kaybolmuş bir kurtarma ifadesi için ne bu ağda ne başka bir ağda bir geri kazanım yolu vardır ve bir işlem mühürlendikten sonra hiçbir taraf onu geri alamaz.
- **Yanlış zincir kimliği, fonların kaybedilme yoludur.** Ağı bir cüzdana kaydetmeden önce `1020` değerini uç noktadan doğrulayın ve her sayfaya — bu sayfa dahil — denetlenecek bir iddia olarak bakın.
- **Uyumluluk, ortak durum demek değildir.** Varlıklar aynı adrese gönderilerek zincirler arasında taşınmaz. BNB ya da USDT'yi ağa yalnızca Bölüm 7.4'teki köprü taşır ve yalnızca orada belirtilen sınırlar altında.
- **Takas kotasyonu sığdır.** Tek bir küçük havuzdan okunan fiyat bir değerleme değildir ve tek bir işlemle oynatılabilir.
- **Köprü saklama riski taşır.** Basılmış bir temsil, teminatı ancak kaynak taraftaki saklayıcı onu bire bir tuttuğu sürece eder.
- **Bazı rakamlar yayımlanmış iddialardır.** Toplam arz ve Bölüm 5'teki dağılım koşulları RPC üzerinden doğrulanamaz. Projenin dağılım adreslerini yayımladığı yerlerde bakiyeleri Bölüm 5.3'teki çağrıyla okunabilir.
- **Blok üretimi yoğunlaşmıştır.** Bölüm 3.3, gözlemlenen üretici kümesini açıkça belirtir; böylece okuyan kişi bunu sonradan keşfetmek yerine şimdi tartabilir.

## 10. Sorumluluk reddi

Bu belge ağı belirtilen revizyondaki haliyle anlatır. Bir teklif, bir çağrı ya da yatırım tavsiyesi değildir ve içindeki hiçbir şey NURA'nın gelecekteki fiyatı, likiditesi ya da erişilebilirliği hakkında bir söz olarak okunmamalıdır. Yayımlanmış iddia olarak işaretlenen rakamlar projenin beyanlarıdır; diğer her rakam gösterilen çağrılarla zincirden denetlenebilir. Sonraki revizyonlar bunun yerini alır ve belgenin başındaki revizyon numarası ile tarih, okuyanın elindekinin hangisi olduğunu belirtir.

## 11. Kaynaklar

- RPC uç noktası: `https://rpc.nurachain.net`
- Blok gezgini: [Nura Explorer](https://explorer.nurachain.net)
- Takas: [Nura Swap](https://swap.nurachain.net/)
- Cüzdan sürümleri: [GitHub'da Nura Wallet](https://github.com/NuraChain/Wallet/releases)
- Kaynak kodu: [GitHub'da NuraChain](https://github.com/NuraChain)
- Topluluk: [Telegram](https://t.me/nurachain), [X](https://x.com/nurachainnet), [Discord](https://discord.gg/8BMAXTdXQg), [Instagram](https://www.instagram.com/nura.chain/)
- Standartlar: [EIP-155](https://eips.ethereum.org/EIPS/eip-155) (yeniden oynatma koruması), [EIP-1559](https://eips.ethereum.org/EIPS/eip-1559) (ücret piyasası), [EIP-3085](https://eips.ethereum.org/EIPS/eip-3085) (cüzdana zincir ekleme), [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) (cüzdan keşfi)
- Rehberler: [Nura Chain nedir](/blog/what-is-nura-chain), [RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc), [ağı cüzdana eklemek](/blog/add-nura-chain-to-your-wallet), [sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain), [arz ve dağılım](/blog/nura-coin-tokenomics)
