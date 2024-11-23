import axios from "axios";

const GITHUB_TOKEN = "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";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Hanya metode GET yang diperbolehkan" });
  }

  const { query, lang } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Parameter 'query' diperlukan" });
  }

  try {
    const results = await githubCodeSearch(query, lang);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: results,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
}

async function githubCodeSearch(query, lang) {
  if (!query.includes('in:file')) {
    query = `${query} in:file`;
  }

  if (lang) {
    query = `${query} language:${lang}`;
  }

  const endpoint = "https://api.github.com/search/code";
  const params = new URLSearchParams({ q: query });

  try {
    const response = await axios.get(`${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      },
    });

    const items = response.data.items.map((item) => {
      const { repository, path } = item;
      const rawUrl = `https://raw.githubusercontent.com/${repository.full_name}/main/${path}`;
      return {
        name: item.name,
        path: item.path,
        repository: repository.full_name,
        url: item.html_url,
        raw_url: rawUrl,
      };
    });

    return items;
  } catch (error) {
    console.error("GitHub API Error:", error.message);
    throw new Error("Gagal mengambil data dari GitHub API");
  }
}
