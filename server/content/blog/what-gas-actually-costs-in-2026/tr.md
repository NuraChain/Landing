Bir zincirin ucuz olduğunu söyleyen her iddia tek bir sayı verir. Oysa ücret üç sayıdan oluşur ve eksik kalan ikisi, genelde o iddianın yaşadığı yerdir.

```
para birimi cinsinden ücret = gaz birimi x gaz fiyatı x yerel coinin fiyatı
```

Gaz birimini işlemin ne yaptığı belirler. Gaz fiyatını blok alanı piyasası belirler. Coin fiyatını ise geri kalan her şey. Gaz fiyatı çok düşük ama coini pahalı bir zincir ucuz değildir; gaz fiyatı yüksek ama coini değersiz bir zincir de pahalı değildir.

## Üç sayı, ayrı ayrı

**Gaz birimleri** belirlenimlidir. Düz bir transfer 21.000'dir. ERC-20 transferi, alıcının bakiye yuvasının halihazırda sıfırdan farklı olup olmamasına göre genellikle 45.000 ile 65.000 arasındadır. Sözleşme dağıtımı, bayt kod boyutuna göre binlerden milyonlara uzanır. Bunlar EVM'in özellikleridir ve her EVM zincirinde aynıdır.

**Gaz fiyatı** piyasadır. EIP-1559'dan beri ikiye ayrılır: protokolün blok başına belirleyip yaktığı taban ücret ve daha erken dahil edilmek için eklediğiniz öncelik ücreti. Ethereum ana ağında 2026 boyunca taban ücret uzun dönemler 0,15 gwei civarında seyretti; bu da basit bir transferi bir kuruşun altına indiriyor. Bu, 2021'den bambaşka bir dünya ve doğrudan talebin rollup'lara kayması ile onların verisi için blob alanının var olmasının sonucu.

**Coin fiyatı**, kimsenin denetlemediği ve herkesin unuttuğu kısım. Gwei cinsinden söylenen bir ücretin, siz çarpma yapana kadar hiçbir şey anlatmamasının nedeni de bu.

## Kendiniz hesaplayın

İki JSON-RPC çağrısı, herhangi bir EVM ağındaki herhangi bir işlemi fiyatlandırır. Panoya gerek yok.

```bash
curl -s https://rpc.nurachain.net \
  -X POST -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_gasPrice","params":[]}'
```

Sonuç, wei cinsinden onaltılık bir dizedir. Gwei için 10^9'a bölün, gaz biriminizle çarpın, tam coin cinsinden bir rakam için 10^18'e bölün. Bir işlem nesnesi verirseniz `eth_estimateGas` çarpmanın ilk yarısını sizin için yapar.

Bunu bir kez, zincirin kendisine karşı yapmak, herhangi bir karşılaştırma tablosundan değerlidir — bu yazı da dahil.

## Gaz limiti fiyatı neden ilgilendirir

Gaz fiyatı, bir bloktaki alan için yapılan açık artırmadır. Alanı artırın; diğer her şey sabitken denge fiyatı düşer. Ethereum'un blok gaz limitinde beklenen artışın — yaklaşık 60 milyondan 200 milyona yakın bir düzeye, [Glamsterdam yükseltmesindeki](/blog/ethereum-glamsterdam-upgrade) değişikliklerin mümkün kıldığı biçimde — kapasite hikâyesi olduğu kadar ücret hikâyesi de olmasının nedeni tam olarak budur.

## Nura Chain üzerinde

Gaz NURA ile ödenir, bloklar yaklaşık üç saniyede bir oluşur ve işlemler EIP-1559 taban ücreti taşır; dolayısıyla yukarıdaki aritmetik olduğu gibi geçerlidir. İhtiyacınız olan değerler [Nura Chain nedir](/blog/what-is-nura-chain) yazısında, yukarıdaki curl'ün konuştuğu uç nokta ise [RPC'ye bağlanma](/blog/connect-to-nura-chain-rpc) yazısında.

Pratik bir alışkanlık: göndermeden önce hesaplayın, sonra değil. Gaz birimleri önceden bilinebilir ve sizi şaşırtan işlem neredeyse her zaman beklediğinizden fazla depolamaya dokunmuş olandır.
