<script setup>
import { onMounted, nextTick } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import HomeHero from '@/views/Home/HomeHero.vue'
import HomeHobbies from '@/views/Home/HomeHobbies.vue'
import HomeTech from '@/views/Home/HomeTech.vue'
import HomeProjects from '@/views/Home/HomeProjects.vue'
import HomeNotes from '@/views/Home/HomeNotes.vue'

const SCROLL_KEY = 'HomePage_ScrollY'
onMounted(() => {
  const savedPosition = sessionStorage.getItem(SCROLL_KEY)
  if (savedPosition) {
    nextTick(() => {
      window.scrollTo({
        top: parseInt(savedPosition),
        behavior: 'instant'
      })
    })
  }
})

onBeforeRouteLeave((to, from, next) => {
  sessionStorage.setItem(SCROLL_KEY, window.scrollY)
  next()
})
</script>

<template>
  <div class="min-h-screen w-full bg-black text-white overflow-x-hidden">

    <!-- 第一屏 -->
    <div class="snap-start">
      <HomeHero />
    </div>

    <!-- 第二屏 -->
    <div class="snap-start">
      <HomeHobbies />
    </div>

    <!-- 第三屏 -->
    <div class="snap-start">
      <HomeTech />
    </div>

    <!-- 第四屏 -->
    <div class="snap-start">
      <HomeProjects />
    </div>

    <!-- 第五屏 -->
    <div class="snap-start">
      <HomeNotes />
    </div>

  </div>
</template>
