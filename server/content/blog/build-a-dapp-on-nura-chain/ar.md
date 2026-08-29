التطبيق اللامركزي تطبيق ويب عادي بخاصية واحدة غير عادية: إنه لا يحتفظ بمفتاح المستخدم أبدًا. يقرأ من سلسلة، وحين يريد تغيير شيء يطلب من محفظة أن توقّع. وكل ما يلي ينبع من هذا الفصل.

## النصفان

القراءة والكتابة مساران منفصلان، والخلط بينهما أشيع خطأ بنيوي.

**القراءة** تمر عبر اتصال RPC الخاص بك. لا تحتاج محفظة، وتعمل قبل أن يتصل أحد، وينبغي أن ترسم أكبر قدر ممكن من واجهتك. الأرصدة وحالة العقود والأسعار والسجل — كلها عامة.

**الكتابة** تمر عبر محفظة المستخدم. تحتاج موافقته، ويمكن أن تُرفَض، وهي الجزء الوحيد الذي يحتاج اتصالًا أصلًا.

ابنِ مسار القراءة أولًا. فالتطبيق الذي يعرض صفحة فارغة حتى يتصل أحدهم هو تطبيق يعرض صفحة فارغة لكل من يقيّم ما إذا كان سيتصل.

## القراءة

استخدم عميلًا عامًا موجّهًا إلى نقطة النهاية، تمامًا كما في [الاتصال بنقطة RPC في نورا تشين](/blog/connect-to-nura-chain-rpc):

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

export const publicClient = createPublicClient({ chain: nura, transport: http() });
```

هذا الكائن هو التعريف الوحيد للشبكة في التطبيق كله. استورده في كل مكان بدل تكرار القيم.

## ربط المحفظة

تحقن محفظة المتصفح مزوّدًا وفق EIP-1193. أما آلية الاكتشاف الحديثة فهي EIP-6963، التي تعلن عن كل محفظة مثبّتة بدل التنازع على متغيّر عام واحد — وتستحق الاستخدام إن كان يُحتمل وجود أكثر من محفظة. وأبسط صورة:

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

استدعِ هذا من نقرة، لا عند تحميل الصفحة. فالتطبيق الذي يفتح نافذة المحفظة لحظة فتح الصفحة تطبيق يغلقه المستخدمون.

## إيصالهم إلى الشبكة الصحيحة

هذه هي الخطوة التي تتخطاها معظم الأدلة، وهنا يتعثر المستخدمون الحقيقيون. فالمحفظة المتصلة قد تكون على أي سلسلة. اطلب منها التبديل، وعالج الحالة التي لم تسمع فيها بنورا تشين قط:

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
                    chainName: 'Nura Chain',
                    nativeCurrency: { name: 'Nura', symbol: 'NURA', decimals: 18 },
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

`0x3fc` هي 1020 بالنظام الست عشري، والمحافظ تريد الصيغة الست عشرية. وفرع `4902` هو ما يحوّل «لا يحدث شيء عند النقر» إلى تجربة أولى ناجحة — وهو الطلب نفسه الموصوف في [إضافة نورا تشين إلى محفظتك](/blog/add-nura-chain-to-your-wallet)، لكن تصدره صفحتك بدل أن يفعله المستخدم يدويًا.

وأنصت للتغيّرات أيضًا، لأن المستخدم قد يبدّل الشبكة أو الحساب من وراء ظهرك:

```javascript
provider.on('chainChanged', () => window.location.reload());
provider.on('accountsChanged', (accounts) => setAccount(accounts[0] ?? null));
```

إعادة التحميل عند `chainChanged` فظّة لكنها صحيحة: تضمن ألا تبقى أي حالة قديمة خاصة بسلسلة.

## إرسال معاملة

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

لاحظ أمرين. عميل المحفظة يرسل، والعميل العام ينتظر. وإيصال حالته `reverted` معاملة حدثت وكلّفت غازًا ولم تفعل المطلوب — واعتبارها نجاحًا خطأ سيعثر عليه المستخدمون.

## الحالات التي تقع فعلًا

عالج هذه كلها، فكل واحدة منها تتكرر:

- **لا محفظة مثبّتة.** اعرض رابطًا، لا زرًا معطلًا.
- **رُفض الاتصال.** قال المستخدم لا. عُد إلى حالة عدم الاتصال بهدوء، ولا تعاود الطلب.
- **الشبكة الخطأ.** اعرض زر تبديل بدل رسالة خطأ. هذا أكبر مصدر منفرد لارتباك المستخدمين.
- **رُفضت المعاملة في المحفظة.** ليست حالة خطأ. امسح حالة الانتظار وامضِ.
- **قيد الانتظار.** اعرض الهاش ورابطًا إلى [مستكشف نورا](https://explorer.nurachain.net) ليتابعوا بأنفسهم.
- **ارتدّت.** قل ذلك صراحةً. فـ«فشلت المعاملة» مع الهاش أفضل من مؤشر دوّار لا يتوقف.

## ما لا ينبغي فعله

- **لا تطلب مفتاحًا خاصًا.** أبدًا ولأي سبب. فالتطبيق الذي يطلبه لا يُميَّز عن صفحة تصيّد.
- **لا تطلب موافقات رموز غير محدودة افتراضيًا.** وافق على المقدار المطلوب فعلًا. وإن اضطررت إلى بدل كبير، فقل ذلك في الواجهة.
- **لا تثق بمعرّف سلسلة مأخوذ من الحالة.** اقرأه من المزوّد قبل إرسال أي شيء مهم.
- **لا تحجز الواجهة كلها رهينة اتصال محفظة.** انظر القسم الأول.
- **لا تستطلع السلسلة مع كل إعادة رسم.** خزّن القراءات وشارك الطلبات قيد التنفيذ.

## أسئلة متكررة

### هل أحتاج خادمًا خلفيًا؟

ليس للقراءة من السلسلة ولا للكتابة إليها — فكلاهما يمر مباشرةً من المتصفح، وهو ما يتيحه CORS المتساهل في نقطة النهاية. أما الخادم الخلفي فتحتاجه لما تُتقنه السلاسل بصعوبة: البحث والتجميع والبيانات خارج السلسلة.

### هل أستطيع استخدام wagmi أو RainbowKit؟

نعم. مرّر إليهما تعريف السلسلة نفسه من المقتطف الأول. فهما يغلّفان في الأغلب منطق الاتصال وتبديل الشبكة الموضّح أعلاه، ويستحق أن تفهمه مرة قبل أن تفوّضه.

### كيف أعرض أرصدة الرموز؟

استدعِ `balanceOf` على عقد الرمز ونسّق باستخدام `decimals()` الخاص به. لا تفترض عدد الخانات أبدًا — ويشرح [إنشاء رمز ERC-20 على نورا تشين](/blog/create-an-erc-20-token-on-nura-chain) لماذا يكون هذا الافتراض مكلفًا هنا تحديدًا.

### كيف أختبر دون أن أنفق شيئًا؟

مسارات القراءة لا تحتاج أموالًا إطلاقًا. أما للكتابة فاستخدم حسابًا قابلًا للإهمال برصيد صغير، وأكّد كل نتيجة على المستكشف.

## إلى أين تذهب بعد ذلك

إن لم تنشر بعد العقد الذي ستخاطبه واجهتك، فابدأ من [نشر عقد ذكي على نورا تشين](/blog/deploy-a-smart-contract-on-nura-chain).

ولتأكيد ما فعله تطبيقك فعلًا، فإن [كيف تستخدم مستكشف نورا تشين](/blog/how-to-use-nura-chain-explorer) هو الأداة المناسبة. ولأساسيات الشبكة خلف ذلك كله، انظر [ما هي نورا تشين](/blog/what-is-nura-chain).
