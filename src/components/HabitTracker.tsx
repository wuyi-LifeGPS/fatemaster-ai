'use client'

import { useState, useEffect, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const STORAGE_KEY = 'lifegps_habits'

interface Habit {
  id: string
  name: string
  emoji: string
  completedDates: string[]
  createdAt: string
}

const DEFAULT_HABITS: Habit[] = [
  { id: 'meditate', name: '冥想', emoji: '🧘', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'gratitude', name: '感恩', emoji: '🙏', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'read', name: '阅读', emoji: '📖', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'exercise', name: '运动', emoji: '💪', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'sleep_early', name: '早睡', emoji: '😴', completedDates: [], createdAt: new Date().toISOString() },
  { id: 'water', name: '喝水', emoji: '💧', completedDates: [], createdAt: new Date().toISOString() },
]

function getHabits(): Habit[] {
  if (typeof window === 'undefined') return DEFAULT_HABITS
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return stored.length > 0 ? stored : DEFAULT_HABITS
  } catch {
    return DEFAULT_HABITS
  }
}

function saveHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

function getWeekDays(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>(getHabits)
  const [showAdd, setShowAdd] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitEmoji, setNewHabitEmoji] = useState('⭐')

  useEffect(() => {
    setHabits(getHabits())
  }, [])

  const toggleHabit = useCallback((habitId: string) => {
    hapticLight()
    const today = getTodayKey()
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h
      const isCompleted = h.completedDates.includes(today)
      return {
        ...h,
        completedDates: isCompleted
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today],
      }
    })
    setHabits(updated)
    saveHabits(updated)
    showToast(updated.find(h => h.id === habitId)?.completedDates.includes(today) ? '已完成' : '已取消', 'success')
  }, [habits])

  const addHabit = useCallback(() => {
    if (!newHabitName.trim()) return
    hapticLight()
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      emoji: newHabitEmoji,
      completedDates: [],
      createdAt: new Date().toISOString(),
    }
    const updated = [...habits, habit]
    setHabits(updated)
    saveHabits(updated)
    setNewHabitName('')
    setNewHabitEmoji('⭐')
    setShowAdd(false)
    showToast('习惯已添加', 'success')
  }, [newHabitName, newHabitEmoji, habits])

  const deleteHabit = useCallback((habitId: string) => {
    hapticLight()
    const updated = habits.filter((h) => h.id !== habitId)
    setHabits(updated)
    saveHabits(updated)
    showToast('已删除', 'info')
  }, [habits])

  const weekDays = getWeekDays()
  const todayKey = getTodayKey()

  const weekProgress = Math.round(
    (habits.reduce((sum, h) => sum + h.completedDates.filter((d) => weekDays.includes(d)).length, 0) /
      (habits.length * 7)) * 100
  )

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <h3 className="text-gold text-sm font-semibold">习惯打卡</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gold/50" style={{ width: `${weekProgress}%` }} />
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition"
          >
            {showAdd ? '✕' : '+'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-3 animate-fade-in">
          <div className="flex gap-2">
            <input
              type="text"
              value={newHabitEmoji}
              onChange={(e) => setNewHabitEmoji(e.target.value)}
              className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-center text-lg focus:outline-none focus:border-gold/30"
              maxLength={2}
            />
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              placeholder="习惯名称"
              className="flex-1 h-10 bg-white/5 border border-white/10 rounded-xl px-3 text-white text-sm placeholder:text-moonly-muted focus:outline-none focus:border-gold/30"
            />
            <button
              onClick={addHabit}
              disabled={!newHabitName.trim()}
              className="px-4 h-10 rounded-xl bg-gold/10 text-gold text-xs hover:bg-gold/20 transition disabled:opacity-30"
            >
              添加
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {habits.map((habit) => {
          const isCompletedToday = habit.completedDates.includes(todayKey)
          return (
            <div
              key={habit.id}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
            >
              <button
                onClick={() => toggleHabit(habit.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                  isCompletedToday
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-white/5 text-white/20'
                }`}
              >
                {isCompletedToday ? '✓' : habit.emoji}
              </button>
              <div className="flex-1">
                <div className={`text-sm ${isCompletedToday ? 'text-white/60 line-through' : 'text-white'}`}>
                  {habit.name}
                </div>
                <div className="flex gap-0.5 mt-1">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className={`w-1.5 h-1.5 rounded-full ${
                        habit.completedDates.includes(day)
                          ? 'bg-green-400/60'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={() => deleteHabit(habit.id)}
                className="text-white/10 hover:text-red-400 transition text-xs"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
