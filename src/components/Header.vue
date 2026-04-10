<template>
  <header>
    <div class="header-left">
      <button
        class="menu-btn"
        v-tooltip="'菜单'"
        @click="$emit('toggle-sidebar')"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div class="logo">🤖 AI 当前角色为：</div>
      <div class="role-dropdown">
        <button class="role-btn" @click.stop="toggleDropdown">
          {{ currentRoleName }}
          <span class="arrow" :class="{ rotated: showDropdown }">▼</span>
        </button>
        <transition name="dropdown">
          <div v-if="showDropdown" class="dropdown-menu">
            <div
              v-for="role in roles"
              :key="role.id"
              :class="['dropdown-item', { active: role.id === modelValue }]"
              @click="selectRole(role.id)"
            >
              {{ role.name }}
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="header-right">
      <button class="clear-btn" v-tooltip="'清空对话'" @click="$emit('clear')">
        清空
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: String,
  roles: Array,
});
const emit = defineEmits(["update:modelValue", "clear", "toggle-sidebar"]);

const showDropdown = ref(false);

const currentRoleName = computed(() => {
  const role = props.roles.find((r) => r.id === props.modelValue);
  return role ? role.name : "选择角色";
});

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectRole(roleId) {
  emit("update:modelValue", roleId);
  showDropdown.value = false;
}

// 点击外部关闭下拉菜单
window.addEventListener("click", (e) => {
  if (!e.target.closest(".role-dropdown")) {
    showDropdown.value = false;
  }
});
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: #ffffff;
  border-bottom: 1px solid #eaeef2;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.header-right {
  display: flex;
  align-items: center;
}
.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}
.logo {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
}
.role-dropdown {
  position: relative;
}
.role-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 24px;
  font-size: 0.85rem;
  color: #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}
.role-btn:hover {
  background: #e2e8f0;
}
.role-btn:active {
  transform: scale(0.96);
}
.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
  font-size: 0.7rem;
  line-height: 1;
  color: #64748b;
}
.arrow.rotated {
  transform: rotate(180deg);
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 100%;
  width: max-content;
  z-index: 100;
  overflow: hidden;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.dropdown-item {
  padding: 8px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  background: #f1f5f9;
  color: #1e293b;
  transition: background 0.1s;
}
.dropdown-item:hover {
  background: #e2e8f0;
}
.dropdown-item.active {
  background: #e6f0ff;
  color: #007aff;
}
.clear-btn {
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 24px;
  transition: all 0.2s;
}
.clear-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}
@media (max-width: 600px) {
  header {
    padding: 12px 16px;
  }
  .menu-btn svg {
    width: 18px;
    height: 18px;
  }
  .logo {
    font-size: 0.9rem;
  }
  .role-btn {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
  .clear-btn {
    font-size: 0.75rem;
    padding: 4px 10px;
  }
  .header-left {
    gap: 12px;
  }
}
</style>
