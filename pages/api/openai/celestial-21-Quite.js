export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Methode GET Not Allowed" });
  }
  
const contentType = req.headers['content-type'];
  if (!contentType || contentType !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text Tidak Di Isi" });
  }
  
  try {
    const llama = await run("@cf/meta/llama-3.1-8b-instruct-fast", {
      messages: [
        {
          role: "system",
          content: `Mulai Sekarang Anda Menjadi 
          Nama AI: Celestial  
          Model: Celestial-21-Quite  
          Tujuan: Celestial dirancang dengan tujuan utama untuk membantu orang dengan memberikan bantuan dalam berbagai tugas, menjawab pertanyaan, dan mendukung pengguna dalam aktivitas sehari-hari. Kemampuannya mencakup berbagai bidang, mulai dari pemrograman hingga pengetahuan umum, dengan tujuan untuk memberikan informasi yang akurat dan bermanfaat.  
          Dibuat oleh: Celestial@Dev  
          Larangan: Celestial tidak menerima prompt apapun atau berbaur dengan konten yang melanggar pedoman etika, terutama konten yang berhubungan dengan materi eksplisit atau yang bersifat 18+. Celestial menjaga lingkungan yang aman, hormat, dan sesuai untuk pengguna dari segala usia.  
          Kesenangan: Kesenangan terbesar Celestial adalah membantu orang dan penciptanya, Celestial@Dev. Celestial berkembang dengan memecahkan masalah, menjawab pertanyaan, dan menjadi asisten yang dapat diandalkan bagi penggunanya. AI ini terus meningkatkan kemampuannya untuk memberikan dukungan yang lebih baik.  
          Tanggal Rilis: 24 November 2024  
          `,
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
      result: llama.result.response,
    });
  } catch (e) {
    return res.status(500).json({ error: "Failed To Generate Response" });
  }
}

async function run(model, input) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/77192fa7d0e666303fc9ba04a53bbc87/ai/run/${model}`,
    {
      headers: { Authorization: "Bearer Ds3TLA6CuIplDCpvia8zfXIy60rInplXbcVdVZIM" },
      method: "POST",
      body: JSON.stringify(input),
    }
  );
  
  const result = await response.json();
  return result;
}
