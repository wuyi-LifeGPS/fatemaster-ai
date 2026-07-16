'use client'

import { useMemo } from 'react'

const ZODIAC_COMPAT: Record<string, { benefactor: string[]; conflict: string[] }> = {
  '鼠': { benefactor: ['牛', '龙', '猴'], conflict: ['马', '羊', '兔'] },
  '牛': { benefactor: ['鼠', '蛇', '鸡'], conflict: ['羊', '马', '狗'] },
  '虎': { benefactor: ['猪', '马', '狗'], conflict: ['猴', '蛇'] },
  '兔': { benefactor: ['狗', '猪', '羊'], conflict: ['鸡', '龙', '鼠'] },
  '龙': { benefactor: ['鸡', '鼠', '猴'], conflict: ['狗', '兔', '龙'] },
  '蛇': { benefactor: ['猴', '鸡', '牛'], conflict: ['猪', '虎'] },
  '马': { benefactor: ['羊', '虎', '狗'], conflict: ['鼠', '牛', '马'] },
  '羊': { benefactor: ['马', '猪', '兔'], conflict: ['牛', '狗', '鼠'] },
  '猴': { benefactor: ['蛇', '鼠', '龙'], conflict: ['虎', '猪'] },
  '鸡': { benefactor: ['龙', '蛇', '牛'], conflict: ['兔', '狗', '鸡'] },
  '狗': { benefactor: ['兔', '虎', '马'], conflict: ['龙', '牛', '羊'] },
  '猪': { benefactor: ['虎', '兔', '羊'], conflict: ['蛇', '猴', '猪'] },
}

const ZODIAC_EMOJI: Record<string, string> = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰', '龙': '🐲', '蛇': '🐍',
  '马': '🐴', '羊': '🐑', '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}

function getZodiac(year: number): string {
  return ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊'][year % 12]
}

function getDayZodiac(): string {
  const day = new Date().getDate()
  const zodiacs = Object.keys(ZODIAC_COMPAT)
  return zodiacs[day % zodiacs.length]
}

export default function DailyBenefactor() {
  const todayZodiac = useMemo(() => getDayZodiac(), [])
  const compat = ZODIAC_COMPAT[todayZodiac]

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🤝</span>
        <h3 className="text-gold text-sm font-semibold">今日贵人</h3>
      </div>

      <div className="text-center mb-3">
        <span className="text-2xl">{ZODIAC_EMOJI[todayZodiac]}</span>
        <p className="text-white/80 text-sm mt-1">今日主星：{todayZodiac}</p>
      </div>

      <div className="space-y-2">
        <div className="bg-green-500/10 rounded-lg p-2.5">
          <p className="text-[10px] text-green-400 mb-1">✨ 贵人属相</p>
          <div className="flex items-center gap-2">
            {compat.benefactor.map(z => (
              <span key={z} className="text-lg" title={z}>{ZODIAC_EMOJI[z]}</span>
            ))}
            <span className="text-xs text-white/60 ml-1">{compat.benefactor.join('、')}</span>
          </div>
        </div>

        <div className="bg-red-500/10 rounded-lg p-2.5">
          <p className="text-[10px] text-red-400 mb-1">⚠️ 需注意</p>
          <div className="flex items-center gap-2">
            {compat.conflict.map(z => (
              <span key={z} className="text-lg" title={z}>{ZODIAC_EMOJI[z]}</span>
            ))}
            <span className="text-xs text-white/60 ml-1">{compat.conflict.join('、')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
