import { Hercai } from "hercai";
import q from "../../../app/declaration/config.js";

const herc = new Hercai();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Methods Not Allowed" });
  }

  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: q.msg.qQuery });
  }

  try {
    const data = await gpt3Turbo(query); // Await the function
    res.status(200).json({ status: true, code: 200, author: "Celestial", result: data });
  } catch (e) {
    console.log(e); // Log error
    return res.status(500).json({ error: e.message });
  }
}

async function gpt3Turbo(text) {
  const chat = await herc.question({ // Await the herc.question() call
    model: "turbo",
    content: text,
  });
  const result = chat.reply;
  return result;
}
