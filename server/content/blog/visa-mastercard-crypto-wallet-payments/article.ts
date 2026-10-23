import type { Article } from '../types.ts';

/**
 * Mesh's Visa partnership of 19 October 2026 - paying Visa merchants from the crypto and
 * stablecoin balances in a wallet app - and Mastercard's Stablecoin Security, announced the
 * same day and a different thing.
 *
 * Primary keyword: "crypto wallet payments". The consumer story is Mesh's release, with a
 * Visa executive quoted in it; Visa issued no release of its own, so the article never says
 * Visa unveiled anything. Every Visa figure is the network's whole footprint as given in that
 * release, not where the service works - it is not live, and launch date, devices and
 * participating platforms are unannounced. The release does not say whether self-custody
 * wallets qualify, so neither does this. Nura has no card or merchant payment product and
 * the tie-in says so. The article most likely to need updatedAt moved when launch details land.
 */
export const article: Article = {
    slug: 'visa-mastercard-crypto-wallet-payments',
    tags: ['payments', 'wallet', 'stablecoins'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T10:00:00.000Z',
    updatedAt: '2026-10-23T10:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Crypto Wallet Payments: What Mesh and Visa Plan, and When',
            summary: 'Mesh and Visa plan to let wallet apps pay any Visa merchant from crypto balances, '
                + 'with no card. Not live yet; Mastercard announced something else the same day.'
        },
        fa: {
            title: 'پرداخت از کیف پول کریپتو: برنامه Mesh و Visa و زمان آن',
            summary: 'Mesh و Visa می‌خواهند اپ‌های کیف پول بدون کارت از موجودی کریپتو به هر فروشنده Visa '
                + 'پرداخت کنند. هنوز راه نیفتاده؛ Mastercard همان روز چیز دیگری اعلام کرد.'
        },
        ar: {
            title: 'الدفع من محافظ الكريبتو: ما تخطط له Mesh وVisa ومتى',
            summary: 'تخطط Mesh وVisa لتمكين تطبيقات المحافظ من الدفع لأي تاجر Visa من أرصدة الكريبتو '
                + 'بلا بطاقة. لم تنطلق بعد، وأعلنت Mastercard شيئًا آخر في اليوم نفسه.'
        },
        es: {
            title: 'Pagos con cartera cripto: qué planean Mesh y Visa, y cuándo',
            summary: 'Mesh y Visa quieren que las apps de cartera paguen en cualquier comercio Visa con '
                + 'saldos cripto, sin tarjeta. Aún no funciona; Mastercard anunció otra cosa.'
        },
        pt: {
            title: 'Pagamentos com carteira cripto: o plano de Mesh e Visa',
            summary: 'Mesh e Visa querem que apps de carteira paguem qualquer lojista Visa com saldos '
                + 'cripto, sem cartão. Ainda não está no ar; a Mastercard anunciou outra coisa.'
        },
        hi: {
            title: 'क्रिप्टो वॉलेट से भुगतान: Mesh और Visa की योजना, और कब',
            summary: 'Mesh और Visa चाहते हैं कि वॉलेट ऐप बिना कार्ड के क्रिप्टो बैलेंस से किसी भी Visa '
                + 'व्यापारी को भुगतान करें। यह अभी चालू नहीं; Mastercard ने उसी दिन कुछ और घोषित किया।'
        },
        zh: {
            title: '加密钱包付款：Mesh 与 Visa 的计划，以及何时上线',
            summary: 'Mesh 和 Visa 计划让钱包应用无需银行卡，就能用加密余额向任何 Visa 商户付款。服务尚未上线；Mastercard 同日宣布的是另一回事。'
        },
        ru: {
            title: 'Оплата из криптокошелька: что планируют Mesh и Visa',
            summary: 'Mesh и Visa хотят, чтобы кошельки платили любому продавцу Visa с криптобалансов '
                + 'без карты. Пока не запущено; Mastercard в тот же день объявила другое.'
        },
        fr: {
            title: 'Paiement depuis un portefeuille crypto : le plan Mesh et Visa',
            summary: "Mesh et Visa veulent que les portefeuilles paient tout commerçant Visa avec des "
                + "soldes crypto, sans carte. Pas encore lancé ; Mastercard annonçait autre chose."
        },
        tr: {
            title: 'Kripto cüzdanla ödeme: Mesh ve Visa ne planlıyor, ne zaman',
            summary: "Mesh ve Visa, cüzdan uygulamalarının kartsız, kripto bakiyeyle her Visa satıcısına "
                + "ödeme yapmasını istiyor. Henüz yayında değil; Mastercard başka bir şey duyurdu."
        }
    }
};
