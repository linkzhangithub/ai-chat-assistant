// node-functions/api/generate-title.js

export default async function onRequest(context) {
  const { request } = context;

  // 处理 OPTIONS 预检请求（CORS）
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // 只允许 POST 请求
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let messages;
  try {
    const body = await request.json();
    messages = body.messages;
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid messages array" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 构造用于生成标题的提示词
  const systemPrompt = `你是一个对话标题生成助手。请根据以下对话内容，生成一个简短的标题（不超过20个字），要求：
- 概括对话的核心主题
- 不要使用标点符号结尾
- 不要包含"标题："等前缀
- 直接输出标题文本`;

  const recentMessages = messages.slice(-6);
  const userMessages = recentMessages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("；");
  const assistantMessages = recentMessages
    .filter((m) => m.role === "assistant")
    .map((m) => m.content)
    .join("；");
  const conversationText = `用户提问：${userMessages}\nAI回答：${assistantMessages}`;
  const prompt = `对话内容：${conversationText}\n请生成标题：`;

  try {
    const apiKey = process.env.ZHIPU_API_KEY;
    if (!apiKey) {
      console.error("Missing ZHIPU_API_KEY");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const url = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
    const payload = {
      model: "glm-4-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 50,
      stream: false,
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Zhipu API error:", resp.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    let title = data.choices?.[0]?.message?.content?.trim() || "新对话";
    if (title.length > 25) title = title.slice(0, 25) + "...";

    return new Response(JSON.stringify({ title }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Generate title error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
