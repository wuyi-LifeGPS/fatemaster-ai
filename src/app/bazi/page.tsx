'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { analyzeBazi, getAiAnalysis } from '@/lib/analysis'
import { addHistory, getHistoryByType, formatHistoryTime, type HistoryRecord } from '@/lib/history'
import { lunarToSolar, getSolarDaysInMonth, getLunarDaysInMonth, getLunarMonthOptions } from '@/lib/lunar'
import { showToast } from '@/components/Toast'
import useBeforeUnload from '@/hooks/useBeforeUnload'
import { addProfile } from '@/lib/bazi-profiles'
import useKeyboard from '@/hooks/useKeyboard'
import Celebration from '@/components/Celebration'

interface BaziResult {
  pillars: { name: string; gan: string; zhi: string }[]
  dayMaster: string
  wuXingCount: Record<string, number>
  wuXingFullCount: Record<string, number>
  tenGods: Record<string, string>
  yinYang: string
  wuXing: string
  aiAnalysis: string
  cangGanDetail?: { name: string; zhi: string; cangGan: { gan: string; qi: string; wuXing: string; shiShen: string }[] }[]
  bodyStrength?: any
  pattern?: any
  tiaoHou?: any
  _pendingAi?: boolean
}

// ===== 底部滚轮选择器组件 =====

interface WheelPickerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onConfirm: () => void
}

function BottomSheet({ open, onClose, title, children, onConfirm }: WheelPickerProps) {
  useKeyboard({ onEscape: onClose, onEnter: onConfirm, enabled: open })
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1428] rounded-t-3xl border-t border-white/10 animate-fade-in">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <button onClick={onClose} className="text-moonly-muted text-sm">取消</button>
          <span className="text-white font-medium text-sm">{title}</span>
          <button onClick={onConfirm} className="text-[#c9a96e] text-sm font-medium">确定</button>
        </div>
        {/* 内容 */}
        <div className="px-4 py-4 max-h-[60vh] overflow-hidden">
          {children}
        </div>
        {/* 底部安全区 */}
        <div className="h-6" />
      </div>
    </div>
  )
}

// 单列滚轮
function WheelColumn({ options, value, onChange, label }: {
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (v: string | number) => void
  label?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const itemHeight = 44
  const selectedIdx = options.findIndex(o => o.value === value)

  useEffect(() => {
    if (scrollRef.current && selectedIdx >= 0) {
      scrollRef.current.scrollTop = selectedIdx * itemHeight
    }
  }, [selectedIdx])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollTop / itemHeight)
    if (idx >= 0 && idx < options.length && options[idx].value !== value) {
      onChange(options[idx].value)
    }
  }, [options, value, onChange])

  return (
    <div className="flex flex-col items-center flex-1">
      {label && <span className="text-moonly-muted text-xs mb-2">{label}</span>}
      <div className="relative h-[220px] w-full overflow-hidden">
        {/* 选中高亮条 */}
        <div className="absolute top-[88px] left-0 right-0 h-[44px] bg-white/10 rounded-lg pointer-events-none z-10" />
        <div
          ref={scrollRef}
          className="h-full overflow-y-auto scrollbar-hide snap-y snap-mandatory"
          onScroll={handleScroll}
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* 顶部padding */}
          <div className="h-[88px]" />
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`h-[44px] flex items-center justify-center snap-center text-base font-medium transition-colors ${
                opt.value === value ? 'text-white' : 'text-white/30'
              }`}
              onClick={() => {
                if (scrollRef.current) {
                  const idx = options.findIndex(o => o.value === opt.value)
                  scrollRef.current.scrollTop = idx * itemHeight
                }
              }}
            >
              {opt.label}
            </div>
          ))}
          {/* 底部padding */}
          <div className="h-[88px]" />
        </div>
      </div>
    </div>
  )
}

// ===== 主页面 =====

export default function BaziPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [result, setResult] = useState<BaziResult | null>(null)
  const [solarBirthDate, setSolarBirthDate] = useState<string>('')

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    gender: 'male' as 'male' | 'female',
    birthYear: 1990,
    birthMonth: 1,
    birthDay: 1,
    birthHour: 12,
    birthMinute: 0,
    birthPlace: '',
    note: '',
    calendarType: 'solar' as 'solar' | 'lunar',
    lunarIsLeap: false,
    unknownTime: false,
  })

  useBeforeUnload(formData.name !== '' || formData.birthYear !== 1990)

  // 选择器状态
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [tempDate, setTempDate] = useState<{ year: number; month: string | number; day: number }>({ year: 1990, month: 1, day: 1 })
  const [tempTime, setTempTime] = useState({ hour: 12, minute: 0 })

  const pad = (n: number) => String(n).padStart(2, '0')

  // 计算日期选择器的选项
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

  // 日期选择器打开时同步temp
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

  const handleSubmit = async () => {
    // 表单验证
    if (!formData.name.trim()) {
      showToast('请输入姓名', 'error')
      return
    }
    if (formData.birthYear < 1900 || formData.birthYear > 2030) {
      showToast('请选择有效的出生年份', 'error')
      return
    }

    setLoading(true)

    try {
      // 农历转公历（如需要）
      let solarYear = formData.birthYear
      let solarMonth = formData.birthMonth
      let solarDay = formData.birthDay
      if (formData.calendarType === 'lunar') {
        const solar = lunarToSolar(formData.birthYear, formData.birthMonth, formData.birthDay, formData.lunarIsLeap)
        if (!solar) {
          showToast('农历日期转换失败，请检查日期是否有效（如闰月是否存在）', 'error')
          setLoading(false)
          return
        }
        solarYear = solar.year
        solarMonth = solar.month
        solarDay = solar.day
      }

      const birthDate = `${solarYear}-${pad(solarMonth)}-${pad(solarDay)}`
      setSolarBirthDate(birthDate)
      const birthTime = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

      // 前端直接计算八字 + 生成基础分析
      const result = analyzeBazi(
        birthDate,
        birthTime,
        formData.name,
        formData.gender,
        formData.note,
      )

      setResult(result)

      // 保存查询记录
      const summary = `${result.dayMaster}日主 · ${result.yinYang}性${result.wuXing}命 · ${result.bodyStrength?.strength || '未知'}`
      addHistory('bazi', formData.name || `八字分析 ${birthDate}`, formData, summary)

      // 异步获取 AI 深度分析
      const aiAnalysis = await getAiAnalysis(
        {
          ...result,
          combinedGod: (result as any).combinedGod,
          bodyStrength: result.bodyStrength,
          pattern: result.pattern,
          cangGanDetail: result.cangGanDetail,
        },
        formData.name,
        formData.gender,
        'bazi',
        formData.note,
      )

      if (aiAnalysis) {
        setResult((prev) => prev ? { ...prev, aiAnalysis } : null)
      }

      // 自动保存到命盘档案
      const hourZhiLabels = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
      const hourZhiIdx = Math.floor(((formData.birthHour + 1) % 24) / 2) % 12
      const birthTimeLabel = hourZhiLabels[hourZhiIdx] + '时'
      const newProfile = addProfile({
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

      // 设为默认选中并跳转
      if (typeof window !== 'undefined') {
        localStorage.setItem('bazi_selected_profile', newProfile.id)
      }
      setShowCelebration(true)
      setTimeout(() => {
        router.push('/ming')
      }, 1500)
    } catch (error) {
      console.error('Error:', error)
      showToast('分析出错，请重试', 'error')
    } finally {
      setLoading(false)
    }
  }

  const dateStr = `${formData.birthYear}/${pad(formData.birthMonth)}/${pad(formData.birthDay)}`
  const timeStr = `${pad(formData.birthHour)}:${pad(formData.birthMinute)}`

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
          <h1 className="flex-1 text-center text-lg font-semibold text-gold-gradient pr-0">编辑出生数据</h1>
        </div>
      </header>

      {/* 输入表单 */}
      <div className="px-4 py-6 pb-32 space-y-6 max-w-lg mx-auto"
      >
        {/* 性别选择 */}
        <div className="space-y-2"
        >
          <label className="text-sm text-moonly-secondary font-medium">性别</label>
          <div className="grid grid-cols-2 gap-3"
          >
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

        {/* 姓名（可选） */}
        <div className="space-y-2"
        >
          <label className="text-sm text-moonly-secondary font-medium">姓名（选填）</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="请输入姓名"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-muted focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>

        {/* 出生地点 */}
        <div className="space-y-2"
        >
          <label className="text-sm text-moonly-secondary font-medium">出生地点</label>
          <input
            type="text"
            value={formData.birthPlace}
            onChange={(e) => setFormData(prev => ({ ...prev, birthPlace: e.target.value }))}
            placeholder="请选择出生地点"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-muted focus:outline-none focus:border-[#c9a96e]/30"
          />
        </div>

        {/* 日历类型切换 */}
        <div className="flex gap-2 w-fit"
        >
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

        {/* 日期和时间 */}
        <div className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={openDatePicker}
            className="py-4 px-4 rounded-xl bg-black/15 border border-white/10 text-left hover:border-white/20 transition-all"
          >
            <div className="text-xs text-moonly-muted mb-1">出生日期</div>
            <div className="text-white font-medium text-sm">{dateStr}</div>
          </button>
          <button
            onClick={openTimePicker}
            className="py-4 px-4 rounded-xl bg-black/15 border border-white/10 text-left hover:border-white/20 transition-all"
          >
            <div className="text-xs text-moonly-muted mb-1">出生时间</div>
            <div className="text-white font-medium text-sm">{timeStr}</div>
          </button>
        </div>

        {/* 我不知道确切时间 */}
        <div className="flex items-center justify-end"
        >
          <label className="flex items-center gap-2 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
              formData.unknownTime
                ? 'bg-[#c9a96e] border-[#c9a96e]'
                : 'border-white/30'
            }`}
            >
              {formData.unknownTime && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1428" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <input
              type="checkbox"
              checked={formData.unknownTime}
              onChange={(e) => {
                const checked = e.target.checked
                setFormData(prev => ({ ...prev, unknownTime: checked }))
                if (checked) {
                  setFormData(prev => ({ ...prev, birthHour: 12, birthMinute: 0 }))
                }
              }}
              className="sr-only"
            />
            <span className="text-xs text-white/50">我不知道确切时间</span>
          </label>
        </div>
      </div>

      {/* 底部完成按钮 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#0f0b1a] via-[#0f0b1a]/95 to-transparent pt-10 pb-6 px-4"
      >
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="block w-full max-w-sm mx-auto btn-gold py-3.5 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-[#1a1428]/30 border-t-[#1a1428] animate-spin" />
              计算中...
            </span>
          ) : (
            '完成'
          )}
        </button>
      </div>

      {/* 日期选择器底部弹窗 */}
      <BottomSheet
        open={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        title="选择日期"
        onConfirm={confirmDate}
      >
        <div className="flex gap-2"
        >
          <WheelColumn
            label="年"
            options={yearOptions}
            value={tempDate.year}
            onChange={(v) => setTempDate(prev => ({ ...prev, year: Number(v) }))}
          />
          <WheelColumn
            label="月"
            options={monthOptions}
            value={tempDate.month}
            onChange={(v) => setTempDate(prev => ({ ...prev, month: v }))}
          />
          <WheelColumn
            label="日"
            options={dayOptions}
            value={Math.min(tempDate.day, dayOptions.length)}
            onChange={(v) => setTempDate(prev => ({ ...prev, day: Number(v) }))}
          />
        </div>
      </BottomSheet>

      {/* 时间选择器底部弹窗 */}
      <BottomSheet
        open={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        title="选择时间"
        onConfirm={confirmTime}
      >
        <div className="flex gap-2 justify-center"
        >
          <WheelColumn
            label="时"
            options={hourOptions}
            value={tempTime.hour}
            onChange={(v) => setTempTime(prev => ({ ...prev, hour: Number(v) }))}
          />
          <WheelColumn
            label="分"
            options={minuteOptions}
            value={tempTime.minute}
            onChange={(v) => setTempTime(prev => ({ ...prev, minute: Number(v) }))}
          />
        </div>
      </BottomSheet>

      <Celebration show={showCelebration} />
    </div>
  )
}
