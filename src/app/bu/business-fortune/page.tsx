'use client'

import { useState } from 'react'
import Link from 'next/link'

const BUSINESS_TYPES = [
  { type: '餐饮', icon: '🍽️', advice: ['注意食品安全', '选址要人流量大', '服务态度要好'] },
  { type: '零售', icon: '🛍️', advice: ['货品要丰富', '价格要合理', '位置要显眼'] },
  { type: '服务', icon: '💇', advice: ['技术要过硬', '口碑很重要', '环境要舒适'] },
  { type: '科技', icon: '💻', advice: ['产品要有创新', '团队要稳定', '资金要充足'] },
  { type: '教育', icon: '📚', advice: ['师资要优秀', '课程要实用', '宣传要到位'] },
  { type: '美容', icon: '💄', advice: ['技术要专业', '产品要安全', '环境要优雅'] },
]

const LUCKY_HOURS = [
  '辰时（7-9点）', '巳时（9-11点）', '午时（11-13点）',
  '未时（13-15点）', '申时（15-17点）', '酉时（17-19点）',
]

function getBusinessFortune(businessType: string, birthDate: string) {
  const business = BUSINESS_TYPES.find(b => b.type === businessType)
  if (!business) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 25) + 75
  const hour = LUCKY_HOURS[combined % LUCKY_HOURS.length]
  
  return {
    ...business,
    luck,
    hour,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
  }
}

export default function BusinessFortunePage() {
  const [businessType, setBusinessType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!businessType || !birthDate) return
    setResult(getBusinessFortune(businessType, birthDate))
  }

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">开业运势</h1>
          <p className="text-moonly-text-muted text-xs">开业大吉，财源广进</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {BUSINESS_TYPES.map(business => (
              <button
                key={business.type}
                onClick={() => setBusinessType(business.type)}
                className={`moonly-card p-4 text-center transition ${
                  businessType === business.type
                    ? 'border-moonly-gold/50 bg-moonly-gold/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{business.icon}</div>
                <div className="text-white text-sm font-medium">{business.type}</div>
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
            disabled={!businessType || !birthDate}
            className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看开业运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}开业运势</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-text-muted text-xs mb-1">财运指数</div>
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

          <div className="moonly-card p-4 text-center">
            <div className="text-moonly-text-muted text-xs mb-1">吉时</div>
            <div className="text-gold text-xl font-bold">{result.hour}</div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 开业建议</h3>
            <div className="space-y-2">
              {result.advice.map((tip: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-moonly-text-secondary text-sm">
                  <span className="text-gold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setBusinessType(''); setBirthDate('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
