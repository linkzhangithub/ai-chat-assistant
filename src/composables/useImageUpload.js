// 图片上传与压缩模块
import { ref } from "vue";

export function useImageUpload() {
  const imagePreviewUrl = ref("");
  const pendingImageData = ref(null);
  const isUploading = ref(false);

  // 压缩图片（最大边长 800px，体积 ≤ 500KB）
  const compressImageFile = (file, maxSizeKB = 500) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 800;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = (height * maxDim) / width;
              width = maxDim;
            } else {
              width = (width * maxDim) / height;
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          let quality = 0.8;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > maxSizeKB * 1024 && quality > 0.1) {
            quality -= 0.1;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // 上传图片（压缩并预览）
  const uploadImage = async (file) => {
    if (!file) return false;
    if (file.size > 5 * 1024 * 1024) {
      alert("图片大小不能超过5MB");
      return false;
    }
    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviewUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);

    isUploading.value = true;
    try {
      const base64 = await compressImageFile(file, 500);
      pendingImageData.value = base64;
      return true;
    } catch (err) {
      console.error("压缩图片失败:", err);
      pendingImageData.value = null;
      imagePreviewUrl.value = "";
      return false;
    } finally {
      isUploading.value = false;
    }
  };

  const removeImage = () => {
    imagePreviewUrl.value = "";
    pendingImageData.value = null;
  };

  const resetImage = () => {
    imagePreviewUrl.value = "";
    pendingImageData.value = null;
    isUploading.value = false;
  };

  return {
    imagePreviewUrl,
    pendingImageData,
    isUploading,
    uploadImage,
    removeImage,
    resetImage,
  };
}
