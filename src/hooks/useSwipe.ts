'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SwipeOptions {
  threshold?: number
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(options: SwipeOptions = {}) {
  const { threshold = 50 } = options
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const touchEnd = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY }
    touchEnd.current = null
  }, [])

  const onTouchEnd = useCallback((e: TouchEvent) => {
    touchEnd.current = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY }
    handleSwipe()
  }, [])

  const handleSwipe = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return

    const deltaX = touchEnd.current.x - touchStart.current.x
    const deltaY = touchEnd.current.y - touchStart.current.y
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    // 水平滑动
    if (absX > absY && absX > threshold) {
      if (deltaX > 0) {
        options.onSwipeRight?.()
      } else {
        options.onSwipeLeft?.()
      }
    }

    // 垂直滑动
    if (absY > absX && absY > threshold) {
      if (deltaY > 0) {
        options.onSwipeDown?.()
      } else {
        options.onSwipeUp?.()
      }
    }
  }, [threshold, options])

  useEffect(() => {
    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchStart, onTouchEnd])
}

// 左滑返回上一页
export function useSwipeBack() {
  const router = useRouter()

  useSwipe({
    onSwipeRight: () => {
      // 从左侧边缘开始滑动才返回
      router.back()
    },
  })
}

// 双击返回顶部
export function useDoubleTapToTop() {
  const lastTap = useRef(0)

  useEffect(() => {
    const handler = () => {
      const now = Date.now()
      if (now - lastTap.current < 300) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      lastTap.current = now
    }

    document.addEventListener('touchend', handler)
    return () => document.removeEventListener('touchend', handler)
  }, [])
}
