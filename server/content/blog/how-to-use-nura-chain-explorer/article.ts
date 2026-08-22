import type { Article } from '../types.ts';

/**
 * Primary keyword: "Nura Chain explorer". Navigational how-to.
 *
 * Deliberately teaches the explorer as a READER rather than an authority, and closes by
 * checking it against the RPC. That framing is what keeps the article honest about a tool this
 * repository does not own, and it avoids describing UI specifics that could drift - every
 * concrete instruction here is an RPC call, which cannot go stale the way a screenshot does.
 */
export const article: Article = {
    slug: 'how-to-use-nura-chain-explorer',
    tags: ['explorer', 'guides', 'nura-chain'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'How to Use the Nura Chain Block Explorer',
            summary: 'Reading transactions, addresses and blocks on Nura Explorer, what it cannot tell '
                + 'you, and how to check every figure it shows against the RPC endpoint.'
        },
        fa: {
            title: 'چگونه از کاوشگر بلاک نورا چین استفاده کنیم',
            summary: 'خواندن تراکنش‌ها، آدرس‌ها و بلاک‌ها در کاوشگر نورا، آنچه نمی‌تواند بگوید، و راه '
                + 'سنجیدن هر رقمی که نشان می‌دهد در برابر نقطه‌پایانی RPC.'
        },
        ar: {
            title: 'كيف تستخدم مستكشف الكتل في نورا تشين',
            summary: 'قراءة المعاملات والعناوين والكتل في مستكشف نورا، وما لا يستطيع إخبارك به، وكيف '
                + 'تقارن كل رقم يعرضه بنقطة نهاية RPC.'
        },
        es: {
            title: 'Cómo usar el explorador de bloques de Nura Chain',
            summary: 'Leer transacciones, direcciones y bloques en Nura Explorer, lo que no puede decirte '
                + 'y cómo contrastar cada dato que muestra con el endpoint RPC.'
        },
        pt: {
            title: 'Como usar o explorador de blocos da Nura Chain',
            summary: 'Ler transações, endereços e blocos no Nura Explorer, o que ele não pode lhe dizer e '
                + 'como conferir cada número que ele mostra contra o endpoint RPC.'
        },
        hi: {
            title: 'Nura Chain ब्लॉक एक्सप्लोरर कैसे इस्तेमाल करें',
            summary: 'Nura Explorer पर ट्रांज़ैक्शन, पते और ब्लॉक पढ़ना, वह क्या नहीं बता सकता, और उसके दिखाए '
                + 'हर आँकड़े को RPC एंडपॉइंट से कैसे मिलाएँ।'
        },
        zh: {
            title: '如何使用 Nura Chain 区块浏览器',
            summary: '在 Nura Explorer 上读交易、地址与区块，它无法告诉你什么，'
                + '以及如何把它展示的每个数字拿去与 RPC 端点核对。'
        },
        ru: {
            title: 'Как пользоваться обозревателем блоков Nura Chain',
            summary: 'Чтение транзакций, адресов и блоков в Nura Explorer, чего он сказать не может и как '
                + 'сверить каждую показанную им цифру с RPC-эндпоинтом.'
        },
        fr: {
            title: 'Comment utiliser l\'explorateur de blocs Nura Chain',
            summary: 'Lire transactions, adresses et blocs dans Nura Explorer, ce qu\'il ne peut pas vous '
                + 'dire, et comment recouper chaque chiffre affiché avec le point de terminaison RPC.'
        },
        tr: {
            title: 'Nura Chain Blok Gezgini Nasıl Kullanılır',
            summary: 'Nura Explorer üzerinde işlem, adres ve blok okumak; size neyi söyleyemeyeceği ve '
                + 'gösterdiği her rakamı RPC uç noktasıyla nasıl karşılaştıracağınız.'
        }
    }
};
