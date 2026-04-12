import { createRouter, createWebHistory } from 'vue-router'

import ArchiveView from '../views/ArchiveView.vue'
import CreateRecordView from '../views/CreateRecordView.vue'
import HomeView from '../views/HomeView.vue'
import VerifyRecordView from '../views/VerifyRecordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateRecordView,
    },
    {
      path: '/archive',
      name: 'archive',
      component: ArchiveView,
    },
    {
      path: '/verify/:id',
      name: 'verify',
      component: VerifyRecordView,
      props: true,
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
