'use client'

import { useState, useEffect, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const STORAGE_KEY = 'lifegps_daily_mood'

const MOODS = [
  { emoji: '😫', label: '糟糕', color: '#ef4444', score: 1 },
  { emoji: '😔', label: '低落', color: '#f97316', score: 2 },
  { emoji: '😐', label: '平淡', color: '#eab308', score: 3 },
  { emoji: '🙂', label: '不错', color: '#22c55e', score: 4 },
  { emoji: '😊', label: '开心', color: '#10b981', score: 5 },
  { emoji: '🤩', label: '超棒', color: '#14b8a6', score: 6 },
]

interface MoodEntry {
  date: string
  mood: number
  note: string
}

function getMoodHistory(): MoodEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveMoodEntry(entry: MoodEntry) {
  const history = getMoodHistory()
  const filtered = history.filter((e) => e.date !== entry.date)
  filtered.push(entry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(-30)))
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [note, setNote] = useState('')
  const [history, setHistory] = useState<MoodEntry[]>([])

  useEffect(() => {
    const h = getMoodHistory()
    setHistory(h)
    const today = new Date().toISOString().split('T')[0]
    const todayEntry = h.find((e) => e.date === today)
    if (todayEntry) {
      setSelectedMood(todayEntry.mood)
      setNote(todayEntry.note)
    }
  }, [])

  const handleSelectMood = useCallback((score: number) => {
    hapticLight()
    setSelectedMood(score)
    const entry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: score,
      note: note,
    }
    saveMoodEntry(entry)
    setHistory(getMoodHistory())
    showToast('心情已记录', 'success')
  }, [note])

  const handleSaveNote = useCallback(() => {
    if (selectedMood === null) return
    hapticLight()
    const entry: MoodEntry = {
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      note: note,
    }
    saveMoodEntry(entry)
    setHistory(getMoodHistory())
    showToast('备注已保存', 'success')
  }, [selectedMood, note])

  const weekHistory = history.slice(-7)
  const avgMood = weekHistory.length > 0
    ? weekHistory.reduce((sum, e) => sum + e.mood, 0) / weekHistory.length
    : 0

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">😊</span>
          <h3 className="text-gold text-sm font-semibold">心情日记</h3>
        </div>
        {weekHistory.length > 0 && (
          <span className="text-[10px] text-moonly-muted">
            本周平均 {avgMood.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex justify-center gap-2 mb-3">
        {MOODS.map((mood) => (
          <button
            key={mood.score}
            onClick={() => handleSelectMood(mood.score)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
              selectedMood === mood.score
                ? 'bg-white/10'
                : 'hover:bg-white/5'
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-[10px] text-moonly-muted">{mood.label}</span>
            {selectedMood === mood.score && (
              <div
                className="w-1.5 h-1.5 rounded-full mt-0.5"
                style={{ backgroundColor: mood.color }}
              />
            )}
          </button>
        ))}
      </div>

      {selectedMood !== null && (
        <div className="animate-fade-in">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="今天发生了什么？（可选）"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-moonly-muted focus:outline-none focus:border-gold/30 resize-none mb-2"
            rows={2}
          />
          <button
            onClick={handleSaveNote}
            className="w-full py-2 rounded-xl bg-gold/10 text-gold text-xs hover:bg-gold/20 transition"
          >
            保存备注
          </button>
        </div>
      )}

      {weekHistory.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <p className="text-[10px] text-moonly-muted mb-2">近7天心情</p>
          <div className="flex gap-1">
            {weekHistory.map((entry, i) => {
              const mood = MOODS.find((m) => m.score === entry.mood)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-lg flex items-center justify-center text-sm"
                    style={{
                      height: `${entry.mood * 8}px`,
                      backgroundColor: mood?.color + '20' || '#ffffff10',
                    }}
                  >
                    {mood?.emoji}
                  </div>
                  <span className="text-[8px] text-moonly-muted">
                    {new Date(entry.date).getDate()}日
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
