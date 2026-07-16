'use client'

import { useEffect } from 'react'

interface UseKeyboardOptions {
  onEscape?: () => void
  onEnter?: () => void
  enabled?: boolean
}

export default function useKeyboard({ onEscape, onEnter, enabled = true }: UseKeyboardOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault()
        onEscape()
      }
      if (e.key === 'Enter' && !e.shiftKey && onEnter) {
        // 避免在textarea中触发
        const target = e.target as HTMLElement
        if (target.tagName === 'TEXTAREA') return
        e.preventDefault()
        onEnter()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onEnter, enabled])
}
