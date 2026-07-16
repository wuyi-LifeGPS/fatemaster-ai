'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setVisible(true)
    setProgress(0)

    // 模拟加载进度
    const timers: NodeJS.Timeout[] = []
    timers.push(setTimeout(() => setProgress(30), 50))
    timers.push(setTimeout(() => setProgress(60), 150))
    timers.push(setTimeout(() => setProgress(80), 300))
    timers.push(setTimeout(() => {
      setProgress(100)
      timers.push(setTimeout(() => setVisible(false), 300))
    }, 500))

    return () => timers.forEach(clearTimeout)
  }, [pathname])

  if (!visible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[300] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#c9a96e] via-[#e0c896] to-[#c9a96e] transition-all duration-300 ease-out"
        style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
      />
    </div>
  )
}
