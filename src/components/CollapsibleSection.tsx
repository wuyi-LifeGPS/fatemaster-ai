'use client'

import { useState } from 'react'
import { hapticLight } from '@/lib/haptic'

interface CollapsibleSectionProps {
  title: string
  icon?: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export default function CollapsibleSection({ title, icon, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const toggle = () => {
    hapticLight()
    setIsOpen(!isOpen)
  }

  return (
    <div className="space-y-2">
      <button
        onClick={toggle}
        className="w-full flex items-center justify-between px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm">{icon}</span>}
          <span className="text-sm text-white/80 font-medium">{title}</span>
        </div>
        <span className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="space-y-3 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  )
}
