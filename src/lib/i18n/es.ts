import type { Strings } from './types';

export const es: Strings =
{
    languageName: 'Español',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Tokenomics',
        chain: 'Red',
        wallet: 'Billetera',
        explorer: 'Explorador',
        social: 'Comunidad',
        download: 'Descargar',
        language: 'Idioma',
        skipToContent: 'Saltar al contenido',
        openMenu: 'Abrir menú',
        closeMenu: 'Cerrar menú'
    },

    theme:
    {
        label: 'Tema',
        dark: 'Oscuro',
        light: 'Claro',
        contrast: 'Alto contraste'
    },

    hero:
    {
        headline: 'Tus llaves. Tus monedas. Tú decides.',
        subhead: 'Nura Wallet mantiene tus activos en tus manos, no en el servidor de otro. Rápida, abierta y hecha para quienes leen la letra pequeña.',
        primaryCta: 'Descargar Nura Wallet',
        secondaryCta: 'Explorar la red'
    },

    tokenomics:
    {
        title: 'Tokenomics',
        subtitle: 'A dónde va cada token y cuándo se desbloquea.',
        totalSupply: 'Suministro total',
        circulating: 'En circulación',
        allocation: 'Asignación',
        vesting: 'Calendario de desbloqueo',
        provisional: 'Cifras provisionales, pendientes de publicación final.',

        allocations:
        {
            locked: 'Bloqueado',
            liquidity: 'Liquidez',
            community: 'Comunidad',
            publicSale: 'Venta pública',
            treasury: 'Tesorería',
            airdrop: 'Airdrop'
        },

        notes:
        {
            locked: 'El 40% restante del suministro total quedará bloqueado durante un año. Al terminar ese periodo se decidirá cómo se usa, y cualquier decisión sobre ese 40% deberá aprobarse con el voto de al menos el 65% de la red.',
            liquidity: 'El 25% del suministro total se destinará a lo largo de un año a aportar y gestionar liquidez. El objetivo es una liquidez suficiente para operar y un ecosistema NURA más estable.',
            community: 'El 10% del suministro total se repartirá entre los miembros de la comunidad a lo largo de un año. Está pensado para quienes, sin pagar nada directamente, contribuyen al crecimiento de NURA con su actividad, participación, desarrollo, difusión u otras aportaciones efectivas. La asignación se hará tras la revisión y aprobación del consejo de gestión.',
            publicSale: 'El 10% del suministro total se ofrece en venta pública por un total de 24.000 USD. Esa parte contiene 100.000.000 de tokens, lo que equivale a 0,00024 USD por NURA.',
            treasury: 'El 10% del suministro total irá a la tesorería de NURA. Durante un año, y bajo la supervisión del consejo de gestión, financiará el desarrollo del ecosistema, la infraestructura, los productos, las alianzas y otras necesidades del proyecto.',
            airdrop: 'El 5% del suministro total de NURA se distribuirá como airdrop a lo largo de un año. Los destinatarios se identificarán a través de canales y comunidades seleccionados, y la asignación final la confirma el consejo de gestión.'
        },

        moreAbout: 'Más sobre'
    },

    network:
    {
        title: 'Actividad de la red',
        subtitle: 'Leído en directo del RPC y el explorador de Nura, con un minuto de caché.',
        blockHeight: 'Altura de bloque',
        transactions: 'Transacciones totales',
        tvl: 'Valor total bloqueado',
        holder: 'En poder de',
        breakdown: 'Qué compone esta cifra',
        unavailable: 'No se pudo cargar una de las cifras. Vuelve en cuanto responda su fuente.'
    },

    chain:
    {
        title: 'Información de la red',
        subtitle: 'Todo lo que necesitas para añadir Nura Chain a tu billetera a mano.',
        networkName: 'Nombre de la red',
        chainId: 'ID de la cadena',
        rpcUrl: 'Endpoint RPC',
        explorerUrl: 'Explorador de bloques',
        nativeToken: 'Token nativo',
        blockTime: 'Tiempo de bloque',
        copy: 'Copiar',
        copied: 'Copiado',
        provisional: 'Valores provisionales. Verifícalos con el anuncio oficial antes de enviar fondos.'
    },

    addChain:
    {
        cta: 'Añadir Nura Chain a la billetera',
        done: 'Añadida a tu billetera',
        failed: 'No se pudo añadir'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'Una billetera, en todos tus dispositivos.',
        platforms: 'Plataformas',
        comingSoon: 'Próximamente',
        allDownloads: 'Todas las versiones y arquitecturas en GitHub',
        features:
        {
            selfCustody: 'Autocustodia',
            selfCustodyBody: 'Tus claves privadas nunca salen de tu dispositivo. No podríamos gastar tus fondos aunque quisiéramos.',
            speed: 'Hecha para la velocidad',
            speedBody: 'Firma y envía en un toque. Sin esperas ni intermediarios.',
            openSource: 'Código abierto',
            openSourceBody: 'Lee el código que guarda tu dinero. Cada versión es reproducible y está firmada.'
        }
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Sigue cualquier bloque, transacción o dirección de la red.',
        cta: 'Abrir el explorador'
    },

    social:
    {
        title: 'Únete a la comunidad',
        subtitle: 'Notas de versión, debates sobre la hoja de ruta y soporte, todo a la vista.'
    },

    footer:
    {
        tagline: 'Una billetera de autocustodia para Nura Chain.',
        product: 'Producto',
        resources: 'Recursos',
        builtWith: 'Hecho con',
        rights: 'Todos los derechos reservados.'
    }
};
