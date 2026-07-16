'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProfiles, BaziProfile } from '@/lib/bazi-profiles'
import { calculateBazi, getWuXing } from '@/lib/bazi'
import { lunarToSolar } from '@/lib/lunar'

// ===== 工具函数 =====

import { getAllHistoryRecords, HistoryRecord } from '@/lib/history'

const WUXING_COLOR: Record<string, string> = {
  '木': 'text-emerald-400',
  '火': 'text-red-400',
  '土': 'text-amber-400',
  '金': 'text-slate-300',
  '水': 'text-blue-400',
}

const WUXING_BG: Record<string, string> = {
  '木': 'bg-emerald-500/10',
  '火': 'bg-red-500/10',
  '土': 'bg-[#c9a96e]/10',
  '金': 'bg-slate-400/10',
  '水': 'bg-blue-500/10',
}

function getAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear
}

function getZodiacIcon(year: number): string {
  const animals = ['猴', '鸡', '狗', '猪', '鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊']
  return animals[year % 12]
}

function getZodiacEmoji(year: number): string {
  const emojis = ['🐵', '🐔', '🐶', '🐷', '🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑']
  return emojis[year % 12]
}

function getHourZhiLabel(hour: number): string {
  const labels = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  const idx = Math.floor(((hour + 1) % 24) / 2) % 12
  return labels[idx]
}

function getHourRange(hour: number): string {
  const ranges = ['23~1', '1~3', '3~5', '5~7', '7~9', '9~11', '11~13', '13~15', '15~17', '17~19', '19~21', '21~23']
  const idx = Math.floor(((hour + 1) % 24) / 2) % 12
  return ranges[idx]
}

interface BaziDisplay {
  profile: BaziProfile
  pillars: { name: string; gan: string; zhi: string }[] | null
  age: number
  zodiac: string
  zodiacEmoji: string
}

// ===== 组件 =====

export default function RecordsPage() {
  const router = useRouter()
  const [profiles, setProfiles] = useState<BaziProfile[]>([])
  const [baziDisplays, setBaziDisplays] = useState<BaziDisplay[]>([])
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([])
  const [activeTab, setActiveTab] = useState<'profiles' | 'history'>('profiles')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const list = getProfiles()
    setProfiles(list)
    setHistoryRecords(getAllHistoryRecords())

    // 计算每个档案的八字
    const displays: BaziDisplay[] = list.map((profile) => {
      let year = profile.year
      let month = profile.month
      let day = profile.day

      // 农历转公历
      if (profile.isLunar) {
        const solar = lunarToSolar(profile.year, profile.month, profile.day, false)
        if (solar) {
          year = solar.year
          month = solar.month
          day = solar.day
        }
      }

      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const birthTime = `${String(profile.hour).padStart(2, '0')}:00`

      let pillars = null
      try {
        const data = calculateBazi(birthDate, birthTime)
        pillars = data.pillars
      } catch (e) {
        console.error('八字计算失败:', e)
      }

      return {
        profile,
        pillars,
        age: getAge(profile.year),
        zodiac: getZodiacIcon(profile.year),
        zodiacEmoji: getZodiacEmoji(profile.year),
      }
    })

    setBaziDisplays(displays)
    setLoading(false)
  }, [])

  const handleSelectProfile = (profileId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bazi_selected_profile', profileId)
    }
    router.push('/ming')
  }

  const handleHistoryItemClick = (record: HistoryRecord) => {
    if (record.type === 'bazi') {
      router.push('/ming')
    } else if (record.type === 'talent') {
      router.push('/talent')
    } else if (record.type === 'match') {
      router.push('/match')
    } else if (record.type === 'career') {
      router.push('/career')
    } else if (record.type === 'naming') {
      router.push('/naming')
    }
  }

  const getHistoryTypeLabel = (type: string) => {
    const map: Record<string, string> = {
      bazi: '八字分析',
      talent: '天赋分析',
      match: '合婚分析',
      career: '事业分析',
      naming: '起名分析',
    }
    return map[type] || type
  }

  const getHistoryTypeIcon = (type: string) => {
    const map: Record<string, string> = {
      bazi: '🔮',
      talent: '🎯',
      match: '💕',
      career: '💼',
      naming: '✍️',
    }
    return map[type] || '📝'
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content animate-fade-in">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-[#0f0b1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center px-4 h-12 relative">
          <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition absolute left-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/70">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gold-gradient pr-0">八字记录</h1>
        </div>
      </header>

      {/* 内容 */}
      <div className="moonly-content px-4 py-4 pb-28">
        {/* 标签切换 */}
        <div className="flex gap-1 mb-4 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setActiveTab('profiles')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'profiles'
                ? 'bg-moonly-gold text-moonly-bg font-semibold'
                : 'text-moonly-text-secondary hover:text-white'
            }`}
          >
            八字档案 ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
              activeTab === 'history'
                ? 'bg-moonly-gold text-moonly-bg font-semibold'
                : 'text-moonly-text-secondary hover:text-white'
            }`}
          >
            查询记录 ({historyRecords.length})
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin mb-4" />
            <p className="text-moonly-text-secondary text-sm">加载中...</p>
          </div>
        ) : activeTab === 'profiles' ? (
          baziDisplays.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {baziDisplays.map((display) => (
                <ProfileCard
                  key={display.profile.id}
                  display={display}
                  onSelect={() => handleSelectProfile(display.profile.id)}
                />
              ))}
            </div>
          )
        ) : (
          historyRecords.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-4xl mb-3">📝</div>
              <p className="text-moonly-text-secondary text-sm">暂无查询记录</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyRecords.map((record) => (
                <button
                  key={record.id}
                  onClick={() => handleHistoryItemClick(record)}
                  className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99] info-card-black"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                      {getHistoryTypeIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm">{getHistoryTypeLabel(record.type)}</span>
                        <span className="text-moonly-text-muted text-xs">{record.dateStr}</span>
                      </div>
                      <div className="text-moonly-text-secondary text-sm mt-0.5 truncate">
                        {record.title || '未命名'}
                      </div>
                      {record.resultSummary && (
                        <div className="text-moonly-text-muted text-xs mt-1 truncate">
                          {record.resultSummary}
                        </div>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )
        )}
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0f0b1a] via-[#0f0b1a]/95 to-transparent pt-8 pb-6 px-4">
        <Link
          href="/bazi"
          className="block w-full max-w-sm mx-auto btn-gold py-3.5 text-center text-sm font-semibold rounded-2xl"
        >
          + 新增八字
        </Link>
      </div>
    </div>
  )
}

// ===== 空状态 =====

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <p className="text-moonly-text-secondary text-sm mb-1">暂无八字记录</p>
      <p className="text-moonly-text-muted text-xs">点击下方添加</p>
    </div>
  )
}

// ===== 档案卡片 =====

function ProfileCard({ display, onSelect }: { display: BaziDisplay; onSelect: () => void }) {
  const { profile, pillars, age, zodiac, zodiacEmoji } = display
  const hourLabel = getHourZhiLabel(profile.hour)
  const hourRange = getHourRange(profile.hour)

  const genderColor = profile.gender === '男'
    ? 'bg-blue-500/20 text-blue-300'
    : 'bg-pink-500/20 text-pink-300'

  const dateType = profile.isLunar ? '农历' : '阳历'

  return (
    <button
      onClick={onSelect}
      className="w-full text-left rounded-2xl p-4 transition-all hover:scale-[1.01] active:scale-[0.99] info-card-black"
    >
      <div className="flex items-start gap-3">
        {/* 生肖头像 */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0"
          style={{
            background: 'linear-gradient(135deg, #c9a96e 0%, #a08050 100%)',
          }}
        >
          <span className="text-white">{zodiacEmoji}</span>
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          {/* 第一行：名字 + 年龄 + 性别 */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-white text-sm">{profile.name}</span>
            <span className="text-white/50 text-xs">· {age}岁</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${genderColor}`}>
              {profile.gender}
            </span>
          </div>

          {/* 第二行：出生日期 + 时辰 */}
          <div className="text-xs text-white/50 mb-2">
            {dateType}{profile.year}年{profile.month}月{profile.day}日 {hourLabel}时 {hourRange}
          </div>

          {/* 第三行：八字四柱 */}
          {pillars && (
            <div className="flex items-center gap-3">
              {/* 天干行 */}
              <div className="flex gap-1">
                {pillars.map((p) => {
                  const wx = getWuXing(p.gan)
                  return (
                    <span
                      key={`gan-${p.name}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold ${WUXING_BG[wx]} ${WUXING_COLOR[wx]}`}
                    >
                      {p.gan}
                    </span>
                  )
                })}
              </div>
              <div className="w-px h-4 bg-white/20" />
              {/* 地支行 */}
              <div className="flex gap-1">
                {pillars.map((p) => {
                  const wx = getWuXing(p.zhi)
                  return (
                    <span
                      key={`zhi-${p.name}`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold ${WUXING_BG[wx]} ${WUXING_COLOR[wx]}`}
                    >
                      {p.zhi}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* 右侧箭头 */}
        <div className="flex items-center self-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </button>
  )
}
