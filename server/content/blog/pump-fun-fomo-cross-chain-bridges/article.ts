import type { Article } from '../types.ts';

/**
 * Pump.fun's Pump Bridge (21 October 2026) and FOMO's bridge a day later: two trading apps
 * replacing Relay with infrastructure of their own.
 *
 * Primary keyword: "cross-chain bridge". Every performance figure is the companies' own,
 * stated as theirs and as unverified; neither has published how its bridge sources liquidity
 * or what secures it, so the mechanism section explains the general designs and says that
 * applying them to these two is an inference. Dates are the UTC timestamps of the two
 * announcements on X. The Nura tie-in is the whitepaper's cloakroom ticket and the readable
 * supply in site.ts BRIDGE_TOKENS, nothing more.
 */
export const article: Article = {
    slug: 'pump-fun-fomo-cross-chain-bridges',
    tags: ['interoperability', 'security', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T17:00:00.000Z',
    updatedAt: '2026-10-23T17:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Pump.fun and FOMO Bridges: What Backs a Bridged Token',
            summary: 'Pump.fun launched Pump Bridge on 21 October 2026 and FOMO its own bridge a day '
                + 'later. How fast cross-chain swaps work, and what you trust when you use one.'
        },
        fa: {
            title: 'پل‌های Pump.fun و FOMO: پشتوانه توکن پل‌شده چیست',
            summary: 'Pump.fun در ۲۱ اکتبر ۲۰۲۶ از Pump Bridge رونمایی کرد و FOMO یک روز بعد پل خودش را. '
                + 'سواپ‌های سریع میان‌زنجیره‌ای چطور کار می‌کنند و هنگام استفاده به چه اعتماد می‌کنید.'
        },
        ar: {
            title: 'جسور Pump.fun وFOMO: ما الذي يدعم الرمز المجسور؟',
            summary: 'أطلقت Pump.fun جسر Pump Bridge في 21 أكتوبر 2026، وأطلقت FOMO جسرها بعد يوم. '
                + 'كيف تعمل المبادلات السريعة بين السلاسل، وبمن تثق حين تستخدمها.'
        },
        es: {
            title: 'Puentes de Pump.fun y FOMO: qué respalda un token puenteado',
            summary: 'Pump.fun lanzó Pump Bridge el 21 de octubre de 2026 y FOMO su propio puente un día '
                + 'después. Cómo funcionan los swaps rápidos entre cadenas y en qué confías al usarlos.'
        },
        pt: {
            title: 'Pontes da Pump.fun e da FOMO: o que lastreia um token em ponte',
            summary: 'A Pump.fun lançou a Pump Bridge em 21 de outubro de 2026 e a FOMO sua própria ponte '
                + 'um dia depois. Como funcionam os swaps rápidos entre redes e em que você confia.'
        },
        hi: {
            title: 'Pump.fun और FOMO के ब्रिज: ब्रिज किए टोकन के पीछे क्या है',
            summary: 'Pump.fun ने 21 अक्टूबर 2026 को Pump Bridge शुरू किया और FOMO ने एक दिन बाद अपना ब्रिज। '
                + 'तेज़ क्रॉस-चेन स्वैप कैसे काम करते हैं, और इनमें आप किस पर भरोसा करते हैं।'
        },
        zh: {
            title: 'Pump.fun 与 FOMO 的跨链桥：跨链代币靠什么支撑',
            summary: 'Pump.fun 于 2026 年 10 月 21 日推出 Pump Bridge，一天后 FOMO 也推出了自己的跨链桥。快速跨链兑换如何运作，使用时你信任的是谁。'
        },
        ru: {
            title: 'Мосты Pump.fun и FOMO: чем обеспечен токен из моста',
            summary: '21 октября 2026 года Pump.fun запустила Pump Bridge, а днём позже FOMO — свой мост. '
                + 'Как работают быстрые кроссчейн-свопы и чему вы доверяете, пользуясь ими.'
        },
        fr: {
            title: 'Ponts de Pump.fun et FOMO : ce qui adosse un token ponté',
            summary: 'Pump.fun a lancé Pump Bridge le 21 octobre 2026, et FOMO son propre pont le '
                + 'lendemain. Comment marchent les swaps cross-chain rapides, et à qui vous vous fiez.'
        },
        tr: {
            title: 'Pump.fun ve FOMO köprüleri: köprülenmiş tokenın arkasında ne var',
            summary: "Pump.fun 21 Ekim 2026'da Pump Bridge'i, FOMO bir gün sonra kendi köprüsünü başlattı. "
                + 'Hızlı zincirler arası takaslar nasıl çalışır, kullanırken neye güvenirsiniz.'
        }
    }
};
