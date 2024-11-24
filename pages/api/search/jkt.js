import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  const { member } = req.query;
  if (!member) {
    return res.status(400).json({ error: "Parameter member tidak diisi" });
  }

  try {
    const result = await jkt(member);
    if (!result || result.error) {
      return res.status(200).json({
        status: false,
        author: "Celestial",
        result: result?.error || "Anggota tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: result,
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

async function jkt(query) {
  try {
    const response = await axios.get('https://kprofiles.com/jkt48-members-profile/');
    const $ = cheerio.load(response.data);

    const members = [];
    $('.entry-content p').each((_, element) => {
      const name = $(element).find('strong').first().text().trim();
      const fullName = $(element).text().split('Full name:')[1]?.split('\n')[0]?.trim();
      const nickname = $(element).text().split('Nickname:')[1]?.split('\n')[0]?.trim();
      const birthDate = $(element).text().split('Birth (age):')[1]?.split('\n')[0]?.trim();
      const height = $(element).text().split('Height:')[1]?.split('\n')[0]?.trim();
      const instagramLink = $(element).find('a').first().attr('href');
      const tiktokLink = $(element).text().includes('TikTok:') ? $(element).text().split('TikTok:')[1]?.trim() : null;

      if (name && fullName && nickname && birthDate) {
        const birthDateMatch = birthDate.match(/(.*?), (\w+ \d{1,2}, \d{4}) \((\d{1,2}) years old\)/);
        const placeOfBirth = birthDateMatch ? birthDateMatch[1] : null;
        const birthDateFormatted = birthDateMatch ? birthDateMatch[2] : null;
        const age = birthDateMatch ? birthDateMatch[3] : null;

        members.push({
          nama: name,
          nama_full: fullName,
          nick: nickname,
          tanggal_lahir: birthDateFormatted,
          age,
          lahir_di: placeOfBirth,
          tinggi: height,
          link_ig: instagramLink,
          link_tiktok: tiktokLink,
        });
      }
    });

    if (members.length === 0) {
      return { error: "Tidak ada data anggota ditemukan." };
    }

    const bestMatch = members.reduce((prev, current) => {
      const prevSimilarity = similarity(prev.nama, query) || similarity(prev.nama_full, query);
      const currentSimilarity = similarity(current.nama, query) || similarity(current.nama_full, query);
      return currentSimilarity > prevSimilarity ? current : prev;
    });

    if (!bestMatch || similarity(bestMatch.nama, query) < 0.5 && similarity(bestMatch.nama_full, query) < 0.5) {
      throw new Error("Anggota tidak ditemukan");
    }

    return bestMatch;
  } catch (error) {
    return { error: error.message };
  }
}
