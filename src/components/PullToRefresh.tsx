'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void
  children: React.ReactNode
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)

  const isAtTop = useCallback(() => {
    return (window.scrollY || document.documentElement.scrollTop) <= 1
  }, [])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isAtTop()) {
      startY.current = e.touches[0].clientY
      setPulling(true)
    }
  }, [isAtTop])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling) return
    const delta = e.touches[0].clientY - startY.current
    if (delta > 0 && delta < 120) {
      // 阻力效果
      setPullDistance(delta * 0.5)
    }
  }, [pulling])

  const handleTouchEnd = useCallback(async () => {
    if (!pulling) return
    setPulling(false)

    if (pullDistance > 40) {
      setRefreshing(true)
      setPullDistance(50)
      try {
        await onRefresh()
      } finally {
        setRefreshing(false)
        setPullDistance(0)
      }
    } else {
      setPullDistance(0)
    }
  }, [pulling, pullDistance, onRefresh])

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 下拉指示器 */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center justify-center overflow-hidden z-10"
        style={{
          height: Math.max(0, pullDistance),
          opacity: Math.min(1, pullDistance / 30),
        }}
      >
        <div className="flex flex-col items-center gap-1">
          {refreshing ? (
            <div className="w-5 h-5 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#c9a96e"
              strokeWidth="2"
              style={{
                transform: `rotate(${Math.min(pullDistance * 3, 180)}deg)`,
                transition: 'transform 0.2s',
              }}
            >
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          )}
          <span className="text-xs text-moonly-muted">
            {refreshing ? '刷新中...' : pullDistance > 40 ? '释放刷新' : '下拉刷新'}
          </span>
        </div>
      </div>

      {/* 内容区域 */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pulling ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {children}
      </div>
    </div>
  )
}
