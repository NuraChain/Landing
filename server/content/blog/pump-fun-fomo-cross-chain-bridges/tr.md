21 Ekim 2026'da Pump.fun, kendi zincirler arası altyapısı Pump Bridge'i uygulamasındaki zincirler arası işlemler için varsayılan rota yaptı ve dış sağlayıcı Relay'in yerine koydu. Bir gün sonra, 22 Ekim'de, rakibi FOMO kendi köprüsünün herkese açık dağıtımını başlattı ve uygulamasındaki zincirler arası işlemlerin "artık 1 saniyenin altında gerçekleştiğini" söyledi. Pump.fun'ın kendi testlerinden verdiği rakam, Relay üzerinden 3,88 saniyeye karşı ortalama 1,95 saniyelik alım süresi. İki şirket de köprüsünün parayı nasıl tuttuğunu ya da taşıdığını yayımlamadı; oysa bir zincirler arası işlemin gerçekte neye dayandığını belirleyen soru budur.

## Temel bilgiler

- **Pump.fun, 21 Ekim:** Pump Bridge, Relay'in yerine uygulamadaki varsayılan zincirler arası rota oldu.
- **Pump.fun'ın testi:** 28 Eylül-7 Ekim, 400.000'den fazla işlem sonucu; ortalama alım 1,95 sn'ye karşı 3,88 sn, alım hataları %0,9'a karşı %11,2. crypto.news'in 22 Ekim'de aktardığına göre bunlar Pump.fun'ın kendi verileri ve bağımsız olarak doğrulanmadı.
- **O testteki zincirler:** crypto.news'e göre Robinhood Chain, BNB Chain, Base, Arc ve Ink.
- **Ücretler:** şimdilik ayrı bir köprü ücreti yok; olağan işlem ücretleri yine de uygulanabilir.
- **FOMO, 22 Ekim:** yaklaşık bir hafta küçük bir kullanıcı kesimindeki denemenin ardından "fomo bridge"in herkese açık dağıtımı. Daha önce Relay dahil dış köprülere dayanıyordu.
- **FOMO'nun iddiası:** bir saniyenin altında zincirler arası işlemler. crypto.news'in 23 Ekim'de belirttiğine göre ne bir karşılaştırma dönemi ne de denetlenmiş rakamlar verdi.
- **İkisinin de açıklamadığı:** hedef taraftaki paranın nereden geldiği, güvenlik modeli ya da herhangi bir denetim.

## Zincirler arası köprü nedir?

Bir blokzincirde başlayıp başka bir blokzincirde değer sahibi olmanın yolu.

Zincirler birbirini okumaz. BNB Chain'deki bir coin öylece Base'e yürüyemez; bu yüzden ortada bir şeyin durması gerekir: onu bir tarafta kilitleyip diğer tarafta bir alacak çıkarmak ya da size karşı tarafta zaten duran fonlardan ödeme yapmak. Hangisini yaptığı, güvenlik sorusunun tamamıdır.

## Zincirler arası bir takas nasıl bir iki saniye sürebilir?

Çünkü önce hiçbir şeyin karşıya geçmesi gerekmez.

Bir zincirin yatırmayı onaylamasını, sonra diğerinin basmasını beklemek iki saniyeden uzun sürer. Hızlı tasarımlar bu beklemeyi atlar: hedef zincirde zaten fonu olan bir dolduran, size orada kendi bakiyesinden öder ve sizin yatırdığınızı sonradan kaynak zincirde tahsil eder. İki uygulamanın da daha önce kullandığı sağlayıcı Relay tam olarak bunu belgeliyor: bir çözücü kendi sermayesiyle doldurur, bir kâhin yatırmayı ve doldurmayı onaylar, çözücüye ödemesi sonra yapılır. Aynı kalıp [zincirler arası niyetlerin ve ERC-7683'ün](/blog/cross-chain-intents-erc-7683) temelinde de var.

Pump.fun ve FOMO köprülerinin böyle çalışıp çalışmadığını ya da doldurmanın kimin parasıyla yapıldığını söylemedi. Bu, hızdan çıkarılan bir sonuçtur, bir açıklama değil.

## Köprülenmiş tokenın arkasında ne var?

Onu hangi tür köprünün yarattığına bağlı.

- **Kilitle ve bas.** Coin'iniz kendi zincirinde bir sözleşmede ya da cüzdanda kilitlenir, diğer zincirde sizin için sarılmış bir kopyası basılır. Kopya, ancak asıl hâlâ kilitli olduğu sürece aslı kadar eder. O kilidi açabilene güvenirsiniz: bir çoklu imza, bir imzacı grubu, bir sözleşme.
- **Dolduranın ödediği.** Hedef zincirde, birinin envanterinden ödenmiş gerçek bir varlık alırsınız. Elinizde bir alacak kalmaz, ama o birkaç saniye boyunca dolduranın ödeyeceğine ve onunla mutabakat yapan sistemin, ödemezse paranızı iade edeceğine güvenirsiniz.

İlk türün çöküşü daha büyüktür. Kilitli bir havuz büyük, sabit ve herkese açıktır. [Liquid Network istismarı](/blog/liquid-network-exploit-explained), imzacıları yazılım öyle dediği için imzalayan bir teminat cüzdanından yaklaşık 4.000 BTC çıkardı.

## Daha hızlı, daha güvenli mi demek?

Hayır. Duyuruların ölçtüğü şey hız ve hata oranı; ikisi de bir aşama başarısız olursa fonlara ne olacağı hakkında hiçbir şey söylemiyor. Uygulamanın kendi işlettiği bir köprü, daha önce bir dış sağlayıcı olan güvendiğiniz tarafı da o uygulamanın kendisi yapar. Bu daha iyi de olabilir, daha kötü de. Yayımlanmış bir tasarım ya da denetim olmadan dışarıdan kimse hangisi olduğunu söyleyemez.

## Köprü kullanmadan önce

- **Sonunda elinizde ne olacağını sorun.** Yerel varlık mı, yoksa başkasının kilidine dayanan sarılmış bir alacak mı?
- **Teminatı kimin hareket ettirebildiğini öğrenin,** ve sarılmış arzın zincirde okunup okunamadığını.
- **Önce küçük bir miktar gönderin,** ve kalanını göndermeden önce ulaştığını doğrulayın.
- **Hız rakamlarını doğrulanana kadar pazarlama olarak okuyun.** Buradaki iki set de şirketlerin kendi bildirdiği, farklı testlerden gelen ve birbiriyle karşılaştırılamayan rakamlar.

## Nura Chain'in köprüsü nasıl çalışır?

Whitepaper onu bir vestiyer fişine benzetiyor: asıl coin kendi ağında kilitlenir, Nura Chain'de ona karşılık gelen bir coin çıkarılır. Nura Chain'deki köprülenmiş BNB, USDT, BTC ve ETH, basılıp yakılan ERC-20 tokenlarıdır ve arzları herkese açıktır: [Nura Chain gezgini nasıl kullanılır](/blog/how-to-use-nura-chain-explorer) yazısının gösterdiği gibi, herkes okuyabilir.

Rakamlar şirketlerin kendisine ait ve dağıtımlar sürdükçe değişebilir. Birincil kaynaklar [Pump.fun'ın duyurusu](https://x.com/Pumpfun/status/2112980077881266326) ve [FOMO'nun duyurusu](https://x.com/fomo/status/2113385954631160071).
