import type { Article } from '../types.ts';

/**
 * The IMF's tokenization chapter of 8 October 2026: a $65.1 billion market, and the warning
 * that speed and automation can amplify a shock.
 *
 * Primary keyword: "IMF tokenization". Every figure is the IMF's own, from Chapter 3 of the
 * October 2026 Global Financial Stability Report, with data as of 31 July 2026; the lines on
 * buffers and scaling paraphrase the IMF blog of the same day, which blocks automated reads. The $37.9 billion comparison is
 * the tokenized-treasuries article's figure, stated as a different measure. Nothing here says
 * Nura Chain carries a tokenized asset.
 */
export const article: Article = {
    slug: 'imf-tokenization-risks-2026',
    tags: ['rwa', 'regulation', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T14:00:00.000Z',
    updatedAt: '2026-10-23T14:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'IMF on Tokenization: A $65 Billion Market With a Catch',
            summary: "The IMF's October 2026 stability report puts tokenized assets at $65.1 billion and "
                + 'warns that instant settlement and automation could amplify shocks. What it found.'
        },
        fa: {
            title: 'IMF درباره توکنی‌سازی: بازاری ۶۵ میلیارد دلاری با یک دام',
            summary: 'گزارش ثبات مالی اکتبر ۲۰۲۶ صندوق بین‌المللی پول دارایی‌های توکنی را ۶۵٫۱ میلیارد دلار '
                + 'می‌داند و هشدار می‌دهد تسویه آنی و خودکارسازی می‌تواند شوک‌ها را تشدید کند.'
        },
        ar: {
            title: 'صندوق النقد والترميز: سوق بـ65 مليار دولار وفيها فخ',
            summary: 'يقدّر تقرير الاستقرار المالي لصندوق النقد الدولي لأكتوبر 2026 الأصول المرمّزة بـ65.1 '
                + 'مليار دولار، ويحذّر من أن التسوية الفورية والأتمتة قد تضخّم الصدمات.'
        },
        es: {
            title: 'El FMI y la tokenización: un mercado de 65.000 millones con trampa',
            summary: 'El informe de estabilidad del FMI de octubre de 2026 cifra los activos tokenizados en '
                + '65.100 millones de dólares y advierte que la liquidación instantánea puede amplificar crisis.'
        },
        pt: {
            title: 'FMI e tokenização: um mercado de US$ 65 bilhões com um porém',
            summary: 'O relatório de estabilidade do FMI de outubro de 2026 estima os ativos tokenizados em '
                + 'US$ 65,1 bilhões e alerta que liquidação instantânea e automação podem ampliar choques.'
        },
        hi: {
            title: 'टोकनाइज़ेशन पर IMF: 65 अरब डॉलर का बाज़ार, एक पेच के साथ',
            summary: 'IMF की अक्टूबर 2026 की स्थिरता रिपोर्ट टोकनाइज़्ड एसेट्स को 65.1 अरब डॉलर आँकती है और '
                + 'चेताती है कि तुरंत सेटलमेंट और ऑटोमेशन झटकों को बढ़ा सकते हैं।'
        },
        zh: {
            title: 'IMF 谈代币化：650 亿美元的市场，暗藏隐患',
            summary: 'IMF 2026 年 10 月《全球金融稳定报告》估计代币化资产规模为 651 亿美元，并警告即时结算与自动化可能放大冲击。报告发现了什么。'
        },
        ru: {
            title: 'МВФ о токенизации: рынок на 65 млрд долларов с подвохом',
            summary: 'Октябрьский доклад МВФ о финансовой стабильности 2026 года оценивает токенизированные '
                + 'активы в 65,1 млрд долларов и предупреждает: мгновенные расчёты могут усилить шоки.'
        },
        fr: {
            title: 'Le FMI et la tokenisation : un marché de 65 Md$ avec un piège',
            summary: "Le rapport sur la stabilité financière du FMI d'octobre 2026 évalue les actifs tokenisés "
                + 'à 65,1 milliards de dollars et prévient que le règlement instantané peut amplifier les chocs.'
        },
        tr: {
            title: 'IMF ve tokenizasyon: 65 milyar dolarlık piyasada bir tuzak',
            summary: "IMF'nin Ekim 2026 finansal istikrar raporu tokenize varlıkları 65,1 milyar dolar olarak "
                + 'hesaplıyor ve anında takas ile otomasyonun şokları büyütebileceği uyarısında bulunuyor.'
        }
    }
};
