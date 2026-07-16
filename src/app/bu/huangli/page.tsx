'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getTodayGanZhi } from '@/lib/bazi'

const YI_JI: Record<string, { yi: string[]; ji: string[] }> = {
  '甲': {
    yi: ['祭祀', '祈福', '求嗣', '出行', '会友', '修造', '动土'],
    ji: ['嫁娶', '开业', '签约'],
  },
  '乙': {
    yi: ['祭祀', '祈福', '栽种', '纳畜', '安床'],
    ji: ['嫁娶', '出行', '掘井'],
  },
  '丙': {
    yi: ['嫁娶', '开业', '出行', '交易', '安床'],
    ji: ['祭祀', '祈福', '安葬'],
  },
  '丁': {
    yi: ['嫁娶', '订盟', '纳采', '祭祀', '祈福'],
    ji: ['动土', '破土', '掘井'],
  },
  '戊': {
    yi: ['祭祀', '祈福', '求嗣', '斋醮', '开光'],
    ji: ['嫁娶', '出行', '移徙'],
  },
  '己': {
    yi: ['祭祀', '祈福', '求嗣', '入学', '动土'],
    ji: ['嫁娶', '出行', '开业'],
  },
  '庚': {
    yi: ['嫁娶', '开业', '出行', '交易', '安葬'],
    ji: ['祭祀', '祈福', '安床'],
  },
  '辛': {
    yi: ['祭祀', '祈福', '嫁娶', '订盟', '纳采'],
    ji: ['动土', '破土', '掘井'],
  },
  '壬': {
    yi: ['出行', '会友', '沐浴', '剃头', '整手足甲'],
    ji: ['嫁娶', '安葬', '祭祀'],
  },
  '癸': {
    yi: ['祭祀', '祈福', '求嗣', '入学', '裁衣'],
    ji: ['嫁娶', '出行', '动土'],
  },
}

const SHI_CHEN_LUCK: Record<string, string[]> = {
  '子': ['吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶'],
  '丑': ['凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉'],
  '寅': ['吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶'],
  '卯': ['吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉'],
  '辰': ['凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶', '吉'],
  '巳': ['凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉', '凶'],
  '午': ['吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶', '吉'],
  '未': ['吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉', '凶'],
  '申': ['凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉', '吉'],
  '酉': ['吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶', '吉'],
  '戌': ['凶', '吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉', '凶'],
  '亥': ['吉', '凶', '吉', '凶', '吉', '吉', '凶', '凶', '吉', '吉', '凶', '吉'],
}

const SHI_CHEN_NAMES = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时']

const SHI_CHEN_HOURS = ['23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00', '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00']

const CHONG_SHA: Record<string, { chong: string; sha: string }> = {
  '子': { chong: '马', sha: '南' },
  '丑': { chong: '羊', sha: '东' },
  '寅': { chong: '猴', sha: '北' },
  '卯': { chong: '鸡', sha: '西' },
  '辰': { chong: '狗', sha: '南' },
  '巳': { chong: '猪', sha: '东' },
  '午': { chong: '鼠', sha: '北' },
  '未': { chong: '牛', sha: '西' },
  '申': { chong: '虎', sha: '南' },
  '酉': { chong: '兔', sha: '东' },
  '戌': { chong: '龙', sha: '北' },
  '亥': { chong: '蛇', sha: '西' },
}

export default function HuangliPage() {
  const [today, setToday] = useState<any>(null)

  useEffect(() => {
    setToday(getTodayGanZhi())
  }, [])

  if (!today) return null

  const dayGan = today.day.gan
  const dayZhi = today.day.zhi
  const yiJi = YI_JI[dayGan] || { yi: ['诸事不宜'], ji: ['诸事不宜'] }
  const chongSha = CHONG_SHA[dayZhi] || { chong: '', sha: '' }
  const shiChenLuck = SHI_CHEN_LUCK[dayZhi] || []

  const currentHour = new Date().getHours()
  const currentShiChenIdx = Math.floor(((currentHour + 1) % 24) / 2)

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/bu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">今日黄历</h1>
          <p className="text-moonly-muted text-xs">择日参考，趋吉避凶</p>
        </div>
      </div>

      {/* 日期卡片 */}
      <div className="moonly-card p-5 mb-6 text-center border border-[#c9a96e]/20">
        <div className="text-moonly-muted text-sm mb-1">{today.dateStr}</div>
        <div className="text-2xl font-bold text-gold mb-3">
          {today.day.gan}{today.day.zhi}日
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-[10px] text-moonly-muted">冲</div>
            <div className="text-sm text-white">{chongSha.chong}</div>
          </div>
          <div>
            <div className="text-[10px] text-moonly-muted">煞</div>
            <div className="text-sm text-white">{chongSha.sha}</div>
          </div>
          <div>
            <div className="text-[10px] text-moonly-muted">五行</div>
            <div className="text-sm text-gold">{today.day.gan}天干</div>
          </div>
        </div>
      </div>

      {/* 宜 */}
      <div className="moonly-card p-4 mb-4 border-l-2 border-green-400/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">宜</div>
          <span className="text-green-400 text-sm font-semibold">今日宜</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {yiJi.yi.map((item) => (
            <span key={item} className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/20">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 忌 */}
      <div className="moonly-card p-4 mb-6 border-l-2 border-red-400/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded bg-red-500/20 flex items-center justify-center text-red-400 text-xs font-bold">忌</div>
          <span className="text-red-400 text-sm font-semibold">今日忌</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {yiJi.ji.map((item) => (
            <span key={item} className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* 时辰吉凶 */}
      <div className="moonly-card p-4">
        <h3 className="text-gold text-sm font-semibold mb-3">十二时辰吉凶</h3>
        <div className="grid grid-cols-2 gap-2">
          {SHI_CHEN_NAMES.map((name, i) => {
            const luck = shiChenLuck[i] || '平'
            const isCurrent = i === currentShiChenIdx
            const luckColor = luck === '吉' ? 'text-green-400 bg-green-500/10 border-green-500/20' : luck === '凶' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-moonly-muted bg-white/5 border-white/10'
            return (
              <div
                key={name}
                className={`p-2 rounded-lg border text-xs ${luckColor} ${isCurrent ? 'ring-1 ring-[#c9a96e]/50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{name}</span>
                  <span>{SHI_CHEN_HOURS[i]}</span>
                </div>
                <div className="text-[10px] mt-0.5">{luck === '吉' ? '✓ 吉时' : luck === '凶' ? '✗ 凶时' : '○ 平'}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
