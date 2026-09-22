import type { Article } from '../types.ts';

/**
 * Vesting schedules, read as contracts rather than as calendar entries.
 *
 * Primary keyword: "token unlock". Topical because late September 2026 carries a heavy unlock
 * cluster, evergreen because the way to verify one has not changed. It hands the reader back
 * to the tokenomics article, which is where this site's own numbers live.
 */
export const article: Article = {
    slug: 'token-unlocks-and-supply-schedules',
    tags: ['tokenomics', 'guides', 'nura-chain'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-13T08:00:00.000Z',
    updatedAt: '2026-09-13T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Token Unlocks: How to Read a Supply Schedule',
            summary: 'Late September 2026 releases billions of tokens across several projects. What an unlock '
                + 'actually is, why circulating supply is the number that moves, and how to verify one.'
        },
        fa: {
            title: 'آزادسازی توکن: چگونه یک برنامه عرضه را بخوانیم',
            summary: 'اواخر سپتامبر ۲۰۲۶ میلیاردها توکن در چند پروژه آزاد می‌شود. آزادسازی واقعاً چیست، چرا '
                + 'عرضه در گردش عددی است که تکان می‌خورد، و چطور آن را راستی‌آزمایی کنیم.'
        },
        ar: {
            title: 'فكّ قفل التوكنات: كيف تقرأ جدول العرض',
            summary: 'يفرج أواخر سبتمبر 2026 عن مليارات التوكنات في عدة مشاريع. ما هو فكّ القفل فعلًا، ولماذا '
                + 'العرض المتداول هو الرقم الذي يتحرك، وكيف تتحقق منه.'
        },
        es: {
            title: 'Desbloqueos de tokens: cómo leer un calendario de oferta',
            summary: 'Finales de septiembre de 2026 libera miles de millones de tokens en varios proyectos. '
                + 'Qué es un desbloqueo, por qué la oferta circulante es la cifra que se mueve y cómo '
                + 'verificarlo.'
        },
        pt: {
            title: 'Desbloqueios de tokens: como ler um cronograma de oferta',
            summary: 'O fim de setembro de 2026 libera bilhões de tokens em vários projetos. O que é um '
                + 'desbloqueio, por que a oferta circulante é o número que se move e como verificar.'
        },
        hi: {
            title: 'टोकन अनलॉक: सप्लाई शेड्यूल कैसे पढ़ें',
            summary: 'सितंबर 2026 के आख़िरी हफ़्ते में कई परियोजनाओं के अरबों टोकन खुलते हैं। अनलॉक असल में '
                + 'क्या है, सर्कुलेटिंग सप्लाई ही क्यों हिलती है, और इसे कैसे जाँचें।'
        },
        zh: {
            title: '代币解锁：怎样读懂一张供应时间表',
            summary: '2026 年 9 月下旬有数十亿代币在多个项目中释放。解锁到底是什么、为什么流通量才是会动的那个数字，以及怎样自己去核对。'
        },
        ru: {
            title: 'Разлоки токенов: как читать график предложения',
            summary: 'Конец сентября 2026 года высвобождает миллиарды токенов сразу у нескольких проектов. Что '
                + 'такое разлок, почему двигается именно оборотное предложение и как всё это проверить.'
        },
        fr: {
            title: "Déblocages de jetons : lire un calendrier d'offre",
            summary: "Fin septembre 2026 libère des milliards de jetons chez plusieurs projets. Ce qu'est "
                + "vraiment un déblocage, pourquoi l'offre en circulation est le chiffre qui bouge."
        },
        tr: {
            title: 'Token kilit açılışları: arz takvimi nasıl okunur',
            summary: "Eylül 2026'nın sonu birkaç projede milyarlarca tokeni serbest bırakıyor. Kilit açılışı "
                + 'gerçekte nedir, neden dolaşımdaki arz hareket eder ve bunu nasıl doğrularsınız.'
        }
    }
};
