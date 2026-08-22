النشر على نورا تشين هو نشر على شبكة EVM، ولذلك فالأدوات هي الأدوات التي تعرفها أصلًا. وما يلي هو الإعداد، وعقد، وخطوة النشر، ثم الجزء الذي تتخطاه معظم الأدلة: كيف تتأكد أن الشيء استقر فعلًا على السلسلة.

## قبل أن تبدأ

ثلاثة أشياء.

- حساب مموَّل. فالنشر معاملة، والمعاملات تكلّف غازًا، والغاز يُدفع بـ NURA. والحساب الفارغ لا ينشر.
- مفتاح خاص ترضى بوضعه في متغير بيئة. استخدم مفتاحًا قابلًا للإهمال لأول نشر، لا المفتاح الذي يحمل رصيدك.
- Node.js وإما Hardhat أو Foundry.

لا تُودِع مفتاحًا في المستودع أبدًا. كل الأمثلة أدناه تقرأ من البيئة، والملف الذي يحمل المفتاح مكانه `.gitignore` قبل أن يحمل أي شيء حقيقي.

## إعداد Hardhat

```javascript
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
    solidity: {
        version: '0.8.24',
        settings: { optimizer: { enabled: true, runs: 200 } }
    },
    networks: {
        nura: {
            url: 'https://rpc.nurachain.net',
            chainId: 1020,
            accounts: process.env.DEPLOYER_KEY ? [process.env.DEPLOYER_KEY] : []
        }
    }
};

export default config;
```

سطر `chainId` ليس زخرفًا. فـ Hardhat يقارنه بما تبلغه نقطة النهاية ويرفض المتابعة إن اختلفا، وهذا هو التحقق الذي يمنع ذهاب النشر إلى شبكة لم تقصدها.

أما عن إصدار Solidity: صرِّف لهدف راسخ لا لأحدث إصدار متاح. فمصرّف حديث يستهدف افتراضيًا نسخة EVM لم تتبنّها الشبكة ينتج بايت كود يُنشر ثم يتصرف تصرفًا غريبًا، وهو فشل أسوأ بكثير من خطأ تصريف.

## عقد يستحق النشر

شيء له حالة، كي تتوافر طريقة لمعرفة أنه يعمل:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Registry {
    event Recorded(address indexed who, string note);

    mapping(address => string) private notes;

    function record(string calldata note) external {
        notes[msg.sender] = note;
        emit Recorded(msg.sender, note);
    }

    function noteOf(address who) external view returns (string memory) {
        return notes[who];
    }
}
```

الحدث مهم للقسم التالي: فالأحداث هي ما يفهرسه المستكشف، والعقد الذي يُصدر أحداثًا عقد يمكنك التحقق منه من الخارج.

## النشر

```javascript
import { ethers } from 'hardhat';

async function main() {
    const factory = await ethers.getContractFactory('Registry');
    const contract = await factory.deploy();

    await contract.waitForDeployment();

    console.log('deployed to', await contract.getAddress());
    console.log('tx', contract.deploymentTransaction()?.hash);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

ثم:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

أبقِ سطر `waitForDeployment`. فبدونه يطبع السكربت عنوانًا ويخرج قبل تعدين المعاملة، فتبقى بعنوان قد يحمل شيفرة وقد لا يحمل.

## التأكد من أنه استقر

العنوان الذي يطبعه سكربت تنبّؤ لا واقعة. اسأل السلسلة:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

العقد المنشور يعيد سلسلة ست عشرية طويلة. والنتيجة `0x` تعني ألا شيفرة عند ذلك العنوان — فالنشر ارتد، أو نفد غازه، أو ذهب إلى شبكة أخرى. هذا الاستدعاء وحده يفصل «نجح» عن «لم يرمِ السكربت خطأً»، وليسا الشيء نفسه.

ثم افتح العنوان في [مستكشف نورا](https://explorer.nurachain.net) وانظر إلى المعاملة. ويشرح [قراءة المستكشف](/blog/how-to-use-nura-chain-explorer) معنى الحقول.

## الشيء نفسه في Foundry

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

وللتحقق بعدها دون مغادرة الطرفية:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

ينبغي أن يطبع الثاني `1020`. اجعل ذلك عادة.

## الغاز والرسوم

تحمل الكتل هنا رسوم أساس وفق EIP-1559، فدع أدواتك تقدّر بدل تثبيت `gasPrice`. كلٌّ من Hardhat وFoundry يقرأ بيانات الرسوم من نقطة النهاية ويبني معاملة من النوع الثاني افتراضيًا؛ والسبب المعتاد لتعليق نشر دون تعدين هو سعر غاز مثبت مَنقول عن إعداد مشروع آخر، يقبع دون رسوم الأساس الحالية. والتفاصيل في [كيف تُشغّل نورا تشين بايت كود EVM](/blog/nura-chain-evm-compatibility).

## إخفاقات يجدر تمييزها

- **«insufficient funds for gas».** الحساب بلا NURA. موّله أولًا.
- **«invalid chain id» أو عدم تطابق الشبكة.** إعدادك ونقطة النهاية مختلفان. اقرأ `eth_chainId` وأصلح الإعداد.
- **المعاملة معلّقة إلى الأبد.** رسوم منخفضة، أو فجوة nonce من معاملة عالقة سابقة على الحساب نفسه.
- **`eth_getCode` يعيد `0x`.** لم ينجح النشر مهما طبع السكربت. ابحث عن إيصال المعاملة وافحص حالته.

## أسئلة متكررة

### هل أستطيع نشر عقد لديّ على سلسلة أخرى؟

غالبًا نعم، دون تعديل، شريطة ألا يثبّت عنوانًا من تلك الشبكة الأخرى ولا يعتمد خدمة غير موجودة هنا. أما البايت كود نفسه فمحمول.

### هل سيحصل على العنوان نفسه الذي على سلسلة أخرى؟

فقط إن نشرت من الحساب نفسه وعند الـ nonce نفسه، لأن عنوان العقد مشتق من هذين. استخدم `CREATE2` مع ناشر حتمي إن أردت تطابق العنوان عن قصد.

### كيف أوثّق الشيفرة المصدرية على المستكشف؟

راجع نموذج التوثيق في المستكشف. فالتوثيق تيسير للقارئ لا خاصية في العقد، والعقد يعمل بالطريقة نفسها سواء نُشرت مصادره أم لا.

### هل ينبغي أن أستخدم وكيلًا لقابلية الترقية؟

فقط إن كنت تحتاجه فعلًا. فالوكلاء يضيفون مخاطر تخطيط التخزين ومفتاح إدارة يصير أثمن ما في المنظومة. والعقد غير القابل للتغيير الذي يمكنك إعادة نشره أبسط وأأمن لمعظم المشاريع.

## إلى أين تذهب بعد ذلك

النشر التالي البديهي هو رمز: [إنشاء ونشر رمز ERC-20 على نورا تشين](/blog/create-an-erc-20-token-on-nura-chain) مبني مباشرةً على هذا الإعداد.

ولوضع واجهة أمام ما نشرته، انظر [بناء تطبيق لامركزي على نورا تشين](/blog/build-a-dapp-on-nura-chain). وإن كانت تفاصيل الاتصال أعلاه غير مألوفة لك، فإن [الاتصال بنقطة RPC في نورا تشين](/blog/connect-to-nura-chain-rpc) يغطيها كما ينبغي.
