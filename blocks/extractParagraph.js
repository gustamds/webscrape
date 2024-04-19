const { v4: uuidv4 } = require("uuid");
const cheerio = require("cheerio");

async function extractParagraph(html) {
    const $ = cheerio.load(html);
  
    // Verifica se há um único <p> com texto direto
    const paragraphs = $("p").filter(function () {
      return $(this).children().length === 0 && $(this).text().trim().length > 0;
    });
  
    if (paragraphs.length === 1) {
      const text = paragraphs.text().trim();
      return {
        type: "paragraph",
        blockName: "Paragrafo",
        html: `<p>${text}</p>`,
        icon: "/paragraph.svg",
        preview:
          "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-paragraph-2.png",
        id: uuidv4(),
        paragraph: false,
      };
    }
  
    // Verifica se há um único <span> sem um <p> em volta
    const spans = $("span").filter(function () {
      return (
        $(this).parent().get(0).tagName.toLowerCase() !== "p" &&
        $(this).text().trim().length > 0
      );
    });
  
    if (spans.length === 1) {
      const text = spans.text().trim();
      return {
        type: "paragraph",
        blockName: "Paragrafo",
        html: `<span>${text}</span>`,
        icon: "/paragraph.svg",
        preview:
          "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-paragraph-2.png",
        id: uuidv4(),
        paragraph: false,
      };
    }
  
    // Se não encontrar nenhum dos casos acima, retorna null
    return null;
  }

  module.exports = extractParagraph;