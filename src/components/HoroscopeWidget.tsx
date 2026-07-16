'use client'

import { useMemo, useState, memo } from 'react'

const ZODIAC_SIGNS = [
  { name: '白羊座', emoji: '♈', date: '3.21-4.19' },
  { name: '金牛座', emoji: '♉', date: '4.20-5.20' },
  { name: '双子座', emoji: '♊', date: '5.21-6.21' },
  { name: '巨蟹座', emoji: '♋', date: '6.22-7.22' },
  { name: '狮子座', emoji: '♌', date: '7.23-8.22' },
  { name: '处女座', emoji: '♍', date: '8.23-9.22' },
  { name: '天秤座', emoji: '♎', date: '9.23-10.23' },
  { name: '天蝎座', emoji: '♏', date: '10.24-11.22' },
  { name: '射手座', emoji: '♐', date: '11.23-12.21' },
  { name: '摩羯座', emoji: '♑', date: '12.22-1.19' },
  { name: '水瓶座', emoji: '♒', date: '1.20-2.18' },
  { name: '双鱼座', emoji: '♓', date: '2.19-3.20' },
]

const FORTUNE_LABELS = ['爱情', '事业', '财运', '健康']

function getZodiacFortune(signIndex: number, date: Date): { overall: string; scores: number[]; advice: string } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const hash = (dayOfYear * 17 + signIndex * 31) % 100

  const overall = hash < 20 ? '大吉' : hash < 45 ? '吉' : hash < 75 ? '平' : '凶'
  const scores = FORTUNE_LABELS.map((_, i) => {
    const s = ((hash + i * 25) % 50) + 50
    return Math.min(100, Math.max(30, s))
  })

  const advices = [
    '今日宜主动出击，把握机会',
    '保持低调，稳中求进',
    '注意细节，避免冲动决策',
    '多与人沟通，贵人相助',
    '适合规划未来，制定目标',
    '注意身体健康，劳逸结合',
  ]
  const advice = advices[(dayOfYear + signIndex) % advices.length]

  return { overall, scores, advice }
}

function HoroscopeWidget() {
  const [selectedSign, setSelectedSign] = useState<number | null>(null)
  const today = new Date()

  const selectedFortune = useMemo(() => {
    if (selectedSign === null) return null
    return getZodiacFortune(selectedSign, today)
  }, [selectedSign, today])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⭐</span>
        <h3 className="text-gold text-sm font-semibold">星座运势</h3>
      </div>
      <div className="grid grid-cols-6 gap-1.5 mb-3">
        {ZODIAC_SIGNS.map((sign, i) => {
          const fortune = getZodiacFortune(i, today)
          const isSelected = selectedSign === i
          return (
            <button
              key={sign.name}
              onClick={() => setSelectedSign(isSelected ? null : i)}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition ${
                isSelected ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-base">{sign.emoji}</span>
              <span className="text-[9px] text-white/50">{sign.name.slice(0, 2)}</span>
              <span className={`text-[8px] px-1 rounded ${
                fortune.overall === '大吉' ? 'bg-green-500/10 text-green-400' :
                fortune.overall === '吉' ? 'bg-green-500/10 text-green-300' :
                fortune.overall === '平' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-red-500/10 text-red-400'
              }`}>
                {fortune.overall}
              </span>
            </button>
          )
        })}
      </div>
      {selectedSign !== null && selectedFortune && (
        <div className="border-t border-white/5 pt-3 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{ZODIAC_SIGNS[selectedSign].emoji}</span>
              <span className="text-white text-sm font-medium">{ZODIAC_SIGNS[selectedSign].name}</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${
              selectedFortune.overall === '大吉' ? 'bg-green-500/10 text-green-400' :
              selectedFortune.overall === '吉' ? 'bg-green-500/10 text-green-300' :
              selectedFortune.overall === '平' ? 'bg-yellow-500/10 text-yellow-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {selectedFortune.overall}
            </span>
          </div>
          <div className="space-y-2 mb-2">
            {FORTUNE_LABELS.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs text-moonly-muted w-8">{label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold/50"
                    style={{ width: `${selectedFortune.scores[i]}%` }}
                  />
                </div>
                <span className="text-[10px] text-moonly-muted w-6 text-right">{selectedFortune.scores[i]}</span>
              </div>
            ))}
          </div>
          <p className="text-moonly-muted text-xs">💡 {selectedFortune.advice}</p>
        </div>
      )}
    </div>
  )
}

export default memo(HoroscopeWidget)
