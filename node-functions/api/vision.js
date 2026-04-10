// node-functions/api/vision.js
import fetch from "node-fetch";

export default async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { imageBase64, prompt } = await request.json();
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing Zhipu API key" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
