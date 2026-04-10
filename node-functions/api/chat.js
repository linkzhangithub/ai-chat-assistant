// api/chat.js - Vercel Serverless Function
import fetch from "node-fetch";

export default async function handler(req, res) {
  // 只允许 POST 方法
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { messages, systemPrompt, stream = false } = req.body;
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Missing Zhipu API key" });
  }

  const requestBody = {
    model: "glm-4-flash",
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    stream,
  };

  try {
    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    if (stream) {
      // 流式响应：直接转发智谱的 SSE 流
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      response.body.pipe(res);
    } else {
      const data = await response.json();
      res.status(200).json({ reply: data.choices[0].message.content });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
