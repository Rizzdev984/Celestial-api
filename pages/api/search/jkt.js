import axios from 'axios';
import * as cheerio from 'cheerio';
import { findBestMatch } from 'fuzzysearch';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }
  const { member } = req.query;
  if (!member) {
    return res.status(400).json({ error: "Parameter Member Not Defined" });
  }
  try {
    const jktttt = await jkt(member);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: jktttt
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Error" });
  }
}

async function jkt(query) {
  const ress = await axios.get('https://kprofiles.com/jkt48-trainee-members-profile/');
  const $ = cheerio.load(ress.data);

  const memberData = [];

  $('.entry-content p').each((index, element) => {
    const name = $(element).find('strong').first().text().trim();
    const fullName = $(element).text().split('Full name:')[1]?.split('\n')[0]?.trim();
    const nickname = $(element).text().split('Nickname:')[1]?.split('\n')[0]?.trim();
    const birthDate = $(element).text().split('Birth (age):')[1]?.split('\n')[0]?.trim();
    const height = $(element).text().split('Height:')[1]?.split('\n')[0]?.trim();
    const instagramLink = $(element).find('a').first().attr('href');
    const tiktokLink = $(element).text().includes('TikTok:') ? $(element).text().split('TikTok:')[1].split('\n')[0]?.trim() : null;

    if (name && fullName && nickname && birthDate) {
      const birthDateMatch = birthDate.match(/(.*?), (\w+ \d{1,2}, \d{4}) \((\d{1,2}) years old\)/); 
      const placeOfBirth = birthDateMatch ? birthDateMatch[1] : null;
      const birthDateFormatted = birthDateMatch ? birthDateMatch[2] : null;
      const age = birthDateMatch ? birthDateMatch[3] : null;

      memberData.push({
        nama: name,
        nama_full: fullName,
        nick: nickname,
        tanggal_lahir: birthDateFormatted,
        age: age,
        lahir_di: placeOfBirth,
        tinggi: height,
        link_ig: instagramLink,
        link_tiktok: tiktokLink
      });
    }
  });

  const bestMatch = findBestMatch(query, memberData.map(member => member.nama));
  const bestFullNameMatch = findBestMatch(query, memberData.map(member => member.nama_full));

  let result = bestMatch.bestMatch;
  if (bestFullNameMatch.bestMatch.score > bestMatch.bestMatch.score) {
    result = bestFullNameMatch.bestMatch;
  }

  if (result && result.score >= 0.5) {
    return memberData[memberData.findIndex(member => member.nama === result.target || member.nama_full === result.target)];
  } else {
    throw new Error('No matching member found.');
  }
}