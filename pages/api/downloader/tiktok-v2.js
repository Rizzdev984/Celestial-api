import axios from 'axios';

export default async function handler(req, res) {
  if (req.methode !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" })
  }
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Url Invalid" })
  }
  try {
    let tuktik = await tiktokv2(url)
    return res.status(200).json({ 
      status: true,
      author: "Celestial",
      result: tuktik
    })
  } catch (e) {
    return res.status(500).json({ error: "Server Busy" })
  }
}


async function tiktokv2(url) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = [];

        function formatNumber(integer) {
          let numb = parseInt(integer);
          return Number(numb).toLocaleString().replace(/,/g, '.');
        }

        function formatDate(n, locale = 'en') {
          let d = new Date(n);
          return d.toLocaleDateString(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          });
        }

        let domain = 'https://www.tikwm.com/api/';
        let res = await (await axios.post(domain, {}, {
          headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://www.tikwm.com',
            'Referer': 'https://www.tikwm.com/',
            'Sec-Ch-Ua': '"Not)A;Brand";v="24", "Chromium";v="116"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': 'Android',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
          },
          params: {
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1,
          },
        })).data.data;

        if (res && !res.size && !res.wm_size && !res.hd_size) {
          res.images.map((v) => {
            data.push({ type: 'photo', url: v });
          });
        } else {
          if (res && res.wmplay) {
            data.push({ type: 'watermark', url: 'https://www.tikwm.com' + res.wmplay });
          }
          if (res && res.play) {
            data.push({ type: 'nowatermark', url: 'https://www.tikwm.com' + res.play });
          }
          if (res && res.hdplay) {
            data.push({ type: 'nowatermark_hd', url: 'https://www.tikwm.com' + res.hdplay });
          }
        }

        let json = {
          status: true,
          title: res.title,
          taken_at: formatDate(res.create_time).replace('1970', ''),
          region: res.region,
          id: res.id,
          durations: res.duration,
          duration: res.duration + ' Seconds',
          cover: 'https://www.tikwm.com' + res.cover,
          size_wm: res.wm_size,
          size_nowm: res.size,
          size_nowm_hd: res.hd_size,
          data: data,
          music_info: {
            id: res.music_info.id,
            title: res.music_info.title,
            author: res.music_info.author,
            album: res.music_info.album ? res.music_info.album : null,
            url: 'https://www.tikwm.com' + res.music || res.music_info.play,
          },
          stats: {
            views: formatNumber(res.play_count),
            likes: formatNumber(res.digg_count),
            comment: formatNumber(res.comment_count),
            share: formatNumber(res.share_count),
            download: formatNumber(res.download_count),
          },
          author: {
            id: res.author.id,
            fullname: res.author.unique_id,
            nickname: res.author.nickname,
            avatar: 'https://www.tikwm.com' + res.author.avatar,
          },
        };
        resolve(json);
      } catch (e) {
        reject(e);
      }
    });
  }