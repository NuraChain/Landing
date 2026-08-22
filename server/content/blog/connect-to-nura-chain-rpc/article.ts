import type { Article } from '../types.ts';

/**
 * Primary keyword: "Nura Chain RPC". Technical how-to - the reader has a project open and
 * wants a working connection, not a description of the network.
 *
 * The most linked-TO article in the cluster: the deploy, dApp and token guides all assume a
 * reader has been here first, so it carries the endpoint details once rather than repeating
 * them four times and competing with itself.
 */
export const article: Article = {
    slug: 'connect-to-nura-chain-rpc',
    tags: ['rpc', 'developers', 'nura-chain'],
    defaultLocale: 'en',
    status: 'published',

    // Carried over from the sqlite the store used to keep these in, not invented here:
    // these are the timestamps the cluster was actually published and last revised under.
    publishedAt: '2026-08-22T00:40:57.000Z',
    updatedAt: '2026-08-22T01:53:27.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Nura Chain RPC: Connecting Web3 Apps to the Network',
            summary: 'The Nura Chain RPC endpoint and chain ID 1020, with working ethers.js, viem and '
                + 'web3.py setups, browser CORS notes, and the methods it refuses on purpose.'
        },
        fa: {
            title: 'RPC نورا چین: اتصال برنامه‌های وب۳ به شبکه',
            summary: 'نقطه‌پایانی RPC نورا چین با شناسه زنجیره ۱۰۲۰، همراه با نمونه‌های کارآمد ethers.js، '
                + 'viem و web3.py، نکته‌های CORS مرورگر، و متدهایی که عمداً رد می‌شوند.'
        },
        ar: {
            title: 'RPC نورا تشين: ربط تطبيقات ويب3 بالشبكة',
            summary: 'نقطة RPC في نورا تشين ومعرّف السلسلة 1020، مع أمثلة عملية لـ ethers.js وviem وweb3.py، '
                + 'وملاحظات CORS في المتصفح، والدوال التي تُرفض عن قصد.'
        },
        es: {
            title: 'RPC de Nura Chain: conectar aplicaciones Web3',
            summary: 'El endpoint RPC de Nura Chain y el ID de cadena 1020, con ejemplos funcionales de '
                + 'ethers.js, viem y web3.py, notas de CORS y los métodos que rechaza a propósito.'
        },
        pt: {
            title: 'RPC da Nura Chain: conectando aplicações Web3',
            summary: 'O endpoint RPC da Nura Chain e o ID de cadeia 1020, com exemplos funcionais de '
                + 'ethers.js, viem e web3.py, notas de CORS e os métodos que ele recusa de propósito.'
        },
        hi: {
            title: 'Nura Chain RPC: Web3 ऐप्लिकेशन को नेटवर्क से जोड़ना',
            summary: 'चेन आईडी 1020 वाला Nura Chain RPC एंडपॉइंट, ethers.js, viem और web3.py के चालू उदाहरण, '
                + 'ब्राउज़र CORS की बातें, और वे मेथड जो जानबूझकर अस्वीकृत हैं।'
        },
        zh: {
            title: 'Nura Chain RPC：把 Web3 应用接入网络',
            summary: '链 ID 为 1020 的 Nura Chain RPC 端点，含可用的 ethers.js、viem 与 web3.py 配置、'
                + '浏览器 CORS 说明，以及它有意拒绝的方法。'
        },
        ru: {
            title: 'RPC Nura Chain: подключение Web3-приложений',
            summary: 'RPC-эндпоинт Nura Chain и chain ID 1020, рабочие примеры для ethers.js, viem и web3.py, '
                + 'замечания о CORS в браузере и методы, которые он отклоняет намеренно.'
        },
        fr: {
            title: 'RPC Nura Chain : connecter les applications Web3',
            summary: 'Le point de terminaison RPC de Nura Chain et le chain ID 1020, avec des exemples '
                + 'ethers.js, viem et web3.py, les notes CORS et les méthodes refusées à dessein.'
        },
        tr: {
            title: 'Nura Chain RPC: Web3 Uygulamalarını Ağa Bağlamak',
            summary: 'Zincir kimliği 1020 olan Nura Chain RPC uç noktası; çalışan ethers.js, viem ve web3.py '
                + 'örnekleri, tarayıcı CORS notları ve kasten reddedilen metotlar.'
        }
    }
};
