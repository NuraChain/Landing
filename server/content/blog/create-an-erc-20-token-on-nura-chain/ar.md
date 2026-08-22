رمز ERC-20 ليس نوعًا خاصًا من الأصول تعرفه السلسلة. إنه عقد ذكي عادي يحتفظ بخريطة من العنوان إلى الرصيد ويُتيح مجموعة متفقًا عليها من الدوال. وكل ما عداه — ظهوره في المحافظ، وإدراجه في المنصات، وفهرسته في المستكشفات — ينبع من تنفيذ تلك الواجهة تنفيذًا صحيحًا.

يمر هذا المقال بكتابة واحد، ونشره على نورا تشين، وبالجزء الذي يسبب أكبر الخسائر الفعلية: الخانات العشرية.

## ما الذي يحدده ERC-20 فعلًا

حفنة دوال وحدثان:

```solidity
function totalSupply() external view returns (uint256);
function balanceOf(address account) external view returns (uint256);
function transfer(address to, uint256 amount) external returns (bool);
function allowance(address owner, address spender) external view returns (uint256);
function approve(address spender, uint256 amount) external returns (bool);
function transferFrom(address from, address to, uint256 amount) external returns (bool);

event Transfer(address indexed from, address indexed to, uint256 value);
event Approval(address indexed owner, address indexed spender, uint256 value);
```

أما `name()` و`symbol()` و`decimals()` فاختيارية في المعيار لكنها متوقعة عالميًا — والمحفظة التي لا تجد رمزًا تعرضه ستعرض العنوان بدلًا منه.

وحدث `Transfer` هو ما يجعل الرمز مرئيًا. فالمستكشفات لا تمسح التخزين، بل تفهرس الأحداث. والعقد الذي ينقل الأرصدة دون إصدار `Transfer` رمز لا يستطيع شيء رؤيته.

## العقد

لا تكتب الحساب بنفسك. استخدم تنفيذًا مُراجَعًا:

```bash
npm install @openzeppelin/contracts
```

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ExampleToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Example Token", "EXM") {
        _mint(msg.sender, initialSupply);
    }
}
```

هذا رمز كامل وعامل. وينبغي مقاومة إغراء إضافة السك والإيقاف والقوائم السوداء ورسوم التحويل حتى تستطيع أن تحدد بدقة من يُسمح له باستدعاء كل واحدة منها، لأن كل صلاحية مضافة هي طريقة مضافة لانتزاع الرمز من حامليه.

## الخانات العشرية هي ما يعضّ

`decimals()` بيانات وصفية للعرض. لا تؤثر في الحساب. فالعقد يخزّن أعدادًا صحيحة، و`decimals` تخبر الواجهات أين تضع الفاصلة.

مع الـ 18 المتعارف عليها:

```text
1 token        = 1000000000000000000
0.5 token      =  500000000000000000
```

ومن ثم فإن سكّ «مليون رمز» يعني:

```solidity
_mint(msg.sender, 1_000_000 * 10 ** 18);
```

وتمرير `1_000_000` بدلًا من ذلك يسكّ جزءًا من مليون من جزء من مليون من الرمز، والخطأ غير مرئي حتى تعرضه محفظة.

والفخ هو افتراض أن الرمز يدل على عدد الخانات. وهو لا يدل، ولنورا تشين مثال حي. فعقد USDT المجسور هنا يبلّغ عن 18 خانة عشرية:

```bash
cast call 0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC "decimals()(uint8)" \
  --rpc-url https://rpc.nurachain.net
```

بينما يستخدم USDT على إيثريوم 6. الرمز نفسه، وعدد خانات مختلف، وعقد مختلف على سلسلة مختلفة. وأي تكامل يثبّت في شيفرته أن «USDT تعني 6 خانات» يخطئ هنا بمعامل تريليون. اقرأ دائمًا `decimals()` من العقد الذي تخاطبه فعليًا.

## النشر

الإعداد هو نفسه الوارد في [نشر عقد ذكي على نورا تشين](/blog/deploy-a-smart-contract-on-nura-chain) — معرّف السلسلة `1020`، وRPC على `https://rpc.nurachain.net`. ولا يختلف سكربت النشر إلا بتمرير وسيط للمُنشئ:

```javascript
import { ethers } from 'hardhat';

async function main() {
    const supply = ethers.parseUnits('1000000', 18);
    const token = await ethers.deployContract('ExampleToken', [supply]);

    await token.waitForDeployment();

    console.log('token at', await token.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
```

`parseUnits` موجودة كي لا تكتب الأصفار بيدك أبدًا. استخدمها.

وبعدها تأكد أن العقد يجيب بوصفه رمزًا لا بوصفه موجودًا فحسب:

```bash
cast call 0xYourToken "symbol()(string)"      --rpc-url https://rpc.nurachain.net
cast call 0xYourToken "totalSupply()(uint256)" --rpc-url https://rpc.nurachain.net
```

## جعل المحفظة تعرضه

المحافظ لا تكتشف الرموز تلقائيًا. فالحامل يضيف عنوان العقد مرة واحدة، تحت «استيراد رمز» أو ما شابه، ثم تقرأ المحفظة `symbol` و`decimals` من العقد نفسه.

وإن لم تكن محفظتك موجّهة إلى هذه الشبكة أصلًا، فإن [إضافة نورا تشين إلى محفظتك](/blog/add-nura-chain-to-your-wallet) تأتي أولًا.

## رمزان ERC-20 موجودان بالفعل على هذه السلسلة

يستحق أن تنظر إلى رموز حقيقية لا إلى رمزك وحده. وكلا هذين عقدا ERC-20 عاديان منشوران على نورا تشين، يمثلان أصولًا مجسورة:

```text
Bridge BNB    0xD4221Ad9772BF5bA7423a044bBBEe6af2154A5Fc
Bridge USDT   0x4E0DB0B1Da408faF5637202CF48b0bc7733bE6dC
```

استعلم عنهما بالطريقة نفسها التي استعلمت بها عن رمزك، أو افتحهما في [مستكشف نورا](https://explorer.nurachain.net). وهما مفيدان تحديدًا لأنهما ليسا أمثلة كُتبت لأجل درس — فهما يجيبان عن `name()` و`symbol()` و`decimals()` و`totalSupply()` كأي رمز آخر، وهذا هو مغزى وجود معيار.

## أخطاء تكلّف مالًا

- **السكّ دون إزاحة الخانات العشرية**، كما سبق.
- **افتراض أن الرمز يدل على الخانات.** اقرأ `decimals()`. في كل مرة.
- **الثقة بالرمز.** يستطيع أي أحد نشر عقد يسمي نفسه `USDT`. الهوية هي العنوان؛ أما الاسم فلافتة اختارها الناشر.
- **الإبقاء على مالك يستطيع السكّ.** فصلاحية سكّ غير محدودة تعني أن المعروض هو ما يقوله حامل المفتاح. إن أبقيتها فأعلن ذلك، وإن لم تحتجها فتنازل عنها.
- **إرسال الرموز إلى عقد الرمز نفسه.** زلة شائعة، وغير قابلة للاسترداد عادة.

## أسئلة متكررة

### هل عليّ تسجيل الرمز في مكان ما؟

لا. فنشره هو إعلانه. وتقرؤه المحافظ والمستكشفات من السلسلة. أما الإدراج في أي خدمة طرف ثالث فهو إجراء تلك الخدمة.

### هل أستطيع تغيير المعروض لاحقًا؟

فقط إن كان في العقد دالة سكّ أو حرق أدرجتها عمدًا. والمثال أعلاه لا يملكها: معروضه ثابت عند الإنشاء، وهو الافتراض الأمين.

### كم يكلّف تشغيل الرمز؟

النشر يكلّف غازًا مرة واحدة. وبعدها يكلّف كل تحويل غازًا يدفعه من يرسله — بـ NURA لا برمزك.

### هل أكتب ERC-20 من الصفر بنفسي؟

ليس لشيء يحمل قيمة. فالواجهة صغيرة بما يكفي لتبدو بسيطة، وذات حواف حادة بما يكفي (قيم الإرجاع، وسباق allowance، والخانات العشرية) ليكون التنفيذ المُراجَع هو الافتراض الصحيح.

## إلى أين تذهب بعد ذلك

لوضع واجهة عاملة أمام الرمز، انظر [بناء تطبيق لامركزي على نورا تشين](/blog/build-a-dapp-on-nura-chain)، وهو يغطي ربط المحفظة وإرسال المعاملات من صفحة.

ولمتابعة التحويلات وهي تحدث، يشرح [كيف تستخدم مستكشف نورا تشين](/blog/how-to-use-nura-chain-explorer) قراءة سجل أحداث الرمز. ولآلية العمل تحت ذلك كله، انظر [كيف تُشغّل نورا تشين بايت كود EVM](/blog/nura-chain-evm-compatibility).
