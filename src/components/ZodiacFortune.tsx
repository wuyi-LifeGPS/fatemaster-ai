'use client'

import { useMemo, useState, memo } from 'react'

const ZODIAC_ANIMALS = [
  { name: '鼠', emoji: '🐭', desc: '机智灵活，善于应变' },
  { name: '牛', emoji: '🐮', desc: '踏实稳重，勤劳肯干' },
  { name: '虎', emoji: '🐯', desc: '勇猛果敢，有领导力' },
  { name: '兔', emoji: '🐰', desc: '温和善良，心思细腻' },
  { name: '龙', emoji: '🐲', desc: '气势非凡，志向远大' },
  { name: '蛇', emoji: '🐍', desc: '智慧深沉，善于谋略' },
  { name: '马', emoji: '🐴', desc: '热情奔放，追求自由' },
  { name: '羊', emoji: '🐑', desc: '温柔体贴，富有同情心' },
  { name: '猴', emoji: '🐵', desc: '聪明伶俐，善于交际' },
  { name: '鸡', emoji: '🐔', desc: '勤奋守时，注重细节' },
  { name: '狗', emoji: '🐶', desc: '忠诚可靠，重情重义' },
  { name: '猪', emoji: '🐷', desc: '诚实厚道，乐观豁达' },
]

const FORTUNE_LEVELS = ['大吉', '吉', '平', '凶', '大凶']
const FORTUNE_COLORS = {
  '大吉': 'text-green-400 bg-green-500/10',
  '吉': 'text-green-300 bg-green-500/10',
  '平': 'text-yellow-400 bg-yellow-500/10',
  '凶': 'text-orange-400 bg-orange-500/10',
  '大凶': 'text-red-400 bg-red-500/10',
}

function getDailyFortune(animal: string, date: Date): { level: string; advice: string } {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  const animalIndex = ZODIAC_ANIMALS.findIndex(a => a.name === animal)
  const hash = (dayOfYear * 13 + animalIndex * 7) % 100

  let level: string
  let advice: string

  if (hash < 15) {
    level = '大吉'
    advice = '今日运势极佳，宜大胆行事'
  } else if (hash < 40) {
    level = '吉'
    advice = '运势良好，把握机会'
  } else if (hash < 70) {
    level = '平'
    advice = '运势平稳，保持平常心'
  } else if (hash < 90) {
    level = '凶'
    advice = '运势欠佳，谨慎行事'
  } else {
    level = '大凶'
    advice = '运势低迷，宜静不宜动'
  }

  return { level, advice }
}

function ZodiacFortune() {
  const [selectedZodiac, setSelectedZodiac] = useState<string | null>(null)
  const today = new Date()

  const selectedFortune = useMemo(() => {
    if (!selectedZodiac) return null
    return getDailyFortune(selectedZodiac, today)
  }, [selectedZodiac, today])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <h3 className="text-gold text-sm font-semibold mb-3">今日生肖运势</h3>
      <div className="grid grid-cols-6 gap-2 mb-3">
        {ZODIAC_ANIMALS.map((animal) => {
          const fortune = getDailyFortune(animal.name, today)
          const isSelected = selectedZodiac === animal.name
          return (
            <button
              key={animal.name}
              onClick={() => setSelectedZodiac(isSelected ? null : animal.name)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition ${
                isSelected ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{animal.emoji}</span>
              <span className="text-[10px] text-white/60">{animal.name}</span>
              <span className={`text-[8px] px-1 py-0.5 rounded ${FORTUNE_COLORS[fortune.level as keyof typeof FORTUNE_COLORS]}`}>
                {fortune.level}
              </span>
            </button>
          )
        })}
      </div>
      {selectedZodiac && selectedFortune && (
        <div className="border-t border-white/5 pt-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {ZODIAC_ANIMALS.find(a => a.name === selectedZodiac)?.emoji}
            </span>
            <span className="text-white text-sm font-medium">{selectedZodiac} · {selectedFortune.level}</span>
          </div>
          <p className="text-moonly-muted text-xs">{selectedFortune.advice}</p>
        </div>
      )}
    </div>
  )
}

export default memo(ZodiacFortune)
