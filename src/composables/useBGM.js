import { onMounted, onUnmounted } from 'vue'
import { useMusicStore } from '@/stores/musicStore'

export function useBGM(trackName, elementRef , options = {}) {
  const musicStore = useMusicStore()
  let observer = null
  const threshold = options.threshold || 0.6

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          musicStore.switchTrack(trackName)
        }
      })
    }, { threshold: threshold })

    if (elementRef.value) {
      observer.observe(elementRef.value)
    }
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
