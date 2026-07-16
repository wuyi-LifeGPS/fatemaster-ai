'use client'

import { useState, useEffect, useCallback } from 'react'
import { playSuccessSound, playErrorSound, playNotificationSound } from '@/lib/sound'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0
const listeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notifyListeners() {
  listeners.forEach(l => l([...toasts]))
}

export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const id = ++toastId
  toasts = [...toasts, { id, message, type }]
  notifyListeners()

  // 播放音效
  if (type === 'success') playSuccessSound()
  else if (type === 'error') playErrorSound()
  else playNotificationSound()

  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }, 2500)
}

export default function ToastContainer() {
  const [, setLocalToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (t: Toast[]) => setLocalToasts(t)
    listeners.push(listener)
    return () => {
      const idx = listeners.indexOf(listener)
      if (idx > -1) listeners.splice(idx, 1)
    }
  }, [])

  // 读取最新状态
  const currentToasts = toasts

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed top-4 left-0 right-0 z-[100] flex flex-col items-center gap-2 pointer-events-none px-4">
      {currentToasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto px-4 py-2.5 rounded-xl text-sm font-medium shadow-lg animate-fade-in-scale ${
            t.type === 'success'
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : t.type === 'error'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'bg-white/10 text-white border border-white/20'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
