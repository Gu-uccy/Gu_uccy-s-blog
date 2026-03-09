import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMusicStore = defineStore('music', () => {
  const audio = new Audio()
  const isPlaying = ref(false)
  const currentTrackName = ref('')
  const volume = ref(0.3)
  const fadeTimer = ref(null)

  const trackEntryPoints = {
    'hero': 16,
    'hobbies': 11,
    'tech': 16,
    'projects': 0,
    'notes': 9,
    'cs2': 0,
    'music': 13,
    'animation': 11,
    'basketball': 16,
  }

  const trackHistory = ref({})

  audio.volume = volume.value
  audio.loop = true
  audio.onplay = () => {
    if (!isPlaying.value) isPlaying.value = true
  }
  audio.onpause = () => {
    if (!fadeTimer.value && isPlaying.value) isPlaying.value = false
  }

  const fadeOut = (duration = 3000) => {
    return new Promise((resolve) => {
      if (fadeTimer.value) clearInterval(fadeTimer.value)
      const stepTime = 50
      const steps = duration / stepTime
      const stepVol = audio.volume / steps

      fadeTimer.value = setInterval(() => {
        if (audio.volume - stepVol > 0) {
          audio.volume -= stepVol
        } else {
          audio.volume = 0
          audio.pause()
          clearInterval(fadeTimer.value)
          fadeTimer.value = null
          resolve()
        }
      }, stepTime)
    })
  }

  const fadeIn = (duration = 3000) => {
    if (fadeTimer.value) clearInterval(fadeTimer.value)
    const stepTime = 50
    const steps = duration / stepTime
    const targetVolume = volume.value
    const stepVol = targetVolume / steps

    fadeTimer.value = setInterval(() => {
      if (audio.volume + stepVol < targetVolume) {
        audio.volume += stepVol
      } else {
        audio.volume = targetVolume
        clearInterval(fadeTimer.value)
        fadeTimer.value = null
      }
    }, stepTime)
  }

  const switchTrack = async (trackName) => {
    if (currentTrackName.value === trackName) return
    const wasPlaying = isPlaying.value
    if (wasPlaying) {
      if (currentTrackName.value) {
        trackHistory.value[currentTrackName.value] = audio.currentTime
      }
      await fadeOut(1200)
    }
    const fullPath = `/bgm/${trackName}.mp3`
    if (audio.src.indexOf(fullPath) === -1) {
        audio.src = fullPath
        audio.load()
    }
    currentTrackName.value = trackName
    let startTime = 0
    if (trackHistory.value[trackName] !== undefined) {
      startTime = trackHistory.value[trackName]
    } else if (trackEntryPoints[trackName] !== undefined) {
      startTime = trackEntryPoints[trackName]
    } else {
      startTime = 0
    }
    if (isFinite(startTime)) {
       audio.currentTime = startTime
    }
    if (wasPlaying) {
      audio.volume = 0
      audio.play().catch(e => console.warn('Switch play prevented:', e))
      fadeIn(3000)
    }
  }

  const toggle = () => {
    if (isPlaying.value) {
      isPlaying.value = false
      if (currentTrackName.value) {
        trackHistory.value[currentTrackName.value] = audio.currentTime
      }
      fadeOut(800)
    } else {
      isPlaying.value = true
      if (!audio.src) {
        switchTrack('hero')
      } else {
        audio.volume = 0
        audio.play().catch(e => {
          console.warn('Play blocked:', e)
          isPlaying.value = false
        })
        fadeIn(3000)
      }
    }
  }

  return {
    audio,
    isPlaying,
    currentTrackName,
    switchTrack,
    toggle
  }
})
