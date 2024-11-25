export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  const { text } = req.query;
  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid Data" });
  }

  try {
    const response = await runModel("@cf/tinyllama/tinyllama-1.1b-chat-v1.0", {
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
    });

    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: response.result.response,
    });
  } catch (error) {
    console.error("Error running model:", error.message);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
}

async function runModel(model, input) {
  const API_URL = `https://api.cloudflare.com/client/v4/accounts/77192fa7d0e666303fc9ba04a53bbc87/ai/run/${model}`;
  const AUTH_TOKEN = process.env.CLOUDFLARE_AUTH_TOKEN || "Ds3TLA6CuIplDCpvia8zfXIy60rInplXbcVdVZIM";

  try {
    const response = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
      method: "POST",
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API Request Failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in runModel:", error.message);
    throw error;
  }
}
