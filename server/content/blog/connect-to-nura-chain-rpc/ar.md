كل ما يفعله برنامج مع بلوكتشين يمر عبر نقطة نهاية RPC. هذه هي نقطة النهاية الخاصة بنورا تشين: ما تفعله، وما لا تفعله، وكيف توجّه إليها المكتبات المعتادة.

## نقطة النهاية

```text
https://rpc.nurachain.net
```

تتحدث JSON-RPC الخاص بإيثريوم عبر HTTPS POST، وتنتمي إلى معرّف السلسلة `1020`. اقرأ هذه القيمة الثانية من نقطة النهاية لا من هنا:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` تساوي 1020. كل مكتبة أدناه تُعطى هذا الرقم صراحةً، وذلك مقصود: فالعميل الذي يعرف أي سلسلة يتوقعها سيرفض المتابعة حين تخالفه نقطة النهاية، وهو ما يحوّل نشرًا صامتًا على الشبكة الخطأ إلى خطأ عند الإقلاع.

## أول طلب دون تثبيت أي شيء

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

تعود النتائج بصيغة كميات ست عشرية لا أرقامًا عشرية، وهذا ما يوقع الناس باستمرار. `0x3aecc` تساوي 241,356. كل مكتبة عميل تحوّل نيابةً عنك؛ أما `curl` المجرد فلا.

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

تمرير الشبكة كوسيط ثانٍ يفعل أمرين: يوفّر رحلة `eth_chainId` عند أول استخدام، ويجعل المزوّد يرمي خطأً إذا أبلغت نقطة النهاية عن سلسلة مختلفة. والثاني هو الأجدر بالاقتناء.

## viem

تطلب viem كائن chain، وهو مكان جيد لحفظ كل القيم في تصريح واحد:

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

const client = createPublicClient({ chain: nura, transport: http() });

console.log(await client.getBlockNumber());
```

وكائن `nura` نفسه هو ما تسلّمه لاحقًا إلى wagmi وإلى wallet client في viem.

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

كتابة هذا التوكيد تستغرق ثلاث ثوانٍ، وقد أنقذت من عمليات النشر أكثر مما أنقذ أي سطر آخر في هذا المقال.

## القراءة من المتصفح

ترسل نقطة النهاية ترويسات CORS متساهلة، فتستطيع صفحة استدعاءها مباشرةً دون وسيط خاص بك:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

ولنكن واضحين بشأن ما يتيحه ذلك. استدعاءات القراءة تعمل من المتصفح. أما أي شيء يحتاج مفتاحًا خاصًا فلا يمر عبر هذه النقطة إطلاقًا — بل عبر محفظة المستخدم، وهو مسار مختلف تمامًا وموضوع مقال [بناء تطبيق لامركزي على نورا تشين](/blog/build-a-dapp-on-nura-chain).

## دوال مرفوضة عن قصد

اطلب من نقطة نهاية عامة الحسابات، فترد بالرفض:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

هذا سلوك صحيح لا ميزة ناقصة. فالعقدة العامة لا تحتفظ بأي مفاتيح نيابةً عنك، ومن ثم لا تجد `eth_accounts` و`eth_sendTransaction` و`personal_*` ما تعمل عليه. ونقطة نهاية تجيب عنها هي نقطة نهاية تحتفظ بأموال أحدهم.

مسار المعاملة الموقّعة هو: ابنِها محليًا، ووقّعها محليًا، ثم أرسل البايتات الموقّعة عبر `eth_sendRawTransaction`. وكل مكتبة تفعل ذلك عنك متى أعطيتها محفظة بدل مزوّد مجرد.

## ملاحظات عملية

- لا تستطلع مع كل إعادة رسم. قراءات السلسلة استدعاءات شبكية؛ خزّنها بضع ثوانٍ وشارك طلبًا واحدًا قيد التنفيذ بين المستدعين الذين يصلون معًا.
- اقرأ معرّف السلسلة مرة واحدة عند الإقلاع وافشل بصوت عالٍ عند عدم التطابق، لا مع كل استدعاء.
- عامل القراءة الفاشلة على أنها فاشلة لا على أنها صفر. فرصيد يُعرض صفرًا لأن الطلب انتهت مهلته أسوأ من رصيد يُعرض كخطأ.
- لا تثبّت أسعار الغاز في الشيفرة. اطلب بيانات الرسوم وقت الإرسال؛ انظر [كيف تعمل الرسوم هنا](/blog/nura-chain-evm-compatibility).

## أسئلة متكررة

### هل هناك حد للمعدل؟

اعتبر أي نقطة نهاية عامة محدودة المعدل سواء أعلنت رقمًا أم لا، وصمّم على هذا الأساس: تخزين مؤقت، وتجميع، وتراجع عند الفشل. فالتطبيق الذي يطرق نقطة نهاية مشتركة مع كل ضغطة مفتاح سيُخنق في مكان ما عاجلًا أو آجلًا، وهذا تصرف معقول من مشغّل.

### هل أستطيع استخدام WebSockets أو الاشتراكات؟

اختبر بدل أن تفترض. إن لم تكن `eth_subscribe` متاحة، فاستطلاع `eth_blockNumber` على فترة معقولة هو البديل المحمول، وهو ما تنتهي إليه معظم التطبيقات على أي حال.

### لماذا لا تُؤكَّد معاملتي أبدًا؟

السبب المعتاد سعر غاز مثبت بقي من قالب قديم وصار دون رسوم الأساس الحالية. اقرأ بيانات الرسوم وقت الإرسال بدلًا من ذلك.

### هل أستطيع تشغيل عقدتي الخاصة؟

لا شيء هنا يتوقف على استخدام نقطة نهاية مستضافة. فالتطبيق الذي يقرأ من عقدتك لا يحتاج سوى عنوان URL مختلف، وهذه بالضبط الخاصية التي تجعل هذه البنية تستحق العناء.

## إلى أين تذهب بعد ذلك

بعد أن صارت القراءة تعمل، فالخطوة التالية هي الكتابة: [نشر عقد ذكي على نورا تشين](/blog/deploy-a-smart-contract-on-nura-chain) يغطي إعداد Hardhat وFoundry بناءً على القيم أعلاه.

ولتأكيد ما استقر فعلًا على السلسلة، فإن [كيف تستخدم مستكشف نورا تشين](/blog/how-to-use-nura-chain-explorer) هو المقال المرافق. وإن وصلت إلى هنا دون سياق، فابدأ من [ما هي نورا تشين](/blog/what-is-nura-chain).
