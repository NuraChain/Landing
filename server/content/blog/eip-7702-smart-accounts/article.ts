import type { Article } from '../types.ts';

/**
 * Account abstraction as a wallet user meets it, not as a standards document describes it.
 *
 * Primary keyword: "EIP-7702". The article exists because the feature is now in mainstream
 * wallets and the phishing surface it opens is not widely understood; the delegation warning
 * is the part that earns the page.
 */
export const article: Article = {
    slug: 'eip-7702-smart-accounts',
    tags: ['wallet', 'ethereum', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-21T08:00:00.000Z',
    updatedAt: '2026-09-21T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'EIP-7702: Your Wallet Address, With Code Behind It',
            summary: 'A regular account can now delegate to contract code and keep its key and its address. '
                + 'What that buys you, and the one signature you should never approve blindly.'
        },
        fa: {
            title: 'EIP-7702: همان آدرس کیف پول، این بار با کد پشتش',
            summary: 'یک حساب معمولی حالا می‌تواند به کد قرارداد واگذار کند و کلید و آدرسش را نگه دارد. چه '
                + 'چیزی به دست می‌آورید و کدام امضا را هرگز نباید چشم‌بسته تأیید کنید.'
        },
        ar: {
            title: 'EIP-7702: عنوان محفظتك نفسه، ووراءه كود',
            summary: 'صار بوسع الحساب العادي أن يفوّض إلى كود عقد مع احتفاظه بمفتاحه وعنوانه. ما الذي يمنحك '
                + 'ذلك، وما التوقيع الذي يجب ألا توافق عليه بغير تدقيق.'
        },
        es: {
            title: 'EIP-7702: tu dirección de siempre, con código detrás',
            summary: 'Una cuenta normal ya puede delegar en código de contrato conservando su clave y su '
                + 'dirección. Qué ganas con ello y qué firma no deberías aprobar nunca a ciegas.'
        },
        pt: {
            title: 'EIP-7702: o seu endereço de sempre, com código atrás',
            summary: 'Uma conta comum agora pode delegar a código de contrato e manter a chave e o endereço. O '
                + 'que isso lhe dá e qual assinatura você nunca deve aprovar às cegas.'
        },
        hi: {
            title: 'EIP-7702: वही वॉलेट पता, पीछे अब कोड',
            summary: 'एक साधारण खाता अब कॉन्ट्रैक्ट कोड को अधिकार सौंप सकता है और अपनी चाबी तथा पता बनाए रख '
                + 'सकता है। इससे क्या मिलता है, और कौन-सा हस्ताक्षर कभी आँख मूँदकर मंज़ूर नहीं करना चाहिए।'
        },
        zh: {
            title: 'EIP-7702：还是那个地址，背后多了代码',
            summary: '普通账户现在可以委托给合约代码，同时保留自己的私钥和地址。它能带来什么，以及哪一类签名你永远不该闭着眼睛批准。'
        },
        ru: {
            title: 'EIP-7702: тот же адрес кошелька, но с кодом',
            summary: 'Обычный аккаунт теперь может делегировать коду контракта, сохранив свой ключ и адрес. '
                + 'Что это даёт и какую подпись не стоит подтверждать вслепую.'
        },
        fr: {
            title: 'EIP-7702 : votre adresse habituelle, avec du code',
            summary: 'Un compte ordinaire peut désormais déléguer à du code de contrat en gardant sa clé et '
                + "son adresse. Ce que cela apporte, et la signature à ne jamais approuver à l'aveugle."
        },
        tr: {
            title: 'EIP-7702: Aynı Cüzdan Adresi, Arkasında Kod',
            summary: 'Sıradan bir hesap artık sözleşme koduna yetki devredip anahtarını ve adresini '
                + 'koruyabiliyor. Bunun kazandırdıkları ve gözü kapalı onaylanmaması gereken imza.'
        }
    }
};
