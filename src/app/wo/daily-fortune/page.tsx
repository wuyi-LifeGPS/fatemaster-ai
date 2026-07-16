'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getProfiles, type BaziProfile } from '@/lib/bazi-profiles'
import { getTodayGanZhi, getShiShen, getWuXing, calculateBazi } from '@/lib/bazi'
import { lunarToSolar } from '@/lib/lunar'


const FORTUNE_POEMS: Record<string, string[]> = {
  '正印': [
    '贵人相助，今日宜学习新知。',
    '长辈关怀，适合请教建议。',
    '文思泉涌，利于文书写作。',
    '思维清晰，适合制定计划。',
  ],
  '偏印': [
    '灵感闪现，注意记录想法。',
    '直觉敏锐，可凭感觉行事。',
    '思维独特，适合创意工作。',
    '内心感悟，宜静思冥想。',
  ],
  '正官': [
    '贵人提携，今日易得认可。',
    '规则清晰，适合处理正式事务。',
    '形象提升，注意言行举止。',
    '秩序井然，利于管理工作。',
  ],
  '七杀': [
    '挑战在前，勇敢面对即可。',
    '压力也是动力，今日宜突破自我。',
    '竞争激烈，保持冷静为上。',
    '变动之中，暗藏机遇。',
  ],
  '正财': [
    '财运平稳，适合稳健理财。',
    '收获在望，付出的努力将有回报。',
    '宜处理财务事务，账目清晰。',
    '珍惜现有，今日不宜冒险。',
  ],
  '偏财': [
    '意外之喜，可能有额外收获。',
    '投资运佳，可关注新机会。',
    '社交生财，宜多与人交流。',
    '财源广进，但需理性判断。',
  ],
  '比肩': [
    '朋友相助，今日合作运佳。',
    '团队精神强，宜协同工作。',
    '同辈支持，可共商大计。',
    '独立自强，也能依靠自己。',
  ],
  '劫财': [
    '竞争激烈，注意资源分配。',
    '今日宜守不宜攻，防止损耗。',
    '合作需谨慎，明确利益分配。',
    '避免冲动消费，理性支出。',
  ],
  '食神': [
    '心情愉悦，适合享受美食。',
    '表达能力佳，利于演讲展示。',
    '创造力强，适合艺术创作。',
    '享受生活，今日放松为上。',
  ],
  '伤官': [
    '才华横溢，但需注意言辞。',
    '创新思维活跃，宜提出新方案。',
    '今日直言不讳，但需顾及他人。',
    '适合突破常规，走不同路线。',
  ],
}

const WUXING_ADVICE: Record<string, string[]> = {
  '木': ['宜接触自然', '东方有利', '绿色为吉色'],
  '火': ['宜社交活动', '南方有利', '红色为吉色'],
  '土': ['宜处理事务', '中部有利', '黄色为吉色'],
  '金': ['宜决断决策', '西方有利', '白色为吉色'],
  '水': ['宜学习思考', '北方有利', '黑色为吉色'],
}

const STAR_RATINGS = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐']

function getDayRating(shiShen: string): string {
  const ratings: Record<string, number> = {
    '正印': 4, '偏印': 3, '正官': 5, '七杀': 3,
    '正财': 4, '偏财': 4, '比肩': 4, '劫财': 2,
    '食神': 5, '伤官': 3,
  }
  return STAR_RATINGS[(ratings[shiShen] || 3) - 1]
}

export default function DailyFortunePage() {
  const [profile, setProfile] = useState<any>(null)
  const [dayMaster, setDayMaster] = useState('')
  const [shiShen, setShiShen] = useState('')
  const [today, setToday] = useState<any>(null)
  const [poem, setPoem] = useState('')
  const [advice, setAdvice] = useState('')
  const [rating, setRating] = useState('')

  useEffect(() => {
    const profiles = getProfiles()
    if (profiles.length === 0) return
    
    const p = profiles[0]
    setProfile(p)
    
    const todayData = getTodayGanZhi()
    setToday(todayData)
    
    // 计算八字获取日主
    let year = p.year, month = p.month, day = p.day
    if (p.isLunar) {
      const solar = lunarToSolar(p.year, p.month, p.day, false)
      if (solar) { year = solar.year; month = solar.month; day = solar.day }
    }
    const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const birthTime = `${String(p.hour).padStart(2, '0')}:00`
    let dm = todayData.day.gan
    try {
      const baziData = calculateBazi(birthDate, birthTime)
      dm = baziData.dayMaster
    } catch (e) { /* fallback */ }
    setDayMaster(dm)
    
    // 计算日柱对日主的十神（即今日天干与日主的关系）
    const todayGan = todayData.day.gan
    const ss = getShiShen(dm, todayGan)
    setShiShen(ss)
    
    // 随机选择签文和建议
    const poems = FORTUNE_POEMS[ss] || FORTUNE_POEMS['比肩']
    setPoem(poems[Math.floor(Math.random() * poems.length)])
    
    const wx = getWuXing(todayGan)
    const advices = WUXING_ADVICE[wx] || WUXING_ADVICE['木']
    setAdvice(advices[Math.floor(Math.random() * advices.length)])
    
    setRating(getDayRating(ss))
  }, [])

  if (!profile || !today) {
    return (
      <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-gold-gradient text-xl font-bold">每日签</h1>
        </div>
        <div className="text-center py-20">
          <div className="text-4xl mb-3">📝</div>
          <p className="text-moonly-secondary">请先添加八字档案</p>
          <Link href="/bazi" className="text-gold text-sm mt-2 inline-block">去添加 →</Link>
        </div>
      </div>
    )
  }

  const wx = getWuXing(dayMaster)

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/wo" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">每日签</h1>
      </div>

      {/* 日期 */}
      <div className="text-center mb-6">
        <div className="text-moonly-muted text-sm">{today.dateStr}</div>
        <div className="text-white text-lg mt-1">
          今日干支：
          <span className="text-gold font-bold">{today.day.gan}{today.day.zhi}</span>
        </div>
      </div>

      {/* 签文卡片 */}
      <div className="moonly-card p-6 mb-6 text-center border border-[#c9a96e]/20">
        <div className="text-4xl mb-4">🎋</div>
        <div className="text-gold text-lg font-bold mb-2">
          {profile.name} · {shiShen}日
        </div>
        <div className="text-2xl mb-4">{rating}</div>
        <div className="text-white text-base leading-relaxed mb-4">
          {poem}
        </div>
        <div className="text-[#c9a96e] text-sm">
          💡 {advice}
        </div>
      </div>

      {/* 五行信息 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="moonly-card p-4 text-center">
          <div className="text-xs text-moonly-muted mb-1">今日天干</div>
          <div className="text-xl font-bold text-gold">{today.day.gan}</div>
          <div className="text-xs text-moonly-secondary">{getWuXing(today.day.gan)}</div>
        </div>
        <div className="moonly-card p-4 text-center">
          <div className="text-xs text-moonly-muted mb-1">今日地支</div>
          <div className="text-xl font-bold text-gold">{today.day.zhi}</div>
          <div className="text-xs text-moonly-secondary">{getWuXing(today.day.zhi)}</div>
        </div>
      </div>

      {/* 三柱 */}
      <div className="moonly-card p-4 mb-6">
        <div className="text-xs text-moonly-muted mb-3">今日三柱</div>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-[10px] text-moonly-muted">年柱</div>
            <div className="text-lg font-bold text-white">{today.year.gan}</div>
            <div className="text-lg font-bold text-gold">{today.year.zhi}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-moonly-muted">月柱</div>
            <div className="text-lg font-bold text-white">{today.month.gan}</div>
            <div className="text-lg font-bold text-gold">{today.month.zhi}</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] text-moonly-muted">日柱</div>
            <div className="text-lg font-bold text-white">{today.day.gan}</div>
            <div className="text-lg font-bold text-gold">{today.day.zhi}</div>
          </div>
        </div>
      </div>

      {/* 重新抽签 */}
      <button
        onClick={() => {
          const poems = FORTUNE_POEMS[shiShen] || FORTUNE_POEMS['比肩']
          setPoem(poems[Math.floor(Math.random() * poems.length)])
          const advices = WUXING_ADVICE[wx] || WUXING_ADVICE['木']
          setAdvice(advices[Math.floor(Math.random() * advices.length)])
        }}
        className="w-full py-3 rounded-xl bg-[#c9a96e]/15 text-gold border border-[#c9a96e]/20 font-medium hover:bg-[#c9a96e]/20 transition"
      >
        🔄 再抽一签
      </button>
    </div>
  )
}
