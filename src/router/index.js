import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import SpaceX from '../views/SpaceX.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/spacex/:page_no/:start_date/:end_date/:launch_status',
    name: 'SpaceX',
    component: SpaceX
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
