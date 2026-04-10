<template>
  <div class="welcome-wrapper">
    <div class="welcome-content">
      <div class="welcome-icon">✨</div>
      <div class="welcome-title">开始对话</div>
      <div class="welcome-sub">输入消息，AI 会在这里回复</div>
    </div>
  </div>
</template>

<style scoped>
.welcome-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.welcome-content {
  text-align: center;
  animation: fadeIn 0.3s ease;
}
.welcome-icon {
  font-size: 56px;
  margin-bottom: 16px;
  opacity: 0.7;
}
.welcome-title {
  font-size: 1.3rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 6px;
}
.welcome-sub {
  font-size: 0.9rem;
  color: #94a3b8;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
