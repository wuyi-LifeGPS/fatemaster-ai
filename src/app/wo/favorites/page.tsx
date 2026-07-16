'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getFavorites, removeFavorite, type FavoriteItem } from '@/components/FavoriteButton'
import { showToast } from '@/components/Toast'
import { hapticLight } from '@/lib/haptic'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  useEffect(() => {
    setFavorites(getFavorites())
  }, [])

  const handleRemove = (id: string) => {
    hapticLight()
    removeFavorite(id)
    setFavorites(getFavorites())
    showToast('已取消收藏', 'info')
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content animate-fade-in pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f0b1a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="text-gold-gradient text-base font-bold">我的收藏</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* 内容 */}
      <div className="px-4 py-4">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h3 className="text-white font-medium mb-1">暂无收藏</h3>
            <p className="text-moonly-muted text-sm">收藏您感兴趣的命盘和分析，方便随时查看</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div
                key={fav.id}
                className="moonly-card p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-lg flex-shrink-0">
                  {fav.type === 'profile' ? '👤' : fav.type === 'analysis' ? '📊' : '📅'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{fav.title}</div>
                  {fav.subtitle && (
                    <div className="text-moonly-muted text-xs truncate">{fav.subtitle}</div>
                  )}
                </div>
                <button
                  onClick={() => handleRemove(fav.id)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
