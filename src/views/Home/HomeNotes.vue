<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const deskRef = ref(null)
let ctx

// notes数据
const courses = ref([
  {
    id: 'DOC_SE_2026',
    title: '软件工程',
    titleEn: 'SOFTWARE_ENGINEERING',
    type: 'MAJOR_CORE',
    summary: '软件生命周期、敏捷开发模式、需求分析与 UML 系统架构设计。从代码砖瓦到工程大厦的系统论。',
    notionUrl: 'https://rattle-carpenter-30b.notion.site/2cb1ccc8b95580a5a348d0b8069cb3c9?source=copy_link',
    scatter: { rotation: -6, x: -30, y: 10 }
  },
  {
    id: 'DOC_FIN_2026',
    title: '金融学基础',
    titleEn: 'FUNDAMENTALS_OF_FINANCE',
    type: 'ELECTIVE',
    summary: '货币的时间价值、风险与收益模型、基本的宏观经济学与微观金融理论。代码之外的财富运作规律。',
    notionUrl: 'https://rattle-carpenter-30b.notion.site/2cd1ccc8b9558039834cc2eed018de41?source=copy_link',
    scatter: { rotation: 8, x: 20, y: -20 }
  }
])

const openNotion = (url) => {
  if (url && url.startsWith('http')) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// 纸张交互动画
const handleMouseEnter = (e) => {
  const paper = e.currentTarget
  gsap.set(paper, { zIndex: 50 })
  gsap.to(paper, {
    rotation: 0,
    x: 0,
    y: -20,
    scale: 1.05,
    duration: 0.4,
    ease: "back.out(1.5)",
    boxShadow: "0 25px 50px -12px rgba(206, 17, 65, 0.25)"
  })
}

const handleMouseLeave = (e, index) => {
  const paper = e.currentTarget
  const scatterConfig = courses.value[index].scatter
  gsap.to(paper, {
    rotation: scatterConfig.rotation,
    x: scatterConfig.x,
    y: scatterConfig.y,
    scale: 1,
    duration: 0.5,
    ease: "power2.out",
    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.8)",
    onComplete: () => gsap.set(paper, { zIndex: 10 })
  })
}


onMounted(() => {
  ctx = gsap.context(() => {
    gsap.from('.paper-parallax-wrapper', {
      scrollTrigger: {
        trigger: deskRef.value,
        start: 'top 75%'
      },
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: 'back.out(1.2)'
    })
    gsap.to('.title-parallax', {
      scrollTrigger: {
        trigger: deskRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: 80,
      ease: 'none'
    })
    gsap.to('.bg-grid-parallax', {
      scrollTrigger: {
        trigger: deskRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      },
      y: 150,
      ease: 'none'
    })
    gsap.utils.toArray('.paper-parallax-wrapper').forEach((wrapper, i) => {
      const speed = i % 2 === 0 ? -100 : -50
      gsap.to(wrapper, {
        scrollTrigger: {
          trigger: deskRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        },
        y: speed,
        ease: 'none'
      })
    })
  }, deskRef.value)
})

onUnmounted(() => {
  ctx && ctx.revert()
})
</script>

<template>
  <section ref="deskRef" class=" w-full py-32 bg-black relative overflow-hidden flex flex-col items-center">
    <div class="bg-grid-parallax absolute inset-0 z-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_center,transparent_0,black_100%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-size-[100%_100%,30px_30px,30px_30px] h-[150%] -top-[25%]"></div>
    <div class="hobbies-title mb-24 text-center z-10 pointer-events-none title-parallax">
        <h2 class="text-5xl md:text-7xl font-black italic tracking-tighter mix-blend-difference cursor-default pointer-events-auto group">
            <span class="text-chic-red mr-2">SOME</span>
            <span class="text-stroke text-transparent transition-colors duration-200 group-hover:text-white">NOTES</span>
        </h2>
        <div class="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.5em] opacity-60">CLICK_TO_PLAY</div>
    </div>
    <div class="relative z-10 w-full max-w-5xl px-6 flex flex-wrap justify-center items-center gap-12 md:gap-24 perspective-[1000px]">
      <div
        v-for="(course, index) in courses"
        :key="course.id"
        class="paper-parallax-wrapper relative"
      >
        <div
          class="document-paper relative w-75 md:w-85 bg-[#111] border border-[#333] cursor-pointer text-white p-6 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] transition-colors duration-300 group"
          :style="{ transform: `rotate(${course.scatter.rotation}deg) translate(${course.scatter.x}px, ${course.scatter.y}px)`, zIndex: 10 }"
          @mouseenter="handleMouseEnter($event, index)"
          @mouseleave="handleMouseLeave($event, index)"
          @click="openNotion(course.notionUrl)"
        >
          <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
          <div class="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.2)_50%)] bg-size-[100%_4px] pointer-events-none"></div>
          <div class="absolute -top-3 -right-3 border-2 border-chic-red text-chic-red font-black text-[10px] tracking-widest px-2 py-1 transform rotate-12 opacity-80 group-hover:scale-110 transition-transform">
            DECLASSIFIED
          </div>
          <div class="flex justify-between items-end border-b border-[#333] pb-3 mb-5 font-mono">
            <div>
              <div class="text-[9px] text-gray-500 mb-1">FILE_ID: {{ course.id }}</div>
              <div class="text-[10px] text-[#00ffff] tracking-wider">{{ course.type }}</div>
            </div>
            <div class="h-6 w-16 bg-[repeating-linear-gradient(90deg,white,white_1px,transparent_1px,transparent_3px,white_3px,white_4px,transparent_4px,transparent_5px)] opacity-50"></div>
          </div>
          <div class="mb-6">
            <h3 class="text-3xl font-black tracking-tight mb-1 text-gray-100 group-hover:text-white transition-colors">{{ course.title }}</h3>
            <div class="text-xs text-gray-600 font-mono tracking-widest uppercase">{{ course.titleEn }}</div>
          </div>
          <div class="text-sm text-gray-400 font-serif leading-relaxed mb-8 border-l-2 border-[#333] pl-3">
            {{ course.summary }}
          </div>
          <div class="mt-auto pt-4 border-t border-[#222] flex justify-between items-center font-mono">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-gray-600 group-hover:bg-chic-red transition-colors"></span>
              <span class="text-[9px] text-gray-500">SYNC_TO_NOTION</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600 group-hover:text-chic-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 w-full h-[40vh] pointer-events-none overflow-hidden z-0">
      <div class="bubble bubble-1"></div>
      <div class="bubble bubble-2"></div>
      <div class="bubble bubble-3"></div>
      <div class="bubble bubble-4"></div>
      <div class="bubble bubble-5"></div>
      <div class="bubble bubble-6"></div>
      <div class="bubble bubble-7"></div>
      <div class="bubble bubble-8"></div>
    </div>
  </section>
  <footer class="relative w-full h-64 bg-black overflow-hidden flex flex-col items-center justify-end pb-8 border-t border-white/5 z-0">
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
    <div class="absolute left-[15%] bottom-[40%] animate-float-slow opacity-30 hover:opacity-100 hover:text-[#00ffff] transition-all duration-700 cursor-crosshair">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="7" y="11" width="10" height="10" rx="2" ry="2"></rect>
        <path d="M7 16H4a2 2 0 0 1-2-2v-3"></path>
        <path d="M17 16h3a2 2 0 0 0 2-2v-3"></path>
        <path d="M9 21v2"></path>
        <path d="M15 21v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    </div>
    <div class="absolute right-[15%] bottom-[20%] animate-vibrate opacity-40 hover:opacity-100 hover:text-chic-red transition-all duration-500 cursor-pointer group">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="transform -rotate-12 group-hover:-translate-y-4 transition-transform duration-700">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
      </svg>
      <div class="absolute -bottom-2 left-2 w-2 h-4 bg-orange-500/50 blur-sm rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <div class="relative z-10 flex flex-col items-center gap-2 font-mono">
      <div class="flex items-center gap-4 text-xs text-gray-600 font-bold tracking-widest uppercase">
        <span>/// SIGNAL_LOST</span>
        <span class="w-1 h-1 bg-gray-600 rounded-full"></span>
        <span>END_OF_ARCHIVE</span>
      </div>
      <div class="text-[10px] text-gray-700 tracking-[0.2em] mt-2 flex items-center gap-2 hover:text-white transition-colors duration-500">
        <span class="inline-block w-2 h-2 border border-gray-600 rounded-sm"></span>
        BASE_STATION: Gu_uccy_
      </div>
    </div>
  </footer>
</template>

<style scoped>
.text-stroke { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3); }

.text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
}
.hobbies-title {
  will-change: transform;
}

.bubble {
  position: absolute;
  bottom: -30px;
  border-radius: 50%;
  animation: float-up infinite ease-in;
}
.bubble-1 { width: 12px; height: 12px; left: 15%; animation-duration: 7s; animation-delay: 0s; background: rgba(255, 255, 255, 0.3); }
.bubble-2 { width: 24px; height: 24px; left: 35%; animation-duration: 10s; animation-delay: 2s; background: rgba(255, 66, 66, 0.15); }
.bubble-3 { width: 8px; height: 8px; left: 55%; animation-duration: 6s; animation-delay: 1s; background: rgba(255, 255, 255, 0.5); }
.bubble-4 { width: 16px; height: 16px; left: 75%; animation-duration: 12s; animation-delay: 4s; background: rgba(255, 88, 88, 0.2); }
.bubble-5 { width: 10px; height: 10px; left: 25%; animation-duration: 8s; animation-delay: 3s; background: rgba(200, 200, 200, 0.3); }
.bubble-6 { width: 20px; height: 20px; left: 65%; animation-duration: 11s; animation-delay: 5s; background: rgba(245, 56, 56, 0.1); }
.bubble-7 { width: 6px; height: 6px; left: 85%; animation-duration: 5s; animation-delay: 1.5s; background: rgba(255, 255, 255, 0.4); }
.bubble-8 { width: 14px; height: 14px; left: 45%; animation-duration: 9s; animation-delay: 0.5s; background: rgba(220, 220, 220, 0.25); }
@keyframes float-up {
  0% {
    bottom: -30px;
    transform: translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  50% {
    transform: translateX(20px);
  }
  90% {
    opacity: 1;
  }
  100% {
    bottom: 100%;
    transform: translateX(-20px);
    opacity: 0;
  }
}

.animate-float-slow {
  animation: float 8s ease-in-out infinite;
}
.animate-vibrate {
  animation: vibrate 4s ease-in-out infinite;
}
@keyframes float {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes vibrate {
  0%, 100% { transform: translateY(0) rotate(-12deg); }
  25% { transform: translateY(-2px) rotate(-11deg); }
  50% { transform: translateY(1px) rotate(-13deg); }
  75% { transform: translateY(-1px) rotate(-12deg); }
}
@keyframes meteor {
  0% {
    transform: translate(100px, -100px) rotate(-45deg);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  20% {
    transform: translate(-300px, 300px) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: translate(-300px, 300px) rotate(-45deg);
    opacity: 0;
  }
}
</style>
