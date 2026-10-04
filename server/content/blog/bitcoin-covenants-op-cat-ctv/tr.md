Bitcoin'in son protokol yükseltmesi Kasım 2021'deki Taproot'tu. O günden beri hiçbir şey etkinleşmedi. Bir sonraki yükseltmenin önde gelen adayları Bitcoin covenant'ları — bir coinin gelecekte nasıl harcanabileceğini kısıtlayan kurallar — ve bunların birbiriyle yarışan iki biçimi var: OP_CAT ve OP_CTV. 1 Ekim 2026'da Blockstream'in CEO'su Adam Back, covenant opcode'larını olası bir "son yumuşak çatallanma" olarak destekledi. Öneriler olgun. Tıkanan kısım, birini benimseme süreci.

## Temel bilgiler

- **Son yumuşak çatallanma:** Taproot, Kasım 2021.
- **OP_CAT (BIP 347):** bir betikte iki veri parçasını birleştirir. Belirtimi Mart 2026'da tamamlanmış olarak işaretlendi ve signet üzerinde test edildi.
- **OP_CTV (BIP 119):** bir coini önceden tanımlanmış bir harcama şablonuna bağlar.
- **İkisi de** Bitcoin ana ağında etkin değil.
- **Yakın tarihli bir başarısızlık:** işlemlerdeki keyfi veriyi bir yıl boyunca sınırlamayı öneren BIP 110, gereken %55'e karşılık madencilerin yaklaşık %2,5'inin desteğini aldı ve kuralı uygulayan dalı Ağustos 2026'da iki bloktan sonra tıkandı.

## Covenant nedir?

Coinle birlikte dolaşan bir koşul.

Bugün bir Bitcoin betiği bir coini kimin harcayabileceğine karar verir. Coinin bundan sonra nereye gideceği hakkında hiçbir şey söyleyemez. Covenant söyleyebilir: "bu coin yalnızca şu adreslerden birine gönderilebilir" ya da "bu coin ancak bir gecikmeden sonra hareket ettirilebilir ve gecikme süresince sahibi iptal edebilir".

İkinci örnek bir kasadır. Bir hırsız anahtarınızı ele geçirirse çekim zincirde duyurulur ve bekler; siz bunu görür ve fonları bir kurtarma anahtarıyla geri çekersiniz. Covenant'lar için en çok anılan kullanım budur, çünkü Bitcoin sahiplerinin gerçekten korktuğu şeye, hırsızlığa çare olur.

## OP_CAT ile CTV'nin farkı ne?

Neye ne kadar izin verdiklerinde.

- **CTV dardır.** Bir coini harcayabilecek işlemin tam biçimini önceden sabitler. Üzerinde akıl yürütmesi kolaydır ve planlananla sınırlıdır.
- **OP_CAT geneldir.** Veriyi uç uca eklemek kulağa önemsiz geliyor, ama mevcut opcode'larla birleştiğinde bir betiğin kendisini harcayan işlemi incelemesine izin verir ve bunun üzerine pek çok şey kurulabilir.

Aralarındaki tartışma, araçlara dair o eski tartışma. Dar bir aracı onaylamak daha güvenlidir ve ileride değiştirilmesi gerekebilir. Genel bir araç gereken son değişiklik olabilir ve sınırlarını çizmek daha zordur. Back ikincisini savunuyor: "genel bir araç takımını bir kez kurun, titizlikle doğrulayın ve gelecekteki yenilik onun üzerinde gerçekleşsin."

## Neden hiçbir şey etkinleşmiyor?

Çünkü Bitcoin'in, tasarımı gereği, bir karar alma usulü yok.

Çatallanmaları takvime bağlayan bir vakıf da, kimseyi bağlayan bir oylama da yok. Bir yumuşak çatallanma için geliştiricilerin onu koda dahil etmesi, madencilerin ona destek sinyali vermesi ve düğüm işletmecilerinin onu çalıştırması gerekir; bu gruplardan herhangi biri bunu yapmayabilir de. Taproot'tan beri bir yükseltmenin nasıl etkinleştirileceği konusunda bile bir uzlaşma olmadı.

BIP 110, bir öneri bu uzlaşma olmadan yola çıktığında ne olduğunu gösterdi. Bitcoin'i değiştirmedi. İki blok sonra kimseye ait olmayan bir dal üretti.

Bunun bir kusur olup olmadığı ne istediğinize bağlı. Değiştirilmesi neredeyse imkânsız olan bir ağ, kötü yönde değiştirilmesi de neredeyse imkânsız olan bir ağdır.

## Bir EVM zincirinde bu nasıl farklı?

Bir covenant'ın yaptığı her şey orada sıradandır. Bir sözleşme fon tutabilir ve bu fonların nereye gideceğine dair her türlü kuralı uygulayabilir: zaman kilitleri, izin listeleri, kasalar, harcama limitleri. Hiçbiri protokol değişikliği gerektirmez, çünkü kurallar zincirin uzlaşısında değil sözleşmede yaşar — [Nura Chain üzerinde akıllı sözleşme dağıtma](/blog/deploy-a-smart-contract-on-nura-chain) yazısı bunun ne kadar az formalite gerektirdiğini gösteriyor, [EIP-7702 ve akıllı hesaplar](/blog/eip-7702-smart-accounts) ise aynı fikrin cüzdan sürümünü ele alıyor.

Bedeli ise bunun ayna görüntüsü. İfade gücü daha yüksek sözleşmeler, yanılmanın daha çok yolu demektir ve bir EVM zincirinin yükseltmelerine Bitcoin'inkilere kıyasla daha küçük bir grup karar verir. Bitcoin'in ihtiyatı ile EVM'in esnekliği, zıt yönlerde yapılmış aynı değiş tokuştur.

Öneri metinleri [Bitcoin BIPs deposunda](https://github.com/bitcoin/bips) duruyor; esas alınacak olan oradaki durumdur, bu yazı da dahil yorumlar değil.
