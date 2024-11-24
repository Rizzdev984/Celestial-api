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
     const iaskk = await pencarianTeks(text)
     return res.status(200).json({
       status: true,
       author: "Celestial",
       result: iaskk.jawaban
     })
  } catch (e) {
    console.error("Now Error In Iask Ai:", e)
    return res.status(500).json({
      error: e.message
    })
  }
}

async function pencarianTeks(kueri) {
  const kode = `
    const { chromium } = require('playwright');
    async function pencarianTeks(kueri) {
      let browser = await chromium.launch();
      let halaman = await browser.newPage();

      try {
        await halaman.goto(\`https://iask.ai/?mode=question&q=\${kueri}\`);
        await halaman.waitForSelector('#output', { timeout: 30000 });

        let divHasil = await halaman.$('#output');
        if (!divHasil) {
          return JSON.stringify({ gambar: [], jawaban: null, sumber: [], video: [], pencarianWeb: [] });
        }

        let elemenJawaban = await divHasil.$('#text');
        let teksJawaban = elemenJawaban ? await elemenJawaban.evaluate(el => el.innerText) : null;

        let [jawaban, teksSumber] = teksJawaban
          ? teksJawaban.split('Top 3 Authoritative Sources Used in Answering this Question')
          : [null, null];

        let sumber = teksSumber ? teksSumber.split('\\n').filter(s => s.trim() !== '') : [];
        let gambar = [];
        let video = [];
        let pencarianWeb = [];

        return JSON.stringify({ gambar, jawaban, sumber, video, pencarianWeb }, null, 2);

      } catch (error) {
        return JSON.stringify({ error: error.message });
      } finally {
        await browser.close();
      }
    }

    pencarianTeks(\`${kueri}\`);
  `;

  const mulai = await run("javascript", kode);
  console.log("Output dari Playwright:", mulai.result.output);

  try {
    const hasil = JSON.parse(mulai.result.output);
    return hasil;
  } catch (e) {
    console.error("Gagal memparsing JSON:", e.message);
    throw new Error("Hasil dari Playwright bukan JSON valid");
  }
}
