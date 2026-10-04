import type { Article } from '../types.ts';

/**
 * Core Lightning's instruction to upgrade to v26.06.8, and what running a node that holds
 * keys actually commits an operator to.
 *
 * Primary keyword: "Core Lightning vulnerability". The project has not said which flaw is
 * being attacked or whether funds were lost, and the body repeats that rather than
 * guessing. The operational advice is the evergreen half.
 */
export const article: Article = {
    slug: 'core-lightning-upgrade-warning',
    tags: ['bitcoin', 'security', 'payments'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-03T11:00:00.000Z',
    updatedAt: '2026-10-03T11:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Core Lightning Under Attack: Why Node Operators Must Patch',
            summary: 'Core Lightning told node operators to upgrade to v26.06.8 at once after reports of '
                + 'attacks on older versions. What was fixed, and what running a node means.'
        },
        fa: {
            title: 'Core Lightning زیر حمله: چرا اپراتورهای نود باید وصله کنند',
            summary: 'Core Lightning پس از گزارش حمله به نسخه‌های قدیمی‌تر، به اپراتورهای نود گفت فوراً به '
                + 'v26.06.8 ارتقا دهند. چه چیزی رفع شد و اجرای نود چه معنایی دارد.'
        },
        ar: {
            title: 'Core Lightning تحت الهجوم: لماذا على مشغّلي العقد أن يرقّعوا',
            summary: 'طلب Core Lightning من مشغّلي العقد الترقية فورًا إلى v26.06.8 بعد بلاغات عن هجمات '
                + 'على إصدارات أقدم. ما الذي أُصلح، وماذا يعني تشغيل عقدة.'
        },
        es: {
            title: 'Core Lightning bajo ataque: por qué hay que parchear los nodos',
            summary: 'Core Lightning pidió a los operadores actualizar ya a v26.06.8 tras informes de '
                + 'ataques a versiones anteriores. Qué se corrigió y qué implica operar un nodo.'
        },
        pt: {
            title: 'Core Lightning sob ataque: por que é preciso atualizar os nós',
            summary: 'O Core Lightning mandou operadores de nós atualizarem já para a v26.06.8 após '
                + 'relatos de ataques a versões antigas. O que foi corrigido e o que é operar um nó.'
        },
        hi: {
            title: 'Core Lightning पर हमले: नोड ऑपरेटरों को पैच क्यों करना होगा',
            summary: 'पुराने संस्करणों पर हमलों की रिपोर्टों के बाद Core Lightning ने नोड ऑपरेटरों से '
                + 'तुरंत v26.06.8 पर अपग्रेड करने को कहा। क्या ठीक हुआ, और नोड चलाने का मतलब क्या।'
        },
        zh: {
            title: 'Core Lightning 遭攻击：节点运营者为何必须打补丁',
            summary: '在收到旧版本遭攻击的报告后，Core Lightning 要求节点运营者立即升级到 v26.06.8。修复了什么，以及运行一个节点意味着什么。'
        },
        ru: {
            title: 'Core Lightning атакуют: почему операторам нод надо обновиться',
            summary: 'Core Lightning призвала операторов нод сразу обновиться до v26.06.8 после сообщений '
                + 'об атаках на более старые версии. Что исправлено и что значит держать ноду.'
        },
        fr: {
            title: 'Core Lightning attaqué : pourquoi mettre son nœud à jour',
            summary: 'Core Lightning demande aux opérateurs de nœuds de passer sans délai à la v26.06.8 '
                + 'après des attaques signalées sur les versions antérieures. Ce qui est corrigé.'
        },
        tr: {
            title: 'Core Lightning saldırı altında: düğümler neden yamalanmalı',
            summary: 'Core Lightning, eski sürümlere saldırı bildirimleri üzerine düğüm işletenlere hemen '
                + "v26.06.8'e geçmelerini söyledi. Ne düzeltildi, düğüm çalıştırmak ne demek."
        }
    }
};
