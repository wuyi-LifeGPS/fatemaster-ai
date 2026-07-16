'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const DIRECTIONS = [
  { name: '东', icon: '⬅️', meaning: '震卦，主事业、成长', lucky: '宜谈判、签约、求职', color: 'text-green-400' },
  { name: '南', icon: '⬇️', meaning: '离卦，主名声、桃花', lucky: '宜社交、表白、展示', color: 'text-red-400' },
  { name: '西', icon: '➡️', meaning: '兑卦，主子女、创意', lucky: '宜创作、娱乐、亲子', color: 'text-slate-400' },
  { name: '北', icon: '⬆️', meaning: '坎卦，主事业、智慧', lucky: '宜学习、研究、求职', color: 'text-blue-400' },
  { name: '东南', icon: '↙️', meaning: '巽卦，主财运、人缘', lucky: '宜求财、交友、合作', color: 'text-green-400' },
  { name: '西南', icon: '↗️', meaning: '坤卦，主婚姻、家庭', lucky: '宜相亲、聚会、家庭活动', color: 'text-yellow-400' },
  { name: '东北', icon: '↘️', meaning: '艮卦，主学业、知识', lucky: '宜考试、培训、进修', color: 'text-yellow-400' },
  { name: '西北', icon: '↖️', meaning: '乾卦，主贵人、权力', lucky: '宜拜访领导、求人办事', color: 'text-slate-400' },
]

const ACTIVITIES = [
  { activity: '出行', best: '东南', avoid: '西北' },
  { activity: '谈判', best: '东', avoid: '西' },
  { activity: '求财', best: '东南', avoid: '西北' },
  { activity: '求职', best: '北', avoid: '南' },
  { activity: '表白', best: '南', avoid: '北' },
  { activity: '创作', best: '西', avoid: '东' },
  { activity: '学习', best: '东北', avoid: '西南' },
  { activity: '社交', best: '南', avoid: '北' },
  { activity: '签约', best: '东', avoid: '西' },
  { activity: '拜访', best: '西北', avoid: '东南' },
]

function getDailyLuckyDirection() {
  const today = new Date().toDateString()
  const stored = localStorage.getItem('daily_lucky_direction')
  if (stored) {
    const parsed = JSON.parse(stored)
    if (parsed.date === today) return parsed.direction
  }
  const index = new Date().getDate() % DIRECTIONS.length
  const direction = DIRECTIONS[index]
  localStorage.setItem('daily_lucky_direction', JSON.stringify({ date: today, direction }))
  return direction
}

export default function LuckyDirectionPage() {
  const [direction, setDirection] = useState<typeof DIRECTIONS[0] | null>(null)

  useEffect(() => {
    setDirection(getDailyLuckyDirection())
  }, [])

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
          <h1 className="text-gold-gradient text-xl font-bold">每日吉方</h1>
          <p className="text-moonly-text-muted text-xs">今日吉利方向指引</p>
        </div>
      </div>

      {direction && (
        <>
          <div className="moonly-card p-6 text-center mb-6">
            <div className="text-4xl mb-3">{direction.icon}</div>
            <div className={`text-3xl font-bold mb-2 ${direction.color}`}>{direction.name}方</div>
            <div className="text-moonly-gold text-sm font-medium">{direction.meaning}</div>
            <div className="text-moonly-text-secondary text-sm mt-3">
              💡 {direction.lucky}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-gold text-sm font-semibold">📋 今日宜忌</h3>
            {ACTIVITIES.map(item => (
              <div key={item.activity} className="moonly-card p-4">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium text-sm">{item.activity}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-xs">✓ {item.best}</span>
                    <span className="text-red-400 text-xs">✗ {item.avoid}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-moonly-text-muted text-xs mt-6">
            每日吉方，明日更新
          </div>
        </>
      )}
    </div>
  )
}
