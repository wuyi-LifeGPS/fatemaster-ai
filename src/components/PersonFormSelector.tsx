'use client'

import { getLunarMonthOptions } from '@/lib/lunar'

export interface PersonFormData {
  name: string
  birthYear: number
  birthMonth: number
  birthDay: number
  birthHour: number
  birthMinute: number
  calendarType: 'solar' | 'lunar'
  lunarIsLeap: boolean
}

const yearOptions = Array.from({ length: 131 }, (_, i) => 1900 + i)
const dayOptions = Array.from({ length: 30 }, (_, i) => i + 1)
const hourOptions = Array.from({ length: 24 }, (_, i) => i)
const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5)
const pad = (n: number) => String(n).padStart(2, '0')

interface Props {
  form: PersonFormData
  setForm: (f: PersonFormData) => void
}

export default function PersonFormSelector({ form, setForm }: Props) {
  const monthOptions = form.calendarType === 'lunar'
    ? getLunarMonthOptions(form.birthYear)
    : Array.from({ length: 12 }, (_, i) => i + 1).map(m => ({ value: m, label: `${m}月`, isLeap: false }))

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">姓名（选填）</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="姓名"
          className="w-full px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">出生日期 *</label>
        <div className="flex gap-1 mb-1.5 bg-fate-100 rounded-lg p-1 w-fit">
          <button
            type="button"
            onClick={() => setForm({ ...form, calendarType: 'solar', lunarIsLeap: false })}
            className={`px-2.5 py-0.5 rounded-md text-xs transition-colors ${
              form.calendarType === 'solar'
                ? 'bg-white text-ink-800 shadow-sm'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            公历
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, calendarType: 'lunar' })}
            className={`px-2.5 py-0.5 rounded-md text-xs transition-colors ${
              form.calendarType === 'lunar'
                ? 'bg-white text-ink-800 shadow-sm'
                : 'text-ink-500 hover:text-ink-700'
            }`}
          >
            农历
          </button>
        </div>
        <div className="flex gap-2">
          <select value={form.birthYear} onChange={(e) => setForm({ ...form, birthYear: Number(e.target.value) })} className="flex-1 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white text-sm">
            {yearOptions.map(y => <option key={y} value={y}>{y}年</option>)}
          </select>
          <select
            value={`${form.lunarIsLeap ? 'leap-' : ''}${form.birthMonth}`}
            onChange={(e) => {
              const val = e.target.value
              const isLeap = val.startsWith('leap-')
              const month = Number(isLeap ? val.replace('leap-', '') : val)
              setForm({ ...form, birthMonth: month, lunarIsLeap: isLeap })
            }}
            className="w-28 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white text-sm"
          >
            {monthOptions.map(m => (
              <option key={`${m.isLeap ? 'leap-' : ''}${m.value}`} value={`${m.isLeap ? 'leap-' : ''}${m.value}`}>
                {m.label}
              </option>
            ))}
          </select>
          <select value={form.birthDay} onChange={(e) => setForm({ ...form, birthDay: Number(e.target.value) })} className="w-20 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white text-sm">
            {dayOptions.map(d => <option key={d} value={d}>{d}日</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">出生时辰</label>
        <div className="flex gap-2 items-center">
          <select value={form.birthHour} onChange={(e) => setForm({ ...form, birthHour: Number(e.target.value) })} className="w-24 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white text-sm">
            {hourOptions.map(h => <option key={h} value={h}>{pad(h)}</option>)}
          </select>
          <span className="text-ink-400">:</span>
          <select value={form.birthMinute} onChange={(e) => setForm({ ...form, birthMinute: Number(e.target.value) })} className="w-24 px-3 py-2 border border-fate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-fate-400 bg-white text-sm">
            {minuteOptions.map(m => <option key={m} value={m}>{pad(m)}</option>)}
          </select>
        </div>
        <p className="text-xs text-ink-400 mt-1">24小时制，不确定可默认 12:00</p>
      </div>
    </div>
  )
}
