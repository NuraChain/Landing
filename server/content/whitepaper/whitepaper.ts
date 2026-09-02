import type { WhitepaperHead } from './types.ts';

/**
 * The whitepaper's head. The bodies are the `<locale>.md` files beside this one.
 *
 * REVISION AND DATE ARE THE CONTRACT. The revision is printed on the page and on every PDF's
 * cover, and it is what a reader cites; `updatedAt` is what the sitemap reports as lastmod and
 * what the page prints beside the revision. A change to any body that a reader would notice
 * bumps both, in this file, and then `npm run whitepaper:pdf` re-renders the downloads - the
 * suite fails until it has been run, so the step cannot be forgotten.
 *
 * What the document may state is bounded by `application/src/lib/content/site.ts` and by what the
 * node answers over RPC. Every chain figure in the bodies - the chain id, the endpoints, the
 * block interval, the supply and the allocation - is a figure that file already states, and
 * every consensus claim was read from block headers on the date of this revision. A body must
 * not acquire a figure that neither source can back.
 */
export const WHITEPAPER: WhitepaperHead = {
    revision: '1.0',
    publishedAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
    defaultLocale: 'en',

    heads: {
        en: {
            title: 'Nura Chain Whitepaper',
            summary: 'The reference description of Nura Chain: an EVM network with chain ID 1020, '
                + 'three-second blocks, EIP-1559 fees, the NURA coin and its allocation, and what can '
                + 'be verified on chain.'
        },
        fa: {
            title: 'وایت‌پیپر نورا چین',
            summary: 'توصیف مرجع نورا چین: شبکه‌ای EVM با شناسه زنجیره ۱۰۲۰، بلاک‌های سه‌ثانیه‌ای، کارمزد '
                + 'EIP-1559، کوین NURA و تخصیص آن، و آنچه روی زنجیره بررسی‌پذیر است.'
        },
        ar: {
            title: 'الورقة البيضاء لنورا تشين',
            summary: 'الوصف المرجعي لنورا تشين: شبكة EVM بمعرّف السلسلة 1020، وكتل كل ثلاث ثوانٍ، ورسوم '
                + 'EIP-1559، وعملة NURA وتخصيصها، وما يمكن التحقق منه على السلسلة.'
        },
        es: {
            title: 'Whitepaper de Nura Chain',
            summary: 'Descripción de referencia de Nura Chain: red EVM con ID 1020, bloques de tres '
                + 'segundos, tarifas EIP-1559, la moneda NURA y su reparto, y qué se verifica en cadena.'
        },
        pt: {
            title: 'Whitepaper da Nura Chain',
            summary: 'Descrição de referência da Nura Chain: rede EVM com ID de cadeia 1020, blocos de 3 '
                + 'segundos, taxas EIP-1559, a moeda NURA e sua alocação, e o que se verifica na cadeia.'
        },
        hi: {
            title: 'Nura Chain व्हाइटपेपर',
            summary: 'Nura Chain का संदर्भ विवरण: चेन आईडी 1020 वाला EVM नेटवर्क, तीन सेकंड के ब्लॉक, EIP-1559 '
                + 'शुल्क, NURA कॉइन और उसका आवंटन, और चेन पर क्या जाँचा जा सकता है।'
        },
        zh: {
            title: 'Nura Chain 白皮书',
            summary: 'Nura Chain 的参考性说明：一条链 ID 为 1020、三秒出块、采用 EIP-1559 费用的 EVM 网络，'
                + 'NURA 代币及其分配，以及哪些内容可以在链上核实。'
        },
        ru: {
            title: 'Белая книга Nura Chain',
            summary: 'Справочное описание Nura Chain: EVM-сеть с chain ID 1020, трёхсекундные блоки, '
                + 'комиссии EIP-1559, монета NURA и её распределение — и что можно проверить в цепочке.'
        },
        fr: {
            title: 'Livre blanc de Nura Chain',
            summary: 'La référence de Nura Chain : un réseau EVM (chain ID 1020), blocs de trois secondes, '
                + 'frais EIP-1559, la monnaie NURA, sa répartition et ce qui se vérifie sur la chaîne.'
        },
        tr: {
            title: 'Nura Chain Teknik Dokümanı',
            summary: 'Nura Chain\'in başvuru tanımı: 1020 zincir kimlikli, üç saniyelik bloklu, EIP-1559 '
                + 'ücretli bir EVM ağı, NURA coini ve dağılımı, zincir üzerinde neyin doğrulanabildiği.'
        }
    }
};
