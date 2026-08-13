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
        explorer: '浏览器',
        social: '社区',
        download: '下载',
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
            validators: '验证者'
        }
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
