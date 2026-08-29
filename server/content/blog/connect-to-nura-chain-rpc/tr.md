Bir programın blok zinciriyle yaptığı her şey bir RPC uç noktasından geçer. Bu, Nura Chain'inki: ne yapar, ne yapmaz ve alışılmış kütüphaneleri ona nasıl yöneltirsiniz.

## Uç nokta

```text
https://rpc.nurachain.net
```

HTTPS POST üzerinden Ethereum JSON-RPC konuşur ve `1020` zincir kimliğine aittir. Bu ikinci değeri buradan değil, uç noktanın kendisinden okuyun:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc`, 1020 demektir. Aşağıdaki her kütüphaneye bu sayı açıkça veriliyor ve bu bilinçli: hangi zinciri beklediği söylenmiş bir istemci, uç nokta ona katılmadığında devam etmeyi reddeder — böylece yanlış ağa yapılan sessiz bir dağıtım, açılışta bir hataya dönüşür.

## Hiçbir şey kurmadan ilk istek

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

Sonuçlar ondalık sayılar olarak değil, onaltılık nicelikler olarak döner ve insanları sürekli yanıltan da budur. `0x3aecc`, 241.356 eder. Her istemci kütüphanesi dönüşümü sizin için yapar; çıplak `curl` yapmaz.

## ethers.js

```javascript
import { JsonRpcProvider } from 'ethers';

const provider = new JsonRpcProvider('https://rpc.nurachain.net', {
    chainId: 1020,
    name: 'nura'
});

const [height, fees] = await Promise.all([
    provider.getBlockNumber(),
    provider.getFeeData()
]);

console.log(height, fees.maxFeePerGas);
```

Ağı ikinci argüman olarak vermek iki iş görür: ilk kullanımda bir `eth_chainId` gidiş dönüşünü ortadan kaldırır ve uç nokta farklı bir zincir bildirirse sağlayıcının hata fırlatmasını sağlar. Asıl değerli olan ikincisidir.

## viem

viem bir chain nesnesi ister; bu da tüm değerleri tek bir bildirimde tutmak için iyi bir yerdir:

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Chain',
    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

const client = createPublicClient({ chain: nura, transport: http() });

console.log(await client.getBlockNumber());
```

Aynı `nura` nesnesini daha sonra wagmi'ye ve viem'in wallet client'ına da verirsiniz.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

O doğrulama satırını yazmak üç saniye sürer ve bu yazıdaki başka herhangi bir satırdan daha fazla dağıtımı kurtarmıştır.

## Tarayıcıdan okumak

Uç nokta izin verici CORS başlıkları gönderir; dolayısıyla bir sayfa, kendi vekil sunucunuz olmadan doğrudan onu çağırabilir:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

Bunun neye izin verdiği konusunda net olalım. Okuma çağrıları tarayıcıdan çalışır. Özel anahtar gerektiren hiçbir şey bu uç noktadan geçmez — kullanıcının cüzdanından geçer; bu tümüyle ayrı bir yoldur ve [Nura Chain üzerinde dApp geliştirmek](/blog/build-a-dapp-on-nura-chain) yazısının konusudur.

## Tasarım gereği reddedilen metotlar

Herkese açık bir uç noktadan hesap isteyin, hayır der:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

Bu, eksik bir özellik değil doğru davranıştır. Herkese açık bir RPC düğümü sizin adınıza hiçbir anahtar tutmaz; dolayısıyla `eth_accounts`, `eth_sendTransaction` ve `personal_*` üzerinde çalışacak bir şey bulamaz. Bunlara yanıt veren bir uç nokta, birinin parasını saklayan bir uç nokta olurdu.

İmzalı bir işlemin yolu şudur: yerelde oluşturun, yerelde imzalayın ve imzalı baytları `eth_sendRawTransaction` ile gönderin. Çıplak bir sağlayıcı yerine bir cüzdan verdiğiniz anda her kütüphane bunu sizin için yapar.

## Pratik notlar

- Her çizimde sorgulama yapmayın. Zincir okumaları ağ çağrılarıdır; birkaç saniye önbelleğe alın ve aynı anda gelen çağıranlar arasında uçuştaki tek bir isteği paylaştırın.
- Zincir kimliğini her çağrıda değil, açılışta bir kez okuyun ve uyuşmazlıkta yüksek sesle başarısız olun.
- Başarısız bir okumayı sıfır değil, başarısız sayın. İstek zaman aşımına uğradığı için 0 görünen bir bakiye, hata olarak görünen bakiyeden daha kötüdür.
- Gaz fiyatlarını koda gömmeyin. Gönderim anında ücret verisi isteyin; [ücretler burada nasıl işliyor](/blog/nura-chain-evm-compatibility) yazısına bakın.

## Sık sorulanlar

### Hız sınırı var mı?

Bir sayı ilan etmiş olsun ya da olmasın, herkese açık her uç noktayı hız sınırlı kabul edin ve buna göre tasarlayın: önbellek, toplu istek ve başarısızlıkta geri çekilme. Her tuş vuruşunda paylaşılan bir uç noktayı döven bir uygulama er ya da geç bir yerde kısıtlanır ve bir işletmecinin bunu yapması makuldür.

### WebSocket ya da abonelik kullanabilir miyim?

Varsaymak yerine sınayın. `eth_subscribe` yoksa, makul bir aralıkla `eth_blockNumber` sorgulamak taşınabilir yedek yoldur ve zaten çoğu uygulamanın vardığı yer burasıdır.

### İşlemim neden hiç onaylanmıyor?

Olağan sebep, bir şablondan kalmış ve mevcut taban ücretin altında kalan çakılı bir gaz fiyatıdır. Bunun yerine gönderim anında ücret verisini okuyun.

### Kendi düğümümü çalıştırabilir miyim?

Buradaki hiçbir şey barındırılan bir uç noktaya bağlı değil. Kendi düğümünüzden okuyan bir uygulamanın tek ihtiyacı farklı bir URL'dir ve bu mimariyi değerli kılan da tam olarak bu özelliktir.

## Bundan sonra nereye

Okumalar çalıştığına göre sıradaki adım yazmak: [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain), yukarıdaki değerler üzerine kurulu Hardhat ve Foundry yapılandırmasını ele alıyor.

Zincire gerçekte neyin indiğini doğrulamak içinse eşlik eden yazı [Nura Chain gezginini nasıl kullanırsınız](/blog/how-to-use-nura-chain-explorer). Buraya bağlamsız geldiyseniz başlangıç noktası [Nura Chain nedir](/blog/what-is-nura-chain).
