import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(403).json({ error: "Methods Not Allowed" });
  }

  const { url, text } = req.query;
  if (!url || !text) {
    return res.status(400).json({ error: "Silahkan Isi Format Dengan Benar" });
  }

  try {
    const gemini = await geminiImage(url, text);
    return res.status(200).json({
      status: true,
      author: "Celestial",
      result: gemini,
    });
  } catch (e) {
    return res.status(500).json({ error: `Internal Server Error ${e.message}` });
  }
}

const Used_Apikey = "AIzaSyB2mvsGVTZAU-h-GtCLzoLhjHEdvugx9uQ";
const genAI = new GoogleGenerativeAI(Used_Apikey);
const fileManager = new GoogleAIFileManager(Used_Apikey);

async function geminiImage(url, content) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    const fileBuffer = Buffer.from(response.data);
    const uploadedFile = await fileManager.uploadBuffer(fileBuffer, {
      mimeType: "image/jpeg",
      displayName: `temp_image_${Date.now()}`,
    });
    const imageModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await imageModel.generateContent([
      { fileData: { mimeType: uploadedFile.mimeType, fileUri: uploadedFile.uri } },
      { text: content },
    ]);
    return result.response.text();
  } catch (error) {
    throw error;
  }
}
