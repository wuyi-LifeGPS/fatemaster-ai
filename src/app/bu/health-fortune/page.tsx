'use client'

import { useState } from 'react'
import Link from 'next/link'

const HEALTH_TYPES = [
  { type: '整体健康', icon: '💪', advice: ['保持规律作息', '适量运动', '均衡饮食'] },
  { type: '肠胃健康', icon: '🍽️', advice: ['少食多餐', '避免辛辣', '细嚼慢咽'] },
  { type: '睡眠质量', icon: '😴', advice: ['规律作息', '睡前放松', '避免蓝光'] },
  { type: '情绪管理', icon: '🧘', advice: ['深呼吸', '冥想放松', '与人倾诉'] },
  { type: '运动健身', icon: '🏃', advice: ['循序渐进', '热身拉伸', '补充水分'] },
  { type: '饮食调理', icon: '🥗', advice: ['多吃蔬果', '少油少盐', '多喝水'] },
]

function getHealthFortune(healthType: string, birthDate: string) {
  const health = HEALTH_TYPES.find(h => h.type === healthType)
  if (!health) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 30) + 70
  
  return {
    ...health,
    luck,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
    focus: luck >= 80 ? '保持良好状态' : luck >= 70 ? '注意调整' : '需要关注',
  }
}

export default function HealthFortunePage() {
  const [healthType, setHealthType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!healthType || !birthDate) return
    setResult(getHealthFortune(healthType, birthDate))
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">健康运势</h1>
          <p className="text-moonly-text-muted text-xs">身体为本，健康第一</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {HEALTH_TYPES.map(health => (
              <button
                key={health.type}
                onClick={() => setHealthType(health.type)}
                className={`moonly-card p-4 text-center transition ${
                  healthType === health.type
                    ? 'border-moonly-gold/50 bg-moonly-gold/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{health.icon}</div>
                <div className="text-white text-sm font-medium">{health.type}</div>
              </button>
            ))}
          </div>

          <div className="moonly-card p-4 mb-6">
            <label className="text-white text-sm font-medium mb-2 block">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-moonly-gold/30"
            />
          </div>

          <button
            onClick={analyze}
            disabled={!healthType || !birthDate}
            className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看健康运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}运势</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">健康指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${
                    result.luck >= 85 ? 'bg-green-400' : result.luck >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className={`text-lg font-bold mt-1 ${result.color}`}>{result.luck}分</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 健康建议</h3>
            <div className="space-y-2">
              {result.advice.map((tip: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-moonly-text-secondary text-sm">
                  <span className="text-gold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">🎯 关注重点</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              今日{result.focus}。{result.luck >= 80 ? '继续保持健康的生活方式。' : result.luck >= 70 ? '注意劳逸结合，适当休息。' : '建议及时就医检查，不要拖延。'}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setHealthType(''); setBirthDate('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
