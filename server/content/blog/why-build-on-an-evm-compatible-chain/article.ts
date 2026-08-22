import type { Article } from '../types.ts';

/**
 * Primary keyword: "EVM-compatible blockchain". The cluster's widest, least Nura-specific
 * query - top of funnel.
 *
 * Written as a category explainer that happens to end with Nura as a worked example, rather
 * than as an argument for Nura wearing a neutral title. That ordering is what stops it
 * competing with `nura-chain-evm-compatibility`, which owns the chain-specific query: this
 * article answers "should I pick an EVM chain at all", that one answers "what does this one
 * implement". The evaluation checklist is the part worth ranking for, and it is deliberately
 * useful to somebody who then chooses a different chain entirely.
 */
export const article: Article = {
    slug: 'why-build-on-an-evm-compatible-chain',
    tags: ['evm', 'developers', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    // Carried over from the sqlite the store used to keep these in, not invented here:
    // these are the timestamps the cluster was actually published and last revised under.
    publishedAt: '2026-08-22T01:53:27.000Z',
    updatedAt: '2026-08-22T01:53:27.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Why Developers Choose an EVM-Compatible Blockchain',
            summary: 'What EVM compatibility buys, what it costs, and an eight-point checklist for '
                + 'evaluating any EVM chain in about ten minutes.'
        },
        fa: {
            title: 'چرا توسعه‌دهندگان زنجیره سازگار با EVM را انتخاب می‌کنند',
            summary: 'سازگاری با EVM چه می‌خرد، چه هزینه‌ای دارد، و یک فهرست هشت‌بندی برای سنجیدن هر '
                + 'زنجیره EVM در حدود ده دقیقه.'
        },
        ar: {
            title: 'لماذا يختار المطورون بلوكتشين متوافقة مع EVM',
            summary: 'ما الذي يشتريه التوافق مع EVM، وما يكلّفه، وقائمة من ثماني نقاط لتقييم أي سلسلة '
                + 'EVM في نحو عشر دقائق.'
        },
        es: {
            title: 'Por qué los desarrolladores eligen una blockchain compatible con EVM',
            summary: 'Qué compra la compatibilidad con EVM, qué cuesta y una lista de ocho puntos para '
                + 'evaluar cualquier cadena EVM en unos diez minutos.'
        },
        pt: {
            title: 'Por que desenvolvedores escolhem uma blockchain compatível com EVM',
            summary: 'O que a compatibilidade com EVM compra, o que ela custa e uma lista de oito pontos '
                + 'para avaliar qualquer cadeia EVM em cerca de dez minutos.'
        },
        hi: {
            title: 'डेवलपर EVM-संगत ब्लॉकचेन क्यों चुनते हैं',
            summary: 'EVM संगतता क्या ख़रीदती है, क्या ख़र्च कराती है, और किसी भी EVM चेन को क़रीब दस मिनट में '
                + 'परखने के लिए आठ-बिंदु सूची।'
        },
        zh: {
            title: '开发者为何选择 EVM 兼容区块链',
            summary: 'EVM 兼容买到了什么、代价是什么，'
                + '以及一份用大约十分钟评估任何 EVM 链的八点清单。'
        },
        ru: {
            title: 'Почему разработчики выбирают EVM-совместимый блокчейн',
            summary: 'Что покупает EVM-совместимость, чего она стоит, и список из восьми пунктов для '
                + 'оценки любой EVM-сети примерно за десять минут.'
        },
        fr: {
            title: 'Pourquoi les développeurs choisissent une blockchain compatible EVM',
            summary: 'Ce que la compatibilité EVM apporte, ce qu\'elle coûte, et une liste de huit points '
                + 'pour évaluer n\'importe quelle chaîne EVM en une dizaine de minutes.'
        },
        tr: {
            title: 'Geliştiriciler Neden EVM Uyumlu Bir Blok Zinciri Seçer',
            summary: 'EVM uyumluluğu neyi satın alır, neye mal olur ve herhangi bir EVM zincirini yaklaşık '
                + 'on dakikada değerlendirmek için sekiz maddelik bir kontrol listesi.'
        }
    }
};
