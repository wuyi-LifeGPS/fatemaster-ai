'use client'

import { useMemo } from 'react'

// 24节气（简化版，固定日期）
const JIE_QI = [
  { name: '立春', month: 2, day: 4, desc: '万物复苏，阳气始生' },
  { name: '雨水', month: 2, day: 19, desc: '冰雪融化，降雨增多' },
  { name: '惊蛰', month: 3, day: 5, desc: '春雷始鸣，惊醒蛰虫' },
  { name: '春分', month: 3, day: 20, desc: '昼夜平分，阴阳平衡' },
  { name: '清明', month: 4, day: 5, desc: '天清地明，踏青祭祖' },
  { name: '谷雨', month: 4, day: 20, desc: '雨生百谷，播种时节' },
  { name: '立夏', month: 5, day: 5, desc: '夏季开始，万物繁茂' },
  { name: '小满', month: 5, day: 21, desc: '麦粒饱满，尚未成熟' },
  { name: '芒种', month: 6, day: 6, desc: '麦收稻种，农忙时节' },
  { name: '夏至', month: 6, day: 21, desc: '白昼最长，阳极阴生' },
  { name: '小暑', month: 7, day: 7, desc: '天气炎热，尚未极热' },
  { name: '大暑', month: 7, day: 22, desc: '一年最热，防暑降温' },
  { name: '立秋', month: 8, day: 7, desc: '秋季开始，暑去凉来' },
  { name: '处暑', month: 8, day: 23, desc: '暑气渐消，天气转凉' },
  { name: '白露', month: 9, day: 7, desc: '天气转凉，露水凝结' },
  { name: '秋分', month: 9, day: 23, desc: '昼夜平分，阴阳平衡' },
  { name: '寒露', month: 10, day: 8, desc: '气温下降，露水更凉' },
  { name: '霜降', month: 10, day: 23, desc: '天气渐冷，初霜出现' },
  { name: '立冬', month: 11, day: 7, desc: '冬季开始，万物收藏' },
  { name: '小雪', month: 11, day: 22, desc: '气温下降，开始降雪' },
  { name: '大雪', month: 12, day: 7, desc: '降雪增多，地面积雪' },
  { name: '冬至', month: 12, day: 21, desc: '白昼最短，阴极阳生' },
  { name: '小寒', month: 1, day: 5, desc: '天气寒冷，尚未极冷' },
  { name: '大寒', month: 1, day: 20, desc: '一年最冷，准备过年' },
]

function getCurrentJieQi(date: Date): { current: typeof JIE_QI[0]; next: typeof JIE_QI[0]; daysUntil: number } {
  const year = date.getFullYear()
  const currentDayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / 86400000)

  // 计算每个节气的年内天数
  const jieQiDays = JIE_QI.map((jq) => {
    const jqDate = new Date(year, jq.month - 1, jq.day)
    const dayOfYear = Math.floor((jqDate.getTime() - new Date(year, 0, 0).getTime()) / 86400000)
    return { ...jq, dayOfYear }
  })

  // 找到当前节气
  let currentIndex = jieQiDays.length - 1
  for (let i = 0; i < jieQiDays.length; i++) {
    if (currentDayOfYear < jieQiDays[i].dayOfYear) {
      currentIndex = i - 1
      break
    }
  }
  if (currentIndex < 0) currentIndex = jieQiDays.length - 1

  const nextIndex = (currentIndex + 1) % jieQiDays.length
  const daysUntil = jieQiDays[nextIndex].dayOfYear > currentDayOfYear
    ? jieQiDays[nextIndex].dayOfYear - currentDayOfYear
    : 365 - currentDayOfYear + jieQiDays[nextIndex].dayOfYear

  return {
    current: jieQiDays[currentIndex],
    next: jieQiDays[nextIndex],
    daysUntil,
  }
}

export default function SolarTermDisplay() {
  const { current, next, daysUntil } = useMemo(() => getCurrentJieQi(new Date()), [])

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-gold text-sm font-semibold">节气</h3>
        <span className="text-[10px] text-moonly-muted">距{next.name}还有 {daysUntil} 天</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl">
          🌾
        </div>
        <div>
          <div className="text-white text-sm font-medium">{current.name}</div>
          <div className="text-moonly-muted text-xs">{current.desc}</div>
        </div>
      </div>
    </div>
  )
}
