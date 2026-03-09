<script setup>
import { onMounted, ref, watch, nextTick } from 'vue'
import gsap from 'gsap'
import LogoSvg from '@/assets/img/Gu_uccy.svg?component'

const props = defineProps({
  isLoading: { type: Boolean, default: true },
})
const emits = defineEmits(['loading-complete'])
const svgContainerRef = ref(null)
const svgRef = ref(null)
const progressValue = ref(0)
let tl = null

const preparePath = (pathElement) => {
  if (!pathElement) return
  const length = pathElement.getTotalLength()
  gsap.set(pathElement, {
    strokeDasharray: length,
    strokeDashoffset: length,
    fill: 'transparent',
    stroke: '#CE1141',
    strokeWidth: 1.5,
    autoAlpha: 1,
  })
}

onMounted(async () => {
  await nextTick()
  const paths = svgRef.value.$el.querySelectorAll('path')
  paths.forEach(preparePath)

  gsap.set(svgContainerRef.value, {
    transformOrigin: 'center center',
    rotationY: 0,
    scale: 0.8,
  })
  gsap.set('.ui-reveal', { yPercent: 100, autoAlpha: 0 })
  gsap.set('.progress-line', { scaleX: 0, transformOrigin: 'left center' })
  gsap.set('.logo-glow', { autoAlpha: 0, scale: 0.5 })

  tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      if (props.isLoading) startBreathing()
    },
  })
  tl.to('.logo-glow', { autoAlpha: 0.6, scale: 1, duration: 2, ease: 'expo.out' }, 0)
  tl.to(
    paths,
    {
      strokeDashoffset: 0,
      duration: 5,
      ease: 'power1.inOut',
      stagger: 0.05,
    },
    0,
  )
  tl.to('.progress-line', { scaleX: 1, duration: 3.2, ease: 'power2.inOut' }, 0)
  tl.to(progressValue, { value: 100, duration: 3.2, ease: 'linear', roundProps: 'value' }, 0)
  tl.to('.ui-reveal', { yPercent: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 }, 0.5)
  tl.to(
    paths,
    {
      fill: '#CE1141',
      duration: 1,
      ease: 'power2.out',
    },
    1,
  )
  tl.to(
    '.spin-ring',
    {
      autoAlpha: 0,
      scale: 1.2,
      duration: 0.8,
      ease: 'power2.out',
    },
    2.0,
  )
  tl.to(
    svgContainerRef.value,
    {
      rotationY: 360,
      scale: 1.4,
      duration: 2,
      ease: 'power2.inOut',
    },
    1.2,
  )
  tl.to(paths, { stroke: 'transparent', duration: 1 }, 2.7)
})

const startBreathing = () => {
  if (!svgContainerRef.value) return
  gsap.to(svgContainerRef.value, {
    scale: 1.5,
    rotationY: 360 + 5,
    rotationX: 5,
    filter: 'drop-shadow(0 15px 40px rgba(206,17,65,0.6))',
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

watch(
  () => props.isLoading,
  (newVal) => {
    if (newVal === false) {
      if (tl) tl.kill()
      gsap.killTweensOf(svgContainerRef.value)
      const exitTl = gsap.timeline({ onComplete: () => emits('loading-complete') })
      exitTl.to(['.ui-container', '.progress-bg', '.spin-ring', '.logo-glow'], {
        autoAlpha: 0,
        duration: 0.3,
        y: 10,
      })
      exitTl.to(
        svgContainerRef.value,
        {
          scale: 60,
          opacity: 0,
          duration: 0.5,
          ease: 'expo.in',
        },
        0,
      )
    }
  },
)
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 z-9999 bg-[#050505] flex flex-col items-center justify-center overflow-hidden cursor-none perspective-box"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000_70%)] z-0"
    ></div>
    <div
      class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[40px_40px] z-0 pointer-events-none"
    ></div>
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(206,17,65,0.08)_0%,transparent_60%)] z-0"
    ></div>

    <div class="relative z-10 flex flex-col items-center gap-16 w-full max-w-70">
      <div class="relative flex items-center justify-center">
        <div
          class="logo-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-chic-red/40 blur-[60px] rounded-full mix-blend-screen pointer-events-none"
        ></div>

        <div
          class="spin-ring absolute -inset-10 border border-white/10 rounded-full animate-[spin_6s_linear_infinite_reverse] border-b-transparent border-r-transparent pointer-events-none"
        ></div>
        <div
          class="spin-ring absolute -inset-4 border-2 border-chic-red/30 rounded-full animate-[spin_3s_linear_infinite] border-t-transparent border-l-transparent mix-blend-plus-lighter pointer-events-none"
        ></div>

        <div
          class="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center perspective-3d"
        >
          <div ref="svgContainerRef" class="w-full h-full preserve-3d">
            <LogoSvg
              ref="svgRef"
              class="w-full h-full overflow-visible drop-shadow-[0_0_20px_rgba(206,17,65,0.4)]"
            />
          </div>
        </div>
      </div>

      <div class="ui-container w-full space-y-4">
        <div class="flex justify-between items-end overflow-hidden h-8">
          <span class="ui-reveal block text-xs font-mono text-gray-500 tracking-[0.2em]"
            >LOADING_ASSETS</span
          >
          <span class="ui-reveal block text-3xl font-black italic text-chic-red leading-none"
            >{{ progressValue }}%</span
          >
        </div>
        <div class="progress-bg h-0.5 w-full bg-white/10 relative overflow-hidden">
          <div
            class="progress-line absolute top-0 left-0 w-full h-full bg-chic-red shadow-[0_0_15px_#CE1141]"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-chic-red {
  color: #ce1141;
}
.bg-chic-red {
  background-color: #ce1141;
}

.perspective-box {
  perspective: 800px;
}

.perspective-3d {
  transform-style: preserve-3d;
}

.preserve-3d {
  transform-style: preserve-3d;
  backface-visibility: visible;
  will-change: transform;
}

:deep(svg) {
  overflow: visible;
}
:deep(path) {
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
}
</style>
