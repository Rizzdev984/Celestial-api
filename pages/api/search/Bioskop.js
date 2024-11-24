import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { film } = req.query;
  try {
     const filmm = await bioskop(film)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: filmm
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}

async function bioskop(search) { 
      const response = await axios.get(`https://nontonfilmgratis.club/?s=${search}`);
      const $ = cheerio.load(response.data);
      let results = [];

      $('article.item').each((i, element) => {
        const title = $(element).find('.entry-title a').text().trim();
        const link = $(element).find('.entry-title a').attr('href');
        const image = $(element).find('.content-thumbnail img').attr('src');
        const rating = $(element).find('.gmr-rating-item').text().trim();
        const duration = $(element).find('.gmr-duration-item').text().trim();
        const quality = $(element).find('.gmr-quality-item a').text().trim();
        const categories = [];
        
        $(element).find('.gmr-movie-on a[rel="category tag"]').each((j, cat) => {
          categories.push($(cat).text().trim());
        });

        const country = $(element).find('.gmr-movie-on span[itemprop="contentLocation"] a').text().trim();
        const director = $(element).find('.screen-reader-text [itemprop="director"] [itemprop="name"]').text().trim();
        const trailer = $(element).find('.gmr-popup-button a').attr('href');

        results.push({ title, link, image, rating, duration, quality, categories, country, director, trailer });
      });
       return results
     }
