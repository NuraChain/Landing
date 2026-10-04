import type { Article } from '../types.ts';

/**
 * The Bitget theft of 24 September 2026: no contract bug, a compromised system the
 * wallets trusted.
 *
 * Primary keyword: "Bitget hack". The attribution to North Korea-linked actors is
 * Chainalysis's and is stated as theirs; the monthly totals are quoted from two firms
 * because they disagree. The investigation is ongoing, so this is the article most likely
 * to need its updatedAt moved.
 */
export const article: Article = {
    slug: 'bitget-hack-north-korea',
    tags: ['security', 'wallet', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-02T19:00:00.000Z',
    updatedAt: '2026-10-02T19:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Bitget Hack: How $387 Million Left a Hot Wallet',
            summary: 'Bitget lost $387.5 million on 24 September 2026 through its own wallet systems, in a '
                + 'theft Chainalysis attributes to North Korea. What failed and what to learn.'
        },
        fa: {
            title: 'هک Bitget: چگونه ۳۸۷ میلیون دلار از یک کیف پول گرم خارج شد',
            summary: 'Bitget در ۲۴ سپتامبر ۲۰۲۶ از راه سامانه‌های کیف پول خودش ۳۸۷٫۵ میلیون دلار از دست '
                + 'داد؛ Chainalysis آن را به کره شمالی نسبت می‌دهد. چه از کار افتاد و درسش چیست.'
        },
        ar: {
            title: 'اختراق Bitget: كيف خرج 387 مليون دولار من محفظة ساخنة',
            summary: 'خسرت Bitget 387.5 مليون دولار في 24 سبتمبر 2026 عبر أنظمة محافظها نفسها، في سرقة '
                + 'تنسبها Chainalysis إلى كوريا الشمالية. ما الذي أخفق وما الدرس.'
        },
        es: {
            title: 'Hackeo de Bitget: 387 millones salen de una cartera caliente',
            summary: 'Bitget perdió 387,5 millones de dólares el 24 de septiembre de 2026 por sus sistemas '
                + 'de carteras; Chainalysis atribuye el robo a Corea del Norte. Qué falló.'
        },
        pt: {
            title: 'Hack da Bitget: US$ 387 milhões saem de uma carteira quente',
            summary: 'A Bitget perdeu US$ 387,5 milhões em 24 de setembro de 2026 pelos próprios sistemas '
                + 'de carteira, num roubo que a Chainalysis atribui à Coreia do Norte.'
        },
        hi: {
            title: 'Bitget हैक: हॉट वॉलेट से 38.7 करोड़ डॉलर कैसे निकले',
            summary: '24 सितंबर 2026 को Bitget ने अपने ही वॉलेट सिस्टम के रास्ते 38.75 करोड़ डॉलर गँवाए; '
                + 'Chainalysis इसे उत्तर कोरिया से जोड़ता है। क्या नाकाम हुआ, क्या सीखें।'
        },
        zh: {
            title: 'Bitget 被盗：3.87 亿美元是怎样离开热钱包的',
            summary: '2026 年 9 月 24 日，Bitget 经由自己的钱包系统损失 3.875 亿美元，Chainalysis 将这起盗窃归因于朝鲜。哪里失守了，该学到什么。'
        },
        ru: {
            title: 'Взлом Bitget: как 387 млн долларов ушли из горячего кошелька',
            summary: '24 сентября 2026 года Bitget потеряла 387,5 млн долларов через собственные кошельки; '
                + 'Chainalysis приписывает кражу Северной Корее. Что отказало и чему это учит.'
        },
        fr: {
            title: "Piratage de Bitget : 387 M$ sortis d'un portefeuille chaud",
            summary: 'Bitget a perdu 387,5 millions de dollars le 24 septembre 2026 via ses propres '
                + 'systèmes de portefeuilles, un vol que Chainalysis attribue à la Corée du Nord.'
        },
        tr: {
            title: 'Bitget saldırısı: 387 milyon dolar sıcak cüzdandan nasıl çıktı',
            summary: "Bitget 24 Eylül 2026'da kendi cüzdan sistemleri üzerinden 387,5 milyon dolar "
                + "kaybetti; Chainalysis hırsızlığı Kuzey Kore'ye atfediyor. Ne bozuldu, ne öğrenmeli."
        }
    }
};
