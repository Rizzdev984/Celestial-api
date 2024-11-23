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
    return res.status(500).json({
      status: false,
      error: e.message,
    });
  }
}

async function brat(text) {
  const code = `
    import { chromium } from 'playwright';

    async function brat(text) {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
          viewport: { width: 375, height: 812 },
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
      });
      const page = await context.newPage();
      
      await page.goto("https://www.bratgenerator.com/");
      await page.evaluate(() => {
        setupTheme('white');
      });
      await page.fill("#textinput", text);
      await page.click("#onetrust-accept-btn-handler");
      await page.waitForTimeout(500);

      const filePath = \`/brat_\${Date.now()}.png\`;
      await page.screenshot({ path: \`.\${filePath}\` });
      await browser.close();
      return filePath;
    }

    brat(\`${text}\`);
  `;
  const start = await run("javascript", code);
  const result = start.result.files[0].publicURL;
  return `https://try.playwright.tech${result}`;
}
