<template>
  <div class="sidebar-overlay" v-if="visible" @click="close"></div>
  <div class="sidebar" :class="{ open: visible }">
    <SidebarHeader @close="close" />
    <NewChatButton @new-chat="createNewChat" />
    <div class="conversation-list">
      <ConversationGroup
        title="今天"
        :conversations="grouped.today"
        :currentId="currentId"
        @select="selectChat"
        @delete="requestDeleteChat"
      />
      <ConversationGroup
        title="昨天"
        :conversations="grouped.yesterday"
        :currentId="currentId"
        @select="selectChat"
        @delete="requestDeleteChat"
      />
      <ConversationGroup
        title="7天内"
        :conversations="grouped.week"
        :currentId="currentId"
        @select="selectChat"
        @delete="requestDeleteChat"
      />
      <ConversationGroup
        title="30天内"
        :conversations="grouped.month"
        :currentId="currentId"
        @select="selectChat"
        @delete="requestDeleteChat"
      />
      <ConversationGroup
        title="更早"
        :conversations="grouped.older"
        :currentId="currentId"
        @select="selectChat"
        @delete="requestDeleteChat"
      />
      <div v-if="totalCount === 0" class="empty-conversations">
        暂无历史对话
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <ConfirmDialog
      v-model:visible="showDeleteDialog"
      title="删除对话"
      message="确定要删除这个对话吗？此操作不可撤销。"
      confirm-text="删除"
      cancel-text="取消"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import SidebarHeader from "./sidebar/SidebarHeader.vue";
import NewChatButton from "./sidebar/NewChatButton.vue";
import ConversationGroup from "./sidebar/ConversationGroup.vue";
import ConfirmDialog from "./common/ConfirmDialog.vue";

const props = defineProps({
  visible: Boolean,
  conversations: Array,
  currentId: String,
});
const emit = defineEmits(["update:visible", "select", "delete", "new-chat"]);

// 删除确认弹窗状态
const showDeleteDialog = ref(false);
const pendingDeleteId = ref(null);

// 按时间分组对话
const grouped = computed(() => {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterdayStart = todayStart - 24 * 3600 * 1000;
  const weekAgo = todayStart - 7 * 24 * 3600 * 1000;
  const monthAgo = todayStart - 30 * 24 * 3600 * 1000;
  const groups = { today: [], yesterday: [], week: [], month: [], older: [] };
  (props.conversations || []).forEach((conv) => {
    const ts = conv.timestamp;
    if (ts >= todayStart) groups.today.push(conv);
    else if (ts >= yesterdayStart) groups.yesterday.push(conv);
    else if (ts >= weekAgo) groups.week.push(conv);
    else if (ts >= monthAgo) groups.month.push(conv);
    else groups.older.push(conv);
  });
  return groups;
});

const totalCount = computed(() => props.conversations?.length || 0);

function createNewChat() {
  emit("new-chat");
  close();
}

function selectChat(id) {
  emit("select", id);
  close();
}

// 请求删除对话：打开确认弹窗，记录待删除的对话 ID
function requestDeleteChat(id) {
  pendingDeleteId.value = id;
  showDeleteDialog.value = true;
}

// 确认删除：真正执行删除操作
function confirmDelete() {
  if (pendingDeleteId.value !== null) {
    emit("delete", pendingDeleteId.value);
    pendingDeleteId.value = null;
  }
  showDeleteDialog.value = false;
}

function close() {
  emit("update:visible", false);
}
</script>

<style scoped>
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;
}
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 100%;
  background: #ffffff;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.08);
  z-index: 1001;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0 16px 16px 0;
}
.sidebar.open {
  transform: translateX(0);
}
.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 12px 20px;
}
.empty-conversations {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  font-size: 0.85rem;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
