'use client'

import { useMemo } from 'react'

interface Achievement {
  id: string
  name: string
  desc: string
  emoji: string
  condition: (s: { profiles: number; analyses: number; visits: number; streak: number }) => boolean
}

function getAchievementState(): { profiles: number; analyses: number; visits: number; streak: number } {
  if (typeof window === 'undefined') {
    return { profiles: 0, analyses: 0, visits: 0, streak: 0 }
  }
  const stats = JSON.parse(localStorage.getItem('lifegps_usage_stats') || '{}')
  const profiles = JSON.parse(localStorage.getItem('lifegps_profiles') || '[]').length
  return {
    profiles,
    analyses: stats.totalAnalyses || 0,
    visits: stats.totalVisits || 0,
    streak: stats.visitStreak || 0,
  }
}

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_profile', name: '初次相识', desc: '添加第一个八字档案', emoji: '🌱', condition: (s) => s.profiles >= 1 },
  { id: 'three_profiles', name: '三生有幸', desc: '添加3个八字档案', emoji: '🌿', condition: (s) => s.profiles >= 3 },
  { id: 'first_analysis', name: '初次探索', desc: '完成第一次命理分析', emoji: '🔍', condition: (s) => s.analyses >= 1 },
  { id: 'ten_analyses', name: '探索者', desc: '完成10次命理分析', emoji: '🧭', condition: (s) => s.analyses >= 10 },
  { id: 'fifty_analyses', name: '命理大师', desc: '完成50次命理分析', emoji: '👑', condition: (s) => s.analyses >= 50 },
  { id: 'first_visit', name: '初次到访', desc: '第一次打开应用', emoji: '🚪', condition: (s) => s.visits >= 1 },
  { id: 'seven_day_streak', name: '七日连珠', desc: '连续7天访问应用', emoji: '⭐', condition: (s) => s.streak >= 7 },
  { id: 'thirty_day_streak', name: '月华如练', desc: '连续30天访问应用', emoji: '🌙', condition: (s) => s.streak >= 30 },
]

export default function AchievementSystem() {
  const state = useMemo(() => getAchievementState(), [])

  const unlocked = ACHIEVEMENTS.filter(a => a.condition(state))
  const locked = ACHIEVEMENTS.filter(a => !a.condition(state))

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🏆</span>
        <h3 className="text-gold text-sm font-semibold">成就</h3>
        <span className="text-[10px] text-moonly-muted ml-auto">
          {unlocked.length}/{ACHIEVEMENTS.length}
        </span>
      </div>

      {unlocked.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {unlocked.map((a) => (
            <div key={a.id} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-gold/5 border border-gold/10">
              <span className="text-xl">{a.emoji}</span>
              <span className="text-white text-[10px] font-medium text-center">{a.name}</span>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-moonly-muted">待解锁</p>
          <div className="grid grid-cols-4 gap-2">
            {locked.slice(0, 4).map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/[0.02] opacity-40">
                <span className="text-xl grayscale">{a.emoji}</span>
                <span className="text-white text-[10px] text-center">{a.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
