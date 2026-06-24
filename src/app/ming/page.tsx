'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { getProfiles, getDefaultProfile, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, calculateDaYun, getWuXing, getShiShen, getCangGan, getYinYang, getZhiShiShen, SHI_SHEN_MAP, DaYunInfo } from '@/lib/bazi'

// ===== 常量 =====

const WUXING_COLOR: Record<string, string> = {
  '木': '#4ade80',
  '火': '#f87171',
  '土': '#fbbf24',
  '金': '#e2e8f0',
  '水': '#60a5fa',
}

const WUXING_CLASS: Record<string, string> = {
  '木': 'wuxing-wood',
  '火': 'wuxing-fire',
  '土': 'wuxing-earth',
  '金': 'wuxing-metal',
  '水': 'wuxing-water',
}

const TABS = [
  { key: 'mingpan', label: '命盘' },
  { key: 'dayun', label: '大运' },
  { key: 'liunian', label: '年运' },
  { key: 'liuyue', label: '月运' },
  { key: 'liuri', label: '日运' },
] as const

type TabKey = typeof TABS[number]['key']

// 生肖emoji
const ZODIAC_EMOJI: Record<string, string> = {
  '鼠': '🐭', '牛': '🐮', '虎': '🐯', '兔': '🐰',
  '龙': '🐲', '蛇': '🐍', '马': '🐴', '羊': '🐑',
  '猴': '🐵', '鸡': '🐔', '狗': '🐶', '猪': '🐷',
}

// 十神emoji
const SHISHEN_EMOJI: Record<string, string> = {
  '正印': '👩‍🦰',
  '偏印': '🤓',
  '正官': '👨‍💼',
  '七杀': '⚔️',
  '正财': '💰',
  '偏财': '🎰',
  '比肩': '🤝',
  '劫财': '🏴‍☠️',
  '食神': '😋',
  '伤官': '😤',
}

// ===== 工具函数 =====

function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

function formatDate(profile: BaziProfile): string {
  const type = profile.isLunar ? '农历' : '公历'
  return `${type}${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}出生`
}

function getZodiac(year: number): string {
  const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
  return animals[year % 12]
}

function getZodiacEmoji(year: number): string {
  return ZODIAC_EMOJI[getZodiac(year)] || '🐷'
}

// 星座计算
function getConstellation(month: number, day: number): string {
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 23, 22]
  const signs = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座']
  const idx = month - 1
  if (day < dates[idx]) {
    return signs[idx]
  }
  return signs[(idx + 1) % 12]
}

// 获取五行文字表示（用于八字下方）
function getWuXingText(gan: string, zhi: string): string {
  const ganWx = getWuXing(gan)
  const zhiWx = getWuXing(zhi)
  return ganWx + zhiWx
}

// 计算十神出现次数
function countShiShen(pillars: any[], dayMaster: string): Record<string, number> {
  const counts: Record<string, number> = {
    '正印': 0, '偏印': 0, '正官': 0, '七杀': 0,
    '正财': 0, '偏财': 0, '比肩': 0, '劫财': 0,
    '食神': 0, '伤官': 0,
  }

  // 天干
  pillars.forEach((p, i) => {
    if (i === 2) return // 跳过日干（日主本身）
    const ss = getShiShen(dayMaster, p.gan)
    if (counts[ss] !== undefined) counts[ss]++
  })

  // 地支藏干（本气、中气、余气）
  pillars.forEach(p => {
    const cangGan = getCangGan(p.zhi)
    cangGan.forEach(gan => {
      const ss = SHI_SHEN_MAP[dayMaster]?.[gan]
      if (ss && counts[ss] !== undefined) counts[ss]++
    })
  })

  return counts
}

// 生成人生总评
function generateLifeSummary(data: any, profile: BaziProfile): string {
  const { dayMaster, bodyStrength, pattern, tiaoHou, pillars } = data
  const wx = getWuXing(dayMaster)
  const yy = getYinYang(dayMaster)

  let summary = `此命日主为${dayMaster}${wx}，${yy}性，属"${pattern?.patternName || '普通'}"之格局。`

  if (bodyStrength?.strength === '强') {
    summary += '早年主顺遂，才华横溢，能担财官显贵。'
  } else if (bodyStrength?.strength === '偏弱') {
    summary += '早年主磨砺，需借助印星、比劫之力方能成事。'
  } else {
    summary += '早年主平稳，能屈能伸，进退有度。'
  }

  const age = getAge(profile.year)
  summary += `中年（${Math.max(30, age + 5)}岁后）大运转入${wx === '金' || wx === '水' ? '火土' : '金水'}之地，事业渐入佳境。`
  summary += `晚年主安宁，${tiaoHou?.tiaoHouGod?.join('、') || '贵人'}为用神，福禄双全。`

  return summary
}

// 生成事业方向
function getCareerDirection(data: any): string[] {
  const { tiaoHou, pattern } = data
  const gods = tiaoHou?.tiaoHouGod || []
  const directions: string[] = []

  gods.forEach((g: string) => {
    const wx = getWuXing(g)
    if (wx && !directions.includes(wx)) directions.push(wx)
  })

  if (directions.length === 0) {
    if (pattern?.patternType === '食神' || pattern?.patternType === '伤官') directions.push('火', '土')
    else directions.push('木', '火')
  }

  return directions.slice(0, 2)
}

// 生成财运走势描述
function getWealthTrend(data: any, profile: BaziProfile): { label: string; description: string } {
  const { pattern, bodyStrength } = data
  const age = getAge(profile.year)

  if (pattern?.patternType === '正财' || pattern?.patternType === '偏财') {
    return { label: '中晚年发迹', description: '财星当令，中年后财源广进' }
  }
  if (bodyStrength?.strength === '强') {
    return { label: '稳扎稳打', description: '身强能担财，财运平稳上升' }
  }
  return { label: '厚积薄发', description: '先积后扬，中年后转运' }
}

// 生成感情评分
function getLoveScore(data: any, profile: BaziProfile): number {
  const { pillars, dayMaster } = data
  let score = 50

  // 男命看财星，女命看官杀
  if (profile.gender === '男') {
    const hasCai = pillars.some((p: any) => {
      const ss = getShiShen(dayMaster, p.gan)
      return ss === '正财' || ss === '偏财'
    })
    if (hasCai) score += 15
  } else {
    const hasGuan = pillars.some((p: any) => {
      const ss = getShiShen(dayMaster, p.gan)
      return ss === '正官' || ss === '七杀'
    })
    if (hasGuan) score += 15
  }

  // 日支（夫妻宫）是否有刑冲
  const dayZhi = pillars[2]?.zhi
  if (dayZhi) {
    const monthZhi = pillars[1]?.zhi
    if (monthZhi && isChong(dayZhi, monthZhi)) score -= 10
  }

  return Math.min(100, Math.max(20, score))
}

// 生成健康评分
function getHealthScore(data: any): number {
  const { bodyStrength, wuXingFullCount } = data
  let score = 60

  if (bodyStrength?.strength === '中和') score += 15
  if (bodyStrength?.strength === '强') score += 10

  // 五行是否平衡
  const counts = Object.values(wuXingFullCount || {}) as number[]
  const max = Math.max(...counts)
  const min = Math.min(...counts)
  if (max - min <= 2) score += 10

  return Math.min(100, Math.max(30, score))
}

function isChong(zhi1: string, zhi2: string): boolean {
  const chong: Record<string, string> = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳',
  }
  return chong[zhi1] === zhi2
}

function getDimensionStars(daYun: DaYunInfo, gender: '男' | '女'): { career: number; love: number; wealth: number; health: number } {
  const score = daYun.score
  const ss = daYun.shiShen

  const base = Math.min(5, Math.max(1, Math.round(score / 20)))

  let career = base
  if (['正官', '七杀'].includes(ss)) career = Math.min(5, career + 1)
  if (['比肩', '劫财'].includes(ss)) career = Math.max(1, career - 1)

  let love = base
  if (gender === '男' && ['正财', '偏财'].includes(ss)) love = Math.min(5, love + 1)
  if (gender === '女' && ['正官', '七杀'].includes(ss)) love = Math.min(5, love + 1)
  if (['伤官', '劫财'].includes(ss)) love = Math.max(1, love - 1)

  let wealth = base
  if (['正财', '偏财', '食神'].includes(ss)) wealth = Math.min(5, wealth + 1)
  if (['正印', '偏印', '比肩'].includes(ss)) wealth = Math.max(1, wealth - 1)

  let health = base
  if (['正印', '偏印'].includes(ss)) health = Math.min(5, health + 1)
  if (['七杀', '伤官'].includes(ss)) health = Math.max(1, health - 1)

  return { career, love, wealth, health }
}

function getDayunDescription(daYun: DaYunInfo, dayMaster: string): string {
  const { ganZhi, shiShen, score, keywords } = daYun
  const wx = getWuXing(daYun.gan)

  let desc = `进入${ganZhi}运，天干${shiShen}透出，五行属${wx}。`

  if (score >= 80) {
    desc += `此运整体运势极佳，${keywords.slice(0, 2).join('、')}，机遇良多，宜积极把握。`
  } else if (score >= 65) {
    desc += `此运运势良好，${keywords.slice(0, 2).join('、')}，稳步发展，适合积累与布局。`
  } else if (score >= 45) {
    desc += `此运运势平稳，需稳扎稳打，注意${keywords[0] || '细节'}，以守为攻。`
  } else if (score >= 30) {
    desc += `此运挑战较多，${keywords[0] || '需谨慎'}，宜守不宜攻，避免冒进。`
  } else {
    desc += `此运较为艰难，需格外谨慎，以稳为主，静待时机。`
  }

  return desc
}

function getFortuneLabel(level: string): string {
  const map: Record<string, string> = {
    '大吉': '大吉', '吉': '吉', '平': '平', '凶': '凶', '大凶': '大凶',
  }
  return map[level] || '平'
}

function StarRating({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < count ? 'text-gold' : 'text-white/20'}>
          ★
        </span>
      ))}
    </span>
  )
}

// ===== 主组件 =====

export default function MingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('mingpan')
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [baziData, setBaziData] = useState<any>(null)
  const [daYunData, setDaYunData] = useState<DaYunInfo[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const list = getProfiles()
    setProfiles(list)
    const def = list[0]
    if (def) {
      setCurrentId(def.id)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!currentId) return
    const profile = profiles.find(p => p.id === currentId)
    if (!profile) return

    const birthDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`
    const birthTime = `${String(profile.hour).padStart(2, '0')}:00`
    try {
      const data = calculateBazi(birthDate, birthTime)
      setBaziData(data)
    } catch (e) {
      console.error('八字计算失败:', e)
    }
  }, [currentId, profiles])

  useEffect(() => {
    if (!baziData || !currentId) return
    const profile = profiles.find(p => p.id === currentId)
    if (!profile) return

    const birthDate = `${profile.year}-${String(profile.month).padStart(2, '0')}-${String(profile.day).padStart(2, '0')}`
    const gender = profile.gender === '男' ? 'male' : 'female'

    try {
      const dayun = calculateDaYun(
        baziData.pillars[0].gan,
        baziData.pillars[1].gan,
        baziData.pillars[1].zhi,
        baziData.dayMaster,
        gender,
        birthDate,
        baziData.pillars
      )
      setDaYunData(dayun)
    } catch (e) {
      console.error('大运计算失败:', e)
    }
  }, [baziData, currentId, profiles])

  const currentProfile = useMemo(() => profiles.find(p => p.id === currentId), [profiles, currentId])

  if (!loading && profiles.length === 0) {
    return <EmptyState />
  }

  if (!currentProfile) return null

  return (
    <div className="animate-fade-in relative z-10">
      {/* 顶部资料区域 */}
      <ProfileHeader profile={currentProfile} baziData={baziData} />

      {/* 二级 Tab */}
      <div className="flex items-center justify-center gap-5 px-4 py-3 border-b border-white/5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`top-tab text-sm font-medium py-1 relative ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="px-4 py-4 pb-24 space-y-4">
        {activeTab === 'mingpan' && baziData && <MingPanTab data={baziData} profile={currentProfile} />}
        {activeTab === 'dayun' && daYunData && <DayunTab daYunList={daYunData} profile={currentProfile} dayMaster={baziData?.dayMaster} />}
        {activeTab === 'dayun' && !daYunData && <LoadingTab />}
        {activeTab === 'liunian' && <LiunianPlaceholder />}
        {activeTab === 'liuyue' && <LiuyuePlaceholder />}
        {activeTab === 'liuri' && <LiuriPlaceholder />}
      </div>
    </div>
  )
}

// ===== 空状态 =====

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in relative z-10">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-moonly-purple to-moonly-bg-dark flex items-center justify-center mb-6 border border-moonly-card-border">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-white mb-2">探索您的命盘</h2>
      <p className="text-moonly-text-secondary text-sm mb-8 max-w-xs">
        添加您的出生信息，解锁八字命盘、大运流年、流月流日等完整命理分析
      </p>
      <Link href="/bazi" className="btn-gold px-8 py-3 text-sm font-semibold">
        添加我的八字
      </Link>
      <p className="text-moonly-text-muted text-xs mt-4">
        支持保存多个档案：自己、家人、朋友
      </p>
    </div>
  )
}

// ===== 加载中 =====

function LoadingTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin mb-4" />
      <p className="text-moonly-text-secondary text-sm">正在计算中...</p>
    </div>
  )
}

// ===== 顶部资料区域 =====

function ProfileHeader({ profile, baziData }: { profile: BaziProfile; baziData: any }) {
  const age = getAge(profile.year)
  const zodiacEmoji = getZodiacEmoji(profile.year)
  const zodiac = getZodiac(profile.year)
  const constellation = getConstellation(profile.month, profile.day)

  const wuxingText = baziData?.pillars?.map((p: any) => getWuXingText(p.gan, p.zhi)).join(' ') || ''
  const baziStr = baziData?.pillars?.map((p: any) => p.gan + p.zhi).join(' ') || ''

  return (
    <div className="px-4 pt-3 pb-2">
      {/* 返回 + 姓名 */}
      <div className="flex items-center justify-between mb-4">
        <Link href="/ming/records" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>

        <div className="flex items-center gap-1">
          <span className="text-white font-medium text-sm">{profile.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>

        <div className="w-8" /> {/* 占位 */}
      </div>

      {/* 头像 + 信息 */}
      <div className="flex flex-col items-center">
        {/* 大emoji头像 */}
        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-3xl mb-3">
          {zodiacEmoji}
        </div>

        {/* 姓名·年龄·性别 */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-white font-semibold text-base">{profile.name}</span>
          <span className="text-white/40 text-sm">·</span>
          <span className="text-white/60 text-sm">{age}岁</span>
          <span className="text-white/40 text-sm">·</span>
          <span className="text-white/60 text-sm">{profile.gender}</span>
        </div>

        {/* 详细信息 */}
        <div className="text-center space-y-0.5 mb-3">
          <p className="text-white/40 text-xs">{formatDate(profile)}</p>
          <p className="text-white/30 text-[10px]">
            生肖：{zodiac}{zodiacEmoji} · 星座：{constellation}
          </p>
          <p className="text-white/30 text-[10px]">
            八字：{baziStr}
          </p>
          <p className="text-white/30 text-[10px]">
            五行：{wuxingText}
          </p>
        </div>

        {/* 修改档案按钮 */}
        <Link
          href="/ming/bazi"
          className="px-5 py-1.5 rounded-full border border-white/15 text-white/50 text-xs hover:bg-white/5 transition"
        >
          修改档案
        </Link>
      </div>
    </div>
  )
}

// ===== 命盘 Tab =====

function MingPanTab({ data, profile }: { data: any; profile: BaziProfile }) {
  const { pillars, dayMaster, cangGanDetail, bodyStrength, pattern, tiaoHou, wuXingFullCount } = data

  const shishenCount = useMemo(() => countShiShen(pillars, dayMaster), [pillars, dayMaster])
  const lifeSummary = useMemo(() => generateLifeSummary(data, profile), [data, profile])
  const careerDirs = useMemo(() => getCareerDirection(data), [data])
  const wealthTrend = useMemo(() => getWealthTrend(data, profile), [data, profile])
  const loveScore = useMemo(() => getLoveScore(data, profile), [data, profile])
  const healthScore = useMemo(() => getHealthScore(data), [data])

  return (
    <div className="space-y-4">
      {/* 八字排盘 */}
      <SiZhuTable pillars={pillars} dayMaster={dayMaster} gender={profile.gender} cangGanDetail={cangGanDetail} />

      {/* 人生总评 */}
      <InfoCard title="人生总评">
        <p className="text-white/70 text-xs leading-relaxed">{lifeSummary}</p>
      </InfoCard>

      {/* 五行能量 */}
      <WuXingBarChart count={wuXingFullCount} />

      {/* 日主 & 格局 */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard title="日主">
          <div className="text-center py-1">
            <span className="text-2xl font-bold" style={{ color: WUXING_COLOR[getWuXing(dayMaster)] }}>
              {dayMaster}{getWuXing(dayMaster)}
            </span>
          </div>
          <p className="text-white/50 text-[10px] leading-relaxed mt-1">
            {getYinYang(dayMaster)}性之金，主刚毅果断、重义气。生于{pillars[1].zhi}月，{getWuXing(pillars[1].zhi)}旺金相，宜火炼方能成器。
          </p>
        </InfoCard>
        <InfoCard title="格局">
          <div className="text-center py-1">
            <span className="text-2xl font-bold text-gold">{pattern?.patternName?.split('/')[0]?.trim() || '——'}</span>
          </div>
          <p className="text-white/50 text-[10px] leading-relaxed mt-1">
            {pattern?.patternDesc || '格局分析加载中...'}
          </p>
        </InfoCard>
      </div>

      {/* 身强身弱 */}
      <InfoCard title="身强身弱">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white font-semibold text-sm">{bodyStrength?.strength || '——'}</span>
          <span className="text-white/40 text-xs">{Math.round((bodyStrength?.score || 0) * 10)}/10</span>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold/60 to-gold"
            style={{ width: `${Math.min(100, ((bodyStrength?.score || 0) / 5) * 100)}%` }}
          />
        </div>
        <p className="text-white/40 text-[10px] mt-2">{bodyStrength?.description || ''}</p>
      </InfoCard>

      {/* 喜用神 */}
      <InfoCard title="喜用神">
        <div className="flex items-center gap-3 py-1">
          {tiaoHou?.tiaoHouGod?.map((god: string, i: number) => (
            <span key={i} className="text-2xl font-bold" style={{ color: WUXING_COLOR[getWuXing(god)] }}>
              {getWuXing(god)}
            </span>
          ))}
        </div>
        <p className="text-white/40 text-[10px] mt-1">{tiaoHou?.tiaoHouReason || ''}</p>
      </InfoCard>

      {/* 十神 */}
      <ShiShenGrid count={shishenCount} />

      {/* 事业方向 & 财运走势 */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard title="事业方向">
          <div className="flex items-center gap-2 py-1">
            {careerDirs.map((dir, i) => (
              <span key={i} className="text-lg font-bold" style={{ color: WUXING_COLOR[dir] }}>
                {dir}
              </span>
            ))}
          </div>
          <p className="text-white/40 text-[10px]">五行属{careerDirs.join('、')}的行业有利</p>
        </InfoCard>
        <InfoCard title="财运走势">
          <div className="text-gold font-semibold text-sm py-0.5">{wealthTrend.label}</div>
          <p className="text-white/40 text-[10px]">{wealthTrend.description}</p>
          {/* 简单曲线 */}
          <svg viewBox="0 0 100 30" className="w-full h-6 mt-1">
            <path d="M0 25 Q25 20 50 15 T100 5" fill="none" stroke="#c9a96e" strokeWidth="1.5" />
            <circle cx="100" cy="5" r="2" fill="#c9a96e" />
          </svg>
        </InfoCard>
      </div>

      {/* 感情 & 健康 */}
      <div className="grid grid-cols-2 gap-3">
        <InfoCard title="感情">
          <div className="flex items-baseline gap-1 py-1">
            <span className="text-2xl font-bold text-gold">{loveScore}</span>
            <span className="text-white/40 text-xs">分</span>
          </div>
          <p className="text-white/40 text-[10px]">
            {loveScore >= 70 ? '感情顺遂，桃花旺盛' : loveScore >= 50 ? '感情平稳，需主动经营' : '感情多磨，宜晚婚'}
          </p>
        </InfoCard>
        <InfoCard title="健康">
          <div className="flex items-baseline gap-1 py-1">
            <span className="text-2xl font-bold text-green-400">{healthScore}</span>
            <span className="text-white/40 text-xs">分</span>
          </div>
          <p className="text-white/40 text-[10px]">
            {healthScore >= 70 ? '体质较好，注意保养' : healthScore >= 50 ? '体质一般，需加强锻炼' : '体质偏弱，注意调养'}
          </p>
        </InfoCard>
      </div>
    </div>
  )
}

// ===== 通用信息卡片 =====

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="info-card-black p-4">
      <h3 className="text-gold text-xs font-semibold mb-2">{title}</h3>
      {children}
    </div>
  )
}

// ===== 四柱表格 =====

function SiZhuTable({ pillars, dayMaster, gender, cangGanDetail }: {
  pillars: any[]; dayMaster: string; gender: '男' | '女'; cangGanDetail: any[]
}) {
  const labels = ['年柱', '月柱', '日柱', '时柱']

  return (
    <div className="info-card-black p-4">
      <h3 className="text-gold text-xs font-semibold mb-3">八字排盘</h3>

      {/* 四列卡片 */}
      <div className="flex gap-2">
        {pillars.map((p: any, i: number) => {
          const isDayPillar = i === 2
          const shishen = isDayPillar
            ? (gender === '男' ? '元男' : '元女')
            : getShiShen(dayMaster, p.gan)
          const ganWx = getWuXing(p.gan)
          const zhiWx = getWuXing(p.zhi)
          const cg = cangGanDetail[i]?.cangGan?.[0]

          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              {/* 柱标题 */}
              <span className="text-white/50 text-[10px] mb-1.5">{labels[i]}</span>
              {/* 深色卡片 */}
              <div className="w-full rounded-xl bg-black/20 border border-white/5 p-2.5 flex flex-col items-center gap-1.5">
                {/* 天干 */}
                <span className="text-lg font-bold" style={{ color: WUXING_COLOR[ganWx] || '#fff' }}>
                  {p.gan}
                </span>
                {/* 地支 */}
                <span className="text-lg font-bold" style={{ color: WUXING_COLOR[zhiWx] || '#fff' }}>
                  {p.zhi}
                </span>
                {/* 藏干 */}
                {cg && (
                  <span className="text-[10px] text-white/40">
                    {cg.gan}·{cg.shiShen}
                  </span>
                )}
              </div>
              {/* 十神标签 */}
              <span className="text-white/30 text-[9px] mt-1">{shishen}</span>
            </div>
          )
        })}
      </div>

      {/* 下方八字字符串 */}
      <div className="flex justify-center gap-3 mt-3 pt-3 border-t border-white/5">
        {pillars.map((p: any, i: number) => (
          <span key={i} className="text-white/50 text-xs">
            {p.gan}{p.zhi}{i === 0 ? '年' : i === 1 ? '月' : i === 2 ? '日' : '时'}
          </span>
        ))}
      </div>
    </div>
  )
}

// ===== 五行能量（横向柱状图） =====

function WuXingBarChart({ count }: { count: Record<string, number> }) {
  const items = [
    { label: '金', color: '#e2e8f0', key: '金', icon: '⚪' },
    { label: '木', color: '#4ade80', key: '木', icon: '🌿' },
    { label: '水', color: '#60a5fa', key: '水', icon: '💧' },
    { label: '火', color: '#f87171', key: '火', icon: '🔥' },
    { label: '土', color: '#fbbf24', key: '土', icon: '🟤' },
  ]

  const max = Math.max(...Object.values(count), 1)

  return (
    <div className="info-card-black p-4">
      <h3 className="text-gold text-xs font-semibold mb-3">五行能量</h3>
      <div className="space-y-2.5">
        {items.map(item => {
          const val = count[item.key] || 0
          const pct = (val / max) * 100
          return (
            <div key={item.key} className="flex items-center gap-2">
              <span className="text-white/50 text-xs w-4">{val}</span>
              <div className="flex-1 h-5 bg-white/5 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full opacity-80"
                  style={{ width: `${Math.max(pct, 8)}%`, backgroundColor: item.color }}
                />
              </div>
              <span className="text-xs w-4 text-center" style={{ color: item.color }}>{item.label}</span>
            </div>
          )
        })}
      </div>
      <p className="text-white/30 text-[10px] mt-3 leading-relaxed">
        【五行能量说明】五行平衡为理想状态，若某行过旺或过弱，则相应五行对应的脏腑或运势可能偏弱，需结合大运流年综合判断。
      </p>
    </div>
  )
}

// ===== 十神网格 =====

function ShiShenGrid({ count }: { count: Record<string, number> }) {
  const items = [
    { key: '正印', label: '正印' },
    { key: '正官', label: '正官' },
    { key: '正财', label: '正财' },
    { key: '比肩', label: '比肩' },
    { key: '食神', label: '食神' },
    { key: '偏印', label: '偏印' },
    { key: '七杀', label: '七杀' },
    { key: '偏财', label: '偏财' },
    { key: '劫财', label: '劫财' },
    { key: '伤官', label: '伤官' },
  ]

  return (
    <div className="info-card-black p-4">
      <h3 className="text-gold text-xs font-semibold mb-3">十神</h3>
      <div className="grid grid-cols-5 gap-2">
        {items.map(item => (
          <div key={item.key} className="flex flex-col items-center gap-0.5">
            <span className="text-white/50 text-[9px]">{item.label}</span>
            <span className="text-lg">{SHISHEN_EMOJI[item.key]}</span>
            <span className="text-white/30 text-[9px]">{count[item.key] || 0}个</span>
          </div>
        ))}
      </div>
      <p className="text-white/30 text-[10px] mt-3 leading-relaxed">
        命局最旺{Object.entries(count).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '食神'}，{Object.entries(count).sort((a, b) => (b[1] as number) - (a[1] as number))[1]?.[0] || '伤官'}次之，整体十神{Object.values(count).filter(v => v > 0).length >= 8 ? '分布均衡' : '略有偏颇'}，人生方向明确。
      </p>
    </div>
  )
}

// ===== 大运 Tab =====

function DayunTab({ daYunList, profile, dayMaster }: { daYunList: DaYunInfo[]; profile: BaziProfile; dayMaster?: string }) {
  const currentIndex = daYunList.findIndex(d => d.isCurrent)
  const currentDayun = daYunList[currentIndex] || daYunList[0]
  const stars = getDimensionStars(currentDayun, profile.gender)

  return (
    <div className="space-y-4">
      {/* 大运总览 */}
      <div className="moonly-card p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gold">{currentDayun.score}</span>
            <span className="text-lg text-moonly-gold-light">{getFortuneLabel(currentDayun.fortuneLevel)}</span>
          </div>
        </div>

        <div className="mb-2">
          <span className="text-white font-semibold text-lg">{currentDayun.ganZhi}运</span>
          <span className="text-moonly-text-secondary text-sm ml-2">· {currentDayun.startYear}-{currentDayun.endYear}</span>
        </div>

        <div className="text-moonly-text-muted text-xs mb-4">
          第{currentDayun.index}步大运 · {currentDayun.startAge}岁起运
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-moonly-text-secondary text-sm">事业</span>
            <StarRating count={stars.career} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-text-secondary text-sm">爱情</span>
            <StarRating count={stars.love} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-text-secondary text-sm">财运</span>
            <StarRating count={stars.wealth} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-moonly-text-secondary text-sm">健康</span>
            <StarRating count={stars.health} />
          </div>
        </div>
      </div>

      {/* 大运简述 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-2">大运简述</h3>
        <p className="text-moonly-text-secondary text-sm leading-relaxed">
          {dayMaster ? getDayunDescription(currentDayun, dayMaster) : '大运描述加载中...'}
        </p>
      </div>

      {/* 大运时间线 */}
      <div className="moonly-card p-4">
        <div className="mb-3">
          <h3 className="text-gold text-sm font-semibold">大运走势</h3>
        </div>

        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div style={{ minWidth: `${Math.max(340, daYunList.length * 72)}px` }}>
            <DayunChart daYunList={daYunList} currentIndex={currentIndex >= 0 ? currentIndex : 0} />

            <div className="flex gap-2 mt-2 pb-2">
              {daYunList.map((d, i) => (
                <div
                  key={i}
                  className={`shrink-0 w-16 text-center p-2 rounded-lg border ${
                    d.isCurrent
                      ? 'border-moonly-gold/40 bg-moonly-gold/10'
                      : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className={`text-xs font-semibold ${d.isCurrent ? 'text-gold' : 'text-white'}`}>
                    {d.ganZhi}
                  </div>
                  <div className="text-[10px] text-moonly-text-muted mt-0.5">
                    {d.startYear}-{d.endYear}
                  </div>
                  <div className="text-[10px] text-moonly-text-muted">
                    {Math.floor(d.startAge)}-{Math.floor(d.endAge)}岁
                  </div>
                  <div className={`text-[10px] mt-0.5 font-medium ${
                    d.score >= 65 ? 'text-green-400' : d.score >= 45 ? 'text-slate-400' : 'text-red-400'
                  }`}>
                    {d.score} · {getFortuneLabel(d.fortuneLevel)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== 大运走势图 =====

function DayunChart({ daYunList, currentIndex }: { daYunList: DaYunInfo[]; currentIndex: number }) {
  const width = Math.max(600, daYunList.length * 72)
  const height = 180
  const padding = { top: 20, right: 20, bottom: 35, left: 35 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  const points = daYunList.map((d, i) => ({
    x: padding.left + (daYunList.length > 1 ? (i / (daYunList.length - 1)) : 0.5) * chartWidth,
    y: padding.top + (1 - d.score / 100) * chartHeight,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const fillPath = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="dayunFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 169, 110, 0.2)" />
          <stop offset="100%" stopColor="rgba(201, 169, 110, 0)" />
        </linearGradient>
      </defs>

      {[25, 50, 75].map(y => (
        <line
          key={y}
          x1={padding.left}
          y1={padding.top + (1 - y / 100) * chartHeight}
          x2={width - padding.right}
          y2={padding.top + (1 - y / 100) * chartHeight}
          stroke="rgba(255,255,255,0.08)"
          strokeDasharray="4 4"
        />
      ))}

      {[0, 50, 100].map(y => (
        <text
          key={y}
          x={padding.left - 5}
          y={padding.top + (1 - y / 100) * chartHeight + 4}
          textAnchor="end"
          fill="rgba(255,255,255,0.3)"
          fontSize="9"
        >
          {y}
        </text>
      ))}

      <path d={fillPath} fill="url(#dayunFill)" />
      <path d={pathD} fill="none" stroke="#c9a96e" strokeWidth="2" />

      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={i === currentIndex ? 6 : 3}
            fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.6)'}
            stroke={i === currentIndex ? '#fff' : 'none'}
            strokeWidth={i === currentIndex ? 2 : 0}
          />
          <text
            x={p.x}
            y={p.y - (i === currentIndex ? 10 : 8)}
            textAnchor="middle"
            fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.5)'}
            fontSize={i === currentIndex ? '11' : '9'}
            fontWeight={i === currentIndex ? 'bold' : 'normal'}
          >
            {daYunList[i].score}
          </text>
        </g>
      ))}

      {daYunList.map((d, i) => (
        <text
          key={i}
          x={points[i].x}
          y={height - 10}
          textAnchor="middle"
          fill={i === currentIndex ? '#c9a96e' : 'rgba(255,255,255,0.4)'}
          fontSize="9"
          fontWeight={i === currentIndex ? 'bold' : 'normal'}
        >
          {d.ganZhi}
        </text>
      ))}
    </svg>
  )
}

// ===== 占位页面 =====

function LiunianPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-moonly-gold/10 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <p className="text-moonly-text-secondary text-sm">流年分析模块开发中...</p>
      <p className="text-moonly-text-muted text-xs mt-1">将展示年度运势与关键事件预测</p>
    </div>
  )
}

function LiuyuePlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-moonly-gold/10 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <path d="M1 4v6h6M23 20v-6h-6" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      </div>
      <p className="text-moonly-text-secondary text-sm">流月分析模块开发中...</p>
      <p className="text-moonly-text-muted text-xs mt-1">将展示月度运势与能量波动</p>
    </div>
  )
}

function LiuriPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-moonly-gold/10 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </div>
      <p className="text-moonly-text-secondary text-sm">流日分析模块开发中...</p>
      <p className="text-moonly-text-muted text-xs mt-1">将展示每日运势与行动建议</p>
    </div>
  )
}
