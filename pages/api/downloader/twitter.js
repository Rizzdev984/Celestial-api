import axios from 'axios';
import cheerio from 'cheerio';
import qs from 'qs';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Url Not Defined" })
  }
  try {
     const twit = await x2twitter.download(url)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: twit
     })
  } catch (e) {
    return res.status(500).json({ error: e.message })
    console.log(e)
  }
}
  
const x2twitter = {
  video: async (urls) => {
    const url = 'https://x2twitter.com/api/ajaxSearch';
    const data = qs.stringify({
      q: urls,
      lang: 'id'
    });
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:128.0) Gecko/128.0 Firefox/128.0',
        'Referer': 'https://x2twitter.com/id'
      }
    };
    try {
      const response = await axios.post(url, data, config);
      const html = response.data.data;
      const $ = cheerio.load(html);
      const thumbnail = $('.thumbnail img').attr('src');
      const title = $('.tw-middle h3').text().trim();
      const duration = $('.tw-middle p').text().trim();
      const downloadLinks = [];
      let v_id = '';
      let token = '';
      let exp = '';

      $('.dl-action a').each((index, element) => {
        const link = $(element).attr('href');
        const label = $(element).text().trim();
        if (label !== 'Konversikan ke MP3') {
          downloadLinks.push({ label, link });
        }
      });

      const mp3LinkElement = $('.dl-action a#convert_mp3_s0HDjV8X4Qhvpg3J');
      if (mp3LinkElement.length) {
        v_id = mp3LinkElement.attr('id').split('_')[2];
      }

      const scriptContent = $('script').html();
      const tokenMatch = scriptContent.match(/k_token\s*=\s*"([^"]+)"/);
      const expMatch = scriptContent.match(/k_exp\s*=\s*"([^"]+)"/);

      if (tokenMatch) {
        token = tokenMatch[1];
      }
      if (expMatch) {
        exp = expMatch[1];
      }

      return {
        thumbnail,
        title,
        duration,
        downloadLinks,
        v_id,
        token,
        exp
      };
    } catch (error) {
      return { success: false, message: error.message };
      console.error('Error:', error);
    }
  },

  convertAudio: async (audioUrl, v_id, token, exp) => {
    const convertUrl = 'https://s1.twcdn.net/api/json/convert';
    const convertData = qs.stringify({
      ftype: 'mp3',
      v_id: v_id,
      audioUrl: audioUrl,
      audioType: 'video/mp4',
      fquality: 128,
      fname: 'X2Twitter.com',
      exp: exp,
      token: token
    });

    const convertConfig = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:128.0) Gecko/128.0 Firefox/128.0',
        'Referer': 'https://x2twitter.com/id'
      }
    };

    try {
      const response = await axios.post(convertUrl, convertData, convertConfig);
      return response.data;
    } catch (error) {
      return { success: false, message: error.message };
      console.error('Error:', error);
    }
  },

  download: async (urls) => {
    try {
      const videoData = await x2twitter.video(urls);
      if (videoData && videoData.v_id) {
        const audioUrl = videoData.downloadLinks.find(link => link.label === 'Unduh MP4 (720p)')?.link; // Ambil URL audio dari tautan unduhan
        const audioData = await x2twitter.convertAudio(audioUrl, videoData.v_id, videoData.token, videoData.exp);
        return {
          videoData,
          audioData
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
      console.error('Error:', error);
    }
  }
};
