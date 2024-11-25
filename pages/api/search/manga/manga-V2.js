import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { manga } = req.query;
  try {
     const kyah = await mangaV2(manga)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: kyah
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}

async function mangaV2(manga) {
  try {
    const ress = await axios.get(`https://mangaplanet.com/search?keyword=${manga}`);
    const $ = cheerio.load(ress.data);

    const mangaList = [];
    
    $('section.row.book-list').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const link = $(element).find('a').attr('href');
      const image = $(element).find('img.lazyload').attr('data-src');
      const jpTitle = $(element).find('.jp_fonts').text().trim();
      const synopsis = $(element).find('p').eq(2).text().trim();
      const author = $(element).find('p').eq(3).text().trim();
      const publisher = $(element).find('p').eq(5).text().trim();
       const ress2 = await axios.get(link) 
       const $$ = cheerio.load(ress.data) 
      mangaList.push({
        title,
        link,
        image: `https://mangaplanet.com${image}`,
        jpTitle,
        synopsis,
        author,
        publisher,
      });
    });

    return mangaList;
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, message: error.message };
  }
}
