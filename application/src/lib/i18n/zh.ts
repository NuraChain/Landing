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
        light: '浅色',
        contrast: '高对比度'
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
        subtitle: '实时读取自 Nura RPC 与区块浏览器，缓存一分钟。',
        blockHeight: '区块高度',
        transactions: '交易总数',
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

    admin:
    {
        title: '控制台',
        signInHint: '输入密钥以继续。',
        key: '密钥',
        signIn: '登录',
        wrongKey: '该密钥未被接受。',
        tooMany: '尝试次数过多，请稍后再试。',
        signOut: '退出',
        posts: '文章',
        newPost: '新文章',
        noPosts: '暂无文章',
        noPostsHint: '写下第一篇。',
        edit: '编辑',
        remove: '删除',
        confirmRemove: '删除这篇文章及其全部译文？此操作无法撤销。',
        languages: '语言',
        slug: '短链名',
        status: '状态',
        draft: '草稿',
        published: '已发布',
        tags: '标签',
        tagsHint: '用逗号分隔。',
        coverImage: '封面图',
        defaultLocale: '回退语言',
        translations: '译文',
        addLanguage: '添加语言',
        removeLanguage: '移除此语言',
        postTitle: '标题',
        summary: '摘要',
        body: '正文',
        bodyHint: 'Markdown：## 标题、**加粗**、`代码`、- 列表、> 引用、[文字](链接)。',
        save: '保存',
        saving: '保存中',
        saved: '已保存',
        back: '全部文章',
        slugTaken: '该短链名已被占用。',
        failed: '未能保存，请重试。',
        required: '标题和正文为必填。',
        cannotRemoveDefault: '回退语言无法移除。',
        expiring: '此会话即将结束，请保存你的工作。',
        cancel: '取消',
        removed: '文章已删除'
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
        tagline: '为 Nura Chain 打造的自主保管钱包。',
        product: '产品',
        resources: '资源',
        builtWith: '构建于',
        rights: '版权所有。'
    }
};
