import type { Article } from '../types.ts';

/**
 * The Railway breach of 21 October 2026: customer environment variables possibly read, and
 * an investigator's claim that keys stored there were used to drain wallets on 19 chains.
 *
 * Primary keyword: "Railway breach". Railway's own disclosure is the primary source and says
 * nothing about crypto; the $371,000 and the 19 chains are Taylor Monahan's estimate as
 * reported by crypto.news, and a Railway engineer's contrary reading is stated beside it. No
 * root cause or customer count had been published at writing, so this is the article most
 * likely to need its updatedAt moved.
 */
export const article: Article = {
    slug: 'railway-breach-crypto-theft-19-chains',
    tags: ['security', 'wallet', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T15:00:00.000Z',
    updatedAt: '2026-10-23T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Railway Breach Linked to $371K Crypto Theft on 19 Chains',
            summary: 'Railway disclosed on 21 October 2026 that customer environment variables may have '
                + 'been read; an investigator ties it to about $371,000 drained on 19 chains.'
        },
        fa: {
            title: 'نفوذ به Railway به سرقت ۳۷۱ هزار دلار رمزارز در ۱۹ زنجیره گره خورد',
            summary: 'Railway در ۲۱ اکتبر ۲۰۲۶ اعلام کرد متغیرهای محیطی مشتریان ممکن است خوانده شده باشد؛ '
                + 'یک پژوهشگر آن را به حدود ۳۷۱ هزار دلار برداشت‌شده در ۱۹ زنجیره مرتبط می‌داند.'
        },
        ar: {
            title: 'اختراق Railway مرتبط بسرقة 371 ألف دولار عبر 19 سلسلة',
            summary: 'أعلنت Railway في 21 أكتوبر 2026 أن متغيرات بيئة العملاء ربما قُرئت؛ وتربطه محققة '
                + 'بنحو 371 ألف دولار من العملات المشفّرة سُحبت عبر 19 سلسلة.'
        },
        es: {
            title: 'Brecha de Railway, ligada a 371.000 dólares en cripto en 19 cadenas',
            summary: 'Railway reveló el 21 de octubre de 2026 que pudieron leerse variables de entorno de '
                + 'clientes; una investigadora lo vincula a unos 371.000 dólares drenados en 19 cadenas.'
        },
        pt: {
            title: 'Violação da Railway ligada a US$ 371 mil em cripto em 19 redes',
            summary: 'A Railway divulgou em 21 de outubro de 2026 que variáveis de ambiente de clientes podem '
                + 'ter sido lidas; uma investigadora liga o caso a US$ 371 mil drenados em 19 redes.'
        },
        hi: {
            title: 'Railway सेंध को 19 चेन पर 3.71 लाख डॉलर की क्रिप्टो चोरी से जोड़ा गया',
            summary: 'Railway ने 21 अक्टूबर 2026 को बताया कि ग्राहकों के एनवायरनमेंट वेरिएबल पढ़े गए हो सकते हैं; '
                + 'एक जाँचकर्ता इसे 19 चेन पर निकाली गई लगभग 3.71 लाख डॉलर की क्रिप्टो से जोड़ती हैं।'
        },
        zh: {
            title: 'Railway 泄露事件被指与 19 条链上约 37.1 万美元被盗有关',
            summary: '2026 年 10 月 21 日，Railway 披露客户环境变量可能已被读取；一位调查员将其与 19 条链上被盗走的约 37.1 万美元加密资产联系起来。'
        },
        ru: {
            title: 'Взлом Railway связали с кражей 371 тыс. долларов в 19 сетях',
            summary: '21 октября 2026 года Railway сообщила, что переменные окружения клиентов могли быть '
                + 'прочитаны; исследовательница связывает это с выводом около 371 тыс. долларов в 19 сетях.'
        },
        fr: {
            title: 'Brèche chez Railway liée à 371 000 $ de crypto volés sur 19 chaînes',
            summary: "Railway a révélé le 21 octobre 2026 que des variables d'environnement de clients ont pu "
                + 'être lues ; une enquêtrice y relie environ 371 000 dollars siphonnés sur 19 chaînes.'
        },
        tr: {
            title: 'Railway ihlali 19 zincirde 371.000 dolarlık kripto hırsızlığına bağlandı',
            summary: "Railway 21 Ekim 2026'da müşteri ortam değişkenlerinin okunmuş olabileceğini açıkladı; "
                + 'bir araştırmacı bunu 19 zincirde boşaltılan yaklaşık 371.000 dolarla ilişkilendiriyor.'
        }
    }
};
