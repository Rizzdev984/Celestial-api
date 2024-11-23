import axios from "axios";
import * as cheerio from 'cheerio';
import q from "../../../app/declaration/config.js"

export default async function handler(req, res) {
  
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method GET Di Perlukan"})
  }
  const { apk } = req.query;
  if (!apk) {
    return res.status(400).json({ error: "Nama Apk Tidak Di Sebutkan"})
  }
  try {
     const mewing = await apkSearch(apk)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: mewing
     })
  } catch (e) {
    return res.status(500).json({
      error: e.message
    })
  }
}

async function apkSearch(apk) {
  try {
    const ress = await axios.get(`https://www.nesabamedia.com/apps/id/?s=${apk}`);
    const $ = cheerio.load(ress.data);
    const apps = [];

    $('div.item').each((index, element) => {
      const title = $(element).find('div.name a span').text().trim();
      const link = $(element).find('div.name a').attr('href');
      const developer = $(element).find('div.developer a').text().trim();
      const developerLink = $(element).find('div.developer a').attr('href');
      const image = $(element).find('div.img img').data('src');

      if (title && link) {
        apps.push({ 
          title, 
          link, 
          developer, 
          developerLink, 
          image 
        });
      }
    });

    return apps
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return [`error: ${error.message}`];
  }
}
