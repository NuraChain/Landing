HTTP, doksanların başından beri `402 Payment Required` adlı bir durum kodu taşıyor. Hiç gelmeyen bir gelecek için ayrılmıştı ve otuz yıl boyunca onunla yapılacak doğru şey hiçbir şey yapmamaktı. 2026'da birden yük taşımaya başladı: x402 bu yanıtı kullanarak bir istemcinin tek bir isteğin bedelini stablecoin ile ödemesini sağlıyor; hesap yok, API anahtarı yok.

## Mekanizma, üç adımda

1. İstemci bir kaynak ister. Sunucu `402` ile yanıt verir ve yapılandırılmış bir JSON gövdesinde fiyatı ve nereye ödeneceğini bildirir.
2. İstemci zincir üzerinde öder ve ödeme kanıtını taşıyarak isteği yineler.
3. Sunucu doğrular ve yanıtı verir.

Protokolün tamamı bu. Kayıt yok, faturalama dönemi yok, kayıtlı kart yok, asgari tutar yok. Tek bir çıkarıma ya da tek bir sayfa veriye ihtiyacı olan, tek bir çıkarımın ya da tek bir sayfanın bedelini öder.

## Neden şimdi ortaya çıktı

Çünkü çağıran artık bir insan değil. Otonom bir ajan kayıt formu dolduramaz, kurumsal kart taşıyamaz, ay sonunda faturanın kapanmasını bekleyemez. Ama bir anahtar tutabilir ve bir transferi imzalayabilir; istek başına fiyatlama da saatte binlerce küçük karar veren bir şeye oturan tek faturalama modeli.

Hacimler artık varsayım değil. Ekim 2025'ten Ocak 2026'ya uzanan on dört haftalık bir beta sürecinde binden fazla katılımcı 9.500'den çok ajan yarattı; bu ajanlar aralarında yaklaşık 187.000 otonom işlem gerçekleştirdi.

## Bunun bir zincirden istedikleri

Üç özellik ve hiçbiri gösterişli değil.

- **Ucuz işlem.** Bir kuruşun kesri kadar bir ödeme, satın aldığı şeyden pahalıya mal olamaz.
- **Hızlı kesinlik.** İstek bekliyor. Dakikalarla ölçülen bir mutabakat penceresi zaman aşımı demektir.
- **İstikrarlı bir birim.** Kimse bir API çağrısını, yeniden denemeden önce yüzde on oynayan bir varlıkla fiyatlamaz.

Bunları karşılayan herhangi bir EVM ağı bu trafiği taşıyabilir; işlemin kendisinde egzotik hiçbir şey yok. [Nura Chain RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) bir ajanın kullanacağı JSON-RPC'nin aynısı ve burada bloklar yaklaşık üç saniyede bir oluşuyor.

## Birini yayına almadan önce doğru yapılacaklar

Anahtar taşıyan bir ajan, gözetimsiz bir imzacıdır. Ona öyle davranın.

- **İnce fonlayın.** Bir günlük işe yetecek kadar sıcak bakiye, bilerek tazelenen — hazine değil.
- **Sınırlayın.** Harcama tavanı ve son kullanma tarihi olan oturum anahtarları; akıllı hesapların tam da pratik kıldığı şey — bkz. [EIP-7702 ve akıllı hesaplar](/blog/eip-7702-smart-accounts).
- **Her ödemeyi kaydedin.** Sessizce harcayan bir ajan, sonradan denetleyemeyeceğiniz bir ajandır.
- **Anahtarı istemden ayırın.** Bir ajanın okuduğu her şey ona talimat vermeyi deneyebilir. Harcama sınırı, karşılık vermeyen tek denetimdir.

Ajan ödemelerinde ilginç olan, makinelerin ödeyebilmesi değil. İstek başına fiyatlamanın nihayet altında bir mutabakat katmanı bulması.
