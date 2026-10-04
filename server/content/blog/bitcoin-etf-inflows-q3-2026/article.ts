import type { Article } from '../types.ts';

/**
 * What $6.34 billion of spot Bitcoin ETF inflows in the third quarter measures, and what
 * it cannot tell anyone.
 *
 * Primary keyword: "Bitcoin ETF inflows". It reports flows and a past price move and
 * makes NO forecast - keep it that way on any revision. Flow data is revised daily by its
 * compiler, so the monthly figures are a snapshot taken on 2 October 2026.
 */
export const article: Article = {
    slug: 'bitcoin-etf-inflows-q3-2026',
    tags: ['bitcoin', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-02T15:00:00.000Z',
    updatedAt: '2026-10-02T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Bitcoin ETF Inflows Hit $6.3 Billion in Q3 2026',
            summary: 'US spot Bitcoin ETFs took in $6.34 billion in the third quarter of 2026 as bitcoin '
                + 'rose 43%. What an ETF flow measures, and what it cannot tell you.'
        },
        fa: {
            title: 'ETF بیت‌کوین: ورودی ۶٫۳ میلیارد دلاری در سه‌ماهه سوم ۲۰۲۶',
            summary: 'صندوق‌های ETF اسپات بیت‌کوین آمریکا در سه‌ماهه سوم ۲۰۲۶ با رشد ۴۳٪ بیت‌کوین، ۶٫۳۴ '
                + 'میلیارد دلار جذب کردند. جریان ETF چه چیزی را می‌سنجد و چه چیزی را نمی‌گوید.'
        },
        ar: {
            title: 'تدفقات ETF للبيتكوين: 6.3 مليار دولار في الربع الثالث من 2026',
            summary: 'استقطبت صناديق ETF الفورية للبيتكوين في أمريكا 6.34 مليار دولار في الربع الثالث من '
                + '2026 مع ارتفاع البيتكوين 43%. ماذا يقيس تدفق ETF، وما الذي لا يخبرك به.'
        },
        es: {
            title: 'ETF de Bitcoin: entradas de 6.300 millones en el T3 de 2026',
            summary: 'Los ETF de Bitcoin al contado de EE. UU. captaron 6.340 millones de dólares en el T3 '
                + 'de 2026 mientras bitcoin subía un 43%. Qué mide un flujo de ETF y qué no.'
        },
        pt: {
            title: 'ETFs de Bitcoin captam US$ 6,3 bilhões no 3º trimestre de 2026',
            summary: 'Os ETFs de Bitcoin à vista dos EUA receberam US$ 6,34 bilhões no 3º trimestre de '
                + '2026, com o bitcoin subindo 43%. O que um fluxo de ETF mede e o que não diz.'
        },
        hi: {
            title: 'Bitcoin ETF इनफ़्लो Q3 2026 में 6.3 अरब डॉलर पर पहुँचा',
            summary: '2026 की तीसरी तिमाही में अमेरिकी स्पॉट Bitcoin ETF में 6.34 अरब डॉलर आए, जबकि '
                + 'bitcoin 43% चढ़ा। ETF फ़्लो क्या मापता है, और क्या नहीं बता सकता।'
        },
        zh: {
            title: '比特币 ETF 资金流入在 2026 年第三季度达到 63 亿美元',
            summary: '2026 年第三季度，美国现货比特币 ETF 吸纳 63.4 亿美元，同期比特币上涨 43%。ETF 资金流衡量的是什么，又有什么是它说明不了的。'
        },
        ru: {
            title: 'Биткоин-ETF: приток 6,3 млрд долларов за III квартал 2026 года',
            summary: 'Спотовые биткоин-ETF в США привлекли 6,34 млрд долларов в третьем квартале 2026 '
                + 'года, а биткоин вырос на 43%. Что измеряет поток в ETF и чего он не скажет.'
        },
        fr: {
            title: "ETF Bitcoin : 6,3 milliards de dollars d'entrées au T3 2026",
            summary: 'Les ETF Bitcoin au comptant américains ont attiré 6,34 milliards de dollars au '
                + "troisième trimestre 2026, le bitcoin prenant 43 %. Ce que mesure un flux d'ETF."
        },
        tr: {
            title: "Bitcoin ETF'lerine 2026'nın 3. çeyreğinde 6,3 milyar dolar girdi",
            summary: "ABD'deki spot Bitcoin ETF'leri 2026'nın üçüncü çeyreğinde 6,34 milyar dolar çekti; "
                + 'bitcoin %43 yükseldi. Bir ETF akışı neyi ölçer ve size neyi söyleyemez.'
        }
    }
};
