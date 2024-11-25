

export default async function handler(req, res) {
  if (res.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { text, prompt } = req.query;
  if (!text || !prompt) {
    return res.status(400).json({ error: "Data Invalid" })
  }
  try {
    const gemma = run("@hf/google/gemma-7b-it", {
      messages: [
        {
          role: "system",
          content: prompt,
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
      result: gemma
    })
  } catch (e) {
    return res.status(500).json({ error: "Internal Server Erorr"})
    console.log(e)
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
