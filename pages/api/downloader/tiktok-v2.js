import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Method Not Allowed" });
  }

  const { url } = req.query;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    const tuktik = await tiktokv2(url);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: tuktik,
    });
  } catch (e) {
    console.error("Error:", e.message);
    return res.status(500).json({ error: "Server Busy" });
  }
}

async function tiktokv2(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const formatNumber = (integer) =>
        Number(parseInt(integer)).toLocaleString().replace(/,/g, ".");
      const formatDate = (n, locale = "en") =>
        new Date(n).toLocaleDateString(locale, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });

      const domain = "https://www.tikwm.com/api/";
      const response = await axios.post(
        domain,
        new URLSearchParams({
          url: url,
          count: 12,
          cursor: 0,
          web: 1,
          hd: 1,
        }),
        {
          headers: {
            Accept: "application/json, text/javascript, */*; q=0.01",
            "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Origin: "https://www.tikwm.com",
            Referer: "https://www.tikwm.com/",
            "Sec-Ch-Ua": '"Not)A;Brand";v="24", "Chromium";v="116"',
            "Sec-Ch-Ua-Mobile": "?1",
            "Sec-Ch-Ua-Platform": "Android",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );

      const res = response.data.data;
      const data = [];

      if (!res.size && !res.wm_size && !res.hd_size) {
        res.images.forEach((v) => {
          data.push({ type: "photo", url: v });
        });
      } else {
        if (res.wmplay) data.push({ type: "watermark", url: res.wmplay });
        if (res.play) data.push({ type: "nowatermark", url: res.play });
        if (res.hdplay)
          data.push({ type: "nowatermark_hd", url: res.hdplay });
      }

      const json = {
        status: true,
        title: res.title,
        taken_at: formatDate(res.create_time).replace("1970", ""),
        region: res.region,
        id: res.id,
        duration: `${res.duration} Seconds`,
        cover: res.cover,
        size_wm: res.wm_size,
        size_nowm: res.size,
        size_nowm_hd: res.hd_size,
        data: data,
        music_info: {
          id: res.music_info.id,
          title: res.music_info.title,
          author: res.music_info.author,
          album: res.music_info.album || null,
          url: res.music_info.play || null,
        },
        stats: {
          views: formatNumber(res.play_count),
          likes: formatNumber(res.digg_count),
          comments: formatNumber(res.comment_count),
          shares: formatNumber(res.share_count),
          downloads: formatNumber(res.download_count),
        },
        author: {
          id: res.author.id,
          fullname: res.author.unique_id,
          nickname: res.author.nickname,
          avatar: res.author.avatar,
        },
      };
      resolve(json);
    } catch (e) {
      reject(e);
    }
  });
}

// Validasi URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
