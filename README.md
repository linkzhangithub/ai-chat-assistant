# AI 对话助手

挑战三天时间手搓一个 多角色、多模态、语音输入的智能对话应用，支持图片理解、流式对话、对话历史管理，并集成 AI 智能标题生成。全程用 DeepSeek 辅助开发，通过提示词交互快速完成功能迭代和代码优化。代码按组件拆分，状态和逻辑分离，整体干净、易维护。

🔗 **在线体验**：[https://ai.link2ai.online](https://ai.link2ai.online)

## ✨ 核心功能
- 💬 **多角色切换**：内置智能助手、前端面试官、心理导师、贴吧老哥
- 🖼️ **图片理解**：上传图片，AI 帮你分析内容（基于智谱 GLM-4V-Flash）
- 🎙️ **语音输入**：讯飞实时语音听写，点击麦克风即可说话转文字，并伴有波浪动画提示
- 📚 **对话历史**：自动保存至 localStorage，支持侧边栏分组管理（今天/昨天/7天内等）
- ✨ **AI 智能标题**：对话自动生成摘要标题（先截取后 AI 优化），侧边栏清晰展示
- 🆕 **新建对话**：一键开始全新对话，同时保留历史记录
- 🎨 **首次访问欢迎页**：介绍项目亮点，提升首次体验
- 🌐 **响应式布局**：完美适配 PC 和移动端

## 🛠️ 技术栈

- **前端**：Vue 3 + Pinia + Vite + 组合式 API
- **UI**：Markdown-it + Highlight.js + 自定义 CSS
- **后端**：Node.js + Express（本地开发）；EdgeOne Pages 云函数（线上）
- **AI 服务**：智谱 AI（glm-4-flash 文本、glm-4v-flash 视觉）
- **语音识别**：讯飞实时语音听写（WebSocket）
- **部署**：腾讯云 EdgeOne Pages + 自定义域名 ai.link2ai.online

## 本地运行

### 1. 克隆项目
```
git clone https://github.com/linkzhangithub/ai-chat-assistant.git
cd ai-chat-assistant
```
### 2. 安装依赖
```
npm install
```
### 3. 在项目根目录创建 .env 文件，并填入以下环境变量（请替换为真实值）：
```
ZHIPU_API_KEY=你的智谱API Key
XUNFEI_APP_ID=你的讯飞AppID
...
```
### 4. 启动本地后端和前端开发服务器：
```
node server.js          # 后端
npm run dev             # 前端
```

## 说明
纯个人练习作品，展示 AIGC 前端开发能力
代码按功能模块拆分（输入区、聊天区、侧边栏、历史管理等），业务逻辑抽离到 composables
新增 AI 智能标题、语音提示条、欢迎页等交互细节，持续迭代优化。