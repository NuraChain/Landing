Cüzdanlar her ağı önceden bilmez. Nura Chain üzerinde bakiye tutabilmeniz, bir şey gönderebilmeniz ya da bir uygulama açabilmeniz için önce cüzdanınıza bu ağın var olduğunu söylemeniz gerekir. Yaklaşık bir dakika sürer.

## Cüzdanınızın isteyeceği şeyler

Altı değer; her cüzdan bunların bir bölümünü ister:

- Ağ adı: Nura Mainnet
- RPC adresi: `https://rpc.nurachain.net`
- Zincir kimliği: `1020`
- Para birimi sembolü: `NURA`
- Blok gezgini adresi: `https://explorer.nurachain.net`
- Ondalık basamak: 18, ki çoğu cüzdan bunu kendisi doldurur

İşlemi yaparken bu sayfayı açık tutun ya da daha iyisi, zincir kimliğini bağımsız olarak doğrulayın — bir sonraki bölüm bu otuz saniyenin neden değdiğini anlatıyor.

## Tek tıklık yol

Çoğu tarayıcı cüzdanı, bir sayfanın ağ tanımının tamamını bir kerede devretmesine izin veren EIP-3085 adlı standart bir isteği destekler. Nura Chain sitesi bunu kullanır: ana sayfadaki ve alt bilgideki "Add Nura Chain to wallet" denetimi tam olarak yukarıdaki değerleri gönderir ve cüzdanınız bunları onayınıza sunar.

Tercih edilmesi gereken yol budur ve nedeni kolaylıkla ilgili değil. Zincir kimliğini elle yazmak, hataların yapıldığı adımdır; yanlış yazılmış bir RPC adresi ise bir derece daha kötüdür — cüzdanınızı, o yazım hatalı alan adının sahibinin seçtiği bir sunucuya yöneltir.

Onay penceresi belirdiğinde geçiştirmek yerine okuyun. Size bir ağ tanımı gösteren cüzdan, tam olarak neye güvenmek üzere olduğunu gösteriyordur.

## Elle ekleme

Cüzdanınız otomatik isteği desteklemiyorsa ya da bir sayfanın bu isteği yapmasına hiç izin vermek istemiyorsanız, her cüzdanın elle bir yolu vardır. MetaMask'te kabaca şöyledir:

1. Eklentinin üstündeki ağ seçiciyi açın.
2. "Add a custom network" seçeneğini seçin (eski sürümlerde: Ayarlar, sonra Ağlar, sonra Ağ ekle, sonra elle ekle).
3. Yukarıdaki altı değeri doldurun.
4. Kaydedin ve yeni ağa geçin.

Diğer cüzdanlar başka sözcükler kullanır ama aynı alanları ister; çünkü alanlar cüzdandan değil standarttan gelir.

## Gerçekten Nura Chain üzerinde olduğunuzu doğrulayın

Bunu atlamayın. Bir cüzdan, adı bir şey söyleyen ve RPC'si başka bir yeri gösteren bir ağı gayet memnuniyetle saklar; çünkü ad sizin yazdığınız bir etikettir, RPC ise gerçekten konuştuğu şeydir.

Uç nokta kimliğini kendisi bildirir:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

Yanıt `{"jsonrpc":"2.0","id":1,"result":"0x3fc"}` olur. `0x3fc` onluk tabanda 1020 eder ve cüzdanınızın gösterdiği zincir kimliğiyle eşleşmelidir. İkisi uyuşmuyorsa durun ve bir şey göndermeden önce ağ kaydını düzeltin.

Terminal kullanmamayı yeğliyorsanız [Nura Explorer](https://explorer.nurachain.net) sayfasını açın ve yakın tarihli bir blok numarasını cüzdanınızın bildirdiğiyle karşılaştırın. Gezgin ile cüzdanın aynı zinciri okuması, aynı denetimin başka bir yoldan yapılmasıdır.

## Nura Wallet

Bu ağ için özel olarak yapılmış bir cüzdan da var. Nura Wallet kendi saklamalıdır — anahtarlar cihazınızda kalır — ve ana sayfadan bağlantı verilen Android, Windows ve Linux sürümleri vardır. Ağ içinde önceden yapılandırılmış gelir, bu da bütün bu işlemi ortadan kaldırır.

Zorunlu değildir. Nura Chain sıradan bir EVM ağıdır ve özel ağ kabul eden herhangi bir cüzdan iş görür; [EVM uyumlu olmanın](/blog/nura-chain-evm-compatibility) anlamı da tam olarak budur. Zaten güvendiğiniz cüzdanı kullanın.

## Bir şey ters gittiğinde

- **Cüzdan zincir kimliğini reddediyor.** Neredeyse her zaman onluk ve onaltılık biçimin karışmasıdır. `1020` ile `0x3fc` aynı sayıdır; `0x1020` girmek değildir.
- **Bakiyeler sıfır görünüyor.** Hangi ağın seçili olduğuna bakın. Aynı adres her EVM zincirinde vardır, dolayısıyla yanlış ağa yöneltilmiş bir cüzdan size gerçek bir adresi ve alakasız bir bakiyeyi gösterir.
- **İşlem hiç onaylanmıyor.** Genellikle başka bir ağdan kalan bir gaz fiyatı. Üzerine yazmak yerine cüzdanın tahmin etmesine izin verin.
- **Sembol başka bir şey görünüyor.** Görseldir ve ağ kaydını düzenleyerek düzelir. Ağın işleyişini etkilemez.

## Sık sorulanlar

### Ağ eklemek kendi başına riskli mi?

Ağ eklemek para taşımaz ve hiçbir uygulamaya izin vermez. Önemli olan hangi RPC adresine yöneldiğinizdir; çünkü cüzdanınızın bakiyeleri sorduğu ve işlemleri gönderdiği sunucu odur. Güvenmek için nedeniniz olan birini kullanın ve zincir kimliğini doğrulayın.

### Ağı eklemeden önce NURA'ya ihtiyacım var mı?

Hayır. Eklemenin bir maliyeti yok. Ama işlem gönderebilmek için NURA bakiyesine ihtiyacınız olacak; çünkü gaz yerel coin ile ödenir.

### Zaten sahip olduğum adresi kullanabilir miyim?

Evet. Adresiniz anahtarınızdan türer, dolayısıyla her EVM ağında aynıdır. Bakiyeler ve geçmiş ise zincir başına ayrıdır — bu ayrımın neden önemli olduğu için [Nura Chain nedir](/blog/what-is-nura-chain) yazısına bakın.

### Ağı sonradan nasıl kaldırırım?

Eklediğiniz aynı ayarlar ekranından. Bir ağı kaldırmak hiçbir bakiyeyi etkilemez; yalnızca o cüzdanın zinciri göstermesini durdurur.

## Sonraki adımlar

Ağ eklendikten sonra yaptığınız şeyin gerçekten olduğunu doğrulamanın en hızlı yolu [Nura Explorer](https://explorer.nurachain.net); [nasıl okunacağı](/blog/how-to-use-nura-chain-explorer) sütunların ne anlama geldiğini anlatıyor.

Tutmak için değil geliştirmek için buradaysanız doğrudan [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) yazısına geçin. NURA'nın ne olduğu ve arzın nasıl bölündüğü içinse [Nura Coin arzı ve dağılımı](/blog/nura-coin-tokenomics) yazısına bakın.
