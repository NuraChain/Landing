Nura Chain पर तैनात करना यानी किसी EVM नेटवर्क पर तैनात करना, इसलिए औज़ार वही हैं जो आप पहले से जानते हैं। आगे कॉन्फ़िगरेशन है, एक कॉन्ट्रैक्ट, तैनाती का क़दम, और वह हिस्सा जिसे अधिकांश गाइड छोड़ देते हैं — यह पुष्टि कैसे करें कि चीज़ सचमुच चेन पर पहुँची।

## शुरू करने से पहले

तीन चीज़ें।

- फ़ंड वाला खाता। तैनाती एक ट्रांज़ैक्शन है, ट्रांज़ैक्शन गैस लेते हैं, और गैस NURA में चुकाई जाती है। ख़ाली खाता तैनात नहीं कर सकता।
- ऐसी निजी कुंजी जिसे आप एनवायरनमेंट वेरिएबल में रखने को तैयार हों। पहली तैनाती के लिए फेंकने योग्य कुंजी लीजिए, वह नहीं जिसमें आपका बैलेंस है।
- Node.js और Hardhat या Foundry में से कोई एक।

कुंजी कभी कमिट मत कीजिए। नीचे के सभी उदाहरण एनवायरनमेंट से पढ़ते हैं, और उसे रखने वाली फ़ाइल असली कुछ रखने से पहले `.gitignore` में होनी चाहिए।

## Hardhat कॉन्फ़िगरेशन

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

`chainId` वाली पंक्ति सजावट नहीं है। Hardhat उसकी तुलना एंडपॉइंट के बताए से करता है और अलग होने पर आगे बढ़ने से इनकार कर देता है — यही वह जाँच है जो तैनाती को उस नेटवर्क पर जाने से रोकती है जिसका आपका इरादा नहीं था।

Solidity संस्करण के बारे में: उपलब्ध नवीनतम रिलीज़ के बजाय किसी जमे-जमाए लक्ष्य के लिए संकलित कीजिए। नया कंपाइलर जो डिफ़ॉल्ट रूप से ऐसे EVM संस्करण को लक्ष्य बनाए जिसे नेटवर्क ने नहीं अपनाया, वह ऐसा बाइटकोड बनाता है जो तैनात तो होता है फिर अजीब बर्ताव करता है — यह कंपाइल त्रुटि से कहीं बुरी विफलता है।

## तैनात करने लायक कॉन्ट्रैक्ट

कुछ ऐसा जिसमें स्थिति हो, ताकि जानने का रास्ता रहे कि यह चलता है:

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

वह इवेंट अगले भाग के लिए मायने रखता है: इवेंट ही वह चीज़ हैं जिन्हें एक्सप्लोरर अनुक्रमित करता है, इसलिए इवेंट उत्सर्जित करने वाला कॉन्ट्रैक्ट वह है जिसे आप बाहर से सत्यापित कर सकते हैं।

## तैनाती

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

फिर:

```bash
DEPLOYER_KEY=0xyourkey npx hardhat run scripts/deploy.ts --network nura
```

`waitForDeployment` पंक्ति रखिए। इसके बिना स्क्रिप्ट एक पता छापकर ट्रांज़ैक्शन माइन होने से पहले ही बाहर निकल जाती है, और आपके पास ऐसा पता रह जाता है जिस पर कोड हो भी सकता है और नहीं भी।

## पुष्टि कि यह पहुँचा

स्क्रिप्ट का छापा पता एक भविष्यवाणी है, तथ्य नहीं। चेन से पूछिए:

```bash
curl -s https://rpc.nurachain.net -X POST \
  -H 'content-type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"eth_getCode","params":["0xYourContract","latest"]}'
```

तैनात कॉन्ट्रैक्ट एक लंबी हेक्स स्ट्रिंग लौटाता है। `0x` परिणाम का अर्थ है उस पते पर कोई कोड नहीं — तैनाती वापस हुई, गैस ख़त्म हुई, या दूसरे नेटवर्क पर चली गई। यही एक कॉल "यह चला" को "स्क्रिप्ट ने त्रुटि नहीं फेंकी" से अलग करती है, और ये दोनों एक नहीं हैं।

फिर पते को [Nura Explorer](https://explorer.nurachain.net) में खोलिए और ट्रांज़ैक्शन देखिए। [एक्सप्लोरर पढ़ना](/blog/how-to-use-nura-chain-explorer) बताता है कि फ़ील्ड का अर्थ क्या है।

## वही काम Foundry में

```bash
forge create src/Registry.sol:Registry \
  --rpc-url https://rpc.nurachain.net \
  --private-key $DEPLOYER_KEY
```

और बाद में टर्मिनल छोड़े बिना जाँचने के लिए:

```bash
cast code 0xYourContract --rpc-url https://rpc.nurachain.net
cast chain-id --rpc-url https://rpc.nurachain.net
```

दूसरा `1020` छापना चाहिए। इसे आदत बना लीजिए।

## गैस और शुल्क

यहाँ ब्लॉक EIP-1559 बेस फ़ी लेकर चलते हैं, तो `gasPrice` जड़ने के बजाय अपने औज़ार को अनुमान लगाने दीजिए। Hardhat और Foundry दोनों एंडपॉइंट से शुल्क डेटा पढ़ते हैं और डिफ़ॉल्ट रूप से टाइप-2 ट्रांज़ैक्शन बनाते हैं; तैनाती के बिना माइन हुए लटके रहने का आम कारण किसी और प्रोजेक्ट के कॉन्फ़िगरेशन से नक़ल किया जड़ा हुआ गैस मूल्य होता है, जो मौजूदा बेस फ़ी से नीचे बैठा है। इसकी बारीक़ी [Nura Chain EVM बाइटकोड कैसे चलाती है](/blog/nura-chain-evm-compatibility) में है।

## पहचानने लायक विफलताएँ

- **"insufficient funds for gas"।** खाते में NURA नहीं है। पहले फ़ंड कीजिए।
- **"invalid chain id" या नेटवर्क बेमेल।** आपका कॉन्फ़िगरेशन और एंडपॉइंट असहमत हैं। `eth_chainId` पढ़िए और कॉन्फ़िगरेशन ठीक कीजिए।
- **ट्रांज़ैक्शन हमेशा के लिए लंबित।** शुल्क बहुत कम, या उसी खाते पर पहले अटके ट्रांज़ैक्शन से nonce का अंतराल।
- **`eth_getCode` `0x` लौटाता है।** तैनाती सफल नहीं हुई, स्क्रिप्ट ने चाहे जो छापा हो। ट्रांज़ैक्शन रसीद खोजिए और उसकी स्थिति देखिए।

## आम सवाल

### क्या मैं वह कॉन्ट्रैक्ट तैनात कर सकता हूँ जो पहले से दूसरी चेन पर है?

आम तौर पर हाँ, बिना बदलाव, बशर्ते वह उस दूसरी नेटवर्क का कोई पता जड़े हुए न रखता हो और यहाँ मौजूद न होने वाली सेवा पर निर्भर न हो। बाइटकोड स्वयं पोर्टेबल है।

### क्या इसे दूसरी चेन जैसा ही पता मिलेगा?

केवल तब जब आप उसी खाते से उसी nonce पर तैनात करें, क्योंकि कॉन्ट्रैक्ट का पता इन्हीं दोनों से निकलता है। पता जानबूझकर मिलाना हो तो नियतात्मक डिप्लॉयर के साथ `CREATE2` इस्तेमाल कीजिए।

### एक्सप्लोरर पर स्रोत कैसे सत्यापित करूँ?

एक्सप्लोरर का सत्यापन फ़ॉर्म देखिए। सत्यापन पढ़ने वालों की सुविधा है, कॉन्ट्रैक्ट का गुण नहीं, इसलिए कॉन्ट्रैक्ट स्रोत प्रकाशित हो या न हो, एक जैसा ही चलता है।

### क्या अपग्रेड के लिए प्रॉक्सी इस्तेमाल करूँ?

केवल तब जब सचमुच ज़रूरत हो। प्रॉक्सी स्टोरेज-लेआउट के ख़तरे और एक एडमिन कुंजी जोड़ते हैं जो सिस्टम की सबसे मूल्यवान चीज़ बन जाती है। अधिकांश परियोजनाओं के लिए अपरिवर्तनीय कॉन्ट्रैक्ट जिसे दोबारा तैनात किया जा सके, सरल और सुरक्षित है।

## आगे कहाँ जाएँ

अगली स्पष्ट तैनाती एक टोकन है: [Nura Chain पर ERC-20 बनाना और तैनात करना](/blog/create-an-erc-20-token-on-nura-chain) सीधे इसी कॉन्फ़िगरेशन पर बना है।

जो तैनात किया उसके आगे इंटरफ़ेस लगाने के लिए [Nura Chain पर dApp बनाना](/blog/build-a-dapp-on-nura-chain) देखिए। और अगर ऊपर के कनेक्शन विवरण अनजाने लगे, तो [Nura Chain RPC से जुड़ना](/blog/connect-to-nura-chain-rpc) उन्हें ठीक से समझाता है।
