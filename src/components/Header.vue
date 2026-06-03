<template>
  <header class="header">
    <div class="header-content">
      <div class="header-left">
        <button class="nav-btn back-btn" @click="$emit('go-home')" title="返回首页">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <button class="nav-btn sidebar-btn" @click="$emit('toggle-sidebar')" title="打开侧边栏">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>
      </div>
      
      <div class="header-center">
        <span class="role-label">当前对话助手为：</span>
        <div class="role-selector" @click="showRoleMenu = !showRoleMenu">
          <div class="role-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <span class="role-name">{{ currentRoleName }}</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
        
        <div v-if="showRoleMenu" class="role-menu">
          <div 
            v-for="role in roles" 
            :key="role.id"
            class="role-option"
            :class="{ active: role.id === modelValue }"
            @click="selectRole(role.id)"
          >
            {{ role.name }}
          </div>
        </div>
      </div>
      
      <div class="header-right">
        <button class="header-btn" @click="$emit('new-chat')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M5 12h14"/>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  roles: { type: Array, required: true },
  modelValue: { type: String, required: true },
});

const emit = defineEmits(['update:modelValue', 'new-chat', 'toggle-sidebar', 'go-home']);

const showRoleMenu = ref(false);

const currentRoleName = computed(() => {
  const role = props.roles.find(r => r.id === props.modelValue);
  return role?.name || '选择角色';
});

function selectRole(roleId) {
  emit('update:modelValue', roleId);
  showRoleMenu.value = false;
}
</script>

<style scoped>
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 100%;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.nav-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--neutral-500);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  box-shadow: none;
  flex-shrink: 0;
}

.nav-btn:hover {
  background: var(--neutral-100);
  color: var(--neutral-700);
  border-color: var(--neutral-300);
}

.nav-btn:active {
  background: var(--neutral-200);
}

.header-center {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
}

.role-label {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--neutral-700);
  white-space: nowrap;
}

.role-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--neutral-100);
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.role-selector:hover {
  background: var(--neutral-200);
}

.role-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: 50%;
  color: white;
}

.role-name {
  font-size: var(--font-sm);
  font-weight: 500;
  color: var(--neutral-700);
}

.chevron {
  color: var(--neutral-500);
  transition: transform var(--transition-fast);
}

.role-selector:hover .chevron {
  transform: rotate(180deg);
}

.role-menu {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  min-width: 160px;
  padding: var(--spacing-xs);
  z-index: 200;
}

.role-option {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: var(--font-sm);
  color: var(--neutral-700);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.role-option:hover {
  background: var(--neutral-100);
}

.role-option.active {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  justify-content: flex-end;
}

.header-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--neutral-500);
  cursor: pointer;
  transition: all var(--transition-fast);
  padding: 0;
  box-shadow: none;
}

.header-btn:hover {
  background: var(--neutral-100);
  color: var(--neutral-700);
  border-color: var(--neutral-300);
}

@media (max-width: 768px) {
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    padding-top: env(safe-area-inset-top, 0px);
    z-index: 1000;
  }
  
  .header-content {
    padding: var(--spacing-md);
    min-height: 56px;
  }
  
  .role-label {
    font-size: var(--font-sm);
    white-space: nowrap;
  }
  
  .role-name {
    max-width: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .nav-btn svg {
    width: 22px;
    height: 22px;
  }
  
  .header-btn {
    width: 40px;
    height: 40px;
  }
  
  .header-btn svg {
    width: 20px;
    height: 20px;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: var(--spacing-sm) var(--spacing-md);
    min-height: 52px;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
  }
  
  .nav-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .role-selector {
    padding: var(--spacing-xs) var(--spacing-sm);
    gap: 6px;
  }
  
  .role-icon {
    width: 24px;
    height: 24px;
  }
  
  .role-icon svg {
    width: 14px;
    height: 14px;
  }
  
  .role-label {
    font-size: 11px;
  }
  
  .role-name {
    max-width: 45px;
    font-size: 11px;
  }
  
  .chevron {
    width: 14px;
    height: 14px;
  }
  
  .header-btn {
    width: 36px;
    height: 36px;
  }
  
  .header-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>