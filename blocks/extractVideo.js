const { v4: uuidv4 } = require("uuid");

async function extractVideo($, html) {
    const videosSrc = $("video source", html).attr("src");
  
    if (videosSrc) {
      return {
        blockName: "Video",
        icon: "/video.svg",
        preview:"https://d32gktdq0wbhql.cloudfront.net/img/img-blocco-video-2.png",
        type: "video",
        url: videosSrc,
        id: uuidv4(),
      };
    } else {
      return null;
    }
  }

  
  module.exports = extractVideo;