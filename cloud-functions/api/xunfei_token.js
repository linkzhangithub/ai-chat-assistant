// api/xunfei_token.js - Vercel Serverless Function
import CryptoJS from "crypto-js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const appId = process.env.VITE_XUNFEI_APP_ID;
  const apiKey = process.env.VITE_XUNFEI_API_KEY;
  const apiSecret = process.env.VITE_XUNFEI_API_SECRET;

  if (!appId || !apiKey || !apiSecret) {
    console.error("讯飞配置缺失");
    return res.status(500).json({ error: "讯飞配置缺失" });
  }

  const date = new Date().toUTCString();
  const host = "iat-api.xfyun.cn";
  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  const signature = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(signatureOrigin, apiSecret),
  );
  const authorization = Buffer.from(
    `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`,
  ).toString("base64");
  const wsUrl = `wss://${host}/v2/iat?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;

  res.status(200).json({ wsUrl, appId });
}
