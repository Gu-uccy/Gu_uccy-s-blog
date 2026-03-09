<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useBGM } from '@/composables/useBGM'
import { topList , recommendations } from "@/data/animationDb";

const router = useRouter()
const containerRef = ref(null)
useBGM('animation', containerRef, { threshold: 0.01 })
const expandedRank = ref(null)

// 生成悬浮粒子
const particles = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  size: Math.random() * 3 + 2,
  duration: 10 + Math.random() * 20,
  delay: -Math.random() * 20
}))

const toggleRow = (rank) => {
  expandedRank.value = expandedRank.value === rank ? null : rank
}

onMounted(async () => {
  window.scrollTo(0, 0)
  await nextTick()
  gsap.from('.anime-item-wrapper', { x: -30, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', delay: 0.2, clearProps: 'all' })
  gsap.from('.masonry-item', { y: 30, opacity: 0, duration: 0.6, stagger: 0.05, delay: 0.8, clearProps: 'all' })
})

const goBack = () => router.back()
</script>

<template>
  <div ref="containerRef" class="cyber-container min-h-screen bg-[#020205] text-white font-sans selection:bg-neon-purple selection:text-white overflow-x-hidden relative">

    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">

        <div class="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] bg-neon-purple/30 rounded-full mix-blend-screen blur-[120px] animate-blob"></div>
        <div class="absolute -bottom-[10%] -right-[10%] w-[60vw] h-[60vw] bg-[#4f46e5]/20 rounded-full mix-blend-screen blur-[120px] animate-blob animation-delay-4000"></div>

        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>

        <div class="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.1)_1px,transparent_1px)] bg-length-[50px_50px] transform-[perspective(1000px)_rotateX(60deg)] origin-top opacity-40"></div>

        <div v-for="p in particles" :key="p.id"
             class="absolute rounded-full bg-white shadow-[0_0_8px_rgba(139,92,246,0.9)] animate-float"
             :style="{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`
             }">
        </div>

        <div class="absolute top-0 left-8 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
        <div class="absolute top-0 right-8 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
    </div>

    <div class="fixed top-0 w-full p-8 md:p-10 flex justify-between items-start z-50 pointer-events-none mix-blend-difference">
      <button @click="goBack" class="group flex items-center gap-4 text-white/60 hover:text-[#8A2BE2] transition-colors duration-300 pointer-events-auto cursor-pointer">
        <div class="w-12 h-12 relative flex items-center justify-center border border-white/20 group-hover:border-[#8A2BE2] bg-black/40 backdrop-blur-md transition-all duration-300 overflow-hidden">
            <span class="text-2xl relative z-10 group-hover:-translate-x-full transition-transform duration-300 ease-out">←</span>
            <span class="absolute right-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out text-theme-orange font-bold font-tech pr-3">RE</span>

            <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#8A2BE2]"></div>
            <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#8A2BE2]"></div>
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
            <h1 class="font-display text-6xl md:text-7xl font-bold uppercase italic tracking-tighter leading-none text-white mix-blend-difference relative">
                <span class="block relative z-10" data-text="RANKING_DB">RANKING_DB</span>
            </h1>
            <div class="flex justify-end items-center gap-3 text-[10px] font-tech text-neon-purple mt-2">
                <div class="flex items-center gap-2 border border-neon-purple/30 bg-neon-purple/5 px-2 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse box-shadow-purple"></span>
                    <span>LIST_VIEW</span>
                </div>
                <span class="opacity-50">|</span>
                <span class="opacity-70">ARCHIVE // V.4.3</span>
            </div>
        </div>
    </div>

    <div class="relative z-10 w-full pt-32 pb-40 px-4 md:px-0 max-w-5xl mx-auto">

        <div class="list-section w-full mb-32">
            <div class="flex items-end justify-between border-b border-white/10 pb-4 mb-8 mx-2 md:mx-0">
                <div class="flex items-end gap-4">
                    <h3 class="font-display text-4xl font-bold text-white italic">MY_OWN_TOP_SELECTION</h3>
                    <span class="font-tech text-xs text-neon-purple mb-1.5">/// 10 ENTRIES FOUND</span>
                </div>
                <span class="font-tech text-[10px] text-white/40 hidden md:block animate-pulse">CLICK ITEM TO EXPAND >></span>
            </div>

            <div class="flex flex-col gap-3">
                <div v-for="(anime, index) in topList" :key="anime.rank"
                     class="anime-item-wrapper flex flex-col group/item">
                    <div @click="toggleRow(anime.rank)"
                         class="list-row relative h-24 bg-[#0a0a0e]/60 backdrop-blur-sm border border-white/5 flex items-center pr-6 overflow-hidden transition-all duration-300 hover:pl-2 clip-corner-sm cursor-pointer hover:bg-white/10 hover:border-neon-purple/50"
                         :class="{'border-neon-purple bg-white/10': expandedRank === anime.rank}">
                        <div class="absolute inset-0 bg-linear-to-r from-neon-purple/20 to-transparent -translate-x-full group-hover/item:translate-x-0 transition-transform duration-500 ease-out pointer-events-none"></div>

                        <div class="w-20 md:w-24 h-full flex flex-col items-center justify-center bg-black/20 border-r border-white/5 relative group-hover/item:w-28 transition-all duration-300 shrink-0">
                            <span class="font-display text-4xl font-bold italic z-10"
                                  :class="index < 3 ? 'text-neon-purple text-shadow-glow' : 'text-white/50 group-hover/item:text-white'">
                                {{ String(anime.rank).padStart(2,'0') }}
                            </span>
                            <div v-if="expandedRank === anime.rank" class="absolute left-0 top-0 bottom-0 w-1 bg-neon-purple"></div>
                        </div>

                        <div class="w-32 md:w-48 h-full relative overflow-hidden hidden sm:block shrink-0 bg-gray-900 border-r border-white/5">
                            <img v-if="anime.img" :src="anime.img" class="w-full h-full object-cover opacity-60 grayscale group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-500" />
                            <div v-else class="w-full h-full flex items-center justify-center bg-white/5 text-white/10 font-tech text-xs">NO_IMAGE</div>
                        </div>

                        <div class="flex-1 pl-4 md:pl-6 flex flex-col justify-center z-10 min-w-0">
                            <div class="flex items-center gap-3 mb-1">
                                <h4 class="font-display text-2xl md:text-3xl font-bold italic text-white! leading-none group-hover/item:translate-x-2 transition-transform duration-300 truncate w-full group-hover/item:text-neon-purple">
                                    {{ anime.title }}
                                </h4>
                            </div>
                            <div class="flex items-center gap-2 md:gap-3 text-white/50">
                                 <span class="font-tech text-[10px] md:text-xs tracking-widest truncate">{{ anime.subtitle }}</span>
                                 <span class="w-px h-3 bg-white/20"></span>
                                 <span class="font-tech text-[10px] border border-white/10 px-1">{{ anime.year }}</span>
                            </div>
                        </div>

                        <div class="text-right z-10 flex flex-col items-end shrink-0 ml-2">
                             <span class="text-[8px] font-tech text-neon-purple transition-all duration-300"
                                   :class="expandedRank === anime.rank ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'">
                                   {{ expandedRank === anime.rank ? 'CLOSE_DATA ▲' : 'READ_REVIEW ▼' }}
                             </span>
                            <span class="font-display text-2xl md:text-3xl font-bold text-white group-hover/item:text-neon-purple transition-colors">{{ anime.score }}</span>
                        </div>
                    </div>

                    <Transition name="expand">
                        <div v-if="expandedRank === anime.rank" class="overflow-hidden bg-[#0c0c12]/80 border-x border-b border-white/10 mx-2 mb-2 relative backdrop-blur-md">
                             <div class="absolute top-0 left-0 w-1 h-full bg-neon-purple/50"></div>
                             <div class="p-6 md:p-8 flex gap-6 relative">
                                 <div class="flex-1 font-tech text-gray-300 text-sm leading-relaxed">
                                     <div class="text-neon-purple text-[10px] tracking-widest mb-2 font-bold flex items-center gap-2">
                                         <span class="w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse"></span>
                                         REVIEW_LOG_Decrypted
                                     </div>
                                     <p class="border-l-2 border-white/10 pl-4">{{ anime.review }}</p>
                                 </div>
                             </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>

        <div class="relative w-full border-t border-white/10 pt-16">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#050508] px-6 py-1 border border-white/10 clip-corner-xs z-20">
                <span class="font-tech text-neon-purple tracking-widest text-[10px] animate-pulse">▼ DISCOVER_ARCHIVES</span>
            </div>

            <div class="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                <div v-for="item in recommendations" :key="item.id"
                     class="masonry-item break-inside-avoid bg-[#0a0a0e]/60 backdrop-blur-sm border border-white/5 p-5 group hover:border-neon-purple/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col gap-4 shadow-sm hover:shadow-[0_0_20px_rgba(138,43,226,0.15)]">

                    <div class="flex justify-between items-center border-b border-white/5 pb-2">
                        <h3 class="font-display text-xl font-bold italic text-white group-hover:text-neon-purple transition-colors leading-tight line-clamp-2">
                            {{ item.title }}
                        </h3>
                        <span class="font-tech text-[9px] text-white/30">{{ String(Math.floor(item.id)) }}</span>
                    </div>

                    <p class="font-tech text-xs text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                        {{ item.desc }}
                    </p>

                    <div class="mt-auto pt-2 flex flex-wrap gap-2 items-center">
                        <div class="flex gap-1.5 flex-wrap">
                            <span v-for="tag in item.tags" :key="tag"
                                  class="text-[9px] font-tech text-white/50 border border-white/10 px-1.5 py-0.5 rounded-sm group-hover:border-neon-purple/30 group-hover:text-neon-purple transition-colors">
                                {{ tag }}
                            </span>
                        </div>
                        <div class="ml-auto flex flex-col items-end text-[9px] font-tech text-white/30">
                            <span class="flex items-center gap-1">
                                <span class="w-1 h-1 bg-white/20 rounded-full"></span> {{ item.date }}
                            </span>
                            <span>{{ item.duration }}</span>
                        </div>
                    </div>
                    <div class="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 group-hover:border-neon-purple transition-colors"></div>
                    <div class="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 group-hover:border-neon-purple transition-colors"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="fixed bottom-0 w-full px-8 py-3 border-t border-white/10 flex justify-between items-center text-[9px] font-tech text-gray-500 z-50 bg-[#050508]/80 backdrop-blur-md">
        <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-neon-purple rounded-full animate-pulse"></span>
            <span class="text-neon-purple font-bold">SYSTEM_READY</span>
        </div>
        <div class="text-white/30">SCROLL_MONITOR: ACTIVE</div>
    </div>

  </div>
</template>

<style scoped>
.text-neon-purple { color: #8A2BE2; }
.bg-neon-purple { background-color: #8A2BE2; }
.border-neon-purple { border-color: #8A2BE2; }
.box-shadow-purple { box-shadow: 0 0 10px #8A2BE2; }

.font-display { font-family: 'Rajdhani', sans-serif; }
.font-tech { font-family: 'Share Tech Mono', monospace; }

.text-shadow-glow { text-shadow: 0 0 12px rgba(138, 43, 226, 0.8); }

.clip-corner-sm { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%); }
.clip-corner-xs { clip-path: polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%); }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin 4s linear infinite; }

/* Glitch */
.glitch-text { position: relative; }
.glitch-text::before, .glitch-text::after {
    content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
}
.glitch-text::before { color: #8A2BE2; z-index: -1; animation: glitch-effect 3s infinite; }
.glitch-text::after { color: #00ffff; z-index: -2; animation: glitch-effect 2s infinite reverse; }

@keyframes glitch-effect {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
}

/* 展开动画 */
.expand-enter-active, .expand-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 500px;
  opacity: 1;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0 !important;
}

/* 强化的呼吸光斑动画 */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
  33% { transform: translate(50px, -80px) scale(1.1); opacity: 0.6; }
  66% { transform: translate(-40px, 40px) scale(0.9); opacity: 0.4; }
  100% { transform: translate(0px, 0px) scale(1); opacity: 0.3; }
}
.animate-blob { animation: blob 15s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* 粒子上浮动画 (核心修复点：使用 top: 0 并在 keyframes 中控制 translateY) */
.animate-float {
  /* 必须指定位置，否则 absolute 行为不可控 */
  top: 0;
  opacity: 0;
  animation-name: floatUp;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes floatUp {
  0% { transform: translateY(100vh) scale(0); opacity: 0; }
  10% { opacity: 0.8; transform: translateY(90vh) scale(1); }
  90% { opacity: 0.6; }
  100% { transform: translateY(-10vh) scale(0); opacity: 0; }
}

/* 流星划过动画 */
.animate-shooting {
  opacity: 0;
  animation-name: shootingStar;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes shootingStar {
  0% { transform: translateX(0) translateY(0) scale(1); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateX(500px) translateY(500px) scale(0.5); opacity: 0; }
}
</style>
