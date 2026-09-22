On yıl boyunca bir Ethereum hesabı iki şeyden biriydi. Ya özel anahtarla yönetilen, kendi başına hiçbir mantık çalıştıramayan harici sahipli bir hesap; ya da mantıkla dolu ama hiçbir anahtarın denetlemediği bir sözleşme. Mayıs 2025'te Pectra yükseltmesiyle gelen EIP-7702 bu ikilemi bitirdi: sıradan bir hesap artık sözleşme koduna yetki devredebiliyor, anahtar ise denetimi elinde tutmaya devam ediyor.

Benimsenme çoğu standarttan hızlı oldu. MetaMask, Rabby ve Trust 2025 boyunca ve 2026'ya sarkarak entegre etti; sektör tahminleri ekosistemdeki akıllı cüzdan sayısını bugün yüz milyonlarla ifade ediyor.

## Bu yetki devri tam olarak nedir

Bir 7702 işlemi yanında bir yetkilendirme listesi taşır. "Adresime gelen çağrılar şu sözleşme adresindeki kodu çalıştırsın" diyen bir kaydı imzalarsınız. O andan itibaren hesabınız o sözleşme gibi davranır, özel anahtar ise hâlâ sahibidir — ve ilerde yeni bir yetki devri imzalayarak bunu iptal edebilir.

Adres değişmez. Bütün mesele budur, ve önceki yaklaşımın veremediği şey tam olarak budur.

## Size ne kazandırıyor

- **Üç imza yerine bir imza.** Onay ile takas tek bir toplu çağrıya dönüşür; eskiden harcanmadan öylece duran onay artık hiç oluşmaz.
- **Gazı başkası ödeyebilir.** Bir paymaster ücreti üstlenir ya da yerel coin yerine zaten elinizde olan bir tokenla tahsil eder.
- **Sınırlı anahtarlar.** Yalnızca tek bir işi, tek bir gün boyunca, tek bir tutara kadar yapabilen bir oturum anahtarı.
- **Kurtarma.** Hâlihazırda kullandığınız adresin üzerine oturtulmuş sosyal ya da vasi tabanlı kurtarma.

## ERC-4337 nerede duruyor

ERC-4337 hesap soyutlamasını protokolün dışında kurdu: kullanıcı işlemleri için ayrı bir bellek havuzu, paketleyiciler ve bir giriş noktası sözleşmesi. Çalışıyor ve henüz var olmayan bir hesap için doğru cevap. Ama beş yıldır kullandığınız adres için yapabileceği bir şey yoktu; çünkü o adres bir EOA'ydı ve başka bir şeye dönüşemezdi.

Artık işi paylaşıyorlar: yeni hesaplar için ERC-4337, halihazırda kullanımda olanlar için 7702.

## Dikkat edilmesi gereken kısım

Yetki devri, o adreste duran koda verilmiş açık bir vekâlettir. Sözleşme kötü niyetliyse ya da kötü niyetli bir şeye yükseltilebiliyorsa, hesap kısmen riskte değildir — gitmiştir.

- Neyi imzaladığınızı okuyun. Bir yetkilendirme, sıradan bir mesaj imzası gibi görünecek biçimde sunulabilir.
- Yetkiyi, bir web sitesinin önünüze koyduğu adrese değil, cüzdanınızın kendi dağıttığı ve denetlediği uygulamalara devredin.
- Nasıl iptal edeceğinizi bilin. Sıfır adrese imzalanan bir yetki devri onu siler.

## Bulunduğunuz zincirde çalışıyor mu

Kendiliğinden değil. Her EVM ağı hangi üst akış EIP'sini ne zaman benimseyeceğine kendi karar verir; dolayısıyla 7702'nin belirli bir zincirde etkin olup olmadığı, varsayılacak değil zincire sorulacak bir sorudur. Sıradan hesaplar her yerde çalışır — [Nura Chain'i cüzdanınıza ekleme](/blog/add-nura-chain-to-your-wallet) bunu anlatıyor — ve sıradan sözleşmeler her zamanki gibi dağıtılır; bkz. [Nura Chain üzerinde akıllı sözleşme dağıtma](/blog/deploy-a-smart-contract-on-nura-chain).
