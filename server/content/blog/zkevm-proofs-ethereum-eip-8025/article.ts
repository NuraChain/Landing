import type { Article } from '../types.ts';

/**
 * Verifying a block from a proof instead of re-running it, for a reader who ships
 * contracts rather than follows the research.
 *
 * Primary keyword: "zkEVM proofs". EIP-8025 is PROPOSED for Hegota, not scheduled, and
 * ethereum.org lists Hegota as planned for Q2 2027 with no confirmed date - both are
 * stated as such. It makes no claim about how Nura Chain's nodes validate, on purpose.
 */
export const article: Article = {
    slug: 'zkevm-proofs-ethereum-eip-8025',
    tags: ['ethereum', 'evm', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-27T08:00:00.000Z',
    updatedAt: '2026-09-27T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'zkEVM Proofs on Ethereum L1: What EIP-8025 Changes',
            summary: 'EIP-8025 would let Ethereum validators check a block by verifying a zkEVM proof '
                + 'instead of re-running it. What real-time proving means and what stays the same.'
        },
        fa: {
            title: 'اثبات zkEVM در لایه یک اتریوم: EIP-8025 چه چیزی را عوض می‌کند',
            summary: 'EIP-8025 به اعتبارسنج‌های اتریوم اجازه می‌دهد بلاک را به‌جای بازاجرا، با '
                + 'راستی‌آزمایی یک اثبات zkEVM بررسی کنند. اثبات بلادرنگ یعنی چه و چه چیزی عوض نمی‌شود.'
        },
        ar: {
            title: 'إثباتات zkEVM على الطبقة الأولى لإيثيريوم: ماذا يغيّر EIP-8025',
            summary: 'يقترح EIP-8025 أن يفحص مدققو إيثيريوم الكتلة بالتحقق من إثبات zkEVM بدل إعادة '
                + 'تنفيذها. ما معنى الإثبات في الزمن الحقيقي، وما الذي يبقى كما هو.'
        },
        es: {
            title: 'Pruebas zkEVM en la L1 de Ethereum: qué cambia EIP-8025',
            summary: 'EIP-8025 permitiría a los validadores de Ethereum comprobar un bloque con una prueba '
                + 'zkEVM en vez de reejecutarlo. Qué es probar en tiempo real y qué no cambia.'
        },
        pt: {
            title: 'Provas zkEVM na L1 da Ethereum: o que a EIP-8025 muda',
            summary: 'A EIP-8025 permitiria aos validadores da Ethereum conferir um bloco verificando uma '
                + 'prova zkEVM em vez de reexecutá-lo. O que muda e o que continua igual.'
        },
        hi: {
            title: 'Ethereum L1 पर zkEVM प्रूफ़: EIP-8025 क्या बदलता है',
            summary: 'प्रस्तावित EIP-8025 से Ethereum वैलिडेटर ब्लॉक को दोबारा चलाने के बजाय zkEVM प्रूफ़ '
                + 'सत्यापित करके जाँच सकेंगे। रियल-टाइम प्रूविंग का मतलब, और क्या नहीं बदलता।'
        },
        zh: {
            title: '以太坊 L1 上的 zkEVM 证明：EIP-8025 改变了什么',
            summary: 'EIP-8025 拟让以太坊验证者通过验证一份 zkEVM 证明来检查区块，而不必重新执行一遍。实时证明意味着什么，哪些东西保持不变。'
        },
        ru: {
            title: 'zkEVM-доказательства в Ethereum L1: что меняет EIP-8025',
            summary: 'EIP-8025 позволил бы валидаторам Ethereum проверять блок по zkEVM-доказательству, не '
                + 'исполняя его заново. Что значит «в реальном времени» и что не меняется.'
        },
        fr: {
            title: "Preuves zkEVM sur la L1 d'Ethereum : ce que change EIP-8025",
            summary: 'EIP-8025 permettrait aux validateurs Ethereum de contrôler un bloc en vérifiant une '
                + 'preuve zkEVM au lieu de le réexécuter. Temps réel, et ce qui ne change pas.'
        },
        tr: {
            title: "Ethereum L1'de zkEVM kanıtları: EIP-8025 neyi değiştiriyor",
            summary: 'EIP-8025, Ethereum doğrulayıcılarının bir bloğu yeniden çalıştırmak yerine zkEVM '
                + 'kanıtını doğrulayarak denetlemesini öneriyor. Gerçek zamanlı kanıtlama nedir.'
        }
    }
};
