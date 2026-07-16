'use client'

import { useState, useEffect, memo } from 'react'

// 简化的农历转换（使用近似算法）
const LUNAR_MONTH_NAMES = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊']
const LUNAR_DAY_NAMES = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]
const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 获取当前时辰
function getCurrentShiChen(): string {
  const hour = new Date().getHours()
  const zhiIndex = Math.floor((hour + 1) / 2) % 12
  return ZHI[zhiIndex] + '时'
}

// 简化的年月日干支计算（基于1900年基准）
function getGanZhi(date: Date): { yearGanZhi: string; monthGanZhi: string; dayGanZhi: string } {
  const baseDate = new Date(1900, 0, 31) // 1900年正月初一 ≈ 1900-01-31
  const daysDiff = Math.floor((date.getTime() - baseDate.getTime()) / 86400000)

  const dayGan = GAN[daysDiff % 10]
  const dayZhi = ZHI[daysDiff % 12]

  const year = date.getFullYear()
  const yearGan = GAN[(year - 4) % 10]
  const yearZhi = ZHI[(year - 4) % 12]

  // 月柱简化计算
  const month = date.getMonth() + 1
  const monthZhi = ZHI[(month + 1) % 12]
  const monthGanIndex = ((year - 4) % 5) * 2 + ((month + 1) % 12) % 10
  const monthGan = GAN[monthGanIndex % 10]

  return {
    yearGanZhi: yearGan + yearZhi,
    monthGanZhi: monthGan + monthZhi,
    dayGanZhi: dayGan + dayZhi,
  }
}

function LunarDateDisplay() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000) // 每分钟更新
    return () => clearInterval(timer)
  }, [])

  const gz = getGanZhi(now)
  const shiChen = getCurrentShiChen()

  return (
    <div className="moonly-card p-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <div>
            <div className="text-white text-xs font-medium">
              {now.getFullYear()}年{now.getMonth() + 1}月{now.getDate()}日
            </div>
            <div className="text-moonly-muted text-[10px]">
              {gz.yearGanZhi}年 {gz.monthGanZhi}月 {gz.dayGanZhi}日 · {shiChen}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gold text-xs font-medium">
            {now.getHours().toString().padStart(2, '0')}:{now.getMinutes().toString().padStart(2, '0')}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LunarDateDisplay)
