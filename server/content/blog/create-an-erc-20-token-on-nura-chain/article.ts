import type { Article } from '../types.ts';

/**
 * Primary keyword: "ERC-20 Nura Chain". Developer tutorial, one rung above the general deploy
 * guide it links back to rather than repeats.
 *
 * The decimals section is the reason this article earns its place instead of being a paragraph
 * elsewhere: the bridged USDT contract on this chain reports 18 decimals where USDT on Ethereum
 * uses 6, and that is a verifiable, chain-specific fact with money attached to getting it wrong.
 */
export const article: Article = {
    slug: 'create-an-erc-20-token-on-nura-chain',
    tags: ['smart-contracts', 'developers', 'guides'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'How to Create and Deploy an ERC-20 Token on Nura Chain',
            summary: 'Writing an ERC-20, deploying it to chain ID 1020, and the decimals mistake that '
                + 'costs the most — with two live token contracts you can check against.'
        },
        fa: {
            title: 'چگونه یک توکن ERC-20 روی نورا چین بسازیم و مستقر کنیم',
            summary: 'نوشتن یک ERC-20، استقرارش روی شناسه زنجیره ۱۰۲۰، و پرهزینه‌ترین اشتباه اعشار — '
                + 'به‌همراه دو قرارداد توکن زنده که می‌توانید با آنها بسنجید.'
        },
        ar: {
            title: 'كيف تنشئ رمز ERC-20 وتنشره على نورا تشين',
            summary: 'كتابة رمز ERC-20 ونشره على معرّف السلسلة 1020، وخطأ الخانات العشرية الأكثر كلفة — '
                + 'مع عقدَي رمز حيّين يمكنك المقارنة بهما.'
        },
        es: {
            title: 'Cómo crear y desplegar un token ERC-20 en Nura Chain',
            summary: 'Escribir un ERC-20, desplegarlo en el ID de cadena 1020 y el error de decimales que '
                + 'más cuesta, con dos contratos de token en vivo para contrastar.'
        },
        pt: {
            title: 'Como criar e implantar um token ERC-20 na Nura Chain',
            summary: 'Escrever um ERC-20, implantá-lo no ID de cadeia 1020 e o erro de casas decimais que '
                + 'mais custa, com dois contratos de token ao vivo para conferir.'
        },
        hi: {
            title: 'Nura Chain पर ERC-20 टोकन कैसे बनाएँ और तैनात करें',
            summary: 'ERC-20 लिखना, चेन आईडी 1020 पर तैनात करना, और सबसे महँगी दशमलव ग़लती — साथ में दो '
                + 'जीवंत टोकन कॉन्ट्रैक्ट जिनसे आप मिलान कर सकें।'
        },
        zh: {
            title: '如何在 Nura Chain 上创建并部署 ERC-20 代币',
            summary: '编写 ERC-20、部署到链 ID 1020，以及代价最大的小数位错误，'
                + '并附两份可供你实地核对的线上代币合约。'
        },
        ru: {
            title: 'Как создать и развернуть токен ERC-20 в Nura Chain',
            summary: 'Написание ERC-20, развёртывание в сети с chain ID 1020 и самая дорогая ошибка с '
                + 'десятичными знаками — с двумя живыми контрактами токенов для сверки.'
        },
        fr: {
            title: 'Créer et déployer un jeton ERC-20 sur Nura Chain',
            summary: 'Écrire un ERC-20, le déployer sur le chain ID 1020 et l\'erreur de décimales la plus '
                + 'coûteuse, avec deux contrats de jetons en service pour vérifier.'
        },
        tr: {
            title: 'Nura Chain Üzerinde ERC-20 Token Oluşturmak ve Dağıtmak',
            summary: 'Bir ERC-20 yazmak, zincir kimliği 1020 üzerine dağıtmak ve en pahalıya mal olan '
                + 'ondalık hatası — karşılaştırabileceğiniz iki canlı token sözleşmesiyle.'
        }
    }
};
