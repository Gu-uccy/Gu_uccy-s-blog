<script setup>
import { ref, onMounted , onUnmounted} from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useBGM } from '@/composables/useBGM'

import cs2Img from '@/assets/img/cs2.jpg'
import musicImg from '@/assets/img/music.jpg'
import animeImg from "@/assets/img/anime.jpg"
import bballImg from '@/assets/img/bball.jpg'

gsap.registerPlugin(ScrollTrigger)

const containerRef = ref(null)
const router = useRouter()
useBGM('hobbies', containerRef)
let ctx

const hobbies = [
  {
    id: 'cs2',
    type: 'GAME',
    title: 'COUNTER-STRIKE 2',
    subtitle: 'PREMIER MODE',
    image: cs2Img,
    route: '/cs2',
    accent: '#CE1141',
    tags: ['FPS', 'COMPETITIVE', 'TACTICAL'],
    initialRotation: -18,
    yOffset: 0
  },
  {
    id: 'basketball',
    type: 'SPORT',
    title: 'BASKETBALL',
    subtitle: 'OFFLINE MODE',
    image: bballImg,
    route: '/basketball',
    accent: '#FFA500',
    tags: ['SWEAT', 'SNEAKER', 'RECHARGE'],
    initialRotation: -8,
    yOffset: -40
  },
  {
    id: 'animation',
    type: 'BINGE',
    title: 'ANIMATION',
    subtitle: 'THE MULTIVERSE',
    image: animeImg,
    route: '/animation',
    accent: '#8A2BE2',
    tags: ['SCI-FI', 'ADVENTURE', 'THRILLER'],
    initialRotation: 8,
    yOffset: -40
  },
  {
    id: 'music',
    type: 'SOUND',
    title: 'MUSIC',
    subtitle: 'Hip-hop / R&B',
    image: musicImg,
    route: '/music',
    accent: '#00ffff',
    tags: ['VIBE', 'FLOW', 'SAMPLING'],
    initialRotation: 18,
    yOffset: 0
  },
]

const initScrollParallax = () => {
  let mm = gsap.matchMedia();
  mm.add({
    isDesktop: "(min-width: 768px)",
    isMobile: "(max-width: 767px)"
  }, (context) => {
    let { isDesktop } = context.conditions;
    const spreadFactor = isDesktop ? 200 : 60;
    const zFactor = isDesktop ? 150 : 40;
    const yFactor = isDesktop ? 80 : 30;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.value,
        start: "top bottom",
        end: "center center",
        scrub: 1,
      }
    })
    tl.to('.hobbies-title', { y: isDesktop ? -80 : -40, ease: 'none' }, 0)
    tl.to('.perspective-container', { y: isDesktop ? -80 : -40, ease: 'none' }, 0)
    const cards = gsap.utils.toArray('.hobby-card')
    cards.forEach((card, i) => {
      const xSpread = (i - 1.5) * spreadFactor
      const ySpread = i % 2 === 0 ? yFactor : (yFactor * 0.4)
      const zSpread = i % 2 === 0 ? zFactor : -zFactor
      const rotateYSpread = (i - 1.5) * (isDesktop ? 20 : 10)
      tl.from(card, {
        x: xSpread,
        yPercent: ySpread,
        z: zSpread,
        rotationY: rotateYSpread,
        ease: 'power1.out'
      }, 0)
    })
  });
}

// 悬停交互
const handleMouseEnter = (e, index) => {
  const card = e.currentTarget
  const imgLayer = card.querySelector('.img-layer')
  gsap.set(card, { zIndex: 100 })
  gsap.to(card, {
    rotation: 0,
    y: -40,
    scale: 1.1,
    boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${hobbies[index].accent}40`,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto'
  })
  gsap.to(imgLayer, {
    scale: 1.1,
    duration: 0.3,
    ease: 'power2.out',
    overwrite: 'auto'
  })
}

const handleMouseLeave = (e, index) => {
  const card = e.currentTarget
  gsap.set(card, { zIndex: 10 })

  gsap.to(card, {
    rotation: hobbies[index].initialRotation,
    rotationX: 0,
    rotationY: 0,
    y: hobbies[index].yOffset,
    scale: 1,
    clearProps: "boxShadow",
    duration: 0.5,
    ease: 'power2.out',
    overwrite: 'auto',
    onComplete: () => {
        gsap.set(card, { clearProps: "zIndex" })
    }
  })

  const imgLayer = card.querySelector('.img-layer')
  const contentLayer = card.querySelector('.content-layer')
  gsap.to([imgLayer, contentLayer], {
    x: 0,
    y: 0,
    scale: 1,
    duration: 0.5,
    overwrite: 'auto'
  })
}

// 3D 视差
const handleMouseMove = (e) => {
  const card = e.currentTarget
  const imgLayer = card.querySelector('.img-layer')
  const contentLayer = card.querySelector('.content-layer')
  if (!card._q) {
    card._q = {
      rotX: gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" }),
      rotY: gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" }),
      imgX: gsap.quickTo(imgLayer, "x", { duration: 0.5, ease: "power3.out" }),
      imgY: gsap.quickTo(imgLayer, "y", { duration: 0.5, ease: "power3.out" }),
      contX: gsap.quickTo(contentLayer, "x", { duration: 0.4, ease: "power3.out" }),
      contY: gsap.quickTo(contentLayer, "y", { duration: 0.4, ease: "power3.out" })
    }
  }
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -12
  const rotateY = ((x - centerX) / centerX) * 12
  const imgMoveX = -((x - centerX) / centerX) * 15
  const imgMoveY = -((y - centerY) / centerY) * 15
  const contMoveX = ((x - centerX) / centerX) * 8
  const contMoveY = ((y - centerY) / centerY) * 8
  card._q.rotX(rotateX)
  card._q.rotY(rotateY)
  card._q.imgX(imgMoveX)
  card._q.imgY(imgMoveY)
  card._q.contX(contMoveX)
  card._q.contY(contMoveY)
}

const goToPage = (route) => {
  router.push(route)
}

// 背景特效
const initBackgroundEffects = () => {
  const particles = gsap.utils.toArray('.bg-particle')
  particles.forEach((p) => {
    gsap.set(p, {
      x: gsap.utils.random(0, window.innerWidth),
      y: gsap.utils.random(0, window.innerHeight),
      scale: gsap.utils.random(0.8, 1.8),
      opacity: gsap.utils.random(0.6, 1)
    })
    gsap.to(p, {
      x: '+=2000',
      y: gsap.utils.random(-30, 30),
      rotation: gsap.utils.random(0, 360),
      duration: gsap.utils.random(10, 20),
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % window.innerWidth)
      }
    })
    gsap.to(p, {
      opacity: 0.2,
      scale: 0.5,
      duration: gsap.utils.random(0.5, 2),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: gsap.utils.random(0, 2)
    })
  })
}

onMounted(() => {
  ctx = gsap.context(() => {
    initBackgroundEffects()
    initScrollParallax()
    gsap.set('.hobby-card', { y: 300, autoAlpha: 0 })
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const cards = gsap.utils.toArray('.hobby-card')
        gsap.to(cards, {
          autoAlpha: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: 'power3.out'
        })
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: hobbies[i].yOffset,
            rotation: hobbies[i].initialRotation,
            duration: 1.8,
            ease: 'back.out(1.2)',
            delay: 0.2
          })
        })
        observer.disconnect()
      }
    }, { threshold: 0.4 })
    if (containerRef.value) observer.observe(containerRef.value)
  }, containerRef.value)
})

onUnmounted(() => {
  ctx && ctx.revert()
})
</script>

<template>
  <section ref="containerRef" class="min-h-screen w-full bg-black flex flex-col items-center justify-center py-20 relative overflow-hidden">

    <div class="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-black via-black/80 to-transparent z-20 pointer-events-none"></div>
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[41px_41px] opacity-50"></div>
        <div class="bg-spotlight absolute top-1/2 left-1/2 w-260 h-80 -translate-x-1/2 -translate-y-1/2 bg-chic-red opacity-10 blur-[100px] rounded-full mix-blend-screen"></div>
        <div v-for="n in 25" :key="n"
            class="bg-particle absolute rounded-full mix-blend-screen"
            :class="n % 3 === 0 ? 'bg-white w-0.75 h-0.75' : 'bg-chic-red w-1.25 h-1.25'"
            style="box-shadow: 0 0 10px currentColor;">
        </div>
    </div>

    <div class="hobbies-title mb-24 text-center z-10 pointer-events-none top-1">
        <h2 class="text-5xl md:text-7xl font-black italic tracking-tighter mix-blend-difference cursor-default pointer-events-auto group">
            <span class="text-chic-red mr-2">MY</span>
            <span class="text-stroke text-transparent transition-colors duration-200 group-hover:text-white">HOBBIES</span>
        </h2>
        <div class="text-[10px] font-mono text-gray-500 mt-2 tracking-[0.5em] opacity-60">CLICK_TO_PLAY</div>
    </div>

    <div class="flex items-center justify-center -space-x-12 sm:-space-x-20 md:-space-x-36 pt-24 pb-12 perspective-container z-30 w-full">
        <div
          v-for="(item, index) in hobbies"
          :key="item.id"
          class="hobby-card w-35 sm:w-50 md:w-[320px] aspect-2/3 relative cursor-pointer group bg-[#0a0a0a] rounded-xl will-change-transform"
          @mouseenter="(e) => handleMouseEnter(e, index)"
          @mouseleave="(e) => handleMouseLeave(e, index)"
          @mousemove="handleMouseMove"
          @click="goToPage(item.route)"
        >
            <div class="img-layer absolute inset-0 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors duration-300">
                <img
                  :src="item.image"
                  class="w-full h-full object-cover filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-500"
                />
                <div class="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent opacity-90"></div>
                <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div class="content-layer absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                <div class="flex justify-between items-start">
                    <span class="bg-black/50 backdrop-blur border border-white/10 px-2 py-1 text-[9px] font-mono text-white tracking-widest shadow-lg">
                        {{ item.type }}
                    </span>
                </div>

                <div>
                    <div class="flex gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <span v-for="tag in item.tags" :key="tag"
                              class="text-[8px] font-mono text-black px-1 font-bold shadow-lg"
                              :style="{ backgroundColor: item.accent }">
                            {{ tag }}
                        </span>
                    </div>

                    <h3 class="text-4xl font-black italic text-white leading-[0.9] mb-1 drop-shadow-lg">
                        {{ item.title }}
                    </h3>
                    <p class="text-xs font-mono text-gray-300 tracking-wider">
                        {{ item.subtitle }}
                    </p>
                </div>
            </div>

            <div class="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                 :style="{ border: `1px solid ${item.accent}80` }">
            </div>

        </div>

    </div>

  </section>
</template>

<style scoped>
.perspective-container {
    perspective: 1200px;
}

.hobby-card {
    transform-origin: bottom center;
    transform-style: preserve-3d;
    box-shadow: -10px 0 20px rgba(0,0,0,0.5);
    transition: z-index 0s;
}

.text-stroke {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
}
</style>
