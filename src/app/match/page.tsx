'use client'

import { useState } from 'react'
import Link from 'next/link'
import { analyzeMarriage, analyzeBazi } from '@/lib/analysis'

interface MatchResult {
  score: number
  level: string
  levelColor: string
  levelDesc: string
  ganHeMatch: boolean
  zhiHeMatch: boolean
  sanHeMatch: boolean
  chongMatch: boolean
  haiMatch: boolean
  mToF_SS: string
  fToM_SS: string
  pairMatch: { m: string; f: string; desc: string } | undefined
  complementScore: number
  complementDetails: string[]
  mHelpF: number
  fHelpM: number
  roles: { mRole: string; fRole: string }
  suggestions: string[]
}

export default function MatchPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [maleBazi, setMaleBazi] = useState<any>(null)
  const [femaleBazi, setFemaleBazi] = useState<any>(null)

  const [maleForm, setMaleForm] = useState({
    name: '',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
  })

  const [femaleForm, setFemaleForm] = useState({
    name: '',
    birthYear: 1992,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
  })

  const yearOptions = Array.from({ length: 131 }, (_, i) => 1900 + i)
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
  const hourOptions = Array.from({ length: 24 }, (_, i) => i)
  const pad = (n: number) => String(n).padStart(2, '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const mDate = `${maleForm.birthYear}-${pad(maleForm.birthMonth)}-${pad(maleForm.birthDay)}`
      const mTime = `${pad(maleForm.birthHour)}:00`
      const fDate = `${femaleForm.birthYear}-${pad(femaleForm.birthMonth)}-${pad(femaleForm.birthDay)}`
      const fTime = `${pad(femaleForm.birthHour)}:00`

      const mBazi = analyzeBazi(mDate, mTime, maleForm.name, 'male')
      const fBazi = analyzeBazi(fDate, fTime, femaleForm.name, 'female')

      const combinedM = analyzeMarriage(mBazi, fBazi, maleForm.name, femaleForm.name)
      
      // 注意：analyzeMarriage 内部会调用 calculateCombinedGod，但当前 bazi 对象没有 combinedGod
      // 需要在 analyzeMarriage 内部处理，或者先给 bazi 加上 combinedGod
      // 但是 analyzeMarriage 的当前实现是从 bazi.combinedGod 读的
      // 需要修正 analyzeMarriage 的逻辑，或者确保传入的 bazi 有 combinedGod

      setMaleBazi(mBazi)
      setFemaleBazi(fBazi)
      setResult(combinedM)
    } catch (error) {
      console.error('Error:', error)
      alert('分析出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const renderHeChong = (label: string, match: boolean, type: 'he' | 'chong' | 'hai') => {
    const colors = {
      he: match ? 'bg-red-50 border-red-200 text-red-700' : 'bg-ink-50 border-ink-200 text-ink-400',
      chong: match ? 'bg-red-50 border-red-200 text-red-700' : 'bg-ink-50 border-ink-200 text-ink-400',
      hai: match ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-ink-50 border-ink-200 text-ink-400',
    }
    const icons = {
      he: match ? '💕' : '○',
      chong: match ? '⚡' : '○',
      hai: match ? '💔' : '○',
    }
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${colors[type]}`}>
        <span>{icons[type]}</span>
        <span>{label}{match ? ' ✓' : ' ✗'}</span>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-fate-50">
      {/* Header */}
      <header className="bg-ink-900 text-fate-50 py-4 px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif">
            ← AI 命理大师
          </Link>
          <h1 className="text-lg font-serif">合婚分析</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 说明 */}
        {!result && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 mb-6 border border-pink-100">
            <h2 className="text-xl font-bold mb-2 font-serif">八字合婚</h2>
            <p className="text-ink-600 text-sm">
              通过双方八字的日主关系、五行互补、十神互动、喜用神互济等维度，综合评估婚配契合度。
              输入双方生日即可开始分析。
            </p>
          </div>
        )}

        {/* 输入表单 */}
        {!result && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* 男方 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">男</div>
                  <h3 className="font-bold text-lg">男方信息</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">姓名（选填）</label>
                    <input
                      type="text"
                      value={maleForm.name}
                      onChange={(e) => setMaleForm({ ...maleForm, name: e.target.value })}
                      placeholder="姓名"
                      className="w-full px-3 py-2 border border-fate-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生日期 *</label>
                    <div className="flex gap-2">
                      <select value={maleForm.birthYear} onChange={(e) => setMaleForm({ ...maleForm, birthYear: Number(e.target.value) })} className="flex-1 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                      <select value={maleForm.birthMonth} onChange={(e) => setMaleForm({ ...maleForm, birthMonth: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <select value={maleForm.birthDay} onChange={(e) => setMaleForm({ ...maleForm, birthDay: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生时辰</label>
                    <select value={maleForm.birthHour} onChange={(e) => setMaleForm({ ...maleForm, birthHour: Number(e.target.value) })} className="w-full px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                      {hourOptions.map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* 女方 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">女</div>
                  <h3 className="font-bold text-lg">女方信息</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">姓名（选填）</label>
                    <input
                      type="text"
                      value={femaleForm.name}
                      onChange={(e) => setFemaleForm({ ...femaleForm, name: e.target.value })}
                      placeholder="姓名"
                      className="w-full px-3 py-2 border border-fate-200 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生日期 *</label>
                    <div className="flex gap-2">
                      <select value={femaleForm.birthYear} onChange={(e) => setFemaleForm({ ...femaleForm, birthYear: Number(e.target.value) })} className="flex-1 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
                      </select>
                      <select value={femaleForm.birthMonth} onChange={(e) => setFemaleForm({ ...femaleForm, birthMonth: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {monthOptions.map(m => <option key={m} value={m}>{m}月</option>)}
                      </select>
                      <select value={femaleForm.birthDay} onChange={(e) => setFemaleForm({ ...femaleForm, birthDay: Number(e.target.value) })} className="w-16 px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                        {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-ink-500 mb-1">出生时辰</label>
                    <select value={femaleForm.birthHour} onChange={(e) => setFemaleForm({ ...femaleForm, birthHour: Number(e.target.value) })} className="w-full px-2 py-2 border border-fate-200 rounded-md bg-white text-sm">
                      {hourOptions.map(h => <option key={h} value={h}>{pad(h)}:00</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-pink-500/30"
            >
              {loading ? '分析中...' : '💑 开始合婚分析'}
            </button>
          </form>
        )}

        {/* 结果展示 */}
        {result && (
          <div className="space-y-6">
            {/* 重新输入 */}
            <button
              onClick={() => setResult(null)}
              className="text-fate-600 text-sm hover:underline"
            >
              ← 重新输入
            </button>

            {/* 综合评分 */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100 text-center">
              <div className="text-sm text-ink-500 mb-2">婚配契合度</div>
              <div className={`text-6xl font-bold mb-2 ${result.levelColor}`}>{result.score}</div>
              <div className="flex justify-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-2xl ${i < Math.round(result.score / 20) ? 'text-pink-400' : 'text-ink-200'}`}>♥</span>
                ))}
              </div>
              <div className={`text-xl font-bold ${result.levelColor}`}>{result.level}</div>
              <p className="text-ink-600 mt-2 max-w-md mx-auto">{result.levelDesc}</p>
            </div>

            {/* 双方八字 */}
            <div className="grid md:grid-cols-2 gap-4">
              {maleBazi && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">男</div>
                    <span className="font-bold">{maleForm.name || '男方'}八字</span>
                  </div>
                  <div className="text-sm text-ink-700 space-y-1">
                    {maleBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-ink-500">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-blue-200 mt-2">
                      <span className="text-ink-500">日主：</span>
                      <span className="font-bold">{maleBazi.dayMaster}（{maleBazi.yinYang}·{maleBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
              {femaleBazi && (
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">女</div>
                    <span className="font-bold">{femaleForm.name || '女方'}八字</span>
                  </div>
                  <div className="text-sm text-ink-700 space-y-1">
                    {femaleBazi.pillars.map((p: any) => (
                      <div key={p.name} className="flex justify-between">
                        <span className="text-ink-500">{p.name}</span>
                        <span className="font-medium">{p.gan}{p.zhi}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-pink-200 mt-2">
                      <span className="text-ink-500">日主：</span>
                      <span className="font-bold">{femaleBazi.dayMaster}（{femaleBazi.yinYang}·{femaleBazi.wuXing}）</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 合冲关系 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">合冲关系</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {renderHeChong('天干五合', result.ganHeMatch, 'he')}
                {renderHeChong('地支六合', result.zhiHeMatch, 'he')}
                {renderHeChong('地支三合', result.sanHeMatch, 'he')}
                {renderHeChong('地支六冲', result.chongMatch, 'chong')}
                {renderHeChong('地支六害', result.haiMatch, 'hai')}
              </div>
              <div className="text-sm text-ink-600 bg-fate-50 rounded-lg p-3">
                {result.ganHeMatch && <p>💕 日主天干相合，彼此有天然的吸引力，容易产生好感。</p>}
                {result.zhiHeMatch && <p>💕 日支六合，生活习惯、价值观容易契合，相处融洽。</p>}
                {result.sanHeMatch && <p>💕 地支三合，缘分深厚，合作默契度高。</p>}
                {result.chongMatch && <p>⚡ 日支相冲，性格差异大，容易有冲突，需要更多磨合。</p>}
                {result.haiMatch && <p>💔 日支相害，关系中暗藏隐患，注意沟通方式。</p>}
                {!result.ganHeMatch && !result.zhiHeMatch && !result.sanHeMatch && !result.chongMatch && !result.haiMatch && (
                  <p>双方八字无明显合冲关系，属于中性组合，缘分需要后天培养。</p>
                )}
              </div>
            </div>

            {/* 十神互动 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">十神互动</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium mb-2">男方 → 女方</div>
                  <div className="text-lg font-bold text-ink-800">{result.mToF_SS}</div>
                  <p className="text-sm text-ink-600 mt-2">{result.roles.mRole}</p>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <div className="text-sm text-pink-600 font-medium mb-2">女方 → 男方</div>
                  <div className="text-lg font-bold text-ink-800">{result.fToM_SS}</div>
                  <p className="text-sm text-ink-600 mt-2">{result.roles.fRole}</p>
                </div>
              </div>
              {result.pairMatch && (
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✨</span>
                    <span className="font-bold text-amber-700">理想婚配组合：{result.pairMatch.desc}</span>
                  </div>
                </div>
              )}
            </div>

            {/* 五行互补 */}
            {result.complementDetails.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4 font-serif">五行互补</h3>
                <div className="space-y-2">
                  {result.complementDetails.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      <span className="text-ink-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 喜用神互济 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-4 font-serif">喜用神互济</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`rounded-lg p-4 ${result.mHelpF > 0 ? 'bg-green-50 border border-green-100' : 'bg-ink-50'}`}>
                  <div className="text-sm text-ink-500 mb-1">男方旺女方</div>
                  <div className="text-lg font-bold text-ink-800">{result.mHelpF > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.mHelpF > 0 && <p className="text-sm text-green-700 mt-1">男方喜用神五行与女方日主一致，对女方有助益。</p>}
                </div>
                <div className={`rounded-lg p-4 ${result.fHelpM > 0 ? 'bg-green-50 border border-green-100' : 'bg-ink-50'}`}>
                  <div className="text-sm text-ink-500 mb-1">女方旺男方</div>
                  <div className="text-lg font-bold text-ink-800">{result.fHelpM > 0 ? '✓ 旺对方' : '○ 中性'}</div>
                  {result.fHelpM > 0 && <p className="text-sm text-green-700 mt-1">女方喜用神五行与男方日主一致，对男方有助益。</p>}
                </div>
              </div>
            </div>

            {/* 建议 */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
              <h3 className="font-bold text-lg mb-4 font-serif">💡 婚配建议</h3>
              <div className="space-y-3">
                {result.suggestions.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-ink-700">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
