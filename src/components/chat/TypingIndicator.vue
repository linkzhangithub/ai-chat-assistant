<template>
  <div class="typing-wrapper">
    <div class="typing-indicator">
      <span class="typing-text">思考中</span>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    </div>
  </div>
</template>

<style scoped>
.typing-wrapper {
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-left: 4px; /* 与 AI 消息气泡左对齐 */
}
.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f3f5;
  border-radius: 24px; /* 完整圆角，无小尖角 */
  width: fit-content;
}
.typing-text {
  font-size: 0.8rem;
  color: #64748b;
}
.typing-dots {
  display: flex;
  gap: 4px;
}
.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #94a3b8;
  animation: bounce 1.4s infinite ease-in-out both;
}
.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}
.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}
@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
