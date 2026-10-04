Yazılım, Eylül 2026'nın üçüncü haftasında iki ayrı ödeme altyapısı üzerinden bir şeylerin parasını ödemeye başladı. 21 Eylül'de Mastercard ile Danske Bank, Danimarka'da bir yapay zekâ ajanının yaptığı ilk ödeme olarak nitelendirdikleri işlemi tamamladı; Mastercard aynı gün Kanada'daki ilkini de duyurdu. 25 Eylül'de Block, bir ajanın tek bir web isteğinin bedelini ödemesini sağlayan protokol olan x402'ye Bitcoin'in Lightning Network'ünü ekledi. Yapay zekâ ajanı ödemelerinin artık bir kart cevabı ve bir kripto cevabı var.

## Temel bilgiler

- **Kartlar:** 21 Eylül 2026'da bir ajan, Mastercard Agent Pay'i kullanarak bir Danske Bank Mastercard'ıyla bir kahve tadımı için rezervasyon yaptı ve ödemesini gerçekleştirdi.
- **Kanada:** bir Rogers Bank kart hamili adına hareket eden bir asistan, "önceden tanımlanmış harcama limitleri" dahilinde bir ürün satın aldı.
- **Kripto:** Block, 25 Eylül 2026'da x402'ye Lightning desteği ekledi.
- **x402'nin ölçeği:** protokolün kendi rakamlarına göre önceki 30 günde 24,2 milyon dolar değerinde yaklaşık 75,4 milyon işlem.
- **Ödemeler neyle kapanıyor:** Circle'a göre 2026'nın ikinci çeyreğinde x402 hacminin %99,3'ü USDC'ydi.

## Bir ajan kartla nasıl ödüyor?

Bir insanın kartını ödünç alarak.

Ajan, kimliği zaten doğrulanmış bir kart hamili adına hareket eder. Ödeme, o kişinin kartı üzerinden, onun belirlediği talimatlar ve limitler dahilinde yetkilendirilir ve satıcıya sıradan bir kart ödemesi gibi görünen bir şey ulaşır. Arkasındaki her şey mevcut sistemdir: kartı çıkaran bir banka, ters ibrazlar, dolandırıcılık kuralları, ay sonunda bir ekstre.

Gücü de bu. Bir mağazanın bunu kabul etmek için hiçbir şeyi değiştirmesi gerekmez ve hatalı bir satın alıma itiraz edilebilir.

## Bir ajan x402 ile nasıl ödüyor?

Bir anahtar tutarak.

Sunucu bir isteğe `402 Payment Required` HTTP durum koduyla ve bir fiyatla yanıt verir. Ajan öder ve isteği yineler. Hesap yok, kart yok, döngüde bir insan yok — mekanizma [yapay zekâ ajanları x402 üzerinden istek başına nasıl ödüyor](/blog/ai-agents-onchain-payments-x402) yazısında.

Protokolün kendi rakamlarını birbirine bölün, kartlardan farkı ortaya çıkar: 75,4 milyon işleme yayılan 24,2 milyon dolar, işlem başına yaklaşık 32 sent eder. Kart ağları bu büyüklükteki ödemeler için kurulmadı.

## Peki hangisi kazanır?

Muhtemelen ikisi de; farklı satın alımlar için.

- **Kartlar,** insanların zaten satın aldığı şeylere uyar: bir rezervasyon, bir ürün; bir satıcısı, bir iade politikası ve itiraz etmeye değer bir fiyatı olan her şey.
- **x402,** yalnızca yazılımın satın aldığı şeylere uyar: tek bir API çağrısı, tek bir sayfa veri, tek bir çıkarım; saatte binlerce kez.

Lightning'in eklenmesi önemli, çünkü ikinci kategoriyi stablecoin'lerin ötesine genişletiyor. Şimdiye kadar x402 hacminin neredeyse tamamı USDC'ydi; artık bir ajan aynı protokol üzerinden bitcoin ile ödeyebiliyor.

## İki altyapıda da aynı kalan ne?

Ödeme yapabilen bir ajan, gözetimsiz bir imzacıdır. Kart sürümü sınırı ağa koyar; kripto sürümü hesaba koyar. Her iki durumda da önemli olan denetim tavandır, çünkü bir ajan konuşularak bir şeylere ikna edilebilir, bir harcama limiti ise edilemez.

Bir EVM zincirinde bu tavan, süresi dolan bir oturum anahtarına sahip bir akıllı hesaptır — [EIP-7702 ve akıllı hesaplar](/blog/eip-7702-smart-accounts) yazısındaki kalıp. Nura Chain yaklaşık üç saniyede bir blok üretir ve ücretleri bir EIP-1559 taban ücreti belirler; istek başına ödemelerin ihtiyaç duyduğu biçim budur. Bir ajan ödeme ürünü sunmuyor ve buradaki hiçbir şey öyle okunmamalı.

Hacimler küçük ve kendi beyanlarına dayanıyor. Protokolün rakamlarını [x402.org](https://x402.org) yayımlıyor.
