'use client'

import { useState } from 'react'
import Link from 'next/link'

const ZODIAC_ANIMALS = [
  { name: '鼠', icon: '🐭', element: '水', yinYang: '阳', bestMatch: ['龙', '猴', '牛'], badMatch: ['马', '羊'] },
  { name: '牛', icon: '🐮', element: '土', yinYang: '阴', bestMatch: ['鼠', '蛇', '鸡'], badMatch: ['羊', '马'] },
  { name: '虎', icon: '🐯', element: '木', yinYang: '阳', bestMatch: ['马', '狗', '猪'], badMatch: ['猴', '蛇'] },
  { name: '兔', icon: '🐰', element: '木', yinYang: '阴', bestMatch: ['羊', '狗', '猪'], badMatch: ['鸡', '龙'] },
  { name: '龙', icon: '🐲', element: '土', yinYang: '阳', bestMatch: ['鼠', '猴', '鸡'], badMatch: ['狗', '兔'] },
  { name: '蛇', icon: '🐍', element: '火', yinYang: '阴', bestMatch: ['牛', '鸡', '猴'], badMatch: ['猪', '虎'] },
  { name: '马', icon: '🐴', element: '火', yinYang: '阳', bestMatch: ['虎', '羊', '狗'], badMatch: ['鼠', '牛'] },
  { name: '羊', icon: '🐑', element: '土', yinYang: '阴', bestMatch: ['兔', '马', '猪'], badMatch: ['牛', '狗'] },
  { name: '猴', icon: '🐵', element: '金', yinYang: '阳', bestMatch: ['鼠', '龙', '蛇'], badMatch: ['虎', '猪'] },
  { name: '鸡', icon: '🐔', element: '金', yinYang: '阴', bestMatch: ['牛', '龙', '蛇'], badMatch: ['兔', '狗'] },
  { name: '狗', icon: '🐶', element: '土', yinYang: '阳', bestMatch: ['虎', '兔', '马'], badMatch: ['龙', '羊', '鸡'] },
  { name: '猪', icon: '🐷', element: '水', yinYang: '阴', bestMatch: ['虎', '兔', '羊'], badMatch: ['蛇', '猴'] },
]

function getCompatibility(animal1: string, animal2: string) {
  const a1 = ZODIAC_ANIMALS.find(a => a.name === animal1)
  const a2 = ZODIAC_ANIMALS.find(a => a.name === animal2)
  if (!a1 || !a2) return null

  if (a1.bestMatch.includes(a2.name)) {
    return { level: '天作之合', score: 95, desc: `${a1.icon}${a1.name}与${a2.icon}${a2.name}是最佳配对，性格互补，相处融洽。`, color: 'text-gold' }
  }
  if (a1.badMatch.includes(a2.name)) {
    return { level: '需谨慎', score: 45, desc: `${a1.icon}${a1.name}与${a2.icon}${a2.name}性格差异较大，需要更多包容和理解。`, color: 'text-orange-400' }
  }
  if (a1.element === a2.element) {
    return { level: '相生', score: 75, desc: `${a1.icon}${a1.name}与${a2.icon}${a2.name}五行相同，有共同语言，相处和谐。`, color: 'text-yellow-400' }
  }
  return { level: '相合', score: 65, desc: `${a1.icon}${a1.name}与${a2.icon}${a2.name}性格互补，需要磨合，但有发展空间。`, color: 'text-blue-400' }
}

export default function ZodiacMatchPage() {
  const [animal1, setAnimal1] = useState('')
  const [animal2, setAnimal2] = useState('')
  const [result, setResult] = useState<ReturnType<typeof getCompatibility>>(null)

  const analyze = () => {
    if (!animal1 || !animal2) return
    setResult(getCompatibility(animal1, animal2))
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
          <h1 className="text-gold-gradient text-xl font-bold">生肖配对</h1>
          <p className="text-moonly-text-muted text-xs">十二生肖，缘分天定</p>
        </div>
      </div>

      {/* Input */}
      <div className="moonly-card p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-white text-sm font-medium mb-2 block">你的生肖</label>
            <select
              value={animal1}
              onChange={e => setAnimal1(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
            >
              <option value="" className="bg-[#1a1428]">选择生肖</option>
              {ZODIAC_ANIMALS.map(animal => (
                <option key={animal.name} value={animal.name} className="bg-[#1a1428]">
                  {animal.icon} {animal.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white text-sm font-medium mb-2 block">对方生肖</label>
            <select
              value={animal2}
              onChange={e => setAnimal2(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
            >
              <option value="" className="bg-[#1a1428]">选择生肖</option>
              {ZODIAC_ANIMALS.map(animal => (
                <option key={animal.name} value={animal.name} className="bg-[#1a1428]">
                  {animal.icon} {animal.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={analyze}
          disabled={!animal1 || !animal2}
          className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
        >
          开始配对
        </button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">
              {ZODIAC_ANIMALS.find(a => a.name === animal1)?.icon}
              💕
              {ZODIAC_ANIMALS.find(a => a.name === animal2)?.icon}
            </div>
            <div className={`text-2xl font-bold mb-2 ${result.color}`}>
              {result.level}
            </div>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              {result.desc}
            </div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">匹配指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#c9a96e] to-yellow-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="text-gold text-lg font-bold mt-1">{result.score}分</div>
            </div>
          </div>

          {/* 生肖详情 */}
          <div className="grid grid-cols-2 gap-3">
            {[animal1, animal2].map((animal, i) => {
              const info = ZODIAC_ANIMALS.find(a => a.name === animal)
              if (!info) return null
              return (
                <div key={i} className="moonly-card p-4">
                  <div className="text-2xl mb-2">{info.icon}</div>
                  <div className="text-white font-medium text-sm">{info.name}</div>
                  <div className="text-moonly-text-muted text-xs mt-1">
                    五行：{info.element} · {info.yinYang}
                  </div>
                  <div className="text-green-400 text-xs mt-2">
                    ✓ 最佳配对：{info.bestMatch.join('、')}
                  </div>
                  <div className="text-orange-400 text-xs mt-1">
                    ⚠ 需谨慎：{info.badMatch.join('、')}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { setAnimal1(''); setAnimal2(''); setResult(null) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新配对
          </button>
        </div>
      )}
    </div>
  )
}
