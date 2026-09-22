import type { Article } from '../types.ts';

/**
 * Ethereum's next fork, written for someone who ships Solidity rather than someone who
 * follows core-dev calls.
 *
 * Primary keyword: "Glamsterdam". News intent with a long tail - the upgrade is dated, the
 * explanation of block-level access lists is not. It links to the EVM-compatibility article
 * because the question it raises ("does my chain get this?") is answered there.
 */
export const article: Article = {
    slug: 'ethereum-glamsterdam-upgrade',
    tags: ['ethereum', 'evm', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-22T08:00:00.000Z',
    updatedAt: '2026-09-22T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: "Glamsterdam: Ethereum's Next Upgrade, Explained",
            summary: 'Block-level access lists and enshrined proposer-builder separation are the headline of '
                + "Ethereum's next fork. What they change for gas limits, nodes and your contracts."
        },
        fa: {
            title: 'Glamsterdam: ارتقای بعدی اتریوم به زبان ساده',
            summary: 'فهرست دسترسی در سطح بلاک و جداسازی پیشنهاددهنده و سازنده، سرفصل فورک بعدی اتریوم‌اند. '
                + 'تأثیرشان بر سقف گس، نودها و قراردادهای شما چیست.'
        },
        ar: {
            title: 'Glamsterdam: ترقية إيثيريوم القادمة بلغة واضحة',
            summary: 'قوائم الوصول على مستوى الكتلة وفصل المقترح عن الباني هما عنوان الفورك القادم. ما الذي '
                + 'يتغيّر في حدّ الغاز والعقد والعقود التي تنشرها.'
        },
        es: {
            title: 'Glamsterdam: la próxima actualización de Ethereum',
            summary: 'Las listas de acceso por bloque y la separación proponente-constructor son el titular '
                + 'del próximo fork. Qué cambian para el límite de gas, los nodos y tus contratos.'
        },
        pt: {
            title: 'Glamsterdam: a próxima atualização da Ethereum',
            summary: 'Listas de acesso em nível de bloco e separação propositor-construtor são o destaque do '
                + 'próximo fork. O que muda para o limite de gás, os nós e os seus contratos.'
        },
        hi: {
            title: 'Glamsterdam: Ethereum का अगला अपग्रेड, सरल भाषा में',
            summary: 'ब्लॉक-स्तरीय एक्सेस लिस्ट और प्रोटोकॉल में तय प्रपोज़र-बिल्डर विभाजन अगले फ़ोर्क की '
                + 'मुख्य बातें हैं। गैस लिमिट, नोड और आपके कॉन्ट्रैक्ट पर इनका क्या असर है।'
        },
        zh: {
            title: 'Glamsterdam：以太坊下一次升级详解',
            summary: '区块级访问列表与协议内置的提议者-构建者分离，是以太坊下一次分叉的重点。它们如何改变 gas 上限、节点，以及你部署的合约。'
        },
        ru: {
            title: 'Glamsterdam: следующее обновление Ethereum',
            summary: 'Списки доступа на уровне блока и закреплённое разделение предлагающего и сборщика — '
                + 'главное в следующем форке. Что меняется для лимита газа, нод и ваших контрактов.'
        },
        fr: {
            title: "Glamsterdam : la prochaine mise à jour d'Ethereum",
            summary: "Listes d'accès au niveau du bloc et séparation proposeur-constructeur inscrite : ce que "
                + 'le prochain fork change pour la limite de gaz, les nœuds et vos contrats.'
        },
        tr: {
            title: "Glamsterdam: Ethereum'un Sıradaki Yükseltmesi",
            summary: 'Blok düzeyinde erişim listeleri ve protokole yazılmış öneren-inşacı ayrımı sıradaki '
                + 'çatallanmanın başlığı. Gaz limiti, düğümler ve sözleşmeleriniz için ne değişiyor.'
        }
    }
};
