import { run } from "shannz-playwright";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methods Not Allowed" });
  }

  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Parameter Text Tidak Di Isi" });
  }

  try {
    const linkBrat = await brat(text);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: linkBrat,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: false,
      error: e.message,
    });
  }
}

async function brat(inputText) {
  const code = `
    import { chromium } from 'playwright';

    async function generateBrat(text) {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
      });
      const page = await context.newPage();

      await page.goto("https://www.bratgenerator.com/");
      await page.evaluate(() => {
        setupTheme('white'); // Pastikan fungsi ini ada di situs target
      });
      await page.fill("#textinput", text);
      await page.click("#onetrust-accept-btn-handler");
      await page.waitForTimeout(1000);

      const filePath = \`/tmp/brat_\${Date.now()}.png\`;
      await page.screenshot({ path: filePath });
      await browser.close();
      return filePath;
    }

    generateBrat(\`${inputText}\`);
  `;

  const start = await run("javascript", code);

  // Ambil output file path dari hasil screenshot
  if (start.result && start.result.files) {
   return `https://try.playwright.tech${start.result.files}`
  } else {
    throw new Error("Gagal mengambil hasil brat generator");
  }
}
