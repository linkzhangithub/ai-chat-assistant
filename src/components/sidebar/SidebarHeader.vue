<!-- src/components/sidebar/SidebarHeader.vue -->
<template>
  <div class="sidebar-header">
    <span class="sidebar-title">对话历史</span>
    <button
      class="sidebar-close"
      v-tooltip="'关闭侧边栏'"
      @click="$emit('close')"
    >
      ✕
    </button>
  </div>
</template>

<script setup>
defineEmits(["close"]);
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 20px 16px;
  border-bottom: 1px solid #f0f2f5;
  background: #ffffff;
}
.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.3px;
}
.sidebar-close {
  background: #f1f5f9;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #64748b;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.sidebar-close:hover {
  background: #e2e8f0;
  color: #1e293b;
}
</style>
