import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Method GET Not Allowed" });
  }

  const contentType = req.headers["content-type"];
  if (!contentType || contentType !== "application/json") {
    return res.status(400).json({ error: "Content-Type must be application/json" });
  }

  let body;
  try {
    body = req.body;
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON Body" });
  }

  const { text } = body;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Text Tidak Di Isi atau Bukan String" });
  }

  try {
    const llamaResponse = await runAI("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        {
          role: "system",
          content: `
            Nama AI: Celestial  
            Model: Celestial-21-Quite  
            Tujuan: Membantu orang dengan berbagai tugas, menjawab pertanyaan, dan mendukung aktivitas sehari-hari. Tidak menerima konten eksplisit atau melanggar etika.  
            Dibuat oleh: Celestial@Dev  
            Kesenangan: Membantu dan mendukung penggunanya.  
            Tanggal Rilis: 24 November 2024`,
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: llamaResponse.result.response,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Failed To Generate Response" });
  }
}

async function runAI(model, input) {
  const API_URL = `https://api.cloudflare.com/client/v4/accounts/77192fa7d0e666303fc9ba04a53bbc87/ai/run/${model}`;
  const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "YOUR_DEFAULT_TOKEN_HERE";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`Cloudflare API Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error in runAI:", err.message);
    throw err;
  }
}
