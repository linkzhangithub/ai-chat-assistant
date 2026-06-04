import { createRouter, createWebHistory } from 'vue-router'
import WelcomePage from '../components/WelcomePage.vue'
import ChatPage from '../pages/ChatPage.vue'

const routes = [
  {
    path: '/',
    name: 'Welcome',
    component: WelcomePage
  },
  {
    path: '/chat',
    name: 'Chat',
    component: ChatPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
