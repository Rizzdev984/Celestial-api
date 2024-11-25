import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" })
  }
  const { url } = req.query;
  try {
     const filmm = await detailAll(url)
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

async function detailAll(url) {
  try {
    // Cek apakah URL mengarah ke MyAnimeList
    if (url.includes("https://myanimelist.net")) {
      const ress = await axios.get(url);
      const $ = cheerio.load(ress.data);

      const title = $("h1.h1.edit-info .h1-title span[itemprop='name']").text().trim() || 'Tidak ditemukan';
      const englishTitle = $("h1.h1.edit-info .h1-title .title-english").text().trim() || 'Tidak ditemukan';
      const imageUrl = $(".leftside img").attr("data-src") || '';
      const type = $("div.spaceit_pad span.dark_text:contains('Type:')").next().text().trim() || 'Tidak ditemukan';
      const status = $("div.spaceit_pad span.dark_text:contains('Status:')").next().text().trim() || 'Tidak ditemukan';
      const genres = $("div.spaceit_pad span[itemprop='genre']").map((i, el) => $(el).text().trim()).get().join(", ") || 'Tidak ditemukan';
      const authors = $("div.spaceit_pad span.dark_text:contains('Authors:')").next().text().trim() || 'Tidak ditemukan';
      const score = $("span.score-label").text().trim() || 'Tidak ditemukan';
      const ranked = $("div.spaceit_pad.po-r.js-statistics-info span.dark_text:contains('Ranked:')").next().text().trim() || 'Tidak ditemukan';
      const popularity = $("div.spaceit_pad span.dark_text:contains('Popularity:')").next().text().trim() || 'Tidak ditemukan';
      const members = $("div.spaceit_pad span.dark_text:contains('Members:')").next().text().trim() || 'Tidak ditemukan';
      const favorites = $("div.spaceit_pad span.dark_text:contains('Favorites:')").next().text().trim() || 'Tidak ditemukan';
      const officialSite = $("div.external_links a").attr("href") || 'Tidak ditemukan';

      return {
        title,
        englishTitle,
        imageUrl,
        type,
        status,
        genres,
        authors,
        score,
        ranked,
        popularity,
        members,
        favorites,
        officialSite
      };
    }

    // Cek apakah URL mengarah ke Anilist
    else if (url.includes('https://anilist.co')) {
      return `URL ini menggunakan Cloudflare. Harap coba menggunakan API Anilist untuk akses data.`;
    }

    // Cek apakah URL mengarah ke MangaPlanet
    else if (url.includes('https://mangaplanet.com')) {
      const ress = await axios.get(url);
      const $ = cheerio.load(ress.data);

      const title = $("#manga_title").text().trim() || 'Tidak ditemukan';
      const imageUrl = $(".card-body .col-12.col-md-5 img").attr("data-src") || '';
      const description = $("div.card-body .col-12.col-md-7 p").first().text().trim() || 'Tidak ditemukan';
      const author = $("div.card-body .col-12.col-md-7 h3 a").first().text().trim() || 'Tidak ditemukan';
      const publisher = $("div.card-body .col-12.col-md-7 h3 a").last().text().trim() || 'Tidak ditemukan';
      const categories = $(".tags-btn button").map((i, el) => $(el).text().trim()).get().join(", ") || 'Tidak ditemukan';
      const status = $("div.card-body .badge-light").first().text().trim() || 'Tidak ditemukan';

      return {
        title,
        imageUrl,
        description,
        author,
        publisher,
        categories,
        status
      };
    }

    // URL tidak dikenali
    else {
      throw new Error('URL tidak dikenali');
    }
  } catch (error) {
    console.error(`Terjadi kesalahan: ${error.message}`);
    return { error: error.message };
  }
}
