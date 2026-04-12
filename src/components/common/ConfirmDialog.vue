<!-- src/components/common/ConfirmDialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="confirm-overlay" @click.self="cancel">
        <div class="confirm-dialog">
          <div class="confirm-title">{{ title }}</div>
          <div class="confirm-message">{{ message }}</div>
          <div class="confirm-actions">
            <button class="confirm-btn cancel" @click="cancel">
              {{ cancelText }}
            </button>
            <button class="confirm-btn confirm" @click="confirm">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  title: { type: String, default: "确认操作" },
  message: { type: String, default: "此操作不可撤销，确定继续吗？" },
  confirmText: { type: String, default: "确认" },
  cancelText: { type: String, default: "取消" },
});

const emit = defineEmits(["update:visible", "confirm", "cancel"]);

function confirm() {
  emit("confirm");
  emit("update:visible", false);
}

function cancel() {
  emit("cancel");
  emit("update:visible", false);
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 修改：从 1000 提升到 9999，确保高于侧边栏 */
}
.confirm-dialog {
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  max-width: 320px;
  width: 90%;
  box-shadow: 0 20px 35px -8px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.confirm-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1e293b;
}
.confirm-message {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.4;
}
.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.confirm-btn {
  flex: 1;
  padding: 10px 16px;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.confirm-btn.cancel {
  background: #f1f5f9;
  color: #475569;
}
.confirm-btn.cancel:hover {
  background: #e2e8f0;
}
.confirm-btn.confirm {
  background: #ef4444;
  color: white;
}
.confirm-btn.confirm:hover {
  background: #dc2626;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
