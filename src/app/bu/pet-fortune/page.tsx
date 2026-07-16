'use client'

import { useState } from 'react'
import Link from 'next/link'

const PET_TYPES = [
  { type: '狗', icon: '🐕', traits: '忠诚、活泼、守护', fortunes: ['今日适合带狗狗出门散步', '狗狗可能会遇到新朋友', '注意狗狗的饮食习惯'] },
  { type: '猫', icon: '🐈', traits: '独立、优雅、神秘', fortunes: ['猫咪今日可能会发现新玩具', '适合给猫咪梳理毛发', '注意猫咪的情绪变化'] },
  { type: '兔', icon: '🐰', traits: '温顺、敏捷、可爱', fortunes: ['兔子今日食欲不错', '适合给兔子换新垫料', '注意兔子的居住环境'] },
  { type: '鸟', icon: '🐦', traits: '自由、聪慧、歌唱', fortunes: ['鸟儿今日歌声悦耳', '适合教鸟儿新技能', '注意鸟笼的清洁'] },
  { type: '鱼', icon: '🐟', traits: '宁静、灵活、吉祥', fortunes: ['鱼儿今日游动活跃', '适合给鱼缸换水', '注意水温和水质'] },
  { type: '龟', icon: '🐢', traits: '长寿、稳重、智慧', fortunes: ['乌龟今日状态良好', '适合给乌龟晒太阳', '注意乌龟的冬眠准备'] },
]

function getPetFortune(petType: string, birthDate: string) {
  const pet = PET_TYPES.find(p => p.type === petType)
  if (!pet) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const fortuneIndex = combined % pet.fortunes.length
  
  return {
    ...pet,
    fortune: pet.fortunes[fortuneIndex],
    luck: Math.floor(Math.random() * 40) + 60,
  }
}

export default function PetFortunePage() {
  const [petType, setPetType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!petType || !birthDate) return
    setResult(getPetFortune(petType, birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">宠物运势</h1>
          <p className="text-moonly-muted text-xs">看看你家毛孩子今日运势</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="moonly-card p-4 mb-6">
            <p className="text-moonly-secondary text-sm leading-relaxed">
              选择你家宠物的类型和生日，AI将为你分析宠物今日运势。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {PET_TYPES.map(pet => (
              <button
                key={pet.type}
                onClick={() => setPetType(pet.type)}
                className={`moonly-card p-4 text-center transition ${
                  petType === pet.type
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{pet.icon}</div>
                <div className="text-white text-sm font-medium">{pet.type}</div>
                <div className="text-moonly-muted text-xs mt-1">{pet.traits}</div>
              </button>
            ))}
          </div>

          <div className="moonly-card p-4 mb-6">
            <label className="text-white text-sm font-medium mb-2 block">宠物生日</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
            />
          </div>

          <button
            onClick={analyze}
            disabled={!petType || !birthDate}
            className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看宠物运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}今日运势</div>
            <div className="text-moonly-secondary text-sm">{result.traits}</div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">运势指数</div>
              <div className="w-full bg-white/5 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#c9a96e] to-yellow-400 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${result.luck}%` }}
                />
              </div>
              <div className="text-gold text-lg font-bold mt-1">{result.luck}分</div>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 今日建议</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.fortune}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setPetType(''); setBirthDate('') }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
