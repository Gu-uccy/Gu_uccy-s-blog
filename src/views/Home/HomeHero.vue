<script setup>
import logo1 from '@/assets/img/Gu_uccy.png'
import { onMounted, onUnmounted, ref, inject, watch } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBGM } from '@/composables/useBGM'

gsap.registerPlugin(ScrollTrigger)

let rotateXTo, rotateYTo, textXTo, textYTo, logoXTo, logoYTo;
const contentRef = ref(null)
const containerRef = ref(null)
const isBioOpen = ref(false)
const isAnimating = ref(false)
const marqueeTop = ref(null)
const marqueeBottom = ref(null)
const tunnelCount = ref(2) // 默认 3 层
const checkDevicePerformance = () => {
  if (window.innerWidth < 768) tunnelCount.value = 1
  else tunnelCount.value = 2
}
const isGlobalLoading = inject('isGlobalLoading')
let ctx

useBGM('hero', containerRef)

// === 进场动画 ===
const animateIntro = () => {
  if (!ctx) return
  ctx.add(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    gsap.set(
      [
        '.hero-word',
        '.glitch-text',
        '.hud-group',
        '.grid-tunnel',
        '.bio-trigger',
        '.hero-logo-img',
      ],
      { autoAlpha: 0 },
    )
    gsap.set('.hero-word', { z: 500, scale: 3, filter: 'blur(20px)' })
    gsap.set('.glitch-text', { scale: 0.5 })
    gsap.set('.hero-logo-img', { scale: 2, filter: 'blur(10px) hue-rotate(90deg)' })
    gsap.set('.bio-trigger', { x: 100 })

    tl.to(
      '.hero-word',
      {
        duration: 1.5,
        z: 0,
        scale: 1,
        autoAlpha: 1,
        filter: 'blur(0px)',
        stagger: 0.1,
        ease: 'expo.out',
        clearProps: 'filter'
      },
      0.2,
    )
      .to(
        '.hero-logo-img',
        {
          keyframes: [
            { autoAlpha: 1, duration: 0.05, scale: 1.5, filter: 'blur(5px) hue-rotate(45deg)' },
            { autoAlpha: 0, duration: 0.05 },
            {
              autoAlpha: 0.8,
              duration: 0.05,
              scale: 1.2,
              x: -5,
              filter: 'blur(2px) hue-rotate(0deg)',
            },
            { autoAlpha: 0, duration: 0.05 },
            {
              autoAlpha: 1,
              duration: 0.5,
              scale: 1,
              x: 0,
              filter: 'blur(0px) hue-rotate(0deg)',
              ease: 'back.out(1.7)',
            },
          ],
          clearProps: 'filter'
        },
        0.5,
      )
      .to(
        '.glitch-text',
        {
          duration: 0.05,
          scale: 1,
          autoAlpha: 1,
          repeat: 4,
          yoyo: true,
          ease: 'steps(1)',
        },
        '-=1.2',
      )
      .to('.grid-tunnel', { duration: 2, autoAlpha: 1, ease: 'power2.out' }, '-=1.5')
      .to('.hud-group', { duration: 0.2, autoAlpha: 1, stagger: 0.1 }, '-=1')
      .to('.bio-trigger', { duration: 1, x: 0, autoAlpha: 1, ease: 'power2.out' }, 0.5)
  })
}

// === 滚动视差效果 ===
const initScrollParallax = () => {
  if (!containerRef.value || !contentRef.value) return
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  })
  tl.to(
    contentRef.value,
    {
      y: 200,
      scale: 0.85,
      opacity: 0,
      ease: 'none',
    },
    0,
  )
  tl.to(
    '.perspective-box',
    {
      scale: 1.5,
      opacity: 0,
      ease: 'power1.in',
    },
    0,
  )
  tl.fromTo(
    '.hud-group',
    { y: 0, opacity: 1 },
    { y: -100, opacity: 0, ease: 'none' },
    0
  )
  tl.fromTo(
    '.hud-group svg',
    { rotation: 0, scale: 1 },
    { rotation: 360, scale: 0, transformOrigin: 'center center', ease: 'none' },
    0
  )
  if (marqueeTop.value) {
    tl.to(marqueeTop.value, { xPercent: -30, ease: 'none' }, 0)
  }
  if (marqueeBottom.value) {
    tl.fromTo(marqueeBottom.value, { xPercent: -10 }, { xPercent: 20, ease: 'none' }, 0)
  }
}

// === 随机抖动逻辑 ===
const startJitter = (target, type) => {
  const isHorizontal = type === 'h'
  const nextTick =
    (Math.random() * (isHorizontal ? 2000 : 1500) + (isHorizontal ? 1000 : 1500)) / 1000
  gsap.delayedCall(nextTick, () => {
    const tl = gsap.timeline({
      onComplete: () => startJitter(target, type),
    })

    if (isHorizontal) {
      for (let i = 0; i < 3; i++) {
        tl.to(target, {
          x: Math.random() * 12 - 6,
          skewX: Math.random() * 8 - 4,
          duration: 0.04,
          ease: 'power1.inOut',
        })
      }
      tl.to(target, { x: 0, skewX: 0, duration: 0.1 })
    } else {
      tl.to(target, {
        y: Math.random() * 12 - 6,
        duration: 0.1,
        ease: 'steps(2)',
      }).to(target, { y: 0, duration: 0.1 })
    }
  })
}

onMounted(() => {
  checkDevicePerformance()
  window.addEventListener('resize', checkDevicePerformance)
  ctx = gsap.context(() => {
    if (contentRef.value) {
      gsap.set(contentRef.value, {
        transformPerspective: 1000,
        transformOrigin: 'center center',
        transformStyle: 'preserve-3d'
      })
      rotateYTo = gsap.quickTo(contentRef.value, "rotationY", { duration: 0.8, ease: "power3.out" })
      rotateXTo = gsap.quickTo(contentRef.value, "rotationX", { duration: 0.8, ease: "power3.out" })
      textXTo = gsap.quickTo('.glitch-text', "x", { duration: 1, ease: "power3.out" })
      textYTo = gsap.quickTo('.glitch-text', "y", { duration: 1, ease: "power3.out" })
      logoXTo = gsap.quickTo('.hero-logo-img', "x", { duration: 1.2, ease: "power3.out" })
      logoYTo = gsap.quickTo('.hero-logo-img', "y", { duration: 1.2, ease: "power3.out" })
    }
    startJitter('.glitch-text', 'h')
    startJitter('.glitch-text', 'v')
    initScrollParallax()
  }, containerRef.value)

  watch(
    isGlobalLoading,
    (isLoading) => {
      if (!isLoading) {
        animateIntro()
      }
    },
    { immediate: true },
  )
})

onUnmounted(() => {
  ctx && ctx.revert()
  window.removeEventListener('resize', checkDevicePerformance)
  ctx && ctx.revert()
})

const handleMouseMove = (e) => {
  if (!contentRef.value || !containerRef.value || isBioOpen.value) return
  const { innerWidth, innerHeight } = window
  const x = (e.clientX / innerWidth - 0.5) * 2
  const y = (e.clientY / innerHeight - 0.5) * 2
  rotateYTo(x * 8)
  rotateXTo(-y * 8)
  if (innerWidth >= 768 && textXTo) {
    textXTo(x * 15)
    textYTo(y * 15)
    logoXTo(-x * 25)
    logoYTo(-y * 25)
  }
  containerRef.value.style.setProperty('--p-x', `${50 + x * 10}%`)
  containerRef.value.style.setProperty('--p-y', `${50 + y * 10}%`)
}

// === 个人简介卡片动画 ===
const openBio = async () => {
  if (isBioOpen.value || isAnimating.value) return
  isAnimating.value = true
  isBioOpen.value = true

  ctx.add(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.value = false
      },
    })
    tl.to('.bio-backdrop', { autoAlpha: 1, duration: 0.3 })
      .to(
        '.bio-card',
        {
          autoAlpha: 1,
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.2,
          ease: 'power2.out',
        },
        '<',
      )
      .fromTo(
        '.bio-content > *',
        { x: 20, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
        '-=0.1',
      )
  })
}

const closeBio = () => {
  if (!isBioOpen.value || isAnimating.value) return
  isAnimating.value = true

  ctx.add(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        isBioOpen.value = false
        isAnimating.value = false
      },
    })
    tl.to('.bio-content > *', { x: 10, autoAlpha: 0, duration: 0.2, stagger: 0.02 })
      .to(
        '.bio-card',
        {
          clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
          duration: 0.4,
          ease: 'power3.in',
        },
        '-=0.1',
      )
      .to('.bio-card', { autoAlpha: 0, duration: 0 })
      .to('.bio-backdrop', { autoAlpha: 0, duration: 0.3 }, '-=0.2')
  })
}

// === 点击光爆 ===
const handleClick = (e) => {
  if (window.innerWidth < 768) return
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  containerRef.value.style.setProperty('--click-x', `${e.clientX - rect.left}px`)
  containerRef.value.style.setProperty('--click-y', `${e.clientY - rect.top}px`)

  ctx.add(() => {
    gsap.fromTo(
      containerRef.value,
      { '--ripple-size': '0px', '--ripple-op': 0.8 },
      { '--ripple-size': '60vmax', '--ripple-op': 0, duration: 1.2, ease: 'expo.out' },
    )
    gsap.fromTo('.glitch-text', { skewX: 10 }, { skewX: 0, duration: 0.2 })
  })
}

const handleMouseLeave = () => {
  if (contentRef.value) gsap.to(contentRef.value, { rotationY: 0, rotationX: 0, duration: 0.8 })
}
</script>

<template>
  <section
    ref="containerRef"
    class="h-screen w-full relative overflow-hidden bg-black flex items-center justify-center perspective-container cursor-none select-none"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <div class="absolute inset-0 z-40 pointer-events-none p-6 md:p-8 text-white/40">
      <svg class="absolute top-8 left-8 w-12 h-12" viewBox="0 0 100 100" fill="none">
        <path d="M0 20 V 0 H 20" stroke="currentColor" stroke-width="3" />
        <rect x="0" y="0" width="4" height="4" class="fill-chic-red" />
      </svg>
      <svg class="absolute top-8 right-8 w-12 h-12" viewBox="0 0 100 100" fill="none">
        <path d="M80 0 H 100 V 20" stroke="currentColor" stroke-width="3" />
        <text x="50" y="15" fill="currentColor" class="text-[10px] font-mono tracking-widest">
          CAM_01
        </text>
      </svg>
      <svg class="absolute bottom-8 left-8 w-12 h-12" viewBox="0 0 100 100" fill="none">
        <path d="M0 80 V 100 H 20" stroke="currentColor" stroke-width="3" />
      </svg>
      <svg class="absolute bottom-8 right-8 w-12 h-12" viewBox="0 0 100 100" fill="none">
        <path d="M100 80 V 100 H 80" stroke="currentColor" stroke-width="3" />
        <rect x="96" y="96" width="4" height="4" class="fill-chic-red" />
      </svg>
    </div>

    <div class="absolute inset-0 z-0 overflow-hidden bg-black perspective-box">
      <div class="absolute inset-0 bg-black"></div>
      <div
        v-for="i in tunnelCount"
        :key="`base-${i}`"
        class="grid-tunnel base-grid"
        :style="{ animationDelay: `${(i - 1) * 0.66}s` }"
      ></div>
      <div class="interference-layer absolute inset-0 z-30 pointer-events-none"></div>
      <div class="absolute inset-0 z-20 bg-[radial-gradient(transparent_20%,#000_100%)]"></div>
      <div
        class="absolute bottom-0 left-0 w-full h-20 bg-linear-to-t from-black via-black to-transparent z-30 pointer-events-none"
      ></div>
    </div>

    <div
      class="absolute inset-0 z-20 flex flex-col justify-between py-12 pointer-events-none opacity-10 overflow-hidden"
    >
      <div
        ref="marqueeTop"
        class="text-[4rem] font-black text-transparent text-stroke whitespace-nowrap"
      >
        SYSTEM_ONLINE /// VUE3 /// GSAP /// TAILWIND /// SYSTEM_ONLINE /// VUE3 /// GSAP
      </div>
      <div
        ref="marqueeBottom"
        class="text-[4rem] font-black text-transparent text-stroke whitespace-nowrap"
      >
        DESIGNED BY Gu_uccy /// 2026 PORTFOLIO /// CREATIVE DEVELOPER /// Gu_uccy /// 2026
      </div>
    </div>

    <div class="absolute inset-0 z-50 pointer-events-none">
      <div
        class="bio-backdrop fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer pointer-events-auto opacity-0 invisible"
        @click="closeBio"
      ></div>
      <div
        class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-4 md:pr-8 pointer-events-none"
      >
        <div
          class="bio-card w-[85vw] md:w-125 bg-black/95 border border-chic-red/50 backdrop-blur-xl p-1 relative overflow-hidden shadow-[0_0_50px_rgba(206,17,65,0.4)] invisible opacity-0 pointer-events-auto"
          style="clip-path: polygon(100% 0, 100% 0, 100% 100%, 100% 100%)"
          @click.stop
        >
          <div
            class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(206,17,65,0.05)_50%)] bg-size-[100%_4px] pointer-events-none z-0"
          ></div>
          <div
            class="absolute top-0 left-0 w-full h-1 bg-chic-red/50 shadow-[0_0_10px_#CE1141]"
          ></div>

          <div class="bio-content relative z-10 flex flex-col md:flex-row gap-6 p-6 h-full">
            <div class="w-24 shrink-0 flex flex-col gap-2">
              <div class="w-24 h-24 border border-white/20 relative overflow-hidden group">
                <img
                  :src="logo1"
                  class="w-full h-full object-contain p-2 filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                <div
                  class="absolute inset-0 bg-chic-red/20 mix-blend-overlay opacity-0 group-hover:opacity-100 animate-pulse"
                ></div>
                <div class="absolute top-0 right-0 w-2 h-2 bg-chic-red"></div>
                <div class="absolute bottom-0 left-0 w-2 h-2 bg-chic-red"></div>
              </div>
              <div
                class="text-[10px] font-mono text-center text-chic-red tracking-widest border border-chic-red/30 py-1"
              >
                Gu_uccy
              </div>
            </div>

            <div class="flex-1 font-mono text-xs text-gray-300 flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-end border-b border-white/10 pb-2 mb-3">
                  <h3 class="text-xl text-white font-bold italic tracking-tighter">
                    UESTC_STUDENT
                  </h3>
                  <span class="text-chic-red text-[10px] bg-chic-red/10 px-1">LV.2 SOPHOMORE</span>
                </div>
                <ul class="space-y-2 mb-4 text-white/80 leading-relaxed">
                  <li class="flex gap-2">
                    <span class="text-chic-red w-4">>></span
                    ><span><strong class="text-white">Major:</strong> 电子科技大学 / 软件工程</span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-chic-red w-4">>></span>
                    <span>
                      <strong class="text-white">Studio:</strong> 凌睿工作室
                      <span class="text-[10px] text-gray-500 font-normal">(LingRui Studio)</span>
                      <span
                        class="ml-2 text-[9px] text-black bg-chic-red px-1 rounded-[1px] font-bold align-middle"
                        >MEMBER</span
                      >
                    </span>
                  </li>
                  <li class="flex gap-2">
                    <span class="text-chic-red w-4">>></span
                    ><span><strong class="text-white">Focus:</strong> 前端开发 / 交互设计</span>
                  </li>
                </ul>
                <ul
                  class="flex-1 space-y-3 text-[11px] md:text-xs text-gray-300 leading-relaxed overflow-y-auto pr-2 custom-scrollbar"
                >
                  <li class="group flex items-start gap-3">
                    <span
                      class="shrink-0 pt-0.5 text-base group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 cursor-default"
                      >💻</span
                    >
                    <span>
                      <span class="text-chic-red font-bold mr-1">Coding:</span>
                      正在前端领域摸爬滚打，向往炫酷的页面设计和流畅的交互体验
                    </span>
                  </li>
                  <li class="group flex items-start gap-3">
                    <span
                      class="shrink-0 pt-0.5 text-base group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 cursor-default"
                      >🎧</span
                    >
                    <span>
                      <span class="text-chic-red font-bold mr-1">Playlist:</span>
                      平时比较喜欢听 Hip-hop 或者 R&B
                    </span>
                  </li>
                  <li class="group flex items-start gap-3">
                    <span
                      class="shrink-0 pt-0.5 text-base group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 cursor-default"
                      >🎮</span
                    >
                    <span>
                      <span class="text-chic-red font-bold mr-1">Gaming:</span>
                      主要玩 CS2
                    </span>
                  </li>
                  <li class="group flex items-start gap-3">
                    <span
                      class="shrink-0 pt-0.5 text-base group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300 cursor-default"
                      >🏀</span
                    >
                    <span>
                      <span class="text-chic-red font-bold mr-1">Sports:</span>
                      偶尔喜欢打篮球
                    </span>
                  </li>
                  <li class="group flex items-start gap-3">
                    <span
                      class="shrink-0 pt-0.5 text-base group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 cursor-default"
                      >📺</span
                    >
                    <span>
                      <span class="text-chic-red font-bold mr-1">Otaku:</span>
                      看番也是生活的一部分，二次元浓度适中
                    </span>
                  </li>
                  <li class="group flex items-start gap-3">
                    <span>
                      这个博客是我存放技术沉淀和生活灵感的地方。在这里记录我的兴趣爱好，学习经历和生活碎碎念
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <button
            @click="closeBio"
            class="absolute top-2 right-2 p-2 hover:text-chic-red text-white transition-colors z-20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <button
          @click="isBioOpen ? closeBio() : openBio()"
          class="bio-trigger group relative ml-4 flex flex-col items-center gap-2 py-4 px-1 border-l-2 backdrop-blur transition-all duration-300 pointer-events-auto"
          :class="[
            isBioOpen
              ? 'border-chic-red bg-chic-red/20 pointer-events-auto'
              : 'border-white/20 bg-black/50 hover:border-chic-red hover:bg-chic-red/10',
          ]"
        >
          <span
            class="writing-vertical text-[10px] font-mono tracking-[0.3em] transition-colors"
            :class="isBioOpen ? 'text-chic-red' : 'text-white/60 group-hover:text-chic-red'"
          >
            IDENTITY_DATA
          </span>
          <div
            class="w-1 h-1 bg-chic-red rounded-full"
            :class="isBioOpen ? 'opacity-100' : 'animate-ping'"
          ></div>
          <div
            class="w-1 h-6 transition-colors"
            :class="isBioOpen ? 'bg-chic-red/80' : 'bg-white/10 group-hover:bg-chic-red/50'"
          ></div>
          <div
            class="absolute -left-0.5 top-0 w-0.5 bg-chic-red transition-all duration-500"
            :class="isBioOpen ? 'h-full' : 'h-0 group-hover:h-full'"
          ></div>
        </button>
      </div>
    </div>

    <div
      class="hud-group absolute inset-0 z-20 pointer-events-none p-8 flex flex-col justify-between"
    >
      <div class="flex justify-between items-start pl-8 pr-8 pt-4">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 bg-chic-red rounded-full animate-pulse"></div>
          <div
            class="text-xs text-gray-400 border border-white/20 px-2 py-1 bg-black/50 backdrop-blur font-mono"
          >
            REC [06:10:17]
          </div>
        </div>
        <div class="text-right font-mono text-xs text-gray-500">
          CN /// CHENGDU <br />
          <span class="text-chic-red">ONLINE</span>
        </div>
      </div>

      <div class="flex justify-between items-end pl-8 pr-8 pb-4 pointer-events-auto">
        <div
          class="w-24 h-24 hover:scale-110 transition-transform cursor-pointer relative flex items-center justify-center group"
        >
          <svg
            viewBox="0 0 100 100"
            class="absolute inset-0 w-full h-full fill-current animate-spin-slow text-white pointer-events-none"
          >
            <path
              id="circlePath"
              d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0"
              fill="transparent"
            />
            <text class="text-[11px] font-bold text-chic-red">
              <textPath href="#circlePath">SCROLL TO EXPLORE • Gu_uccy •</textPath>
            </text>
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 40"
            stroke-width="1"
            stroke="currentColor"
            class="h-12 w-4 text-chic-red relative z-10 transition-transform duration-300 group-hover:translate-y-2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 2v36m0 0l-6-8m6 8l6-8" />
          </svg>
        </div>
        <div class="flex gap-6 text-xs font-bold text-gray-500">
          <a href="#" class="hover:text-white transition-colors cursor-none">GITHUB</a>
          <a href="#" class="hover:text-white transition-colors cursor-none">EMAIL</a>
        </div>
      </div>
    </div>

    <div
      ref="contentRef"
      class="z-30 relative w-full max-w-[90vw] md:max-w-6xl mx-auto flex flex-col items-center justify-center pointer-events-none select-none"
    >
      <div class="absolute top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <a href="#" class="block relative group hover:scale-110 transition-transform duration-500">
          <div
            class="absolute inset-0 bg-chic-red/40 blur-[25px] rounded-full animate-pulse group-hover:bg-chic-red/60 transition-colors"
          ></div>
          <img
            :src="logo1"
            alt="Gu_uccy"
            class="hero-logo-img w-16 h-16 md:w-20 md:h-20 object-contain relative z-10 drop-shadow-[0_0_10px_rgba(206,17,65,1)]"
          />
          <div
            class="absolute -inset-2 border border-white/10 rounded-full border-dashed animate-[spin_12s_linear_infinite]"
          ></div>
        </a>
      </div>

      <div
        class="w-full flex justify-between items-end mb-4 md:mb-8 text-xs md:text-sm font-mono text-gray-400 border-b border-white/10 pb-4 hero-word"
      >
        <span class="tracking-widest opacity-60 hidden md:block">/// EST. 2026</span>
        <span class="flex items-center gap-2">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          AVAILABLE FOR FREELANCE
        </span>
      </div>

      <div class="relative w-full flex flex-col items-center py-10 md:py-20">
        <div
          class="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 text-[15rem] leading-none font-black text-white/5 font-outline-2 hero-word"
        >
          20
        </div>
        <div
          class="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-[15rem] leading-none font-black text-white/5 font-outline-2 hero-word"
        >
          26
        </div>

        <div
          class="hero-word relative z-10 self-start md:ml-20 -mb-4 md:-mb-10 mix-blend-difference pointer-events-auto"
        >
          <h2 class="stroke-text text-[4rem] md:text-[6rem] pr-4">DIGITAL</h2>
        </div>

        <div class="hero-word relative z-20 my-2 md:my-4">
          <h1
            class="neon-breathing glitch-text italic font-black text-[13vw] md:text-[11rem] uppercase leading-[0.85] tracking-tighter text-chic-red"
            data-text="Gu_uccy"
          >
            GU<span
              class="inline-block relative -top-[0.08em] mx-[0.02em] text-chic-red animate-pulse not-italic"
              >_</span
            >UCCY
          </h1>
          <div
            class="absolute -inset-10 bg-chic-red/30 blur-[60px] -z-10 rounded-full opacity-80 mix-blend-screen animate-pulse-slow"
          ></div>
        </div>

        <div
          class="hero-word relative z-10 self-end md:mr-20 -mt-4 md:-mt-10 mix-blend-difference pointer-events-auto"
        >
          <h2 class="stroke-text text-[4rem] md:text-[6rem] pl-4">CRAFTER</h2>
        </div>
      </div>

      <div
        class="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left border-t border-white/10 pt-6"
      >
        <div class="hero-word flex gap-4">
          <div class="hidden md:flex flex-col gap-1 w-6 pt-1 group opacity-60">
            <div
              v-for="i in 6"
              :key="i"
              class="h-2px bg-chic-red/50"
              :style="{ width: `${Math.random() * 100}%`, opacity: Math.random() }"
            ></div>
          </div>
          <div>
            <h3 class="text-chic-red font-bold text-xs tracking-[0.2em] mb-2">/// SKILLSET</h3>
            <ul class="text-xs font-mono text-gray-400 space-y-1 leading-relaxed">
              <li>WEBGL / THREE.JS / OGL</li>
              <li>VUE 3 / NUXT / VITE</li>
              <li>GSAP / MOTION / GLSL</li>
              <li>UI / UX DESIGN</li>
            </ul>
          </div>
        </div>

        <div class="hero-word hidden md:flex items-center justify-center">
          <div
            class="w-32 h-32 relative flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-300 group cursor-none"
          >
            <svg
              viewBox="0 0 100 100"
              class="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite_reverse] text-white/20 group-hover:text-chic-red/50 transition-colors"
            >
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                stroke-width="0.5"
                stroke-dasharray="4 4"
              />
            </svg>
            <svg
              viewBox="0 0 100 100"
              class="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] animate-[spin_4s_linear_infinite] text-white/40"
            >
              <path
                d="M50 10 A40 40 0 0 1 90 50"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
              <path
                d="M50 90 A40 40 0 0 1 10 50"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            <div class="w-2 h-2 bg-chic-red rounded-full animate-ping"></div>
            <div
              class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] font-mono text-chic-red tracking-tighter mt-4"
            >
              CORE_ACTIVE
            </div>
          </div>
        </div>

        <div class="hero-word">
          <h3 class="text-chic-red font-bold text-xs tracking-[0.2em] mb-2">/// BIO</h3>
          <p class="text-xs text-gray-300 font-mono leading-relaxed max-w-xs ml-auto md:text-right">
            Crafting immersive digital experiences through code and design. Exploring the boundary
            between
            <span class="text-white border-b border-white/30">virtual aesthetics</span> and
            <span class="text-white border-b border-white/30">functional reality</span>.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.text-chic-red {
  color: #ce1141;
}
.bg-chic-red {
  background-color: #ce1141;
}
.fill-chic-red {
  fill: #ce1141;
}

.cursor-none {
  cursor: none !important;
}

.text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
  color: transparent;
}
.font-outline-2 {
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.1);
  color: transparent;
}
.stroke-text {
  font-size: 10vw;
  line-height: 0.8;
  font-weight: 900;
  text-transform: uppercase;
  color: transparent;
  -webkit-text-stroke: 1.5px white;
  letter-spacing: -0.05em;
  font-style: italic;
  transition: color 0.1s ease;
}
.stroke-text:hover {
  color: white;
}
@media (min-width: 768px) {
  .stroke-text {
    font-size: 6rem;
  }
}
.glitch-text {
  position: relative;
  color: #ce1141;
  z-index: 20;
}
.neon-breathing {
  text-shadow: 0 0 10px rgba(206, 17, 65, 0.4), 0 0 20px rgba(206, 17, 65, 0.2);
}
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
.bio-card {
  will-change: clip-path, opacity, transform;
  transform: translateZ(0);
}
.bio-backdrop {
  will-change: opacity;
}

/* 3D 隧道 & 视差 */
.perspective-box {
  perspective: 600px;
  perspective-origin: var(--p-x, 50%) var(--p-y, 50%);
  transition: perspective-origin 0.1s ease-out;
}
.grid-tunnel {
  position: absolute;
  left: -50%;
  top: -50%;
  width: 200%;
  height: 200%;
  background-size: 60px 60px;
  transform-style: preserve-3d;
  animation: tunnel-fly 2s linear infinite;
}
.base-grid {
  background-image:
    linear-gradient(#ce114166 1px, transparent 1px),
    linear-gradient(90deg, #ce114166 1px, transparent 1px);
}
.interference-layer {
  background: radial-gradient(
    circle at var(--click-x, 0px) var(--click-y, 0px),
    rgba(206, 17, 65, 0.8) 0%,
    rgba(206, 17, 65, 0) var(--ripple-size, 0px)
  );
  mix-blend-mode: screen;
  opacity: var(--ripple-op);
  will-change: background, opacity;
  pointer-events: none;
  z-index: 30;
  transition: none;
}

@keyframes tunnel-fly {
  0% {
    transform: translateZ(-600px);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  100% {
    transform: translateZ(300px);
    opacity: 0;
  }
}
.animate-spin-slow {
  animation: spin 12s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-marquee-left {
  animation: marquee 20s linear infinite;
}
.animate-marquee-right {
  animation: marquee 20s linear infinite reverse;
}
@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

/* Glitch 伪元素动画 */
.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
  background: transparent;
  font-style: italic;
  mix-blend-mode: screen;
}
.glitch-text::before {
  color: #00ffff;
  z-index: -1;
  animation: project-cyan 5s infinite;
}
.glitch-text::after {
  color: #ff0000;
  z-index: -2;
  animation: project-red 5s infinite 0.2s;
}

@keyframes project-cyan {
  0%,
  19%,
  27%,
  34%,
  59%,
  70%,
  76%,
  87%,
  96%,
  100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  20% {
    opacity: 0.8;
    transform: translate(-4px, 1px) skewX(5deg);
  }
  60% {
    opacity: 1;
    transform: translate(-15px, -5px) skewX(20deg);
    filter: blur(1px);
  }
  63% {
    opacity: 0.5;
    transform: translate(-5px, -2px) skewX(-5deg);
  }
  88% {
    opacity: 0.8;
    transform: translate(-8px, 2px);
  }
}
@keyframes project-red {
  0%,
  19%,
  22%,
  23%,
  59%,
  65%,
  66%,
  91%,
  94%,
  100% {
    opacity: 0;
    transform: translate(0, 0);
  }
  20% {
    opacity: 0.8;
    transform: translate(4px, -1px) skewX(-5deg);
  }
  60% {
    opacity: 1;
    transform: translate(15px, 5px) skewX(-20deg);
    filter: blur(1px);
  }
  63% {
    opacity: 0.5;
    transform: translate(5px, 2px) skewX(5deg);
  }
  92% {
    opacity: 0.8;
    transform: translate(8px, -2px);
  }
}

.hero-word,
.glitch-text,
.grid-tunnel {
  will-change: transform, opacity;
  transform: translateZ(0);
}
</style>
