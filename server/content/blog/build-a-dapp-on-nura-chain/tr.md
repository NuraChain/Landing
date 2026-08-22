Bir dApp, alışılmadık tek bir özelliği olan sıradan bir web uygulamasıdır: kullanıcının anahtarını asla tutmaz. Bir zincirden okur ve bir şeyi değiştirmek istediğinde bir cüzdandan imzalamasını ister. Aşağıdaki her şey bu ayrımdan doğar.

## İki yarı

Okuma ve yazma ayrı yollardır; bunları birbirine karıştırmak en yaygın yapısal hatadır.

**Okuma** kendi RPC bağlantınızdan geçer. Cüzdan gerektirmez, kimse bağlanmadan önce çalışır ve arayüzünüzün olabildiğince çoğunu çizmelidir. Bakiyeler, sözleşme durumu, fiyatlar, geçmiş — hepsi herkese açıktır.

**Yazma** kullanıcının cüzdanından geçer. Onayını gerektirir, reddedilebilir ve bağlantıya ihtiyaç duyan tek kısımdır.

Önce okuma yolunu kurun. Biri bağlanana dek boş sayfa gösteren bir dApp, bağlanıp bağlanmamayı değerlendiren herkese boş sayfa gösteren bir dApp'tir.

## Okuma

[Nura Chain RPC'ye bağlanmak](/blog/connect-to-nura-chain-rpc) yazısındakinin aynısı gibi, uç noktaya yöneltilmiş bir public client kullanın:

```javascript
import { createPublicClient, defineChain, http } from 'viem';

export const nura = defineChain({
    id: 1020,
    name: 'Nura Mainnet',
    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.nurachain.net'] } },
    blockExplorers: {
        default: { name: 'Nura Explorer', url: 'https://explorer.nurachain.net' }
    }
});

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

Bu nesne, tüm uygulama için ağın tek tanımıdır. Değerleri tekrarlamak yerine onu her yerde içe aktarın.

## Cüzdan bağlamak

Tarayıcı cüzdanı bir EIP-1193 sağlayıcısı enjekte eder. Modern keşif mekanizması EIP-6963'tür; tek bir küresel değişken için kavga etmek yerine kurulu her cüzdanı duyurur — birden çok cüzdan bulunabilecekse kullanmaya değer. En yalın hali:

```javascript
async function connect() {
    const provider = window.ethereum;

    if (provider === undefined) {
        throw new Error('No wallet found');
    }

    const [account] = await provider.request({ method: 'eth_requestAccounts' });

    return account;
}
```

Bunu bir tıklamadan çağırın, asla sayfa yüklenirken değil. Sayfa açılır açılmaz cüzdan penceresi açan bir dApp, kullanıcıların kapattığı bir dApp'tir.

## Onları doğru ağa getirmek

Bu, çoğu rehberin atladığı ve gerçek kullanıcıların takıldığı adımdır. Bağlı bir cüzdan herhangi bir zincirde olabilir. Ondan geçiş yapmasını isteyin ve Nura Chain'i hiç duymamış olma durumunu da ele alın:

```javascript
const NURA_HEX = '0x3fc';

async function ensureNura(provider) {
    try {
        await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: NURA_HEX }]
        });
    } catch (error) {
        // 4902: the wallet does not know this chain yet. Offer to add it, then
        // the switch above succeeds on the next attempt.
        if (error.code === 4902) {
            await provider.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: NURA_HEX,
                    chainName: 'Nura Mainnet',
                    nativeCurrency: { name: 'Nura Coin', symbol: 'NURA', decimals: 18 },
                    rpcUrls: ['https://rpc.nurachain.net'],
                    blockExplorerUrls: ['https://explorer.nurachain.net']
                }]
            });
        } else {
            throw error;
        }
    }
}
```

`0x3fc`, onaltılık tabanda 1020 demektir ve cüzdanlar onaltılık biçimi ister. `4902` dalı, "tıklıyorum hiçbir şey olmuyor" durumunu çalışan bir ilk deneyime çeviren şeydir — [Nura Chain'i cüzdanınıza eklemek](/blog/add-nura-chain-to-your-wallet) yazısında anlatılan isteğin aynısıdır; yalnızca elle değil sayfanız tarafından gönderilir.

Değişiklikleri de dinleyin; çünkü kullanıcı arkanızdan ağ ya da hesap değiştirebilir:

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

`chainChanged` üzerine yeniden yüklemek kabadır ama doğrudur: zincire özgü hiçbir bayat durumun hayatta kalmamasını güvence altına alır.

## İşlem göndermek

```javascript
import { createWalletClient, custom, parseEther } from 'viem';

const walletClient = createWalletClient({
    chain: nura,
    transport: custom(window.ethereum)
});

const hash = await walletClient.sendTransaction({
    account,
    to: '0xRecipient',
    value: parseEther('1')
});

const receipt = await publicClient.waitForTransactionReceipt({ hash });

if (receipt.status === 'reverted') {
    throw new Error('The transaction was included but reverted');
}
```

İki noktaya dikkat. Cüzdan istemcisi gönderir; public client bekler. Ve `reverted` durumundaki bir makbuz, gerçekleşmiş, gaz harcamış ve isteneni yapmamış bir işlemdir — onu başarı saymak, kullanıcıların bulacağı bir hatadır.

## Gerçekten yaşanan durumlar

Bunların hepsini ele alın; çünkü her biri düzenli olarak olur:

- **Kurulu cüzdan yok.** Bozuk bir düğme değil, bir bağlantı gösterin.
- **Bağlantı reddedildi.** Kullanıcı hayır dedi. Sessizce bağlantısız duruma dönün; yeniden sormayın.
- **Yanlış ağ.** Hata yerine bir geçiş düğmesi sunun. Kullanıcı kafa karışıklığının en büyük tek kaynağı budur.
- **İşlem cüzdanda reddedildi.** Bu bir hata durumu değildir. Bekleyen durumu temizleyin ve devam edin.
- **Beklemede.** Hash'i ve [Nura Explorer](https://explorer.nurachain.net) bağlantısını gösterin ki kendileri izleyebilsin.
- **Geri alındı.** Bunu açıkça söyleyin. Hash ile birlikte "işlem başarısız", hiç durmayan bir dönen simgeden iyidir.

## Yapılmaması gerekenler

- **Özel anahtar istemeyin.** Asla, hiçbir gerekçeyle. İsteyen bir dApp, bir kimlik avı sayfasından ayırt edilemez.
- **Varsayılan olarak sınırsız token onayı istemeyin.** Gerçekten gereken miktarı onaylatın. Büyük bir izin şartsa bunu arayüzde söyleyin.
- **Durumda tutulan bir zincir kimliğine güvenmeyin.** Önemli bir şey göndermeden önce sağlayıcıdan okuyun.
- **Tüm arayüzü cüzdan bağlantısına rehin etmeyin.** İlk bölüme bakın.
- **Her çizimde zinciri sorgulamayın.** Okumaları önbelleğe alın ve uçuştaki istekleri paylaştırın.

## Sık sorulanlar

### Arka uca ihtiyacım var mı?

Zincirden okumak ya da zincire yazmak için hayır — ikisi de doğrudan tarayıcıdan gider; uç noktanın izin verici CORS'u bunu mümkün kılar. Arka uç, zincirlerin iyi olmadığı işler için gerekir: arama, toplulaştırma, zincir dışı veri.

### wagmi ya da RainbowKit kullanabilir miyim?

Evet. Onlara ilk parçadaki aynı zincir tanımını verin. Çoğunlukla yukarıda gösterilen bağlantı ve ağ değiştirme mantığını sarmalarlar; devretmeden önce bunu bir kez anlamakta yarar var.

### Token bakiyelerini nasıl gösteririm?

Token sözleşmesinde `balanceOf` çağırın ve onun kendi `decimals()` değeriyle biçimlendirin. Ondalık sayısını asla varsaymayın — [Nura Chain üzerinde ERC-20 oluşturmak](/blog/create-an-erc-20-token-on-nura-chain) bu varsayımın burada özellikle neden pahalıya patladığını anlatıyor.

### Hiç harcama yapmadan nasıl test ederim?

Okuma yolları hiç para gerektirmez. Yazma içinse küçük bakiyeli, gözden çıkarılabilir bir hesap kullanın ve her sonucu gezginde doğrulayın.

## Bundan sonra nereye

Arayüzünüzün konuşacağı sözleşmeyi henüz dağıtmadıysanız [Nura Chain üzerinde akıllı sözleşme dağıtmak](/blog/deploy-a-smart-contract-on-nura-chain) ile başlayın.

Uygulamanızın gerçekte ne yaptığını doğrulamak için doğru araç [Nura Chain gezginini nasıl kullanırsınız](/blog/how-to-use-nura-chain-explorer). Bütün bunların ardındaki ağ temelleri içinse [Nura Chain nedir](/blog/what-is-nura-chain).
