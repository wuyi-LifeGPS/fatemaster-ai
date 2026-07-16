'use client'

import { useState } from 'react'
import Link from 'next/link'

const PLANTS = [
  { type: '多肉植物', icon: '🌵', traits: '耐旱、可爱、易养', fortunes: ['今日适合给多肉晒太阳', '注意浇水频率，避免积水', '多肉可能会长出侧芽'] },
  { type: '绿萝', icon: '🌿', traits: '净化空气、生命力强', fortunes: ['绿萝今日生长旺盛', '适合给绿萝换盆', '注意叶面清洁'] },
  { type: '吊兰', icon: '🌱', traits: '垂吊、优雅、净化', fortunes: ['吊兰今日状态良好', '适合分株繁殖', '注意避免强光直射'] },
  { type: '富贵竹', icon: '🎋', traits: '吉祥、富贵、节节高', fortunes: ['富贵竹今日运势佳', '适合修剪黄叶', '注意水质清洁'] },
  { type: '发财树', icon: '🌳', traits: '招财、稳重、大气', fortunes: ['发财树今日生机勃勃', '适合施肥', '注意控制浇水量'] },
  { type: '仙人掌', icon: '🌵', traits: '坚强、独立、耐旱', fortunes: ['仙人掌今日无需浇水', '适合擦拭灰尘', '注意避免冻伤'] },
]

function getPlantFortune(plantType: string) {
  const plant = PLANTS.find(p => p.type === plantType)
  if (!plant) return null
  
  const today = new Date()
  const fortuneIndex = today.getDate() % plant.fortunes.length
  
  return {
    ...plant,
    fortune: plant.fortunes[fortuneIndex],
    luck: Math.floor(Math.random() * 30) + 70,
  }
}

export default function PlantFortunePage() {
  const [plantType, setPlantType] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!plantType) return
    setResult(getPlantFortune(plantType))
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
          <h1 className="text-gold-gradient text-xl font-bold">植物运势</h1>
          <p className="text-moonly-text-muted text-xs">看看你家绿植今日状态</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="moonly-card p-4 mb-6">
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              选择你家植物的类型，AI将为你分析植物今日运势和养护建议。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {PLANTS.map(plant => (
              <button
                key={plant.type}
                onClick={() => setPlantType(plant.type)}
                className={`moonly-card p-4 text-center transition ${
                  plantType === plant.type
                    ? 'border-moonly-gold/50 bg-moonly-gold/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{plant.icon}</div>
                <div className="text-white text-sm font-medium">{plant.type}</div>
                <div className="text-moonly-text-muted text-xs mt-1">{plant.traits}</div>
              </button>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={!plantType}
            className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看植物运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}今日运势</div>
            <div className="text-moonly-text-secondary text-sm">{result.traits}</div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">生长指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className="text-green-400 text-lg font-bold mt-1">{result.luck}分</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 今日建议</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              {result.fortune}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setPlantType('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
