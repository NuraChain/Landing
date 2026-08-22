import type { Article } from '../types.ts';

/**
 * Primary keyword: "Nura Chain EVM". Informational, but technical - the reader already knows
 * what a blockchain is and wants to know what this one implements.
 *
 * Deliberately does NOT compete with `why-build-on-an-evm-compatible-chain`, which owns the
 * generic "EVM-compatible blockchain" query. This one is specific to Nura and leads with
 * values a reader can verify against the live endpoint; that one is a category explainer.
 */
export const article: Article = {
    slug: 'nura-chain-evm-compatibility',
    tags: ['evm', 'nura-chain', 'developers'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'Nura Chain EVM: How Ethereum Bytecode Runs Here',
            summary: 'What EVM compatibility means on Nura Chain, how to verify it from the RPC '
                + 'endpoint yourself, and the four things it does not give you.'
        },
        fa: {
            title: 'EVM در نورا چین: بایت‌کد اتریوم اینجا چگونه اجرا می‌شود',
            summary: 'سازگاری با EVM در نورا چین یعنی چه، چگونه خودتان آن را از نقطه‌پایانی RPC '
                + 'راستی‌آزمایی کنید، و چهار چیزی که این سازگاری به شما نمی‌دهد.'
        },
        ar: {
            title: 'EVM في نورا تشين: كيف يعمل بايت كود إيثريوم هنا',
            summary: 'ماذا يعني التوافق مع EVM في نورا تشين، وكيف تتحقق منه بنفسك عبر نقطة RPC، '
                + 'والأمور الأربعة التي لا يمنحك إياها هذا التوافق.'
        },
        es: {
            title: 'Nura Chain y la EVM: cómo se ejecuta el bytecode',
            summary: 'Qué significa la compatibilidad con EVM en Nura Chain, cómo verificarla tú mismo '
                + 'desde el endpoint RPC y las cuatro cosas que no te da.'
        },
        pt: {
            title: 'Nura Chain e a EVM: como o bytecode roda aqui',
            summary: 'O que significa compatibilidade com EVM na Nura Chain, como verificar isso você mesmo '
                + 'pelo endpoint RPC e as quatro coisas que ela não lhe dá.'
        },
        hi: {
            title: 'Nura Chain EVM: Ethereum बाइटकोड यहाँ कैसे चलता है',
            summary: 'Nura Chain पर EVM संगतता का क्या अर्थ है, RPC एंडपॉइंट से इसे स्वयं कैसे सत्यापित करें, '
                + 'और वे चार चीज़ें जो यह आपको नहीं देती।'
        },
        zh: {
            title: 'Nura Chain 与 EVM：字节码在这里如何执行',
            summary: 'EVM 兼容在 Nura Chain 上意味着什么、如何自己通过 RPC 端点验证，'
                + '以及它并不提供的四件事。'
        },
        ru: {
            title: 'Nura Chain и EVM: как здесь исполняется байт-код',
            summary: 'Что означает EVM-совместимость в Nura Chain, как проверить её самостоятельно через '
                + 'RPC-эндпоинт и четыре вещи, которых она не даёт.'
        },
        fr: {
            title: 'Nura Chain et l\'EVM : comment le bytecode s\'exécute',
            summary: 'Ce que signifie la compatibilité EVM sur Nura Chain, comment la vérifier vous-même '
                + 'depuis le point de terminaison RPC, et les quatre choses qu\'elle ne donne pas.'
        },
        tr: {
            title: 'Nura Chain ve EVM: Bayt Kodu Burada Nasıl Çalışır',
            summary: 'Nura Chain üzerinde EVM uyumluluğunun ne anlama geldiği, bunu RPC uç noktasından '
                + 'kendiniz nasıl doğrulayacağınız ve size vermediği dört şey.'
        }
    }
};
