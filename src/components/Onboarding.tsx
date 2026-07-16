'use client'

import { useState, useEffect } from 'react'
import { hapticLight } from '@/lib/haptic'

const STEPS = [
  {
    title: '欢迎使用 LifeGPS',
    desc: '融合现代AI与传统命理智慧，为你的人生提供方向指引',
    icon: '🧭',
  },
  {
    title: '添加八字档案',
    desc: '输入出生信息，获取完整的八字命盘分析、大运流年走势',
    icon: '📝',
  },
  {
    title: '探索命盘奥秘',
    desc: '查看五行能量、十神分布、喜用神、事业财运等深度分析',
    icon: '🔮',
  },
  {
    title: 'AI命理师在线',
    desc: '有任何疑问，随时向AI命理师提问，24小时为你解答',
    icon: '🤖',
  },
]

export default function Onboarding() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem('lifegps_onboarding_seen')
    if (!seen) {
      setShow(true)
    }
  }, [])

  const handleComplete = () => {
    localStorage.setItem('lifegps_onboarding_seen', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleComplete} />
      <div className="relative bg-[#1a1428] border border-white/10 rounded-3xl w-full max-w-sm p-6 animate-fade-in-scale">
        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-gold' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* 内容 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{STEPS[step].icon}</div>
          <h3 className="text-white text-lg font-bold mb-2">{STEPS[step].title}</h3>
          <p className="text-moonly-secondary text-sm leading-relaxed">{STEPS[step].desc}</p>
        </div>

        {/* 按钮 */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => {
                hapticLight()
                setStep(s => s - 1)
              }}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition"
            >
              上一步
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => {
                hapticLight()
                setStep(s => s + 1)
              }}
              className="flex-1 py-3 rounded-xl bg-gold text-[#1a1428] text-sm font-semibold hover:bg-gold/90 transition"
            >
              下一步
            </button>
          ) : (
            <button
              onClick={() => {
                hapticLight()
                handleComplete()
              }}
              className="flex-1 py-3 rounded-xl bg-gold text-[#1a1428] text-sm font-semibold hover:bg-gold/90 transition"
            >
              开始探索
            </button>
          )}
        </div>

        {/* 跳过 */}
        <button
          onClick={handleComplete}
          className="w-full mt-3 text-moonly-muted text-xs hover:text-white transition"
        >
          跳过引导
        </button>
      </div>
    </div>
  )
}
