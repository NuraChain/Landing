import type { Strings } from './types';

export const ru: Strings =
{
    languageName: 'Русский',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Токеномика',
        chain: 'Сеть',
        wallet: 'Кошелёк',
        explorer: 'Обозреватель',
        social: 'Сообщество',
        download: 'Скачать',
        language: 'Язык',
        skipToContent: 'Перейти к содержимому',
        openMenu: 'Открыть меню',
        closeMenu: 'Закрыть меню'
    },

    theme:
    {
        label: 'Тема',
        dark: 'Тёмная',
        light: 'Светлая',
        contrast: 'Высокая контрастность'
    },

    hero:
    {
        headline: 'Ваши ключи. Ваши монеты. Ваше решение.',
        subhead: 'Nura Wallet хранит ваши активы у вас, а не на чужом сервере. Быстрый, открытый и создан для тех, кто читает мелкий шрифт.',
        primaryCta: 'Скачать Nura Wallet',
        secondaryCta: 'Исследовать сеть'
    },

    tokenomics:
    {
        title: 'Токеномика',
        subtitle: 'Куда идёт каждый токен и когда он разблокируется.',
        totalSupply: 'Общее предложение',
        circulating: 'В обращении',
        allocation: 'Распределение',
        vesting: 'График вестинга',
        provisional: 'Предварительные цифры, ожидается финальная публикация.',

        allocations:
        {
            locked: 'Заблокировано',
            liquidity: 'Ликвидность',
            community: 'Сообщество',
            publicSale: 'Публичная продажа',
            treasury: 'Казна',
            validators: 'Валидаторы'
        }
    },

    chain:
    {
        title: 'Информация о сети',
        subtitle: 'Всё, что нужно, чтобы добавить Nura Chain в кошелёк вручную.',
        networkName: 'Название сети',
        chainId: 'ID сети',
        rpcUrl: 'RPC-эндпоинт',
        explorerUrl: 'Обозреватель блоков',
        nativeToken: 'Нативный токен',
        blockTime: 'Время блока',
        copy: 'Копировать',
        copied: 'Скопировано',
        provisional: 'Предварительные значения. Сверьте их с официальным объявлением, прежде чем отправлять средства.'
    },

    addChain:
    {
        cta: 'Добавить Nura Chain в кошелёк',
        done: 'Добавлена в кошелёк',
        failed: 'Не удалось добавить'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'Один кошелёк на всех ваших устройствах.',
        platforms: 'Платформы',
        comingSoon: 'Скоро',
        allDownloads: 'Все сборки и архитектуры на GitHub',
        features:
        {
            selfCustody: 'Самостоятельное хранение',
            selfCustodyBody: 'Ваши приватные ключи никогда не покидают устройство. Мы не смогли бы потратить ваши средства, даже если бы захотели.',
            speed: 'Создан для скорости',
            speedBody: 'Подписывайте и отправляйте в одно касание. Без ожидания и посредников.',
            openSource: 'Открытый код',
            openSourceBody: 'Читайте код, который хранит ваши деньги. Каждый релиз воспроизводим и подписан.'
        }
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Следите за любым блоком, транзакцией или адресом в сети.',
        cta: 'Открыть обозреватель'
    },

    social:
    {
        title: 'Присоединяйтесь к сообществу',
        subtitle: 'Заметки о релизах, споры о дорожной карте и поддержка — всё открыто.'
    },

    footer:
    {
        tagline: 'Кошелёк для самостоятельного хранения в сети Nura Chain.',
        product: 'Продукт',
        resources: 'Ресурсы',
        builtWith: 'Сделано на',
        rights: 'Все права защищены.'
    }
};
