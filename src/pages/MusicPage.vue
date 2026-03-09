<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useBGM } from '@/composables/useBGM'
import { genres, musicDatabase } from '@/data/musicDb.js'

const router = useRouter()
const containerRef = ref(null)
useBGM('animation', containerRef)

// === 状态管理 ===
const currentGenreId = ref('cn-rap')
const currentSong = ref(musicDatabase['cn-rap'][0])
const dnaListRef = ref(null)
const animationCtx = ref(null)

const currentPlaylist = computed(() => {
  const list = musicDatabase[currentGenreId.value] || []
  let displayList = [...list]
  return displayList.slice(0, 12)
})

// === DNA 动画逻辑 ===
const animateDNA = (isEntrance = false) => {
  if (animationCtx.value) animationCtx.value.revert()
  animationCtx.value = gsap.context(() => {
    const items = gsap.utils.toArray('.dna-item')
    if (items.length === 0) return
    items.forEach(item => item.introProgress = isEntrance ? 0 : 1)
    if (isEntrance) {
      gsap.to(items, {
        introProgress: 1,
        duration: 1,
        ease: 'power2.out',
        stagger: 0.05
      })
    }
    const radius = 80
    const itemSpacing = 50
    const totalHeight = items.length * itemSpacing
    const startY = -totalHeight / 2
    items.forEach((item, i) => {
      const initialPhase = i * 0.6
      const proxy = { phase: initialPhase }
      gsap.to(proxy, {
        phase: initialPhase + Math.PI * 2,
        duration: 8,
        repeat: -1,
        ease: 'none',
        onUpdate: () => {
          const currentPhase = proxy.phase
          const x = Math.sin(currentPhase) * radius
          const y = startY + (i * itemSpacing)
          const zDepth = Math.cos(currentPhase)
          const progress = item.introProgress
          const baseScale = 0.6 + ((zDepth + 1) / 2) * 0.4
          const scale = baseScale * progress
          const baseOpacity = 0.3 + ((zDepth + 1) / 2) * 0.7
          const opacity = baseOpacity * progress
          const zIndex = Math.floor((zDepth + 1) * 100)
          gsap.set(item, {
            x: x,
            y: y,
            scale: scale,
            opacity: opacity,
            zIndex: zIndex,
            display: 'flex'
          })
        }
      })
    })
  }, dnaListRef.value)
}

const switchGenre = (genreId) => {
  if (currentGenreId.value === genreId) return
  if (animationCtx.value) animationCtx.value.kill()
  currentGenreId.value = genreId
  currentSong.value = musicDatabase[genreId][0]
  gsap.set('.dna-item', { opacity: 0, scale: 0 })
  animateDNA(true)
}

const selectSong = (song) => {
  const originalId = String(song.id).split('_')[0]
  const currentOriginalId = String(currentSong.value.id).split('_')[0]
  if (originalId === currentOriginalId) return
  currentSong.value = song
  gsap.fromTo('.song-details-inner',
    { opacity: 0, x: 20 },
    { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
  )
}
const openLink = () => {
    window.open(currentSong.value.link, '_blank')
}
const goBack = () => {
    if (containerRef.value) containerRef.value.style.display = 'none'
    if (animationCtx.value) {
      animationCtx.value.revert()
      animationCtx.value.kill()
    }
    gsap.killTweensOf('.dna-item')
    gsap.killTweensOf('.vial-item')
    gsap.killTweensOf(dnaListRef.value)
    requestAnimationFrame(() => {
      router.back()
    })
}

onMounted(async () => {
  await nextTick()
  gsap.set('.vial-item', { x: -50, opacity: 0 })
  gsap.to('.vial-item', {
      x: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.2)'
  })
  animateDNA(true)
})
onUnmounted(() => {
    if (animationCtx.value) animationCtx.value.revert()
})
</script>

<template>
  <div ref="containerRef" class="cyber-container min-h-screen bg-[#030303] overflow-hidden relative flex flex-col items-center justify-center font-sans selection:bg-neon-cyan selection:text-black">

    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.07] mix-blend-overlay"></div>
        <div class="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-length-[40px_40px] transform-[perspective(500px)_rotateX(60deg)] origin-bottom opacity-20"></div>
        <div class="absolute top-[-20%] left-[10%] w-150 h-150 bg-neon-cyan/10 blur-[150px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div class="absolute bottom-[-10%] right-[10%] w-125 h-125 bg-neon-cyan/10 blur-[120px] rounded-full mix-blend-screen"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 border border-neon-cyan/5 rounded-full animate-spin-super-slow opacity-20"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 border border-dashed border-neon-cyan/5 rounded-full animate-spin-reverse-slow opacity-20"></div>
        <div v-for="n in 20" :key="`p-${n}`"
             class="absolute w-1 h-1 bg-[#00ffff] rounded-full animate-float"
             :style="{
                left: `${Math.random() * 100}%`,
                bottom: '-20px',
                opacity: 0,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`
             }">
        </div>

        <div class="absolute top-0 left-10 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
        <div class="absolute top-0 right-10 w-px h-full bg-linear-to-b from-transparent via-white/10 to-transparent"></div>
    </div>

    <div class="absolute top-0 w-full p-8 md:p-10 flex justify-between items-start z-50 pointer-events-none">
      <button @click="goBack" class="group flex items-center gap-4 text-white/60 hover:text-[#00ffff] transition-colors duration-300 pointer-events-auto cursor-pointer">
        <div class="w-12 h-12 relative flex items-center justify-center border border-white/20 group-hover:border-[#00ffff] bg-black/40 backdrop-blur-md transition-all duration-300 overflow-hidden">
            <span class="text-2xl relative z-10 group-hover:-translate-x-full transition-transform duration-300 ease-out">←</span>
            <span class="absolute right-0 translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out text-theme-orange font-bold font-tech pr-3">RE</span>

            <div class="absolute top-0 left-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#00ffff]"></div>
            <div class="absolute bottom-0 right-0 w-1.5 h-1.5 bg-white transition-colors duration-300 group-hover:bg-[#00ffff]"></div>
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
                <span class="block relative z-10" data-text="MUSIC_DB">MUSIC_DB</span>
            </h1>

            <div class="flex justify-end items-center gap-3 text-[10px] font-tech text-neon-cyan mt-2">
                <div class="flex items-center gap-2 border border-neon-cyan/30 bg-neon-cyan/5 px-2 py-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse box-shadow-cyan"></span>
                    <span>DNA_SEQ</span>
                </div>
                <span class="opacity-50">|</span>
                <span class="opacity-70">LIVE_MATCH // V.1.0.4</span>
            </div>
        </div>
    </div>

    <div class="w-full relative z-20 h-screen pt-32 pb-24 px-16 flex gap-12 max-w-400">

         <div class="w-1/4 h-full flex flex-col justify-center gap-5 relative">
             <div class="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 text-white/5 text-8xl font-display font-bold whitespace-nowrap pointer-events-none select-none">
                 SAMPLES
             </div>

             <div
                v-for="(genre, index) in genres"
                :key="genre.id"
                @click="switchGenre(genre.id)"
                class="vial-item group relative h-24 w-full cursor-pointer opacity-0"
             >
                <div class="absolute top-1/2 -right-6 w-12 h-px bg-neon-cyan transition-all duration-500 origin-left scale-x-0"
                     :class="currentGenreId === genre.id ? 'scale-x-100' : ''"></div>

                <div
                    class="h-full w-full border backdrop-blur-sm relative overflow-hidden transition-all duration-500 flex items-center px-6 gap-4 clip-corner-sm"
                    :class="currentGenreId === genre.id
                        ? 'border-neon-cyan bg-neon-cyan/5 translate-x-2 shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                        : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'"
                >
                    <div class="absolute inset-0 bg-neon-cyan/10 transition-transform duration-700 origin-left"
                         :class="currentGenreId === genre.id ? 'scale-x-100' : 'scale-x-0'"></div>

                    <div class="font-display text-4xl font-bold italic text-white/20 group-hover:text-white/40 z-10 w-10">
                        {{ String(index + 1).padStart(2, '0') }}
                    </div>

                    <div class="z-10 flex flex-col">
                        <span class="font-tech text-[10px] tracking-widest text-white/40 mb-0.5">{{ genre.code }}</span>
                        <span class="font-display text-2xl font-bold uppercase italic tracking-wide text-white leading-none">
                            {{ genre.name }}
                        </span>
                        <span class="font-tech text-[10px] uppercase text-neon-cyan mt-1 opacity-0 transition-opacity"
                            :class="currentGenreId === genre.id ? 'opacity-100' : ''">
                            {{ genre.label }}
                        </span>
                    </div>

                    <div v-if="currentGenreId === genre.id" class="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>
                </div>
             </div>
         </div>

         <div class="w-1/3 h-full relative flex items-center justify-center perspective-container">
            <div class="absolute top-10 bottom-10 w-px bg-white/5 dashed-line"></div>

            <div ref="dnaListRef" class="w-full h-full relative flex flex-col items-center justify-center">
                <div
                    v-for="(song,index) in currentPlaylist"
                    :key="index"
                    @click="selectSong(song)"
                    class="dna-item absolute flex items-center justify-center gap-0 w-100 cursor-pointer will-change-transform"
                >
                    <div class="flex-1 flex items-center justify-end">
                         <span class="font-tech text-[8px] text-white/20 mr-2">{{ song.id.toString().split('_')[0].padStart(3,'0') }}</span>
                         <div class="h-px w-full max-w-15 bg-linear-to-l from-neon-cyan/60 to-transparent"></div>
                         <div class="w-1.5 h-1.5 bg-neon-cyan rounded-full box-shadow-cyan"></div>
                    </div>

                    <div
                        class="mx-3 px-4 py-1.5 border bg-black/90 backdrop-blur-md min-w-45 text-center transition-all duration-300 clip-corner-xs"
                        :class="String(currentSong.id).split('_')[0] === String(song.id).split('_')[0]
                            ? 'border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.4)] scale-110'
                            : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white'"
                    >
                        <span class="font-display font-bold italic text-base tracking-wider truncate block">
                            {{ song.title }}
                        </span>
                    </div>

                    <div class="flex-1 flex items-center justify-start">
                         <div class="w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_8px_#00ffff]"></div>
                         <div class="h-px w-full max-w-15 bg-linear-to-r from-neon-cyan to-transparent"></div>
                    </div>
                </div>
            </div>
         </div>

        <div class="w-1/3 flex items-center">
            <div class="song-details-inner w-full relative group/card">
                <div class="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-neon-cyan/50 transition-all duration-500 group-hover/card:w-full group-hover/card:h-full group-hover/card:border-neon-cyan/30"></div>
                <div class="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-neon-cyan/50 transition-all duration-500 group-hover/card:w-full group-hover/card:h-full group-hover/card:border-neon-cyan/30"></div>
                <div class="flex gap-6 mb-6">
                    <div class="relative w-40 h-40 shrink-0 border border-white/10 transition-colors duration-300 group-hover/card:border-neon-cyan">
                        <div class="absolute inset-0 z-20 pointer-events-none clip-corner border-2 border-transparent group-hover/card:border-neon-cyan/30 transition-all"></div>
                        <div class="absolute inset-px z-10 overflow-hidden bg-black clip-corner-inner">
                          <img :src="currentSong.cover" class="w-full h-full object-cover opacity-70 grayscale transition-all duration-700 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-110" />
                          <div class="absolute inset-0 bg-scanlines opacity-30 pointer-events-none"></div>
                        </div>
                    </div>
                    <div class="flex flex-col justify-end pb-2">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="text-[10px] font-tech text-neon-cyan tracking-widest uppercase border border-neon-cyan/30 px-1.5 py-0.5 bg-neon-cyan/5">PLAYING_NOW</span>
                            <span class="text-[10px] font-tech text-white/40 tracking-widest uppercase">
                              ALBUM: <span class="text-white/80">{{ currentSong.album }}</span>
                            </span>
                        </div>
                        <h2 class="text-5xl font-display font-bold text-white italic leading-[0.85] mb-2 glitch-text" :data-text="currentSong.title">{{ currentSong.title }}</h2>
                        <p class="text-sm text-gray-400 font-tech uppercase tracking-wide">// {{ currentSong.artist }}</p>
                    </div>
                </div>

                <div class="relative pl-4 border-l-2 border-neon-cyan/50 bg-white/5 p-4 clip-corner-sm">
                    <p class="text-xs font-tech text-gray-300 leading-relaxed">
                        <span class="text-neon-cyan font-bold">EVALUATION >> </span>
                        {{ currentSong.review }}
                    </p>
                    <div class="mt-4 flex justify-between items-end">
                        <div class="flex gap-2">
                            <span class="px-1.5 py-0.5 bg-white/10 text-[8px] font-tech text-white/50">AAC</span>
                            <span class="px-1.5 py-0.5 bg-white/10 text-[8px] font-tech text-white/50">320KBPS</span>
                        </div>
                        <button
                          @click="openLink"
                          class="group/btn relative px-6 py-2 bg-neon-cyan overflow-hidden clip-button transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.6)] hover:-translate-y-1 active:translate-y-0"
                        >
                          <div class="absolute inset-0 bg-white translate-x-[-105%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-out z-0"></div>
                          <span class="relative z-10 font-bold font-tech text-xs text-black group-hover/btn:text-neon-cyan transition-colors duration-300 flex items-center gap-1">
                              <span class="transition-all duration-300 group-hover/btn:tracking-widest">ACCESS_NETEASE</span>
                              <span class="opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300 delay-75">>></span>
                          </span>
                      </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="absolute bottom-8 w-full max-w-[95%] flex justify-between items-end border-t border-white/10 pt-4 text-[10px] font-tech text-gray-500 z-50">
        <div class="flex gap-12">
            <div class="flex flex-col gap-1">
                <span class="text-[8px] text-white/20 tracking-widest">CONNECTED SERVER</span>
                <span class="text-neon-cyan font-bold flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse"></span>
                    HK_OFFICIAL_MM_01
                </span>
            </div>
            <div class="flex flex-col gap-1">
                 <span class="text-[8px] text-white/20 tracking-widest">PACKET LOSS</span>
                 <span class="text-white">0.00%</span>
            </div>
        </div>

        <div class="hidden md:flex gap-0.5 items-end h-8 opacity-30">
            <div v-for="i in 20" :key="i" class="w-1 bg-neon-cyan" :style="{ height: Math.random() * 100 + '%' }"></div>
        </div>

        <div class="flex items-center gap-4">
            <div class="text-right">
                <div class="text-white font-bold">SYSTEM_READY</div>
                <div class="text-[8px] text-white/30">WAITING FOR INPUT</div>
            </div>
            <div class="w-8 h-8 border border-white/20 grid place-items-center text-neon-cyan">
                <div class="w-4 h-4 bg-neon-cyan/20 animate-pulse"></div>
            </div>
        </div>
    </div>

  </div>
</template>

<style scoped>
.text-neon-cyan { color: #00ffff; }
.bg-neon-cyan { background-color: #00ffff; }
.border-neon-cyan { border-color: #00ffff; }
.box-shadow-cyan { box-shadow: 0 0 10px #00ffff; }

.font-display { font-family: 'Rajdhani', sans-serif; }
.font-tech { font-family: 'Share Tech Mono', monospace; }

/* === 视觉特效 === */
.text-shadow-glow { text-shadow: 0 0 10px rgba(0, 255, 255, 0.5); }
.bg-scanlines {
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 51%);
    background-size: 100% 3px;
}
.dashed-line {
    background-image: linear-gradient(to bottom, rgba(255,255,255,0.1) 50%, transparent 50%);
    background-size: 1px 20px;
    background-repeat: repeat-y;
}

/* === 切角系统 === */
.clip-corner {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
}
.clip-corner-inner {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%);
}
.clip-corner-sm {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%);
}
.clip-corner-xs {
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
}
.clip-button {
    clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%);
}

/* === 动画 === */
.dna-item {
  will-change: transform, opacity;
  transform: translateZ(0);
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin 8s linear infinite; }
@keyframes pulse-slow {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.1); }
}
.animate-pulse-slow { animation: pulse-slow 8s infinite ease-in-out; }

/* === Glitch 文字 === */
.glitch-text { position: relative; }
.glitch-text::before, .glitch-text::after {
    content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.8;
}

@keyframes glitch-effect {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
}
@keyframes glitch-1 {
    0% { transform: none; opacity: 1; }
    7% { transform: skew(-0.5deg, -0.9deg); opacity: 0.75; }
    30% { transform: skew(0.8deg, -0.1deg); opacity: 0.75; }
    55% { transform: skew(-1deg, 0.2deg); opacity: 0.75; }
    75% { transform: skew(0.4deg, 1deg); opacity: 0.75; }
    100% { transform: none; opacity: 1; }
}
.animate-glitch-1 { animation: glitch-1 2.5s infinite linear alternate-reverse; }

@keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
.animate-spin-super-slow {
    animation: spin 60s linear infinite;
}
.animate-spin-reverse-slow {
    animation: spin 40s linear infinite reverse;
}

/* 悬浮粒子动画 */
@keyframes floatUp {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    20% { opacity: 0.6; }
    80% { opacity: 0.6; }
    100% { transform: translateY(-80vh) scale(0); opacity: 0; }
}
.animate-float {
    animation: floatUp linear infinite;
    will-change: transform, opacity;
}

/* 频谱遮罩 */
.mask-gradient {
    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
}
</style>
