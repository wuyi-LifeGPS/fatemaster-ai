'use client'

import { useMemo, memo } from 'react'

const LUCKY_COLORS = [
  { name: '红色', hex: '#ef4444', wuxing: '火', desc: '热情活力，增强自信' },
  { name: '橙色', hex: '#f97316', wuxing: '火', desc: '温暖积极，促进社交' },
  { name: '黄色', hex: '#eab308', wuxing: '土', desc: '稳重踏实，招财进宝' },
  { name: '绿色', hex: '#22c55e', wuxing: '木', desc: '生机盎然，舒缓压力' },
  { name: '蓝色', hex: '#3b82f6', wuxing: '水', desc: '冷静理智，助益思考' },
  { name: '紫色', hex: '#a855f7', wuxing: '火', desc: '高贵神秘，提升气场' },
  { name: '白色', hex: '#f8fafc', wuxing: '金', desc: '纯洁简洁，净化心灵' },
  { name: '黑色', hex: '#1e293b', wuxing: '水', desc: '沉稳内敛，聚气纳福' },
]

function getDailyLuckyColor(date: Date): { lucky: typeof LUCKY_COLORS[0]; avoid: typeof LUCKY_COLORS[0] } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const luckyIndex = dayOfYear % LUCKY_COLORS.length
  const avoidIndex = (dayOfYear + 4) % LUCKY_COLORS.length
  return {
    lucky: LUCKY_COLORS[luckyIndex],
    avoid: LUCKY_COLORS[avoidIndex],
  }
}

function LuckyColor() {
  const { lucky, avoid } = useMemo(() => getDailyLuckyColor(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">今日幸运色</h3>
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div
            className="w-10 h-10 rounded-full border-2 border-white/20 flex-shrink-0"
            style={{ backgroundColor: lucky.hex }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-medium">{lucky.name}</span>
              <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded">宜</span>
            </div>
            <div className="text-moonly-muted text-xs">{lucky.desc}</div>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div
            className="w-10 h-10 rounded-full border-2 border-white/20 flex-shrink-0"
            style={{ backgroundColor: avoid.hex }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm font-medium">{avoid.name}</span>
              <span className="text-[10px] text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">忌</span>
            </div>
            <div className="text-moonly-muted text-xs">{avoid.desc}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LuckyColor)
