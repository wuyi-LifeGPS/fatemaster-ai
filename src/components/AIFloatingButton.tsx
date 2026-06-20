'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AIFloatingButton() {
  const [pulse, setPulse] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 2000)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    // 跳转到 AI 咨询页面或唤起聊天
    window.location.href = '/bu'
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`ai-float-btn flex items-center justify-center ${pulse ? 'animate-pulse-gold' : ''}`}
      aria-label="AI 命理师"
    >
      <Image
        src="/images/ai-avatar.png"
        alt="AI命理师"
        width={48}
        height={48}
        className="rounded-full object-cover"
      />
      {showTooltip && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap bg-moonly-card text-white text-sm px-3 py-1.5 rounded-lg border border-moonly-card-border backdrop-blur-xl z-50">
          向 AI 命理师提问
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-moonly-card border-r border-t border-moonly-card-border rotate-45" />
        </div>
      )}
    </button>
  )
}
