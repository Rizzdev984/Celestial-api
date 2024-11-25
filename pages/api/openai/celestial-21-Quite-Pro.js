export default async function handler(req, res) {
  // Validasi method
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  // Validasi Authorization header
  const authorization = req.headers.authorization;
  if (!authorization || authorization !== "Bearer Celestial-21-Pro-Generate/chat") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validasi Content-Type
  const contentType = req.headers["content-type"];
  if (!contentType || contentType !== "application/json") {
    return res.status(400).json({ error: "Content-Type must be application/json" });
  }

  // Parse body
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing Body Parameter "text"' });
  }

  try {
    const mistral = await run("@hf/nousresearch/hermes-2-pro-mistral-7b", {
      messages: [
        {
          role: "system",
          content: `Mulai Sekarang Kamu Adalah Celestial-21-Quiet-Pro ...`, // Disingkat untuk readability
        },
        {
          role: "user",
          content: text,
        },
      ],
    });

    // Respon sukses
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: mistral.result.response,
    });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

// Fungsi helper untuk memanggil model
async function run(model, input) {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/77192fa7d0e666303fc9ba04a53bbc87/ai/run/${model}`,
      {
        headers: {
          Authorization: "Bearer Ds3TLA6CuIplDCpvia8zfXIy60rInplXbcVdVZIM",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(input),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw new Error("Failed to fetch from AI model.");
  }
}
