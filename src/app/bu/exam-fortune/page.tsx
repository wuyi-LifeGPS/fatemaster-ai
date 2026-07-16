'use client'

import { useState } from 'react'
import Link from 'next/link'

const EXAM_TYPES = [
  { type: '笔试', icon: '📝', tips: ['仔细审题', '先易后难', '检查答案'] },
  { type: '面试', icon: '🎯', tips: ['自信大方', '条理清晰', '真诚回答'] },
  { type: '驾照考试', icon: '🚗', tips: ['熟悉路线', '保持冷静', '注意细节'] },
  { type: '资格考试', icon: '📚', tips: ['复习重点', '模拟练习', '调整心态'] },
  { type: '升学考试', icon: '🎓', tips: ['保证睡眠', '合理饮食', '积极心态'] },
  { type: '英语考试', icon: '🌍', tips: ['听力练习', '词汇复习', '阅读训练'] },
]

function getExamFortune(examType: string, birthDate: string) {
  const exam = EXAM_TYPES.find(e => e.type === examType)
  if (!exam) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 30) + 70
  
  return {
    ...exam,
    luck,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
  }
}

export default function ExamFortunePage() {
  const [examType, setExamType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!examType || !birthDate) return
    setResult(getExamFortune(examType, birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">考试运势</h1>
          <p className="text-moonly-muted text-xs">逢考必过，金榜题名</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {EXAM_TYPES.map(exam => (
              <button
                key={exam.type}
                onClick={() => setExamType(exam.type)}
                className={`moonly-card p-4 text-center transition ${
                  examType === exam.type
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{exam.icon}</div>
                <div className="text-white text-sm font-medium">{exam.type}</div>
              </button>
            ))}
          </div>

          <div className="moonly-card p-4 mb-6">
            <label className="text-white text-sm font-medium mb-2 block">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-[#c9a96e]/30"
            />
          </div>

          <button
            onClick={analyze}
            disabled={!examType || !birthDate}
            className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看考试运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}运势</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">考试指数</div>
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
            <h3 className="text-gold text-sm font-semibold mb-3">💡 考试建议</h3>
            <div className="space-y-2">
              {result.tips.map((tip: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-moonly-secondary text-sm">
                  <span className="text-gold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setExamType(''); setBirthDate('') }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
