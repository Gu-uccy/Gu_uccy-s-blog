<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useBGM } from '@/composables/useBGM'
import { useMusicStore } from '@/stores/musicStore'

import multikillImgUrl from '@/assets/img/multikill.png'
import awpImgUrl from '@/assets/img/awp.png'
import clutchImgUrl from '@/assets/img/clutch.png'
import pistolImgUrl from '@/assets/img/pistol.png'
import ecoImgUrl from '@/assets/img/eco.png'


const router = useRouter()
const musicStore = useMusicStore()
const trackRef = ref(null)
const containerRef = ref(null)
let scrollTween = null

useBGM('cs2', containerRef)

const originalClips = [
  {
    id: 'multikill',
    title: 'MULTI_KILL',
    subtitle: 'ACE IN THE HOLE // RAMPAGE',
    date: 'LOG_2024.01.15',
    thumbnail: multikillImgUrl,
    videoUrl: 'https://www.bilibili.com/video/BV1gQPDzsEgW',
    tags: ['ACE', 'SPRAY_TRANSFER', 'V.HIGHS']
  },
  {
    id: 'awp',
    title: 'AWP_SHOT',
    subtitle: 'ONE SHOT // TERMINAL VELOCITY',
    date: 'LOG_2025.12.08',
    thumbnail: awpImgUrl,
    videoUrl: 'https://www.bilibili.com/video/BV1gQPDzsE9X',
    tags: ['FLICK', 'REACTION_MS', 'MIRAGE']
  },
  {
    id: 'clutch',
    title: 'CLUTCH_TIME',
    subtitle: '1 VS 4 // AGAINST PROBABILITY',
    date: 'LOG_2025.12.22',
    thumbnail: clutchImgUrl,
    videoUrl: 'https://www.bilibili.com/video/BV1gQPDzsEc6',
    tags: ['IQ_200', 'ISOLATION', 'DEFUSE']
  },
  {
    id: 'pistol',
    title: 'PISTOL_SHOT',
    subtitle: 'USP-S // SURGICAL PRECISION',
    date: 'LOG_2025.11.10',
    thumbnail: pistolImgUrl,
    videoUrl: 'https://www.bilibili.com/video/BV1uQPDzsEQ9',
    tags: ['CRISP', 'CROSSHAIR', 'ECO_RD']
  },
  {
    id: 'eco',
    title: 'ECO_KILL',
    subtitle: 'DESERT_EAGLE // ONE_TAP',
    date: 'LOG_2025.11.26',
    thumbnail: ecoImgUrl,
    videoUrl: 'https://www.bilibili.com/video/BV1gQPDzsEgH',
    tags: ['HEADSHOT', 'SNAP', 'AGILITY']
  }
]
// 增加数据量以保证滚动平滑
const filmClips = ref([...originalClips, ...originalClips, ...originalClips, ...originalClips])

// 滚动动画
onMounted(() => {
  const totalWidth = trackRef.value.scrollWidth / 4
  gsap.set(trackRef.value, { x: 0 })

  scrollTween = gsap.to(trackRef.value, {
    x: `-=${totalWidth}`,
    duration: 30,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
    }
  })
})

onUnmounted(() => {
  if (scrollTween) scrollTween.kill()
})

// 交互逻辑
const openCinema = (clip) => {
  if (musicStore.audio) {
    gsap.to(musicStore.audio, { volume: 0, duration: 0.5 })
  }
  if (clip.videoUrl) window.open(clip.videoUrl, '_blank')
}

const handleMouseEnter = (e) => {
  gsap.to(scrollTween, { timeScale: 0.05, duration: 0.5 })
  const card = e.currentTarget

  gsap.to(card, {
    scale: 1.1,
    y: -10,
    zIndex: 50,
    boxShadow: '0 0 60px rgba(206, 17, 65, 0.4)',
    borderColor: '#CE1141',
    duration: 0.3,
    ease: 'back.out(1.2)'
  })
  gsap.to('.film-frame:not(:hover)', {
    opacity: 0.15,
    filter: 'grayscale(100%) blur(4px) brightness(0.5)',
    scale: 0.95,
    duration: 0.3
  })
}
const handleMouseLeave = (e) => {
  gsap.to(scrollTween, { timeScale: 1, duration: 0.5 })
  const card = e.currentTarget
  gsap.to(card, {
    scale: 1,
    y: 0,
    zIndex: 1,
    boxShadow: 'none',
    borderColor: 'rgba(255,255,255,0.1)',
    duration: 0.4,
    ease: 'power2.out'
  })
  gsap.to('.film-frame', {
    opacity: 1,
    filter: 'grayscale(0%) blur(0px) brightness(1)',
    scale: 1,
    duration: 0.4
  })
}

const goBack = () => router.back()
</script>

<template>
  <div ref="containerRef" class="cyber-container min-h-screen bg-[#030303] overflow-hidden relative flex flex-col items-center justify-center font-sans selection:bg-chic-red selection:text-black">

    <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(206,17,65,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(206,17,65,0.05)_1px,transparent_1px)] bg-length-[40px_40px] transform-[perspective(500px)_rotateX(60deg)] origin-bottom opacity-20"></div>
        <div class="absolute top-[-20%] left-[10%] w-150 h-150 bg-chic-red/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[10%] w-125 h-125 bg-blue-900/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div class="absolute top-0 left-10 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
        <div class="absolute top-0 right-10 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
    </div>

    <div class="absolute top-0 w-full p-8 md:p-10 flex justify-between items-start z-50 pointer-events-none">
        <button @click="goBack" class="group flex items-center gap-4 text-white/60 hover:text-chic-red transition-colors duration-300 pointer-events-auto cursor-pointer">
            <div class="w-12 h-12 relative flex items-center justify-center border border-white/20 group-hover:border-chic-red bg-black/40 backdrop-blur-md transition-all duration-300 overflow-hidden">
                <span class="text-2xl relative z-10 group-hover:-translate-x-full transition-transform duration-300 ease-out">←</span>
                <span class="absolute right-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out text-chic-red font-bold font-tech pr-3">RE</span>
                <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-chic-red"></div>
                <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-chic-red"></div>
            </div>

            <div class="flex flex-col items-start font-tech relative">
                <span class="text-[10px] tracking-[0.2em] text-chic-red opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute -top-3 left-0 whitespace-nowrap">
                    system.abort()
                </span>
                <span class="font-bold tracking-widest text-sm text-shadow-glow transition-all duration-300 group-hover:tracking-[0.15em]">
                    RETURN MENU
                </span>
            </div>
        </button>

        <div class="text-right">
            <h1 class="font-display text-6xl md:text-7xl font-bold uppercase italic tracking-tighter leading-none text-white mix-blend-difference relative">
                <span class="block relative z-10" data-text="REPLAY_DB">REPLAY_DB</span>
            </h1>

            <div class="flex justify-end items-center gap-3 text-[10px] font-tech text-chic-red mt-2">
                <div class="flex items-center gap-2 border border-chic-red/30 bg-chic-red/5 px-2 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-chic-red animate-pulse box-shadow-red"></span>
                    <span>REC_MODE</span>
                </div>
                <span class="opacity-50">|</span>
                <span class="opacity-70">LIVE_FEED // V.2.0.4</span>
            </div>
        </div>
    </div>

    <div class="w-full relative z-20 py-24 perspective-container">

        <div class="absolute top-16 left-0 w-full h-px bg-linear-to-r from-transparent via-chic-red/30 to-transparent z-30"></div>
        <div class="absolute bottom-16 left-0 w-full h-px bg-linear-to-r from-transparent via-chic-red/30 to-transparent z-30"></div>

        <div ref="trackRef" class="flex items-center gap-8 pl-8 will-change-transform">
            <div
              v-for="(clip, index) in filmClips"
              :key="`${clip.id}-${index}`"
              class="film-frame relative shrink-0 w-[320px] h-120 bg-[#080808] cursor-pointer group transition-all duration-300 select-none border border-white/10 hover:border-chic-red"
              @mouseenter="(e) => handleMouseEnter(e, index)"
              @mouseleave="handleMouseLeave"
              @click="openCinema(clip)"
            >
                <div class="absolute inset-0 z-20 pointer-events-none clip-corner border-2 border-transparent group-hover:border-chic-red/30 transition-all duration-500"></div>

                <div class="absolute inset-px z-10 overflow-hidden bg-black clip-corner-inner">
                    <img
                      :src="clip.thumbnail"
                      :alt="clip.title"
                      class="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                    />
                    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div class="absolute inset-0 bg-scanlines opacity-30 pointer-events-none"></div>
                    <div class="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40 opacity-80"></div>
                </div>

                <div class="absolute inset-0 z-30 p-6 flex flex-col justify-between transition-opacity duration-300 group-hover:opacity-0">
                    <div class="flex justify-between items-start">
                        <span class="text-6xl font-display font-bold text-white/10 leading-none absolute -top-4 -left-2">{{ String((index % originalClips.length) + 1).padStart(2, '0') }}</span>
                        <div class="ml-auto w-6 h-6 border border-white/20 flex items-center justify-center relative">
                            <div class="absolute inset-0 bg-chic-red/20"></div>
                            <div class="w-1.5 h-1.5 bg-chic-red box-shadow-red"></div>
                        </div>
                    </div>

                    <div class="relative pl-2 border-l-2 border-chic-red/50">
                        <div class="text-[10px] font-tech text-chic-red mb-1 tracking-widest uppercase">{{ clip.date }}</div>
                        <h2 class="text-4xl font-display font-bold text-white italic leading-[0.85] mb-2">{{ clip.title }}</h2>
                        <p class="text-xs text-gray-400 font-tech uppercase tracking-wide">{{ clip.subtitle }}</p>
                    </div>
                </div>

                <div class="absolute inset-0 z-40 p-5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                     <div class="flex justify-between w-full border-b border-white/10 pb-2">
                         <span class="bg-chic-red text-black text-[10px] font-bold px-1.5 py-0.5 font-tech">PLAYING_NOW</span>
                         <div class="flex flex-col items-end leading-none">
                            <span class="text-chic-red text-[10px] font-tech tracking-widest">FPS:240</span>
                            <span class="text-white/30 text-[8px] font-tech">LATENCY: 2ms</span>
                         </div>
                     </div>

                     <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                        <div class="w-1 h-1 bg-white/50"></div>
                        <div class="absolute inset-0 border-t border-b border-chic-red/50 rounded-full animate-spin-slow"></div>
                     </div>

                     <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                         <div class="flex flex-wrap gap-1.5 mb-3">
                             <span v-for="tag in clip.tags" :key="tag" class="text-[9px] font-tech text-white bg-white/5 border border-white/10 px-2 py-0.5 hover:border-chic-red/50 transition-colors">
                                 #{{ tag }}
                             </span>
                         </div>
                         <div class="flex items-center gap-2">
                             <div class="h-1 flex-1 bg-white/10 relative overflow-hidden">
                                 <div class="absolute inset-0 bg-chic-red w-full animate-progress-loading origin-left"></div>
                             </div>
                             <span class="text-[8px] font-mono text-chic-red animate-pulse">LOADING_DATA...</span>
                         </div>
                     </div>
                </div>

                <div class="absolute -right-6 bottom-20 rotate-90 text-[8px] font-tech text-white/20 flex gap-2 tracking-[0.2em] origin-center">
                    <span class="text-chic-red">///</span>
                    <span>ENCRYPTED_ID_{{ clip.id.toUpperCase() }}</span>
                </div>
            </div>
        </div>
    </div>

    <div class="absolute bottom-8 w-full max-w-[95%] flex justify-between items-end border-t border-white/10 pt-4 text-[10px] font-tech text-gray-500 z-50">
        <div class="flex gap-12">
            <div class="flex flex-col gap-1">
                <span class="text-[8px] text-white/20 tracking-widest">CONNECTED SERVER</span>
                <span class="text-chic-red font-bold flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-chic-red rounded-full animate-pulse"></span>
                    HK_OFFICIAL_MM_01
                </span>
            </div>
            <div class="flex flex-col gap-1">
                 <span class="text-[8px] text-white/20 tracking-widest">PACKET LOSS</span>
                 <span class="text-white">0.00%</span>
            </div>
        </div>

        <div class="hidden md:flex gap-0.5 items-end h-8 opacity-30">
            <div v-for="i in 20" :key="i" class="w-1 bg-chic-red" :style="{ height: Math.random() * 100 + '%' }"></div>
        </div>

        <div class="flex items-center gap-4">
            <div class="text-right">
                <div class="text-white font-bold">SYSTEM_READY</div>
                <div class="text-[8px] text-white/30">WAITING FOR INPUT</div>
            </div>
            <div class="w-8 h-8 border border-white/20 grid place-items-center text-chic-red">
                <div class="w-4 h-4 bg-chic-red/20 animate-pulse"></div>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
.text-chic-red { color: #CE1141; }
.bg-chic-red { background-color: #CE1141; }
.border-chic-red { border-color: #CE1141; }

/* 字体设置 */
.font-display { font-family: 'Rajdhani', sans-serif; }
.font-tech { font-family: 'Share Tech Mono', monospace; }

/* 霓虹光效 */
.text-shadow-glow {
  text-shadow: 0 0 10px rgba(206, 17, 65, 0.5);
}
.box-shadow-red {
  box-shadow: 0 0 10px #CE1141;
}

/* 扫描线效果 */
.bg-scanlines {
    background: linear-gradient(
        to bottom,
        rgba(255,255,255,0),
        rgba(255,255,255,0) 50%,
        rgba(0,0,0,0.4) 50%,
        rgba(0,0,0,0.4)
    );
    background-size: 100% 3px;
}

/* 战术切角 */
.clip-corner {
    clip-path: polygon(
        0 0,
        100% 0,
        100% calc(100% - 30px),
        calc(100% - 30px) 100%,
        0 100%
    );
}
.clip-corner-inner {
    clip-path: polygon(
        0 0,
        100% 0,
        100% calc(100% - 29px),
        calc(100% - 29px) 100%,
        0 100%
    );
}

/* 加载动画 */
@keyframes progress-loading {
    0% { transform: scaleX(0); }
    50% { transform: scaleX(1); }
    100% { transform: scaleX(0); transform-origin: right; }
}
.animate-progress-loading {
    animation: progress-loading 1.5s infinite ease-in-out;
}

/* 旋转动画 */
.animate-spin-slow {
    animation: spin 8s linear infinite;
}
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* 故障文字效果 */
@keyframes glitch-1 {
    0% { transform: none; opacity: 1; }
    7% { transform: skew(-0.5deg, -0.9deg); opacity: 0.75; }
    10% { transform: none; opacity: 1; }
    27% { transform: none; opacity: 1; }
    30% { transform: skew(0.8deg, -0.1deg); opacity: 0.75; }
    35% { transform: none; opacity: 1; }
    52% { transform: none; opacity: 1; }
    55% { transform: skew(-1deg, 0.2deg); opacity: 0.75; }
    50% { transform: none; opacity: 1; }
    72% { transform: none; opacity: 1; }
    75% { transform: skew(0.4deg, 1deg); opacity: 0.75; }
    80% { transform: none; opacity: 1; }
    100% { transform: none; opacity: 1; }
}

.glitch-text {
    position: relative;
}
.glitch-text::before,
.glitch-text::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
}
.glitch-text::before {
    color: #0ff;
    z-index: -1;
    animation: glitch-effect 3s infinite;
}
.glitch-text::after {
    color: #f00;
    z-index: -2;
    animation: glitch-effect 2s infinite reverse;
}

@keyframes glitch-effect {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
}

/* Transition 动画 */
.cinema-enter-active,
.cinema-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.cinema-enter-from,
.cinema-leave-to {
  opacity: 0;
  filter: blur(20px);
  transform: scale(1.05);
}
</style>
