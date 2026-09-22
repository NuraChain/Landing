import type { Article } from '../types.ts';

/**
 * Fees, computed rather than compared.
 *
 * Primary keyword: "gas fees 2026". The article exists because every "cheapest chain" claim
 * quotes one of the three numbers a fee is made of. The curl in the middle is the point: the
 * reader can price a transfer on any EVM network in ten seconds without trusting a table.
 */
export const article: Article = {
    slug: 'what-gas-actually-costs-in-2026',
    tags: ['gas', 'developers', 'guides'],
    defaultLocale: 'en',
    status: 'published',

    publishedAt: '2026-09-14T08:00:00.000Z',
    updatedAt: '2026-09-14T08:00:00.000Z',
    coverImage: null,

    heads: {
        en: {
            title: 'What Gas Actually Costs in 2026',
            summary: 'A fee is gas units times gas price times the coin\'s price. Most "cheapest chain" claims '
                + 'quote one of the three. How to compute the number that matters, on any EVM network.'
        },
        fa: {
            title: 'گس در ۲۰۲۶ واقعاً چقدر هزینه دارد',
            summary: 'کارمزد یعنی واحد گس ضربدر قیمت گس ضربدر قیمت کوین. بیشتر ادعاهای «ارزان‌ترین زنجیره» یکی '
                + 'از این سه را می‌گویند. عدد مهم را روی هر شبکه EVM چطور حساب کنیم.'
        },
        ar: {
            title: 'كم يكلّف الغاز فعليًا في 2026',
            summary: 'الرسم هو وحدات الغاز في سعر الغاز في سعر العملة. ومعظم دعاوى «أرخص سلسلة» تذكر واحدًا من '
                + 'الثلاثة. كيف تحسب الرقم المهم على أي شبكة EVM.'
        },
        es: {
            title: 'Cuánto cuesta el gas de verdad en 2026',
            summary: 'Una comisión es unidades de gas por precio del gas por precio de la moneda. Casi toda '
                + 'promesa de "cadena más barata" cita una de las tres. Cómo calcular la que importa.'
        },
        pt: {
            title: 'Quanto o gás realmente custa em 2026',
            summary: 'Uma taxa é unidades de gás vezes preço do gás vezes preço da moeda. Quase toda promessa '
                + 'de "rede mais barata" cita uma das três. Como calcular a que importa, em qualquer rede '
                + 'EVM.'
        },
        hi: {
            title: '2026 में गैस की असली लागत कितनी है',
            summary: 'फ़ीस यानी गैस यूनिट गुणा गैस कीमत गुणा कॉइन की कीमत। "सबसे सस्ती चेन" के ज़्यादातर दावे '
                + 'इनमें से एक ही बताते हैं। जो संख्या मायने रखती है उसे किसी भी EVM नेटवर्क पर कैसे '
                + 'निकालें।'
        },
        zh: {
            title: '2026 年的 gas 到底要多少钱',
            summary: '手续费等于 gas 用量乘以 gas 价格再乘以币价。绝大多数「最便宜的链」只报其中一个。怎样在任意 EVM 网络上算出真正重要的那个数。'
        },
        ru: {
            title: 'Сколько на самом деле стоит газ в 2026 году',
            summary: 'Комиссия — это единицы газа на цену газа на цену монеты. Почти любое заявление о «самой '
                + 'дешёвой сети» называет одно из трёх. Как посчитать то, что важно, в любой EVM-сети.'
        },
        fr: {
            title: 'Combien coûte réellement le gaz en 2026',
            summary: "Des frais, c'est des unités de gaz fois le prix du gaz fois le prix de la monnaie. La "
                + "plupart des promesses de « chaîne la moins chère » n'en citent qu'une sur trois."
        },
        tr: {
            title: "2026'da gaz gerçekte ne kadara mal oluyor",
            summary: 'Ücret, gaz birimi çarpı gaz fiyatı çarpı coin fiyatıdır. "En ucuz zincir" iddialarının '
                + 'çoğu üçünden birini söyler. Önemli olan sayıyı herhangi bir EVM ağında nasıl '
                + 'hesaplarsınız.'
        }
    }
};
