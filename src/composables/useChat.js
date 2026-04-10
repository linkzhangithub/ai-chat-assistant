// src/composables/useChat.js
import { ref } from "vue";
import { sendMessage } from "../api/chat";

export function useChat(store, currentRoleId, roles) {
  const isTyping = ref(false);
  const isLoading = ref(false);

  async function send(text) {
    if (!text || isLoading.value) return;
    store.addMessage({ role: "user", content: text });
    isTyping.value = true;
    isLoading.value = true;
    try {
      const history = store.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const role = roles.find((r) => r.id === currentRoleId.value);
      const res = await sendMessage(history, role.systemPrompt);
      store.addMessage({ role: "assistant", content: res.reply });
    } catch (err) {
      console.error(err);
      store.addMessage({ role: "assistant", content: "出错了，请稍后再试。" });
    } finally {
      isLoading.value = false;
      isTyping.value = false;
    }
  }

  return {
    isTyping,
    isLoading,
    send,
  };
}
