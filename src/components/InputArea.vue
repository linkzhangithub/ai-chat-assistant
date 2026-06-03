<template>
  <div class="input-wrapper">
    <VoiceHint :visible="isListening" />
    <div class="input-area">
      <ImageUploader ref="imageUploaderRef" @update:image="handleImageUpdate" />
      <TextInput
        ref="textInputRef"
        v-model="localText"
        @send="send"
        @transcript="handleTranscript"
        @listening-change="handleListeningChange"
      />
      <SendButton
        :disabled="disabled || (!localText.trim() && !pendingImageData)"
        @click="send"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ImageUploader from "./input/ImageUploader.vue";
import TextInput from "./input/TextInput.vue";
import SendButton from "./input/SendButton.vue";
import VoiceHint from "./input/VoiceHint.vue";

const props = defineProps({
  disabled: Boolean,
});
const emit = defineEmits(["send", "send-image"]);

const localText = ref("");
const imageUploaderRef = ref(null);
const textInputRef = ref(null);
const pendingImageData = ref(null);
const isListening = ref(false);

function handleListeningChange(val) {
  isListening.value = val;
}

function handleImageUpdate(data) {
  pendingImageData.value = data;
}

let lastTranscript = "";
function handleTranscript(newText) {
  if (newText && newText !== lastTranscript) {
    lastTranscript = newText;
    localText.value = newText;
  }
}

function send() {
  const text = localText.value.trim();
  if ((!text && !pendingImageData.value) || props.disabled) return;
  if (pendingImageData.value) {
    emit("send-image", { image: pendingImageData.value, text: text || "" });
    imageUploaderRef.value?.resetImage();
    pendingImageData.value = null;
    localText.value = "";
  } else {
    emit("send", text);
    localText.value = "";
  }
  textInputRef.value?.resetTranscriptState();
  lastTranscript = "";
}
</script>

<style scoped>
.input-wrapper {
  flex-shrink: 0;
  background: white;
  border-top: 1px solid #eaeef2;
  padding: 0.75rem 1.5rem;
  position: relative;
}
.input-area {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  position: relative;
}
</style>