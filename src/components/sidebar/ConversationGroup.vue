<!-- src/components/sidebar/ConversationGroup.vue -->
<template>
  <div v-if="conversations.length" class="conversation-group">
    <div class="group-title">{{ title }}</div>
    <ConversationItem
      v-for="conv in conversations"
      :key="conv.id"
      :conversation="conv"
      :is-active="conv.id === currentId"
      @select="$emit('select', $event)"
      @delete="$emit('delete', $event)"
    />
  </div>
</template>

<script setup>
import ConversationItem from "./ConversationItem.vue";

defineProps({
  title: String,
  conversations: Array,
  currentId: String,
});
defineEmits(["select", "delete"]);
</script>

<style scoped>
.conversation-group {
  margin-bottom: 16px;
}
.group-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 12px 4px;
}
</style>
