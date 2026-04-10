// 聊天业务逻辑（流式输出、图片理解）
import { ref } from "vue";
import { sendMessageStream, sendImage } from "../api/chat";
import { roles } from "../constants/roles";

export function useAIChat(store, currentRoleId) {
  const isLoading = ref(false);
  const isTyping = ref(false);

  // AI 流式回复
  async function getAIResponse() {
    isTyping.value = true;
    isLoading.value = true;
    let hasReceivedFirstChunk = false;
    let lastMessageIndex = -1;

    try {
      const history = store.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const role = roles.find((r) => r.id === currentRoleId.value);

      let fullContent = "";
      await sendMessageStream(history, role.systemPrompt, (chunk, isDone) => {
        if (chunk) {
          fullContent += chunk;
          if (!hasReceivedFirstChunk) {
            isTyping.value = false;
            store.addMessage({ role: "assistant", content: "" });
            lastMessageIndex = store.messages.length - 1;
            hasReceivedFirstChunk = true;
          }
          if (lastMessageIndex >= 0) {
            store.updateMessageContent(lastMessageIndex, fullContent);
          }
        }
        if (isDone) {
          isTyping.value = false;
          isLoading.value = false;
        }
      });

      if (!hasReceivedFirstChunk) {
        isTyping.value = false;
        isLoading.value = false;
        store.addMessage({ role: "assistant", content: "（无内容）" });
      }
    } catch (err) {
      console.error("AI 回复失败:", err);
      isTyping.value = false;
      isLoading.value = false;
      if (hasReceivedFirstChunk && lastMessageIndex >= 0) {
        store.messages.pop();
      }
      store.addMessage({ role: "assistant", content: "出错了，请稍后再试。" });
    }
  }

  // 图片理解
  async function getImageResponse(imageBase64, userText) {
    isTyping.value = true;
    isLoading.value = true;
    try {
      const prompt = userText || "请描述这张图片的内容";
      const res = await sendImage(imageBase64, prompt);
      store.addMessage({ role: "assistant", content: res.reply });
    } catch (err) {
      console.error("图片理解失败:", err);
      store.addMessage({
        role: "assistant",
        content: "图片理解失败，请重试。",
      });
    } finally {
      isTyping.value = false;
      isLoading.value = false;
    }
  }

  // 发送文本消息
  async function handleSend(text) {
    if (!text || isLoading.value) return;
    store.addMessage({ role: "user", content: text });
    await getAIResponse();
  }

  // 发送图片消息
  async function handleSendImage({ image, text }) {
    if (!image || isLoading.value) return;
    store.addMessage({ role: "user", content: text || "", image });
    await getImageResponse(image, text);
  }

  return {
    isLoading,
    isTyping,
    handleSend,
    handleSendImage,
  };
}
