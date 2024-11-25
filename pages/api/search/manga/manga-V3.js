 import axios from 'axios';
 import * as cheerio from 'cheerio';
 
 export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { manga } = req.query;
  try {
     const ah = await mangaV3(manga)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: ah
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}
 
 async function mangaV3(manga) {
  try {
    const response = await axios.get(`https://myanimelist.net/manga.php?q=${encodeURIComponent(manga)}&cat=manga`);
    const $ = cheerio.load(response.data);

    const mangaList = [];
    $('tr').each((index, element) => {
      const title = $(element).find('a.hoverinfo_trigger strong').text().trim();
      const link = $(element).find('a.hoverinfo_trigger').attr('href');
      const image = $(element).find('img.lazyload').attr('data-src');
      const description = $(element).find('div.pt4').text().trim();
      const score = $(element).find('td:nth-child(5)').text().trim();

      if (title) {
        mangaList.push({
          title,
          link,
          image,
          description,
          score
        });
      }
    });

    return mangaList;
  } catch (error) {
    console.error(`Error fetching manga data: ${error}`);
    return null;
  }
}
