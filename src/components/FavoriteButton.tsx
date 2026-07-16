'use client'

import { useState, useEffect, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const FAVORITES_KEY = 'lifegps_favorites'

export interface FavoriteItem {
  id: string
  type: 'profile' | 'analysis' | 'daily'
  title: string
  subtitle?: string
  data?: any
  createdAt: string
}

export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')
  } catch {
    return []
  }
}

export function addFavorite(item: Omit<FavoriteItem, 'id' | 'createdAt'>): FavoriteItem {
  const favorites = getFavorites()
  const newItem: FavoriteItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  }
  favorites.unshift(newItem)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 100))) // 最多保留100条
  return newItem
}

export function removeFavorite(id: string) {
  const favorites = getFavorites().filter(f => f.id !== id)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function isFavorited(type: string, dataId: string): boolean {
  return getFavorites().some(f => f.type === type && f.data?.id === dataId)
}

interface FavoriteButtonProps {
  type: 'profile' | 'analysis' | 'daily'
  title: string
  subtitle?: string
  data?: any
  className?: string
}

export function FavoriteButton({ type, title, subtitle, data, className = '' }: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false)

  useEffect(() => {
    setFavorited(isFavorited(type, data?.id))
  }, [type, data])

  const toggle = useCallback(() => {
    hapticLight()
    if (favorited) {
      const fav = getFavorites().find(f => f.type === type && f.data?.id === data?.id)
      if (fav) removeFavorite(fav.id)
      setFavorited(false)
      showToast('已取消收藏', 'info')
    } else {
      addFavorite({ type, title, subtitle, data })
      setFavorited(true)
      showToast('已添加到收藏', 'success')
    }
  }, [favorited, type, title, subtitle, data])

  return (
    <button
      onClick={toggle}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
        favorited
          ? 'bg-gold/20 text-gold'
          : 'bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10'
      } ${className}`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
