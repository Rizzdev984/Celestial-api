import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  try {
    const manga = await mangaBat()
    return res.status(200).json({ 
      status: true,
      author: "Celestial",
      result: manga
    })
  } catch (e) {
    return res.status(500).json({ error: "Internal Error"})
    console.log(e)
  }
}

async function mangaBat() {
  const t = Math.floor(Math.random() * 1920) + 1;
  const ress = await axios.get(`https://h.mangabat.com/manga-list-all/${t}?type=newest`);
  const $ = cheerio.load(ress.data);

  const mangaList = [];

  $("div.item").each((_, element) => {
    const title = $(element).find("h3 a").text().trim();
    const chapter = $(element).find("a[title*='Chapter']").text().trim();
    const mangaLink = $(element).find("h3 a").attr("href");
    const imageUrl = $(element).find("img").attr("src");

    if (title && chapter && mangaLink && imageUrl) {
      mangaList.push({
        title,
        chapter,
        mangaLink: `${mangaLink}`,
        imageUrl,
      });
    }
  });

  return mangaList;
}
mangaBat()