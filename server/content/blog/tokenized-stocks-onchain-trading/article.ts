import type { Article } from '../types.ts';

/**
 * Tokenized stocks: 8% of tokenized assets and 93% of the trading, and what a holder of
 * one actually owns.
 *
 * Primary keyword: "tokenized stocks". Two sources with two dates - Dune's report to
 * 31 August 2026 and the chain split from early October - and each figure says which.
 * It states plainly that nothing in it describes an asset on Nura Chain.
 */
export const article: Article = {
    slug: 'tokenized-stocks-onchain-trading',
    tags: ['rwa', 'defi', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-04T08:00:00.000Z',
    updatedAt: '2026-10-04T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Tokenized Stocks: 8% of the Market, 93% of the Trading',
            summary: 'Tokenized stocks and ETFs reached $3.7 billion, with BNB Chain first past $1 '
                + 'billion. They are 8% of tokenized assets and 93% of the trading in them.'
        },
        fa: {
            title: 'سهام توکنی‌شده: ۸٪ بازار، ۹۳٪ معاملات',
            summary: 'سهام و ETF توکنی‌شده به ۳٫۷ میلیارد دلار رسید و BNB Chain نخستین شبکه‌ای شد که از ۱ '
                + 'میلیارد دلار گذشت. ۸٪ دارایی‌های توکنی‌شده‌اند و ۹۳٪ معاملات آنها.'
        },
        ar: {
            title: 'الأسهم المرمّزة: 8% من السوق و93% من التداول',
            summary: 'بلغت الأسهم وصناديق ETF المرمّزة 3.7 مليار دولار، وكانت BNB Chain أول من تجاوز مليار '
                + 'دولار. وهي 8% من الأصول المرمّزة و93% من التداول فيها.'
        },
        es: {
            title: 'Acciones tokenizadas: 8% del mercado, 93% de la negociación',
            summary: 'Acciones y ETF tokenizados: 3.700 millones de dólares; BNB Chain, la primera en '
                + 'superar 1.000. Son el 8% de los activos tokenizados y el 93% de su negociación.'
        },
        pt: {
            title: 'Ações tokenizadas: 8% do mercado, 93% da negociação',
            summary: 'Ações e ETFs tokenizados somam US$ 3,7 bilhões, e a BNB Chain foi a primeira a '
                + 'passar de US$ 1 bilhão. São 8% dos ativos tokenizados e 93% da negociação deles.'
        },
        hi: {
            title: 'टोकनाइज़्ड स्टॉक: बाज़ार का 8%, ट्रेडिंग का 93%',
            summary: 'टोकनाइज़्ड स्टॉक और ETF 3.7 अरब डॉलर पर पहुँचे, और BNB Chain सबसे पहले 1 अरब डॉलर के '
                + 'पार गई। ये टोकनाइज़्ड परिसंपत्तियों का 8% और उनकी ट्रेडिंग का 93% हैं।'
        },
        zh: {
            title: '代币化股票：占市场的 8%，占交易的 93%',
            summary: '代币化股票和 ETF 达到 37 亿美元，BNB Chain 率先突破 10 亿美元。它们占代币化资产的 8%，占这些资产交易的 93%。'
        },
        ru: {
            title: 'Токенизированные акции: 8% рынка, 93% торговли',
            summary: 'Токенизированные акции и ETF достигли 3,7 млрд долларов, а BNB Chain первой перешла '
                + '1 млрд долларов. Это 8% токенизированных активов и 93% торговли ими.'
        },
        fr: {
            title: 'Actions tokenisées : 8 % du marché, 93 % des échanges',
            summary: 'Actions et ETF tokenisés atteignent 3,7 milliards de dollars, BNB Chain passant la '
                + 'première le milliard. 8 % des actifs tokenisés, 93 % de leurs échanges.'
        },
        tr: {
            title: "Tokenlaştırılmış hisseler: piyasanın %8'i, işlemlerin %93'ü",
            summary: "Tokenlaştırılmış hisse ve ETF'ler 3,7 milyar dolara ulaştı; 1 milyar doları ilk aşan "
                + "BNB Chain. Tokenlaştırılmış varlıkların %8'i, bunlardaki işlemlerin %93'ü."
        }
    }
};
