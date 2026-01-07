import { createRouter, createWebHistory } from 'vue-router'
import QRscannerPage from './QRscannerPage.vue'
import homePage from '@/router/homePage.vue'
import PvzPage from './PvzPage.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: homePage
    },
    {
      path: '/qr-scanner/:id',
      name: 'QRscanner',
      component: QRscannerPage
    },
    {
      path: '/pvz-page',
      name: 'pvzPage',
      component: PvzPage,
    }
  ],
})

export default router
