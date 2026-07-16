'use client'

import { useMemo } from 'react'
import Link from 'next/link'

interface GuideSection {
  title: string
  icon: string
  items: { label: string; value: string; desc?: string }[]
}

const GUIDES: GuideSection[] = [
  {
    title: '今日开运色',
    icon: '🎨',
    items: [
      { label: '大吉', value: '金色', desc: '增强财运和贵人运' },
      { label: '次吉', value: '白色', desc: '提升人际关系' },
      { label: '平', value: '蓝色', desc: '稳定情绪' },
      { label: '忌', value: '红色', desc: '今日不宜' },
    ],
  },
  {
    title: '吉时指南',
    icon: '⏰',
    items: [
      { label: '卯时', value: '05:00-07:00', desc: '适合早起锻炼、规划一天' },
      { label: '午时', value: '11:00-13:00', desc: '适合商务谈判、签约' },
      { label: '申时', value: '15:00-17:00', desc: '适合投资理财、决策' },
      { label: '酉时', value: '17:00-19:00', desc: '适合社交、约会' },
    ],
  },
  {
    title: '方位指南',
    icon: '🧭',
    items: [
      { label: '财神位', value: '东南', desc: '今日求财宜向此方位' },
      { label: '喜神位', value: '正南', desc: '喜庆事宜在此方位' },
      { label: '福神位', value: '正东', desc: '祈福求平安宜面向此' },
      { label: '桃花位', value: '西南', desc: '求姻缘可往此方向' },
    ],
  },
  {
    title: '幸运数字',
    icon: '🔢',
    items: [
      { label: '大吉数', value: '6', desc: '六六大顺' },
      { label: '次吉数', value: '8', desc: '发财兴旺' },
      { label: '吉数', value: '3', desc: '生生不息' },
      { label: '幸运组合', value: '168', desc: '一路发' },
    ],
  },
  {
    title: '饮食建议',
    icon: '🍽️',
    items: [
      { label: '宜食', value: '金色食物', desc: '南瓜、玉米、香蕉' },
      { label: '宜饮', value: '温性茶饮', desc: '红枣茶、枸杞茶' },
      { label: '忌食', value: '寒凉食物', desc: '冰淇淋、生冷饮品' },
      { label: '养生', value: '养胃', desc: '小米粥、山药' },
    ],
  },
  {
    title: '行为建议',
    icon: '✨',
    items: [
      { label: '宜', value: '外出社交', desc: '拓展人脉的好时机' },
      { label: '宜', value: '学习充电', desc: '吸收新知识效率高' },
      { label: '忌', value: '大额投资', desc: '今日财运不稳' },
      { label: '忌', value: '冲动决策', desc: '三思而后行' },
    ],
  },
]

function getDaySeed(): number {
  const d = new Date()
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
}

export default function LuckyGuidePage() {
  const seed = useMemo(() => getDaySeed(), [])

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/ming" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-gold-gradient text-xl font-bold">开运指南</h1>
      </div>

      {/* Date */}
      <div className="text-center mb-6">
        <p className="text-moonly-muted text-xs">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</p>
      </div>

      {/* Guide sections */}
      <div className="space-y-4">
        {GUIDES.map((section, i) => (
          <div key={section.title} className="moonly-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{section.icon}</span>
              <h3 className="text-gold text-sm font-semibold">{section.title}</h3>
            </div>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div key={j} className="flex items-start gap-3 bg-white/5 rounded-lg p-2.5">
                  <span className="text-xs text-gold/80 font-medium w-16 shrink-0">{item.label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80">{item.value}</p>
                    {item.desc && <p className="text-[10px] text-moonly-muted mt-0.5">{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-moonly-muted">开运指南仅供参考，保持理性态度</p>
      </div>
    </div>
  )
}
