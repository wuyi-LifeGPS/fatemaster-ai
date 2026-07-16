'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface RecentVisit {
  path: string
  label: string
  timestamp: number
}

const STORAGE_KEY = 'lifegps_recent_visits'
const MAX_RECENTS = 5

export function addRecentVisit(path: string, label: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list: RecentVisit[] = raw ? JSON.parse(raw) : []
    const filtered = list.filter(v => v.path !== path)
    filtered.unshift({ path, label, timestamp: Date.now() })
    const trimmed = filtered.slice(0, MAX_RECENTS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // ignore
  }
}

export default function RecentVisits() {
  const [visits, setVisits] = useState<RecentVisit[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) setVisits(JSON.parse(raw))
      } catch {
        // ignore
      }
    }
  }, [])

  if (visits.length === 0) return null

  return (
    <div className="px-5 py-3">
      <div className="flex items-center gap-2 mb-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-muted">
          <polyline points="12 6 12 12 16 14" />
          <circle cx="12" cy="12" r="10" />
        </svg>
        <span className="text-xs text-moonly-muted">最近访问</span>
      </div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {visits.map((visit) => (
          <Link
            key={visit.path}
            href={visit.path}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition text-xs text-moonly-secondary whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold/60"></span>
            {visit.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
