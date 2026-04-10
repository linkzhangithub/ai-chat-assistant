import { createApp } from "vue";
import { createPinia } from "pinia";
import "./styles/layout.css";
import "./styles/tooltip.css"; // 新增：导入 tooltip 样式
// import "highlight.js/styles/github.css"; // 浅色主题
import App from "./App.vue";
import tooltip from "./directives/tooltip"; // 新增：导入指令

const app = createApp(App);
app.use(createPinia());
app.directive("tooltip", tooltip); // 新增：注册指令
app.mount("#app");
