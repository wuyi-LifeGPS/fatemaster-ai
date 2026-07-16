'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ShortcutItem {
  label: string
  href: string
  icon: string
}

const DEFAULT_SHORTCUTS: ShortcutItem[] = [
  { label: '八字', href: '/bazi', icon: '🎯' },
  { label: '合婚', href: '/match', icon: '💕' },
  { label: '事业', href: '/career', icon: '💼' },
  { label: '起名', href: '/naming', icon: '✨' },
  { label: '天赋', href: '/talent', icon: '🌟' },
  { label: '塔罗', href: '/bu/tarot', icon: '🎴' },
]

export default function QuickShortcuts() {
  const [shortcuts, setShortcuts] = useState<ShortcutItem[]>([])

  useEffect(() => {
    // 从localStorage读取用户自定义的快捷入口
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('lifegps_shortcuts')
        if (saved) {
          setShortcuts(JSON.parse(saved))
        } else {
          setShortcuts(DEFAULT_SHORTCUTS)
        }
      } catch {
        setShortcuts(DEFAULT_SHORTCUTS)
      }
    }
  }, [])

  if (shortcuts.length === 0) return null

  return (
    <div className="px-5 py-3">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {shortcuts.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1.5 min-w-[60px] py-2 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition active:scale-95"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs text-moonly-secondary whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
