import type { WhitepaperHead } from './types.ts';

/**
 * The whitepaper's head. The bodies are the `<locale>.md` files beside this one.
 *
 * REVISION AND DATE ARE THE CONTRACT. The revision is printed on the page and on every PDF's
 * cover, and it is what a reader cites; `updatedAt` is what the sitemap reports as lastmod and
 * what the page prints beside the revision. A change to any body that a reader would notice
 * bumps both, in this file, and then `npm run whitepaper:pdf` re-renders the downloads - the
 * suite fails until it has been run, so the step cannot be forgotten.
 *
 * What the document may state is bounded by `application/src/lib/content/site.ts` and by what the
 * node answers over RPC. Every chain figure in the bodies - the chain id, the endpoints, the
 * block interval, the supply and the allocation - is a figure that file already states, and
 * every claim about block production was read from block headers on the date of this revision.
 * A body must not acquire a figure that neither source can back.
 *
 * The bodies are written for a reader with no technical background, and the summaries say so:
 * a search result should promise the plain-language guide the page actually is.
 */
export const WHITEPAPER: WhitepaperHead = {
    revision: '1.0',
    publishedAt: '2026-09-02T00:00:00.000Z',
    updatedAt: '2026-09-02T00:00:00.000Z',
    defaultLocale: 'en',

    heads: {
        en: {
            title: 'Nura Chain Whitepaper',
            summary: 'A plain-language guide to Nura Chain: what the network is, what the NURA coin '
                + 'does, how the billion coins are divided, the tools around it, and what you can '
                + 'check for yourself.'
        },
        fa: {
            title: 'وایت‌پیپر نورا چین',
            summary: 'راهنمای ساده نورا چین: شبکه چیست، کوین NURA چه می‌کند، یک میلیارد کوین چطور تقسیم '
                + 'شده، چه ابزارهایی دور آن هست، و چه چیزی را خودتان می‌توانید بررسی کنید.'
        },
        ar: {
            title: 'الورقة البيضاء لنورا تشين',
            summary: 'دليل بلغة بسيطة إلى نورا تشين: ما هي الشبكة، وما تفعله عملة NURA، وكيف تُقسَّم عملات '
                + 'المليار، والأدوات المحيطة بها، وما تستطيع التحقق منه بنفسك.'
        },
        es: {
            title: 'Whitepaper de Nura Chain',
            summary: 'Guía sencilla de Nura Chain: qué es la red, para qué sirve NURA, cómo se reparten '
                + 'los mil millones de monedas, sus herramientas y qué puedes comprobar por tu cuenta.'
        },
        pt: {
            title: 'Whitepaper da Nura Chain',
            summary: 'Guia em linguagem simples da Nura Chain: o que é a rede, o que faz o NURA, como o '
                + 'bilhão de moedas é dividido, as ferramentas ao redor e o que você mesmo pode conferir.'
        },
        hi: {
            title: 'Nura Chain व्हाइटपेपर',
            summary: 'Nura Chain की सीधी-सादी भाषा में गाइड: नेटवर्क क्या है, NURA कॉइन क्या करता है, एक अरब '
                + 'कॉइन कैसे बँटे हैं, आसपास के टूल, और आप ख़ुद क्या जाँच सकते हैं।'
        },
        zh: {
            title: 'Nura Chain 白皮书',
            summary: '一份用大白话写成的 Nura Chain 指南：这条网络是什么、NURA 代币有什么用、十亿枚币怎么分、'
                + '周边有哪些工具，以及哪些事你可以自己核实。'
        },
        ru: {
            title: 'Белая книга Nura Chain',
            summary: 'Простое объяснение Nura Chain: что такое сеть, зачем нужна монета NURA, как разделён '
                + 'миллиард монет, какие инструменты её окружают и что можно проверить самому.'
        },
        fr: {
            title: 'Livre blanc de Nura Chain',
            summary: 'Nura Chain expliquée simplement : le réseau, le rôle du NURA, la répartition du '
                + 'milliard de jetons, les outils autour et ce que vous pouvez vérifier vous-même.'
        },
        tr: {
            title: 'Nura Chain Teknik Dokümanı',
            summary: 'Nura Chain\'e sade bir rehber: ağ nedir, NURA coini ne işe yarar, bir milyar coin '
                + 'nasıl bölünüyor, çevresindeki araçlar ve kendiniz neyi denetleyebilirsiniz.'
        }
    }
};
