const { v4: uuidv4 } = require("uuid");
const cheerio = require("cheerio");

async function extractGrid(html) {
    // Carregar o HTML usando Cheerio
    const $ = cheerio.load(html);

    // Buscar todas as divs que contenham três parágrafos
    const divsWithProductInfo = $('div').filter((index, element) => {
        return $(element).find('p').length === 3;
    });

    // Verificar se há pelo menos uma div com três parágrafos
    if (divsWithProductInfo.length > 0) {
        // Selecionar a primeira div encontrada
        const div = $(divsWithProductInfo[0]);

        // Buscar os elementos dentro da div
        const img = div.find('img').attr('src');
        const link = div.find('a').attr('href');
        const paragraphs = div.find('p');

        // Verificar se existem os elementos necessários dentro da div
        if (paragraphs.length === 3) {
            return {
                blockName: 'Griglia',
                icon: '/grid.svg',
                type: 'grid',
                threeInARow: false,
                swiperMobile: false,
                backgroundColor: '#FFF',
                preview: img,
                items: [{
                    id: uuidv4(),
                    textBoxHorizontalAlignment: 'RIGHT',
                    title: $(paragraphs[0]).text(),
                    titleColor: '#000000',
                    titleFontSize: 24,
                    titleFontWeight: 400,
                    titleFontFamily: {
                        fontFamily: 'HKGrotesk',
                        name: 'HKGrotesk',
                        src: 'https://cdn.unitedpets.com/fonts/hk-grotesk/HKGrotesk-Regular otf'
                    },
                    description: $(paragraphs[1]).text(),
                    descriptionColor: '#000000',
                    descriptionFontSize: 24,
                    descriptionFontWeight: 400,
                    descriptionFontFamily: {
                        fontFamily: 'HKGrotesk',
                        name: 'HKGrotesk',
                        src: 'https://cdn.unitedpets.com/fonts/hk-grotesk/HKGrotesk-Regular otf'
                    },
                    price: parseFloat($(paragraphs[2]).text().replace('€', '').trim()),
                    priceColor: '#000000',
                    priceFontSize: 24,
                    priceFontWeight: 400,
                    priceFontFamily: {
                        fontFamily: 'HKGrotesk',
                        name: 'HKGrotesk',
                        src: 'https://cdn.unitedpets.com/fonts/hk-grotesk/HKGrotesk-Regular otf'
                    },
                    image: img,
                    product: '',
                    typeLink: link
                }],
                id: uuidv4()
            };
        }
    }
    console.log('nada foi encontrado');
    return null;
}

module.exports = extractGrid;
