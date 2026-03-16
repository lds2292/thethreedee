import { createRouter, createWebHistory } from 'vue-router'
import HeroPage from '../pages/HeroPage.vue'
import ViewerPage from '../pages/ViewerPage.vue'
import GalleryPage from '../pages/GalleryPage.vue'

const routes = [
  { path: '/', component: HeroPage },
  { path: '/gallery', component: GalleryPage },
  { path: '/viewer', component: ViewerPage },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})