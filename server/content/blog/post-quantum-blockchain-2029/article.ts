import type { Article } from '../types.ts';

/**
 * Why Ethereum and Bitcoin both say December 2029, and what a quantum computer would and
 * would not break.
 *
 * Primary keyword: "post-quantum blockchain". Hooked on the Ethereum Foundation post of
 * 7 September 2026. The exposure figure (about 6.9 million BTC) is one research estimate
 * and is attributed as such. Nura Chain has announced no migration schedule and the body
 * says exactly that - do not let a revision imply otherwise.
 */
export const article: Article = {
    slug: 'post-quantum-blockchain-2029',
    tags: ['security', 'ethereum', 'bitcoin'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-24T15:00:00.000Z',
    updatedAt: '2026-09-24T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Post-Quantum Blockchains: Why Everyone Says 2029',
            summary: 'Ethereum has set December 2029 to become quantum-resistant, and a Bitcoin roadmap '
                + 'names the same year. What a quantum computer breaks, and what to do now.'
        },
        fa: {
            title: 'بلاک‌چین پساکوانتومی: چرا همه می‌گویند ۲۰۲۹',
            summary: 'اتریوم دسامبر ۲۰۲۹ را مهلت مقاوم‌شدن در برابر کوانتوم گذاشته و یک نقشه راه بیت‌کوین '
                + 'هم همین سال را می‌گوید. رایانه کوانتومی چه چیزی را می‌شکند و چه باید کرد.'
        },
        ar: {
            title: 'بلوكتشين ما بعد الكمّ: لماذا يقول الجميع 2029',
            summary: 'حددت إيثيريوم ديسمبر 2029 موعدًا لتصير مقاومة للكمّ، وخارطة طريق لبيتكوين تسمّي '
                + 'السنة نفسها. ما الذي يكسره الحاسوب الكمّي، وماذا تفعل الآن.'
        },
        es: {
            title: 'Blockchains poscuánticas: por qué todos dicen 2029',
            summary: 'Ethereum fija diciembre de 2029 para resistir ataques cuánticos; una hoja de ruta de '
                + 'Bitcoin cita ese año. Qué rompe una computadora cuántica y qué hacer hoy.'
        },
        pt: {
            title: 'Blockchains pós-quânticas: por que todo mundo fala em 2029',
            summary: 'A Ethereum fixou dezembro de 2029 para resistir a computadores quânticos, e um '
                + 'roteiro do Bitcoin cita o mesmo ano. O que um deles quebra e o que fazer agora.'
        },
        hi: {
            title: 'पोस्ट-क्वांटम ब्लॉकचेन: हर कोई 2029 क्यों कह रहा है',
            summary: 'Ethereum ने क्वांटम-रोधी बनने के लिए दिसंबर 2029 तय किया है, और Bitcoin का एक रोडमैप '
                + 'भी यही साल बताता है। क्वांटम कंप्यूटर क्या तोड़ता है, अभी क्या करें।'
        },
        zh: {
            title: '后量子区块链：为什么大家都说 2029 年',
            summary: '以太坊把实现抗量子的期限定在 2029 年 12 月，一份比特币路线图也指向同一年。量子计算机会破解什么，以及现在该做什么。'
        },
        ru: {
            title: 'Постквантовые блокчейны: почему все называют 2029 год',
            summary: 'Ethereum наметил квантовую устойчивость на декабрь 2029 года, и дорожная карта '
                + 'Bitcoin называет тот же год. Что ломает квантовый компьютер и что делать сейчас.'
        },
        fr: {
            title: 'Blockchains post-quantiques : pourquoi tout le monde dit 2029',
            summary: 'Ethereum vise décembre 2029 pour résister au quantique, et une feuille de route '
                + 'Bitcoin cite la même année. Ce que casse un ordinateur quantique, et que faire.'
        },
        tr: {
            title: 'Kuantum sonrası blok zincirleri: neden herkes 2029 diyor',
            summary: "Ethereum, kuantuma dayanıklı olmak için Aralık 2029'u belirledi; bir Bitcoin yol "
                + 'haritası da aynı yılı veriyor. Kuantum bilgisayar neyi kırar, şimdi ne yapmalı.'
        }
    }
};
