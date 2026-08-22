कोई प्रोग्राम ब्लॉकचेन के साथ जो कुछ करता है, वह सब एक RPC एंडपॉइंट से होकर जाता है। यह Nura Chain का एंडपॉइंट है: यह क्या करता है, क्या नहीं करता, और सामान्य लाइब्रेरियों को इस पर कैसे मोड़ें।

## एंडपॉइंट

```text
https://rpc.nurachain.net
```

यह HTTPS POST पर Ethereum JSON-RPC बोलता है और चेन आईडी `1020` का है। यह दूसरा मान यहाँ से नहीं, एंडपॉइंट से पढ़िए:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_chainId","params":[]}'
```

`0x3fc` का अर्थ 1020 है। नीचे हर लाइब्रेरी को यह संख्या स्पष्ट रूप से दी गई है, और यह जानबूझकर है: जिस क्लाइंट को पता हो कि वह किस चेन की अपेक्षा रखता है, वह एंडपॉइंट के असहमत होने पर आगे बढ़ने से इनकार करेगा — और इससे ग़लत नेटवर्क पर चुपचाप हुई तैनाती, शुरुआत में ही एक त्रुटि बन जाती है।

## बिना कुछ इंस्टॉल किए पहला अनुरोध

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_blockNumber","params":[]}'
```

परिणाम दशमलव संख्याओं के बजाय हेक्स मात्राओं के रूप में लौटते हैं, और यही बात लोगों को लगातार चौंकाती है। `0x3aecc` का अर्थ 241,356 है। हर क्लाइंट लाइब्रेरी यह रूपांतरण आपके लिए करती है; सादा `curl` नहीं करता।

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

नेटवर्क को दूसरे तर्क के रूप में देना दो काम करता है: पहली बार में `eth_chainId` की एक आवाजाही बचाता है, और यदि एंडपॉइंट कोई और चेन बताए तो प्रोवाइडर को त्रुटि फेंकने पर मजबूर करता है। दूसरा वाला ही असल में पाने लायक है।

## viem

viem को एक chain ऑब्जेक्ट चाहिए, और यह हर मान को एक ही घोषणा में रखने की अच्छी जगह है:

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

यही `nura` ऑब्जेक्ट आप आगे wagmi को और viem के wallet client को सौंपते हैं।

## web3.py

```python
from web3 import Web3

w3 = Web3(Web3.HTTPProvider("https://rpc.nurachain.net"))

assert w3.eth.chain_id == 1020, "not the chain you think you are on"
print(w3.eth.block_number)
```

वह assert लिखने में तीन सेकंड लगते हैं और इसने इस लेख की किसी भी दूसरी पंक्ति से ज़्यादा तैनातियाँ बचाई हैं।

## ब्राउज़र से पढ़ना

एंडपॉइंट उदार CORS हेडर भेजता है, इसलिए कोई पेज अपने प्रॉक्सी के बिना सीधे इसे बुला सकता है:

```javascript
const response = await fetch('https://rpc.nurachain.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
});

const { result } = await response.json();
```

यह किसकी अनुमति देता है, इस पर स्पष्ट रहिए। पढ़ने वाली कॉल ब्राउज़र से चलती हैं। जिस भी चीज़ को निजी कुंजी चाहिए वह इस एंडपॉइंट से गुज़रती ही नहीं — वह उपयोगकर्ता के वॉलेट से गुज़रती है, जो पूरी तरह अलग रास्ता है और [Nura Chain पर dApp बनाना](/blog/build-a-dapp-on-nura-chain) का विषय है।

## जो मेथड जानबूझकर अस्वीकृत हैं

किसी सार्वजनिक एंडपॉइंट से खाते माँगिए, वह मना कर देता है:

```json
{"error":{"code":-32000,"message":"account unlock with HTTP access is forbidden"}}
```

यह सही व्यवहार है, कोई अनुपस्थित सुविधा नहीं। एक सार्वजनिक RPC नोड आपकी ओर से कोई कुंजी नहीं रखता, इसलिए `eth_accounts`, `eth_sendTransaction` और `personal_*` के पास काम करने को कुछ है ही नहीं। जो एंडपॉइंट इनका उत्तर देता, वह किसी के धन की अभिरक्षा कर रहा होता।

हस्ताक्षरित ट्रांज़ैक्शन का रास्ता यह है: उसे स्थानीय रूप से बनाइए, स्थानीय रूप से हस्ताक्षर कीजिए, और हस्ताक्षरित बाइट्स `eth_sendRawTransaction` से भेजिए। जैसे ही आप किसी लाइब्रेरी को सादे प्रोवाइडर के बजाय वॉलेट देते हैं, वह यह सब आपके लिए कर देती है।

## व्यावहारिक बातें

- हर रेंडर पर पोल मत कीजिए। चेन पढ़ना नेटवर्क कॉल है; उन्हें कुछ सेकंड कैश कीजिए और साथ आने वाले कॉलरों के बीच एक ही चालू अनुरोध साझा कीजिए।
- चेन आईडी एक बार शुरुआत में पढ़िए और मेल न खाने पर ज़ोर से विफल होइए, हर कॉल पर नहीं।
- विफल पठन को विफल मानिए, शून्य नहीं। अनुरोध टाइमआउट होने के कारण 0 दिखता बैलेंस, त्रुटि दिखाने वाले बैलेंस से बुरा है।
- गैस मूल्य कोड में मत जड़िए। भेजते समय शुल्क डेटा माँगिए; [यहाँ शुल्क कैसे काम करते हैं](/blog/nura-chain-evm-compatibility) देखिए।

## आम सवाल

### क्या कोई दर सीमा है?

किसी भी सार्वजनिक एंडपॉइंट को दर-सीमित मानिए, चाहे उसने कोई संख्या घोषित की हो या नहीं, और उसी के लिए डिज़ाइन कीजिए: कैश, बैचिंग और विफलता पर पीछे हटना। जो ऐप्लिकेशन हर कीस्ट्रोक पर साझा एंडपॉइंट पर हथौड़े मारता है, वह कहीं न कहीं थ्रॉटल होगा, और ऑपरेटर का ऐसा करना उचित है।

### क्या मैं WebSockets या सब्सक्रिप्शन इस्तेमाल कर सकता हूँ?

मान लेने के बजाय जाँचिए। अगर `eth_subscribe` उपलब्ध न हो, तो उचित अंतराल पर `eth_blockNumber` पोल करना पोर्टेबल विकल्प है, और वैसे भी अधिकांश ऐप्लिकेशन यही अपनाते हैं।

### मेरा ट्रांज़ैक्शन कभी पुष्ट क्यों नहीं होता?

आम कारण किसी टेम्पलेट से बचा हुआ जड़ा हुआ गैस मूल्य है, जो मौजूदा बेस फ़ी से नीचे है। इसके बजाय भेजते समय शुल्क डेटा पढ़िए।

### क्या मैं अपना नोड चला सकता हूँ?

यहाँ कुछ भी होस्टेड एंडपॉइंट पर निर्भर नहीं है। आपके अपने नोड से पढ़ने वाले ऐप्लिकेशन को बस एक अलग URL चाहिए, और यही वह गुण है जो इस वास्तुकला को सार्थक बनाता है।

## आगे कहाँ जाएँ

पठन चलने के बाद अगला क़दम लिखना है: [Nura Chain पर स्मार्ट कॉन्ट्रैक्ट तैनात करना](/blog/deploy-a-smart-contract-on-nura-chain) ऊपर दिए मानों पर बनी Hardhat और Foundry की कॉन्फ़िगरेशन शामिल करता है।

चेन पर वास्तव में क्या पहुँचा, इसकी पुष्टि के लिए [Nura Chain एक्सप्लोरर कैसे इस्तेमाल करें](/blog/how-to-use-nura-chain-explorer) साथी लेख है। और अगर आप बिना संदर्भ के यहाँ आए हैं, तो [Nura Chain क्या है](/blog/what-is-nura-chain) शुरू करने की जगह है।
