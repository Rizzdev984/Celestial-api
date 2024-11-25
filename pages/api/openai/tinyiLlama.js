
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { text } = req.query;
  if (!text) {
    return res.status(400).json({ error: "Data Invalid" })
  }
  try {
    let res = run("@cf/tinyllama/tinyllama-1.1b-chat-v1.0", {
  messages: [
    {
      role: "system",
      content: "Gunakan Model Terbaik Mu Dan Nama Kamu Adalah Nama Default Mu, Kamu Senang Mengobrol Dengan Siapa Pun",
    },
    {
      role: "user",
      content: text,
    },
  ],
})
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: res.result.response
    })
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Error"
    })
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