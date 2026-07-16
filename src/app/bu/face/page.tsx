'use client'

import { useState } from 'react'
import Link from 'next/link'

const FACE_FEATURES = [
  {
    id: 'forehead',
    name: '额头',
    icon: '👆',
    meaning: ' forehead represents early life fortune, wisdom, and career prospects.',
    good: '宽广饱满、光滑明亮 — 主早年得志，聪明智慧，事业有成',
    bad: '狭窄凹陷、纹理杂乱 — 主早年艰辛，思绪多忧',
  },
  {
    id: 'eyebrow',
    name: '眉毛',
    icon: '👁️',
    meaning: '眉毛代表兄弟宫，主人际关系与感情',
    good: '清秀顺长、浓淡适中 — 主兄弟和睦，人缘佳，感情顺利',
    bad: '短促杂乱、逆生长 — 主兄弟缘薄，人际多波折',
  },
  {
    id: 'eye',
    name: '眼睛',
    icon: '👀',
    meaning: '眼睛为心灵之窗，主智慧、决断力',
    good: '黑白分明、神采奕奕 — 主聪慧果断，有领导力',
    bad: '浑浊无神、三白眼 — 主思虑不周，易招小人',
  },
  {
    id: 'nose',
    name: '鼻子',
    icon: '👃',
    meaning: '鼻子为财帛宫，主财运与自我',
    good: '鼻梁挺直、鼻头圆润 — 主财运亨通，自尊心强',
    bad: '鼻梁低陷、鼻头尖削 — 主财运波折，缺乏自信',
  },
  {
    id: 'mouth',
    name: '嘴巴',
    icon: '👄',
    meaning: '嘴巴为食禄宫，主言语、食欲与享受',
    good: '方正红润、唇线清晰 — 主口才出众，福禄双全',
    bad: '歪斜薄削、唇色暗淡 — 主言语招祸，食禄不丰',
  },
  {
    id: 'ear',
    name: '耳朵',
    icon: '👂',
    meaning: '耳朵为采听宫，主少年运与福气',
    good: '耳垂厚大、轮廓分明 — 主少年有福，晚年安康',
    bad: '薄小反廓、耳尖无垂 — 主少年劳碌，福气较薄',
  },
  {
    id: 'chin',
    name: '下巴',
    icon: '👇',
    meaning: '下巴为地阁，主晚年运与不动产',
    good: '方圆饱满、双下巴 — 主晚年安逸，不动产丰',
    bad: '尖削内缩、地阁窄 — 主晚年孤独，居无定所',
  },
  {
    id: 'cheek',
    name: '颧骨',
    icon: '🦴',
    meaning: '颧骨为权柄宫，主权力与野心',
    good: '饱满有肉、位置适中 — 主有权有势，管理能力强',
    bad: '高耸横张、无肉包 — 主权力欲强，易招是非',
  },
]

const FORTUNE_LEVELS = [
  { level: '上上', score: 95, desc: '天庭饱满，地阁方圆，福禄寿全。', color: 'text-gold' },
  { level: '上中', score: 85, desc: '五官端正，气色红润，运势顺畅。', color: 'text-yellow-400' },
  { level: '中上', score: 75, desc: '相貌平平，局部有优势，努力可成。', color: 'text-green-400' },
  { level: '中平', score: 60, desc: '相貌普通，运势平稳，需靠后天修养。', color: 'text-blue-400' },
  { level: '中下', score: 45, desc: '局部有缺陷，注意调整心态，多行善事。', color: 'text-orange-400' },
  { level: '下下', score: 30, desc: '相貌多有不整，建议修心养性，积德改运。', color: 'text-red-400' },
]

export default function FaceReadingPage() {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [result, setResult] = useState<typeof FORTUNE_LEVELS[0] | null>(null)

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const analyze = () => {
    if (selectedFeatures.length === 0) return
    const score = Math.min(95, Math.max(30, selectedFeatures.length * 12 + 30))
    const level = FORTUNE_LEVELS.find(l => score >= l.score) || FORTUNE_LEVELS[3]
    setResult(level)
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
          <h1 className="text-gold-gradient text-xl font-bold">面相分析</h1>
          <p className="text-moonly-muted text-xs">传统相学，洞察运势</p>
        </div>
      </div>

      {!result ? (
        <>
          <div className="moonly-card p-4 mb-6">
            <p className="text-moonly-secondary text-sm leading-relaxed">
              面相学认为五官反映人的运势与性格。选择你认为自己具备的优势面相特征，AI将为你分析综合运势。
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {FACE_FEATURES.map(feature => (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={`moonly-card p-4 text-left transition ${
                  selectedFeatures.includes(feature.id)
                    ? 'border-[#c9a96e]/50 bg-[#c9a96e]/5'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <div className="text-white text-sm font-medium">{feature.name}</div>
                <div className="text-moonly-muted text-xs mt-1">{feature.meaning.slice(0, 20)}...</div>
                {selectedFeatures.includes(feature.id) && (
                  <div className="mt-2 text-[#c9a96e] text-xs">✓ 已选</div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={analyze}
            disabled={selectedFeatures.length === 0}
            className="w-full py-3 bg-[#c9a96e]/10 text-[#c9a96e] rounded-xl font-medium hover:bg-[#c9a96e]/20 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            开始分析（已选 {selectedFeatures.length} 项）
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-4xl mb-3">🔮</div>
            <div className={`text-2xl font-bold mb-2 ${result.color}`}>{result.level}</div>
            <div className="text-moonly-secondary text-sm leading-relaxed">{result.desc}</div>
          </div>

          <div className="space-y-3">
            {selectedFeatures.map(id => {
              const feature = FACE_FEATURES.find(f => f.id === id)
              if (!feature) return null
              return (
                <div key={id} className="moonly-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-white font-medium text-sm">{feature.name}</span>
                  </div>
                  <div className="text-moonly-muted text-xs mb-2">{feature.meaning}</div>
                  <div className="text-green-400 text-xs">{feature.good}</div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { setResult(null); setSelectedFeatures([]) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新分析
          </button>
        </div>
      )}
    </div>
  )
}
