<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBGM } from '@/composables/useBGM'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref(null)
useBGM('projects', containerRef)
let ctx

const records = ref([
  {
    id: 'TAPE_01',
    title: 'REACT_NOTE',
    category: 'FRAMEWORK',
    date: '2026.03.09',
    summary: 'React 基础机制剖析，包含 Hooks 深入理解、Fiber 架构初探以及状态管理的最佳实践。',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop',
    bilibili: null,
    notionUrl: 'https://rattle-carpenter-30b.notion.site/React-3161ccc8b955801eb591fd46e9a4ff08?source=copy_link'
  },
  {
    id: 'TAPE_02',
    title: 'LEETCODE_NOTE',
    category: 'ALGORITHM',
    date: '2026.03.09',
    summary: '前端视角下的核心算法突围。涵盖高频数据结构、动态规划与贪心算法的通俗原理解析与代码实现。',
    cover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    bilibili: null,
    notionUrl: 'https://rattle-carpenter-30b.notion.site/LeetCode-HOT100-JS-2f51ccc8b95580e885f8ec8fc7bce81e?source=copy_link'
  }
])

// 路由跳转逻辑
const openRecord = (url) => {
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

// 3D 悬浮视差与抽拉动画
const handleMouseMove = (e) => {
  const container = e.currentTarget
  if (!container._q) {
    container._q = {
      rotX: gsap.quickTo(container, "rotationX", { duration: 0.5, ease: "power3.out" }),
      rotY: gsap.quickTo(container, "rotationY", { duration: 0.5, ease: "power3.out" })
    }
  }
  const rect = container.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  container._q.rotX(((y - centerY) / centerY) * -15)
  container._q.rotY(((x - centerX) / centerX) * 15)
}

const handleMouseEnter = (e) => {
  const container = e.currentTarget
  const tape = container.querySelector('.inner-tape')
  const sleeve = container.querySelector('.outer-sleeve')
  const reels = container.querySelectorAll('.tape-reel')
  const sleeveImg = container.querySelector('.sleeve-cover-img')
  gsap.to(container, { z: 50, scale: 1.05, duration: 0.3, ease: "back.out(1.2)", overwrite: 'auto' })
  gsap.to(tape, {
    y: -90,
    rotationZ: 3,
    duration: 0.4,
    ease: "back.out(1.2)",
    overwrite: 'auto'
  })
  gsap.to(sleeve, { y: 15, duration: 0.3, ease: "power2.out", overwrite: 'auto' })
  gsap.to(sleeveImg, { filter: 'grayscale(0%) brightness(1.2) contrast(1.1)', duration: 0.3, overwrite: 'auto' })
  gsap.to(reels, { rotation: '+=360', duration: 2, repeat: -1, ease: 'linear', overwrite: 'auto' })
}

const handleMouseLeave = (e) => {
  const container = e.currentTarget
  const tape = container.querySelector('.inner-tape')
  const sleeve = container.querySelector('.outer-sleeve')
  const reels = container.querySelectorAll('.tape-reel')
  const sleeveImg = container.querySelector('.sleeve-cover-img')

  gsap.to(container, { rotationX: 0, rotationY: 0, z: 0, scale: 1, duration: 0.5, ease: "power3.out", overwrite: 'auto' })
  gsap.to(tape, { y: 0, rotationZ: 0, duration: 0.4, ease: "power3.out", overwrite: 'auto' })
  gsap.to(sleeve, { y: 0, duration: 0.4, ease: "power3.out", overwrite: 'auto' })
  gsap.to(sleeveImg, { filter: 'grayscale(100%) brightness(0.5) contrast(1)', duration: 0.4, overwrite: 'auto' })
  gsap.killTweensOf(reels)
}

onMounted(() => {
  ctx = gsap.context(() => {
    const dusts = gsap.utils.toArray('.dust-particle')
    dusts.forEach(dust => {
      gsap.set(dust, {
        x: () => gsap.utils.random(0, window.innerWidth),
        y: () => gsap.utils.random(0, window.innerHeight),
        scale: () => gsap.utils.random(0.3, 1.5),
        opacity: () => gsap.utils.random(0.1, 0.4)
      })
      gsap.to(dust, {
        y: () => `-=${gsap.utils.random(50, 150)}`,
        x: () => `+=${gsap.utils.random(-50, 50)}`,
        opacity: 0.6,
        duration: () => gsap.utils.random(8, 15),
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: () => gsap.utils.random(0, -10)
      })
    })
    const cards = gsap.utils.toArray('.tape-wrapper')
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: '.parallax-cards',
          start: 'top 95%',
          end: 'top 25%',
          scrub: 1.5,
        },
        x: () => gsap.utils.random(-800, 800),
        y: () => gsap.utils.random(400, 1000),
        z: () => gsap.utils.random(-1500, 800),
        rotationX: () => gsap.utils.random(-120, 120),
        rotationY: () => gsap.utils.random(-120, 120),
        rotationZ: () => gsap.utils.random(-45, 45),
        opacity: 0,
        ease: 'power2.out'
      })
    })
    const parallaxTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    })

    parallaxTl.to('.parallax-grid', { y: 300, ease: 'none' }, 0)
    parallaxTl.to('.dust-container', { y: -250, ease: 'none' }, 0)
    parallaxTl.to('.parallax-title', { y: -150, ease: 'none' }, 0)
    parallaxTl.to('.parallax-cards', { y: -80, ease: 'none' }, 0)
  }, containerRef.value)
})

onUnmounted(() => {
  ctx && ctx.revert()
})
</script>

<template>
  <section ref="containerRef" class="min-h-screen w-full bg-black relative flex flex-col items-center justify-center py-24 overflow-hidden font-mono select-none perspective-[1500px]">
  <div class="parallax-grid absolute -inset-y-[50%] inset-x-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(206,17,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(206,17,65,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>
    <div class="dust-container absolute inset-0 z-0 pointer-events-none overflow-visible">
      <div v-for="n in 40" :key="`dust-${n}`" class="dust-particle absolute w-1 h-1 bg-gray-400 rounded-full blur-[1px]"></div>
    </div>
    <div class="hobbies-title mb-24 text-center z-10 pointer-events-none parallax-title">
        <h2 class="text-5xl md:text-7xl font-black italic tracking-tighter mix-blend-difference cursor-default pointer-events-auto group">
            <span class="text-chic-red mr-2">FRONT-END</span>
            <span class="text-stroke text-transparent transition-colors duration-200 group-hover:text-white">PROJECTS</span>
        </h2>
        <div class="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.5em] opacity-60">CLICK_TO_PLAY</div>
    </div>
    <div class="parallax-cards relative z-10 w-full max-w-6xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-28 gap-x-8 justify-items-center">
      <div
        v-for="record in records"
        :key="record.id"
        class="tape-wrapper relative w-65 h-85 cursor-pointer transform-style-3d group"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove"
        @click="openRecord(record.notionUrl)"
      >
        <div class="inner-tape absolute inset-x-2 top-2 bottom-2 bg-[#111] border border-[#222] rounded-sm z-20 flex flex-col items-center pt-6 shadow-xl will-change-transform">
           <div class="w-3/4 h-12 bg-chic-red rounded-sm flex flex-col justify-center px-3 mb-6 relative overflow-hidden">
              <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <span class="text-[9px] text-black font-black bg-white/30 px-1 w-max">{{ record.id }}</span>
              <span class="text-sm font-black text-black leading-none truncate mt-1">{{ record.title }}</span>
           </div>

           <div class="w-[85%] h-20 bg-black border-2 border-[#1a1a1a] rounded-md relative flex items-center justify-between px-3 overflow-hidden shadow-inner">
             <div class="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/10 to-transparent pointer-events-none z-20"></div>
             <div class="tape-reel relative w-12 h-12 rounded-full bg-gray-800 border-4 border-dashed border-gray-600 flex items-center justify-center z-10">
               <div class="w-3 h-3 bg-black rounded-full"></div>
             </div>
             <div class="absolute bottom-3 left-8 right-8 h-1 bg-gray-700/60 z-0"></div>
             <div class="tape-reel relative w-12 h-12 rounded-full bg-gray-800 border-4 border-dashed border-gray-600 flex items-center justify-center z-10">
               <div class="w-3 h-3 bg-black rounded-full"></div>
             </div>
           </div>

           <div class="mt-auto mb-4 w-3/4 h-4 bg-[repeating-linear-gradient(90deg,#111,#111_4px,#222_4px,#222_8px)] rounded-sm border-t border-[#333]"></div>
        </div>

        <div class="outer-sleeve absolute inset-0 bg-black z-30 shadow-[0_20px_40px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden rounded-xs will-change-transform">
          <img :src="record.cover" class="sleeve-cover-img absolute inset-0 w-full h-full object-cover filter grayscale brightness-50 transition-all duration-500 z-0" />
          <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-size-[100%_4px] z-10 pointer-events-none"></div>
          <div class="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
          <div class="absolute top-0 left-0 w-full h-1 bg-chic-red z-20"></div>

          <div class="absolute inset-0 p-5 flex flex-col justify-between z-20 pointer-events-none">
            <div class="flex justify-between items-start">
               <span class="text-[10px] text-chic-red font-bold border border-chic-red/50 bg-black/80 backdrop-blur px-2 py-1">
                 VOL. {{ record.id.split('_')[1] }}
               </span>
            </div>

            <div class="mt-auto">
               <div class="text-[9px] text-[#00ffff] tracking-[0.2em] mb-2 uppercase opacity-80">
                 // {{ record.category }}
               </div>
               <h3 class="text-3xl font-black italic text-white leading-[0.9] mb-4 drop-shadow-md">
                 {{ record.title }}
               </h3>

               <div class="flex justify-between items-end border-t border-white/20 pt-3">
                 <span class="text-[10px] font-bold text-gray-400">{{ record.date }}</span>
                 <span class="text-[9px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-chic-red transition-colors">PULL_TO_READ</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-stroke { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3); }
.transform-style-3d { transform-style: preserve-3d; }

.text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
}
.hobbies-title {
  will-change: transform;
}
</style>
