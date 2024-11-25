import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { manga } = req.query;
  try {
     const info = await mangaV1(manga)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: info
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}

async function mangaV1(manga) {
  try {
    const ress = await axios.get(`https://anilist.co/search/manga?search=${manga}`);
    const $ = cheerio.load(ress.data);

    const mangaList = [];
    $('div.media-card').each(async, (index, element) => {
      const title = $(element).find('a.title').text().trim();
      const link = 'https://anilist.co' + $(element).find('a.title').attr('href');
      const image = $(element).find('img.image').attr('src');
      if (title && link && image) {
        mangaList.push({ title, link, image });
      }
    });

    return mangaList;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    return { error: error.message };
  }
}

