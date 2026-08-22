import type { Article } from '../types.ts';

/**
 * Primary keyword: "deploy smart contract Nura Chain". Developer tutorial.
 *
 * Owns the general deployment ground - config, a contract, the deploy step, verification - so
 * that `create-an-erc-20-token-on-nura-chain` can be about the TOKEN rather than repeating a
 * Hardhat setup. That split is what stops the two competing for the same query.
 */
export const article: Article = {
    slug: 'deploy-a-smart-contract-on-nura-chain',
    tags: ['smart-contracts', 'developers', 'evm'],
    defaultLocale: 'en',
    status: 'published',
    coverImage: null,

    heads: {
        en: {
            title: 'Deploying a Smart Contract on Nura Chain',
            summary: 'Hardhat and Foundry configuration for chain ID 1020, a contract worth deploying, '
                + 'and how to confirm with eth_getCode that it actually landed.'
        },
        fa: {
            title: 'استقرار قرارداد هوشمند روی نورا چین',
            summary: 'پیکربندی هاردهت و فاندری برای شناسه زنجیره ۱۰۲۰، قراردادی که ارزش استقرار دارد، '
                + 'و راه تأیید با eth_getCode که واقعاً روی زنجیره نشسته است.'
        },
        ar: {
            title: 'نشر عقد ذكي على نورا تشين',
            summary: 'إعداد Hardhat وFoundry لمعرّف السلسلة 1020، وعقد يستحق النشر، وكيف تتأكد عبر '
                + 'eth_getCode من أنه استقر فعلًا على السلسلة.'
        },
        es: {
            title: 'Desplegar un contrato inteligente en Nura Chain',
            summary: 'Configuración de Hardhat y Foundry para el ID de cadena 1020, un contrato que merece '
                + 'desplegarse y cómo confirmar con eth_getCode que aterrizó de verdad.'
        },
        pt: {
            title: 'Implantar um contrato inteligente na Nura Chain',
            summary: 'Configuração de Hardhat e Foundry para o ID de cadeia 1020, um contrato que vale '
                + 'implantar e como confirmar com eth_getCode que ele realmente aterrissou.'
        },
        hi: {
            title: 'Nura Chain पर स्मार्ट कॉन्ट्रैक्ट तैनात करना',
            summary: 'चेन आईडी 1020 के लिए Hardhat और Foundry कॉन्फ़िगरेशन, तैनात करने लायक कॉन्ट्रैक्ट, '
                + 'और eth_getCode से पुष्टि कि यह सचमुच चेन पर पहुँचा।'
        },
        zh: {
            title: '在 Nura Chain 上部署智能合约',
            summary: '面向链 ID 1020 的 Hardhat 与 Foundry 配置、一份值得部署的合约，'
                + '以及如何用 eth_getCode 确认它确实落到了链上。'
        },
        ru: {
            title: 'Развёртывание смарт-контракта в Nura Chain',
            summary: 'Конфигурация Hardhat и Foundry для chain ID 1020, контракт, который стоит развернуть, '
                + 'и проверка через eth_getCode, что он действительно попал в цепочку.'
        },
        fr: {
            title: 'Déployer un contrat intelligent sur Nura Chain',
            summary: 'Configuration Hardhat et Foundry pour le chain ID 1020, un contrat qui mérite d\'être '
                + 'déployé, et la confirmation par eth_getCode qu\'il a bien atterri.'
        },
        tr: {
            title: 'Nura Chain Üzerinde Akıllı Sözleşme Dağıtmak',
            summary: 'Zincir kimliği 1020 için Hardhat ve Foundry yapılandırması, dağıtmaya değer bir '
                + 'sözleşme ve eth_getCode ile gerçekten indiğini doğrulama.'
        }
    }
};
