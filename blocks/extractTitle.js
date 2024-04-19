const { v4: uuidv4 } = require("uuid");
const cheerio = require("cheerio");

async function extractTitle($, html, url, tag, getStylesWithPuppeteer) {
    const $html = cheerio.load(html);
  
    // Verifica se o elemento contém apenas texto direto
    const hasOnlyText =
      $html(tag).children().length === 0 && $html(tag).text().trim().length > 0;
  
    if (!hasOnlyText) {
      return null; // Retorna null se o elemento não contiver apenas texto direto
    }
  
    // Obtém o texto diretamente do elemento
    const text = $html(tag).text().trim();
  
    // Obtém os estilos usando Puppeteer
    const styles = await getStylesWithPuppeteer(url, tag);
    const fontSize = parseInt(styles.fontSize);
  
    return {
      type: "title",
      blockName: "Titolo",
      text,
      textAlignmentDesktop: styles.textAlign,
      textAlignmentMobile: styles.textAlign,
      textAlignmentTablet: styles.textAlign,
      color: styles.color,
      textFontSize: fontSize,
      textFontWeight: styles.fontWeight,
      textFontFamily: {
        fontFamily: styles.fontFamily,
        name: styles.fontFamily,
        src: styles.fontFamily,
      },
      paragraph: false,
      mobileIsSlider: false,
      icon: "/title.svg",
      preview:
        "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-titolo-2.png",
      hideOnMobile: false,
      id: uuidv4(),
    };
  }

module.exports = extractTitle;