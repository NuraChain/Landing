import type { Article } from '../types.ts';

/**
 * MiCA after its transition period, through Deutsche Bank's custody announcement of
 * 16 September 2026.
 *
 * Primary keyword: "MiCA crypto custody". The evergreen half is custody against
 * self-custody, which is why it links the wallet guide. No count of authorised firms is
 * stated: the figures in circulation could not be traced to the ESMA register.
 */
export const article: Article = {
    slug: 'mica-bank-crypto-custody-europe',
    tags: ['regulation', 'wallet', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-26T08:00:00.000Z',
    updatedAt: '2026-09-26T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'MiCA in Force: Why European Banks Now Custody Crypto',
            summary: "MiCA's transition period ended on 1 July 2026, and Deutsche Bank now plans Bitcoin "
                + 'and Ether custody under it. What bank custody is, and what you give up.'
        },
        fa: {
            title: 'MiCA اجرایی شد: چرا بانک‌های اروپا امانت‌دار کریپتو می‌شوند',
            summary: 'دوره گذار MiCA در ۱ ژوئیه ۲۰۲۶ پایان یافت و Deutsche Bank حالا ذیل آن برنامه '
                + 'امانت‌داری بیت‌کوین و اتر دارد. امانت‌داری بانکی چیست و چه چیزی را از دست می‌دهید.'
        },
        ar: {
            title: 'MiCA نافذة: لماذا تحفظ البنوك الأوروبية الكريبتو الآن',
            summary: 'انتهت الفترة الانتقالية لـ MiCA في 1 يوليو 2026، ويخطط Deutsche Bank الآن لحفظ '
                + 'بيتكوين والإيثر بموجبها. ما الحفظ المصرفي، وعمَّ تتنازل.'
        },
        es: {
            title: 'MiCA en vigor: por qué los bancos europeos ya custodian cripto',
            summary: 'La transición de MiCA acabó el 1 de julio de 2026 y Deutsche Bank prevé custodiar '
                + 'Bitcoin y Ether bajo esa norma. Qué es la custodia bancaria y a qué renuncias.'
        },
        pt: {
            title: 'MiCA em vigor: por que bancos europeus agora custodiam cripto',
            summary: 'A transição do MiCA acabou em 1º de julho de 2026, e o Deutsche Bank planeja '
                + 'custódia de Bitcoin e Ether. O que é custódia bancária e do que você abre mão.'
        },
        hi: {
            title: 'MiCA लागू: यूरोपीय बैंक अब क्रिप्टो कस्टडी क्यों दे रहे हैं',
            summary: 'MiCA की संक्रमण अवधि 1 जुलाई 2026 को ख़त्म हुई; Deutsche Bank अब इसके तहत Bitcoin और '
                + 'Ether कस्टडी की योजना बना रहा है। बैंक कस्टडी क्या है, आप क्या छोड़ते हैं।'
        },
        zh: {
            title: 'MiCA 全面生效：欧洲的银行为何开始托管加密资产',
            summary: 'MiCA 的过渡期于 2026 年 7 月 1 日结束，Deutsche Bank 如今计划据此托管比特币和 ether。银行托管是什么，你又放弃了什么。'
        },
        ru: {
            title: 'MiCA в силе: почему банки Европы теперь хранят крипту',
            summary: 'Переходный период MiCA истёк 1 июля 2026 года, и Deutsche Bank планирует по нему '
                + 'хранить биткоин и эфир. Что такое банковское хранение и от чего отказываетесь.'
        },
        fr: {
            title: 'MiCA : pourquoi les banques européennes conservent des cryptos',
            summary: 'La transition de MiCA a pris fin le 1er juillet 2026, et Deutsche Bank prévoit de '
                + 'conserver Bitcoin et Ether sous ce régime. Ce à quoi vous renoncez.'
        },
        tr: {
            title: 'MiCA yürürlükte: Avrupa bankaları neden artık kripto saklıyor',
            summary: "MiCA'nın geçiş dönemi 1 Temmuz 2026'da bitti; Deutsche Bank şimdi bu çerçevede "
                + 'Bitcoin ve Ether saklamayı planlıyor. Banka saklaması nedir, neyi bırakırsınız.'
        }
    }
};
