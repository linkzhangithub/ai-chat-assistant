// node-functions/api/xunfei_token.js
import CryptoJS from "crypto-js";

export default async function onRequest(context) {
  const { request } = context;
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appId = process.env.XUNFEI_APP_ID;
  const apiKey = process.env.XUNFEI_API_KEY;
  const apiSecret = process.env.XUNFEI_API_SECRET;

  if (!appId || !apiKey || !apiSecret) {
    console.error("讯飞配置缺失");
    return new Response(JSON.stringify({ error: "讯飞配置缺失" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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

  return new Response(JSON.stringify({ wsUrl, appId }), {
    headers: { "Content-Type": "application/json" },
  });
}
