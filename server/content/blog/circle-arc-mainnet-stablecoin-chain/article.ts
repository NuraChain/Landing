import type { Article } from '../types.ts';

/**
 * Circle's Arc going public on 16 September 2026: fees in USDC, institutions as
 * validators, and what that trade buys.
 *
 * Primary keyword: "Circle Arc". It states what Nura Chain does instead - fees in NURA
 * under an EIP-1559 base fee, three-second blocks - as a different promise, not a better
 * one. Those values come from lib/content/site.ts and move with it.
 */
export const article: Article = {
    slug: 'circle-arc-mainnet-stablecoin-chain',
    tags: ['stablecoins', 'payments', 'evm'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-25T15:00:00.000Z',
    updatedAt: '2026-09-25T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: "Circle's Arc Mainnet: A Chain Where Gas Is Paid in USDC",
            summary: 'Circle opened its Arc blockchain to the public on 16 September 2026, with fees paid '
                + 'in USDC and institutions as validators. What a stablecoin chain is for.'
        },
        fa: {
            title: 'شبکه اصلی Arc از Circle: زنجیره‌ای که گس را با USDC می‌پردازید',
            summary: 'Circle در ۱۶ سپتامبر ۲۰۲۶ بلاک‌چین Arc را به روی عموم گشود؛ با کارمزد به USDC و '
                + 'نهادها در نقش اعتبارسنج. زنجیره استیبل‌کوین به چه کاری می‌آید.'
        },
        ar: {
            title: 'Arc من Circle على الشبكة الرئيسية: سلسلة يُدفع غازها بـ USDC',
            summary: 'فتحت Circle بلوكتشين Arc للجمهور في 16 سبتمبر 2026، برسوم تُدفع بـ USDC ومؤسسات تؤدي '
                + 'دور المدققين. ما الغرض من سلسلة للعملات المستقرة.'
        },
        es: {
            title: 'Arc de Circle en red principal: el gas se paga en USDC',
            summary: 'Circle abrió Arc al público el 16 de septiembre de 2026, con comisiones en USDC e '
                + 'instituciones como validadores. Para qué sirve una cadena de stablecoins.'
        },
        pt: {
            title: 'Arc, da Circle, na rede principal: o gás é pago em USDC',
            summary: 'A Circle abriu sua blockchain Arc ao público em 16 de setembro de 2026, com taxas '
                + 'pagas em USDC e instituições como validadores. Para que serve uma rede assim.'
        },
        hi: {
            title: 'Circle का Arc मेननेट: वह चेन जहाँ गैस USDC में चुकती है',
            summary: 'Circle ने 16 सितंबर 2026 को अपना Arc ब्लॉकचेन सबके लिए खोला; फ़ीस USDC में चुकती है '
                + 'और वैलिडेटर संस्थाएँ हैं। स्टेबलकॉइन चेन किस काम की है।'
        },
        zh: {
            title: 'Circle 的 Arc 主网：一条用 USDC 付 gas 的链',
            summary: 'Circle 于 2026 年 9 月 16 日向公众开放 Arc 区块链，手续费用 USDC 支付，由机构担任验证者。一条稳定币链是用来做什么的。'
        },
        ru: {
            title: 'Arc от Circle: основная сеть, где за газ платят в USDC',
            summary: '16 сентября 2026 года Circle открыла блокчейн Arc для всех: комиссии платятся в '
                + 'USDC, валидаторы — организации. Для чего нужна сеть под стейблкоин.'
        },
        fr: {
            title: 'Circle lance Arc : une chaîne où le gaz se paie en USDC',
            summary: 'Circle a ouvert sa blockchain Arc au public le 16 septembre 2026, avec frais en USDC '
                + 'et institutions pour validateurs. À quoi sert une chaîne de stablecoin.'
        },
        tr: {
            title: "Circle'ın Arc ana ağı: gazın USDC ile ödendiği zincir",
            summary: "Circle, Arc blok zincirini 16 Eylül 2026'da herkese açtı; ücretler USDC ile "
                + 'ödeniyor, doğrulayıcılar kurumlar. Bir stablecoin zinciri ne işe yarar.'
        }
    }
};
