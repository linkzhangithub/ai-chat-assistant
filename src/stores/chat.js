// Pinia 聊天状态管理
import { defineStore } from "pinia";
import { roles } from "../constants/roles.js";

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [],
    currentRoleId: roles[0]?.id || "assistant",
    isLoading: false,
  }),
  actions: {
    addMessage(message) {
      if (!message || !message.role) return;
      this.messages.push(message);
      this.saveToLocalStorage();
    },
    // 更新指定索引的消息内容
    updateMessageContent(index, content) {
      if (this.messages[index]) {
        this.messages[index].content = content;
        this.saveToLocalStorage();
      } else {
        console.warn(`消息索引 ${index} 不存在`);
      }
    },
    setCurrentRole(roleId) {
      this.currentRoleId = roleId;
      localStorage.setItem("chatCurrentRoleId", roleId);
    },
    clearMessages() {
      this.messages = [];
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      try {
        localStorage.setItem("chatMessages", JSON.stringify(this.messages));
      } catch (e) {
        console.error("保存消息失败", e);
      }
    },
    loadFromLocalStorage() {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        try {
          const parsed = JSON.parse(savedMessages);
          if (Array.isArray(parsed)) {
            this.messages = parsed;
          }
        } catch (e) {
          console.error("解析消息失败", e);
        }
      }
      const savedRoleId = localStorage.getItem("chatCurrentRoleId");
      if (savedRoleId && roles.some((r) => r.id === savedRoleId)) {
        this.currentRoleId = savedRoleId;
      }
    },
  },
});
