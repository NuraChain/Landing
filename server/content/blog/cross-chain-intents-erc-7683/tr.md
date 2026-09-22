Bugün anlamlı zincir üstü etkinliğe sahip seksenden fazla EVM uyumlu zincir var; ayrıca kendi kullanıcı kitlesi olan birkaç EVM dışı ekosistem. Aralarında değer taşımak eskiden bir köprü seçmek, güven modelini anlamak ve ummak demekti. 2026'da baskın kalıp farklı: ne istediğinizi imzalıyorsunuz, nasıl olacağını başkası çözüyor.

## Niyet nedir

Niyet, bir sonucun imzalı beyanıdır. "Şu köprüdeki şu sözleşmeyi bu parametrelerle çağır" değil; "burada 100 USDC'm var, şu tarihten önce orada en az 99,4 USDC istiyorum".

Bu emir, onu karşılamak için yarışan bir çözücü ağına gider. Varış zincirinde zaten USDC tutan bir çözücü size orada öder, sonra kaynak zincirdeki fonlarınızı alır. Sizin hiçbir şeyiniz hiçbir yerden geçmez. Geçen şey çözücünün envanteriydi — günler önce, kendi seçtiği bir zamanda.

Uniswap Labs ve Across Labs tarafından yazılan **ERC-7683**, bunu taşınabilir kılan standarttır: zincirler arası niyet emirleri için tek bir veri biçimi, böylece bunları üreten herhangi bir protokolün emri herhangi bir uyumlu çözücü ağı tarafından karşılanabilir. Türünün en yaygın benimsenen biçimidir.

## Neden varsayılan hâline geldi

Çünkü eski modelin arıza biçimi mevcut en kötüsüydü. Kilitle-ve-bas köprüsü, büyük ve hareketsiz bir varlık havuzu tutar ve adresini yayımlar; bu sürekli açık bir davetiyedir. Yıllara yayılan olaylar tam da bu biçimden çıktı.

Niyet modelinde kalıcı bir bal küpü yok. Üstelik daha hızlı ve siz taahhüt etmeden önce fiyat veriyor; kullanıcının gerçekten fark ettiği şey de bu. 2026'da zincirler arası en yüksek hacimli kullanım stablecoin ödemeleri ve tek başına NEAR Intents 25'ten fazla zincirde yaklaşık 5 milyar dolarlık hacim işledi.

## Karşılığında neye güveniyorsunuz

Hiçbir şeye değil. Risk yok olmadı, yer değiştirdi.

- **Emanet sözleşmesi.** Fonlarınız, karşılama kanıtlanana kadar orada durur. O sözleşme, kodu kadar iyidir.
- **Karşılama kanıtı.** Kaynak zincirin, varışta ödemenin yapıldığını nasıl öğrendiği. Kimi zaman bir oracle, kimi zaman itiraz süreli iyimser bir pencere, kimi zaman hafif istemci. Asıl güven varsayımı burada ve protokolden protokole değişir.
- **Çözücü rekabeti.** Fiyat kalitesi, emrinizi isteyen birkaç çözücünün bulunmasına bağlı. İnce piyasa ince fiyat verir.
- **Son tarih.** Kimse karşılamazsa süre dolduğunda fonlarınız geri gelir — yani "karşılanmadı", emanet düzgün davrandığı sürece bir kayıp değil bir gecikmedir.

## Böyle bir zincir için ne anlama geliyor

Yeni bir EVM ağının artık varsayılan olarak yalıtılmış olmamasının nedeni niyetlerdir. Çözücüler talep neredeyse orada envanter tutar; bir zincirden teknik beklenti ise en sıradan olanı: standart JSON-RPC, hızlı bloklar, ucuz işlemler ve okunabilir durum. [Nura Chain RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) tam olarak bu arayüz, [Nura Chain nedir](/blog/what-is-nura-chain) ise bir çözücünün ya da cüzdanın ihtiyaç duyacağı diğer değerleri kapsıyor.

Dürüst özet: niyetler köprü sorununu ortadan kaldırmadı; kilitli varlıklardan oluşan hareketsiz bir havuzun yerine, kendi varlığını taşıyan insanlardan oluşan bir piyasa koydu. Bu daha iyi bir biçim ve yine de içinde varsayımlar barındıran bir biçim.
