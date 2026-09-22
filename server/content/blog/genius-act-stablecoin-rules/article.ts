import type { Article } from '../types.ts';

/**
 * The stablecoin rulebook, for somebody who holds one rather than issues one.
 *
 * Primary keyword: "GENIUS Act". The dates move, so the article states them as dates rather
 * than as "soon", and the section that earns its place is the one about a wrapped token being
 * a claim on a bridge rather than on the issuer - a distinction no regulation changes.
 */
export const article: Article = {
    slug: 'genius-act-stablecoin-rules',
    tags: ['stablecoins', 'regulation', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-20T08:00:00.000Z',
    updatedAt: '2026-09-20T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'The GENIUS Act: What Stablecoin Rules Change Onchain',
            summary: 'The first US federal stablecoin framework bites in January 2027 and the rules are being '
                + 'written now. What it covers, what it does not, and what it means for a wrapped token.'
        },
        fa: {
            title: 'قانون GENIUS: قواعد استیبل‌کوین روی زنجیره چه چیزی را عوض می‌کند',
            summary: 'نخستین چارچوب فدرال آمریکا برای استیبل‌کوین از ژانویه ۲۰۲۷ اجرایی می‌شود و مقرراتش همین '
                + 'حالا نوشته می‌شود. چه چیزی را پوشش می‌دهد، چه چیزی را نه، و تکلیف توکن رپدشده چیست.'
        },
        ar: {
            title: 'قانون GENIUS: ما الذي تغيّره قواعد العملات المستقرة على السلسلة',
            summary: 'يبدأ أول إطار فيدرالي أمريكي للعملات المستقرة في يناير 2027، ولوائحه تُكتب الآن. ماذا '
                + 'يغطي وما لا يغطيه، وماذا يعني ذلك لتوكن ملفوف على سلسلة أخرى.'
        },
        es: {
            title: 'La GENIUS Act: qué cambian las reglas de stablecoins',
            summary: 'El primer marco federal estadounidense para stablecoins entra en vigor en enero de 2027 '
                + 'y su reglamento se escribe ahora. Qué cubre, qué no, y qué implica para un token '
                + 'envuelto.'
        },
        pt: {
            title: 'A GENIUS Act: o que muda nas regras de stablecoins',
            summary: 'O primeiro marco federal norte-americano para stablecoins passa a valer em janeiro de '
                + '2027 e a regulamentação está sendo escrita agora. O que cobre, o que não, e o token '
                + 'embrulhado.'
        },
        hi: {
            title: 'GENIUS Act: स्टेबलकॉइन नियम ऑनचेन क्या बदलते हैं',
            summary: 'अमेरिका का पहला संघीय स्टेबलकॉइन ढाँचा जनवरी 2027 से लागू होगा और उसके नियम अभी लिखे जा '
                + 'रहे हैं। यह क्या समेटता है, क्या नहीं, और रैप्ड टोकन के लिए इसका क्या अर्थ है।'
        },
        zh: {
            title: 'GENIUS 法案：稳定币规则在链上改变了什么',
            summary: '美国第一部联邦稳定币框架将于 2027 年 1 月生效，配套规则正在制定中。它管什么、不管什么，以及这对一枚封装代币意味着什么。'
        },
        ru: {
            title: 'GENIUS Act: что правила о стейблкоинах меняют в сети',
            summary: 'Первый федеральный закон США о стейблкоинах заработает в январе 2027 года, а подзаконные '
                + 'акты пишутся сейчас. Что он охватывает, чего нет и что это значит для обёрнутого токена.'
        },
        fr: {
            title: 'Le GENIUS Act : ce que les règles stablecoin changent',
            summary: "Le premier cadre fédéral américain sur les stablecoins s'applique en janvier 2027 et ses "
                + "textes se rédigent maintenant. Ce qu'il couvre, ce qu'il ignore, et le cas du jeton "
                + 'enveloppé.'
        },
        tr: {
            title: 'GENIUS Yasası: Stablecoin kuralları zincirde ne değiştiriyor',
            summary: "ABD'nin ilk federal stablecoin çerçevesi Ocak 2027'de yürürlüğe giriyor ve "
                + 'yönetmelikleri şimdi yazılıyor. Neyi kapsıyor, neyi kapsamıyor ve sarmalanmış token için '
                + 'ne anlama geliyor.'
        }
    }
};
