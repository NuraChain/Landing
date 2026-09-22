Bugün anlamlı etkinliğe sahip seksenden fazla EVM uyumlu zincir var ve sayı artmaya devam ediyor. Bunu dürüstçe açıklamakta fayda var — üstelik o listedeki maddelerden biri olan bir ağ tarafından.

## Ucuz yarı

Bir zinciri "EVM uyumlu" kılan her şey kopyalanmaya hazır. Yürütme istemcisi açık kaynak, opcode anlamları belirtilmiş, JSON-RPC metot adları belgelenmiş, adres biçimi ise bir genel anahtarın özeti. Solidity'nin derlediği, MetaMask'ın bağlandığı bir ağı başlatmak bu noktada bir yapılandırma alıştırması.

Bu bir şikâyet değil. Bir geliştiricinin yeni bir zinciri yeniden yazım yerine tek satırlık bir değişiklikle hedefleyebilmesinin nedeni bu ve Ethereum'un sektörün geri kalanına verdiği en yararlı şey de bu.

## Pahalı yarı

Aşağıdakilerin hiçbiri kopyalanmaz.

- **Likidite.** Piyasa, işlem yapanların bulunduğu yerde vardır. Onu dağıtamazsınız.
- **Kullanıcılar.** İnsanlar, istedikleri uygulamaların zaten çalıştığı yere giderler.
- **Güvenlik bütçesi.** Mutabakata saldırmanın maliyeti; bu iktisadi bir büyüklük, bir özellik anahtarı değil.
- **İşletme geçmişi.** Zincirin bir olay, bir tıkanıklık zirvesi ya da ters giden bir yükseltme sırasında nasıl davrandığı. Bunu yalnızca zaman üretir.
- **Halihazırda dağıtılmış, denetlenebilir sözleşmeler.** Token standardı koddur; insanların güvendiği token ise bir geçmiştir.

Yeni bir zincir, ilk yarının tamamıyla ve ikinci yarının hiçbiriyle başlar. Çoğunun asla kapatamadığı boşluk budur; sayı artarken önemli zincirler listesinin yavaş değişmesinin nedeni de budur.

## Buna rağmen neden yeni zincir açılıyor

Bazen gerçek bir nedenle: belirli bir uygulamanın ihtiyaç duyduğu bir ücret piyasası, bir oyunun gerektirdiği blok süresi, bir yargı çevresi, bir kurumun zorunlu olduğu izinli doğrulayıcı kümesi ya da güvenliğini başka yerden devralan bir rollup.

Bazen de istemekten başka hiçbir nedenle. İkisi ilk gün birbirinin aynısı görünür; seçim yapmak zorunda olan için sorun tam olarak budur.

## Yeni tanıştığınız bir zinciri nasıl tartarsınız

Pazarlama sitesine değil, zincirin kendisine sorun.

- **RPC dürüst yanıt veriyor mu?** `eth_chainId` kontrolü on saniye sürer ve duyurulan zincir kimliğinin sunulan kimlik olup olmadığını söyler.
- **Çalışan bir gezgin var mı?** Logo değil — kendi işleminizi bulabildiğiniz bir gezgin.
- **Blokları kim üretiyor ve kaç taneler?** Bakıp doğrulayabileceğiniz bir sayı, bir sıfattan iyidir.
- **Gerçekte ne dağıtılmış?** Gerçek işlem geçmişi olan doğrulanmış sözleşmeler mi, yoksa yol haritası eşliğinde boş bir durum mu?
- **Ekip ortadan kaybolursa ne olur?** Düğüm yazılımı kendi başınıza çalıştırabileceğiniz bir şey mi?

Bu soruların her biri Nura Chain için de geçerli. Yanıtlar güvenle kabul edilmek için değil, denetlenmek için yazıldı: [Nura Chain nedir](/blog/what-is-nura-chain) değerleri sıralıyor, [RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) bunları düğüme karşı nasıl doğrulayacağınızı gösteriyor, [gezgin rehberi](/blog/how-to-use-nura-chain-explorer) ise orada gerçekte ne olduğunu nasıl okuyacağınızı.

Yararlı sonuç, seksen zincirin çok olduğu değil. "EVM uyumlu" ifadesinin size araç zinciri hakkında bilgi verdiği, ağ hakkında ise neredeyse hiçbir şey söylemediği — ki zaten söylemesi de beklenmiyordu.
