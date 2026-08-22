import type { Article } from '../types.ts';

/**
 * The cluster's hub page.
 *
 * Primary keyword: "Nura Chain". Informational intent - somebody who has heard the name and
 * wants to know what it is. It links OUT to every other article in the cluster and is linked
 * back to from most of them, which is what makes it the page an engine treats as the topic's
 * centre rather than one of eleven siblings.
 */
export const article: Article = {
    slug: 'what-is-nura-chain',
    tags: ['nura-chain', 'evm', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    // Carried over from the sqlite the store used to keep these in, not invented here:
    // these are the timestamps the cluster was actually published and last revised under.
    publishedAt: '2026-08-22T00:40:57.000Z',
    updatedAt: '2026-08-22T01:53:27.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'What Is Nura Chain? An EVM Network Explained',
            summary: 'Nura Chain is a public EVM blockchain with chain ID 1020. What the network is, '
                + 'the values you need to connect, and what runs on it today.'
        },
        fa: {
            title: 'نورا چین چیست؟ آشنایی با یک شبکه سازگار با EVM',
            summary: 'نورا چین یک بلاک‌چین عمومی سازگار با EVM با شناسه زنجیره ۱۰۲۰ است. شبکه چیست، '
                + 'برای اتصال چه مقادیری لازم است، و امروز چه چیزی روی آن اجرا می‌شود.'
        },
        ar: {
            title: 'ما هي نورا تشين؟ شرح شبكة متوافقة مع EVM',
            summary: 'نورا تشين بلوكتشين عامة متوافقة مع EVM بمعرّف سلسلة 1020. ما هي الشبكة، وما القيم '
                + 'اللازمة للاتصال بها، وما الذي يعمل عليها اليوم.'
        },
        es: {
            title: '¿Qué es Nura Chain? Una red EVM explicada',
            summary: 'Nura Chain es una blockchain pública compatible con EVM, con ID de cadena 1020. Qué '
                + 'es la red, qué valores necesitas para conectarte y qué funciona hoy sobre ella.'
        },
        pt: {
            title: 'O que é a Nura Chain? Uma rede EVM explicada',
            summary: 'A Nura Chain é uma blockchain pública compatível com EVM, com ID de cadeia 1020. O que '
                + 'é a rede, os valores para se conectar e o que roda nela hoje.'
        },
        hi: {
            title: 'Nura Chain क्या है? एक EVM नेटवर्क की व्याख्या',
            summary: 'Nura Chain चेन आईडी 1020 वाली सार्वजनिक EVM ब्लॉकचेन है। नेटवर्क क्या है, जुड़ने के लिए '
                + 'कौन-से मान चाहिए, और आज इस पर क्या चल रहा है।'
        },
        zh: {
            title: '什么是 Nura Chain？一条 EVM 网络详解',
            summary: 'Nura Chain 是链 ID 为 1020 的公共 EVM 区块链。这条网络是什么、连接需要哪些参数，'
                + '以及今天有哪些东西在上面运行。'
        },
        ru: {
            title: 'Что такое Nura Chain? Разбор EVM-сети',
            summary: 'Nura Chain — публичный EVM-блокчейн с chain ID 1020. Что представляет собой сеть, какие '
                + 'значения нужны для подключения и что работает на ней сегодня.'
        },
        fr: {
            title: "Qu'est-ce que Nura Chain ? Un réseau EVM expliqué",
            summary: 'Nura Chain est une blockchain publique compatible EVM, chain ID 1020. Ce qu\'est le '
                + "réseau, les valeurs pour s'y connecter et ce qui y tourne aujourd'hui."
        },
        tr: {
            title: 'Nura Chain Nedir? Bir EVM Ağının Açıklaması',
            summary: 'Nura Chain, zincir kimliği 1020 olan herkese açık bir EVM blok zinciridir. Ağın ne '
                + 'olduğu, bağlanmak için gereken değerler ve bugün üzerinde çalışanlar.'
        }
    }
};
