import type { Strings } from './types';

export const fr: Strings =
{
    languageName: 'Français',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Tokenomics',
        chain: 'Réseau',
        wallet: 'Portefeuille',
        explorer: 'Explorateur',
        social: 'Communauté',
        download: 'Télécharger',
        language: 'Langue',
        skipToContent: 'Aller au contenu',
        openMenu: 'Ouvrir le menu',
        closeMenu: 'Fermer le menu'
    },

    theme:
    {
        label: 'Thème',
        dark: 'Sombre',
        light: 'Clair',
        contrast: 'Contraste élevé'
    },

    hero:
    {
        headline: 'Vos clés. Vos jetons. Vous décidez.',
        subhead: 'Nura Wallet garde vos actifs entre vos mains, pas sur le serveur de quelqu\'un d\'autre. Rapide, ouvert et conçu pour ceux qui lisent les petites lignes.',
        primaryCta: 'Télécharger Nura Wallet',
        secondaryCta: 'Explorer le réseau'
    },

    tokenomics:
    {
        title: 'Tokenomics',
        subtitle: 'Où va chaque jeton, et quand il est débloqué.',
        totalSupply: 'Offre totale',
        circulating: 'En circulation',
        allocation: 'Répartition',
        vesting: 'Calendrier de vesting',
        provisional: 'Chiffres provisoires, en attente de publication finale.',

        allocations:
        {
            locked: 'Verrouillé',
            liquidity: 'Liquidité',
            community: 'Communauté',
            publicSale: 'Vente publique',
            treasury: 'Trésorerie',
            airdrop: 'Airdrop'
        },

        notes:
        {
            locked: 'Les 40% restants de l\'offre totale seront verrouillés pendant un an. À la fin de cette période, leur usage sera décidé, et toute décision portant sur ces 40% devra être approuvée par au moins 65% du réseau.',
            liquidity: '25% de l\'offre totale seront consacrés sur un an à l\'apport et à la gestion de la liquidité. L\'objectif : une liquidité suffisante pour les échanges et un écosystème NURA plus stable.',
            community: '10% de l\'offre totale iront aux membres de la communauté sur un an. Cette part revient à celles et ceux qui, sans rien payer directement, font grandir NURA par leur activité, leur participation, le développement, la recommandation ou tout autre apport utile. L\'attribution intervient après examen et approbation du conseil de gestion.',
            treasury: '10% de l\'offre totale iront à la trésorerie NURA. Sur un an et sous la supervision du conseil de gestion, cette part finance le développement de l\'écosystème, l\'infrastructure, les produits, les partenariats et les autres besoins du projet.',
            airdrop: '5% de l\'offre totale de NURA seront distribués en airdrop sur un an. Les bénéficiaires seront identifiés via des canaux et des communautés sélectionnés, et l\'attribution finale est confirmée par le conseil de gestion.'
        },

        moreAbout: 'En savoir plus :'
    },

    chain:
    {
        title: 'Informations réseau',
        subtitle: 'Tout ce qu\'il faut pour ajouter Nura Chain à votre portefeuille à la main.',
        networkName: 'Nom du réseau',
        chainId: 'ID de chaîne',
        rpcUrl: 'Endpoint RPC',
        explorerUrl: 'Explorateur de blocs',
        nativeToken: 'Jeton natif',
        blockTime: 'Temps de bloc',
        copy: 'Copier',
        copied: 'Copié',
        provisional: 'Valeurs provisoires. Vérifiez-les dans l\'annonce officielle avant d\'envoyer des fonds.'
    },

    addChain:
    {
        cta: 'Ajouter Nura Chain au portefeuille',
        done: 'Ajoutée à votre portefeuille',
        failed: 'Échec de l\'ajout'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'Un portefeuille, sur tous vos appareils.',
        platforms: 'Plateformes',
        comingSoon: 'Bientôt disponible',
        allDownloads: 'Toutes les versions et architectures sur GitHub',
        features:
        {
            selfCustody: 'Auto-conservation',
            selfCustodyBody: 'Vos clés privées ne quittent jamais votre appareil. Nous ne pourrions pas dépenser vos fonds même si nous le voulions.',
            speed: 'Conçu pour la vitesse',
            speedBody: 'Signez et diffusez en un geste. Pas d\'attente, pas d\'intermédiaire.',
            openSource: 'Open source',
            openSourceBody: 'Lisez le code qui garde votre argent. Chaque version est reproductible et signée.'
        }
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Suivez chaque bloc, transaction ou adresse du réseau.',
        cta: 'Ouvrir l\'explorateur'
    },

    social:
    {
        title: 'Rejoignez la communauté',
        subtitle: 'Notes de version, débats sur la feuille de route et support, au grand jour.'
    },

    footer:
    {
        tagline: 'Un portefeuille en auto-conservation pour Nura Chain.',
        product: 'Produit',
        resources: 'Ressources',
        builtWith: 'Construit avec',
        rights: 'Tous droits réservés.'
    }
};
