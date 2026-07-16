'use client'

import { useState } from 'react'
import Link from 'next/link'

const ZIWEI_STARS = [
  { name: '紫微', type: '主星', nature: '帝座', desc: '尊贵之星，化气为尊', level: '甲级' },
  { name: '天机', type: '主星', nature: '智慧', desc: '智慧之星，化气为善', level: '甲级' },
  { name: '太阳', type: '主星', nature: '光明', desc: '光明之星，化气为权', level: '甲级' },
  { name: '武曲', type: '主星', nature: '财帛', desc: '财星，化气为财', level: '甲级' },
  { name: '天同', type: '主星', nature: '福德', desc: '福星，化气为福', level: '甲级' },
  { name: '廉贞', type: '主星', nature: '事业', desc: '事业之星，化气为囚', level: '甲级' },
  { name: '天府', type: '主星', nature: '库藏', desc: '库星，化气为贤', level: '甲级' },
  { name: '太阴', type: '主星', nature: '阴柔', desc: '阴柔之星，化气为富', level: '甲级' },
  { name: '贪狼', type: '主星', nature: '欲望', desc: '桃花之星，化气为桃花', level: '甲级' },
  { name: '巨门', type: '主星', nature: '暗曜', desc: '暗星，化气为暗', level: '甲级' },
  { name: '天相', type: '主星', nature: '印星', desc: '印星，化气为善', level: '甲级' },
  { name: '天梁', type: '主星', nature: '荫星', desc: '荫星，化气为荫', level: '甲级' },
  { name: '七杀', type: '主星', nature: '将星', desc: '将星，化气为权', level: '甲级' },
  { name: '破军', type: '主星', nature: '耗星', desc: '耗星，化气为耗', level: '甲级' },
]

const PALACES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '仆役', '官禄', '田宅', '福德', '父母',
]

function generateZiweiChart(birthDate: string) {
  const date = new Date(birthDate)
  const day = date.getDate()
  const month = date.getMonth() + 1

  // 简化算法：根据出生日期生成命宫和主星分布
  const mingIndex = (day + month - 2) % 12
  const mingGong = PALACES[mingIndex]

  // 根据月份和日期生成命宫主星
  const starIndex = (month + day) % ZIWEI_STARS.length
  const mingStar = ZIWEI_STARS[starIndex]

  // 生成其他宫位主星（简化版）
  const palaceStars: Record<string, typeof ZIWEI_STARS[0][]> = {}
  PALACES.forEach((palace, i) => {
    const idx = (starIndex + i * 3) % ZIWEI_STARS.length
    palaceStars[palace] = [ZIWEI_STARS[idx]]
  })

  return { mingGong, mingStar, palaceStars, birthDate }
}

export default function ZiWeiPage() {
  const [birthDate, setBirthDate] = useState('')
  const [chart, setChart] = useState<ReturnType<typeof generateZiweiChart> | null>(null)
  const [selectedPalace, setSelectedPalace] = useState('命宫')

  const analyze = () => {
    if (!birthDate) return
    setChart(generateZiweiChart(birthDate))
    setSelectedPalace('命宫')
  }

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
          <h1 className="text-gold-gradient text-xl font-bold">紫微斗数</h1>
          <p className="text-moonly-text-muted text-xs">星曜排盘，命格详解</p>
        </div>
      </div>

      {!chart ? (
        <>
          <div className="moonly-card p-6 mb-6 text-center">
            <div className="text-4xl mb-3">⭐</div>
            <div className="text-white font-medium mb-2">紫微斗数排盘</div>
            <div className="text-moonly-text-muted text-sm">根据出生日期，排出紫微命盘</div>
          </div>

          <div className="moonly-card p-4 mb-6">
            <label className="text-white text-sm font-medium mb-2 block">出生日期</label>
            <input
              type="date"
              value={birthDate}
              onChange={e => setBirthDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-moonly-gold/30"
            />
          </div>

          <button
            onClick={analyze}
            disabled={!birthDate}
            className="w-full py-3 bg-moonly-gold/10 text-moonly-gold rounded-xl font-medium hover:bg-moonly-gold/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始排盘
          </button>

          <div className="mt-6 moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">📖 紫微斗数简介</h3>
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              紫微斗数是中国传统命理学的重要分支，以出生年月日时排出命盘，
              通过十四主星在各宫位的分布，分析一个人的性格、命运、事业、婚姻等各方面。
              命宫是紫微斗数的核心，代表一个人的先天性格和命运走向。
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {/* 命宫信息 */}
          <div className="moonly-card p-6 text-center">
            <div className="text-moonly-text-muted text-xs mb-2">命宫</div>
            <div className="text-white text-2xl font-bold mb-2">{chart.mingGong}</div>
            <div className="text-moonly-gold text-lg font-medium">{chart.mingStar.name}星</div>
            <div className="text-moonly-text-muted text-sm mt-1">{chart.mingStar.desc}</div>
          </div>

          {/* 主星列表 */}
          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">⭐ 十四主星</h3>
            <div className="grid grid-cols-2 gap-2">
              {ZIWEI_STARS.map(star => (
                <div
                  key={star.name}
                  className={`p-2 rounded-lg text-center ${
                    star.name === chart.mingStar.name
                      ? 'bg-moonly-gold/10 border border-moonly-gold/30'
                      : 'bg-white/5'
                  }`}
                >
                  <div className="text-white text-sm font-medium">{star.name}</div>
                  <div className="text-moonly-text-muted text-xs">{star.nature}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 宫位选择 */}
          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-3">🏛 十二宫位</h3>
            <div className="grid grid-cols-3 gap-2">
              {PALACES.map(palace => (
                <button
                  key={palace}
                  onClick={() => setSelectedPalace(palace)}
                  className={`p-2 rounded-lg text-center text-sm transition ${
                    selectedPalace === palace
                      ? 'bg-moonly-gold/10 border border-moonly-gold/30 text-moonly-gold'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {palace}
                </button>
              ))}
            </div>
          </div>

          {/* 当前宫位详情 */}
          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">
              {selectedPalace} · {chart.palaceStars[selectedPalace]?.[0]?.name}星
            </h3>
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              {selectedPalace}宫主星为{chart.palaceStars[selectedPalace]?.[0]?.name}，
              代表{chart.palaceStars[selectedPalace]?.[0]?.desc}。
              此宫位在{selectedPalace}方面的影响力较为明显。
            </p>
          </div>

          {/* 命宫解读 */}
          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">💡 命宫解读</h3>
            <p className="text-moonly-text-secondary text-sm leading-relaxed">
              你的命宫位于{chart.mingGong}，主星为{chart.mingStar.name}。
              {chart.mingStar.desc}，意味着你天生具有{chart.mingStar.nature}的特质。
              在性格上表现为{chart.mingStar.name === '紫微' ? '领导力强，有王者风范' :
                chart.mingStar.name === '天机' ? '思维敏捷，善于谋划' :
                chart.mingStar.name === '太阳' ? '热情开朗，乐于助人' :
                chart.mingStar.name === '武曲' ? '务实稳重，重视财富' :
                chart.mingStar.name === '天同' ? '温和善良，享受生活' :
                chart.mingStar.name === '廉贞' ? '事业心强，追求完美' :
                chart.mingStar.name === '天府' ? '稳重保守，善于理财' :
                chart.mingStar.name === '太阴' ? '温柔细腻，情感丰富' :
                chart.mingStar.name === '贪狼' ? '多才多艺，欲望较强' :
                chart.mingStar.name === '巨门' ? '口才出众，心思缜密' :
                chart.mingStar.name === '天相' ? '公正善良，注重形象' :
                chart.mingStar.name === '天梁' ? '成熟稳重，有长者风范' :
                chart.mingStar.name === '七杀' ? '果断勇敢，敢于冒险' :
                '善于变革，不拘一格'}。
            </p>
          </div>

          <button
            onClick={() => { setChart(null); setBirthDate('') }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新排盘
          </button>
        </div>
      )}
    </div>
  )
}
