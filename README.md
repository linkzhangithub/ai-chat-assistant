# AI 对话助手

挑战三天时间手搓一个多角色、多模态、语音输入的智能对话应用，支持图片理解、流式对话、对话历史管理，并集成 AI 智能标题生成。全程用 DeepSeek 辅助开发，通过提示词交互快速完成功能迭代和代码优化。代码按组件拆分，状态和逻辑分离，整体干净、易维护。

🔗 **在线体验**：[https://ai.link2ai.online](https://ai.link2ai.online)

## ✨ 核心功能

- 💬 **多角色切换**：内置智能助手、前端面试官、心理导师、贴吧老哥
- 🖼️ **图片理解**：上传图片，AI 帮你分析内容（基于智谱 GLM-4V-Flash）
- 🎙️ **语音输入**：讯飞实时语音听写，点击麦克风即可说话转文字，并伴有波浪动画提示
- 📚 **对话历史**：自动保存至 localStorage，支持侧边栏分组管理（今天/昨天/7天内等）
- ✨ **AI 智能标题**：对话自动生成摘要标题（先截取后 AI 优化），侧边栏清晰展示
- 🆕 **新建对话**：一键开始全新对话，同时保留历史记录
- 🎨 **首次访问欢迎页**：介绍项目亮点，提升首次体验
- 🌐 **响应式布局**：完美适配 PC 和移动端，移动端也能清晰显示角色信息

## 🛠️ 技术栈

- **前端**：Vue 3 + Pinia + Vite + 组合式 API
- **UI**：Markdown-it + Highlight.js + 自定义 CSS 变量系统
- **后端**：Node.js + Express（本地开发）；EdgeOne Pages 云函数（线上）
- **AI 服务**：智谱 AI（glm-4-flash 文本、glm-4v-flash 视觉）
- **语音识别**：讯飞实时语音听写（WebSocket）
- **部署**：腾讯云 EdgeOne Pages + 自定义域名 ai.link2ai.online

## 📁 项目结构

```
src/
├── components/           # Vue 组件
│   ├── chat/            # 聊天相关组件
│   │   ├── ChatArea.vue      # 聊天区域
│   │   ├── ChatMessage.vue   # 消息气泡
│   │   ├── MessageContent.vue # 消息内容（支持Markdown）
│   │   ├── TypingIndicator.vue # 输入指示器
│   │   └── WelcomeScreen.vue  # 空对话欢迎页
│   ├── input/           # 输入相关组件
│   │   ├── ImageUploader.vue  # 图片上传
│   │   ├── SendButton.vue     # 发送按钮
│   │   ├── TextInput.vue      # 文本输入框
│   │   └── VoiceHint.vue      # 语音提示条
│   ├── sidebar/         # 侧边栏组件
│   │   ├── ConversationGroup.vue  # 对话分组
│   │   ├── ConversationItem.vue   # 对话项
│   │   ├── NewChatButton.vue      # 新建对话按钮
│   │   └── SidebarHeader.vue      # 侧边栏头部
│   ├── common/          # 通用组件
│   │   └── ConfirmDialog.vue  # 确认弹窗
│   ├── Header.vue       # 顶部导航
│   ├── InputArea.vue    # 输入区域容器
│   ├── Sidebar.vue      # 侧边栏容器
│   └── WelcomePage.vue  # 首次访问欢迎页
├── composables/         # 组合式函数
│   ├── useAIChat.js     # AI 聊天逻辑
│   ├── useConversations.js  # 对话历史管理
│   ├── useImageUpload.js    # 图片上传处理
│   └── useXunfeiSpeech.js   # 讯飞语音识别
├── stores/              # Pinia 状态管理
│   └── chat.js          # 聊天状态
├── api/                 # 前端 API 调用
│   └── chat.js          # AI 接口封装
├── constants/           # 常量定义
│   └── roles.js         # 角色配置
├── directives/          # 自定义指令
│   └── tooltip.js       # 悬浮提示
└── styles/              # 全局样式
    ├── layout.css       # 布局样式
    ├── tooltip.css      # 提示样式
    └── variables.css    # CSS 变量系统
```

## 本地运行

### 1. 克隆项目
```bash
git clone https://github.com/linkzhangithub/ai-chat-assistant.git
cd ai-chat-assistant
```

### 2. 安装依赖
```bash
npm install
```

### 3. 在项目根目录创建 `.env` 文件，并填入以下环境变量（请替换为真实值）：
```env
ZHIPU_API_KEY=你的智谱API Key
VITE_XUNFEI_APP_ID=你的讯飞AppID
VITE_XUNFEI_API_KEY=你的讯飞API Key
VITE_XUNFEI_API_SECRET=你的讯飞API Secret
```

**注意**：`ZHIPU_API_KEY` 用于后端（无前缀）；`VITE_` 开头的变量供前端开发服务器使用（语音识别）。

### 4. 启动本地后端和前端开发服务器：
```bash
node server.js          # 后端（端口 3000）
npm run dev             # 前端（端口 5173）
```

## 🔄 部署说明

### 本地开发
- 前端开发服务器：`npm run dev`
- 后端代理服务器：`node server.js`

### 线上部署（腾讯云 EdgeOne Pages）
项目已配置支持 EdgeOne Pages 云函数部署，主要文件：
- `node-functions/api/`：云函数代码
- 构建产物 `dist/` 目录部署到静态资源

## ✅ 更新日志

### v1.0.0
- 完成基础功能开发
- 支持多角色切换、图片理解、语音输入
- 响应式布局适配

### 近期优化
- 优化移动端 Header 显示，保留角色标签和名称
- 修复语音按钮 hover 位移问题
- 输入框 placeholder 垂直居中
- 调整 Header 按钮位置（返回按钮在左，侧边栏按钮在右）

## 📝 说明

纯个人练习作品，展示 AIGC 前端开发能力。代码按功能模块拆分（输入区、聊天区、侧边栏、历史管理等），业务逻辑抽离到 composables，便于维护和扩展。