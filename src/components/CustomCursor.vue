<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'

const cursorSmall = ref(null)
const cursorBig = ref(null)
const lineRefs = ref([])

const setLineRef = (el, index) => {
  if (el) lineRefs.value[index] = el
}

onMounted(() => {
  const xBig = gsap.quickTo(cursorBig.value, "x", { duration: 0.6, ease: "power3.out" });
  const yBig = gsap.quickTo(cursorBig.value, "y", { duration: 0.6, ease: "power3.out" });
  const xSmall = gsap.quickTo(cursorSmall.value, "x", { duration: 0.1, ease: "power2.out" });
  const ySmall = gsap.quickTo(cursorSmall.value, "y", { duration: 0.1, ease: "power2.out" });
  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;
  const trailLength = 15;
  const friction = 0.4;
  const maxSegmentLength = 15;

  const points = Array(trailLength).fill(0).map(() => ({ x: lastX, y: lastY }));

  const updateTrail = () => {
    points[0].x = lastX;
    points[0].y = lastY;

    for (let i = 1; i < points.length; i++) {
      const leader = points[i - 1];
      const follower = points[i];
      follower.x += (leader.x - follower.x) * friction;
      follower.y += (leader.y - follower.y) * friction;
      const dx = leader.x - follower.x;
      const dy = leader.y - follower.y;
      const dist = Math.hypot(dx, dy);

      if (dist > maxSegmentLength) {
        const angle = Math.atan2(dy, dx);
        follower.x = leader.x - Math.cos(angle) * maxSegmentLength;
        follower.y = leader.y - Math.sin(angle) * maxSegmentLength;
      }
    }

    for (let i = 0; i < points.length - 1; i++) {
      const line = lineRefs.value[i];
      if (line) {
        line.setAttribute('x1', points[i].x);
        line.setAttribute('y1', points[i].y);
        line.setAttribute('x2', points[i + 1].x);
        line.setAttribute('y2', points[i + 1].y);
      }
    }
  };

  gsap.ticker.add(updateTrail);

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;
    const deltaX = clientX - lastX;
    const deltaY = clientY - lastY;
    lastX = clientX;
    lastY = clientY;
    const tiltX = Math.max(Math.min(deltaY * -0.5, 15), -15);
    const tiltY = Math.max(Math.min(deltaX * 0.5, 15), -15);
    xBig(clientX);
    yBig(clientY);
    xSmall(clientX);
    ySmall(clientY);
    gsap.to(cursorBig.value, {
      rotationX: tiltX,
      rotationY: tiltY,
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto"
    });
  };

  window.addEventListener('mousemove', onMouseMove);

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove);
    gsap.ticker.remove(updateTrail);
  });
});
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-9999 overflow-hidden">

    <svg class="absolute inset-0 w-full h-full z-0 overflow-visible will-change-transform">
      <g class="neon-line">
        <line
          v-for="i in 14"
          :key="i"
          :ref="(el) => setLineRef(el, i-1)"
          stroke="#CE1141"
          stroke-width="3"
          stroke-linecap="round"
          :opacity="1 - (i - 1) / 14"
        />
      </g>
    </svg>

    <div ref="cursorSmall"
         class="absolute w-2 h-2 bg-chic-red rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#CE1141] z-20 mix-blend-difference">
    </div>

    <div ref="cursorBig"
         class="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10 mix-blend-difference"
         style="perspective: 1000px">
         <div class="relative flex items-center justify-center w-20 h-20 transition-transform will-change-transform">
            <div class="absolute inset-0 border border-white/40 rounded-full w-12 h-12 m-auto animate-[spin_8s_linear_infinite]"></div>
            <div class="absolute inset-0 border border-white/10 rounded-full w-16 h-16 m-auto"></div>
            <div class="absolute w-px h-6 bg-white/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute h-px w-6 bg-white/50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute top-[85%] left-1/2 -translate-x-1/2 text-[8px] font-mono text-chic-red whitespace-nowrap tracking-[0.2em] opacity-80 text-shadow-neon">
              TGT_LOCK
            </div>
         </div>
    </div>

  </div>
</template>

<style scoped>
.neon-line {
  filter: drop-shadow(0 0 5px #CE1141) drop-shadow(0 0 10px #CE1141);
  will-change: filter;
}

.text-shadow-neon {
  text-shadow: 0 0 5px rgba(206, 17, 65, 0.8);
}
</style>
