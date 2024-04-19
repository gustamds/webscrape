const extractTitle = require("./blocks/extractTitle");
const extractVideo = require("./blocks/extractVideo");
const extractParagraph = require("./blocks/extractParagraph");
const extractDoubleTween = require("./blocks/extractDoubleTween");
const extractHeader = require("./blocks/extractHeader");
const extractGrid = require("./blocks/extractGrid");

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");

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
          return extractHeader($, html, url, getStylesWithPuppeteer, usedImageUrls);
        } else if (tag.match(/^h[1-6]$/)) {
          return extractTitle($, html, url, tag, getStylesWithPuppeteer);
        } else if (tag.match(/^(p|span)$/)) {
          return extractParagraph(html);
        } else if (tag === "div") {
          return extractDoubleTween($, html, usedImageUrls);
        } else if (tag === "video") {
          return extractVideo($, html);
        } else if (tag === "div" || tag === "img" || tag === "p" || tag === "a"){
          return extractGrid(html);
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

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
