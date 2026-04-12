<template>
  <div class="welcome-page">
    <div class="welcome-card">
      <h1>🤖 AI 对话助手</h1>
      <p>多角色、多模态、语音输入，尽在指尖</p>
      <ul class="feature-list">
        <li>✨ 智能对话：基于智谱 AI，流式输出</li>
        <li>🖼️ 图片理解：上传图片，AI 帮你分析</li>
        <li>🎙️ 语音输入：讯飞实时听写，解放双手</li>
        <li>💬 多角色切换：前端面试官、心理导师等</li>
        <li>📚 对话历史：自动保存，侧边栏管理</li>
      </ul>
      <button class="start-btn" @click="start">开始体验</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["start"]);
function start() {
  localStorage.setItem("hasVisited", "true");
  emit("start");
}
</script>

<style scoped>
.welcome-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.welcome-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  padding: 40px;
  max-width: 500px;
  width: 85%;
  text-align: center;
  box-shadow: 0 20px 35px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}
h1 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 12px;
}
p {
  color: #64748b;
  margin-bottom: 24px;
}
.feature-list {
  text-align: left;
  list-style: none;
  padding: 0;
  margin: 16px auto 32px auto;
  width: fit-content;
}
.feature-list li {
  margin: 12px 0;
  color: #334155;
  font-size: 0.95rem;
}
.start-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 40px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}
.start-btn:hover {
  background: #5a67d8;
  transform: scale(1.02);
}
@media (max-width: 600px) {
  .welcome-card {
    padding: 24px;
  }
  h1 {
    font-size: 1.5rem;
  }
  .feature-list {
    margin: 8px auto 24px auto;
  }
}
</style>
