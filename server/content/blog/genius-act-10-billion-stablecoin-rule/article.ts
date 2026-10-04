import type { Article } from '../types.ts';

/**
 * Treasury's interim final rule of 30 September 2026 and the $10 billion line between
 * state and federal supervision.
 *
 * Primary keyword: "GENIUS Act $10 billion". A follow-up to the GENIUS Act article, which
 * it links as the main reference rather than competing with it: that one explains the
 * statute, this one the first rule under it. Comments close on 30 November 2026.
 */
export const article: Article = {
    slug: 'genius-act-10-billion-stablecoin-rule',
    tags: ['stablecoins', 'regulation', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-01T15:00:00.000Z',
    updatedAt: '2026-10-01T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: "GENIUS Act's $10 Billion Rule: State or Federal Stablecoins",
            summary: "Treasury's first binding GENIUS Act rule, published 30 September 2026, splits US "
                + 'stablecoin issuers at $10 billion. What the line means and who decides.'
        },
        fa: {
            title: 'قانون GENIUS و قاعده ۱۰ میلیارد دلاری: استیبل‌کوین ایالتی یا فدرال',
            summary: 'نخستین قاعده الزام‌آور خزانه‌داری ذیل قانون GENIUS (۳۰ سپتامبر ۲۰۲۶) ناشران '
                + 'استیبل‌کوین را در مرز ۱۰ میلیارد دلار جدا می‌کند. این خط یعنی چه و تصمیم با کیست.'
        },
        ar: {
            title: 'قانون GENIUS وحدّ 10 مليارات دولار: إشراف ولائي أم فيدرالي',
            summary: 'أول لائحة مُلزمة للخزانة بموجب قانون GENIUS، نُشرت في 30 سبتمبر 2026، تقسم جهات '
                + 'إصدار العملات المستقرة الأمريكية عند 10 مليارات دولار. ما معنى الخط ومن يقرر.'
        },
        es: {
            title: 'GENIUS Act: la regla de los 10.000 millones para stablecoins',
            summary: 'La primera norma vinculante de la GENIUS Act (30 de septiembre de 2026) fija en '
                + '10.000 millones de dólares la línea entre emisores de stablecoins. Quién decide.'
        },
        pt: {
            title: 'GENIUS Act e os US$ 10 bilhões: stablecoin estadual ou federal',
            summary: 'A primeira regra vinculante do Tesouro sob a GENIUS Act, de 30 de setembro de 2026, '
                + 'separa os emissores de stablecoins na linha dos US$ 10 bilhões. Quem decide.'
        },
        hi: {
            title: 'GENIUS Act का 10 अरब डॉलर नियम: राज्य या संघीय स्टेबलकॉइन',
            summary: '30 सितंबर 2026 को प्रकाशित ट्रेज़री का पहला बाध्यकारी GENIUS Act नियम अमेरिकी '
                + 'स्टेबलकॉइन जारीकर्ताओं को 10 अरब डॉलर पर बाँटता है। रेखा का मतलब, और फ़ैसला किसका।'
        },
        zh: {
            title: 'GENIUS 法案的 100 亿美元规则：稳定币归州管还是联邦管',
            summary: '财政部依据 GENIUS 法案发布的首条约束性规则于 2026 年 9 月 30 日出台，以 100 亿美元为界划分美国稳定币发行人。这条线意味着什么，由谁来决定。'
        },
        ru: {
            title: 'GENIUS Act: правило 10 млрд долларов для стейблкоинов',
            summary: 'Первое обязательное правило по GENIUS Act от 30 сентября 2026 года делит эмитентов '
                + 'стейблкоинов в США по границе 10 млрд долларов. Что она значит и кто решает.'
        },
        fr: {
            title: 'GENIUS Act : la règle des 10 milliards, État ou fédéral',
            summary: 'La première règle contraignante du GENIUS Act, publiée par le Trésor le 30 septembre '
                + '2026, sépare les émetteurs de stablecoins à 10 milliards de dollars.'
        },
        tr: {
            title: "GENIUS Yasası'nın 10 milyar dolar kuralı: eyalet mi federal mi",
            summary: "Hazine'nin 30 Eylül 2026 tarihli ilk bağlayıcı GENIUS Yasası kuralı, ABD stablecoin "
                + 'ihraççılarını 10 milyar dolarda ayırıyor. Çizgi ne demek, kim karar verir.'
        }
    }
};
