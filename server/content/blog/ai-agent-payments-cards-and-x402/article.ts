import type { Article } from '../types.ts';

/**
 * The week agents paid on two rails: Mastercard's first agent card payments on
 * 21 September 2026 and Block adding Lightning to x402 on the 25th.
 *
 * Primary keyword: "AI agent payments". A comparison piece that leans on the existing
 * x402 article for the mechanism instead of repeating it. The x402 volume figures are the
 * protocol's own and are labelled self-reported.
 */
export const article: Article = {
    slug: 'ai-agent-payments-cards-and-x402',
    tags: ['payments', 'stablecoins', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-28T08:00:00.000Z',
    updatedAt: '2026-09-28T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'AI Agent Payments: Cards and Crypto Race for the Same Job',
            summary: 'In one week Mastercard ran its first AI agent card payments in Denmark and Canada, '
                + 'and Block added Lightning to x402. Two ways for software to pay, compared.'
        },
        fa: {
            title: 'پرداخت ایجنت‌های هوش مصنوعی: رقابت کارت و کریپتو بر سر یک کار',
            summary: 'در یک هفته Mastercard نخستین پرداخت کارتی ایجنت هوش مصنوعی را در دانمارک و کانادا '
                + 'اجرا کرد و Block لایتنینگ را به x402 افزود. مقایسه دو راه پرداخت نرم‌افزار.'
        },
        ar: {
            title: 'مدفوعات وكلاء الذكاء الاصطناعي: سباق البطاقات والكريبتو',
            summary: 'في أسبوع واحد أجرت Mastercard أولى مدفوعات بطاقات بوكيل ذكاء اصطناعي في الدنمارك '
                + 'وكندا، وأضافت Block Lightning إلى x402. مقارنة بين طريقتين تدفع بهما البرمجيات.'
        },
        es: {
            title: 'Pagos de agentes de IA: tarjetas y cripto van por lo mismo',
            summary: 'En una semana, Mastercard estrenó pagos con tarjeta de agentes de IA en Dinamarca y '
                + 'Canadá, y Block añadió Lightning a x402. Dos formas de pagar, comparadas.'
        },
        pt: {
            title: 'Pagamentos de agentes de IA: cartões e cripto na mesma disputa',
            summary: 'Numa semana, a Mastercard fez os primeiros pagamentos por agentes de IA na Dinamarca '
                + 'e no Canadá, e a Block levou a Lightning ao x402. Duas formas, comparadas.'
        },
        hi: {
            title: 'AI एजेंट भुगतान: कार्ड और क्रिप्टो एक ही काम की दौड़ में',
            summary: 'एक हफ़्ते में Mastercard ने डेनमार्क और कनाडा में पहले AI एजेंट कार्ड भुगतान किए; '
                + 'Block ने x402 में Lightning जोड़ा। सॉफ़्टवेयर भुगतान के दो तरीक़ों की तुलना।'
        },
        zh: {
            title: 'AI 代理支付：银行卡与加密货币争抢同一份差事',
            summary: '一周之内，Mastercard 在丹麦和加拿大完成了首批 AI 代理银行卡付款，Block 为 x402 加入了闪电网络。软件付款的两种方式对比。'
        },
        ru: {
            title: 'Платежи ИИ-агентов: карты и крипта спорят за одну задачу',
            summary: 'За неделю Mastercard провела первые платежи ИИ-агентов картой в Дании и Канаде, а '
                + 'Block добавила Lightning в x402. Сравниваем два способа платить для программ.'
        },
        fr: {
            title: 'Paiements par agents IA : cartes et crypto visent le même rôle',
            summary: 'En une semaine, Mastercard a mené ses premiers paiements par agent IA au Danemark et '
                + 'au Canada, et Block a ajouté Lightning à x402. Deux façons de payer.'
        },
        tr: {
            title: 'Yapay zekâ ajanı ödemeleri: kart ve kripto aynı işe talip',
            summary: "Bir haftada Mastercard, Danimarka ve Kanada'da ilk yapay zekâ ajanı kart ödemelerini "
                + "yaptı; Block x402'ye Lightning ekledi. Yazılımın iki ödeme yolu, yan yana."
        }
    }
};
