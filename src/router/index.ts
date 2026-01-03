import { createRouter, createWebHistory } from 'vue-router'
import QRscanner from '@/router/QRscanner.vue'
import home from '@/router/home.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: home
    },
    {
      path: '/qr-scanner',
      name: 'QRscanner',
      component: QRscanner
    }
  ],
})

export default router
