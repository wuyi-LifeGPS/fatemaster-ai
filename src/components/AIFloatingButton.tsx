'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function AIFloatingButton() {
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 2000)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    window.location.href = '/bu/chat'
  }

  return (
    <button
      onClick={handleClick}
      className={`ai-float-btn flex items-center justify-center ${pulse ? 'animate-pulse-gold' : ''}`}
      aria-label="AI 命理师"
    >
      <Image
        src="/images/ai-avatar-new.png"
        alt="AI命理师"
        width={52}
        height={52}
        className="rounded-full object-cover"
      />
    </button>
  )
}
