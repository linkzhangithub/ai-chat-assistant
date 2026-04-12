// node-functions/api/generate-title.js
export default async function handler(request, response) {
  // 只允许 POST 请求
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = request.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: "Invalid messages array" });
  }

  // 构造用于生成标题的提示词
  const systemPrompt = `你是一个对话标题生成助手。请根据以下对话内容，生成一个简短的标题（不超过20个字），要求：
- 概括对话的核心主题
- 不要使用标点符号结尾
- 不要包含"标题："等前缀
- 直接输出标题文本`;

  // 提取最近的几轮对话（最多6条消息，避免过长）
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
    const apiKey = process.env.VITE_ZHIPU_API_KEY; // 使用环境变量中的 API Key
    if (!apiKey) {
      console.error("Missing ZHIPU_API_KEY");
      return response.status(500).json({ error: "Server configuration error" });
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
      return response.status(502).json({ error: "AI service error" });
    }

    const data = await resp.json();
    const title = data.choices?.[0]?.message?.content?.trim() || "新对话";
    // 限制长度
    const finalTitle = title.length > 25 ? title.slice(0, 25) + "..." : title;
    return response.status(200).json({ title: finalTitle });
  } catch (error) {
    console.error("Generate title error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}
