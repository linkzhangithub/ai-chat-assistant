import "dotenv/config";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import CryptoJS from "crypto-js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const { ZHIPU_API_KEY } = process.env;
const { XUNFEI_APP_ID, XUNFEI_API_KEY, XUNFEI_API_SECRET } = process.env;

// 讯飞实时语音转写
app.get("/api/xunfei_token", (req, res) => {
  if (!XUNFEI_APP_ID || !XUNFEI_API_KEY || !XUNFEI_API_SECRET) {
    console.error("讯飞配置缺失");
    return res.status(500).json({ error: "讯飞配置缺失" });
  }
  const date = new Date().toUTCString();
  const host = "iat-api.xfyun.cn";
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signatureOrigin, XUNFEI_API_SECRET),
  );
  const authorization = Buffer.from(
    `api_key="${XUNFEI_API_KEY}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`,
  ).toString("base64");
  const wsUrl = `wss://${host}/v2/iat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
  res.json({ wsUrl, appId: XUNFEI_APP_ID });
});

// 聊天接口（支持流式和非流式）
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt, stream = false } = req.body;
    if (!ZHIPU_API_KEY) throw new Error("Missing Zhipu API key");

    const requestBody = {
      model: "glm-4-flash",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      stream,
    };

    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      response.body.pipe(res);
    } else {
      const data = await response.json();
      res.json({ reply: data.choices[0].message.content });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 图片理解接口
app.post("/api/vision", async (req, res) => {
  try {
    const { imageBase64, prompt } = req.body;
    if (!ZHIPU_API_KEY) throw new Error("Missing Zhipu API key");
    const imageUrl = imageBase64.startsWith("data:image")
      ? imageBase64
      : `data:image/jpeg;base64,${imageBase64}`;
    const response = await fetch(
      "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ZHIPU_API_KEY}`,
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
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ 修改点：使用 process.env.PORT 支持云端部署
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Proxy running on http://0.0.0.0:${PORT}`),
);
