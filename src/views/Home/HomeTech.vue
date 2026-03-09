<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBGM } from "@/composables/useBGM";

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref(null)
const lines = ref([])
useBGM('tech', containerRef)

// 鼠标追踪逻辑
const mousePos = ref({ x: 0, y: 0 })
const handleMouseMove = (e) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mousePos.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }
}

const skills = [
  { id: 'js', label: 'JAVASCRIPT', sub: 'ES6+ Core', desc: '现代 Web 开发的基石，掌握闭包、原型链及异步编程。', type: 'root', status: 'unlocked', gridPos: 'md:col-start-2 md:row-start-1' },
  { id: 'html', label: 'HTML/CSS', sub: 'Semantic', desc: '构建语义化结构与响应式布局，精通 Flexbox 与 Grid。', type: 'base', status: 'unlocked', gridPos: 'md:col-start-1 md:row-start-2' },
  { id: 'vue', label: 'VUE.JS', sub: 'Framework', desc: '渐进式框架，深入理解响应式原理、组合式 API 及生命周期。', type: 'core', status: 'unlocked', gridPos: 'md:col-start-2 md:row-start-2' },
  { id: 'ts', label: 'TYPESCRIPT', sub: 'Strict Type', desc: '强类型超集，提升代码健壮性与可维护性，精通泛型应用。', type: 'base', status: 'unlocked', gridPos: 'md:col-start-3 md:row-start-2' },
  { id: 'router', label: 'ROUTER', sub: 'SPA Nav', desc: '管理单页应用路由，处理导航守卫与动态路由加载。', type: 'tool', status: 'unlocked', gridPos: 'md:col-start-1 md:row-start-3' },
  { id: 'pinia', label: 'PINIA', sub: 'State Mgt', desc: '新一代状态管理库，轻量、直观，完美契合 Composition API。', type: 'tool', status: 'unlocked', gridPos: 'md:col-start-2 md:row-start-3' },
  { id: 'vite', label: 'VITE', sub: 'Build Tool', desc: '极速前端构建工具，基于 ESM 提供闪电般的热更新体验。', type: 'tool', status: 'unlocked', gridPos: 'md:col-start-3 md:row-start-3' },
  { id: 'tailwind', label: 'TAILWIND', sub: 'Utility', desc: '原子化 CSS 框架，极大提升样式开发效率与设计一致性。', type: 'creative', status: 'unlocked', gridPos: 'md:col-start-1 md:row-start-4' },
  { id: 'gsap', label: 'GSAP', sub: 'Motion', desc: '专业级 Web 动画库，实现复杂的序列动画与滚动交互。', type: 'creative', status: 'unlocked', gridPos: 'md:col-start-2 md:row-start-4' },
  { id: 'three', label: 'THREE.JS', sub: 'WebGL', desc: '在浏览器中构建 3D 场景，探索 WebGL 的无限视觉可能。', type: 'creative', status: 'unlocked', gridPos: 'md:col-start-3 md:row-start-4' },
  { id: 'react', label: 'REACT', sub: 'Syncing...', desc: '正在同步 React 生态系统知识库...', type: 'tool', status: 'unlocked', progress: 55, gridPos: 'md:col-start-1 md:row-start-5' },
  { id: 'next', label: 'NEXT.JS', sub: 'Pending', desc: '服务端渲染框架，等待前置技能解锁。', type: 'tool', status: 'unlocking', gridPos: 'md:col-start-2 md:row-start-5' },
  { id: 'webgpu', label: 'WEBGPU', sub: 'Unknown', desc: '下一代图形 API，数据未收录。', type: 'creative', status: 'unlocking', gridPos: 'md:col-start-3 md:row-start-5' },
]

const connections = [
  { from: 'js', to: 'vue' },
  { from: 'js', to: 'html' },
  { from: 'js', to: 'gsap' },
  { from: 'js', to: 'ts' },
  { from: 'js', to: 'three' },
  { from: 'js', to: 'react' },
  { from: 'vue', to: 'pinia' },
  { from: 'vue', to: 'router' },
  { from: 'vue', to: 'vite' },
  { from: 'html', to: 'tailwind' },
  { from: 'react', to: 'next' },
  { from: 'three', to: 'webgpu' },
]

const updateConnections = () => {
  if (!containerRef.value) return
  const newLines = []

  connections.forEach(conn => {
    const fromEl = document.getElementById(`node-${conn.from}`)
    const toEl = document.getElementById(`node-${conn.to}`)

    if (fromEl && toEl) {
      const x1 = fromEl.offsetLeft + fromEl.offsetWidth / 2
      const y1 = fromEl.offsetTop + fromEl.offsetHeight / 2
      const x2 = toEl.offsetLeft + toEl.offsetWidth / 2
      const y2 = toEl.offsetTop + toEl.offsetHeight / 2

      const midY = (y1 + y2) / 2
      const path = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`

      const targetSkill = skills.find(s => s.id === conn.to)
      const isLockedLink = targetSkill && targetSkill.status === 'locked'

      newLines.push({
          id: `${conn.from}-${conn.to}`,
          path,
          from: conn.from,
          to: conn.to,
          isLocked: isLockedLink
      })
    }
  })
  lines.value = newLines
}

const activeNode = ref(null)
const hoveredSkillInfo = ref(null)

const handleMouseEnter = (skill) => {
    if (skill.status !== 'locked') {
        activeNode.value = skill.id
        hoveredSkillInfo.value = skill
    }
}
const handleMouseLeave = () => {
    activeNode.value = null
    hoveredSkillInfo.value = null
}
const isLineActive = (line) => !line.isLocked && (activeNode.value === line.from || activeNode.value === line.to)

const initMeteorShower = () => {
  const stars = gsap.utils.toArray('.static-star')
  stars.forEach(star => {
    gsap.set(star, {
      x: gsap.utils.random(0, window.innerWidth),
      y: gsap.utils.random(0, window.innerHeight),
      opacity: gsap.utils.random(0.1, 0.4),
      scale: gsap.utils.random(0.5, 1)
    })
    gsap.to(star, {
      opacity: gsap.utils.random(0.5, 0.8),
      duration: gsap.utils.random(1, 3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  })

  const meteors = gsap.utils.toArray('.shooting-meteor')
  meteors.forEach(meteor => {
    const resetMeteor = () => {
      const startX = gsap.utils.random(window.innerWidth * 0.2, window.innerWidth * 1.5)
      const startY = gsap.utils.random(-100, window.innerHeight * 0.5)

      gsap.set(meteor, {
        x: startX,
        y: startY,
        rotation: -45,
        opacity: 0,
        scale: gsap.utils.random(0.8, 1.5)
      })

      gsap.to(meteor, {
        x: '-=1500',
        y: '+=1500',
        opacity: 0.6,
        duration: gsap.utils.random(4, 6),
        ease: 'power1.in',
        onStart: () => gsap.to(meteor, { opacity: 0, duration: 0.3, delay: 0.2 }),
        onComplete: resetMeteor,
        delay: gsap.utils.random(0, 5)
      })
    }
    resetMeteor()
  })
}

const initFloatingNodes = () => {
    gsap.utils.toArray('.skill-node-inner').forEach((node) => {
        gsap.to(node, {
            y: -8,
            duration: gsap.utils.random(2, 4),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: gsap.utils.random(0, 2)
        })
    })
}

const initScrollParallax = () => {
  gsap.set(containerRef.value, { perspective: 1000 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: containerRef.value,
      start: "top 85%",
      end: "center center",
      scrub: 1.5,
    }
  })

  tl.to('.bg-star-field', {
    z: -300,
    scale: 1.1,
    opacity: 0.8,
    ease: 'power1.inOut'
  }, 0)

  const nodes = gsap.utils.toArray('.skill-node')
  nodes.forEach((node, index) => {
    const col = index % 3;
    const xOffset = (col - 1) * 150;

    tl.from(node, {
      y: 150,
      z: -500,
      rotationX: -45,
      rotationY: xOffset / 10,
      opacity: 0,
      scale: 0.5,
      duration: 1.2,
      ease: "power2.out"
    }, index * 0.05)
  })

  tl.from('.header-section', {
    y: -100,
    z: 200,
    opacity: 0,
    scale: 0.9,
    ease: 'power3.out'
  }, 0)
}

onMounted(async () => {
  await nextTick()

  const ctx = gsap.context(() => {
    initMeteorShower()
    initFloatingNodes()
    initScrollParallax()

    gsap.from('.header-reveal', {
        scrollTrigger: { trigger: '.header-section', start: 'top 80%' },
        y: 50, opacity: 0, duration: 0.2, stagger: 0.2, ease: 'power3.out'
    })

  }, containerRef.value)

  setTimeout(async () => {
      updateConnections()
      await nextTick()

      ctx.add(() => {
        if (document.querySelectorAll('.connection-path').length > 0) {
            gsap.set('.connection-path', { strokeDasharray: 2000, strokeDashoffset: 2000 })

            ScrollTrigger.batch('.connection-path', {
              onEnter: batch => {
                gsap.to(batch, {
                  strokeDashoffset: 0,
                  duration: 1.5,
                  ease: 'power2.inOut',
                  stagger: {
                    each: 0.1,
                    from: "start"
                  }
                })
              },
              start: 'top 75%'
            })
        }
      })
      ScrollTrigger.refresh()
  }, 300)

  window.addEventListener('resize', () => {
    updateConnections()
    ScrollTrigger.refresh()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateConnections)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section
    ref="containerRef"
    @mousemove="handleMouseMove"
    class="min-h-screen w-full bg-black relative flex flex-col items-center justify-center py-24 overflow-hidden select-none font-mono"
  >

    <div class="bg-star-field absolute inset-0 pointer-events-none z-0">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[41px_41px] opacity-30">
        </div>

        <div v-for="n in 60" :key="`star-${n}`" class="static-star absolute w-0.5 h-0.5 bg-white rounded-full"></div>
        <div v-for="n in 30" :key="`meteor-${n}`"
             class="shooting-meteor absolute w-50 h-px bg-linear-to-l from-transparent via-white/80 to-transparent mix-blend-screen origin-left">
             <div class="absolute top-0 right-0 w-1/3 h-full bg-chic-red/50 blur-[2px]"></div>
        </div>
    </div>

    <div class="hobbies-title mb-24 text-center z-10 pointer-events-none header-section">
        <h2 class="text-5xl md:text-7xl font-black italic tracking-tighter mix-blend-difference cursor-default pointer-events-auto group">
            <span class="text-chic-red mr-2">SKILL</span>
            <span class="text-stroke text-transparent transition-colors duration-200 group-hover:text-white">TREE</span>
        </h2>
        <div class="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.5em] opacity-60">SYSTEM_STATUS: ONLINE</div>
    </div>

    <div class="skill-tree-container relative z-10 w-full max-w-4xl px-4">
        <svg class="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
          <defs>
              <filter id="glow-line" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                  </feMerge>
              </filter>
          </defs>

            <g v-for="line in lines" :key="line.id">
                <path :d="line.path"
                      fill="none"
                      :stroke="line.isLocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.08)'"
                      :stroke-dasharray="line.isLocked ? '5,5' : 'none'"
                      stroke-width="1"
                />

                <path v-if="!line.isLocked"
                      :d="line.path"
                      class="connection-path transition-all duration-300"
                      fill="none"
                      :stroke="isLineActive(line) ? '#CE1141' : 'rgba(255,255,255,0.15)'"
                      :stroke-width="isLineActive(line) ? 2.5 : 1"
                      :filter="isLineActive(line) ? 'url(#glow-line)' : ''"
                      stroke-linecap="round"
                />

                <circle v-if="!line.isLocked && isLineActive(line)" r="2" fill="#fff">
                    <animateMotion :dur="`${Math.random() * 1 + 1}s`" repeatCount="indefinite" :path="line.path">
                    </animateMotion>
                </circle>
            </g>
        </svg>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-20 justify-items-center">
            <div v-for="skill in skills" :key="skill.id"
                 :id="`node-${skill.id}`"
                 class="skill-node relative group w-full flex justify-center"
                 :class="[
                    skill.gridPos,
                    skill.status === 'locked' ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer'
                 ]"
                 @mouseenter="handleMouseEnter(skill)"
                 @mouseleave="handleMouseLeave"
            >
                <div class="skill-node-inner w-28 h-28 md:w-32 md:h-32 relative flex items-center justify-center transition-all duration-500 ease-out z-10"
                     :class="{ 'scale-110': activeNode === skill.id && skill.status !== 'locked' }"
                >
                    <div class="absolute inset-0 transform rotate-45 border transition-all duration-300"
                         :class="[
                            skill.status === 'unlocked' && skill.type === 'root' ? 'bg-chic-red/10 border-chic-red shadow-[0_0_30px_rgba(206,17,65,0.4)]' :
                            skill.status === 'unlocked' ? 'bg-black/80 backdrop-blur-md border-white/10 group-hover:border-chic-red group-hover:bg-chic-red/5 group-hover:shadow-[0_0_20px_rgba(206,17,65,0.25)]' :
                            skill.status === 'unlocking' ? 'bg-black/60 border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse' :
                            'bg-black/40 border-white/5 border-dashed'
                         ]"
                    >
                        <div class="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                    </div>

                    <div class="relative z-20 text-center transform -translate-y-1">
                        <div class="mx-auto mb-3 transition-colors duration-300 flex justify-center items-center">
                            <div v-if="skill.status === 'locked'" class="text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div v-else-if="skill.status === 'unlocking'" class="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                            <div v-else class="w-1.5 h-1.5 rounded-full shadow-[0_0_5px_currentColor]" :class="skill.type === 'root' ? 'bg-chic-red animate-pulse' : 'bg-gray-500 group-hover:bg-chic-red'"></div>
                        </div>

                        <h3 class="text-sm md:text-base font-black text-white tracking-tight mb-1 transition-colors"
                            :class="{ 'text-chic-red': activeNode === skill.id, 'text-cyan-400': skill.status === 'unlocking', 'text-gray-600': skill.status === 'locked' }">
                            {{ skill.label }}
                        </h3>

                        <p class="text-[9px] font-bold tracking-widest uppercase border-t pt-1 mt-1 transition-colors"
                           :class="[
                               skill.status === 'locked' ? 'text-gray-700 border-gray-800' :
                               skill.status === 'unlocking' ? 'text-cyan-400/80 border-cyan-400/30' :
                               'text-gray-500 border-white/5'
                           ]">
                            <span v-if="skill.status === 'unlocking'">{{ skill.progress }}% LOADING</span>
                            <span v-else-if="skill.status === 'locked'">LOCKED</span>
                            <span v-else>{{ skill.sub }}</span>
                        </p>
                    </div>

                    <div v-if="skill.status === 'unlocked'" class="absolute inset-0 transform rotate-45 overflow-hidden pointer-events-none">
                        <div class="absolute top-0 left-0 w-full h-[200%] bg-linear-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-700 ease-in-out"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="fixed bottom-6 left-6 z-50 pointer-events-none hidden md:block">
        <transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4 scale-95"
            enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-4 scale-95"
        >
            <div v-if="hoveredSkillInfo" class="w-64 bg-black/80 backdrop-blur border border-white/10 p-4 rounded-sm shadow-2xl relative overflow-hidden">
                 <div class="absolute top-0 left-0 w-2 h-2 border-t border-l border-chic-red"></div>
                 <div class="absolute top-0 right-0 w-2 h-2 border-t border-r border-chic-red"></div>
                 <div class="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-chic-red"></div>
                 <div class="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-chic-red"></div>

                 <div class="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                    <span class="text-chic-red font-bold text-xs tracking-widest">DATA_LOG // {{ hoveredSkillInfo.id.toUpperCase() }}</span>
                    <span class="w-1.5 h-1.5 bg-chic-red rounded-full animate-pulse"></span>
                 </div>

                 <div class="space-y-2">
                     <div class="text-white font-bold text-lg">{{ hoveredSkillInfo.label }}</div>
                     <div class="text-gray-400 text-xs leading-relaxed font-mono">
                         &gt; {{ hoveredSkillInfo.desc }}
                     </div>
                 </div>

                 <div class="mt-3 pt-2 border-t border-white/5 flex justify-between text-[9px] text-gray-600 font-mono uppercase">
                     <span>Type: {{ hoveredSkillInfo.type }}</span>
                     <span>Stat: {{ hoveredSkillInfo.status }}</span>
                 </div>
            </div>
        </transition>
    </div>

  </section>
</template>

<style scoped>
.text-chic-red { color: #CE1141; }
.bg-chic-red { background-color: #CE1141; }
.border-chic-red { border-color: #CE1141; }
.text-stroke { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3); }
.bg-size-\[41px_41px\] { background-size: 41px 41px; }

.text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
}
.hobbies-title {
  will-change: transform;
}

.skill-tree-container {
    display: block;
}
</style>
