<template>
  <div :class="['msg', role]">
    <div class="bubble">
      <div v-if="image" class="message-image">
        <img :src="image" alt="用户图片" />
      </div>
      <div v-if="content" class="message-text">
        <MessageContent :content="content" :role="role" />
      </div>
    </div>
  </div>
</template>

<script setup>
import MessageContent from "./MessageContent.vue";

defineProps({
  role: { type: String, required: true },
  content: { type: String, default: "" },
  image: { type: String, default: "" },
});
</script>

<style scoped>
.msg {
  display: flex;
  width: 100%;
  margin-bottom: var(--spacing-md);
  animation: fadeInUp 0.3s ease;
}

.msg.user {
  justify-content: flex-end;
}

.msg.assistant {
  justify-content: flex-start;
}

.bubble {
  max-width: 75%;
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  line-height: 1.6;
  font-size: var(--font-base);
  word-wrap: break-word;
  box-shadow: var(--shadow-sm);
}

.msg.user .bubble {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border-bottom-right-radius: var(--radius-sm);
}

.msg.assistant .bubble {
  background: var(--surface);
  color: var(--neutral-900);
  border: 1px solid var(--border-color);
  border-bottom-left-radius: var(--radius-sm);
}

.message-image {
  margin-bottom: var(--spacing-sm);
}

.message-image img {
  max-width: 280px;
  max-height: 280px;
  border-radius: var(--radius-md);
  object-fit: cover;
}

.message-text {
  word-break: break-word;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .bubble {
    max-width: 85%;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-sm);
  }
  
  .message-image img {
    max-width: 200px;
    max-height: 200px;
  }
}

@media (max-width: 480px) {
  .bubble {
    max-width: 90%;
    padding: var(--spacing-sm) var(--spacing-md);
  }
  
  .message-image img {
    max-width: 160px;
    max-height: 160px;
  }
}
</style>