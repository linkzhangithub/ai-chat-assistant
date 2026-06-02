<template>
  <button
    class="send-btn"
    v-tooltip="'发送消息'"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <span class="btn-text">发送</span>
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
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0 var(--spacing-lg);
  height: 44px;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
  transition: all var(--transition-normal);
  font-weight: 500;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  background: var(--neutral-300);
  box-shadow: none;
  cursor: not-allowed;
}

.btn-text {
  font-size: var(--font-base);
}

@media (max-width: 480px) {
  .send-btn {
    height: 40px;
    padding: 0 var(--spacing-md);
    font-size: var(--font-sm);
  }
}
</style>