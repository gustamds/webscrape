const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

app.use(express.json());

async function getStylesWithPuppeteer(url, selector) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { timeout: 600000 });

  const styles = await page.evaluate((selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const styles = window.getComputedStyle(element);
    return {
      color: styles.getPropertyValue("color"),
      fontSize: styles.getPropertyValue("font-size"),
      fontFamily: styles.getPropertyValue("font-family"),
      fontWeight: styles.getPropertyValue("font-weight"),
      textAlign: styles.getPropertyValue("text-align"),
    };
  }, selector);

  await browser.close();

  return styles;
}

async function loadHTML(url) {
  const response = await axios.get(url);
  return cheerio.load(response.data);
}

app.post("/scrape", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res
      .status(400)
      .send('O campo "url" é obrigatório no corpo da requisição.');
  }

  try {
    const $ = await loadHTML(url);
    const elements = [];

    $("main")
      .find("*")
      .each((index, element) => {
        const tag = element.tagName.toLowerCase();
        const html = $.html(element);
        elements.push({ tag, html });
      });

    const processedElements = await Promise.all(
      elements.map(async (element, index) => {
        const { tag, html } = element;

        if (tag === "img") {
          return extractHeader($, html, url);
        } else if (tag.match(/^h[1-6]$/)) {
          return extractTitle($, html, url, tag);
        } else if (tag.match(/^(p|span)$/)) {
          return extractParagraph(html);
        } else if (tag === "div") {
          return extractDoubleTween($, html);
        }
      })
    );

    res.json(processedElements.filter(Boolean));
  } catch (error) {
    console.error("Erro ao recuperar a página:", error);
    res.status(500).send("Erro ao recuperar a página");
  }
});

// Conjunto para armazenar as URLs das imagens já usadas
const usedImageUrls = new Set();

async function extractTitle($, html, url, tag) {
  const $html = cheerio.load(html);

  // Verifica se o elemento contém apenas texto direto
  const hasOnlyText = $html(tag).children().length === 0 && $html(tag).text().trim().length > 0;

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
    preview: "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-titolo-2.png",
    hideOnMobile: false,
    id: uuidv4(),
  };
}



async function extractParagraph(html) {
  const $ = cheerio.load(html);
  
  // Verifica se há um único <p> com texto direto
  const paragraphs = $("p").filter(function() {
    return $(this).children().length === 0 && $(this).text().trim().length > 0;
  });

  if (paragraphs.length === 1) {
    const text = paragraphs.text().trim();
    return {
      type: "paragraph",
      blockName: "Paragrafo",
      html: `<p>${text}</p>`,
      icon: "/paragraph.svg",
      preview: "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-paragraph-2.png",
      id: uuidv4(),
      paragraph: false,
    };
  }

  // Verifica se há um único <span> sem um <p> em volta
  const spans = $("span").filter(function() {
    return $(this).parent().get(0).tagName.toLowerCase() !== 'p' && $(this).text().trim().length > 0;
  });

  if (spans.length === 1) {
    const text = spans.text().trim();
    return {
      type: "paragraph",
      blockName: "Paragrafo",
      html: `<span>${text}</span>`,
      icon: "/paragraph.svg",
      preview: "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-paragraph-2.png",
      id: uuidv4(),
      paragraph: false,
    };
  }

  // Se não encontrar nenhum dos casos acima, retorna null
  return null;
}


async function extractHeader($, html, url) {
  const src = $(html).attr("src");

   // Verifica se a URL da imagem já foi usada no doubleTween
   if (usedImageUrls.has(src)) {
    return null; // Retorna null se a imagem já foi usada
  }

  const styles = await getStylesWithPuppeteer(url, "img");

  return {
    ratioMobile: "56vw",
    verticalAlignmentMobile: "MIDDLE",
    horizontalAlignmentMobile: "LEFT",
    titleMobile: "#000000",
    titleColorMobile: "#ffffff",
    titleMobileFontSize: 24,
    descriptionMobile: "#000000",
    descriptionColorMobile: "#ffffff",
    descriptionMobileFontSize: 24,
    isVideoMobile: false,
    isVideo: false,
    videoURL:
      "https://www.parco1923.com/wp-content/uploads/2022/03/homepage-video-spring.mp4",
    videoURLMobile:
      "https://www.parco1923.com/wp-content/uploads/2022/03/homepage-video-spring.mp4",
    imageURLMobile: src,
    showButton: true,
    ctaAsButton: true,
    buttonText: "#000000",
    textColorCTA: "#000000",
    fontSizeCTA: 24,
    buttonBackgroundColor: "#ffffff",
    ratio: "56vw",
    verticalAlignmentDesktop: "MIDDLE",
    horizontalAlignmentDesktop: "LEFT",
    title: "#000000",
    titleColor: "#ffffff",
    titleFontSize: 24,
    isH1: false,
    description: "#000000",
    descriptionColor: "#ffffff",
    descriptionFontSize: 24,
    imageURL: src,
    brand: null,
    blockName: "Poster",
    icon: "/image.svg",
    preview:"https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-plain-image-2.png",
    type:"header",
    "background-color":"#f5f5f5",
    imagePositionY:"99%",
    imagePositionX:"80%",
    imageSizeHeigh:"300px",
    imageSizeWidth:"auto",
    imagePositionXMobile:"right",
    imagePositionYMobile:"100%",
    imageSizeWidthMobile:"auto",
    imageSizeHeightMobile:"180px",
    backgroundCover:true,
    ratioTablet:"56vw",
    verticalAlignmentTablet:"MIDDLE",
    horizontalAlignmentTablet:"LEFT",
    titleTablet:"#000000",
    descriptionTablet:"#000000",
    imageURLTablet: src,
    secondButtonText:"#000000",
    id: uuidv4(),
  };
}

async function extractDoubleTween($, html) {
  const $html = cheerio.load(html);

  let imgs = $html("div").eq(0).find("img");
  if (imgs.length === 2) {
    return extractDoubleTweenFromImages(imgs, $);
  }

  imgs = $html("img");
  if (imgs.length === 2) {
    return extractDoubleTweenFromImages(imgs, $);
  }

  const imgDivs = $html("div > div");
  if (imgDivs.length === 2) {
    imgs = imgDivs.find("img");
    if (imgs.length === 2) {
      return extractDoubleTweenFromImages(imgs, $);
    }
  }

  return null; // Retorna null se não corresponder a nenhuma das estruturas
}

async function extractDoubleTweenFromImages(imgs, $) {
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
