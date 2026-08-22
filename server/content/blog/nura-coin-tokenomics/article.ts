import type { Article } from '../types.ts';

/**
 * Primary keyword: "Nura Coin" / "NURA token". Commercial-investigation intent - somebody
 * deciding whether to hold it rather than build on it.
 *
 * The allocation figures are the ones the site's own tokenomics section publishes; this article
 * restates them rather than inventing any. What it ADDS is the verification boundary: a native
 * coin has no `totalSupply()` to call, so the one-billion figure is a published claim and this
 * article says so out loud. Circulating supply is omitted entirely, because `lib/content/site.ts`
 * marks that number as never confirmed and repeating an unconfirmed figure in ten languages is
 * how an unverified number becomes folklore.
 */
export const article: Article = {
    slug: 'nura-coin-tokenomics',
    tags: ['tokenomics', 'nura-chain', 'guides'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'Nura Coin (NURA): Supply, Allocation and Gas',
            summary: 'What NURA pays for, the published one-billion supply and its six-way split, and '
                + 'which of those figures you can actually verify on-chain yourself.'
        },
        fa: {
            title: 'نورا کوین (NURA): عرضه، تخصیص و گس',
            summary: 'NURA بهای چه چیزی را می‌پردازد، عرضه یک‌میلیاردی منتشرشده و تقسیم شش‌بخشی آن، و '
                + 'اینکه کدام‌یک از این ارقام را واقعاً خودتان روی زنجیره می‌توانید بسنجید.'
        },
        ar: {
            title: 'نورا كوين (NURA): المعروض والتوزيع والغاز',
            summary: 'ما الذي تدفعه NURA، والمعروض المنشور البالغ مليارًا وتقسيمه السداسي، وأي تلك '
                + 'الأرقام تستطيع فعلًا التحقق منه بنفسك على السلسلة.'
        },
        es: {
            title: 'Nura Coin (NURA): suministro, asignación y gas',
            summary: 'Para qué paga NURA, el suministro publicado de mil millones y su reparto en seis '
                + 'partes, y cuáles de esas cifras puedes verificar realmente en cadena.'
        },
        pt: {
            title: 'Nura Coin (NURA): fornecimento, alocação e gás',
            summary: 'O que o NURA paga, o fornecimento publicado de um bilhão e sua divisão em seis '
                + 'partes, e quais desses números você realmente consegue verificar na cadeia.'
        },
        hi: {
            title: 'Nura Coin (NURA): आपूर्ति, आवंटन और गैस',
            summary: 'NURA किसका भुगतान करती है, प्रकाशित एक-अरब आपूर्ति और उसका छह-हिस्सा विभाजन, और '
                + 'इनमें से कौन-से आँकड़े आप सचमुच चेन पर स्वयं जाँच सकते हैं।'
        },
        zh: {
            title: 'Nura Coin（NURA）：供应、分配与 gas',
            summary: 'NURA 用来支付什么、已公布的十亿供应量及其六方划分，'
                + '以及这些数字里哪些你真的能自己在链上核实。'
        },
        ru: {
            title: 'Nura Coin (NURA): эмиссия, распределение и газ',
            summary: 'За что платит NURA, опубликованная эмиссия в миллиард и её разбиение на шесть '
                + 'долей, и какие из этих цифр вы действительно можете проверить в цепочке.'
        },
        fr: {
            title: 'Nura Coin (NURA) : offre, répartition et gaz',
            summary: 'Ce que paie NURA, l\'offre publiée d\'un milliard et sa répartition en six parts, '
                + 'et lesquels de ces chiffres vous pouvez réellement vérifier sur la chaîne.'
        },
        tr: {
            title: 'Nura Coin (NURA): Arz, Dağılım ve Gaz',
            summary: 'NURA neyin bedelini öder, yayımlanan bir milyarlık arz ve altı parçalı dağılımı, '
                + 've bu rakamlardan hangilerini gerçekten zincir üzerinde kendiniz doğrulayabilirsiniz.'
        }
    }
};
