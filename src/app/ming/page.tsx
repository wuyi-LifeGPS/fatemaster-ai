'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getProfiles, getDefaultProfile, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, calculateDaYun, getWuXing, getShiShen, getCangGan, DaYunInfo } from '@/lib/bazi'

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

const WUXING_GRADIENT: Record<string, string> = {
  '木': 'from-emerald-400/20 to-emerald-600/10',
  '火': 'from-red-400/20 to-red-600/10',
  '土': 'from-amber-400/20 to-amber-600/10',
  '金': 'from-slate-300/20 to-slate-400/10',
  '水': 'from-blue-400/20 to-blue-600/10',
}

const TABS = [
  { key: 'mingpan', label: '命盘' },
  { key: 'dayun', label: '大运' },
  { key: 'liunian', label: '流年' },
  { key: 'liuyue', label: '流月' },
  { key: 'liuri', label: '流日' },
] as const

type TabKey = typeof TABS[number]['key']

// ===== 工具函数 =====

function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

function formatDate(profile: BaziProfile): string {
  const type = profile.isLunar ? '农历' : '阳历'
  return `${type} ${profile.year}年${profile.month}月${profile.day}日 ${profile.birthTimeLabel}`
}

function getZodiacIcon(year: number): string {
  const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
  return animals[year % 12]
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
    '大吉': '大吉',
    '吉': '吉',
    '平': '平',
    '凶': '凶',
    '大凶': '大凶',
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

  // 计算大运数据
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

  // 无档案：引导添加
  if (!loading && profiles.length === 0) {
    return <EmptyState />
  }

  if (!currentProfile) return null

  return (
    <div className="animate-fade-in relative z-10">
      {/* 顶部资料胶囊 */}
      <ProfileCapsule profile={currentProfile} />

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
      <div className="px-4 py-4 pb-24">
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
      <Link
        href="/bazi"
        className="btn-gold px-8 py-3 text-sm font-semibold"
      >
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

// ===== 顶部资料胶囊 =====

function ProfileCapsule({ profile }: {
  profile: BaziProfile
}) {
  const age = getAge(profile.year)
  const zodiac = getZodiacIcon(profile.year)

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-full bg-black/15 border border-white/5">
        {/* 返回按钮 */}
        <Link href="/ming/records" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>

        {/* 生肖头像 */}
        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-base font-bold shrink-0"
          style={{ color: '#c9a96e' }}
        >
          {zodiac}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white text-sm truncate">{profile.name}</span>
            <span className="text-white/50 text-xs">· {age}岁</span>
          </div>
          <p className="text-white/40 text-xs truncate">{formatDate(profile)}</p>
        </div>

        {/* 编辑按钮 */}
        <Link href="/bazi" className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition shrink-0">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

// ===== 命盘 Tab =====

function MingPanTab({ data, profile }: { data: any; profile: BaziProfile }) {
  const { pillars, dayMaster, cangGanDetail, bodyStrength, pattern, tiaoHou, wuXingFullCount } = data

  return (
    <div className="space-y-4">
      {/* 命盘标题 */}
      <div className="text-center py-2">
        <h2 className="text-gold-gradient text-2xl font-bold">命盘</h2>
      </div>

      {/* 四柱表格 */}
      <SiZhuTable pillars={pillars} dayMaster={dayMaster} gender={profile.gender} />

      {/* 地支藏干 */}
      <DiZhiCangGan cangGanDetail={cangGanDetail} />

      {/* 日主与格局 */}
      <RiZhuGeJu bodyStrength={bodyStrength} pattern={pattern} tiaoHou={tiaoHou} />

      {/* 五行分布 */}
      <WuXingChart count={wuXingFullCount} />

      {/* 快捷入口 */}
      <QuickLinks />
    </div>
  )
}

// ===== 四柱表格 =====

function SiZhuTable({ pillars, dayMaster, gender }: { pillars: any[]; dayMaster: string; gender: '男' | '女' }) {
  const labels = ['年柱', '月柱', '日柱', '时柱']
  const rowLabels = ['主星', '天干', '地支']

  return (
    <div className="p-4">
      <div className="flex gap-1.5">
        {/* 左侧行标签列 */}
        <div className="flex flex-col justify-center gap-6 pt-7">
          {rowLabels.map(label => (
            <div key={label} className="text-white/50 text-xs text-right h-8 flex items-center justify-end">
              {label}
            </div>
          ))}
        </div>

        {/* 四柱卡片 */}
        {pillars.map((p: any, i: number) => {
          const isDayPillar = i === 2
          const shishen = isDayPillar
            ? (gender === '男' ? '元男' : '元女')
            : getShiShen(dayMaster, p.gan)
          const ganWx = getWuXing(p.gan)
          const zhiWx = getWuXing(p.zhi)

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              {/* 柱标题 */}
              <div className="text-white/60 text-xs mb-1">{labels[i]}</div>
              {/* 白色卡片 */}
              <div className="w-full rounded-xl bg-[#faf6f0] p-2.5 flex flex-col items-center gap-2">
                {/* 主星 */}
                <span className="text-gray-500 text-xs">{shishen}</span>
                {/* 天干 */}
                <span className="text-xl font-bold" style={{ color: WUXING_COLOR[ganWx] || '#333' }}>
                  {p.gan}
                </span>
                {/* 地支 */}
                <span className="text-xl font-bold" style={{ color: WUXING_COLOR[zhiWx] || '#333' }}>
                  {p.zhi}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== 地支藏干 =====

function DiZhiCangGan({ cangGanDetail }: { cangGanDetail: any[] }) {
  const qiLabels = ['本气', '中气', '余气']

  return (
    <div className="p-4">
      <h3 className="text-gold text-sm font-semibold mb-3 text-center">地支藏干</h3>
      <div className="flex gap-1.5">
        {/* 左侧行标签列 */}
        <div className="flex flex-col justify-center gap-5 pt-6">
          {qiLabels.map(label => (
            <div key={label} className="text-white/50 text-xs text-right h-10 flex items-center justify-end">
              {label}
            </div>
          ))}
        </div>

        {/* 四柱藏干卡片 */}
        {cangGanDetail.map((col: any, colIdx: number) => (
          <div key={col.name} className="flex-1 flex flex-col items-center gap-1">
            {/* 柱标题 */}
            <div className="text-white/60 text-xs mb-1">{col.name}</div>
            {/* 白色卡片 */}
            <div className="w-full rounded-xl bg-[#faf6f0] p-2.5 flex flex-col items-center gap-3">
              {qiLabels.map((_, qiIdx) => {
                const cg = col.cangGan[qiIdx]
                if (!cg) {
                  return <div key={qiIdx} className="h-10 flex items-center justify-center"><span className="text-gray-300">—</span></div>
                }
                return (
                  <div key={qiIdx} className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-medium" style={{ color: WUXING_COLOR[cg.wuXing] || '#333' }}>
                      {cg.gan}·{cg.shiShen}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-white/40 mt-3 text-center">
        本气（主气）为地支最主要能量，中气、余气为辅助能量
      </p>
    </div>
  )
}

// ===== 日主与格局 =====

function RiZhuGeJu({ bodyStrength, pattern, tiaoHou }: { bodyStrength: any; pattern: any; tiaoHou: any }) {
  return (
    <div className="moonly-card p-4">
      <div className="mb-3">
        <h3 className="text-gold text-sm font-semibold">日主与格局</h3>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="pillar-cell p-3 text-center flex flex-col justify-center">
          <div className="text-moonly-text-muted text-xs mb-1">身强身弱</div>
          <div className="text-white font-semibold text-sm">{bodyStrength?.strength || '——'}</div>
          {bodyStrength?.score != null && (
            <div className="text-moonly-text-muted text-[10px] mt-1">得分 {bodyStrength.score}</div>
          )}
        </div>
        <div className="pillar-cell p-3 text-center flex flex-col justify-center">
          <div className="text-moonly-text-muted text-xs mb-1">格局</div>
          <div className="text-white font-semibold text-sm leading-tight">{pattern?.patternName || '——'}</div>
        </div>
        <div className="pillar-cell p-3 text-center flex flex-col justify-center">
          <div className="text-moonly-text-muted text-xs mb-1">喜用神</div>
          <div className="text-gold font-semibold text-sm">
            {tiaoHou?.tiaoHouGod?.join('、') || '——'}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== 五行分布 =====

function WuXingChart({ count }: { count: Record<string, number> }) {
  const max = Math.max(...Object.values(count), 1)

  const items = [
    { label: '金', color: 'bg-gradient-to-t from-slate-300 to-slate-400', key: '金' },
    { label: '木', color: 'bg-gradient-to-t from-emerald-400 to-emerald-500', key: '木' },
    { label: '水', color: 'bg-gradient-to-t from-blue-400 to-blue-500', key: '水' },
    { label: '火', color: 'bg-gradient-to-t from-red-400 to-red-500', key: '火' },
    { label: '土', color: 'bg-gradient-to-t from-amber-400 to-amber-500', key: '土' },
  ]

  return (
    <div className="moonly-card p-4">
      <h3 className="text-gold text-sm font-semibold mb-4">五行分布</h3>
      <div className="flex items-end justify-around gap-3 h-28">
        {items.map(item => {
          const val = count[item.key] || 0
          const pct = Math.max((val / max) * 100, 8)
          return (
            <div key={item.key} className="flex flex-col items-center gap-1.5 flex-1">
              <span className="text-white text-xs font-medium">{val}</span>
              <div className="w-full flex justify-center items-end" style={{ height: '80px' }}>
                <div
                  className={`w-6 rounded-t-md ${item.color} opacity-80`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={`text-xs ${WUXING_CLASS[item.key]}`}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== 快捷入口 =====

function QuickLinks() {
  const links = [
    { href: '/match', icon: '💞', label: '合婚分析', desc: '匹配姻缘' },
    { href: '/career', icon: '💼', label: '事业合作', desc: '合作运势' },
    { href: '/talent', icon: '🌟', label: '天赋分析', desc: '多元智能' },
    { href: '/naming', icon: '✨', label: '姓名学', desc: '起名改名' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {links.map(link => (
        <Link
          key={link.href}
          href={link.href}
          className="moonly-card p-3 flex items-center gap-3 hover:bg-white/5 transition"
        >
          <span className="text-xl">{link.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm">{link.label}</div>
            <div className="text-moonly-text-muted text-xs">{link.desc}</div>
          </div>
        </Link>
      ))}
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
          {/* 巨大评分 */}
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gold">{currentDayun.score}</span>
            <span className="text-lg text-moonly-gold-light">{getFortuneLabel(currentDayun.fortuneLevel)}</span>
          </div>
        </div>

        {/* 大运名称 + 年份 */}
        <div className="mb-2">
          <span className="text-white font-semibold text-lg">{currentDayun.ganZhi}运</span>
          <span className="text-moonly-text-secondary text-sm ml-2">· {currentDayun.startYear}-{currentDayun.endYear}</span>
        </div>

        {/* 步数 + 起运年龄 */}
        <div className="text-moonly-text-muted text-xs mb-4">
          第{currentDayun.index}步大运 · {currentDayun.startAge}岁起运
        </div>

        {/* 四维度星级 */}
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

        {/* 可横向滚动的图表+列表 */}
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

  // 填充区域
  const fillPath = `${pathD} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="dayunFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 169, 110, 0.2)" />
          <stop offset="100%" stopColor="rgba(201, 169, 110, 0)" />
        </linearGradient>
      </defs>

      {/* 网格线 */}
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

      {/* Y轴标签 */}
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

      {/* 填充区域 */}
      <path d={fillPath} fill="url(#dayunFill)" />

      {/* 折线 */}
      <path d={pathD} fill="none" stroke="#c9a96e" strokeWidth="2" />

      {/* 数据点 */}
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
          {/* 分数标签 */}
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

      {/* X轴标签 */}
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
