import type { Article } from '../types.ts';

/**
 * The Axios report of 22 October 2026 that Visa was in late-stage talks to buy Fireblocks,
 * and Fireblocks' same-day denial.
 *
 * Primary keyword: "Fireblocks Visa acquisition". This is a REPORT and a DENIAL and is written
 * as both: the $2.5 billion price is Axios's, from unnamed sources; the denial and Visa's
 * no-comment were given to The Block. The Axios piece is behind its Pro paywall, so its
 * claims are quoted as The Block relays them. Fireblocks' $3 trillion figure is the
 * company's own. Move updatedAt the day either company announces anything.
 */
export const article: Article = {
    slug: 'fireblocks-visa-acquisition-report',
    tags: ['wallet', 'payments', 'security'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T11:00:00.000Z',
    updatedAt: '2026-10-23T11:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Visa and Fireblocks: A $2.5 Billion Report, and a Denial',
            summary: 'Axios reported on 22 October 2026 that Visa was in talks to buy custody firm '
                + 'Fireblocks for $2.5 billion. Fireblocks denied it. What the company does.'
        },
        fa: {
            title: 'Visa و Fireblocks: گزارشی ۲٫۵ میلیارد دلاری و یک تکذیب',
            summary: 'Axios در ۲۲ اکتبر ۲۰۲۶ گزارش داد Visa برای خرید Fireblocks، شرکت امانت‌داری کریپتو، '
                + 'به مبلغ ۲٫۵ میلیارد دلار در حال مذاکره است. Fireblocks تکذیب کرد. این شرکت چه می‌کند.'
        },
        ar: {
            title: 'Visa وFireblocks: تقرير بقيمة 2.5 مليار دولار ونفي',
            summary: 'أفادت Axios في 22 أكتوبر 2026 بأن Visa تتفاوض لشراء شركة الحفظ Fireblocks مقابل '
                + '2.5 مليار دولار. نفت Fireblocks ذلك. ماذا تفعل هذه الشركة.'
        },
        es: {
            title: 'Visa y Fireblocks: un informe de 2500 millones y un desmentido',
            summary: 'Axios informó el 22 de octubre de 2026 de que Visa negociaba comprar la firma de '
                + 'custodia Fireblocks por 2500 millones de dólares. Fireblocks lo negó. Qué hace.'
        },
        pt: {
            title: 'Visa e Fireblocks: uma notícia de US$ 2,5 bilhões e um desmentido',
            summary: 'A Axios noticiou em 22 de outubro de 2026 que a Visa negociava comprar a empresa de '
                + 'custódia Fireblocks por US$ 2,5 bilhões. A Fireblocks negou. O que ela faz.'
        },
        hi: {
            title: 'Visa और Fireblocks: 2.5 अरब डॉलर की रिपोर्ट, और एक खंडन',
            summary: 'Axios ने 22 अक्टूबर 2026 को बताया कि Visa कस्टडी कंपनी Fireblocks को 2.5 अरब डॉलर में '
                + 'ख़रीदने की बातचीत में है। Fireblocks ने इससे इनकार किया। यह कंपनी क्या करती है।'
        },
        zh: {
            title: 'Visa 与 Fireblocks：一则 25 亿美元的报道，和一份否认',
            summary: 'Axios 于 2026 年 10 月 22 日报道，Visa 正洽谈以约 25 亿美元收购加密托管公司 Fireblocks。Fireblocks 予以否认。这家公司做什么。'
        },
        ru: {
            title: 'Visa и Fireblocks: сообщение о сделке на 2,5 млрд и опровержение',
            summary: '22 октября 2026 года Axios сообщил, что Visa ведёт переговоры о покупке кастодиальной '
                + 'компании Fireblocks за 2,5 млрд долларов. Fireblocks это опровергла. Чем она занята.'
        },
        fr: {
            title: 'Visa et Fireblocks : une info à 2,5 milliards, et un démenti',
            summary: "Axios a rapporté le 22 octobre 2026 que Visa négociait le rachat de Fireblocks, "
                + 'spécialiste de la conservation crypto, pour 2,5 milliards de dollars. Démenti.'
        },
        tr: {
            title: 'Visa ve Fireblocks: 2,5 milyar dolarlık bir haber ve bir yalanlama',
            summary: "Axios 22 Ekim 2026'da Visa'nın saklama şirketi Fireblocks'u 2,5 milyar dolara almak "
                + 'için görüştüğünü bildirdi. Fireblocks bunu yalanladı. Şirket ne yapıyor.'
        }
    }
};
