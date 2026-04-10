<!-- src/components/sidebar/ConversationItem.vue -->
<template>
  <div
    :class="['conversation-item', { active: isActive }]"
    @click="$emit('select', conversation.id)"
  >
    <span class="conv-title">{{ conversation.title }}</span>
    <button
      class="conv-delete"
      v-tooltip="'删除对话'"
      @click.stop="$emit('delete', conversation.id)"
    >
      删除
    </button>
  </div>
</template>

<script setup>
defineProps({
  conversation: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["select", "delete"]);
</script>

<style scoped>
.conversation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  margin-bottom: 4px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  background: #ffffff;
  border: 1px solid #f0f2f5;
}
.conversation-item:hover {
  background: #f8fafc;
  border-color: #e2e8f0;
}
.conversation-item.active {
  background: #eef2ff;
  border-color: #c7d2fe;
}
.conv-title {
  font-size: 0.8rem;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 12px;
  font-weight: 500;
}
.conversation-item.active .conv-title {
  color: #4f46e5;
  font-weight: 600;
}
.conv-delete {
  background: none;
  border: none;
  font-size: 0.7rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  font-weight: 400;
}
.conv-delete:hover {
  background: #fee2e2;
  color: #ef4444;
}
</style>
