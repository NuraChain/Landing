import type { Article } from '../types.ts';

/**
 * New York's suit against Polymarket US of 24 September 2026, and the one question under
 * it: derivative or bet.
 *
 * Primary keyword: "prediction markets". Volume figures are Pew Research Center over data
 * from The Block; the relief sought is from the attorney general's own announcement.
 * There is no Nura tie-in beyond "a contract can be read", because there is none to make.
 */
export const article: Article = {
    slug: 'prediction-markets-new-york-lawsuit',
    tags: ['regulation', 'defi', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-01T08:00:00.000Z',
    updatedAt: '2026-10-01T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Prediction Markets: Why New York Is Suing Polymarket',
            summary: "New York sued Polymarket's US arm as an illegal gambling business on 24 September "
                + '2026, as monthly volume passed $50 billion. Who regulates a prediction market?'
        },
        fa: {
            title: 'بازارهای پیش‌بینی: چرا نیویورک از Polymarket شکایت کرده است',
            summary: 'نیویورک ۲۴ سپتامبر ۲۰۲۶ از شاخه آمریکایی Polymarket به‌عنوان قمار غیرقانونی شکایت '
                + 'کرد؛ حجم ماهانه از ۵۰ میلیارد دلار گذشته بود. ناظر بازار پیش‌بینی کیست؟'
        },
        ar: {
            title: 'أسواق التنبؤ: لماذا تقاضي نيويورك Polymarket',
            summary: 'قاضت نيويورك ذراع Polymarket الأمريكية بوصفها نشاط قمار غير قانوني في 24 سبتمبر '
                + '2026، مع تجاوز الحجم الشهري 50 مليار دولار. من ينظّم سوق التنبؤ؟'
        },
        es: {
            title: 'Mercados de predicción: por qué Nueva York demanda a Polymarket',
            summary: 'Nueva York demandó a Polymarket US por juego ilegal el 24 de septiembre de 2026, con '
                + 'el volumen mensual por encima de 50.000 millones de dólares. ¿Quién regula?'
        },
        pt: {
            title: 'Mercados de previsão: por que Nova York processa a Polymarket',
            summary: 'Nova York processou a Polymarket US por jogo ilegal em 24 de setembro de 2026, com o '
                + 'volume mensal acima de US$ 50 bilhões. Quem regula um mercado de previsão?'
        },
        hi: {
            title: 'प्रेडिक्शन मार्केट: Polymarket पर न्यूयॉर्क का मुक़दमा क्यों',
            summary: 'न्यूयॉर्क ने 24 सितंबर 2026 को Polymarket की अमेरिकी इकाई पर अवैध जुए का मुक़दमा '
                + 'किया जब मासिक वॉल्यूम 50 अरब डॉलर पार कर गया। प्रेडिक्शन मार्केट का नियामक कौन?'
        },
        zh: {
            title: '预测市场：纽约州为什么起诉 Polymarket',
            summary: '2026 年 9 月 24 日，纽约州以非法赌博经营为由起诉 Polymarket 的美国业务，此时月交易量已突破 500 亿美元。预测市场归谁监管？'
        },
        ru: {
            title: 'Рынки предсказаний: почему Нью-Йорк судится с Polymarket',
            summary: 'Нью-Йорк 24 сентября 2026 года подал иск к Polymarket US как к незаконному игорному '
                + 'бизнесу; месячный объём уже выше 50 млрд долларов. Кто регулирует эти рынки?'
        },
        fr: {
            title: 'Marchés de prédiction : pourquoi New York poursuit Polymarket',
            summary: "Le 24 septembre 2026, New York a attaqué Polymarket US pour jeux d'argent illégaux, "
                + 'alors que le volume mensuel dépasse 50 milliards de dollars. Qui régule ?'
        },
        tr: {
            title: "Tahmin piyasaları: New York neden Polymarket'i dava ediyor",
            summary: "New York, 24 Eylül 2026'da Polymarket'in ABD kolunu yasa dışı kumar işletmesi diye "
                + 'dava etti; aylık hacim 50 milyar doları aştı. Bu piyasaları kim düzenler?'
        }
    }
};
