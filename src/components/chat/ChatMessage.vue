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
/* 样式与原版一致，无光标相关代码 */
.msg {
  display: flex;
  width: 100%;
  margin-bottom: 12px;
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}
.bubble {
  max-width: 92%;
  padding: 12px 18px;
  border-radius: 24px;
  line-height: 1.5;
  font-size: 0.95rem;
  word-wrap: break-word;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.msg.user .bubble {
  background: #007aff;
  color: white;
}
.msg.assistant .bubble {
  background: #f1f3f5;
  color: #1e293b;
}
.message-image {
  margin-bottom: 8px;
}
.message-image img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
}
.message-text {
  word-break: break-word;
}
@media (max-width: 600px) {
  .bubble {
    max-width: 95%;
    padding: 10px 14px;
    font-size: 0.9rem;
  }
  .message-image img {
    max-width: 150px;
    max-height: 150px;
  }
}
</style>
