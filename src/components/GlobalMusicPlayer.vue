<script setup>
import { computed, onMounted, ref } from 'vue'
import { useMusicStore } from '@/stores/musicStore'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'

const musicStore = useMusicStore()
const { isPlaying, currentTrackName } = storeToRefs(musicStore)
const playerRef = ref(null)

const isIntroDemo = ref(false)

const handleToggle = () => {
  musicStore.toggle()
}

const formattedTrack = computed(() => {
  if (!currentTrackName.value) return 'SYSTEM_AUDIO'
  return currentTrackName.value.toUpperCase()
})

// === 进场动画逻辑 ===
onMounted(() => {
  const tl = gsap.timeline()
  gsap.set(playerRef.value, { y: 100, autoAlpha: 0 })
  tl.to(playerRef.value, {
    y: 0,
    autoAlpha: 1,
    duration: 1,
    delay: 4.5,
    ease: 'elastic.out(1, 0.7)'
  })
  .call(() => { isIntroDemo.value = true })
  .to({}, { duration: 1.5 })
  .call(() => { isIntroDemo.value = false })
})
</script>

<template>
  <div
    ref="playerRef"
    class="fixed bottom-24 right-10 z-9999 flex flex-col items-end gap-2 mix-blend-difference font-mono opacity-0"
  >

    <div class="text-[10px] text-chic-red tracking-widest opacity-60 mb-1">
      /// AUDIO_OUTPUT
    </div>

    <div class="flex items-center gap-0 group">

      <div
        class="overflow-hidden transition-all duration-500 ease-out bg-black/80 border-y border-l border-white/20 backdrop-blur-md h-12 flex items-center"
        :class="(isPlaying || isIntroDemo) ? 'w-32 px-4 opacity-100' : 'w-0 px-0 opacity-0'"
      >
        <div class="whitespace-nowrap text-xs text-white tracking-wider min-w-max">
          <span class="animate-pulse text-chic-red mr-2">▶</span>
          {{ formattedTrack }}
        </div>
      </div>

      <button
        @click="handleToggle"
        class="relative w-12 h-12 flex items-center justify-center bg-black border border-white/20 hover:border-chic-red hover:bg-chic-red/10 transition-all duration-300"
      >
        <span class="absolute top-0 left-0 w-1 h-1 bg-white transition-colors group-hover:bg-chic-red"></span>
        <span class="absolute top-0 right-0 w-1 h-1 bg-white transition-colors group-hover:bg-chic-red"></span>
        <span class="absolute bottom-0 left-0 w-1 h-1 bg-white transition-colors group-hover:bg-chic-red"></span>
        <span class="absolute bottom-0 right-0 w-1 h-1 bg-white transition-colors group-hover:bg-chic-red"></span>

        <div v-if="isPlaying" class="flex gap-1 items-end h-5">
          <span class="w-1 bg-chic-red animate-music-bar-1"></span>
          <span class="w-1 bg-chic-red animate-music-bar-2"></span>
          <span class="w-1 bg-chic-red animate-music-bar-3"></span>
        </div>

        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white group-hover:text-chic-red transition-colors">
          <path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" />
        </svg>
      </button>

    </div>

  </div>
</template>

<style scoped>
.text-chic-red { color: #CE1141; }
.bg-chic-red { background-color: #CE1141; }
.border-chic-red { border-color: #CE1141; }

@keyframes musicBar {
  0%, 100% { height: 20%; }
  50% { height: 100%; }
}
.animate-music-bar-1 { animation: musicBar 0.6s ease-in-out infinite; }
.animate-music-bar-2 { animation: musicBar 0.6s ease-in-out infinite 0.1s; }
.animate-music-bar-3 { animation: musicBar 0.6s ease-in-out infinite 0.2s; }
</style>
