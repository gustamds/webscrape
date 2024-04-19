const { v4: uuidv4 } = require("uuid");

async function extractHeader($, html, url, getStylesWithPuppeteer, usedImageUrls) {
    const src = $("img", html).attr("src");

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
      preview:
        "https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-plain-image-2.png",
      type: "header",
      "background-color": "#f5f5f5",
      imagePositionY: "99%",
      imagePositionX: "80%",
      imageSizeHeigh: "300px",
      imageSizeWidth: "auto",
      imagePositionXMobile: "right",
      imagePositionYMobile: "100%",
      imageSizeWidthMobile: "auto",
      imageSizeHeightMobile: "180px",
      backgroundCover: true,
      ratioTablet: "56vw",
      verticalAlignmentTablet: "MIDDLE",
      horizontalAlignmentTablet: "LEFT",
      titleTablet: "#000000",
      descriptionTablet: "#000000",
      imageURLTablet: src,
      secondButtonText: "#000000",
      id: uuidv4(),
    };
  }

  module.exports = extractHeader;