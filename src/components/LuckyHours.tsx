'use client'

import { useMemo, memo } from 'react'

const SHI_CHEN = [
  { name: '子时', time: '23:00-01:00', emoji: '🌙' },
  { name: '丑时', time: '01:00-03:00', emoji: '🌑' },
  { name: '寅时', time: '03:00-05:00', emoji: '🌅' },
  { name: '卯时', time: '05:00-07:00', emoji: '🌄' },
  { name: '辰时', time: '07:00-09:00', emoji: '🌞' },
  { name: '巳时', time: '09:00-11:00', emoji: '☀️' },
  { name: '午时', time: '11:00-13:00', emoji: '🌤️' },
  { name: '未时', time: '13:00-15:00', emoji: '⛅' },
  { name: '申时', time: '15:00-17:00', emoji: '🌤️' },
  { name: '酉时', time: '17:00-19:00', emoji: '🌇' },
  { name: '戌时', time: '19:00-21:00', emoji: '🌆' },
  { name: '亥时', time: '21:00-23:00', emoji: '🌃' },
]

const JI_SHI_LABELS = ['大吉', '吉', '平', '凶']
const JI_SHI_COLORS = {
  '大吉': 'text-green-400 bg-green-500/10 border-green-500/20',
  '吉': 'text-green-300 bg-green-500/10 border-green-500/20',
  '平': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  '凶': 'text-red-400 bg-red-500/10 border-red-500/20',
}

function getShiChenFortune(date: Date): { name: string; level: string }[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return SHI_CHEN.map((sc, i) => {
    const hash = (dayOfYear * 7 + i * 13) % 100
    let level: string
    if (hash < 15) level = '大吉'
    else if (hash < 40) level = '吉'
    else if (hash < 75) level = '平'
    else level = '凶'
    return { name: sc.name, level }
  })
}

function LuckyHours() {
  const fortunes = useMemo(() => getShiChenFortune(new Date()), [])
  const currentHour = new Date().getHours()
  const currentShiChenIndex = Math.floor((currentHour + 1) / 2) % 12

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">今日吉时</h3>
      <div className="grid grid-cols-3 gap-2">
        {SHI_CHEN.map((sc, i) => {
          const fortune = fortunes[i]
          const isCurrent = i === currentShiChenIndex
          return (
            <div
              key={sc.name}
              className={`p-2 rounded-xl border text-center ${
                isCurrent
                  ? 'border-gold/30 bg-gold/5'
                  : 'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-sm">{sc.emoji}</span>
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                )}
              </div>
              <div className="text-white text-xs font-medium">{sc.name}</div>
              <div className="text-[10px] text-moonly-muted">{sc.time}</div>
              <div className={`text-[10px] mt-1 px-1.5 py-0.5 rounded inline-block ${JI_SHI_COLORS[fortune.level as keyof typeof JI_SHI_COLORS]}`}>
                {fortune.level}
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-moonly-muted mt-2 text-center">
        💡 当前时辰标记为金色圆点
      </p>
    </div>
  )
}

export default memo(LuckyHours)
