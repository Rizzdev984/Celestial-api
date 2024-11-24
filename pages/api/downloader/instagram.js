import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Url Not Defined" })
  }
  try {
    const idDownload = await indown(url)
    return res.status(200).json({
      status: true,
      author: "Celestial",
      message: "Thanks For Shannz",
      result: idDownload
    })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}

const types = [ 'photo', 'video' ];

async function indown(urls, type) {
    const url = 'https://indownloader.app/request';
    const data = new URLSearchParams();
    data.append('link', urls);
    data.append('downloader', type);

    const headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'PHPSESSID=c1qc786t4r439k0ogf4pb50fgm; _ga_W9Q84JYKKD=GS1.1.1731120140.1.0.1731120140.0.0.0; _ga=GA1.1.979138462.1731120140; __gads=ID=89f41a0cc4734339:T=1731120140:RT=1731120140:S=ALNI_MY2FNGnAVDIkwE35v-IsEMzweOqRQ; __gpi=UID=00000f643ea193e0:T=1731120140:RT=1731120140:S=ALNI_MZrYvEtDAXMOExu4wavywGulS6Vww; __eoi=ID=439a66e4e79cc71a:T=1731120140:RT=1731120140:S=AA-AfjYcG5P7RNtPZLXiHOfQX-lR; FCNEC=%5B%5B%22AKsRol_dAqS6oEYU_-IReCxUk3gKXwJ2xCeHvSlTukmIMcqkQCHNZwEAOtXKQei1epvT9elPBlfUzZXCt90jGPgL2VxRUyCckXJr2GxBFqKEoWr8-2L-T54bWkO_QF6v_biozNwmo9Ka_19Sya7XHyjX40pA30kNuw%3D%3D%22%5D%5D',
        'Origin': 'https://indownloader.app',
        'Referer': 'https://indownloader.app/',
        'User-Agent': 'MyApp/1.0',
        'X-Requested-With': 'XMLHttpRequest'
    };

    try {
        const response = await axios.post(url, data.toString(), { headers });
        const html = response.data.html;
        const $ = cheerio.load(html);
        const thumbnailUrl = $('.post-thumb img').attr('src');
        const videoUrl = $('.download-options a').attr('href');

        return {
          thumbnail: thumbnailUrl,
          video: videoUrl
        }
    } catch (error) {
      return { success: false, message: error.message };
      console.error("Error:", error.response ? error.response.data : error.message);      
    }
}
