'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsTransitioning(true)
    const timer = setTimeout(() => setIsTransitioning(false), 150)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isTransitioning) return null

  return (
    <div className="fixed inset-0 z-[150] pointer-events-none">
      <div className="absolute inset-0 bg-[#1e1c35]/30 animate-fade-in" />
    </div>
  )
}
