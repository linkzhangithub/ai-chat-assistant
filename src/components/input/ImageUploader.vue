<template>
  <button
    class="image-upload-btn"
    v-tooltip="'上传图片'"
    @click="triggerUpload"
    :disabled="isUploading"
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
      <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="10.5" r="2.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  </button>

  <div v-if="imagePreviewUrl" class="image-bubble">
    <div class="bubble-content">
      <img :src="imagePreviewUrl" alt="预览" class="bubble-img" />
      <div class="bubble-text">想识别的图片</div>
    </div>
    <button class="bubble-close" @click="removeImage">✕</button>
  </div>

  <input
    type="file"
    ref="fileInput"
    accept="image/*"
    style="display: none"
    @change="handleFileSelect"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import { useImageUpload } from "../../composables/useImageUpload";

const emit = defineEmits(["update:image"]);

const fileInput = ref(null);
const {
  imagePreviewUrl,
  pendingImageData,
  isUploading,
  uploadImage,
  removeImage: removeLocalImage,
  resetImage,
} = useImageUpload();

watch(pendingImageData, (newVal) => {
  emit("update:image", newVal);
});

function triggerUpload() {
  fileInput.value.click();
}

async function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  await uploadImage(file);
  if (fileInput.value) fileInput.value.value = "";
}

function removeImage() {
  removeLocalImage();
}

defineExpose({ resetImage });
</script>

<style scoped>
.image-upload-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 24px;
  flex-shrink: 0;
}
.image-upload-btn:hover:not(:disabled) {
  color: #1e293b;
}
.image-upload-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.image-bubble {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  border: 1px solid #e2e8f0;
  max-width: 200px;
}
.bubble-content {
  display: flex;
  align-items: center;
  gap: 8px;
}
.bubble-img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
}
.bubble-text {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}
.bubble-close {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 16px;
  padding: 0;
  margin: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.bubble-close:hover {
  background: #f1f5f9;
  color: #ef4444;
}
@media (max-width: 600px) {
  .image-upload-btn {
    width: 40px;
    height: 40px;
  }
  .image-bubble {
    left: 4px;
    max-width: 180px;
    padding: 6px 10px;
  }
  .bubble-img {
    width: 32px;
    height: 32px;
  }
  .bubble-text {
    font-size: 10px;
    white-space: normal;
  }
}
</style>
