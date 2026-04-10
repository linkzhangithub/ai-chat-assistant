<!-- src/components/sidebar/NewChatButton.vue -->
<template>
  <div class="sidebar-actions">
    <button
      class="new-chat-btn"
      v-tooltip="'新建对话'"
      @click="$emit('new-chat')"
    >
      <span>+</span> 新建对话
    </button>
  </div>
</template>

<script setup>
defineEmits(["new-chat"]);
</script>

<style scoped>
.sidebar-actions {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f2f5;
}
.new-chat-btn {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #4f46e5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
}
.new-chat-btn span {
  font-size: 1.2rem;
  line-height: 1;
}
.new-chat-btn:hover {
  background: #eef2ff;
  border-color: #c7d2fe;
}
</style>
