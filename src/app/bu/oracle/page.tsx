'use client'

import { useState } from 'react'
import Link from 'next/link'

const ORACLE_CARDS = [
  { name: '月亮', meaning: '直觉与潜意识', desc: '相信你的直觉，答案就在内心深处', image: '🌙', advice: '静下心来，倾听内心的声音。' },
  { name: '太阳', meaning: '光明与成功', desc: '充满希望的时刻，一切都会好起来', image: '☀️', advice: '保持乐观，阳光总在风雨后。' },
  { name: '星星', meaning: '希望与灵感', desc: '指引你的方向，追随内心的梦想', image: '⭐', advice: '不要放弃希望，你的梦想正在实现。' },
  { name: '莲花', meaning: '纯净与觉醒', desc: '从混沌中绽放，保持内心的纯净', image: '🪷', advice: '在混乱中保持清醒，你会找到出路。' },
  { name: '橡树', meaning: '力量与稳定', desc: '扎根深处，你将不可动摇', image: '🌳', advice: '稳固基础，耐心等待时机成熟。' },
  { name: '羽毛', meaning: '轻盈与自由', desc: '放下重担，让心灵自由飞翔', image: '🪶', advice: '释放不必要的负担，轻装前行。' },
  { name: '钥匙', meaning: '机遇与开启', desc: '新的机会正在向你敞开大门', image: '🔑', advice: '抓住机会，勇敢开启新的篇章。' },
  { name: '心', meaning: '爱与慈悲', desc: '用爱心对待自己和他人', image: '❤️', advice: '敞开你的心，爱会流向你。' },
  { name: '火焰', meaning: '激情与变革', desc: '点燃内心的火焰，迎接改变', image: '🔥', advice: '让热情驱动你，改变即将到来。' },
  { name: '水晶', meaning: '清晰与洞察', desc: '看清事物的本质，获得智慧', image: '💎', advice: '保持头脑清醒，真相即将浮现。' },
  { name: '海浪', meaning: '流动与接纳', desc: '顺应潮流，接纳生命的起伏', image: '🌊', advice: '学会顺应，而非对抗。' },
  { name: '山峰', meaning: '成就与巅峰', desc: '你即将达到一个新的高度', image: '⛰️', advice: '坚持攀登，顶峰就在前方。' },
  { name: '蝴蝶', meaning: '蜕变与成长', desc: '转变的时刻，你将焕然一新', image: '🦋', advice: '拥抱变化，蜕变后的你更加美丽。' },
  { name: '指南针', meaning: '方向与指引', desc: '你正在找到正确的方向', image: '🧭', advice: '相信你的选择，路就在脚下。' },
  { name: '沙漏', meaning: '耐心与时机', desc: '一切都会在正确的时间发生', image: '⏳', advice: '耐心等待，时机成熟时行动。' },
  { name: '彩虹', meaning: '祝福与奇迹', desc: '美好即将到来，保持信念', image: '🌈', advice: '经历风雨后，彩虹总会出现。' },
]

export default function OraclePage() {
  const [selected, setSelected] = useState<typeof ORACLE_CARDS[0] | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawnCards, setDrawnCards] = useState<typeof ORACLE_CARDS[0][]>([])
  const [mode, setMode] = useState<'single' | 'three'>('single')

  const drawCard = () => {
    setIsDrawing(true)
    setSelected(null)
    setDrawnCards([])

    setTimeout(() => {
      if (mode === 'single') {
        const idx = Math.floor(Math.random() * ORACLE_CARDS.length)
        setSelected(ORACLE_CARDS[idx])
      } else {
        const used = new Set<number>()
        const cards: typeof ORACLE_CARDS[0][] = []
        while (cards.length < 3) {
          const idx = Math.floor(Math.random() * ORACLE_CARDS.length)
          if (!used.has(idx)) {
            used.add(idx)
            cards.push(ORACLE_CARDS[idx])
          }
        }
        setDrawnCards(cards)
      }
      setIsDrawing(false)
    }, 1500)
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
          <h1 className="text-gold-gradient text-xl font-bold">神谕卡</h1>
          <p className="text-moonly-muted text-xs">灵性指引，每日启示</p>
        </div>
      </div>

      {/* 抽卡模式选择 */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('single')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            mode === 'single'
              ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30'
              : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        >
          单张抽卡
        </button>
        <button
          onClick={() => setMode('three')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
            mode === 'three'
              ? 'bg-[#c9a96e]/10 text-[#c9a96e] border border-[#c9a96e]/30'
              : 'bg-white/5 text-white hover:bg-white/10'
          }`}
        >
          三张牌阵
        </button>
      </div>

      {/* 抽卡区域 */}
      {!selected && drawnCards.length === 0 ? (
        <div className="moonly-card p-8 text-center">
          <div className="text-6xl mb-4">🃏</div>
          <div className="text-white font-medium mb-2">
            {mode === 'single' ? '抽取一张神谕卡' : '抽取三张神谕卡'}
          </div>
          <div className="text-moonly-muted text-sm mb-6">
            {mode === 'single'
              ? '静心思考一个问题，然后抽卡'
              : '过去 · 现在 · 未来'}
          </div>
          <button
            onClick={drawCard}
            disabled={isDrawing}
            className="w-full py-3 bg-[#c9a96e]/10 text-[#c9a96e] rounded-xl font-medium hover:bg-[#c9a96e]/20 transition disabled:opacity-30"
          >
            {isDrawing ? '抽卡中...' : '开始抽卡'}
          </button>
        </div>
      ) : isDrawing ? (
        <div className="moonly-card p-8 text-center">
          <div className="text-6xl mb-4 animate-pulse">🃏</div>
          <div className="text-white font-medium">正在抽取...</div>
          <div className="text-moonly-muted text-sm">请静心等待</div>
        </div>
      ) : null}

      {/* 单张结果 */}
      {selected && (
        <div className="space-y-4">
          <div className="moonly-card p-6 text-center">
            <div className="text-6xl mb-4">{selected.image}</div>
            <div className="text-white text-xl font-bold mb-1">{selected.name}</div>
            <div className="text-[#c9a96e] text-sm mb-3">{selected.meaning}</div>
            <div className="text-moonly-secondary text-sm">{selected.desc}</div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">💡 今日指引</h3>
            <p className="text-moonly-secondary text-sm leading-relaxed">{selected.advice}</p>
          </div>

          <button
            onClick={() => { setSelected(null); setDrawnCards([]) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新抽卡
          </button>
        </div>
      )}

      {/* 三张牌阵结果 */}
      {drawnCards.length === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {drawnCards.map((card, i) => (
              <div key={i} className="moonly-card p-3 text-center">
                <div className="text-moonly-muted text-xs mb-2">
                  {i === 0 ? '过去' : i === 1 ? '现在' : '未来'}
                </div>
                <div className="text-4xl mb-2">{card.image}</div>
                <div className="text-white text-sm font-medium">{card.name}</div>
                <div className="text-[#c9a96e] text-xs mt-1">{card.meaning}</div>
              </div>
            ))}
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">💡 牌阵解读</h3>
            <div className="space-y-2">
              <p className="text-moonly-secondary text-sm">
                <span className="text-[#c9a96e]">过去：</span>{drawnCards[0].desc}
              </p>
              <p className="text-moonly-secondary text-sm">
                <span className="text-[#c9a96e]">现在：</span>{drawnCards[1].desc}
              </p>
              <p className="text-moonly-secondary text-sm">
                <span className="text-[#c9a96e]">未来：</span>{drawnCards[2].desc}
              </p>
            </div>
          </div>

          <div className="moonly-card p-4">
            <h3 className="text-gold text-sm font-semibold mb-2">✨ 综合建议</h3>
            <p className="text-moonly-secondary text-sm leading-relaxed">
              从过去到现在，{drawnCards[0].name}的能量正在转化为{drawnCards[1].name}的特质。
              未来{drawnCards[2].name}的出现预示着新的转变。
              {drawnCards[1].advice}
            </p>
          </div>

          <button
            onClick={() => { setSelected(null); setDrawnCards([]) }}
            className="w-full py-3 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition"
          >
            重新抽卡
          </button>
        </div>
      )}

      {/* 所有卡片展示 */}
      <div className="mt-6">
        <h3 className="text-gold text-sm font-semibold mb-3">🎴 全部神谕卡</h3>
        <div className="grid grid-cols-4 gap-2">
          {ORACLE_CARDS.map(card => (
            <div key={card.name} className="moonly-card p-2 text-center">
              <div className="text-2xl mb-1">{card.image}</div>
              <div className="text-white text-xs">{card.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
