import type { Article } from '../types.ts';

/**
 * The SEC's custody proposal of 1 October 2026 for advisers and funds, read as a question
 * about who checks the keys.
 *
 * Primary keyword: "SEC crypto custody". It is a PROPOSAL with a 60-day comment period,
 * and the conditions for self-custody are not in the press release - the body quotes
 * "under certain circumstances" and stops there. Revise when the text is in the Federal
 * Register.
 */
export const article: Article = {
    slug: 'sec-crypto-custody-proposal',
    tags: ['regulation', 'wallet', 'security'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-03T15:00:00.000Z',
    updatedAt: '2026-10-03T15:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'SEC Crypto Custody Proposal: Can a Fund Hold Its Own Keys?',
            summary: 'On 1 October 2026 the SEC proposed rules letting advisers and funds custody crypto, '
                + 'including self-custody in some cases. What changes, and what to ask.'
        },
        fa: {
            title: 'پیشنهاد امانت‌داری کریپتوی SEC: صندوق می‌تواند کلیدش را نگه دارد؟',
            summary: 'SEC در ۱ اکتبر ۲۰۲۶ مقرراتی پیشنهاد کرد که به مشاوران و صندوق‌ها اجازه امانت‌داری '
                + 'کریپتو می‌دهد، در مواردی حتی خودنگهداری. چه چیزی عوض می‌شود و چه باید پرسید.'
        },
        ar: {
            title: 'مقترح SEC لحفظ الكريبتو: هل يحتفظ الصندوق بمفاتيحه بنفسه؟',
            summary: 'في 1 أكتوبر 2026 اقترحت SEC قواعد تتيح للمستشارين والصناديق حفظ الكريبتو، ومنه الحفظ '
                + 'الذاتي في بعض الحالات. ما الذي يتغيّر، وماذا تسأل.'
        },
        es: {
            title: 'SEC y custodia cripto: ¿puede un fondo guardar sus claves?',
            summary: 'El 1 de octubre de 2026 la SEC propuso normas para que asesores y fondos custodien '
                + 'cripto, con autocustodia en algunos casos. Qué cambia y qué preguntar.'
        },
        pt: {
            title: 'SEC e custódia de cripto: um fundo pode guardar suas chaves?',
            summary: 'Em 1º de outubro de 2026, a SEC propôs regras para consultores e fundos custodiarem '
                + 'cripto, com autocustódia em alguns casos. O que muda e o que perguntar.'
        },
        hi: {
            title: 'SEC क्रिप्टो कस्टडी प्रस्ताव: क्या फ़ंड खुद कुंजी रख सकता है?',
            summary: '1 अक्टूबर 2026 को SEC ने ऐसे नियम प्रस्तावित किए जिनसे सलाहकार और फ़ंड क्रिप्टो '
                + 'कस्टडी कर सकेंगे, कुछ मामलों में सेल्फ़-कस्टडी भी। क्या बदलता है, क्या पूछें।'
        },
        zh: {
            title: 'SEC 加密资产托管提案：基金能自己保管私钥吗？',
            summary: '2026 年 10 月 1 日，SEC 提出规则草案，允许顾问和基金托管加密资产，某些情况下还可以自托管。改变了什么，又该问些什么。'
        },
        ru: {
            title: 'Предложение SEC о хранении крипты: фонд сам держит ключи?',
            summary: '1 октября 2026 года SEC предложила правила, позволяющие консультантам и фондам '
                + 'хранить крипту, в ряде случаев самостоятельно. Что меняется и о чём спрашивать.'
        },
        fr: {
            title: 'SEC et conservation crypto : un fonds peut-il tenir ses clés ?',
            summary: 'Le 1er octobre 2026, la SEC a proposé de laisser conseillers et fonds conserver des '
                + 'crypto-actifs, parfois en auto-conservation. Ce qui change, quoi demander.'
        },
        tr: {
            title: 'SEC kripto saklama önerisi: fon kendi anahtarını tutabilir mi?',
            summary: "SEC, 1 Ekim 2026'da danışmanların ve fonların kripto saklamasına, bazı durumlarda "
                + 'kendi saklamaya da izin veren kurallar önerdi. Ne değişiyor, ne sormalı.'
        }
    }
};
