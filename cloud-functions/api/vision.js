// api/vision.js - Vercel Serverless Function
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { imageBase64, prompt } = req.body;
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Zhipu API key" });
  }

  const imageUrl = imageBase64.startsWith("data:image")
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  try {
    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "glm-4v-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt || "请描述这张图片的内容，尽量详细。",
                },
                { type: "image_url", image_url: { url: imageUrl } },
              ],
            },
          ],
          stream: false,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Vision API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
