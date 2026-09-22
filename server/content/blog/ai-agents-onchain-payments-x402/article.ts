import type { Article } from '../types.ts';

/**
 * Machine-to-machine payment, described as a protocol rather than as a narrative.
 *
 * Primary keyword: "x402". The trend is loud in 2026 and mostly written as prediction; this
 * one states the mechanism - a 402 response carrying a price - and spends its second half on
 * the spending limits, because an agent with an unbounded key is the actual risk.
 */
export const article: Article = {
    slug: 'ai-agents-onchain-payments-x402',
    tags: ['payments', 'developers', 'stablecoins'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-19T08:00:00.000Z',
    updatedAt: '2026-09-19T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'HTTP 402, Finally: How AI Agents Pay Per Request',
            summary: 'The status code nobody ever used now settles machine-to-machine payments in stablecoins. '
                + 'How x402 works, and the limits worth putting around an agent that holds a key.'
        },
        fa: {
            title: 'بالاخره HTTP 402: پرداخت ایجنت‌های هوش مصنوعی به‌ازای هر درخواست',
            summary: 'کد وضعیتی که هیچ‌کس استفاده نمی‌کرد حالا پرداخت ماشین‌به‌ماشین را با استیبل‌کوین تسویه '
                + 'می‌کند. x402 چطور کار می‌کند و برای ایجنتی که کلید دارد چه محدودیتی لازم است.'
        },
        ar: {
            title: 'أخيرًا HTTP 402: كيف تدفع وكلاء الذكاء الاصطناعي لكل طلب',
            summary: 'رمز الحالة الذي لم يستخدمه أحد صار يسوّي مدفوعات الآلة للآلة بعملات مستقرة. كيف يعمل '
                + 'x402، وما الحدود التي تستحق أن تضعها حول وكيل يحمل مفتاحًا.'
        },
        es: {
            title: 'HTTP 402 por fin: cómo pagan los agentes de IA',
            summary: 'El código de estado que nadie usaba ya liquida pagos máquina a máquina en stablecoins. '
                + 'Cómo funciona x402 y qué límites conviene poner a un agente que guarda una clave.'
        },
        pt: {
            title: 'HTTP 402, enfim: como agentes de IA pagam por requisição',
            summary: 'O código de status que ninguém usava agora liquida pagamentos máquina a máquina em '
                + 'stablecoins. Como o x402 funciona e que limites impor a um agente que guarda uma chave.'
        },
        hi: {
            title: 'आख़िरकार HTTP 402: AI एजेंट हर अनुरोध का भुगतान कैसे करते हैं',
            summary: 'जिस स्टेटस कोड को कोई इस्तेमाल नहीं करता था, वह अब मशीन-से-मशीन भुगतान स्टेबलकॉइन में '
                + 'निपटाता है। x402 कैसे काम करता है, और चाबी रखने वाले एजेंट पर कौन-सी सीमाएँ लगानी चाहिए।'
        },
        zh: {
            title: 'HTTP 402 终于派上用场：AI 代理如何按次付费',
            summary: '那个从没人用的状态码，如今用稳定币结算机器对机器的付款。x402 如何运作，以及给一个握有私钥的代理该设哪些限额。'
        },
        ru: {
            title: 'HTTP 402 наконец пригодился: как ИИ-агенты платят за запрос',
            summary: 'Код состояния, которым никто не пользовался, теперь рассчитывает платежи между машинами '
                + 'в стейблкоинах. Как устроен x402 и какие лимиты нужны агенту с ключом.'
        },
        fr: {
            title: 'HTTP 402 enfin utile : comment les agents IA paient',
            summary: "Le code de statut que personne n'utilisait règle désormais des paiements machine à "
                + "machine en stablecoins. Comment fonctionne x402, et les limites à poser autour d'un "
                + 'agent.'
        },
        tr: {
            title: 'Nihayet HTTP 402: Yapay zekâ ajanları istek başına nasıl ödüyor',
            summary: 'Kimsenin kullanmadığı durum kodu artık makineler arası ödemeleri stablecoin ile '
                + 'kapatıyor. x402 nasıl işliyor ve anahtar taşıyan bir ajanın etrafına hangi sınırlar '
                + 'konmalı.'
        }
    }
};
