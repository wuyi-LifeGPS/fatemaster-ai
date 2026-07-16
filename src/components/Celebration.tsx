'use client'

import { useEffect, useState } from 'react'

function createParticle(x: number, y: number) {
  const colors = ['#c9a96e', '#6b5b95', '#f87171', '#4ade80', '#60a5fa', '#fbbf24']
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 10 - 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 6 + 2,
    life: 1,
    decay: Math.random() * 0.02 + 0.01,
  }
}

export default function Celebration({ show, onComplete }: { show: boolean; onComplete?: () => void }) {
  const [particles, setParticles] = useState<Array<ReturnType<typeof createParticle>>>([])

  useEffect(() => {
    if (!show) return

    const w = window.innerWidth
    const h = window.innerHeight
    const initial = Array.from({ length: 60 }, () => createParticle(w / 2, h / 2))
    setParticles(initial)

    let animId: number
    const animate = () => {
      setParticles(prev => {
        const next = prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - p.decay,
          }))
          .filter(p => p.life > 0)

        if (next.length === 0) {
          cancelAnimationFrame(animId)
          onComplete?.()
        }
        return next
      })
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animId)
  }, [show, onComplete])

  if (!show || particles.length === 0) return null

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: p.life,
            transform: `scale(${p.life})`,
          }}
        />
      ))}
    </div>
  )
}
