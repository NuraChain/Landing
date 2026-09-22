Ethereum artık protokol yükseltmelerini kabaca altı aylık bir ritimle yayımlıyor ve sıradaki Glamsterdam. Haziran 2026'da son geliştirme aşamasına girdi, yılın ikinci yarısında etkinleşmesi bekleniyor. Solidity yazıyorsanız ya da bir düğüm çalıştırıyorsanız, gelmeden önce içinde ne olduğunu bilmekte fayda var.

## Önemli olan iki değişiklik

Öne çıkan başlıklar blok düzeyinde erişim listeleri ve protokolün içine yazılmış öneren-inşacı ayrımı.

- **Blok düzeyinde erişim listeleri**, bir bloğun hangi hesaplara ve hangi depolama yuvalarına dokunacağını önceden duyurur. Listeyi önceden bilen bir düğüm bu durumu paralel okuyabilir ve birbiriyle çakışmayan işlemleri aynı anda yürütebilir; katı biçimde birer birer değil.
- **Protokole yazılmış öneren-inşacı ayrımı**, bloğu öneren doğrulayıcı ile onu derleyen inşacı arasındaki bölüşümü protokolün kendisine yazar; herkesin bel bağladığı ama kimsenin çalıştırmak zorunda olmadığı zincir dışı röle katmanına bırakmak yerine.

İkisi de sözleşmelerinizin derlendiği bayt koduna dokunmuyor. İkisi de bir bloğa ne sığacağını değiştiriyor.

## Aslında mesele gaz limiti

Sıralı yürütme, ana ağdaki gaz limitinin neden ihtiyatlı kaldığının cevabı: her düğüm her işlemi sırayla yeniden oynatıyor. Blok durum erişimlerini önceden bildirdiğinde bu yeniden oynatma darboğaz olmaktan çıkar ve tavan yükselebilir. Tartışılan rakamlar bugünkü blok başına yaklaşık 60 milyon gazdan 200 milyona yakın bir değere uzanıyor.

Blok başına daha fazla gaz, farklı sözleşmeler için değil aynı sözleşmeler için daha çok yer demek. Bu bir kapasite değişikliği, dil değişikliği değil.

## Gerçekte ne yapmanız gerekiyor

Olağan araçları kullanıyorsanız neredeyse hiçbir şey.

- Solidity, Hardhat ve Foundry EVM'i hedefler ve bu öneriler, karşısına yazdığınız opcode anlamlarını değiştirmez.
- ethers.js ve viem gibi istemci kütüphaneleri zaten varsayılan olarak EIP-1559 işlemleri kuruyor; ücret piyasasının kullanıcının hissettiği kısmı da burası.
- Kendi düğümünüzü veya bir indeksleyici çalıştırıyorsanız sürüm notlarını adam gibi okuyun. Değişen şey blok yapısı ve altyapının ayrıştırdığı şey de blok yapısı.

## Diğer EVM zincirlerinde ne anlama geliyor

EVM ağları üst akıştaki yükseltmeleri kendiliğinden devralmaz. Hangi EIP'yi ne zaman benimseyeceğine her zincir kendi karar verir. Devraldıkları şey araç zinciridir ve yeni bir ağı yeniden yazım değil bir yapılandırma satırı hâline getiren de odur.

Nura Chain işlemlerini hâlihazırda EIP-1559 taban ücretiyle fiyatlıyor, tıpkı Ethereum'un London'dan beri yaptığı gibi; dolayısıyla son birkaç yılda yazılmış herhangi bir kütüphane değişiklik gerektirmeden çalışır. Mekanik [Nura Chain EVM bayt kodunu nasıl çalıştırır](/blog/nura-chain-evm-compatibility) yazısında, uç noktanın kendisi ise [Nura Chain RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) yazısında anlatılıyor.

Yükseltme takvimleri kayar. Bir tarihe göre plan yapmadan önce bu sayfaya değil [ethereum.org](https://ethereum.org) adresine bakın.
