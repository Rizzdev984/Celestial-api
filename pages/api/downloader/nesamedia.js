import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methods Not Allowed" })
  }
  const { url } = req.query;
  try {
     const download = await nesamediadl(url)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: {
         link: download
       }
     })
  } catch (e) {
    console.error(e); // Menampilkan error di konsol server
    return res.status(500).json({ error: e.message })
  }
}

async function nesamediadl(url) {
  try {
    const ress = await axios.get(url + "download");
    const $ = cheerio.load(ress.data);
    const dl1 = $('a.download_line.green').attr('href');
    
    if (!dl1) {
      throw new Error('Download link not found');
    }

    return dl1;
  } catch (error) {
    throw new Error(`Error fetching download link: ${error.message}`);
  }
}
