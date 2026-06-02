<template>
  <div class="textarea-wrapper">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="onInput"
      @keydown.enter="onEnter"
      placeholder="输入消息，点击发送"
      rows="1"
      autocomplete="off"
    ></textarea>
    <button
      class="mic-btn"
      :class="{ active: isListening }"
      @click="toggleVoiceInput"
      v-tooltip="'语音输入'"
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
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from "vue";
import { useXunfeiSpeech } from "../../composables/useXunfeiSpeech";

const props = defineProps({
  modelValue: String,
});
const emit = defineEmits([
  "update:modelValue",
  "send",
  "transcript",
  "listening-change",
]);

const textareaRef = ref(null);
const {
  isListening,
  transcript,
  startListening,
  stopListening,
  clearTranscript,
} = useXunfeiSpeech();

let lastTranscript = "";

watch(isListening, (newVal) => {
  emit("listening-change", newVal);
});

watch(transcript, (newText) => {
  if (isListening.value && newText && newText !== lastTranscript) {
    lastTranscript = newText;
    emit("transcript", newText);
    emit("update:modelValue", newText);
    nextTick(() => autoResize());
  }
});

const toggleVoiceInput = async () => {
  if (isListening.value) {
    stopListening();
  } else {
    await startListening();
  }
};

function resetTranscriptState() {
  lastTranscript = "";
  clearTranscript();
  if (isListening.value) {
    stopListening();
  }
}

function autoResize() {
  const textarea = textareaRef.value;
  if (!textarea) return;
  textarea.style.height = "auto";
  let newHeight = textarea.scrollHeight;
  const maxHeight = 120;
  if (newHeight > maxHeight) {
    textarea.style.height = maxHeight + "px";
    textarea.style.overflowY = "auto";
  } else {
    textarea.style.height = Math.max(newHeight, 80) + "px";
    textarea.style.overflowY = "hidden";
  }
}

function onInput(event) {
  emit("update:modelValue", event.target.value);
  nextTick(() => autoResize());
}

function onEnter(event) {
  if (event.shiftKey) return;
  event.preventDefault();
  emit("send");
}

watch(
  () => props.modelValue,
  () => {
    nextTick(() => autoResize());
  }
);

nextTick(() => autoResize());

defineExpose({ resetTranscriptState });
</script>

<style scoped>
.textarea-wrapper {
  flex: 1;
  position: relative;
  min-width: 0;
}
textarea {
  width: 100%;
  padding: 28px 48px 28px 16px;
  border: none;
  background: rgba(245, 245, 245, 0.8);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  transition: all 0.2s;
  line-height: 1.5;
  box-sizing: border-box;
  overflow-y: hidden;
  min-height: 80px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}
textarea::placeholder {
  color: #9ca3af;
}
.mic-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background 0.2s, color 0.2s;
  z-index: 2;
  box-sizing: border-box;
}
.mic-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #1e293b;
  transform: translateY(-50%);
}
.mic-btn.active {
  color: #007aff;
  background: rgba(0, 122, 255, 0.1);
  transform: translateY(-50%);
}
@media (max-width: 600px) {
  textarea {
    font-size: 1rem;
    min-height: 70px;
    padding: 24px 44px 24px 12px;
  }
  .mic-btn {
    right: 8px;
    width: 28px;
    height: 28px;
  }
}
</style>