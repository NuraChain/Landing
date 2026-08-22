"EVM uyumlu" ifadesi son beş yılda başlatılan neredeyse her zincirin ana sayfasında yer alıyor ve yeterince gevşek kullanılıyor; bu yüzden tam olarak neye karşılık geldiğini saptamakta yarar var. Bu yazı, ifadenin Nura Chain özelinde ne anlama geldiğini, nelerini kendiniz doğrulayabileceğinizi ve size neyi vermediğini anlatıyor.

## EVM aslında nedir

Ethereum Sanal Makinesi bir yığın makinesinin şartnamesidir. Bir komut kümesi, her komut için bir gaz maliyeti, bir bellek ve depolama modeli ve sabit adreslerde bir dizi önceden derlenmiş sözleşme tanımlar.

Solidity ve Vyper "Ethereum"a derlenmez; EVM bayt koduna derlenir. Zincirlerin birbiriyle uyumlu olabilmesinin bütün sebebi bu ayrımdır: bir sözleşme, nasıl çağrılacağını anlatan bir ABI ile birlikte bir bayt kodu yığınıdır ve aynı komut kümesini uygulayan her makine o yığını aynı şekilde yürütür.

Yani "EVM uyumlu", yürütme katmanı hakkında bir iddiadır. Uzlaşı, doğrulayıcılar, kesinlik ya da yönetişim hakkında hiçbir şey söylemez; bir zincir tümüyle EVM uyumlu olup bunların her birinde Ethereum'dan ayrılabilir.

## Nura Chain neyi uyguluyor

Ağ, standart Ethereum JSON-RPC arayüzüne yanıt verir ve bunu hiçbir şey kurmadan saptayabilirsiniz.

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"web3_clientVersion","params":[]}'
```

Düğüm kendini bir Go uygulaması olarak tanıtır; bu, çoğu EVM ağının üzerinde çalıştığı soydur — go-ethereum ve ondan türeyen istemciler.

Bir blok başlığından okunabilecekler, herhangi bir tanıtım sayfasından okunabileceklerden fazladır. En son bloğu isteyin:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getBlockByNumber","params":["latest",false]}'
```

Dönen başlık `baseFeePerGas`, `0x0` değerinde bir `difficulty`, sıfır bir `mixHash` ve bir `withdrawalsRoot` taşır. Bu, modern Ethereum istemcilerinin Birleşme'den ve London ücret piyasası değişikliğinden sonra ürettiği biçimdir ve buradan iki pratik sonuç çıkar. Ücretler sabit bir gaz fiyatı yerine EIP-1559'a göre işler ve `difficulty` gibi iş ispatı alanlarının burada anlamı yoktur — sıfırdan farklı bir zorluğa göre dallanan kod, bugün Ethereum'da olduğu gibi tuhaf davranacaktır.

## Ücretler EIP-1559'u izler

Bloklar protokolün belirlediği bir taban ücret taşır, gönderen de üstüne bir öncelik ücreti ekler. İkisi de okunabilir:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_maxPriorityFeePerGas","params":[]}'
```

Bu yazı yazılırken taban ücret 1 gwei, blok gaz sınırı ise 150.000.000 düzeyindeydi. İkisi de koda gömülmesi değil, çalışma anında okunması gereken değerlerdir — `eth_feeHistory` ve kütüphanelerin ücret tahmini tam da bunun içindir ve `gasPrice` değeri çakılmış bir dağıtım betiği, bir işlemin kazılmadan öylece beklemesinin en yaygın sebebidir.

Ücret piyasası standart olanın aynısı olduğu için `ethers`, `viem`, `web3.py` ve son birkaç yılda yapılmış herhangi bir cüzdan burada hiçbir ayar gerektirmeden tip-2 işlem oluşturur. Onlara öğretilecek Nura'ya özgü bir şey yok.

## Uyumluluğun size vermediği şeyler

Bu, genellikle atlanan kısımdır.

- Ortak durum vermez. Adresiniz her iki ağda da vardır çünkü aynı anahtardan türer; ama bakiyeler, sözleşme kodu ve geçmiş ayrı defterlerdir. "Başka bir zincirdeki aynı adrese" gönderilen bir varlık ikisi arasında hareket etmemiştir.
- Ortak sözleşme vermez. Ethereum'da dağıtılmış bir sözleşme burada dağıtılmış değildir. Yeniden dağıtırsınız ve kasten belirlenimci bir dağıtıcı kullanmadıkça farklı bir adres alır.
- Ethereum'un güvenlik modelini ya da doğrulayıcı kümesini vermez. Bunlar uzlaşı özellikleridir; EVM uyumluluğu ise yürütme hakkında bir ifadedir.
- Gaz maliyetlerinin sonsuza dek aynı kalacağını garanti etmez. Zincirler EVM yükseltmelerini kendi takvimlerine göre benimser, dolayısıyla birinde ucuz olan bir sözleşme diğerinde ucuz olmayabilir.

Gerçek kayıpların çoğu, ilk maddenin bilindik sayılmasından doğar; yalnızca bu yüzden bile tekrarlanmayı hak eder.

## Bunları kendiniz nasıl denetlersiniz

Yukarıdaki her iddia tek bir isteğin uzağındadır ve mesele tam da budur. `eth_chainId`, `eth_getBlockByNumber` ve `web3_clientVersion` sorularına dürüstçe yanıt veren bir zinciri, hiçbir belge sayfasına — bu sayfaya bile — güvenmeden yaklaşık bir dakikada betimleyebilirsiniz.

Edinilmeye değer alışkanlık şu: değerli bir şey dağıtmadan önce, kullanacağınız uç noktadan zincir kimliğini okuyun ve çerçeve yapılandırmanızın iddia ettiğiyle karşılaştırın. Bu ikisi beklediğinizden daha sık uyuşmaz; genellikle yapılandırma başka bir projeden kopyalandığı için.

## Sık sorulanlar

### Var olan bir Solidity sözleşmesini değiştirmeden dağıtabilir miyim?

Genellikle evet; belirli bir zincir kimliğine, başka bir ağda çakılı bir sözleşme adresine ya da burada bulunmayan bir oracle'a bağlı olmaması koşuluyla. Gerçek sürtünme kaynakları bu üçüdür, bayt kodu değil.

### Hangi Solidity sürümünü hedeflemeliyim?

EVM hedefi ağ tarafından desteklenen bir sürümü. Güvenli yaklaşım, mevcut en yeni hedef yerine oturmuş bir hedefe derlemek ve gerçek bir sözleşmeyi taahhüt etmeden önce dağıtımı gözden çıkarılabilir bir sözleşmede denemektir.

### Gaz maliyetleri Ethereum ile aynı mı?

Komut maliyetleri EVM şartnamesinden gelir, yani biçim aynıdır. Farklı olan, gazın fiyatıdır; onu Ethereum'un değil bu ağın kendi ücret piyasası belirler.

## Bundan sonra nereye

Çağrı yapmaya başlamak için uç noktayı, istemci kütüphanelerini ve tanınmaya değer hataları kapsayan [Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) yazısını okuyun.

Bir EVM zincirinin doğru hedef olup olmadığına hâlâ karar veriyorsanız, [geliştiriciler neden EVM uyumlu bir blok zinciri seçer](/blog/why-build-on-an-evm-compatible-chain) bu soruyu doğrudan ele alıyor. Ağın genel tarifi içinse [Nura Chain nedir](/blog/what-is-nura-chain) yazısına bakın.

Zincire bir şey koymaya hazır olduğunuzda sıradaki adım [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain).
