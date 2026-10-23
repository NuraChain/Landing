import type { Article } from '../types.ts';

/**
 * The Ledger implant of October 2026: hardware wallets sold through the Malaysian reseller
 * CryptoBilis carried a hidden board that read the recovery phrase off the screen at setup.
 *
 * Primary keyword: "Ledger implant", with "CryptoBilis" beside it. The mechanism is stated as Ledger's own
 * (its Donjon update of 13 October); the loss totals are on-chain trackers' and are quoted
 * from three of them because they disagree and Ledger has verified none. Reports of implants
 * outside CryptoBilis are stated as unconfirmed. The investigation is ongoing, so this is the
 * article most likely to need its updatedAt moved.
 */
export const article: Article = {
    slug: 'ledger-hardware-wallet-implant-cryptobilis',
    tags: ['security', 'wallet', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T08:00:00.000Z',
    updatedAt: '2026-10-23T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Ledger Implant: How CryptoBilis Wallets Leaked Seed Phrases',
            summary: 'Ledger says some devices sold by Malaysian reseller CryptoBilis hid an implant that sent '
                + 'recovery phrases over LTE. Trackers put losses at $86M to $103M.'
        },
        fa: {
            title: 'ایمپلنت Ledger: عبارت بازیابیِ کیف پول‌های CryptoBilis چگونه لو رفت',
            summary: 'Ledger می‌گوید برخی دستگاه‌هایی که فروشنده مالزیایی CryptoBilis فروخته، ایمپلنتی پنهان '
                + 'داشتند که عبارت بازیابی را با LTE می‌فرستاد. زیان: ۸۶ تا ۱۰۳ میلیون دلار.'
        },
        ar: {
            title: 'زرعة Ledger: كيف تسرّبت عبارات استرداد محافظ CryptoBilis',
            summary: 'تقول Ledger إن بعض الأجهزة التي باعها الموزّع الماليزي CryptoBilis حملت زرعة خفية ترسل عبارات '
                + 'الاسترداد عبر LTE. وتقدّر أدوات التتبّع الخسائر بين 86 و103 مليون دولار.'
        },
        es: {
            title: 'Implante en Ledger: así se filtraron las frases de CryptoBilis',
            summary: 'Ledger dice que algunos equipos vendidos por el revendedor malasio CryptoBilis ocultaban un '
                + 'implante que enviaba frases de recuperación por LTE. Pérdidas: de 86 a 103 millones.'
        },
        pt: {
            title: 'Implante na Ledger: como vazaram as frases da CryptoBilis',
            summary: 'A Ledger diz que alguns aparelhos vendidos pela revendedora malaia CryptoBilis escondiam um '
                + 'implante que enviava frases de recuperação por LTE. Perdas: US$ 86-103 mi.'
        },
        hi: {
            title: 'Ledger इम्प्लांट: CryptoBilis वॉलेट से रिकवरी फ़्रेज़ कैसे लीक हुए',
            summary: 'Ledger के अनुसार मलेशियाई रीसेलर CryptoBilis के बेचे कुछ डिवाइसों में छिपा इम्प्लांट रिकवरी '
                + 'फ़्रेज़ LTE से भेजता था। ट्रैकरों के अनुसार नुकसान 8.6 से 10.34 करोड़ डॉलर।'
        },
        zh: {
            title: 'Ledger 植入物：CryptoBilis 售出的钱包如何泄露助记词',
            summary: 'Ledger 称，马来西亚经销商 CryptoBilis 售出的部分设备藏有植入物，会通过 LTE 发出恢复短语。链上追踪方估计损失在 8600 万至 1.034 亿美元之间。'
        },
        ru: {
            title: 'Имплант в Ledger: как утекли сид-фразы кошельков CryptoBilis',
            summary: 'Ledger сообщает, что в части устройств малайзийского реселлера CryptoBilis был имплант, '
                + 'отправлявший фразы восстановления по LTE. Ущерб: от 86 до 103 млн долларов.'
        },
        fr: {
            title: 'Implant Ledger : comment les phrases CryptoBilis ont fuité',
            summary: "Ledger indique que certains appareils vendus par le revendeur malaisien CryptoBilis "
                + "cachaient un implant envoyant les phrases de récupération en LTE. Pertes : 86-103 M$."
        },
        tr: {
            title: 'Ledger implantı: CryptoBilis kurtarma ifadeleri nasıl sızdı',
            summary: "Ledger, Malezyalı bayi CryptoBilis'in sattığı bazı cihazlarda kurtarma ifadelerini LTE ile "
                + "gönderen gizli bir implant olduğunu söylüyor. Kayıp: 86-103 milyon dolar."
        }
    }
};
