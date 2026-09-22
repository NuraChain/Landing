import type { Article } from '../types.ts';

/**
 * The 2026 security numbers, read as what they say rather than as what the headline says.
 *
 * Primary keyword: "audited contracts hacked". The two figures people quote against each other
 * - 88% of losses at audited protocols, 11% of incidents from in-scope contract bugs - are not
 * in conflict, and explaining why they agree is the whole reason this article exists.
 */
export const article: Article = {
    slug: 'why-audited-contracts-get-drained',
    tags: ['security', 'smart-contracts', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-17T08:00:00.000Z',
    updatedAt: '2026-09-17T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Why Audited Contracts Still Get Drained',
            summary: 'Audited protocols account for 88% of funds stolen since 2025, while in-scope contract '
                + 'bugs cause about 11% of incidents. Both are true. Here is what an audit never covered.'
        },
        fa: {
            title: 'چرا قراردادهای ممیزی‌شده باز هم خالی می‌شوند',
            summary: 'پروتکل‌های ممیزی‌شده ۸۸٪ وجوه سرقت‌شده از ۲۰۲۵ را به خود دیده‌اند، در حالی که باگ‌های '
                + 'قرارداد حدود ۱۱٪ حوادث را می‌سازند. هر دو درست‌اند؛ ممیزی هرگز چه چیزی را پوشش نداد.'
        },
        ar: {
            title: 'لماذا تُستنزف العقود المدققة رغم التدقيق',
            summary: 'تستأثر البروتوكولات المدققة بـ88% من الأموال المسروقة منذ 2025، بينما تسبب ثغرات العقود '
                + 'نحو 11% من الحوادث. الأمران صحيحان. وإليك ما لم يغطه التدقيق قط.'
        },
        es: {
            title: 'Por qué los contratos auditados siguen vaciándose',
            summary: 'Los protocolos auditados concentran el 88% de los fondos robados desde 2025, y los '
                + 'fallos de contrato causan un 11% de los incidentes. Ambas cosas son ciertas. Esto es por '
                + 'qué.'
        },
        pt: {
            title: 'Por que contratos auditados continuam sendo drenados',
            summary: 'Protocolos auditados respondem por 88% dos fundos roubados desde 2025, enquanto falhas '
                + 'de contrato causam cerca de 11% dos incidentes. Ambas são verdade. Eis o que a auditoria '
                + 'não vê.'
        },
        hi: {
            title: 'ऑडिट किए गए कॉन्ट्रैक्ट फिर भी क्यों खाली हो जाते हैं',
            summary: '2025 से चोरी हुई राशि का 88% ऑडिटेड प्रोटोकॉल से गया, जबकि कॉन्ट्रैक्ट की खामियाँ लगभग '
                + '11% घटनाओं की वजह हैं। दोनों सच हैं। ऑडिट ने जो कभी नहीं देखा, वह यह है।'
        },
        zh: {
            title: '为什么审计过的合约照样被掏空',
            summary: '自 2025 年以来被盗资金的 88% 出自审计过的协议，而合约本身的漏洞只占约 11% 的事件。两个数字都成立。问题在于审计从来没覆盖的地方。'
        },
        ru: {
            title: 'Почему проаудированные контракты всё равно выносят',
            summary: 'На проаудированные протоколы приходится 88% украденного с 2025 года, а ошибки в самих '
                + 'контрактах дают около 11% инцидентов. Верно и то и другое. Вот чего аудит не покрывал.'
        },
        fr: {
            title: 'Pourquoi des contrats audités se font quand même vider',
            summary: 'Les protocoles audités concentrent 88 % des fonds volés depuis 2025, tandis que les bugs '
                + "de contrat causent 11 % des incidents. Les deux sont vrais. Voici ce que l'audit ignore."
        },
        tr: {
            title: 'Denetlenmiş sözleşmeler neden hâlâ boşaltılıyor',
            summary: "2025'ten bu yana çalınan fonların %88'i denetlenmiş protokollerden; sözleşme hataları "
                + 'ise olayların yaklaşık %11’i. İkisi de doğru. Denetimin hiç kapsamadığı yer burası.'
        }
    }
};
