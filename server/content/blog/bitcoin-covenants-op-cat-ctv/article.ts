import type { Article } from '../types.ts';

/**
 * Covenants, the two opcodes proposed for them, and why Bitcoin has activated nothing
 * since Taproot.
 *
 * Primary keyword: "Bitcoin covenants". Hooked on Adam Back's endorsement of 1 October
 * 2026 and the stalled BIP 110 branch. The EVM comparison is the reason it sits on this
 * blog: what a covenant does is an ordinary contract here.
 */
export const article: Article = {
    slug: 'bitcoin-covenants-op-cat-ctv',
    tags: ['bitcoin', 'smart-contracts', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-03T08:00:00.000Z',
    updatedAt: '2026-10-03T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Bitcoin Covenants: OP_CAT, CTV and the Soft Fork Gridlock',
            summary: 'Bitcoin has not activated a soft fork since Taproot in 2021. Covenants via OP_CAT or '
                + 'CTV are the leading candidates. What they do, and why nothing ships.'
        },
        fa: {
            title: 'کاوننت‌های بیت‌کوین: OP_CAT، CTV و بن‌بست سافت فورک',
            summary: 'بیت‌کوین از Taproot در ۲۰۲۱ هیچ سافت فورکی فعال نکرده است. کاوننت‌ها با OP_CAT یا '
                + 'CTV نامزدهای اصلی‌اند. چه می‌کنند و چرا هیچ چیزی به نتیجه نمی‌رسد.'
        },
        ar: {
            title: 'عهود بيتكوين (covenants): OP_CAT وCTV ومأزق السوفت فورك',
            summary: 'لم تفعّل بيتكوين أي سوفت فورك منذ Taproot في 2021. والعهود عبر OP_CAT أو CTV أبرز '
                + 'المرشحين. ماذا تفعل، ولماذا لا يصدر شيء.'
        },
        es: {
            title: 'Covenants de Bitcoin: OP_CAT, CTV y el atasco del soft fork',
            summary: 'Bitcoin no activa un soft fork desde Taproot, en 2021. Los covenants con OP_CAT o '
                + 'CTV son los principales candidatos. Qué hacen y por qué no se activa nada.'
        },
        pt: {
            title: 'Covenants do Bitcoin: OP_CAT, CTV e o impasse dos soft forks',
            summary: 'O Bitcoin não ativa um soft fork desde o Taproot, em 2021. Covenants via OP_CAT ou '
                + 'CTV são os principais candidatos. O que fazem e por que nada é ativado.'
        },
        hi: {
            title: 'Bitcoin कोवेनेंट: OP_CAT, CTV और सॉफ़्ट फ़ोर्क का गतिरोध',
            summary: '2021 में Taproot के बाद Bitcoin ने कोई सॉफ़्ट फ़ोर्क सक्रिय नहीं किया। OP_CAT या CTV '
                + 'वाले कोवेनेंट प्रमुख दावेदार हैं। वे क्या करते हैं, और कुछ आता क्यों नहीं।'
        },
        zh: {
            title: '比特币限制条款（covenant）：OP_CAT、CTV 与软分叉僵局',
            summary: '自 2021 年的 Taproot 以来，比特币没有激活过任何软分叉。通过 OP_CAT 或 CTV 实现的限制条款是头号候选。它们能做什么，为什么迟迟无法落地。'
        },
        ru: {
            title: 'Ковенанты Bitcoin: OP_CAT, CTV и тупик с софтфорками',
            summary: 'Bitcoin не активировал софтфорков после Taproot в 2021 году. Главные кандидаты — '
                + 'ковенанты через OP_CAT или CTV. Что они делают и почему ничего не выходит.'
        },
        fr: {
            title: 'Covenants Bitcoin : OP_CAT, CTV et le blocage des soft forks',
            summary: "Bitcoin n'a activé aucun soft fork depuis Taproot en 2021. Les covenants, via OP_CAT "
                + 'ou CTV, sont les principaux candidats. Leur rôle, et pourquoi rien ne sort.'
        },
        tr: {
            title: "Bitcoin covenant'ları: OP_CAT, CTV ve tıkanan yumuşak çatallanma",
            summary: "Bitcoin 2021'deki Taproot'tan beri yumuşak çatallanma etkinleştirmedi. Baş adaylar "
                + "OP_CAT ya da CTV ile gelen covenant'lar. Ne yaparlar, neden bir şey çıkmıyor."
        }
    }
};
