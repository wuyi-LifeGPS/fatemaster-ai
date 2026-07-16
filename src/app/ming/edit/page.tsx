'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { getProfileById, updateProfile, BaziProfile } from '@/lib/bazi-profiles'
import { getSolarDaysInMonth, getLunarDaysInMonth, getLunarMonthOptions } from '@/lib/lunar'

interface WheelPickerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onConfirm: () => void
}

function BottomSheet({ open, onClose, title, children, onConfirm }: WheelPickerProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1428] rounded-t-3xl border-t border-white/10 animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <button onClick={onClose} className="text-moonly-text-muted text-sm">取消</button>
          <span className="text-white font-medium text-sm">{title}</span>
          <button onClick={onConfirm} className="text-moonly-gold text-sm font-medium">确定</button>
        </div>
        <div className="px-4 py-4 max-h-[60vh] overflow-hidden">
          {children}
        </div>
        <div className="h-6" />
      </div>
    </div>
  )
}

function WheelColumn({ options, value, onChange, label }: {
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (v: string | number) => void
  label?: string
}) {
  const itemHeight = 44
  const selectedIdx = options.findIndex(o => o.value === value)

  return (
    <div className="flex flex-col items-center flex-1">
      {label && <span className="text-moonly-text-muted text-xs mb-2">{label}</span>}
      <div className="relative h-[220px] w-full overflow-hidden">
        <div className="absolute top-[88px] left-0 right-0 h-[44px] bg-white/10 rounded-lg pointer-events-none z-10" />
        <div
          className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
          onScroll={(e) => {
            const idx = Math.round((e.target as HTMLDivElement).scrollTop / itemHeight)
            if (idx >= 0 && idx < options.length && options[idx].value !== value) {
              onChange(options[idx].value)
            }
          }}
        >
          <div className="h-[88px]" />
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`h-[44px] flex items-center justify-center snap-center text-base font-medium transition-colors ${
                opt.value === value ? 'text-white' : 'text-white/30'
              }`}
            >
              {opt.label}
            </div>
          ))}
          <div className="h-[88px]" />
        </div>
      </div>
    </div>
  )
}

function EditProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileId = searchParams.get('id')

  const [profile, setProfile] = useState<BaziProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    calendarType: 'solar' as 'solar' | 'lunar',
    lunarIsLeap: false,
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState<{ year: number; month: string | number; day: number }>({ year: 1990, month: 1, day: 1 })
  const [tempTime, setTempTime] = useState({ hour: 12, minute: 0 })

  const pad = (n: number) => String(n).padStart(2, '0')

  useEffect(() => {
    if (!profileId) {
      setNotFound(true)
      return
    }
    const p = getProfileById(profileId)
    if (!p) {
      setNotFound(true)
      return
    }
    setProfile(p)
    setFormData({
      name: p.name,
      gender: p.gender === '男' ? 'male' : 'female',
      birthYear: p.year,
      birthMonth: p.month,
      birthDay: p.day,
      birthHour: p.hour,
      birthMinute: p.minute,
      calendarType: p.isLunar ? 'lunar' : 'solar',
      lunarIsLeap: false,
    })
  }, [profileId])

  const yearOptions = Array.from({ length: 131 }, (_, i) => ({ value: 1900 + i, label: `${1900 + i}年` }))
  const monthOptions = formData.calendarType === 'lunar'
    ? getLunarMonthOptions(formData.birthYear).map(m => ({ value: m.isLeap ? `leap-${m.value}` : m.value, label: m.label }))
    : Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))

  const getDaysOptions = () => {
    const maxDay = formData.calendarType === 'lunar'
      ? getLunarDaysInMonth(formData.birthYear, formData.birthMonth, formData.lunarIsLeap)
      : getSolarDaysInMonth(formData.birthYear, formData.birthMonth)
    return Array.from({ length: maxDay }, (_, i) => ({ value: i + 1, label: `${i + 1}日` }))
  }
  const dayOptions = getDaysOptions()
  const hourOptions = Array.from({ length: 24 }, (_, i) => ({ value: i, label: pad(i) }))
  const minuteOptions = Array.from({ length: 12 }, (_, i) => ({ value: i * 5, label: pad(i * 5) }))

  const openDatePicker = () => {
    setTempDate({ year: formData.birthYear, month: formData.lunarIsLeap ? `leap-${formData.birthMonth}` : formData.birthMonth, day: formData.birthDay })
    setShowDatePicker(true)
  }

  const openTimePicker = () => {
    setTempTime({ hour: formData.birthHour, minute: formData.birthMinute })
    setShowTimePicker(true)
  }

  const confirmDate = () => {
    const isLeap = String(tempDate.month).startsWith('leap-')
    const month = isLeap ? Number(String(tempDate.month).replace('leap-', '')) : Number(tempDate.month)
    const maxDay = formData.calendarType === 'lunar'
      ? getLunarDaysInMonth(tempDate.year, month, isLeap)
      : getSolarDaysInMonth(tempDate.year, month)
    setFormData(prev => ({
      ...prev,
      birthYear: tempDate.year,
      birthMonth: month,
      lunarIsLeap: isLeap,
      birthDay: Math.min(tempDate.day, maxDay),
    }))
    setShowDatePicker(false)
  }

  const confirmTime = () => {
    setFormData(prev => ({ ...prev, birthHour: tempTime.hour, birthMinute: tempTime.minute }))
    setShowTimePicker(false)
  }

  const handleSave = async () => {
    if (!profileId) return
    setLoading(true)
    try {
      const hourZhiLabels = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
      const hourZhiIdx = Math.floor(((formData.birthHour + 1) % 24) / 2) % 12
      const birthTimeLabel = hourZhiLabels[hourZhiIdx] + '时'

      updateProfile(profileId, {
        name: formData.name || '未命名',
        gender: formData.gender === 'male' ? '男' : '女',
        year: formData.birthYear,
        month: formData.birthMonth,
        day: formData.birthDay,
        hour: formData.birthHour,
        minute: formData.birthMinute,
        isLunar: formData.calendarType === 'lunar',
        birthTimeLabel,
      })

      router.push('/ming')
    } catch (error) {
      console.error('Error:', error)
      alert('保存出错，请重试')
    } finally {
      setLoading(false)
    }
  }

  const dateStr = `${formData.birthYear}/${pad(formData.birthMonth)}/${pad(formData.birthDay)}`
  const timeStr = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

  if (notFound) {
    return (
      <div className="min-h-screen moonly-bg moonly-content flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h2 className="text-white font-semibold mb-2">档案不存在</h2>
        <p className="text-white/40 text-sm mb-6">该八字档案已被删除或不存在</p>
        <Link href="/ming" className="btn-gold px-6 py-2.5 text-sm font-semibold">返回命盘</Link>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen moonly-bg moonly-content flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content animate-fade-in">
      <header className="sticky top-0 z-40 bg-[#0f0b1a]/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center px-4 h-12 relative">
          <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition absolute left-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/70">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <h1 className="flex-1 text-center text-lg font-semibold text-gold-gradient">编辑档案</h1>
        </div>
      </header>

      <div className="px-4 py-6 pb-32 space-y-6 max-w-lg mx-auto">
        <div className="space-y-2">
          <label className="text-sm text-moonly-text-secondary font-medium">姓名</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="请输入姓名"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-text-muted focus:outline-none focus:border-moonly-gold/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-moonly-text-secondary font-medium">性别</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData(prev => ({ ...prev, gender: 'male' }))}
              className={`py-3.5 rounded-xl text-sm font-medium transition-all border ${
                formData.gender === 'male'
                  ? 'bg-white/15 text-white border-white/20'
                  : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              男性
            </button>
            <button
              onClick={() => setFormData(prev => ({ ...prev, gender: 'female' }))}
              className={`py-3.5 rounded-xl text-sm font-medium transition-all border ${
                formData.gender === 'female'
                  ? 'bg-white/15 text-white border-white/20'
                  : 'bg-transparent text-white/40 border-white/10 hover:border-white/20'
              }`}
            >
              女性
            </button>
          </div>
        </div>

        <div className="flex gap-2 w-fit">
          <button
            onClick={() => setFormData(prev => ({ ...prev, calendarType: 'solar', lunarIsLeap: false }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              formData.calendarType === 'solar'
                ? 'bg-black/30 text-white'
                : 'bg-black/15 text-white/40 hover:text-white/60'
            }`}
          >
            公历
          </button>
          <button
            onClick={() => setFormData(prev => ({ ...prev, calendarType: 'lunar' }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              formData.calendarType === 'lunar'
                ? 'bg-black/30 text-white'
                : 'bg-black/15 text-white/40 hover:text-white/60'
            }`}
          >
            农历
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={openDatePicker}
            className="py-4 px-4 rounded-xl bg-black/15 border border-white/10 text-left hover:border-white/20 transition-all"
          >
            <div className="text-xs text-moonly-text-muted mb-1">出生日期</div>
            <div className="text-white font-medium text-sm">{dateStr}</div>
          </button>
          <button
            onClick={openTimePicker}
            className="py-4 px-4 rounded-xl bg-black/15 border border-white/10 text-left hover:border-white/20 transition-all"
          >
            <div className="text-xs text-moonly-text-muted mb-1">出生时间</div>
            <div className="text-white font-medium text-sm">{timeStr}</div>
          </button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0f0b1a] via-[#0f0b1a]/95 to-transparent pt-10 pb-6 px-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="block w-full max-w-sm mx-auto btn-gold py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-[#1a1428]/30 border-t-[#1a1428] animate-spin" />
              保存中...
            </span>
          ) : (
            '保存'
          )}
        </button>
      </div>

      <BottomSheet open={showDatePicker} onClose={() => setShowDatePicker(false)} title="选择日期" onConfirm={confirmDate}>
        <div className="flex gap-2">
          <WheelColumn label="年" options={yearOptions} value={tempDate.year} onChange={(v) => setTempDate(prev => ({ ...prev, year: Number(v) }))} />
          <WheelColumn label="月" options={monthOptions} value={tempDate.month} onChange={(v) => setTempDate(prev => ({ ...prev, month: v }))} />
          <WheelColumn label="日" options={dayOptions} value={Math.min(tempDate.day, dayOptions.length)} onChange={(v) => setTempDate(prev => ({ ...prev, day: Number(v) }))} />
        </div>
      </BottomSheet>

      <BottomSheet open={showTimePicker} onClose={() => setShowTimePicker(false)} title="选择时间" onConfirm={confirmTime}>
        <div className="flex gap-2 justify-center">
          <WheelColumn label="时" options={hourOptions} value={tempTime.hour} onChange={(v) => setTempTime(prev => ({ ...prev, hour: Number(v) }))} />
          <WheelColumn label="分" options={minuteOptions} value={tempTime.minute} onChange={(v) => setTempTime(prev => ({ ...prev, minute: Number(v) }))} />
        </div>
      </BottomSheet>
    </div>
  )
}

export default function EditProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen moonly-bg moonly-content flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-moonly-gold/30 border-t-moonly-gold animate-spin" />
      </div>
    }>
      <EditProfileContent />
    </Suspense>
  )
}
