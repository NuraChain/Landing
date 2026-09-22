import type { Article } from '../types.ts';

/**
 * Real-world assets, with the numbers stated as of a date and the mechanism stated plainly.
 *
 * Primary keyword: "tokenized treasuries". Every figure here is somebody else's measurement
 * and is dated in the body for that reason. The section that earns the page is the one
 * separating the token from the claim - the same distinction the stablecoin article draws.
 */
export const article: Article = {
    slug: 'tokenized-treasuries-rwa-2026',
    tags: ['rwa', 'tokenomics', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-18T08:00:00.000Z',
    updatedAt: '2026-09-18T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Tokenized Treasuries: What the RWA Numbers Really Say',
            summary: 'Real-world assets onchain passed $37bn in 2026, and treasuries are most of it. What a '
                + 'tokenized bond actually is, and where the trust in it sits.'
        },
        fa: {
            title: 'اوراق خزانه توکنی: اعداد RWA واقعاً چه می‌گویند',
            summary: 'دارایی‌های دنیای واقعی روی زنجیره در ۲۰۲۶ از ۳۷ میلیارد دلار گذشت و بیشترش اوراق خزانه '
                + 'است. یک اوراق توکنی‌شده واقعاً چیست و اعتماد به آن کجا نشسته است.'
        },
        ar: {
            title: 'سندات الخزانة المرمّزة: ماذا تقول أرقام RWA فعلًا',
            summary: 'تجاوزت أصول العالم الحقيقي على السلسلة 37 مليار دولار في 2026، ومعظمها سندات خزانة. ما '
                + 'هو السند المرمّز فعليًا، وأين تقع الثقة فيه.'
        },
        es: {
            title: 'Bonos del Tesoro tokenizados: qué dicen las cifras RWA',
            summary: 'Los activos del mundo real en cadena superaron los 37.000 millones en 2026 y el Tesoro '
                + 'es la mayor parte. Qué es de verdad un bono tokenizado y dónde reside la confianza.'
        },
        pt: {
            title: 'Tesouros tokenizados: o que os números de RWA dizem',
            summary: 'Os ativos do mundo real on-chain passaram de US$ 37 bilhões em 2026, e os tesouros são a '
                + 'maior parte. O que é de fato um título tokenizado e onde mora a confiança nele.'
        },
        hi: {
            title: 'टोकनाइज़्ड ट्रेज़री: RWA के आँकड़े असल में क्या कहते हैं',
            summary: '2026 में ऑनचेन वास्तविक-दुनिया परिसंपत्तियाँ 37 अरब डॉलर पार कर गईं और अधिकांश हिस्सा '
                + 'ट्रेज़री का है। टोकनाइज़्ड बॉन्ड वास्तव में क्या है, और उस पर भरोसा कहाँ टिका है।'
        },
        zh: {
            title: '代币化国债：RWA 的数字究竟说明了什么',
            summary: '2026 年链上真实世界资产突破 370 亿美元，其中大部分是国债。一张代币化债券到底是什么，对它的信任又究竟落在哪里。'
        },
        ru: {
            title: 'Токенизированные казначейские бумаги: о чём цифры RWA',
            summary: 'Реальные активы в сети превысили 37 млрд долларов в 2026 году, и большая часть — '
                + 'казначейские бумаги. Чем на самом деле является токенизированная облигация.'
        },
        fr: {
            title: 'Bons du Trésor tokenisés : ce que disent les chiffres RWA',
            summary: 'Les actifs du monde réel en chaîne ont dépassé 37 milliards de dollars en 2026, surtout '
                + "du Trésor. Ce qu'est réellement une obligation tokenisée et où se loge la confiance."
        },
        tr: {
            title: 'Tokenlaştırılmış tahviller: RWA rakamları ne diyor',
            summary: "Zincir üzerindeki gerçek dünya varlıkları 2026'da 37 milyar doları aştı ve büyük kısmı "
                + 'hazine kâğıdı. Tokenlaştırılmış bir tahvil gerçekte nedir ve güven nerede duruyor.'
        }
    }
};
