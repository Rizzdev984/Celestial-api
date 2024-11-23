import axios from "axios"

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }
  const { url } = req.query
  if (!url) {
    return res.status(400).json({ error: q.msg.qUrl })
  }
  const result = await tiktokDl(url)
  if (result.status === "error") {
    return res.status(500).json(result)
  }
  res.status(200).json(result)
}

async function tiktokDl(url) {
  let response = await axios.post("https://www.tikwm.com/api", {}, {
      params: {
        url: url,
        count: 12,
        cursor: 0,
        web: 1,
        hd: 1,
      },
    },
  )
  return response.data
}
