'use client'

import { useState, useEffect } from 'react'
import { showToast } from './Toast'

const CURRENT_VERSION = '2.0.0'
const VERSION_KEY = 'lifegps_app_version'

export default function UpdatePrompt() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(VERSION_KEY)
    if (stored && stored !== CURRENT_VERSION) {
      setShow(true)
    }
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[180] animate-slide-down">
      <div className="bg-[#1a1428] border border-gold/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-xl">
          🎉
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white text-sm font-medium">LifeGPS 已更新</div>
          <div className="text-moonly-muted text-xs">体验全新功能和优化</div>
        </div>
        <button
          onClick={() => {
            setShow(false)
            window.location.reload()
          }}
          className="px-4 py-2 rounded-xl bg-gold text-[#1a1428] text-xs font-semibold hover:bg-gold/90 transition flex-shrink-0"
        >
          立即刷新
        </button>
        <button
          onClick={() => setShow(false)}
          className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-moonly-muted hover:text-white transition flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
