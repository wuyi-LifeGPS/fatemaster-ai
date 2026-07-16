'use client'

import { useState } from 'react'
import Link from 'next/link'

const JOB_TYPES = [
  { type: '技术', icon: '💻', advice: ['准备技术面试', '展示项目经验', '学习新技术'] },
  { type: '销售', icon: '📞', advice: ['准备案例分析', '展示沟通能力', '了解产品知识'] },
  { type: '管理', icon: '👔', advice: ['准备领导力案例', '展示团队经验', '了解公司文化'] },
  { type: '创意', icon: '🎨', advice: ['准备作品集', '展示创意思维', '了解行业趋势'] },
  { type: '财务', icon: '📊', advice: ['准备专业知识', '展示分析能力', '了解行业法规'] },
  { type: '教育', icon: '📚', advice: ['准备教学案例', '展示沟通能力', '了解教育理念'] },
]

const INTERVIEW_TIPS = [
  '着装得体，给人良好第一印象',
  '提前了解公司背景和职位要求',
  '准备自我介绍，突出优势',
  '保持自信，眼神交流',
  '准备问题，展示兴趣',
  '感谢面试官，后续跟进',
]

function getJobFortune(jobType: string, birthDate: string) {
  const job = JOB_TYPES.find(j => j.type === jobType)
  if (!job) return null
  
  const date = new Date(birthDate)
  const today = new Date()
  const combined = date.getDate() + today.getDate()
  const luck = Math.floor(Math.random() * 25) + 75
  const tip = INTERVIEW_TIPS[combined % INTERVIEW_TIPS.length]
  
  return {
    ...job,
    luck,
    tip,
    color: luck >= 85 ? 'text-green-400' : luck >= 70 ? 'text-yellow-400' : 'text-red-400',
    level: luck >= 85 ? '大吉' : luck >= 70 ? '中吉' : '小吉',
  }
}

export default function JobFortunePage() {
  const [jobType, setJobType] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [result, setResult] = useState<any>(null)

  const analyze = () => {
    if (!jobType || !birthDate) return
    setResult(getJobFortune(jobType, birthDate))
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
          <h1 className="text-gold-gradient text-xl font-bold">求职运势</h1>
          <p className="text-moonly-muted text-xs">求职顺利，前程似锦</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {JOB_TYPES.map(job => (
              <button
                key={job.type}
                onClick={() => setJobType(job.type)}
                className={`moonly-card p-4 text-center transition ${
                  jobType === job.type
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-3xl mb-2">{job.icon}</div>
                <div className="text-white text-sm font-medium">{job.type}</div>
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
            disabled={!jobType || !birthDate}
            className="w-full py-3 btn-gold text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            查看求职运势
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-5xl mb-3">{result.icon}</div>
            <div className="text-gold text-2xl font-bold mb-2">{result.type}求职运势</div>
            <div className={`text-2xl font-bold mt-4 ${result.color}`}>{result.level}</div>
            <div className="mt-4">
              <div className="text-moonly-muted text-xs mb-1">求职指数</div>
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
            <h3 className="text-gold text-sm font-semibold mb-3">💡 面试建议</h3>
            <div className="space-y-2">
              {result.advice.map((tip: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-moonly-secondary text-sm">
                  <span className="text-gold">{i + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">🎯 今日重点</h3>
            <div className="text-moonly-secondary text-sm leading-relaxed">
              {result.tip}
            </div>
          </div>

          <button
            onClick={() => { setResult(null); setJobType(''); setBirthDate('') }}
            className="w-full py-3 btn-gold-outline text-sm font-semibold"
          >
            重新查看
          </button>
        </div>
      )}
    </div>
  )
}
