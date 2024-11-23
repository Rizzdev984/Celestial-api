import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methode Not Allowed" });
  }
  
  const { zone, id } = req.query;
  if (!zone || !id) {
    return res.status(400).json({
      error: "Id and ZoneId are required"
    });
  }

  try {
    const mlstalk = await stalkml(id, zone);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: mlstalk
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

const stalkml = async (id, zoneId) => {
  try {
    const response = await axios.post(
      'https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store',
      new URLSearchParams(
        Object.entries({
          productId: '1',
          itemId: '2',
          catalogId: '57',
          paymentId: '352',
          gameId: id,
          zoneId: zoneId,
          product_ref: 'REG',
          product_ref_denom: 'AE',
        })
      ),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Referer: 'https://www.duniagames.co.id/',
          Accept: 'application/json',
        },
      }
    );

    return {
      id: id,
      zoneId: zoneId,
      nickname: response.data.data.gameDetail.userName,
    };
  } catch (err) {
    return {
      status: 404,
      msg: 'User Id or ZoneId Not Found',
    };
  }
};
