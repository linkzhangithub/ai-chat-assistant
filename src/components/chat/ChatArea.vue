<template>
  <div class="messages" ref="container">
    <ChatMessage
      v-for="(msg, idx) in messages"
      :key="idx"
      :role="msg.role"
      :content="msg.content"
      :image="msg.image"
    />
    <TypingIndicator v-if="isTyping" />
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import ChatMessage from "./ChatMessage.vue";
import TypingIndicator from "./TypingIndicator.vue";

const props = defineProps({
  messages: Array,
  isTyping: Boolean,
});

const container = ref(null);

function scrollToBottom() {
  nextTick(() => {
    if (container.value) {
      container.value.scrollTop = container.value.scrollHeight;
    }
  });
}

watch(
  () => props.messages.length,
  () => scrollToBottom(),
);
watch(
  () => props.isTyping,
  () => scrollToBottom(),
);

defineExpose({ scrollToBottom });
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  scrollbar-gutter: stable;
}
@media (max-width: 600px) {
  .messages {
    padding: 0.75rem 1rem;
  }
}
</style>
