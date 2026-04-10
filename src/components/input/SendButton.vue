<template>
  <button
    class="send-btn"
    v-tooltip="'发送消息'"
    :disabled="disabled"
    @click="$emit('click')"
  >
    发送
  </button>
</template>

<script setup>
defineProps({
  disabled: Boolean,
});
defineEmits(["click"]);
</script>

<style scoped>
.send-btn {
  background: #007aff;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 0 20px;
  height: 44px;
  cursor: pointer;
  flex-shrink: 0;
  font-size: 0.95rem;
}
.send-btn:disabled {
  background: #aaa;
}
@media (max-width: 600px) {
  .send-btn {
    padding: 0 16px;
    height: 40px;
  }
}
</style>
