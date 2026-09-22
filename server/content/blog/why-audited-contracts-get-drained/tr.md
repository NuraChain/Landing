2026'nın iki rakamı, sanki biri diğerini çürütüyormuş gibi karşı karşıya getiriliyor.

Birincisi: bağımsız güvenlik denetiminden geçmiş protokoller, Ocak 2025'ten bu yana çalınan tüm fonların yaklaşık %88'ini oluşturuyor — ihlale uğrayan 245 platformun 147'si, saldırgan gelmeden önce bir denetçiden onay almıştı. İkincisi: olayların yalnızca %11 kadarı denetim kapsamındaki bir akıllı sözleşme kusuruyla ilgiliydi; gerçi bunlar bile yaklaşık 396 milyon dolara mal oldu.

İkisi de doğru ve birlikte gayet net bir şey söylüyorlar: denetimler, denetledikleri şey üzerinde işe yarıyor. Para başka her yerden çıkıyor.

## Para gerçekte nereden çıkıyor

Aynı dönemde tedarik zinciri ve altyapı ihlalleri 1,8 milyar doların üzerinde götürdü — tek başına en büyük kategori. Yani ele geçirilmiş bir derleme hattı, çalınmış bir dağıtım anahtarı, kötücül bir bağımlılık, depodakinden farklı kod sunan bir ön yüz, oltalanıp bir şeyi onaylayan bir çalışan.

Bunların hiçbiri sözleşme hatası değil. Hepsi bir sözleşmeyi boşaltıyor.

Bu arada toplamlar iyileşiyor: saldırganlar 2026'nın ilk yarısında 207 ayrı ihlal gerçekleştirdi ama 972 milyon dolar aldılar; bu, 2025'in ilk yarısındaki 2,3 milyar doların yarısından az. Daha çok olay, daha az para. Savunmalar protokol katmanında işliyor ve saldırganlar yer değiştirdi.

## Denetim gerçekte neyi vaat ediyor

Denetim, belirli bir kodun, belirli bir commit'te, belirli bir tehdit modeline karşı incelenmesidir. Gerçekten yararlıdır ve gerçekten dardır.

Sözleşmeyi dağıtan anahtarı, onu derleyen CI'yı, içe aktardığı npm paketini, arayüzü sunan alan adını, yükseltmeyi onaylayan çoklu imza sahibini ya da fiyat için güvendiği oracle'ı kapsamaz. Bunların her biri kapsam dışıdır ve birçoğuna saldırmak koddan kolaydır.

## Gerçekten tutan sıkıcı denetimler

- **Dağıtım anahtarına hazine gibi davranın.** Donanım, çoklu imza ve bir kişinin kaybını kaldıran bir eşik.
- **Bağımlılıkları sabitleyin.** Kilit dosyaları, bütünlük özetleri ve her güncellemede bilinçli bir karar.
- **Ön yüzü doğrulanabilir kılın.** Bir başkasının etiketli kaynaktan yeniden üretebileceği bir derleme ve sunulan paketin artık eşleşmediğini fark etmenin bir yolu.
- **Yükseltme yolunu prova edin.** Kim duraklatabiliyor, kim yükseltebiliyor, ne kadar sürüyor ve bunlardan ikisine ulaşılamazsa ne oluyor.
- **Sürümü değil, farkı denetleyin.** Denetlenen ürün bir commit'tir. Ondan sonrası tanım gereği incelenmemiştir.

## Sözleşmeyi kendiniz okuyun

Bunların hiçbiri bir özete güvenmeyi gerektirmez. Bir EVM zincirinde dağıtılmış bayt kod, doğrulanmış kaynak ve ona yapılan her işlem herkese açıktır; blok gezgini tam da bunun içindir — [Nura Chain gezgini nasıl okunur](/blog/how-to-use-nura-chain-explorer) nereye bakılacağını, [Nura Chain üzerinde akıllı sözleşme dağıtma](/blog/deploy-a-smart-contract-on-nura-chain) ise doğrulamayı öbür taraftan anlatıyor.

Edinmeye değer alışkanlık: bir şeyi onaylamadan önce, onayladığınız adresin projenin yayımladığı adres olduğunu ve doğrulanmış olduğunu kontrol edin. Bir dakika sürer ve hiçbir denetimin yakalayamayacağı saldırıyı yakalar.

Rakamlar Ocak 2025 – 2026 ortası dönemini kapsayan üçüncü taraf olay verileridir; raporlar arasında yöntem farkları vardır.
