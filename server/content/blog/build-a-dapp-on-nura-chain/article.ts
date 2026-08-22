import type { Article } from '../types.ts';

/**
 * Primary keyword: "build dApp on Nura Chain". Developer, front-end side.
 *
 * The 4902 branch is the reason this article exists rather than being a section elsewhere:
 * `wallet_switchEthereumChain` failing with that code on a chain the wallet has never seen is
 * the single most common reason a first-time user reports that "nothing happens", and almost
 * no getting-started guide handles it.
 */
export const article: Article = {
    slug: 'build-a-dapp-on-nura-chain',
    tags: ['developers', 'guides', 'evm'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'How to Build a dApp on Nura Chain',
            summary: 'Reading without a wallet, connecting one, switching the user to chain 1020 with '
                + 'the 4902 fallback, and handling every state that actually happens.'
        },
        fa: {
            title: 'چگونه یک dApp روی نورا چین بسازیم',
            summary: 'خواندن بدون کیف پول، وصل‌کردن یکی، بردن کاربر به زنجیره ۱۰۲۰ با شاخه ۴۹۰۲، '
                + 'و مدیریت هر حالتی که واقعاً پیش می‌آید.'
        },
        ar: {
            title: 'كيف تبني تطبيقًا لامركزيًا على نورا تشين',
            summary: 'القراءة دون محفظة، وربط واحدة، ونقل المستخدم إلى السلسلة 1020 عبر مسار 4902، '
                + 'ومعالجة كل حالة تقع فعلًا.'
        },
        es: {
            title: 'Cómo construir una dApp en Nura Chain',
            summary: 'Leer sin cartera, conectar una, llevar al usuario a la cadena 1020 con el respaldo '
                + '4902 y gestionar todos los estados que ocurren de verdad.'
        },
        pt: {
            title: 'Como construir um dApp na Nura Chain',
            summary: 'Ler sem carteira, conectar uma, levar o usuário à cadeia 1020 com o fallback 4902 '
                + 'e tratar todos os estados que realmente acontecem.'
        },
        hi: {
            title: 'Nura Chain पर dApp कैसे बनाएँ',
            summary: 'बिना वॉलेट पढ़ना, वॉलेट जोड़ना, 4902 फ़ॉलबैक से उपयोगकर्ता को चेन 1020 पर लाना, '
                + 'और उन सभी स्थितियों को सँभालना जो सचमुच आती हैं।'
        },
        zh: {
            title: '如何在 Nura Chain 上构建 dApp',
            summary: '无需钱包即可读取、连接钱包、用 4902 回退把用户切到链 1020，'
                + '以及处理每一种真正会出现的状态。'
        },
        ru: {
            title: 'Как собрать dApp на Nura Chain',
            summary: 'Чтение без кошелька, подключение кошелька, перевод пользователя в сеть 1020 через '
                + 'ветку 4902 и обработка всех состояний, которые действительно случаются.'
        },
        fr: {
            title: 'Comment construire une dApp sur Nura Chain',
            summary: 'Lire sans portefeuille, en connecter un, basculer l\'utilisateur sur la chaîne 1020 '
                + 'via le repli 4902, et traiter tous les états qui surviennent réellement.'
        },
        tr: {
            title: 'Nura Chain Üzerinde dApp Nasıl Geliştirilir',
            summary: 'Cüzdansız okumak, cüzdan bağlamak, 4902 yedeğiyle kullanıcıyı zincir 1020\'ye '
                + 'geçirmek ve gerçekten yaşanan her durumu ele almak.'
        }
    }
};
