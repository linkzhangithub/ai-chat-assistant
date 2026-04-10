// node-functions/api/chat.js
import fetch from "node-fetch";

export default async function onRequest(context) {
  const { request } = context;
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages, systemPrompt, stream = false } = await request.json();
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing Zhipu API key" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
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
      return new Response(response.body, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else {
      const data = await response.json();
      return new Response(
        JSON.stringify({ reply: data.choices[0].message.content }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
