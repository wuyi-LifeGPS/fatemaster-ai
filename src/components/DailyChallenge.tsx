'use client'

import { useMemo, useState, useCallback, memo } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const CHALLENGES = [
  { id: 'meditate', title: '冥想5分钟', emoji: '🧘', desc: '静心冥想，放松身心' },
  { id: 'gratitude', title: '记录3件感恩的事', emoji: '🙏', desc: '培养感恩心态' },
  { id: 'water', title: '喝8杯水', emoji: '💧', desc: '保持身体水分充足' },
  { id: 'exercise', title: '运动30分钟', emoji: '💪', desc: '保持身体健康' },
  { id: 'read', title: '阅读30分钟', emoji: '📖', desc: '充实精神世界' },
  { id: 'sleep', title: '11点前入睡', emoji: '😴', desc: '保证充足睡眠' },
  { id: 'nophone', title: '睡前1小时不玩手机', emoji: '📵', desc: '提高睡眠质量' },
  { id: 'healthy', title: '吃一份水果', emoji: '🍎', desc: '补充维生素' },
  { id: 'walk', title: '散步10000步', emoji: '🚶', desc: '保持活动量' },
  { id: 'breathe', title: '深呼吸10次', emoji: '🌬️', desc: '缓解压力' },
  { id: 'smile', title: '对陌生人微笑', emoji: '😊', desc: '传递善意' },
  { id: 'journal', title: '写日记', emoji: '✍️', desc: '记录生活感悟' },
  { id: 'clean', title: '整理房间', emoji: '🧹', desc: '清理环境，清理心情' },
  { id: 'call', title: '给家人打电话', emoji: '📞', desc: '维系亲情' },
  { id: 'learn', title: '学习新技能', emoji: '🎓', desc: '不断进步' },
  { id: 'save', title: '存一笔钱', emoji: '💰', desc: '理财规划' },
  { id: 'music', title: '听一首喜欢的歌', emoji: '🎵', desc: '放松心情' },
  { id: 'nature', title: '亲近大自然', emoji: '🌳', desc: '感受自然之美' },
  { id: 'help', title: '帮助一个人', emoji: '🤝', desc: '传递爱心' },
  { id: 'reflect', title: '复盘今日得失', emoji: '🤔', desc: '总结经验教训' },
]

const STORAGE_KEY = 'lifegps_daily_challenges'

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]
}

function getTodayChallenges(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return data[getTodayKey()] || []
  } catch {
    return []
  }
}

function saveTodayChallenges(challenges: string[]) {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  data[getTodayKey()] = challenges
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function getDailyChallenges(): typeof CHALLENGES[0][] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const indices = [
    dayOfYear % CHALLENGES.length,
    (dayOfYear * 3 + 7) % CHALLENGES.length,
    (dayOfYear * 5 + 11) % CHALLENGES.length,
  ]
  return indices.map((i) => CHALLENGES[i])
}

function DailyChallenge() {
  const [completed, setCompleted] = useState<string[]>(getTodayChallenges)
  const challenges = useMemo(() => getDailyChallenges(), [])

  const toggleChallenge = useCallback((id: string) => {
    hapticLight()
    const updated = completed.includes(id)
      ? completed.filter((c) => c !== id)
      : [...completed, id]
    setCompleted(updated)
    saveTodayChallenges(updated)
    showToast(updated.includes(id) ? '已完成挑战' : '已取消', 'success')
  }, [completed])

  const progress = Math.round((completed.length / challenges.length) * 100)

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h3 className="text-gold text-sm font-semibold">每日挑战</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-gold/50" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] text-moonly-muted">{completed.length}/{challenges.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        {challenges.map((challenge) => {
          const isCompleted = completed.includes(challenge.id)
          return (
            <button
              key={challenge.id}
              onClick={() => toggleChallenge(challenge.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition ${
                isCompleted ? 'bg-green-500/5' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition ${
                isCompleted ? 'bg-green-500/10' : 'bg-white/5'
              }`}>
                {isCompleted ? '✓' : challenge.emoji}
              </div>
              <div className="flex-1 text-left">
                <div className={`text-sm ${isCompleted ? 'text-white/40 line-through' : 'text-white'}`}>
                  {challenge.title}
                </div>
                <div className="text-[10px] text-moonly-muted">{challenge.desc}</div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                isCompleted
                  ? 'border-green-500 bg-green-500/20'
                  : 'border-white/20'
              }`}
              >
                {isCompleted && <div className="w-2 h-2 rounded-full bg-green-400" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default memo(DailyChallenge)
