// API 调用模块（支持流式和非流式）
function getApiBaseUrl() {
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_API_PORT || 3000;
  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${hostname}:${port}/api`;
}

async function request(endpoint, body) {
  const url = `${getApiBaseUrl()}/${endpoint}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    return response.json();
  } catch (err) {
    console.error(`API request failed: ${endpoint}`, err);
    throw err;
  }
}

// 非流式文本聊天
export async function sendMessage(messages, systemPrompt) {
  const data = await request("chat", { messages, systemPrompt });
  if (!data.reply) throw new Error("Invalid response: missing reply");
  return { reply: data.reply };
}

// 流式文本聊天（SSE 解析）
export async function sendMessageStream(messages, systemPrompt, onChunk) {
  const url = `${getApiBaseUrl()}/chat`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, systemPrompt, stream: true }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split(/\n\n/);
    buffer = events.pop() || "";

    for (const event of events) {
      if (!event.trim()) continue;
      const lines = event.split("\n");
      let dataLine = "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          dataLine = line.slice(6).trim();
          break;
        }
      }
      if (dataLine === "") continue;
      if (dataLine === "[DONE]") {
        onChunk(null, true);
        return;
      }
      try {
        const parsed = JSON.parse(dataLine);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content !== undefined && content !== null) {
          onChunk(content, false);
        }
      } catch (e) {
        console.error("解析流数据失败:", e);
      }
    }
  }
  onChunk(null, true);
}

// 图片理解
export async function sendImage(
  imageBase64,
  prompt = "请描述这张图片的内容，尽量详细。",
) {
  const data = await request("vision", { imageBase64, prompt });
  if (!data.reply) throw new Error("Invalid response: missing reply");
  return { reply: data.reply };
}
