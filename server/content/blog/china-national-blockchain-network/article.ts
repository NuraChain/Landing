import type { Article } from '../types.ts';

/**
 * China's call for a national blockchain network: one clause in the CPC Central Committee
 * and State Council "Opinions on Developing New Quality Productive Forces", published by
 * Xinhua on 9 October 2026.
 *
 * Primary keyword: "China national blockchain network". Everything about the network is read
 * off the Xinhua text, which sets no dates, budget, design or builder - so the article says
 * none, and treats BSN as context attributed to Crypto Briefing rather than as the plan. The
 * crypto position is the February 2026 notice (Yinfa [2026] No. 42), which repealed the 2021
 * one that much of the coverage still cites; that disagreement is stated rather than repeated.
 */
export const article: Article = {
    slug: 'china-national-blockchain-network',
    tags: ['regulation', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T13:00:00.000Z',
    updatedAt: '2026-10-23T13:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'China Calls for a National Blockchain Network. What It Says',
            summary: "China's leadership called for a national blockchain network on 9 October 2026, in "
                + 'one clause of a 19-measure plan. What the text says, and what it leaves out.'
        },
        fa: {
            title: 'چین خواستار شبکه ملی بلاکچین شد. متن سند چه می‌گوید',
            summary: 'رهبری چین در ۹ اکتبر ۲۰۲۶ در یک بند از برنامه‌ای ۱۹ اقدامی خواستار شبکه ملی '
                + 'بلاکچین شد. متن سند چه می‌گوید و چه چیزهایی را ناگفته می‌گذارد.'
        },
        ar: {
            title: 'الصين تدعو إلى شبكة بلوكتشين وطنية. ماذا يقول النص',
            summary: 'دعت القيادة الصينية في 9 أكتوبر 2026 إلى شبكة بلوكتشين وطنية في بند واحد من خطة '
                + 'من 19 إجراءً. ماذا يقول النص، وما الذي يسكت عنه.'
        },
        es: {
            title: 'China pide una red nacional de blockchain. Qué dice el texto',
            summary: 'La cúpula china pidió el 9 de octubre de 2026 una red nacional de blockchain, en '
                + 'una cláusula de un plan de 19 medidas. Qué dice el texto y qué deja fuera.'
        },
        pt: {
            title: 'China pede uma rede nacional de blockchain. O que diz o texto',
            summary: 'A cúpula chinesa pediu em 9 de outubro de 2026 uma rede nacional de blockchain, '
                + 'numa cláusula de um plano de 19 medidas. O que o texto diz e o que deixa de fora.'
        },
        hi: {
            title: 'चीन ने राष्ट्रीय ब्लॉकचेन नेटवर्क की बात कही। दस्तावेज़ में क्या है',
            summary: '9 अक्टूबर 2026 को चीन के नेतृत्व ने 19 उपायों वाली एक योजना के एक खंड में राष्ट्रीय '
                + 'ब्लॉकचेन नेटवर्क की बात कही। पाठ क्या कहता है और क्या छोड़ देता है।'
        },
        zh: {
            title: '中国提出建设国家区块链网络：文件原文说了什么',
            summary: '2026 年 10 月 9 日，中共中央、国务院在一份含 19 条措施的意见中，用一句话提出建设国家区块链网络。原文说了什么，又没说什么。'
        },
        ru: {
            title: 'Китай призвал создать национальную блокчейн-сеть. Что в тексте',
            summary: '9 октября 2026 года руководство Китая призвало создать национальную блокчейн-сеть '
                + '— одной строкой в плане из 19 мер. Что говорит текст и о чём он молчит.'
        },
        fr: {
            title: 'La Chine veut un réseau blockchain national. Ce que dit le texte',
            summary: 'Les dirigeants chinois ont appelé le 9 octobre 2026 à un réseau blockchain '
                + "national, dans une clause d'un plan de 19 mesures. Ce que dit le texte, et ce qu'il tait."
        },
        tr: {
            title: 'Çin ulusal bir blokzincir ağı istiyor. Metin ne diyor',
            summary: "Çin yönetimi 9 Ekim 2026'da 19 maddelik bir planın tek bir hükmünde ulusal bir "
                + 'blokzincir ağı kurulmasını istedi. Metin ne söylüyor, neyi söylemiyor.'
        }
    }
};
