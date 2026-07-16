'use client'

import { useCallback, useRef } from 'react'

const SETTINGS_KEY = 'lifegps_settings'

function getSettings(): any {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch {
    return {}
  }
}

function isEnabled(): boolean {
  if (typeof window === 'undefined') return false
  const settings = getSettings()
  return settings.soundEnabled !== false
}

// 使用 Web Audio API 生成简单的音效
function createSound(frequency: number, duration: number, type: OscillatorType = 'sine') {
  if (typeof window === 'undefined') return
  if (!isEnabled()) return

  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + duration)
  } catch {
    // 静默失败
  }
}

export function playClickSound() {
  createSound(800, 0.05, 'sine')
}

export function playSuccessSound() {
  createSound(600, 0.1, 'sine')
  setTimeout(() => createSound(800, 0.15, 'sine'), 100)
}

export function playErrorSound() {
  createSound(200, 0.1, 'sawtooth')
}

export function playNotificationSound() {
  createSound(500, 0.08, 'sine')
  setTimeout(() => createSound(700, 0.1, 'sine'), 80)
}

export function useSound() {
  const click = useCallback(() => playClickSound(), [])
  const success = useCallback(() => playSuccessSound(), [])
  const error = useCallback(() => playErrorSound(), [])
  const notification = useCallback(() => playNotificationSound(), [])

  return { click, success, error, notification }
}
