import type { Article } from '../types.ts';

/**
 * The Glamsterdam postponement of 22 October 2026: a gas repricing that lets `gasleft()` go
 * up, and the deployed contracts that assumed it never would.
 *
 * Primary keyword: "Glamsterdam delay". What was postponed is the HOODI testnet fork of
 * 26 October, by ACDE #248, as the Ethereum Foundation states it; no mainnet date was ever set,
 * so none is said to have moved. The EF names EIP-8037 only - EIP-8038 is ChainSecurity's
 * framing and is attributed to them. "13" is ChainSecurity's count of potentially affected
 * contracts, not of risks. It follows up ethereum-glamsterdam-upgrade and says what that
 * article did not cover rather than contradicting it. A new date will mean moving updatedAt.
 */
export const article: Article = {
    slug: 'ethereum-glamsterdam-delay-eip-8037',
    tags: ['ethereum', 'smart-contracts', 'developers'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-10-23T16:00:00.000Z',
    updatedAt: '2026-10-23T16:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Glamsterdam Delayed: Why EIP-8037 Worries Security Teams',
            summary: "Ethereum's core developers pulled Glamsterdam's 26 October Hoodi testnet fork over "
                + 'EIP-8037 gas risks to existing contracts. No new date has been set.'
        },
        fa: {
            title: 'تعویق Glamsterdam: چرا EIP-8037 تیم‌های امنیتی را نگران کرد',
            summary: 'توسعه‌دهندگان هسته اتریوم فورک ۲۶ اکتبر Glamsterdam روی شبکه آزمایشی Hoodi را به خاطر '
                + 'خطر گس EIP-8037 برای قراردادهای موجود کنار گذاشتند. تاریخ تازه‌ای تعیین نشده است.'
        },
        ar: {
            title: 'تأجيل Glamsterdam: لماذا يقلق EIP-8037 فرق الأمن',
            summary: 'سحب مطوّرو إيثيريوم الأساسيون فورك Glamsterdam المقرّر في 26 أكتوبر على شبكة Hoodi '
                + 'التجريبية بسبب مخاطر غاز EIP-8037 على العقود القائمة. لم يُحدَّد موعد جديد.'
        },
        es: {
            title: 'Glamsterdam se retrasa: por qué EIP-8037 preocupa a los auditores',
            summary: 'Los desarrolladores de Ethereum retiraron el fork de Glamsterdam en la testnet Hoodi '
                + 'del 26 de octubre por riesgos de gas de EIP-8037 en contratos existentes. Sin nueva fecha.'
        },
        pt: {
            title: 'Glamsterdam adiada: por que a EIP-8037 preocupa a segurança',
            summary: 'Os desenvolvedores da Ethereum retiraram o fork da Glamsterdam na testnet Hoodi, '
                + 'marcado para 26 de outubro, por riscos de gás da EIP-8037 em contratos existentes.'
        },
        hi: {
            title: 'Glamsterdam टला: EIP-8037 से सुरक्षा टीमें चिंतित क्यों',
            summary: 'Ethereum के कोर डेवलपर्स ने मौजूदा कॉन्ट्रैक्ट्स पर EIP-8037 के गैस जोखिम के कारण Hoodi '
                + 'टेस्टनेट पर 26 अक्टूबर का Glamsterdam फ़ोर्क रोक दिया। नई तारीख तय नहीं हुई है।'
        },
        zh: {
            title: 'Glamsterdam 推迟：EIP-8037 为何让安全团队担忧',
            summary: '以太坊核心开发者因 EIP-8037 的 gas 改动对现有合约构成风险，撤下了原定 10 月 26 日在 Hoodi 测试网激活的 Glamsterdam 分叉，新日期尚未确定。'
        },
        ru: {
            title: 'Glamsterdam отложен: чем EIP-8037 тревожит аудиторов',
            summary: 'Основные разработчики Ethereum отменили форк Glamsterdam в тестнете Hoodi, назначенный '
                + 'на 26 октября, из-за газовых рисков EIP-8037 для действующих контрактов. Новой даты нет.'
        },
        fr: {
            title: "Glamsterdam reporté : pourquoi l'EIP-8037 inquiète la sécurité",
            summary: "Les développeurs d'Ethereum ont retiré le fork Glamsterdam du testnet Hoodi prévu le "
                + "26 octobre, en raison des risques de gaz de l'EIP-8037 pour les contrats existants."
        },
        tr: {
            title: 'Glamsterdam ertelendi: EIP-8037 güvenlik ekiplerini neden kaygılandırıyor',
            summary: "Ethereum çekirdek geliştiricileri, EIP-8037'nin mevcut sözleşmelere gaz riski nedeniyle "
                + "Hoodi test ağındaki 26 Ekim Glamsterdam çatallanmasını geri çekti. Yeni tarih yok."
        }
    }
};
