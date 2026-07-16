'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const STORAGE_KEY = 'lifegps_gratitude_entries'

interface GratitudeEntry {
  id: string
  text: string
  date: string
  mood: number
}

function getEntries(): GratitudeEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveEntries(entries: GratitudeEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function GratitudeJournal() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [newEntry, setNewEntry] = useState('')
  const [mood, setMood] = useState(3)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  const handleAdd = useCallback(() => {
    if (!newEntry.trim()) return
    hapticLight()
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: newEntry.trim(),
      date: new Date().toISOString(),
      mood,
    }
    const updated = [entry, ...entries].slice(0, 30)
    setEntries(updated)
    saveEntries(updated)
    setNewEntry('')
    setMood(3)
    setShowForm(false)
    showToast('已记录感恩时刻', 'success')
  }, [newEntry, mood, entries])

  const handleDelete = useCallback((id: string) => {
    hapticLight()
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveEntries(updated)
    showToast('已删除', 'info')
  }, [entries])

  const todayEntries = entries.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  })

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🙏</span>
          <h3 className="text-gold text-sm font-semibold">感恩日记</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition"
        >
          {showForm ? '✕' : '+'}
        </button>
      </div>

      {showForm && (
        <div className="mb-3 animate-fade-in">
          <textarea
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            placeholder="今天有什么让你感恩的事？"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-moonly-muted focus:outline-none focus:border-gold/30 resize-none"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-lg transition ${mood >= m ? 'opacity-100' : 'opacity-30'}`}
                >
                  {m <= 2 ? '😔' : m === 3 ? '😐' : '😊'}
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newEntry.trim()}
              className="px-4 py-1.5 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition disabled:opacity-30"
            >
              记录
            </button>
          </div>
        </div>
      )}

      {todayEntries.length > 0 ? (
        <div className="space-y-2">
          {todayEntries.slice(0, 3).map((entry) => (
            <div key={entry.id} className="flex items-start gap-2 p-2 rounded-lg bg-white/5">
              <span className="text-sm mt-0.5">
                {entry.mood <= 2 ? '😔' : entry.mood === 3 ? '😐' : '😊'}
              </span>
              <p className="text-white/80 text-xs flex-1">{entry.text}</p>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-white/20 hover:text-red-400 transition text-xs"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-moonly-muted text-xs text-center py-2">
          {showForm ? '' : '今天还没有记录，点击 + 开始'}
        </p>
      )}
    </div>
  )
}

export default memo(GratitudeJournal)
