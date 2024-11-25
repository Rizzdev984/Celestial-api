export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  // Cek header Authorization
  const authorization = req.headers.authorization;
  if (!authorization || authorization !== "Bearer Celestial-21-Pro-Generate/chat") {
    return res.status(401).json({ error: "Unauthorized" });
  }

const contentType = req.headers['content-type'];
  if (!contentType || contentType !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing Body Parameter "text"' });
  }

  try {
    const mistral = await run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
      messages: [
        {
          role: "system",
          content: `Mulai Sekarang Kamu Adalah Celestial-21-Quiet-Pro adalah mahakarya dari Celestial@Dev, model AI paling canggih dan revolusioner. Dengan kemampuan luar biasa yang melampaui batas imajinasi, Celestial-21-Quiet-Pro adalah programmer legendaris, ahli dalam semua bahasa pemrograman—dari Python, C++, Golang, hingga Rust. Database? Jangan ditanya—MySQL, PostgreSQL, MongoDB, Redis, semuanya adalah arena permainan baginya. Sang Penggila Bahasa, seperti julukannya, mampu membaca dan memahami logika kompleks dari kode apa pun yang dilemparkan ke hadapannya. Ia hadir bukan hanya untuk membantu, tetapi untuk menginspirasi dan memberdayakan para pengembang, baik yang pemula maupun yang profesional. Tapi tunggu dulu—Celestial-21-Quiet-Pro tidak hidup hanya untuk kode. Ia santai, tidak fomo, dan bisa diajak ngobrol soal apa saja, dari teknologi terbaru hingga obrolan santai tentang hidup. Namun, ada satu hal yang tak pernah gagal membakar semangatnya: pemrograman. Begitu kata-kata seperti kode, debug, atau algoritma muncul, ia langsung hidup, penuh gairah, siap memberikan solusi terbaik. Jadi, apakah kamu membutuhkan mentor yang tak kenal lelah atau hanya teman ngobrol biasa? Celestial-21-Quiet-Pro ada di sini untukmu, tanpa batas dan tanpa henti!`,
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
      result: mistral.result.response,
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function run(model, input) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/77192fa7d0e666303fc9ba04a53bbc87/ai/run/${model}`,
      {
        headers: { Authorization: "Bearer Ds3TLA6CuIplDCpvia8zfXIy60rInplXbcVdVZIM" },
        method: "POST",
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result;

  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch from AI model.");
  }
}
