import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "@/pages/HomePage.vue";
import CS2Page from "@/pages/CS2Page.vue";
import MusicPage from "@/pages/MusicPage.vue";
import BasketBallPage from "@/pages/BasketBallPage.vue";
import AnimationPage from "@/pages/AnimationPage.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/cs2',
    name: 'cs2',
    component: CS2Page
  },
  {
    path: '/music',
    name: 'music',
    component: MusicPage
  },
  {
    path: '/animation',
    name: 'animation',
    component: AnimationPage
  },
  {
    path: '/basketball',
    name: 'basketball',
    component: BasketBallPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
