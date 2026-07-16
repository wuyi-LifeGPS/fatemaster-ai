'use client'

import { useState, useEffect, useMemo, memo } from 'react'

const COUNTDOWN_EVENTS = [
  { name: '春节', month: 1, day: 1, type: 'lunar' },
  { name: '元宵节', month: 1, day: 15, type: 'lunar' },
  { name: '端午节', month: 5, day: 5, type: 'lunar' },
  { name: '七夕', month: 7, day: 7, type: 'lunar' },
  { name: '中秋节', month: 8, day: 15, type: 'lunar' },
  { name: '重阳节', month: 9, day: 9, type: 'lunar' },
  { name: '冬至', month: 12, day: 21, type: 'solar' },
  { name: '元旦', month: 1, day: 1, type: 'solar' },
  { name: '情人节', month: 2, day: 14, type: 'solar' },
  { name: '劳动节', month: 5, day: 1, type: 'solar' },
  { name: '国庆节', month: 10, day: 1, type: 'solar' },
  { name: '圣诞节', month: 12, day: 25, type: 'solar' },
]

// 简化农历日期判断（仅用于展示，不准确）
function getNextLunarDate(month: number, day: number): Date {
  // 简化处理：假设农历日期在公历中约晚1个月
  const now = new Date()
  let targetYear = now.getFullYear()
  const targetMonth = month + 1 // 粗略偏移
  const targetDay = day
  let target = new Date(targetYear, targetMonth - 1, targetDay)
  if (target < now) {
    target = new Date(targetYear + 1, targetMonth - 1, targetDay)
  }
  return target
}

function getNextSolarDate(month: number, day: number): Date {
  const now = new Date()
  let targetYear = now.getFullYear()
  let target = new Date(targetYear, month - 1, day)
  if (target < now) {
    target = new Date(targetYear + 1, month - 1, day)
  }
  return target
}

function getNextEvent(): { name: string; date: Date; type: string } | null {
  const now = new Date()
  let nextEvent: { name: string; date: Date; type: string } | null = null
  let minDiff = Infinity

  COUNTDOWN_EVENTS.forEach((event) => {
    const date = event.type === 'lunar'
      ? getNextLunarDate(event.month, event.day)
      : getNextSolarDate(event.month, event.day)
    const diff = date.getTime() - now.getTime()
    if (diff > 0 && diff < minDiff) {
      minDiff = diff
      nextEvent = { name: event.name, date, type: event.type }
    }
  })

  return nextEvent
}

function formatTimeDiff(targetDate: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const diff = targetDate.getTime() - new Date().getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

function CountdownWidget() {
  const [now, setNow] = useState(new Date())
  const event = useMemo(() => getNextEvent(), [])

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!event) return null

  const timeLeft = formatTimeDiff(event.date)

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⏳</span>
        <h3 className="text-gold text-sm font-semibold">倒计时</h3>
      </div>
      <div className="text-center">
        <div className="text-moonly-muted text-xs mb-2">
          距离{event.name}还有
        </div>
        <div className="flex justify-center gap-3 mb-3">
          {[
            { value: timeLeft.days, label: '天' },
            { value: timeLeft.hours, label: '时' },
            { value: timeLeft.minutes, label: '分' },
            { value: timeLeft.seconds, label: '秒' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white text-lg font-bold">
                {String(item.value).padStart(2, '0')}
              </div>
              <span className="text-moonly-muted text-[10px] mt-1">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="text-moonly-muted text-[10px]">
          {event.type === 'lunar' ? '农历' : '公历'} {event.date.toLocaleDateString('zh-CN')}
        </div>
      </div>
    </div>
  )
}

export default memo(CountdownWidget)
