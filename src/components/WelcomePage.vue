<template>
  <div class="welcome-page">
    <div class="page-content">
      <div class="hero-section">
        <div class="logo-wrapper">
          <svg class="logo-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        
        <h1 class="hero-title">对话助手</h1>
        <p class="hero-subtitle">智能对话，自然交流</p>
        
        <button class="start-btn" @click="start">
          <span>开始体验</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <div class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-name">智能对话</h3>
              <p class="feature-desc">流畅自然的对话体验</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-name">图片理解</h3>
              <p class="feature-desc">智能分析图片内容</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <path d="M12 19a9 9 0 0 1-9-9 9 9 0 0 1 18 0"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-name">语音输入</h3>
              <p class="feature-desc">解放双手，实时听写</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3 class="feature-name">多角色</h3>
              <p class="feature-desc">灵活切换对话角色</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['start']);

function start() {
  localStorage.setItem('hasVisited', 'true');
  emit('start');
}
</script>

<style scoped>
.welcome-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.page-content {
  width: 100%;
  max-width: 960px;
  padding: var(--spacing-xl);
}

.hero-section {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  animation: fadeInUp 0.6s ease-out;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: var(--radius-xl);
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.25);
}

.logo-icon {
  color: white;
}

.hero-title {
  font-size: var(--font-4xl);
  font-weight: 700;
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: var(--font-xl);
  color: var(--neutral-500);
  margin: 0 0 var(--spacing-xl) 0;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  height: 52px;
  padding: 0 32px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  font-size: var(--font-lg);
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(5, 150, 105, 0.3);
  transition: all var(--transition-normal);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(5, 150, 105, 0.4);
}

.start-btn:active {
  transform: translateY(0);
}

.start-btn svg {
  transition: transform var(--transition-fast);
}

.start-btn:hover svg {
  transform: translateX(4px);
}

.features-section {
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

.section-title {
  font-size: var(--font-xl);
  font-weight: 600;
  color: var(--neutral-900);
  text-align: center;
  margin: 0 0 var(--spacing-lg) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.feature-card {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
  transition: transform var(--transition-fast);
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-content {
  flex: 1;
}

.feature-name {
  font-size: var(--font-base);
  font-weight: 600;
  color: var(--neutral-900);
  margin: 0 0 var(--spacing-xs) 0;
}

.feature-desc {
  font-size: var(--font-sm);
  color: var(--neutral-500);
  margin: 0;
  line-height: 1.5;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .page-content {
    padding: var(--spacing-lg);
  }
  
  .hero-title {
    font-size: var(--font-3xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-lg);
  }
  
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
  }
  
  .feature-card {
    padding: var(--spacing-md);
  }
  
  .feature-icon {
    width: 44px;
    height: 44px;
    margin-bottom: var(--spacing-sm);
  }
  
  .feature-name {
    font-size: var(--font-sm);
  }
  
  .feature-desc {
    font-size: var(--font-xs);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: var(--font-2xl);
  }
  
  .start-btn {
    width: 100%;
    max-width: 280px;
  }
}
</style>