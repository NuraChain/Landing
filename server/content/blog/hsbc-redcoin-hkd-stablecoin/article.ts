import type { Article } from '../types.ts';

/**
 * HSBC's RedCoin going live in PayMe on 23 October 2026: a bank-issued Hong Kong dollar
 * stablecoin on the bank's own ledger.
 *
 * Primary keyword: "HSBC RedCoin stablecoin". Circulation, reserves, the licence number and
 * the attestation date are HSBC's own product page as of 23 October; the 3.3 million users
 * figure is the South China Morning Post's, by way of crypto.news and CoinGape; the merchant
 * count, the settlement note and the Lawrence Li quote are CoinGape's and are stated as
 * theirs. The circulation figure is updated daily by HSBC, so it is the line most likely to
 * date first. The Nura paragraph contrasts a closed ledger with an ERC-20 and says nothing
 * about Nura issuing or listing a stablecoin.
 */
export const article: Article = {
    slug: 'hsbc-redcoin-hkd-stablecoin',
    tags: ['stablecoins', 'payments', 'regulation'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T09:00:00.000Z',
    updatedAt: '2026-10-23T09:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'HSBC RedCoin: a Hong Kong Dollar Stablecoin Goes Live on PayMe',
            summary: 'HSBC began a phased launch of RedCoin, its HKMA-licensed Hong Kong dollar '
                + 'stablecoin, to 3.3 million PayMe users on 23 October 2026. What it is and is not.'
        },
        fa: {
            title: 'RedCoin اچ‌اس‌بی‌سی: استیبل‌کوین دلار هنگ‌کنگ در PayMe فعال شد',
            summary: 'HSBC در ۲۳ اکتبر ۲۰۲۶ عرضه مرحله‌ای RedCoin، استیبل‌کوین دلار هنگ‌کنگِ دارای مجوز '
                + 'HKMA، را برای ۳٫۳ میلیون کاربر PayMe آغاز کرد. چه هست و چه نیست.'
        },
        ar: {
            title: 'RedCoin من HSBC: عملة مستقرة بالدولار الهونغ كونغي على PayMe',
            summary: 'بدأت HSBC في 23 أكتوبر 2026 إطلاقًا مرحليًا لـ RedCoin، عملتها المستقرة بالدولار '
                + 'الهونغ كونغي المرخّصة من HKMA، لـ 3.3 مليون مستخدم لـ PayMe. ما هي وما ليست.'
        },
        es: {
            title: 'HSBC RedCoin: la stablecoin en dólar de Hong Kong llega a PayMe',
            summary: 'HSBC inició el 23 de octubre de 2026 el lanzamiento escalonado de RedCoin, su '
                + 'stablecoin en dólar de Hong Kong con licencia de la HKMA, para 3,3 millones de usuarios.'
        },
        pt: {
            title: 'HSBC RedCoin: stablecoin em dólar de Hong Kong chega ao PayMe',
            summary: 'O HSBC iniciou em 23 de outubro de 2026 o lançamento gradual da RedCoin, sua '
                + 'stablecoin em dólar de Hong Kong licenciada pela HKMA, para 3,3 milhões de usuários.'
        },
        hi: {
            title: 'HSBC RedCoin: हॉन्गकॉन्ग डॉलर स्टेबलकॉइन PayMe पर लाइव',
            summary: '23 अक्टूबर 2026 को HSBC ने HKMA से लाइसेंस प्राप्त अपने हॉन्गकॉन्ग डॉलर स्टेबलकॉइन '
                + 'RedCoin को PayMe के 33 लाख उपयोगकर्ताओं के लिए चरणों में शुरू किया। यह क्या है, क्या नहीं।'
        },
        zh: {
            title: '汇丰 RedCoin：港元稳定币在 PayMe 上线',
            summary: '2026 年 10 月 23 日，汇丰开始向 PayMe 的 330 万用户分阶段推出 RedCoin——由香港金管局发牌的港元稳定币。它是什么，又不是什么。'
        },
        ru: {
            title: 'HSBC RedCoin: стейблкоин в гонконгских долларах запущен в PayMe',
            summary: '23 октября 2026 года HSBC начал поэтапный запуск RedCoin, своего стейблкоина в '
                + 'гонконгских долларах с лицензией HKMA, для 3,3 млн пользователей PayMe.'
        },
        fr: {
            title: 'HSBC RedCoin : un stablecoin en dollar de Hong Kong sur PayMe',
            summary: 'HSBC a lancé le 23 octobre 2026, par étapes, RedCoin, son stablecoin en dollar de '
                + 'Hong Kong agréé par la HKMA, auprès des 3,3 millions d’utilisateurs de PayMe.'
        },
        tr: {
            title: "HSBC RedCoin: Hong Kong doları stablecoin'i PayMe'de yayında",
            summary: "HSBC, HKMA lisanslı Hong Kong doları stablecoin'i RedCoin'i 23 Ekim 2026'da "
                + "PayMe'nin 3,3 milyon kullanıcısına aşamalı olarak sunmaya başladı. Ne olduğu, ne olmadığı."
        }
    }
};
