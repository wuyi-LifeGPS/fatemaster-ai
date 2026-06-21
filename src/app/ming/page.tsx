'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getProfiles, getDefaultProfile, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, getWuXing, getShiShen, getCangGan } from '@/lib/bazi'

// ===== 工具函数 =====

const WUXING_COLOR: Record<string, string> = {
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

const TABS = [
  { key: 'mingpan', label: '命盘' },
  { key: 'dayun', label: '大运' },
  { key: 'liunian', label: '流年' },
  { key: 'liuyue', label: '流月' },
  { key: 'liuri', label: '流日' },
] as const

type TabKey = typeof TABS[number]['key']

// ===== 组件 =====

export default function MingPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabKey>('mingpan')
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [baziData, setBaziData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const list = getProfiles()
    setProfiles(list)
    
    // 优先读取已选中的档案
    const selectedId = typeof window !== 'undefined' ? localStorage.getItem('bazi_selected_profile') : null
    if (selectedId) {
      const found = list.find(p => p.id === selectedId)
      if (found) {
        setCurrentId(selectedId)
        // 清除标记，避免每次刷新都切换
        localStorage.removeItem('bazi_selected_profile')
        setLoading(false)
        return
      }
    }
    
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

  const currentProfile = useMemo(() => profiles.find(p => p.id === currentId), [profiles, currentId])

  // 无档案：引导添加
  if (!loading && profiles.length === 0) {
    return <EmptyState />
  }

  if (!currentProfile) return null

  return (
    <div className="animate-fade-in">
      {/* 顶部资料胶囊 */}
      <ProfileCapsule profile={currentProfile} profiles={profiles} onSwitch={setCurrentId} />

      {/* 二级 Tab */}
      <div className="flex items-center justify-center gap-6 px-4 py-3 border-b border-white/5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`top-tab text-sm font-medium py-1 ${activeTab === tab.key ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="px-4 py-4 pb-24">
        {activeTab === 'mingpan' && baziData && <MingPanContent data={baziData} profile={currentProfile} />}
        {activeTab === 'dayun' && <DayunPlaceholder profile={currentProfile} />}
        {activeTab === 'liunian' && <LiunianPlaceholder profile={currentProfile} />}
        {activeTab === 'liuyue' && <LiuyuePlaceholder profile={currentProfile} />}
        {activeTab === 'liuri' && <LiuriPlaceholder profile={currentProfile} />}
      </div>
    </div>
  )
}

// ===== 空状态：引导添加八字 =====

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center animate-fade-in">
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

// ===== 顶部资料胶囊 =====

function ProfileCapsule({ profile, profiles, onSwitch }: {
  profile: BaziProfile
  profiles: BaziProfile[]
  onSwitch: (id: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const age = getAge(profile.year)
  const zodiac = getZodiacIcon(profile.year)

  return (
    <div className="px-4 pt-4 pb-2">
      <div className="moonly-card p-3 flex items-center gap-3">
        {/* 生肖头像 */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-moonly-gold/20 to-moonly-gold/5 border border-moonly-gold/30 flex items-center justify-center text-lg font-bold text-gold">
          {zodiac}
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white text-sm truncate">{profile.name}</span>
            <span className="text-moonly-gold text-xs">· {age}岁</span>
          </div>
          <p className="text-moonly-text-muted text-xs truncate">{formatDate(profile)}</p>
        </div>

        {/* 切换按钮（有多人时） */}
        {profiles.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 w-48 moonly-card-light z-50 py-1">
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { onSwitch(p.id); setShowMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 transition ${p.id === profile.id ? 'text-gold' : 'text-white'}`}
                  >
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-moonly-text-muted">{formatDate(p)}</div>
                  </button>
                ))}
                <Link
                  href="/bazi"
                  className="block px-3 py-2 text-sm text-gold hover:bg-white/5 transition border-t border-white/5"
                >
                  + 添加新八字
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 编辑按钮（单档案时） */}
        {profiles.length <= 1 && (
          <Link href="/bazi" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

// ===== 命盘内容 =====

function MingPanContent({ data, profile }: { data: any; profile: BaziProfile }) {
  const { pillars, dayMaster, cangGanDetail, bodyStrength, pattern, tiaoHou, wuXingFullCount } = data

  return (
    <div className="space-y-4">
      {/* 命盘标题 */}
      <div className="text-center mb-4">
        <h2 className="text-gold-gradient text-xl font-bold">命盘</h2>
      </div>

      {/* 四柱 */}
      <div className="grid grid-cols-4 gap-2">
        {pillars.map((p: any) => (
          <div key={p.name} className="flex flex-col items-center">
            <span className="text-moonly-text-muted text-xs mb-1">{p.name}</span>
            <div className="w-full space-y-1">
              {/* 天干 */}
              <div className={`pillar-cell py-2 flex flex-col items-center bg-gradient-to-b ${WUXING_GRADIENT[getWuXing(p.gan)] || 'from-white/5 to-transparent'}`}>
                <span className={`text-2xl font-bold ${WUXING_COLOR[getWuXing(p.gan)] || 'text-white'}`}>{p.gan}</span>
                <span className="text-[10px] text-moonly-text-muted mt-0.5">{getShiShen(dayMaster, p.gan)}</span>
              </div>
              {/* 地支 */}
              <div className={`pillar-cell py-2 flex flex-col items-center bg-gradient-to-b ${WUXING_GRADIENT[getWuXing(p.zhi)] || 'from-white/5 to-transparent'}`}>
                <span className={`text-2xl font-bold ${WUXING_COLOR[getWuXing(p.zhi)] || 'text-white'}`}>{p.zhi}</span>
                <span className="text-[10px] text-moonly-text-muted mt-0.5">{getShiShen(dayMaster, getCangGan(p.zhi)[0])}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 地支藏干 */}
      <div className="moonly-card p-4 mt-4">
        <h3 className="text-gold text-sm font-semibold mb-3">地支藏干</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {cangGanDetail.map((col: any) => (
            <div key={col.name} className="space-y-1">
              <span className="text-moonly-text-muted text-[10px]">{col.name}</span>
              {col.cangGan.map((cg: any, idx: number) => (
                <div key={idx} className="pillar-cell py-1 px-1">
                  <span className={`text-sm font-medium ${WUXING_COLOR[cg.wuXing] || 'text-white'}`}>
                    {cg.gan}
                  </span>
                  <span className="text-[9px] text-moonly-text-muted ml-0.5">{cg.shiShen}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-moonly-text-muted mt-2 text-center">
          本气（主气）为地支最主要能量，中气、余气为辅助能量
        </p>
      </div>

      {/* 日主与格局 */}
      <div className="moonly-card p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gold text-sm font-semibold">日主与格局</h3>
          <div className="w-10 h-10 rounded-full overflow-hidden border border-moonly-gold/20">
            <Image src="/images/ai-avatar.png" alt="AI" width={40} height={40} className="object-cover" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="pillar-cell p-3 text-center">
            <div className="text-moonly-text-muted text-xs mb-1">身强身弱</div>
            <div className="text-white font-semibold text-sm">{bodyStrength?.type || '——'}</div>
            <div className="text-moonly-text-muted text-[10px] mt-1">{bodyStrength?.score != null ? `得分 ${bodyStrength.score}` : ''}</div>
          </div>
          <div className="pillar-cell p-3 text-center">
            <div className="text-moonly-text-muted text-xs mb-1">格局</div>
            <div className="text-white font-semibold text-sm">{pattern?.name || '——'}</div>
          </div>
          <div className="pillar-cell p-3 text-center">
            <div className="text-moonly-text-muted text-xs mb-1">喜用神</div>
            <div className="text-gold font-semibold text-sm">
              {tiaoHou?.tiaoHou?.join('、') || '——'}
            </div>
          </div>
        </div>
      </div>

      {/* 五行分布 */}
      <WuXingChart count={wuXingFullCount} />

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <QuickLink href="/match" icon="💞" label="合婚分析" desc="匹配姻缘" />
        <QuickLink href="/career" icon="💼" label="事业合作" desc="合作运势" />
        <QuickLink href="/talent" icon="🌟" label="天赋分析" desc="多元智能" />
        <QuickLink href="/naming" icon="✨" label="姓名学" desc="起名改名" />
      </div>

      {/* 八字记录入口 */}
      <Link href="/ming/records" className="moonly-card p-3 flex items-center gap-3 mt-4 hover:bg-white/5 transition">
        <div className="w-10 h-10 rounded-full bg-moonly-gold/10 flex items-center justify-center text-gold">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-white font-medium text-sm">八字记录</div>
          <div className="text-moonly-text-muted text-xs">管理已保存的命盘档案</div>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-moonly-text-muted">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </Link>
    </div>
  )
}

// ===== 五行分布图 =====

function WuXingChart({ count }: { count: Record<string, number> }) {
  const total = Object.values(count).reduce((a, b) => a + b, 0) || 1
  const max = Math.max(...Object.values(count), 1)

  const items = [
    { label: '金', color: 'from-slate-300 to-slate-400', key: '金' },
    { label: '木', color: 'from-emerald-400 to-emerald-500', key: '木' },
    { label: '水', color: 'from-blue-400 to-blue-500', key: '水' },
    { label: '火', color: 'from-red-400 to-red-500', key: '火' },
    { label: '土', color: 'from-amber-400 to-amber-500', key: '土' },
  ]

  return (
    <div className="moonly-card p-4">
      <h3 className="text-gold text-sm font-semibold mb-3">五行分布</h3>
      <div className="flex items-end justify-around gap-2 h-24">
        {items.map(item => {
          const val = count[item.key] || 0
          const pct = Math.max((val / max) * 100, 8)
          return (
            <div key={item.key} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-white text-xs font-medium">{val}</span>
              <div className="w-full flex justify-center">
                <div
                  className={`w-6 rounded-t-md bg-gradient-to-t ${item.color} opacity-80`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className={`text-xs ${WUXING_COLOR[item.key]}`}>{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ===== 快捷入口卡片 =====

function QuickLink({ href, icon, label, desc }: {
  href: string
  icon: string
  label: string
  desc: string
}) {
  return (
    <Link href={href} className="moonly-card p-3 flex items-center gap-3 hover:bg-white/5 transition">
      <span className="text-xl">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-white font-medium text-sm">{label}</div>
        <div className="text-moonly-text-muted text-xs">{desc}</div>
      </div>
    </Link>
  )
}

// ===== 占位页面 =====

function DayunPlaceholder({ profile }: { profile: BaziProfile }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-moonly-gold/10 flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <path d="M12 2v20M2 12h20" />
        </svg>
      </div>
      <p className="text-moonly-text-secondary text-sm">大运分析模块开发中...</p>
      <p className="text-moonly-text-muted text-xs mt-1">将展示十年大运走势与详细解读</p>
    </div>
  )
}

function LiunianPlaceholder({ profile }: { profile: BaziProfile }) {
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

function LiuyuePlaceholder({ profile }: { profile: BaziProfile }) {
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

function LiuriPlaceholder({ profile }: { profile: BaziProfile }) {
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
