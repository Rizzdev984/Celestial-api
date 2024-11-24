import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { lirik } = req.query;
  if (!lirik) {
    return res.status(400).json({ error: "Lirik Tidak Di Isi"})
  } 
  try {
    const hasil = await musikbylirik(lirik)
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: hasil 
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}

async function musikbylirik(lrk) {
  const ress = await axios.get(`https://songsear.ch/q/${lrk}`);
  const $ = cheerio.load(ress.data);
  
  const url = $('div.results > div.result > div.head > a').attr('href');
  if (!url) {
    throw new Error('URL lagu tidak ditemukan');
  }
  const fullUrl = `https://songsear.ch${url}`;

  const title = $('div.results > div.result > div.head > h2').eq(0).text().trim();
  const artist = $('div.results > div.result > div.head > h3 > span.by').eq(0).text().trim();
  const album = $('div.results > div.result > div.head > a > img').eq(0).attr('title').trim();
  const author = $('div.results > div.result > div.head > h3 > b').eq(0).text().trim(); // Mengambil nama artis yang benar

  return {
    title,
    artis: "by " + author,
    album,
    url: fullUrl
  };
}
