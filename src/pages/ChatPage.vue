<template>
  <div class="layout">
    <div class="chat-container">
      <Header
        v-model="currentRoleId"
        :roles="roles"
        @new-chat="createNewConversation"
        @toggle-sidebar="sidebarVisible = true"
        @go-home="goHome"
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
import { useRouter } from "vue-router";
import { useChatStore } from "../stores/chat";
import { roles } from "../constants/roles";
import Header from "../components/Header.vue";
import WelcomeScreen from "../components/chat/WelcomeScreen.vue";
import ChatArea from "../components/chat/ChatArea.vue";
import InputArea from "../components/InputArea.vue";
import Sidebar from "../components/Sidebar.vue";
import { useConversations } from "../composables/useConversations";
import { useAIChat } from "../composables/useAIChat";

const router = useRouter();
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

const { isLoading, isTyping, handleSend, handleSendImage } = useAIChat(
  store,
  currentRoleId,
);

function handleSelectConversation(convId) {
  switchConversation(convId);
  sidebarVisible.value = false;
}

function handleDeleteConversation(convId) {
  deleteConversation(convId);
}

function goHome() {
  router.push("/");
}

onMounted(() => {
  store.loadFromLocalStorage();
  loadConversations();
});
</script>

<style scoped>
</style>
