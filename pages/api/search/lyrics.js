import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  const { music } = req.query;
  if (!music) {
    return res.status(400).json({ error: "Parameter music tidak diisi" });
  }

  try {
    const liriq = await lirik(music);
    if (!liriq || liriq.error) {
      return res.status(200).json({
        status: false,
        author: "Celestial",
        result: liriq?.error || "Lirik tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: liriq,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message || "Internal Server Error" });
  }
}

function similarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const length = Math.min(s1.length, s2.length);
  let match = 0;
  for (let i = 0; i < length; i++) {
    if (s1[i] === s2[i]) match++;
  }
  return match / Math.max(s1.length, s2.length);
}

async function lirik(lagu) {
  try {
    const query = lagu.replace(/\s+/g, "%20");
    const response = await axios.get(`https://www.lyrics.com/lyrics/${query}`);
    const $ = cheerio.load(response.data);

    const results = [];
    $("div.sec-lyric").each((_, element) => {
      const title = $(element).find(".lyric-meta-title a").text().trim();
      const artist = $(element).find(".lyric-meta-album-artist a").text().trim();
      const lyricLink = $(element).find(".lyric-meta-title a").attr("href");

      if (title && artist && lyricLink) {
        results.push({
          title,
          artist,
          lyricLink: `https://www.lyrics.com${lyricLink}`,
        });
      }
    });

    if (results.length === 0) {
      return { error: "Lirik tidak ditemukan." };
    }

    const bestMatch = results.reduce((prev, current) => {
      const prevSimilarity = similarity(prev.title, lagu);
      const currentSimilarity = similarity(current.title, lagu);
      return currentSimilarity > prevSimilarity ? current : prev;
    });

    const lyricPage = await axios.get(bestMatch.lyricLink);
    const $$ = cheerio.load(lyricPage.data);
    const lyric = $$("pre.lyric-body").text().trim();

    return {
      title: bestMatch.title,
      artist: bestMatch.artist,
      lyric,
    };
  } catch (error) {
    return { error: error.message };
  }
}
