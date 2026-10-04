import type { Article } from '../types.ts';

/**
 * Blast's shutdown, announced 2 October 2026, as a worked example of where funds on a
 * Layer 2 are held and how they come back.
 *
 * Primary keyword: "Blast shutdown". TIME-SENSITIVE: the withdrawal deadline is
 * 26 October 2026, after which the practical advice in it is history and the body should
 * be revised into the past tense.
 */
export const article: Article = {
    slug: 'blast-l2-shutdown-withdrawals',
    tags: ['ethereum', 'evm', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-04T11:00:00.000Z',
    updatedAt: '2026-10-04T11:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Blast Is Shutting Down: How to Withdraw From a Layer 2',
            summary: 'Blast is shutting its Ethereum Layer 2 and set 26 October 2026 as the withdrawal '
                + 'deadline. What happens to funds when a rollup closes, and what to check.'
        },
        fa: {
            title: 'Blast تعطیل می‌شود: چگونه از یک لایه دو برداشت کنیم',
            summary: 'Blast لایه دو اتریومی‌اش را تعطیل می‌کند و ۲۶ اکتبر ۲۰۲۶ را مهلت برداشت گذاشته. وقتی '
                + 'یک رول‌آپ بسته می‌شود چه بر سر وجوه می‌آید و چه چیزی را باید بررسی کرد.'
        },
        ar: {
            title: 'Blast تُغلق: كيف تسحب من شبكة طبقة ثانية',
            summary: 'تغلق Blast شبكة الطبقة الثانية التابعة لها على إيثيريوم وحددت 26 أكتوبر 2026 مهلة '
                + 'للسحب. ماذا يحدث للأموال حين تُغلق تجميعة، وما الذي تتحقق منه.'
        },
        es: {
            title: 'Blast cierra: cómo retirar tus fondos de una Layer 2',
            summary: 'Blast cierra su Layer 2 de Ethereum y fija el 26 de octubre de 2026 como límite para '
                + 'retirar. Qué pasa con los fondos cuando un rollup cierra y qué comprobar.'
        },
        pt: {
            title: 'Blast encerra as atividades: como sacar de uma Layer 2',
            summary: 'A Blast está encerrando sua Layer 2 da Ethereum e fixou 26 de outubro de 2026 como '
                + 'prazo de saque. O que acontece com os fundos quando um rollup fecha.'
        },
        hi: {
            title: 'Blast बंद हो रहा है: Layer 2 से निकासी कैसे करें',
            summary: 'Blast अपना Ethereum Layer 2 बंद कर रहा है और निकासी की समय-सीमा 26 अक्टूबर 2026 रखी '
                + 'है। रोलअप बंद होने पर फ़ंड का क्या होता है, और क्या जाँचें।'
        },
        zh: {
            title: 'Blast 即将关停：怎样从 Layer 2 提款',
            summary: 'Blast 将关停它的以太坊 Layer 2，并把 2026 年 10 月 26 日定为提款截止日期。rollup 关闭时资金会怎样，又该核对什么。'
        },
        ru: {
            title: 'Blast закрывается: как вывести средства из Layer 2',
            summary: 'Blast закрывает свой Layer 2 на Ethereum и назначил срок вывода — 26 октября 2026 '
                + 'года. Что происходит со средствами, когда роллап закрывается, и что проверить.'
        },
        fr: {
            title: "Blast ferme : comment retirer ses fonds d'une Layer 2",
            summary: "Blast ferme sa Layer 2 sur Ethereum et fixe au 26 octobre 2026 l'échéance des "
                + 'retraits. Ce que deviennent les fonds quand un rollup ferme, et quoi vérifier.'
        },
        tr: {
            title: "Blast kapanıyor: bir Katman 2'den nasıl çekim yapılır",
            summary: "Blast, Ethereum Katman 2'sini kapatıyor ve çekim için son tarihi 26 Ekim 2026 olarak "
                + 'belirledi. Bir rollup kapanınca fonlara ne olur, neyi kontrol etmeli.'
        }
    }
};
