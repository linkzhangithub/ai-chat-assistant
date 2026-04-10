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

  function generateTitle(messagesList) {
    if (!messagesList || messagesList.length === 0) return "新对话";
    const firstUserMsg = messagesList.find((m) => m.role === "user");
    if (!firstUserMsg) return "新对话";
    const content = firstUserMsg.content.trim();
    if (content.length === 0) return "新对话";
    return content.length > 20 ? content.slice(0, 20) + "..." : content;
  }

  // 比较两个消息数组是否内容相同
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

  function saveCurrentConversation() {
    if (isInitializing) return;
    if (messages.value.length === 0) return;
    const convIndex = conversations.value.findIndex(
      (c) => c.id === currentConversationId.value,
    );
    const title = generateTitle(messages.value);
    const conversation = {
      id: currentConversationId.value,
      title,
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
