import type { Strings } from './types';

export const pt: Strings =
{
    languageName: 'Português',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Tokenomics',
        chain: 'Rede',
        wallet: 'Carteira',
        swap: 'Troca',
        explorer: 'Explorador',
        social: 'Comunidade',
        download: 'Baixar',
        whitepaper: 'Whitepaper',
        language: 'Idioma',
        skipToContent: 'Pular para o conteúdo',
        openMenu: 'Abrir menu',
        closeMenu: 'Fechar menu'
    },

    theme:
    {
        label: 'Tema',
        dark: 'Escuro',
        light: 'Claro'
    },

    hero:
    {
        headline: 'Suas chaves. Suas moedas. Sua decisão.',
        subhead: 'A Nura Wallet mantém seus ativos nas suas mãos, não no servidor de outra pessoa. Rápida, aberta e feita para quem lê as letras miúdas.',
        primaryCta: 'Baixar a Nura Wallet',
        secondaryCta: 'Explorar a rede'
    },

    tokenomics:
    {
        title: 'Tokenomics',
        subtitle: 'Para onde vai cada token e quando ele é desbloqueado.',
        totalSupply: 'Fornecimento total',
        circulating: 'Em circulação',
        allocation: 'Alocação',
        vesting: 'Cronograma de vesting',
        provisional: 'Números provisórios, aguardando publicação final.',

        allocations:
        {
            locked: 'Bloqueado',
            liquidity: 'Liquidez',
            community: 'Comunidade',
            publicSale: 'Venda pública',
            treasury: 'Tesouraria',
            airdrop: 'Airdrop'
        },

        notes:
        {
            locked: 'Os 40% restantes do fornecimento total ficarão bloqueados por um ano. Ao fim desse período decide-se como serão usados, e qualquer decisão sobre esses 40% precisa da aprovação de pelo menos 65% da rede em votação.',
            liquidity: '25% do fornecimento total serão destinados ao longo de um ano ao provimento e à gestão de liquidez. O objetivo é liquidez suficiente para negociação e um ecossistema NURA mais estável.',
            community: '10% do fornecimento total irão para membros da comunidade ao longo de um ano. Destina-se a quem, sem pagar nada diretamente, ajuda o NURA a crescer por meio de atividade, participação, desenvolvimento, divulgação ou outras contribuições efetivas. A alocação ocorre após análise e aprovação do conselho de gestão.',
            publicSale: '10% do fornecimento total é oferecido em venda pública por 24.000 USD no total. Essa parcela contém 100.000.000 de tokens, o que dá 0,00024 USD por NURA.',
            treasury: '10% do fornecimento total irão para a tesouraria do NURA. Ao longo de um ano, sob supervisão do conselho de gestão, financiarão o desenvolvimento do ecossistema, a infraestrutura, os produtos, as parcerias e outras necessidades do projeto.',
            airdrop: '5% do fornecimento total de NURA serão distribuídos como airdrop ao longo de um ano. Os contemplados serão identificados por canais e comunidades selecionados, e a alocação final é confirmada pelo conselho de gestão.'
        },

        moreAbout: 'Mais sobre'
    },

    network:
    {
        title: 'Atividade da rede',
        subtitle: 'Lido ao vivo do RPC, do explorador e do swap da Nura, com um minuto de cache.',
        blockHeight: 'Altura do bloco',
        transactions: 'Total de transações',
        price: 'Preço do NURA',
        priceNote: 'Sobre este preço',
        priceThin: 'Cotado pelo pool da Nura Swap. Esse pool é pequeno, portanto uma única negociação pode mover bastante este número: é um preço de mercado, não uma listagem em corretora.',
        priceSource: 'Fonte',
        priceAsOf: 'Última leitura',
        tvl: 'Valor total bloqueado',
        holder: 'Detido por',
        breakdown: 'O que compõe este número',
        unavailable: 'Não foi possível carregar um dos números. Ele volta assim que a fonte responder.'
    },

    chain:
    {
        title: 'Informações da rede',
        subtitle: 'Tudo o que você precisa para adicionar a Nura Chain à sua carteira manualmente.',
        networkName: 'Nome da rede',
        chainId: 'ID da cadeia',
        rpcUrl: 'Endpoint RPC',
        explorerUrl: 'Explorador de blocos',
        nativeToken: 'Token nativo',
        blockTime: 'Tempo de bloco',
        copy: 'Copiar',
        copied: 'Copiado',
        provisional: 'Valores provisórios. Confira com o anúncio oficial antes de enviar fundos.'
    },

    addChain:
    {
        cta: 'Adicionar a Nura Chain à carteira',
        done: 'Adicionada à sua carteira',
        failed: 'Não foi possível adicionar',
        pick: 'Escolhe uma carteira',
        get: 'Obter',
        detected: 'Detetada',
        openApp: 'Abrir a app',
        mismatch: 'A tua carteira já tem este id de cadeia com outro token. Remove-o aí ou usa os valores abaixo.',
        unanswered: 'A Nura Wallet não respondeu. Instala-a neste dispositivo e tenta de novo.'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'Uma carteira, em todos os seus dispositivos.',
        platforms: 'Plataformas',
        comingSoon: 'Em breve',
        allDownloads: 'Todas as versões e arquiteturas no GitHub',
        features:
        {
            selfCustody: 'Autocustódia',
            selfCustodyBody: 'Suas chaves privadas nunca saem do seu dispositivo. Não poderíamos gastar seus fundos nem se quiséssemos.',
            speed: 'Feita para a velocidade',
            speedBody: 'Assine e envie em um toque. Sem espera, sem intermediários.',
            openSource: 'Código aberto',
            openSourceBody: 'Leia o código que guarda o seu dinheiro. Cada versão é reproduzível e assinada.'
        }
    },

    blog:
    {
        title: 'Blog',
        subtitle: 'Notas de versão, novidades da rede e o que estamos a construir.',
        all: 'Blog',
        empty: 'Ainda não há publicações',
        emptyHint: 'Anúncios e notas de versão aparecerão aqui.',
        readMore: 'Ler',
        published: 'Publicado',
        updated: 'Atualizado',
        everyTag: 'Tudo',
        notFound: 'Essa publicação não existe',
        notFoundHint: 'Pode ter sido renomeada. Tudo o que publicámos está no blog.',
        loading: 'A carregar',
        notTranslated: 'Ainda não está disponível no seu idioma.',
        availableIn: 'Disponível em'
    },

    pagination:
    {
        label: 'Paginacao',
        first: 'Primeira pagina',
        previous: 'Pagina anterior',
        next: 'Pagina seguinte',
        last: 'Ultima pagina',
        page: 'Pagina'
    },

    toast:
    {
        dismiss: 'Fechar',
        copyFailed: 'Nao foi possivel copiar. Selecione o valor e copie a mao.'
    },

    roadmap:
    {
        title: 'Roteiro',
        subtitle: 'O que esta feito, o que esta a ser feito e o que vem a seguir.',
        status:
        {
            done: 'Concluido',
            now: 'Em curso',
            next: 'Planeado'
        },
        // Keyed by the ids in ROADMAP. Empty while ROADMAP is: a milestone added there
        // fails the build until its line exists in all ten tables.
        milestones: {}
    },

    whitepaper:
    {
        revision: 'Revisão',
        download: 'Baixar o PDF',
        downloadHint: 'O documento completo, diagramado para impressão, no idioma em que você está lendo.',
        failed: 'Não foi possível carregar o whitepaper. Recarregue a página para tentar de novo.'
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Acompanhe qualquer bloco, transação ou endereço na rede.',
        cta: 'Abrir o explorador'
    },

    social:
    {
        title: 'Junte-se à comunidade',
        subtitle: 'Notas de lançamento, debates sobre o roadmap e suporte, tudo às claras.'
    },

    footer:
    {
        tagline: 'Uma blockchain aberta, segura, protegida e descentralizada.',
        product: 'Produto',
        resources: 'Recursos',
        builtWith: 'Feito com',
        rights: 'Todos os direitos reservados.'
    }
};
