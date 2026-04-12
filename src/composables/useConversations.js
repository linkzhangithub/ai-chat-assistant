// 对话历史管理（存储、切换、删除、自动保存）
import { ref, watch } from "vue";

export function useConversations(
  messages,
  currentRoleId,
  clearMessages,
  updateStore,
) {
  const conversations = ref([]);
  const currentConversationId = ref(Date.now().toString());
  let isInitializing = false;
  // 用于防止同一对话重复请求标题
  const pendingTitleRequests = new Set();

  // 降级标题生成（基于内容截取）
  function generateFallbackTitle(messagesList) {
    if (!messagesList || messagesList.length === 0) return "新对话";
    const aiMessage = messagesList.find(
      (m) => m.role === "assistant" && m.content && m.content.trim().length > 0,
    );
    if (aiMessage) {
      let content = aiMessage.content.trim();
      const removePatterns = [
        /正在思考\.{0,3}/,
        /思考中\.{0,3}/,
        /让我想想\.{0,3}/,
      ];
      for (const pattern of removePatterns) {
        content = content.replace(pattern, "");
      }
      content = content.trim();
      if (content.length > 0) {
        return content.length > 20 ? content.slice(0, 20) + "..." : content;
      }
    }
    const firstUserMsg = messagesList.find((m) => m.role === "user");
    if (firstUserMsg) {
      const content = firstUserMsg.content.trim();
      if (content.length > 0) {
        return content.length > 20 ? content.slice(0, 20) + "..." : content;
      }
    }
    return "新对话";
  }

  // 异步调用 AI 生成标题
  async function fetchAITitle(messagesList, convId) {
    if (pendingTitleRequests.has(convId)) return;
    pendingTitleRequests.add(convId);
    try {
      // 只取最近 6 条消息（节省 token）
      const recentMessages = messagesList.slice(-6);
      const response = await fetch("/api/generate-title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentMessages }),
      });
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      if (data.title && data.title !== "新对话") {
        // 更新 conversations 中对应对话的标题
        const convIndex = conversations.value.findIndex((c) => c.id === convId);
        if (
          convIndex !== -1 &&
          conversations.value[convIndex].title !== data.title
        ) {
          conversations.value[convIndex].title = data.title;
          // 保存到 localStorage
          localStorage.setItem(
            "ai_chat_conversations",
            JSON.stringify(conversations.value),
          );
        }
      }
    } catch (error) {
      console.warn("AI title generation failed, using fallback", error);
    } finally {
      pendingTitleRequests.delete(convId);
    }
  }

  // 保存当前对话（原有逻辑 + 异步生成 AI 标题）
  function saveCurrentConversation() {
    if (isInitializing) return;
    if (messages.value.length === 0) return;

    const convIndex = conversations.value.findIndex(
      (c) => c.id === currentConversationId.value,
    );
    const fallbackTitle = generateFallbackTitle(messages.value);
    const conversation = {
      id: currentConversationId.value,
      title: fallbackTitle, // 先用降级标题
      messages: JSON.parse(JSON.stringify(messages.value)),
      roleId: currentRoleId.value,
      timestamp: Date.now(),
    };

    if (convIndex >= 0) {
      conversations.value[convIndex] = conversation;
    } else {
      conversations.value.unshift(conversation);
    }
    conversations.value.sort((a, b) => b.timestamp - a.timestamp);
    if (conversations.value.length > 50)
      conversations.value = conversations.value.slice(0, 50);
    localStorage.setItem(
      "ai_chat_conversations",
      JSON.stringify(conversations.value),
    );

    // 异步生成 AI 标题（不阻塞）
    fetchAITitle(messages.value, currentConversationId.value);
  }

  function loadConversations() {
    isInitializing = true;
    const saved = localStorage.getItem("ai_chat_conversations");
    if (saved) {
      conversations.value = JSON.parse(saved);
      conversations.value.forEach((conv) => {
        if (!conv.timestamp) conv.timestamp = parseInt(conv.id) || Date.now();
      });
      conversations.value.sort((a, b) => b.timestamp - a.timestamp);
    }
    const matched = findMatchingConversation();
    if (matched) {
      currentConversationId.value = matched.id;
    } else if (messages.value.length === 0) {
      currentConversationId.value = Date.now().toString();
    }
    isInitializing = false;
  }

  // 辅助函数：比较消息数组是否相同（保持不变）
  function areMessagesSame(msgs1, msgs2) {
    if (!msgs1 || !msgs2) return false;
    if (msgs1.length !== msgs2.length) return false;
    for (let i = 0; i < msgs1.length; i++) {
      const m1 = msgs1[i];
      const m2 = msgs2[i];
      if (m1.role !== m2.role) return false;
      if (m1.content !== m2.content) return false;
      if ((m1.image || m2.image) && m1.image !== m2.image) return false;
    }
    return true;
  }

  function findMatchingConversation() {
    if (messages.value.length === 0) return null;
    for (const conv of conversations.value) {
      if (areMessagesSame(conv.messages, messages.value)) {
        return conv;
      }
    }
    return null;
  }

  function createNewConversation(skipSave = false) {
    if (!skipSave && messages.value.length > 0) saveCurrentConversation();
    clearMessages();
    currentConversationId.value = Date.now().toString();
  }

  function switchConversation(convId) {
    const conv = conversations.value.find((c) => c.id === convId);
    if (!conv) return false;
    if (messages.value.length > 0) saveCurrentConversation();
    currentConversationId.value = convId;
    if (updateStore) {
      updateStore(conv.messages, conv.roleId);
    }
    return true;
  }

  function deleteConversation(convId) {
    const isCurrent = currentConversationId.value === convId;
    conversations.value = conversations.value.filter((c) => c.id !== convId);
    localStorage.setItem(
      "ai_chat_conversations",
      JSON.stringify(conversations.value),
    );
    if (isCurrent) {
      clearMessages();
      createNewConversation(true);
    }
  }

  watch(
    messages,
    () => {
      if (messages.value.length > 0) saveCurrentConversation();
    },
    { deep: true },
  );

  return {
    conversations,
    currentConversationId,
    loadConversations,
    createNewConversation,
    switchConversation,
    deleteConversation,
  };
}
