<script setup>
  import { onMounted , ref , provide , watch } from 'vue'
  import { useRouter } from 'vue-router'
  import Lenis from '@studio-freight/lenis'
  import CustomCursor from './components/CustomCursor.vue'
  import GlobalMusicPlayer from './components/GlobalMusicPlayer.vue'
  import Loader from '@/components/LoaderView.vue'

  const router = useRouter()
  let homeScrollPosition = 0
  const isLoading = ref(true)
  const showLoader = ref(true)
  const handleLoadingComplete = () => {
    showLoader.value = false
  }

  watch(isLoading, (newVal) => {
    if (newVal === true) showLoader.value = true
  })

  provide('isGlobalLoading', isLoading)

  onMounted(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    router.beforeEach((to, from, next) => {
      if (from.name === 'Home') {
        homeScrollPosition = lenis.scroll
      }
      next()
    })
    router.afterEach((to) => {
      if (to.name === 'Home') {
        lenis.scrollTo(homeScrollPosition, { immediate: true })
      } else {
        lenis.scrollTo(0, { immediate: true })
      }
    })
    setTimeout(() => {
      isLoading.value = false
    }, 3000)
  })
</script>

<template>
  <Loader
    v-if="showLoader"
    :is-loading="isLoading"
    @loading-complete="handleLoadingComplete"
  />
  <div class="cursor-none">
    <router-view />
    <CustomCursor />
    <GlobalMusicPlayer />
  </div>
</template>

<style scoped></style>
