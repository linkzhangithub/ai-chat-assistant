# AI 对话助手

挑战三天时间手搓一个 AI 对话助手。全程用 DeepSeek 辅助开发，通过提示词交互快速完成功能迭代和代码优化。代码按组件拆分，状态和逻辑分离，整体干净、易维护。

🔗 **在线体验**：[https://link2ai.online](https://link2ai.online)

## 功能
- 流式 AI 对话（智谱 glm-4-flash，逐字输出）
- 图片理解（glm-4v-flash，上传即分析）
- 语音输入（讯飞实时语音转文字）
- 多角色切换（智能助手 / 前端面试官 / 心理导师 / 贴吧老哥）
- 对话历史管理（侧边栏自动分组、新建、删除）

## 技术栈
- **前端**：Vue 3 + Pinia + Vite + 组合式 API  
  Markdown 渲染 (markdown-it) + 代码高亮 (highlight.js)  
  自定义 tooltip 指令、组件化模块拆分
- **后端**：Node.js + Express
- **API**：智谱 GLM-4 系列、讯飞语音听写
- **部署**：腾讯云 EdgeOne Pages + 自定义域名

## 本地运行
git clone https://github.com/linkzhangithub/ai-chat-assistant.git
cd ai-chat-assistant
npm install
# 配置 .env（ZHIPU_API_KEY、XUNFEI_APP_ID 等）
node server.js          # 后端
npm run dev             # 前端

## 说明
纯个人练习作品，展示 AIGC 前端开发能力
代码按功能模块拆分（输入区、聊天区、侧边栏、历史管理等），业务逻辑抽离到 composables