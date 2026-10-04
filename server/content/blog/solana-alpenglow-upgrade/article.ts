import type { Article } from '../types.ts';

/**
 * Alpenglow on testnet since 22 September 2026, and the mainnet launch that was reported
 * for the 28th and did not happen.
 *
 * Primary keyword: "Solana Alpenglow". Half news, half a correction of it, with the
 * block-time-versus-finality distinction as the part that lasts. The next mainnet window
 * (9 November 2026) is a window and is described as one.
 */
export const article: Article = {
    slug: 'solana-alpenglow-upgrade',
    tags: ['developers', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-29T08:00:00.000Z',
    updatedAt: '2026-09-29T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: "Solana Alpenglow: 150 ms Finality, and Why It Isn't Live",
            summary: "Alpenglow replaces Solana's consensus and targets finality near 150 milliseconds. It "
                + 'reached testnet on 22 September 2026, not mainnet. What changes and when.'
        },
        fa: {
            title: 'Alpenglow سولانا: نهایی‌شدن ۱۵۰ میلی‌ثانیه‌ای و چرا فعال نیست',
            summary: 'Alpenglow اجماع سولانا را عوض می‌کند و نهایی‌شدن حدود ۱۵۰ میلی‌ثانیه را هدف گرفته. '
                + '۲۲ سپتامبر ۲۰۲۶ به شبکه آزمایشی رسید، نه شبکه اصلی. چه عوض می‌شود و کِی.'
        },
        ar: {
            title: 'Alpenglow في سولانا: نهائية 150 ميلي ثانية، ولماذا لم يُفعَّل',
            summary: 'يستبدل Alpenglow إجماع سولانا ويستهدف نهائية قرب 150 ميلي ثانية. وصل إلى شبكة '
                + 'الاختبار في 22 سبتمبر 2026، لا إلى الشبكة الرئيسية. ما الذي يتغيّر ومتى.'
        },
        es: {
            title: 'Solana Alpenglow: 150 ms de finalidad y por qué no está activo',
            summary: 'Alpenglow, el nuevo consenso de Solana, busca finalidad en unos 150 ms. Llegó a la '
                + 'red de pruebas el 22 de septiembre de 2026, no a la principal. Qué cambia.'
        },
        pt: {
            title: 'Solana Alpenglow: finalidade em 150 ms e por que não foi ao ar',
            summary: 'O Alpenglow troca o consenso da Solana e mira finalidade perto de 150 milissegundos. '
                + 'Chegou à rede de testes em 22 de setembro de 2026, não à rede principal.'
        },
        hi: {
            title: 'Solana Alpenglow: 150 ms अंतिमता, और यह लाइव क्यों नहीं',
            summary: 'Alpenglow Solana की सहमति बदलता है; लक्ष्य लगभग 150 मिलीसेकंड की अंतिमता है। 22 '
                + 'सितंबर 2026 को यह टेस्टनेट पर पहुँचा, मेननेट पर नहीं। क्या बदलता है और कब।'
        },
        zh: {
            title: 'Solana Alpenglow：150 毫秒最终性，以及它为何尚未上线',
            summary: 'Alpenglow 替换 Solana 的共识，目标是接近 150 毫秒的最终性。2026 年 9 月 22 日它登陆的是测试网，不是主网。改了什么，何时生效。'
        },
        ru: {
            title: 'Solana Alpenglow: финальность за 150 мс и почему он не запущен',
            summary: 'Alpenglow заменяет консенсус Solana и нацелен на финальность около 150 мс. 22 '
                + 'сентября 2026 года он вышел в тестовой сети, не в основной. Что и когда меняется.'
        },
        fr: {
            title: 'Solana Alpenglow : 150 ms de finalité, mais pas encore actif',
            summary: 'Alpenglow remplace le consensus de Solana et vise une finalité proche de 150 ms. '
                + 'Arrivé sur le réseau de test le 22 septembre 2026, pas sur le réseau principal.'
        },
        tr: {
            title: 'Solana Alpenglow: 150 ms kesinlik ve neden henüz yayında değil',
            summary: "Alpenglow, Solana'nın uzlaşısını değiştiriyor ve 150 ms'ye yakın kesinlik "
                + "hedefliyor. 22 Eylül 2026'da ana ağa değil test ağına geldi. Ne değişiyor, ne zaman."
        }
    }
};
