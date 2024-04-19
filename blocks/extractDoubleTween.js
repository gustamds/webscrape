const { v4: uuidv4 } = require("uuid");
const cheerio = require("cheerio");

async function extractDoubleTween($, html, usedImageUrls) {
  const $html = cheerio.load(html);

  let imgs = $html("div").eq(0).find("img");
  if (imgs.length === 2) {
    return extractDoubleTweenFromImages(imgs, $, usedImageUrls);
  }

  imgs = $html("img");
  if (imgs.length === 2) {
    return extractDoubleTweenFromImages(imgs, $, usedImageUrls);
  }

  const imgDivs = $html("div > div");
  if (imgDivs.length === 2) {
    imgs = imgDivs.find("img");
    if (imgs.length === 2) {
      return extractDoubleTweenFromImages(imgs, $, usedImageUrls);
    }
  }

  return null; // Retorna null se não corresponder a nenhuma das estruturas
}

async function extractDoubleTweenFromImages(imgs, $, usedImageUrls) {
    const imgUrls = [];
  
    imgs.each((index, img) => {
      const imgUrl = $(img).attr("src");
  
      if (!usedImageUrls.has(imgUrl)) {
        imgUrls.push(imgUrl);
      }
    });
  
    if (imgUrls.length === 0) {
      return null; // Retorna null se todas as URLs de imagem já foram usadas
    }
  
    imgUrls.forEach((url) => usedImageUrls.add(url));
  
    return {
      type: "double-tween",
      blockName: "Double Tween",
      title: "Motivi per amarlo",
      icon: "/board.svg",
      preview: "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-board-2.png",
      withContainer: false,
      ratioMobile: "56vw",
      ratioDesktop: "56vw",
      mobileIsSlider: false,
      contents: imgUrls.map((imgUrl) => ({
        id: uuidv4(),
        preHeadingMobile: "preHeadingMobile",
        preHeadingTextColorMobile: "#ffffff",
        preHeadingMobileFontSize: 24,
        headingMobile: "headingMobile",
        headingTextColorMobile: "#ffffff",
        headingMobileFontSize: 24,
        descriptionMobile: "descriptionMobile",
        descriptionTextColorMobile: "#ffffff",
        descriptionMobileFontSize: 24,
        verticalAlignmentMobile: "BOTTOM",
        horizontalAlignmentMobile: "CENTER",
        preHeading: "preHeading",
        preHeadingTextColor: "#ffffff",
        preHeadingFontSize: 24,
        heading: "heading",
        headingTextColor: "#ffffff",
        headingFontSize: 24,
        description: "description",
        descriptionTextColor: "#ffffff",
        descriptionFontSize: 24,
        verticalAlignmentDesktop: "BOTTOM",
        horizontalAlignmentDesktop: "CENTER",
        img: imgUrl,
        imageMobile: imgUrl,
      })),
      id: uuidv4(),
    };
  }

  module.exports = extractDoubleTween;