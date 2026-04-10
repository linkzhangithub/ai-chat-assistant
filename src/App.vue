<template>
  <div class="layout">
    <div class="chat-container">
      <Header
        v-model="currentRoleId"
        :roles="roles"
        @clear="clearChat"
        @toggle-sidebar="sidebarVisible = true"
      />
      <WelcomeScreen v-if="messages.length === 0" />
      <ChatArea v-else :messages="messages" :isTyping="isTyping" />
      <InputArea
        :disabled="isLoading"
        @send="handleSend"
        @send-image="handleSendImage"
      />
    </div>
    <Sidebar
      v-model:visible="sidebarVisible"
      :conversations="conversations"
      :currentId="currentConversationId"
      @select="handleSelectConversation"
      @delete="handleDeleteConversation"
      @new-chat="createNewConversation"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useChatStore } from "./stores/chat";
import { roles } from "./constants/roles";
import Header from "./components/Header.vue";
import WelcomeScreen from "./components/chat/WelcomeScreen.vue";
import ChatArea from "./components/chat/ChatArea.vue";
import InputArea from "./components/InputArea.vue";
import Sidebar from "./components/Sidebar.vue";
import { useConversations } from "./composables/useConversations";
import { useAIChat } from "./composables/useAIChat";

const store = useChatStore();
const messages = computed(() => store.messages);
const currentRoleId = computed({
  get: () => store.currentRoleId,
  set: (val) => store.setCurrentRole(val),
});

const sidebarVisible = ref(false);

const {
  conversations,
  currentConversationId,
  loadConversations,
  createNewConversation,
  switchConversation,
  deleteConversation,
} = useConversations(
  messages,
  currentRoleId,
  () => store.clearMessages(),
  (newMessages, newRoleId) => {
    store.messages = newMessages;
    store.currentRoleId = newRoleId;
    store.saveToLocalStorage();
  },
);

// AI 聊天逻辑（发送、流式回复、图片理解）
const { isLoading, isTyping, handleSend, handleSendImage } = useAIChat(
  store,
  currentRoleId,
);

function clearChat() {
  store.clearMessages();
}

function handleSelectConversation(convId) {
  switchConversation(convId);
  sidebarVisible.value = false;
}

function handleDeleteConversation(convId) {
  deleteConversation(convId);
}

onMounted(() => {
  store.loadFromLocalStorage();
  loadConversations();
});
</script>
