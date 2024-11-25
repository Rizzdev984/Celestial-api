
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { text, prompt } = req.body;
  if (!text || !prompt) {
    return res.statud(400).json({ error: "Data Invalid" })
  }
  try {
    const diclom = await run("@cf/thebloke/discolm-german-7b-v1-awq", {
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
})
     return res.status(200).json({ 
       status: true,
       author: "Celestial",
       result: diclom.result.response
     })
  } catch (e) {
    return res.status(500).json({
      error: "Internal Server Engror"
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

