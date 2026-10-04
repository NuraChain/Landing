import type { Article } from '../types.ts';

/**
 * What a tokenized deposit is, told through the DBS and Citi weekend payment of
 * 5 September 2026 on the ledger Swift is building.
 *
 * Primary keyword: "tokenized deposits". The comparison with a stablecoin is the part with
 * a long tail; the payment itself is one data point from a pilot of 17 banks, and the
 * body says so rather than presenting it as a product.
 */
export const article: Article = {
    slug: 'tokenized-deposits-swift-weekend-payment',
    tags: ['payments', 'stablecoins', 'rwa'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-23T15:00:00.000Z',
    updatedAt: '2026-09-23T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: "Tokenized Deposits: Swift's First Weekend Dollar Payment",
            summary: 'DBS and Citi moved dollars between Singapore and New York on a Saturday, in minutes, '
                + "via tokenized deposits on Swift's ledger. How it differs from a stablecoin."
        },
        fa: {
            title: 'سپرده‌های توکنی‌شده: نخستین پرداخت دلاری Swift در آخر هفته',
            summary: 'DBS و Citi یک شنبه، در چند دقیقه، با سپرده توکنی‌شده روی دفتر کل Swift دلار را میان '
                + 'سنگاپور و نیویورک جابه‌جا کردند. فرقش با استیبل‌کوین چیست.'
        },
        ar: {
            title: 'الودائع المرمّزة: أول دفعة دولارية عبر Swift في نهاية الأسبوع',
            summary: 'نقل DBS وCiti دولارات بين سنغافورة ونيويورك يوم سبت، في دقائق، بودائع مرمّزة على سجل '
                + 'Swift. كيف يختلف ذلك عن العملة المستقرة.'
        },
        es: {
            title: 'Depósitos tokenizados: primer pago de Swift en fin de semana',
            summary: 'DBS y Citi movieron dólares en minutos entre Singapur y Nueva York un sábado con '
                + 'depósitos tokenizados en el libro mayor de Swift. En qué difiere la stablecoin.'
        },
        pt: {
            title: 'Depósitos tokenizados: 1º pagamento da Swift num fim de semana',
            summary: 'DBS e Citi moveram dólares entre Singapura e Nova York num sábado, em minutos, com '
                + 'depósitos tokenizados no livro-razão da Swift. A diferença para a stablecoin.'
        },
        hi: {
            title: 'टोकनाइज़्ड डिपॉज़िट: Swift पर सप्ताहांत का पहला डॉलर भुगतान',
            summary: 'DBS और Citi ने शनिवार को Swift के बहीखाते पर टोकनाइज़्ड डिपॉज़िट से सिंगापुर और '
                + 'न्यूयॉर्क के बीच डॉलर मिनटों में भेजे। यह स्टेबलकॉइन से कैसे अलग है।'
        },
        zh: {
            title: '代币化存款：Swift 的首笔周末美元付款',
            summary: 'DBS 与 Citi 在一个周六用 Swift 账本上的代币化存款，几分钟内在新加坡与纽约之间完成了美元转移。它和稳定币有什么不同。'
        },
        ru: {
            title: 'Токенизированные депозиты: первый платёж Swift в выходной',
            summary: 'DBS и Citi в субботу за минуты перевели доллары между Сингапуром и Нью-Йорком на '
                + 'токенизированных депозитах в реестре Swift. Чем это отличается от стейблкоина.'
        },
        fr: {
            title: 'Dépôts tokenisés : premier paiement de week-end sur Swift',
            summary: 'Un samedi, DBS et Citi ont déplacé des dollars entre Singapour et New York en '
                + 'quelques minutes par dépôts tokenisés sur Swift. La différence avec un stablecoin.'
        },
        tr: {
            title: "Tokenlaştırılmış mevduat: Swift'in ilk hafta sonu dolar ödemesi",
            summary: 'DBS ve Citi, Swift defterindeki tokenlaştırılmış mevduatla bir cumartesi Singapur '
                + "ile New York arasında dakikalar içinde dolar taşıdı. Stablecoin'den farkı ne?"
        }
    }
};
