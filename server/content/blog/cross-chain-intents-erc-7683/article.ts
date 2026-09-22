import type { Article } from '../types.ts';

/**
 * Intents, explained as an order book rather than as a UX slogan.
 *
 * Primary keyword: "cross-chain intents". The useful half is the trust comparison: an intent
 * moves the risk from a locked bridge contract to a solver and an escrow, which is a different
 * risk and not an absent one.
 */
export const article: Article = {
    slug: 'cross-chain-intents-erc-7683',
    tags: ['interoperability', 'developers', 'evm'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-16T08:00:00.000Z',
    updatedAt: '2026-09-16T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'Cross-Chain Intents: Sign the Outcome, Not the Route',
            summary: 'ERC-7683 turned "give me USDC over there" into a standard order that a solver network '
                + 'fills. How intents differ from bridging, and what you are trusting instead.'
        },
        fa: {
            title: 'اینتنت‌های بین‌زنجیره‌ای: نتیجه را امضا کنید، نه مسیر را',
            summary: 'ERC-7683 جمله «USDC را آن‌طرف به من برسان» را به سفارشی استاندارد تبدیل کرد که شبکه‌ای '
                + 'از حل‌کننده‌ها پرش می‌کند. تفاوتش با پل زدن چیست و به‌جایش به چه چیزی اعتماد می‌کنید.'
        },
        ar: {
            title: 'النوايا عبر السلاسل: وقّع النتيجة لا المسار',
            summary: 'حوّل ERC-7683 عبارة «أعطني USDC هناك» إلى أمر قياسي تنفّذه شبكة من المنفّذين. كيف تختلف '
                + 'النوايا عن الجسور، وما الذي تثق به بدلًا من ذلك.'
        },
        es: {
            title: 'Intents entre cadenas: firmas el resultado, no la ruta',
            summary: 'ERC-7683 convirtió "dame USDC allí" en una orden estándar que una red de solvers '
                + 'ejecuta. En qué se diferencian los intents de un puente y en qué estás confiando a '
                + 'cambio.'
        },
        pt: {
            title: 'Intents entre redes: você assina o resultado, não a rota',
            summary: 'A ERC-7683 transformou "me dê USDC lá" numa ordem padrão que uma rede de solvers '
                + 'executa. Como os intents diferem de uma ponte e no que você passa a confiar.'
        },
        hi: {
            title: 'क्रॉस-चेन इंटेंट: आप नतीजे पर हस्ताक्षर करते हैं, रास्ते पर नहीं',
            summary: 'ERC-7683 ने "मुझे उस चेन पर USDC दो" को एक मानक ऑर्डर बना दिया जिसे सॉल्वर नेटवर्क पूरा '
                + 'करता है। इंटेंट ब्रिज से कैसे अलग हैं, और आप बदले में किस पर भरोसा कर रहे हैं।'
        },
        zh: {
            title: '跨链意图：你签的是结果，不是路径',
            summary: 'ERC-7683 把「把 USDC 给我弄到那条链上」变成一张由求解者网络承接的标准订单。意图与跨链桥有何不同，以及你转而在信任什么。'
        },
        ru: {
            title: 'Кросс-чейн интенты: вы подписываете результат, а не маршрут',
            summary: 'ERC-7683 превратил «дай мне USDC вон там» в стандартный ордер, который исполняет сеть '
                + 'солверов. Чем интенты отличаются от моста и чему вы доверяете взамен.'
        },
        fr: {
            title: 'Intents inter-chaînes : signez le résultat, pas le trajet',
            summary: "ERC-7683 a transformé « donne-moi de l'USDC là-bas » en un ordre standard qu'un réseau "
                + "de solveurs exécute. En quoi les intents diffèrent d'un pont, et à qui vous faites "
                + 'confiance.'
        },
        tr: {
            title: 'Zincirler arası niyetler: rotayı değil sonucu imzalarsınız',
            summary: 'ERC-7683, "bana şu zincirde USDC ver" cümlesini bir çözücü ağının karşıladığı standart '
                + 'bir emre dönüştürdü. Niyetler köprüden nasıl ayrılır ve karşılığında neye güvenirsiniz.'
        }
    }
};
