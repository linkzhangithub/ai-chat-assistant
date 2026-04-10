// 讯飞语音识别模块（基于 XfVoiceDictation）
import { ref } from "vue";
import { XfVoiceDictation } from "@muguilin/xf-voice-dictation";

export function useXunfeiSpeech() {
  const isListening = ref(false);
  const transcript = ref("");
  let xfVoice = null;

  const startListening = () => {
    if (isListening.value) return;

    const APPID = import.meta.env.VITE_XUNFEI_APP_ID;
    const APISecret = import.meta.env.VITE_XUNFEI_API_SECRET;
    const APIKey = import.meta.env.VITE_XUNFEI_API_KEY;

    if (!APPID || !APISecret || !APIKey) {
      console.error("讯飞配置缺失，请检查环境变量");
      alert("语音识别服务配置错误");
      return;
    }

    xfVoice = new XfVoiceDictation({
      APPID,
      APISecret,
      APIKey,
      onTextChange: (text) => {
        transcript.value = text;
      },
      onError: (error) => {
        console.error("讯飞识别错误:", error);
        stopListening();
      },
      onWillStatusChange: (oldStatus, newStatus) => {
        isListening.value = newStatus === "ing";
      },
    });

    xfVoice.start();
    isListening.value = true;
    transcript.value = "";
  };

  const stopListening = () => {
    if (xfVoice) {
      xfVoice.stop();
      xfVoice = null;
    }
    isListening.value = false;
  };

  // 清空识别结果（发送后调用）
  const clearTranscript = () => {
    transcript.value = "";
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
  };
}
