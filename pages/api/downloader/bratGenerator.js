import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Text Is Undefined" });
  }

  try {
    const buffer = await brat(text);
    res.setHeader('Content-Type', 'image/png');
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function brat(text) {
  try {
    const response = await axios.get(`https://ruloaooa-swgen.hf.space/brat?text=${text}`, {
      responseType: 'arraybuffer'
    });
    return response.data;
  } catch (error) {
    throw new Error('Gagal Mendapatkan Gambar');
  }
}
