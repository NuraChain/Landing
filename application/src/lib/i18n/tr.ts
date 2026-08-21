import type { Strings } from './types';

export const tr: Strings =
{
    languageName: 'Türkçe',

    brand: 'Nura Chain',

    nav:
    {
        tokenomics: 'Tokenomi',
        chain: 'Ağ',
        wallet: 'Cüzdan',
        swap: 'Takas',
        explorer: 'Gezgin',
        social: 'Topluluk',
        download: 'İndir',
        language: 'Dil',
        skipToContent: 'İçeriğe atla',
        openMenu: 'Menüyü aç',
        closeMenu: 'Menüyü kapat'
    },

    theme:
    {
        label: 'Tema',
        dark: 'Koyu',
        light: 'Açık',
        contrast: 'Yüksek kontrast'
    },

    hero:
    {
        headline: 'Anahtarlar senin. Coinler senin. Karar senin.',
        subhead: 'Nura Wallet varlıklarını başkasının sunucusunda değil, senin elinde tutar. Hızlı, açık ve ince yazıları okuyanlar için tasarlandı.',
        primaryCta: 'Nura Wallet\'ı indir',
        secondaryCta: 'Ağı keşfet'
    },

    tokenomics:
    {
        title: 'Tokenomi',
        subtitle: 'Her token nereye gidiyor ve kilidi ne zaman açılıyor.',
        totalSupply: 'Toplam arz',
        circulating: 'Dolaşımda',
        allocation: 'Dağılım',
        vesting: 'Serbest bırakma takvimi',
        provisional: 'Geçici rakamlar; nihai yayını bekliyor.',

        allocations:
        {
            locked: 'Kilitli',
            liquidity: 'Likidite',
            community: 'Topluluk',
            publicSale: 'Halka arz',
            treasury: 'Hazine',
            airdrop: 'Airdrop'
        },

        notes:
        {
            locked: 'Toplam arzın kalan %40\'ı bir yıl boyunca kilitli kalacak. Bu sürenin sonunda nasıl kullanılacağına karar verilecek; bu %40 hakkındaki her karar, ağın en az %65\'inin oyuyla onaylanmalı.',
            liquidity: 'Toplam arzın %25\'i bir yıl boyunca likidite sağlamak ve yönetmek için ayrılacak. Amaç, işlemler için yeterli likidite ve daha istikrarlı bir NURA ekosistemi.',
            community: 'Toplam arzın %10\'u bir yıl içinde topluluk üyelerine ayrılacak. Bu pay, doğrudan ödeme yapmadan; etkinlik, katılım, geliştirme, tanıtım veya başka etkili yollarla NURA ekosisteminin büyümesine katkı verenler için. Dağıtım, yönetim kurulunun incelemesi ve onayının ardından yapılacak.',
            publicSale: 'Toplam arzın %10\'u toplam 24.000 dolar karşılığında halka arz edilir. Bu pay 100.000.000 token içerir; bu da NURA başına 0,00024 dolar demektir.',
            treasury: 'Toplam arzın %10\'u NURA hazinesine gidecek. Bir yıl boyunca ve yönetim kurulunun gözetiminde ekosistem geliştirme, altyapı, ürünler, iş birlikleri ve projenin diğer ihtiyaçları için kullanılacak.',
            airdrop: 'NURA toplam arzının %5\'i bir yıllık süre boyunca airdrop olarak dağıtılacak. Alıcılar seçilmiş kanallar ve topluluklar üzerinden belirlenecek, nihai dağıtım yönetim kurulunun onayıyla yapılacak.'
        },

        moreAbout: 'Ayrıntılar:'
    },

    network:
    {
        title: 'Ağ etkinliği',
        subtitle: 'Nura RPC\'si ve gezgininden canlı okunur, bir dakika önbelleklenir.',
        blockHeight: 'Blok yüksekliği',
        transactions: 'Toplam işlem',
        tvl: 'Kilitli toplam değer',
        holder: 'Tutan adres',
        breakdown: 'Bu rakamı ne oluşturuyor',
        unavailable: 'Bir veri yüklenemedi. Kaynağı yanıt verir vermez geri gelir.'
    },

    chain:
    {
        title: 'Ağ bilgileri',
        subtitle: 'Nura Chain\'i cüzdanına elle eklemek için gereken her şey.',
        networkName: 'Ağ adı',
        chainId: 'Zincir kimliği',
        rpcUrl: 'RPC uç noktası',
        explorerUrl: 'Blok gezgini',
        nativeToken: 'Yerel token',
        blockTime: 'Blok süresi',
        copy: 'Kopyala',
        copied: 'Kopyalandı',
        provisional: 'Geçici değerler. Para göndermeden önce resmî duyuruyla karşılaştır.'
    },

    addChain:
    {
        cta: 'Nura Chain\'i cüzdana ekle',
        done: 'Cüzdanına eklendi',
        failed: 'Eklenemedi'
    },

    wallet:
    {
        title: 'Nura Wallet',
        subtitle: 'Tek cüzdan, tüm cihazların.',
        platforms: 'Platformlar',
        comingSoon: 'Çok yakında',
        allDownloads: 'Tüm sürümler ve mimariler GitHub\'da',
        features:
        {
            selfCustody: 'Öz saklama',
            selfCustodyBody: 'Özel anahtarların cihazından asla çıkmaz. İstesek bile varlıklarını harcayamayız.',
            speed: 'Hız için tasarlandı',
            speedBody: 'Tek dokunuşla imzala ve gönder. Bekleme yok, aracı yok.',
            openSource: 'Açık kaynak',
            openSourceBody: 'Paranı tutan kodu kendin oku. Her sürüm yeniden üretilebilir ve imzalıdır.'
        }
    },

    blog:
    {
        title: 'Blog',
        subtitle: 'Sürüm notları, ağ güncellemeleri ve inşa ettiklerimiz.',
        all: 'Blog',
        empty: 'Henüz yazı yok',
        emptyHint: 'Duyurular ve sürüm notları burada görünecek.',
        readMore: 'Oku',
        published: 'Yayımlandı',
        updated: 'Güncellendi',
        everyTag: 'Tümü',
        notFound: 'Böyle bir yazı yok',
        notFoundHint: 'Adı değişmiş olabilir. Yayımladığımız her şey blogda.',
        loading: 'Yükleniyor',
        notTranslated: 'Henüz sizin dilinizde mevcut değil.',
        availableIn: 'Şu dillerde var'
    },

    admin:
    {
        title: 'Panel',
        signInHint: 'Devam etmek icin anahtarinizi girin.',
        key: 'Anahtar',
        signIn: 'Giris yap',
        wrongKey: 'Bu anahtar kabul edilmedi.',
        tooMany: 'Cok fazla deneme. Daha sonra tekrar deneyin.',
        signOut: 'Cikis yap',
        posts: 'Yazilar',
        newPost: 'Yeni yazi',
        noPosts: 'Henuz yazi yok',
        noPostsHint: 'Ilkini yazin.',
        edit: 'Duzenle',
        remove: 'Sil',
        confirmRemove: 'Bu yazi ve tum cevirileri silinsin mi? Bu geri alinamaz.',
        languages: 'Diller',
        slug: 'Slug',
        status: 'Durum',
        draft: 'Taslak',
        published: 'Yayimlandi',
        tags: 'Etiketler',
        tagsHint: 'Virgulle ayirin.',
        coverImage: 'Kapak gorseli',
        defaultLocale: 'Yedek dil',
        translations: 'Ceviriler',
        addLanguage: 'Dil ekle',
        removeLanguage: 'Bu dili kaldir',
        postTitle: 'Baslik',
        summary: 'Ozet',
        body: 'Govde',
        bodyHint: 'Markdown: ## baslik, **kalin**, `kod`, - liste, > alinti, [metin](url).',
        save: 'Kaydet',
        saving: 'Kaydediliyor',
        saved: 'Kaydedildi',
        back: 'Tum yazilar',
        slugTaken: 'Bu slug zaten kullanimda.',
        failed: 'Kaydedilmedi. Tekrar deneyin.',
        required: 'Baslik ve govde gerekli.',
        cannotRemoveDefault: 'Yedek dil kaldirilamaz.',
        expiring: 'Bu oturum yakinda bitiyor. Calismanizi kaydedin.',
        cancel: 'Vazgec',
        removed: 'Yazi silindi'
    },

    pagination:
    {
        label: 'Sayfalama',
        first: 'Ilk sayfa',
        previous: 'Onceki sayfa',
        next: 'Sonraki sayfa',
        last: 'Son sayfa',
        page: 'Sayfa'
    },

    toast:
    {
        dismiss: 'Kapat',
        copyFailed: 'Kopyalanamadi. Degeri secip elle kopyalayin.'
    },

    roadmap:
    {
        title: 'Yol haritasi',
        subtitle: 'Yapilanlar, yapilmakta olanlar ve sirada olanlar.',
        status:
        {
            done: 'Tamamlandi',
            now: 'Devam ediyor',
            next: 'Planlandi'
        },
        // Keyed by the ids in ROADMAP. Empty while ROADMAP is: a milestone added there
        // fails the build until its line exists in all ten tables.
        milestones: {}
    },

    explorer:
    {
        title: 'Nura Explorer',
        subtitle: 'Ağdaki her bloğu, işlemi veya adresi takip et.',
        cta: 'Gezgini aç'
    },

    social:
    {
        title: 'Topluluğa katıl',
        subtitle: 'Sürüm notları, yol haritası tartışmaları ve destek, hepsi açıkta.'
    },

    footer:
    {
        tagline: 'Nura Chain için öz saklamalı bir cüzdan.',
        product: 'Ürün',
        resources: 'Kaynaklar',
        builtWith: 'Şununla yapıldı:',
        rights: 'Tüm hakları saklıdır.'
    }
};
