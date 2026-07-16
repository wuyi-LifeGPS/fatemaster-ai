'use client'

import { useState } from 'react'
import Link from 'next/link'

const INVEST_TYPES = [
  { type: '股票', icon: '📈', advice: ['关注大盘走势', '分散投资风险', '设置止损点'] },
  { type: '基金', icon: '💰', advice: ['定投策略', '长期持有', '关注基金经理'] },
  { type: '房产', icon: '🏠', advice: ['地段为王', '关注政策', '量力而行'] },
  { type: '黄金', icon: '🥇', advice: ['避险保值', '关注国际形势', '适量配置'] },
  { type: '数字货币', icon: '₿', advice: ['高风险高收益', '了解项目', '不要All in'] },
  { type: '定期理财', icon: '🏦', advice: ['稳健收益', '注意期限', '比较利率'] },
]

function getInvestFortune(investType: string, birthDate: string) {
  const invest = INVEST_TYPES.find(i => i.type === investType)
  if (!invest) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 30) + 70
  
  return {
    ...invest,
    luck,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
    trend: luck >= 80 ? '上涨' : luck >= 70 ? '平稳' : '波动',
  }
}

export default function InvestFortunePage() {
  const [investType, setInvestType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!investType || !birthDate) return
    setResult(getInvestFortune(investType, birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">投资运势</h1>
          <p className="text-moonly-text-muted text-xs">财运亨通，投资有道</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {INVEST_TYPES.map(invest => (
              <button
                key={invest.type}
                onClick={() => setInvestType(invest.type)}
                className={`moonly-card p-4 text-center transition ${
                  investType === invest.type
                    ? 'border-moonly-gold/50 bg-moonly-gold/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{invest.icon}</div>
                <div className="text-white text-sm font-medium">{invest.type}</div>
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
            disabled={!investType || !birthDate}
            className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看投资运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}运势</div>
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

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">💡 投资建议</h3>
            <div className="space-y-2">
              {result.advice.map((tip: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-moonly-text-secondary text-sm">
                  <span className="text-gold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">📊 市场趋势</h3>
            <div className="text-moonly-text-secondary text-sm leading-relaxed">
              今日{result.type}市场趋势：{result.trend}。
              {result.luck >= 80 ? '适合加仓或买入。' : result.luck >= 70 ? '建议观望，谨慎操作。' : '建议减仓或观望。'}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setInvestType(''); setBirthDate('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
