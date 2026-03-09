<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useBGM } from '@/composables/useBGM'
import { players } from "@/data/playerDb"

const router = useRouter()
const containerRef = ref(null)
useBGM('basketball', containerRef)

const tabs = ['PROFILE', 'STATS', 'MOMENTS']
const activeTab = ref('PROFILE')
const activePlayerId = ref('irving')
const isSwitching = ref(false)
const currentPlayer = computed(() => players.find(p => p.id === activePlayerId.value) || players[0])

// === 切换球员逻辑 ===
const switchPlayer = (id) => {
    if (activePlayerId.value === id || isSwitching.value) return
    isSwitching.value = true

    const tl = gsap.timeline({
        onComplete: async () => {
            activePlayerId.value = id
            activeTab.value = 'PROFILE'
            await nextTick()
            enterAnimation()
            isSwitching.value = false
        }
    })

    tl.to('.player-content', { opacity: 0, x: 20, duration: 0.3, ease: 'power2.in' })
      .to('.visual-card-wrap', { opacity: 0, scale: 0.9, rotateY: 10, duration: 0.3, ease: 'power2.in' }, "<")
}

const enterAnimation = () => {
    gsap.fromTo('.visual-card-wrap',
        { opacity: 0, scale: 0.9, rotateY: -10 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 0.6, ease: 'back.out(1.2)' }
    )
    gsap.fromTo('.player-content',
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    )
    if(activeTab.value === 'STATS') animateStats()
}

// === Tab 切换逻辑 ===
const animateTabChange = (newTab) => {
  if(activeTab.value === newTab) return
  gsap.to('.tab-inner', {
    opacity: 0, x: 20, duration: 0.3,
    onComplete: () => {
      activeTab.value = newTab
      nextTick(() => {
        gsap.fromTo('.tab-inner', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' })
        if (newTab === 'STATS') animateStats()
      })
    }
  })
}

const animateStats = () => {
  const statElements = document.querySelectorAll('.stat-value')
  statElements.forEach(el => {
    const target = parseFloat(el.getAttribute('data-value'))
    gsap.fromTo(el, { innerText: 0 }, { innerText: target, duration: 1.5, snap: { innerText: 1 }, ease: 'power3.out' })
  })
}

onMounted(() => {
    gsap.fromTo('.roster-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 0.6, stagger: 0.1, duration: 0.8, delay: 0.2, ease: 'power2.out', clearProps: 'x' }
    )
    enterAnimation()
})

const goBack = () => router.back()
</script>

<template>
  <div ref="containerRef" class="cyber-container min-h-screen bg-[#030303] overflow-x-hidden relative flex flex-col items-center justify-start font-sans selection:bg-theme-orange selection:text-black">

    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute inset-0 bg-[#050505]"></div>
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>
        <svg class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] opacity-[0.03] stroke-white stroke-[2px] fill-none transform -rotate-12" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="20" /> <rect x="10" y="10" width="80" height="80" /> <path d="M10,40 L90,40" /> <circle cx="50" cy="85" r="10" /> </svg>
        <svg class="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
            <path d="M 200 800 Q 400 600 600 500 T 900 300" fill="none" stroke="#FFA500" stroke-width="2" stroke-dasharray="10 5" class="animate-draw-line" />
            <text x="900" y="300" fill="#FFA500" font-family="monospace" font-size="24" class="animate-pulse">X</text>
            <path d="M 1200 200 Q 1000 400 800 600" fill="none" stroke="white" stroke-width="1" stroke-dasharray="8 8" class="animate-draw-line-slow" />
        </svg>
        <div class="absolute top-[-20%] left-[10%] w-200 h-200 bg-theme-orange/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div class="absolute bottom-[-20%] right-[0%] w-150 h-150 bg-red-600/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow delay-1000"></div>
    </div>

    <div class="absolute top-0 w-full p-8 md:p-10 flex justify-between items-start z-50 pointer-events-none">
      <button @click="goBack" class="group flex items-center gap-4 text-white/60 hover:text-[#FFA500] transition-colors duration-300 pointer-events-auto cursor-pointer">
        <div class="w-12 h-12 relative flex items-center justify-center border border-white/20 group-hover:border-[#FFA500] bg-black/40 backdrop-blur-md transition-all duration-300 overflow-hidden">
            <span class="text-2xl relative z-10 group-hover:-translate-x-full transition-transform duration-300 ease-out">←</span>
            <span class="absolute right-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out text-theme-orange font-bold font-tech pr-3">RE</span>

            <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#FFA500]"></div>
            <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#FFA500]"></div>
        </div>

        <div class="flex flex-col items-start font-tech relative">
            <span class="text-[10px] tracking-[0.2em] text-theme-orange opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute -top-3 left-0 whitespace-nowrap">
                system.abort()
            </span>
            <span class="font-bold tracking-widest text-sm text-shadow-glow transition-all duration-300 group-hover:tracking-[0.15em]">
                RETURN MENU
            </span>
        </div>
      </button>

        <div class="text-right">
            <h1 class="font-display text-5xl md:text-8xl font-bold uppercase italic tracking-tighter leading-none text-white mix-blend-difference relative">
                <span class="block relative z-10" data-text="ROSTER_DB">ROSTER_DB</span>
            </h1>
            <div class="flex justify-end items-center gap-3 text-[10px] font-tech text-theme-orange mt-2">
                <div class="flex items-center gap-2 border border-theme-orange/30 bg-theme-orange/5 px-2 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-theme-orange animate-pulse box-shadow-orange"></span>
                    <span>LIVE</span>
                </div>
                <span class="opacity-50">|</span>
                <span class="opacity-70">ONLINE // V.3.1.0</span>
            </div>
        </div>
    </div>

    <div class="relative z-10 w-full min-h-screen pt-40 pb-20 flex flex-col lg:flex-row gap-12 lg:gap-20 xl:gap-32 max-w-400 mx-auto px-6 md:px-12 items-center justify-start lg:justify-center">

        <div class="w-full lg:w-56 shrink-0 flex flex-row lg:flex-col gap-3 relative z-40 lg:border-r border-white/5 pl-2 pr-0 lg:pr-8 h-auto lg:h-[65vh] overflow-x-auto lg:overflow-y-auto custom-scrollbar order-1 py-2">
            <button v-for="(player, index) in players" :key="player.id" @click="switchPlayer(player.id)"
                class="roster-item opacity-0 group relative h-14 min-w-40 lg:w-full text-left transition-all duration-300 pointer-events-auto hover:opacity-100 shrink-0"
                :class="activePlayerId === player.id ? 'opacity-100!' : ''">

                <div class="absolute inset-0 bg-white/5 skew-x-[-10deg] transition-all duration-300"
                     :class="activePlayerId === player.id ? 'opacity-100 border-l-2 border-theme-orange shadow-[0_0_15px_rgba(255,165,0,0.1)]' : 'opacity-0 group-hover:opacity-30'"></div>

                <div class="absolute inset-0 flex items-center px-5 gap-4">
                    <span class="font-tech text-xs opacity-40 group-hover:opacity-100 transition-opacity">0{{ index + 1 }}</span>
                    <span class="font-display font-bold italic text-xl transition-all duration-300 whitespace-nowrap tracking-wide"
                          :class="activePlayerId === player.id ? 'text-theme-orange translate-x-2' : 'text-white group-hover:text-white/80'">
                        {{ player.name.split(' ')[0] }}
                    </span>
                </div>
            </button>
        </div>

        <div class="visual-card-wrap w-full max-w-85 lg:flex-1 flex justify-center items-center perspective-container min-w-0 order-2 z-10 py-8 lg:py-0">
            <div class="card">
                <div class="wrapper">
                    <img :src="currentPlayer.cardBg" class="cover-image" />
                </div>
                <div class="title-text-group">
                    <h2 class="hero-name" :data-text="currentPlayer.alias">{{ currentPlayer.alias }}</h2>
                </div>
                <img :src="currentPlayer.cutoutImg" class="character" />
            </div>
        </div>

        <div class="player-content w-full lg:w-112.5 shrink-0 flex flex-col relative bg-[#1c1c1f]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-137.5 lg:h-[75vh] shadow-2xl order-3 z-20">

            <div class="flex gap-8 mb-8 border-b border-white/10 shrink-0">
                <button v-for="tab in tabs" :key="tab" @click="animateTabChange(tab)"
                    class="pb-3 font-display text-xl font-bold italic tracking-wider transition-all duration-300 relative pointer-events-auto"
                    :class="activeTab === tab ? 'text-white' : 'text-white/30 hover:text-white/60'">
                    {{ tab }}
                    <span v-if="activeTab === tab" class="absolute bottom-0 left-0 w-full h-0.5 bg-theme-orange shadow-[0_0_15px_#FFA500]"></span>
                </button>
            </div>

            <div class="tab-inner flex-1 overflow-y-auto custom-scrollbar pr-4">
                <div v-if="activeTab === 'PROFILE'" class="space-y-8">
                    <div class="relative pl-6 border-l-2 border-theme-orange py-2">
                        <p class="font-display text-2xl italic text-white/90 leading-relaxed">"{{ currentPlayer.quote }}"</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4 text-xs font-tech text-gray-300">
                        <div class="bg-black/40 p-3 rounded border border-white/5 hover:border-white/20 transition-colors">
                            <span class="text-white/40 block mb-1">HEIGHT</span>
                            <span class="text-white text-base">{{ currentPlayer.height }}</span>
                        </div>
                        <div class="bg-black/40 p-3 rounded border border-white/5 hover:border-white/20 transition-colors">
                            <span class="text-white/40 block mb-1">WEIGHT</span>
                            <span class="text-white text-base">{{ currentPlayer.weight }}</span>
                        </div>
                        <div class="bg-black/40 p-3 rounded border border-white/5 hover:border-white/20 transition-colors col-span-2 flex justify-between items-center">
                            <span class="text-white/40">POSITION</span>
                            <span class="text-theme-orange text-base tracking-widest">{{ currentPlayer.positions.join(' / ') }}</span>
                        </div>
                    </div>

                    <div class="space-y-3 pt-2">
                        <div class="text-[10px] font-tech text-gray-500 tracking-[0.2em] mb-2">HONORS_LOG</div>
                        <div v-for="(honor, i) in currentPlayer.honors" :key="i"
                             class="flex items-center gap-4 text-sm font-display italic font-bold text-gray-300 border-b border-white/5 pb-2 hover:pl-2 transition-all cursor-default">
                            <span class="text-theme-orange font-tech text-xs">0{{ i+1 }}</span> {{ honor }}
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'STATS'" class="space-y-5">
                     <div v-for="stat in currentPlayer.stats" :key="stat.label"
                            class="bg-black/40 border border-white/5 p-5 rounded-lg flex justify-between items-center group hover:border-theme-orange transition-all duration-300 hover:bg-theme-orange/5">
                        <div>
                            <div class="text-[10px] font-tech text-gray-400 mb-1">{{ stat.label }}</div>
                            <div class="text-xs font-tech text-theme-orange opacity-0 group-hover:opacity-100 transition-opacity">AVG: {{ stat.avg }}</div>
                        </div>
                        <div class="text-4xl font-display font-black text-white italic group-hover:scale-110 transition-transform origin-right">
                            <span class="stat-value" :data-value="stat.value">0</span>
                        </div>
                    </div>
                </div>

                <div v-if="activeTab === 'MOMENTS'" class="space-y-6 pl-2">
                    <div v-for="(moment, i) in currentPlayer.moments" :key="i"
                            class="relative pl-8 pb-8 border-l border-white/10 last:pb-0 group hover:border-theme-orange/50 transition-colors">
                        <div class="absolute -left-1.25 top-1.5 w-2.5 h-2.5 rounded-full bg-[#1c1c1f] border border-white/30 group-hover:border-theme-orange group-hover:bg-theme-orange group-hover:scale-150 transition-all duration-300 shadow-[0_0_10px_black] z-10"></div>
                        <div class="text-[10px] font-tech text-gray-500 mb-1 tracking-widest group-hover:text-theme-orange transition-colors">{{ moment.date }}</div>
                        <h4 class="text-xl font-display font-bold italic text-white group-hover:text-theme-orange transition-colors leading-tight mb-2">{{ moment.event }}</h4>
                        <p class="text-xs text-gray-400 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity border-l-2 border-transparent group-hover:border-white/10 pl-0 group-hover:pl-3 duration-300">
                            {{ moment.desc }}
                        </p>
                    </div>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>

<style scoped>
/* 核心颜色定义 */
.text-theme-orange { color: #FFA500; }
.bg-theme-orange { background-color: #FFA500; }
.border-theme-orange { border-color: #FFA500; }
.box-shadow-orange { box-shadow: 0 0 10px #FFA500; }
.text-shadow-glow { text-shadow: 0 0 10px rgba(255, 165, 0, 0.5); }

/* 字体 */
.font-display { font-family: 'Rajdhani', sans-serif; }
.font-tech { font-family: 'Share Tech Mono', monospace; }

/* 动画效果 */
.animate-draw-line {
    stroke-dashoffset: 1000;
    stroke-dasharray: 10 10;
    animation: dash 10s linear infinite;
}
.animate-draw-line-slow {
    stroke-dashoffset: 1000;
    stroke-dasharray: 8 8;
    animation: dash 15s linear infinite reverse;
}
@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

.clip-corner-xs { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%); }
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #FFA500; }

/* === 3D 卡片效果 (CSS 保持不变) === */
.perspective-container { perspective: 2500px; }
.card {
    width: 300px; height: 550px;
    position: relative; display: flex; justify-content: center; align-items: center;
    transition: all 0.5s; z-index: 10;
}
.wrapper {
    transition: all 0.7s; position: absolute; width: 100%; height: 100%;
    z-index: -1; overflow: hidden; border-radius: 12px;
    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
}
.cover-image { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6); }

.title-text-group {
    width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    text-align: center; transition: transform 0.7s; z-index: 5; pointer-events: none;
}
.hero-name {
    font-family: 'Rajdhani', sans-serif; font-weight: 900; font-style: italic; font-size: 3.5rem;
    line-height: 0.8; color: transparent;
    -webkit-text-stroke: 1px #FFA500;
    text-shadow: 0 0 20px rgba(0,0,0,0.5); white-space: nowrap;
}
.character {
    width: 110%; height: auto; max-height: 100%; opacity: 0;
    transition: all 0.7s; position: absolute; bottom: 0; z-index: 10;
    pointer-events: none; transform-origin: bottom center;
}

/* Hover 动效 */
.card:hover .wrapper {
    transform: perspective(900px) translateY(-5%) rotateX(25deg) translateZ(0);
    box-shadow: 2px 35px 32px -8px rgba(0, 0, 0, 0.75);
}
.wrapper::before, .wrapper::after {
    content: ""; opacity: 0; width: 100%; height: 80px; transition: all 0.7s; position: absolute; left: 0;
}
.wrapper::before {
    top: 0; height: 100%;
    background-image: linear-gradient(to top, transparent 46%, rgba(12, 13, 19, 0.5) 68%, rgba(12, 13, 19) 97%);
}
.wrapper::after {
    bottom: 0; opacity: 1;
    background-image: linear-gradient(to bottom, transparent 46%, rgba(12, 13, 19, 0.5) 68%, rgba(12, 13, 19) 97%);
}
.card:hover .wrapper::before, .card:hover .wrapper::after { opacity: 1; }
.card:hover .wrapper::after { height: 120px; }
.card:hover .title-text-group { transform: translate3d(-50%, -80px, 100px); }
.card:hover .character { opacity: 1; transform: translate3d(0%, -10%, 100px) scale(1.1); }
</style>
