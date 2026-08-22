import type { Article } from '../types.ts';

/**
 * Primary keyword: "add Nura Chain to wallet". Navigational how-to, and the only article in
 * the cluster written for a HOLDER rather than a developer.
 *
 * That audience split is why it does not compete with `connect-to-nura-chain-rpc` despite both
 * carrying the same six values: this one ends at a working wallet, that one ends at a working
 * client library, and neither repeats the other's ground.
 */
export const article: Article = {
    slug: 'add-nura-chain-to-your-wallet',
    tags: ['wallet', 'guides', 'nura-chain'],
    defaultLocale: 'en',
    status: 'published',

    // Carried over from the sqlite the store used to keep these in, not invented here:
    // these are the timestamps the cluster was actually published and last revised under.
    publishedAt: '2026-08-22T01:10:54.000Z',
    updatedAt: '2026-08-22T01:53:27.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'How to Add Nura Chain to MetaMask and Other Wallets',
            summary: 'The six values your wallet asks for, the one-click EIP-3085 route, the manual '
                + 'steps, and how to verify chain ID 1020 before you send anything.'
        },
        fa: {
            title: 'چگونه نورا چین را به متامسک و دیگر کیف پول‌ها بیفزاییم',
            summary: 'شش مقداری که کیف پولتان می‌خواهد، مسیر یک‌کلیکی EIP-3085، مراحل دستی، و راه '
                + 'راستی‌آزمایی شناسه زنجیره ۱۰۲۰ پیش از فرستادن هر چیزی.'
        },
        ar: {
            title: 'كيف تضيف نورا تشين إلى MetaMask ومحافظ أخرى',
            summary: 'القيم الست التي تطلبها محفظتك، وطريق EIP-3085 بنقرة واحدة، والخطوات اليدوية، '
                + 'وكيف تتحقق من معرّف السلسلة 1020 قبل أن ترسل أي شيء.'
        },
        es: {
            title: 'Cómo añadir Nura Chain a MetaMask y otras carteras',
            summary: 'Los seis valores que pide tu cartera, la vía de un clic con EIP-3085, los pasos '
                + 'manuales y cómo verificar el ID de cadena 1020 antes de enviar nada.'
        },
        pt: {
            title: 'Como adicionar a Nura Chain à MetaMask e outras carteiras',
            summary: 'Os seis valores que sua carteira pede, o caminho de um clique com EIP-3085, os passos '
                + 'manuais e como verificar o ID de cadeia 1020 antes de enviar qualquer coisa.'
        },
        hi: {
            title: 'MetaMask और अन्य वॉलेट में Nura Chain कैसे जोड़ें',
            summary: 'आपके वॉलेट को चाहिए वे छह मान, EIP-3085 वाला एक-क्लिक रास्ता, मैनुअल क़दम, और कुछ भी '
                + 'भेजने से पहले चेन आईडी 1020 जाँचने का तरीक़ा।'
        },
        zh: {
            title: '如何把 Nura Chain 添加到 MetaMask 及其他钱包',
            summary: '钱包索取的六个值、EIP-3085 一键添加、手动步骤，'
                + '以及在发送任何东西之前如何核验链 ID 1020。'
        },
        ru: {
            title: 'Как добавить Nura Chain в MetaMask и другие кошельки',
            summary: 'Шесть значений, которые запрашивает кошелёк, путь в один клик через EIP-3085, ручные '
                + 'шаги и проверка chain ID 1020 перед тем, как что-либо отправлять.'
        },
        fr: {
            title: 'Ajouter Nura Chain à MetaMask et aux autres portefeuilles',
            summary: 'Les six valeurs demandées par votre portefeuille, la voie EIP-3085 en un clic, les '
                + 'étapes manuelles et la vérification du chain ID 1020 avant tout envoi.'
        },
        tr: {
            title: 'Nura Chain MetaMask ve Diğer Cüzdanlara Nasıl Eklenir',
            summary: 'Cüzdanınızın istediği altı değer, EIP-3085 ile tek tıklık yol, elle ekleme adımları '
                + 've bir şey göndermeden önce zincir kimliği 1020 doğrulaması.'
        }
    }
};
