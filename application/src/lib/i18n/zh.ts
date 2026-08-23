import type { Strings } from './types';

export const zh: Strings =
{
    languageName: '中文',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: '代币经济',
        chain: '网络',
        wallet: '钱包',
        swap: '兑换',
        explorer: '浏览器',
        social: '社区',
        download: '下载',
        language: '语言',
        skipToContent: '跳到正文',
        openMenu: '打开菜单',
        closeMenu: '关闭菜单'
    },

    theme:
    {
        label: '主题',
        dark: '深色',
        light: '浅色'
    },

    hero:
    {
        headline: '你的密钥。你的资产。你说了算。',
        subhead: 'Nura 钱包让资产始终握在你自己手中，而不是放在别人的服务器上。快速、开放，为认真读细则的人而生。',
        primaryCta: '下载 Nura 钱包',
        secondaryCta: '探索这条链'
    },

    tokenomics:
    {
        title: '代币经济',
        subtitle: '每一枚代币的去向，以及何时解锁。',
        totalSupply: '总供应量',
        circulating: '流通量',
        allocation: '分配',
        vesting: '解锁时间表',
        provisional: '暂定数据，以最终公布为准。',

        allocations:
        {
            locked: '锁仓',
            liquidity: '流动性',
            community: '社区',
            publicSale: '公开发售',
            treasury: '国库',
            airdrop: '空投'
        },

        notes:
        {
            locked: '总供应量剩余的 40% 将锁定一年。该期限结束后再决定这部分如何使用，任何涉及这 40% 的决定都必须获得网络至少 65% 的投票通过。',
            liquidity: '总供应量的 25% 将在一年内用于提供和管理流动性，目的是为交易提供充足的流动性，并让 NURA 生态更稳定。',
            community: '总供应量的 10% 将在一年内分配给社区成员。这部分面向那些不直接出资，而是通过活跃参与、开发、推广或其他有效方式推动 NURA 生态成长的人。分配须经管理委员会审核批准。',
            publicSale: '总供应量的 10% 以公开发售形式出售，总价 24,000 美元。这部分包含 100,000,000 枚代币，相当于每枚 NURA 0.00024 美元。',
            treasury: '总供应量的 10% 将进入 NURA 金库。在一年期内并由管理委员会监督，用于生态建设、基础设施、产品、合作以及项目的其他需要。',
            airdrop: 'NURA 总供应量的 5% 将在一年内以空投形式发放。获得者将通过选定的渠道和社区确定，最终分配由管理委员会确认。'
        },

        moreAbout: '了解更多：'
    },

    network:
    {
        title: '网络活动',
        subtitle: '实时读取自 Nura RPC、区块浏览器与 Swap，缓存一分钟。',
        blockHeight: '区块高度',
        transactions: '交易总数',
        price: 'NURA 价格',
        priceNote: '关于此价格',
        priceThin: '报价来自 Nura Swap 的流动性池。该池规模很小，单笔交易即可大幅改变这一数字——这是市场报价，并非交易所上币。',
        priceSource: '来源',
        priceAsOf: '最后读取',
        tvl: '总锁仓价值',
        holder: '持有地址',
        breakdown: '该数字的构成',
        unavailable: '有数据未能加载。数据源恢复响应后会立即显示。'
    },

    chain:
    {
        title: '链信息',
        subtitle: '手动把 Nura Chain 添加到钱包所需的全部信息。',
        networkName: '网络名称',
        chainId: '链 ID',
        rpcUrl: 'RPC 节点',
        explorerUrl: '区块浏览器',
        nativeToken: '原生代币',
        blockTime: '出块时间',
        copy: '复制',
        copied: '已复制',
        provisional: '暂定值。发送资金前，请以官方公告为准。'
    },

    addChain:
    {
        cta: '将 Nura Chain 添加到钱包',
        done: '已添加到钱包',
        failed: '添加失败'
    },

    wallet:
    {
        title: 'Nura 钱包',
        subtitle: '一个钱包，适配你的每台设备。',
        platforms: '平台',
        comingSoon: '即将推出',
        allDownloads: '所有版本与架构见 GitHub',
        features:
        {
            selfCustody: '自主保管',
            selfCustodyBody: '你的私钥永远不会离开你的设备。就算我们想动你的资产，也做不到。',
            speed: '为速度而生',
            speedBody: '一键签名并广播。无需等待，没有中间人。',
            openSource: '开源',
            openSourceBody: '亲自读一读保管你资产的代码。每个版本都可复现并经过签名。'
        }
    },

    blog:
    {
        title: '博客',
        subtitle: '版本说明、网络动态，以及我们正在构建的东西。',
        all: '博客',
        empty: '暂无文章',
        emptyHint: '公告和版本说明将显示在这里。',
        readMore: '阅读',
        published: '发布于',
        updated: '更新于',
        everyTag: '全部',
        notFound: '该文章不存在',
        notFoundHint: '它可能已被重命名。我们发布的一切都在博客里。',
        loading: '加载中',
        notTranslated: '尚无你所用语言的版本。',
        availableIn: '可用语言'
    },

    pagination:
    {
        label: '分页',
        first: '第一页',
        previous: '上一页',
        next: '下一页',
        last: '最后一页',
        page: '第'
    },

    toast:
    {
        dismiss: '关闭',
        copyFailed: '无法复制。请选中该值手动复制。'
    },

    roadmap:
    {
        title: '路线图',
        subtitle: '已完成的、正在做的，以及接下来的。',
        status:
        {
            done: '已完成',
            now: '进行中',
            next: '计划中'
        },
        // Keyed by the ids in ROADMAP. Empty while ROADMAP is: a milestone added there
        // fails the build until its line exists in all ten tables.
        milestones: {}
    },

    explorer:
    {
        title: 'Nura 浏览器',
        subtitle: '跟踪网络上的任何区块、交易或地址。',
        cta: '打开浏览器'
    },

    social:
    {
        title: '加入社区',
        subtitle: '发布说明、路线图讨论与支持，一切公开进行。'
    },

    footer:
    {
        tagline: '开放、安全、可靠且去中心化的区块链。',
        product: '产品',
        resources: '资源',
        builtWith: '构建于',
        rights: '版权所有。'
    }
};
