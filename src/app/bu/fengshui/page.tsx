'use client'

import { useState } from 'react'
import Link from 'next/link'

const DIRECTIONS = [
  { name: '北', degree: 0, element: '水', color: 'bg-blue-500/20 text-blue-300', desc: '坎卦，主事业、智慧' },
  { name: '东北', degree: 45, element: '土', color: 'bg-yellow-500/20 text-yellow-300', desc: '艮卦，主学业、知识' },
  { name: '东', degree: 90, element: '木', color: 'bg-green-500/20 text-green-300', desc: '震卦，主健康、成长' },
  { name: '东南', degree: 135, element: '木', color: 'bg-green-500/20 text-green-300', desc: '巽卦，主财运、人缘' },
  { name: '南', degree: 180, element: '火', color: 'bg-red-500/20 text-red-300', desc: '离卦，主名声、桃花' },
  { name: '西南', degree: 225, element: '土', color: 'bg-yellow-500/20 text-yellow-300', desc: '坤卦，主婚姻、家庭' },
  { name: '西', degree: 270, element: '金', color: 'bg-slate-400/20 text-slate-300', desc: '兑卦，主子女、创意' },
  { name: '西北', degree: 315, element: '金', color: 'bg-slate-400/20 text-slate-300', desc: '乾卦，主贵人、权力' },
]

const FENG_SHUI_TIPS = [
  { area: '大门', tip: '保持干净整洁，不宜正对楼梯或电梯', element: '木' },
  { area: '客厅', tip: '光线充足，沙发宜靠实墙，形成有靠山', element: '火' },
  { area: '卧室', tip: '床头宜靠实墙，避免横梁压顶，保持安静', element: '土' },
  { area: '厨房', tip: '灶不宜正对水槽，保持清洁，火灶宜靠实墙', element: '火' },
  { area: '书房', tip: '书桌宜靠窗，光线充足，文昌位利于学习', element: '木' },
  { area: '卫生间', tip: '保持干燥清洁，门不宜正对卧室或厨房', element: '水' },
  { area: '阳台', tip: '不宜堆放杂物，可放置绿植增加生气', element: '木' },
  { area: '财位', tip: '客厅对角线位置，宜放置招财物件，保持明亮', element: '金' },
]

export default function FengShuiPage() {
  const [selectedDir, setSelectedDir] = useState<string | null>(null)

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
          <h1 className="text-gold-gradient text-xl font-bold">风水罗盘</h1>
          <p className="text-moonly-muted text-xs">方位吉凶，趋吉避凶</p>
        </div>
      </div>

      {/* 罗盘 */}
      <div className="moonly-card p-6 mb-6">
        <div className="relative w-64 h-64 mx-auto">
          {/* 外圈 */}
          <div className="absolute inset-0 rounded-full border-2 border-[#c9a96e]/30" />
          {/* 内圈 */}
          <div className="absolute inset-4 rounded-full border border-white/10" />
          {/* 中心 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#c9a96e]/20 border border-[#c9a96e]/30 flex items-center justify-center">
              <span className="text-gold text-lg font-bold">中</span>
            </div>
          </div>
          {/* 方向标记 */}
          {DIRECTIONS.map((dir, i) => {
            const angle = (i * 45 - 90) * (Math.PI / 180)
            const x = 50 + 40 * Math.cos(angle)
            const y = 50 + 40 * Math.sin(angle)
            return (
              <button
                key={dir.name}
                onClick={() => setSelectedDir(selectedDir === dir.name ? null : dir.name)}
                className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className={`text-xs font-bold ${selectedDir === dir.name ? 'text-gold' : 'text-white/70'}`}>
                  {dir.name}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-moonly-muted text-xs text-center mt-4">点击方向查看风水详解</p>
      </div>

      {/* 方向详情 */}
      {selectedDir && (
        <div className="moonly-card p-4 mb-6">
          {DIRECTIONS.filter(d => d.name === selectedDir).map(dir => (
            <div key={dir.name}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🧭</span>
                <span className="text-white font-bold text-lg">{dir.name}方</span>
                <span className={`text-xs px-2 py-0.5 rounded ${dir.color}`}>{dir.element}属性</span>
              </div>
              <p className="text-moonly-secondary text-sm leading-relaxed">{dir.desc}</p>
              <div className="mt-3 text-[#c9a96e] text-xs">
                💡 建议：此方位宜放置{dir.element}属性物件（如{dir.element === '木' ? '绿植' : dir.element === '火' ? '红色装饰' : dir.element === '土' ? '陶瓷' : dir.element === '金' ? '金属' : '鱼缸'}）来增强运势。
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 风水建议 */}
      <div className="space-y-3">
        <h3 className="text-gold text-sm font-semibold">🏠 居家风水建议</h3>
        {FENG_SHUI_TIPS.map(tip => (
          <div key={tip.area} className="moonly-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-medium text-sm">{tip.area}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                tip.element === '木' ? 'bg-green-500/20 text-green-300' :
                tip.element === '火' ? 'bg-red-500/20 text-red-300' :
                tip.element === '土' ? 'bg-yellow-500/20 text-yellow-300' :
                tip.element === '金' ? 'bg-slate-400/20 text-slate-300' :
                'bg-blue-500/20 text-blue-300'
              }`}>{tip.element}</span>
            </div>
            <p className="text-moonly-secondary text-xs leading-relaxed">{tip.tip}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
