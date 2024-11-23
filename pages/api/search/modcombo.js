import axios from 'axios';
import * as cheerio from 'cheerio';
import q from "../../../app/declaration/config.js"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { apk } = req.query;
  if (!apk) {
    return res.status(400).json({ error: q.msg.qApk })
  }
  try {
     const apksearch = await modCombo(apk)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: apksearch
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}

async function modCombo(apk) {
  try {
    const ress = await axios.get(`https://modcombo.com/id/?s=${apk}`);
    const $ = cheerio.load(ress.data);

    const results = [];

    $('ul.blogs.w3 > li').each((index, element) => {
      const link = $(element).find('a.blog.search').attr('href');
      const title = $(element).find('div.title').text().trim();
      const image = $(element).find('img.thumb').attr('data-src') || $(element).find('img.thumb').attr('src');
      const time = $(element).find('time').attr('datetime');

      if (link && title && image && time) {
        const date = new Date(time);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        results.push({ title, link, image, date: formattedDate });
      }
    });

    return results;
  } catch (error) {
    console.error('Error In Modcombo Is Error Message:', error.message);
    return [`error: ${error.message}`];
  }
}
