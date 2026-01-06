import { createRouter, createWebHistory } from 'vue-router'
import QRscannerPage from './QRscannerPage.vue'
import homePage from './homePage.vue'
import selectTaskPage from './selectTaskPage.vue'
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
      path: '/qr-scanner/:taskType',
      name: 'QRscanner',
      component: QRscannerPage
    },
    {
      path: '/select-task',
      name: 'SelectTask',
      component: selectTaskPage,
    },
    {
      path: '/pvz-page/:taskType',
      name: 'pvzPage',
      component: PvzPage,
    }
  ],
})

export default router
