// lib/lunar.ts — 农历公历转换工具
import { Lunar, Solar } from 'lunar-javascript'

/**
 * 农历日期 → 公历日期
 * @param lunarYear 农历年（如 1990）
 * @param lunarMonth 农历月（1-12）
 * @param lunarDay 农历日（1-30）
 * @param isLeap 是否闰月（默认 false）
 */
export function lunarToSolar(lunarYear: number, lunarMonth: number, lunarDay: number, isLeap = false): { year: number; month: number; day: number } | null {
  try {
    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay, isLeap)
    const solar = lunar.getSolar()
    return {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
    }
  } catch {
    return null
  }
}

/**
 * 公历日期 → 农历日期（用于回显）
 */
export function solarToLunar(solarYear: number, solarMonth: number, solarDay: number): { year: number; month: number; day: number; isLeap: boolean; monthStr: string; dayStr: string } | null {
  try {
    const solar = Solar.fromYmd(solarYear, solarMonth, solarDay)
    const lunar = solar.getLunar()
    return {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      isLeap: lunar.getMonth() < 0,
      monthStr: lunar.getMonthInChinese(),
      dayStr: lunar.getDayInChinese(),
    }
  } catch {
    return null
  }
}

/**
 * 获取某农历年是否有闰月，以及闰哪个月
 */
export function getLeapMonth(lunarYear: number): number | null {
  try {
    const leap = Lunar.getLeapMonth(lunarYear)
    return leap || null
  } catch {
    return null
  }
}

/** 农历月份选项（含闰月标记） */
export function getLunarMonthOptions(lunarYear: number): { value: number; label: string; isLeap: boolean }[] {
  const options: { value: number; label: string; isLeap: boolean }[] = []
  const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']
  for (let i = 1; i <= 12; i++) {
    options.push({ value: i, label: monthNames[i - 1], isLeap: false })
  }
  const leapMonth = getLeapMonth(lunarYear)
  if (leapMonth && leapMonth > 0) {
    options.splice(leapMonth, 0, { value: leapMonth, label: `闰${monthNames[leapMonth - 1]}`, isLeap: true })
  }
  return options
}
