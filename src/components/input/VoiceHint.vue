<template>
  <transition name="fade-slide">
    <div v-if="visible" class="voice-hint">
      <span class="hint-text">
        <span
          v-for="(char, idx) in chars"
          :key="idx"
          class="wave-char"
          :style="{ animationDelay: `${idx * 0.05}s` }"
          >{{ char }}</span
        >
      </span>
    </div>
  </transition>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  visible: Boolean,
});

const message = "🎙️ 正在语音转文字...";
const chars = computed(() => Array.from(message));
</script>

<style scoped>
.voice-hint {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  color: white;
  padding: 8px 16px;
  border-radius: 40px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
.hint-text {
  display: flex;
  align-items: center;
  gap: 0;
}
.wave-char {
  display: inline-block;
  animation: waveChar 0.8s ease-in-out infinite;
}
@keyframes waveChar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
@media (max-width: 600px) {
  .voice-hint {
    font-size: 0.75rem;
    padding: 6px 12px;
  }
}
</style>
