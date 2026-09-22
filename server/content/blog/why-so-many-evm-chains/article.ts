import type { Article } from '../types.ts';

/**
 * Why the chain count keeps climbing, written without pretending this site is not one of
 * the entries.
 *
 * Primary keyword: "how many EVM chains". Informational intent with a evaluative tail - the
 * checklist at the end is the part somebody bookmarks, and it applies to Nura Chain as
 * squarely as to anything else.
 */
export const article: Article = {
    slug: 'why-so-many-evm-chains',
    tags: ['evm', 'guides', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-15T08:00:00.000Z',
    updatedAt: '2026-09-15T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Eighty EVM Chains: Why They Keep Multiplying',
            summary: 'Copying the toolchain is free. Everything that makes a network worth using is not. What '
                + 'actually carries over between EVM chains, and how to judge one you have just met.'
        },
        fa: {
            title: 'هشتاد زنجیره EVM: چرا مدام زیاد می‌شوند',
            summary: 'تکرار زنجیره ابزار رایگان است؛ هر چیزی که یک شبکه را ارزشمند می‌کند نه. چه چیزی میان '
                + 'زنجیره‌های EVM واقعاً منتقل می‌شود و زنجیره‌ای تازه را چگونه بسنجیم.'
        },
        ar: {
            title: 'ثمانون سلسلة EVM: لماذا تتكاثر بلا توقف',
            summary: 'نسخ سلسلة الأدوات مجاني، أما كل ما يجعل الشبكة جديرة بالاستخدام فليس كذلك. ما الذي ينتقل '
                + 'فعلًا بين سلاسل EVM، وكيف تحكم على سلسلة قابلتها للتو.'
        },
        es: {
            title: 'Ochenta cadenas EVM: por qué no dejan de multiplicarse',
            summary: 'Copiar el conjunto de herramientas es gratis. Todo lo que hace útil a una red, no. Qué '
                + 'se traslada de verdad entre cadenas EVM y cómo juzgar una que acabas de conocer.'
        },
        pt: {
            title: 'Oitenta redes EVM: por que elas não param de se multiplicar',
            summary: 'Copiar o ferramental é de graça. Tudo o que faz uma rede valer a pena, não é. O que de '
                + 'fato se transfere entre redes EVM e como avaliar uma que você acabou de conhecer.'
        },
        hi: {
            title: 'अस्सी EVM चेन: ये लगातार बढ़ती क्यों जा रही हैं',
            summary: 'टूलचेन की नकल मुफ़्त है; जो चीज़ें किसी नेटवर्क को इस्तेमाल लायक़ बनाती हैं वे नहीं। EVM '
                + 'चेन के बीच असल में क्या साथ जाता है, और अभी-अभी मिली किसी चेन को कैसे परखें।'
        },
        zh: {
            title: '八十条 EVM 链：为什么它们还在不断增加',
            summary: '复制工具链是免费的，而让一条网络值得使用的一切都不是。EVM 链之间究竟有什么会带过去，以及怎样评判一条刚遇到的链。'
        },
        ru: {
            title: 'Восемьдесят EVM-сетей: почему их всё больше',
            summary: 'Скопировать инструментарий ничего не стоит. Всё, что делает сеть пригодной, стоит '
                + 'дорого. Что действительно переносится между EVM-сетями и как оценить незнакомую.'
        },
        fr: {
            title: 'Quatre-vingts chaînes EVM : pourquoi elles se multiplient',
            summary: "Copier l'outillage est gratuit. Tout ce qui rend un réseau utile ne l'est pas. Ce qui se "
                + 'transfère réellement entre chaînes EVM, et comment juger celle que vous découvrez.'
        },
        tr: {
            title: 'Seksen EVM zinciri: neden çoğalmaya devam ediyorlar',
            summary: 'Araç zincirini kopyalamak bedava; bir ağı kullanmaya değer kılan her şey değil. EVM '
                + 'zincirleri arasında gerçekte ne taşınır ve yeni tanıştığınız bir zinciri nasıl '
                + 'tartarsınız.'
        }
    }
};
