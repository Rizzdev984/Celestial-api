import { run } from 'shannz-playwright'

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Parameter Text Tidak Di isi"})
  }
  try {
     const iaskk = await iask(text)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: iaskk
     })
  } catch (e) {
    console.error("Now Error In Iask Ai:", e)
    return res.status(500).json({
      error: e.message
    })
  }
}

async function pencarianTeks(kueri) {
  let kode = `const { chromium } = require('playwright');

  async function pencarianTeks(kueri) {
    let browser = await chromium.launch();
    let halaman = await browser.newPage();

    try {
      await halaman.goto(\`https://iask.ai/?mode=question&q=\${kueri}\`);
      await halaman.waitForSelector('.mt-6.md\\\\:mt-4.w-full.p-px.relative.self-center.flex.flex-col.items-center.results-followup', { timeout: 0 });

      let divHasil = await halaman.$('#output');
      if (!divHasil) {
        return { gambar: [], jawaban: null, sumber: [], video: [], pencarianWeb: [] };
      }

      let elemenJawaban = await divHasil.$('#text');
      let teksJawaban = await elemenJawaban.evaluate(el => el.innerText);
      
      // Pisahkan jawaban dan sumber
      let [jawaban, teksSumber] = teksJawaban.split('Top 3 Authoritative Sources Used in Answering this Question');
      
      // Bersihkan dan rapikan jawaban
      let jawabanBersih = jawaban
        .replace(/According to Ask AI & Question AI www\\.iAsk\\.ai:\\s*/g, '') // Hilangkan info pembuka
        .replace(/\s+/g, ' ') // Hilangkan spasi berlebih
        .replace(/^\n+|\n+$/g, '') // Hilangkan baris kosong di awal/akhir
        .trim(); // Hilangkan spasi di awal/akhir
      
      let sumber = teksSumber ? teksSumber.split('\\n').filter(s => s.trim() !== '') : [];

      let elemenGambar = await divHasil.$$('img');
      let gambar = await Promise.all(elemenGambar.map(async (img) => {
        return await img.evaluate(img => img.src);
      }));

      let divVideo = await halaman.$('#related-videos');
      let video = [];
      if (divVideo) {
        let elemenVideo = await divVideo.$$('a');
        for (let elemen of elemenVideo) {
          let tautanVideo = await elemen.evaluate(el => el.href);
          let judulVideo = await elemen.$eval('h3', el => el.innerText).catch(() => 'Judul kaga ada');
          let thumbnailVideo = await elemen.$eval('img', el => el.src).catch(() => 'Thumbnail kaga ketemu');

          if (judulVideo !== 'Judul kaga ada' && thumbnailVideo !== 'Thumbnail kaga ketemu') {
            video.push({ judul: judulVideo, tautan: tautanVideo, thumbnail: thumbnailVideo });
          }
        }
      }

      let divPencarianWeb = await halaman.$('#related-links');
      let hasilPencarianWeb = [];
      if (divPencarianWeb) {
        let elemenTautan = await divPencarianWeb.$$('a');
        for (let elemen of elemenTautan) {
          let tautan = await elemen.evaluate(el => el.href);
          let judulTautan = await elemen.evaluate(el => el.innerText);
          let gambarTautan = await elemen.$eval('img', el => el.src).catch(() => 'Gambar kaga ketemu');
          let deskripsiTautan = await elemen.evaluate(el => el.nextElementSibling.innerText).catch(() => 'Deskripsi kaga ada');

          if (judulTautan && tautan) {
            hasilPencarianWeb.push({
              judul: judulTautan,
              tautan: tautan,
              gambar: gambarTautan,
              deskripsi: deskripsiTautan,
            });
          }
        }
      }

      let sumberBersih = sumber.map(s => s.trim());
      let hasil = { gambar, jawaban: jawabanBersih, sumber: sumberBersih, video, pencarianWeb: hasilPencarianWeb };
      return JSON.stringify(hasil, null, 2);

    } catch (error) {
      console.error('Yah error bro:', error);
      return { gambar: [], jawaban: null, sumber: [], video: [], pencarianWeb: [] };
    } finally {
      await browser.close();
    }
  }

  pencarianTeks(\`${kueri}\`)`;

  let mulai = await run('javascript', kode);
  let hasilString = mulai.result.output;
  return JSON.parse(hasilString);
}
