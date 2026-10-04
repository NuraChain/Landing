import type { Article } from '../types.ts';

/**
 * DeFi's third quarter, with the price effect taken out of the headline number.
 *
 * Primary keyword: "DeFi TVL". Every figure is DefiLlama as of 26 September 2026, by way
 * of one published analysis; the stablecoin-supply test is the argument. It explains how
 * this site's own TVL tile is counted, which is the reason for the explorer link.
 */
export const article: Article = {
    slug: 'defi-tvl-q3-2026',
    tags: ['defi', 'ethereum', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-30T08:00:00.000Z',
    updatedAt: '2026-09-30T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'DeFi TVL Rose 38% in Q3 2026. Most of It Was Price.',
            summary: "DeFi's total value locked climbed from $69 billion to $95 billion in the third "
                + 'quarter of 2026. How much was new money, and how to read a TVL figure properly.'
        },
        fa: {
            title: 'TVL دیفای در سه‌ماهه سوم ۲۰۲۶ رشدی ۳۸٪ داشت. بیشترش قیمت بود.',
            summary: 'ارزش کل قفل‌شده دیفای در سه‌ماهه سوم ۲۰۲۶ از ۶۹ میلیارد دلار به ۹۵ میلیارد دلار '
                + 'رسید. چقدرش پول تازه بود و عدد TVL را چطور باید درست خواند.'
        },
        ar: {
            title: 'TVL في DeFi ارتفع 38% في الربع الثالث من 2026. معظمه سعر.',
            summary: 'ارتفع إجمالي القيمة المقفلة في DeFi من 69 مليار دولار إلى 95 مليار دولار في الربع '
                + 'الثالث من 2026. كم منه مال جديد، وكيف تقرأ رقم TVL قراءة صحيحة.'
        },
        es: {
            title: 'El TVL de DeFi subió un 38% en el T3 de 2026: casi todo precio',
            summary: 'El valor total bloqueado en DeFi subió de 69.000 a 95.000 millones de dólares en el '
                + 'tercer trimestre de 2026. Cuánto fue dinero nuevo y cómo leer bien un TVL.'
        },
        pt: {
            title: 'DeFi: TVL sobe 38% no 3º trimestre de 2026, puxado pelo preço',
            summary: 'O valor total bloqueado em DeFi foi de US$ 69 bilhões a US$ 95 bilhões no terceiro '
                + 'trimestre de 2026. Quanto foi dinheiro novo e como ler um número de TVL.'
        },
        hi: {
            title: 'Q3 2026 में DeFi TVL 38% बढ़ा। ज़्यादातर कीमत की वजह से।',
            summary: '2026 की तीसरी तिमाही में DeFi का TVL 69 अरब डॉलर से बढ़कर 95 अरब डॉलर हुआ। इसमें नया '
                + 'पैसा कितना था, और TVL का आँकड़ा ठीक से कैसे पढ़ें।'
        },
        zh: {
            title: 'DeFi TVL 在 2026 年第三季度上涨 38%，大部分来自价格',
            summary: '2026 年第三季度，DeFi 的总锁仓价值从 690 亿美元升至 950 亿美元。其中有多少是新资金，以及怎样正确解读一个 TVL 数字。'
        },
        ru: {
            title: 'TVL в DeFi вырос на 38% за III квартал 2026. В основном цена.',
            summary: 'Общая заблокированная стоимость в DeFi за третий квартал 2026 года выросла с 69 до '
                + '95 млрд долларов. Сколько в этом новых денег и как правильно читать TVL.'
        },
        fr: {
            title: 'La TVL DeFi a pris 38 % au T3 2026. Surtout un effet prix.',
            summary: 'La valeur totale verrouillée de la DeFi est passée de 69 à 95 milliards de dollars '
                + "au troisième trimestre 2026. La part d'argent frais, et comment lire une TVL."
        },
        tr: {
            title: "DeFi TVL'si 2026'nın 3. çeyreğinde %38 arttı. Çoğu fiyattı.",
            summary: "DeFi'de kilitli toplam değer 2026'nın üçüncü çeyreğinde 69 milyar dolardan 95 milyar "
                + 'dolara çıktı. Ne kadarı yeni paraydı ve bir TVL rakamı nasıl doğru okunur.'
        }
    }
};
