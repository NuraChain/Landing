import type { Article } from '../types.ts';

/**
 * J.P. Morgan Asset Management's 22 October 2026 move of MONY and JLTXX onto Solana.
 *
 * Primary keyword: "JPMorgan tokenized money market fund". The event is the firm's own
 * release; every size is rwa.xyz's as viewed on 23 October and the eligibility figures are
 * the WSJ's via Cryptonews, so each is attributed in the body. The release names no partner
 * for the Solana move, so neither does this article. Fund sizes move daily.
 */
export const article: Article = {
    slug: 'jpmorgan-tokenized-money-market-funds-solana',
    tags: ['rwa', 'stablecoins', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T12:00:00.000Z',
    updatedAt: '2026-10-23T12:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'JPMorgan Takes Two Tokenized Money Market Funds to Solana',
            summary: 'J.P. Morgan Asset Management opened its MONY and JLTXX funds on Solana on 22 October '
                + '2026 for qualified US investors. What they hold and who can buy them.'
        },
        fa: {
            title: 'جی‌پی مورگان دو صندوق بازار پول توکنی را به سولانا برد',
            summary: 'J.P. Morgan Asset Management در ۲۲ اکتبر ۲۰۲۶ صندوق‌های MONY و JLTXX را برای '
                + 'سرمایه‌گذاران واجد شرایط آمریکایی روی سولانا عرضه کرد. چه دارند و چه کسی می‌تواند بخرد.'
        },
        ar: {
            title: 'جي بي مورغان تنقل صندوقَي سوق نقد مرمّزين إلى سولانا',
            summary: 'أتاحت J.P. Morgan Asset Management صندوقَي MONY وJLTXX على سولانا في 22 أكتوبر 2026 '
                + 'للمستثمرين الأمريكيين المؤهلين. ماذا يحملان ومن يمكنه شراؤهما.'
        },
        es: {
            title: 'JPMorgan lleva dos fondos monetarios tokenizados a Solana',
            summary: 'J.P. Morgan Asset Management abrió sus fondos MONY y JLTXX en Solana el 22 de octubre '
                + 'de 2026 para inversores cualificados de EE. UU. Qué tienen y quién puede comprarlos.'
        },
        pt: {
            title: 'JPMorgan leva dois fundos monetários tokenizados à Solana',
            summary: 'A J.P. Morgan Asset Management abriu os fundos MONY e JLTXX na Solana em 22 de outubro '
                + 'de 2026 para investidores qualificados dos EUA. O que têm e quem pode comprar.'
        },
        hi: {
            title: 'JPMorgan दो टोकनाइज़्ड मनी मार्केट फ़ंड Solana पर लाया',
            summary: 'J.P. Morgan Asset Management ने 22 अक्टूबर 2026 को योग्य अमेरिकी निवेशकों के लिए '
                + 'MONY और JLTXX फ़ंड Solana पर खोले। इनमें क्या है और कौन ख़रीद सकता है।'
        },
        zh: {
            title: '摩根大通把两只代币化货币市场基金带上 Solana',
            summary: '2026 年 10 月 22 日，J.P. Morgan Asset Management 面向美国合格投资者在 Solana 上开放了 MONY 和 JLTXX 两只基金。它们持有什么，谁能买。'
        },
        ru: {
            title: 'JPMorgan: два токенизированных фонда денежного рынка в Solana',
            summary: '22 октября 2026 года J.P. Morgan Asset Management открыла фонды MONY и JLTXX в Solana '
                + 'для квалифицированных инвесторов из США. Что в них и кто может их купить.'
        },
        fr: {
            title: 'JPMorgan porte deux fonds monétaires tokenisés sur Solana',
            summary: "J.P. Morgan Asset Management a ouvert ses fonds MONY et JLTXX sur Solana le 22 octobre "
                + "2026 aux investisseurs qualifiés américains. Ce qu'ils détiennent, qui peut acheter."
        },
        tr: {
            title: "JPMorgan iki tokenize para piyasası fonunu Solana'ya taşıdı",
            summary: "J.P. Morgan Asset Management, MONY ve JLTXX fonlarını 22 Ekim 2026'da nitelikli ABD "
                + "yatırımcıları için Solana'da açtı. Fonlar neyi tutuyor, kimler alabilir."
        }
    }
};
