'use client'

import { useState } from 'react'
import Link from 'next/link'

const MAJOR_ARCANA = [
  { name: '愚人', number: 0, meaning: '新的开始、冒险、信任直觉', reverse: '鲁莽、冲动、缺乏计划', element: '风', emoji: '🃏' },
  { name: '魔术师', number: 1, meaning: '创造力、资源、行动力', reverse: '欺骗、能力未发挥、操控', element: '风', emoji: '🎩' },
  { name: '女祭司', number: 2, meaning: '直觉、内在智慧、神秘', reverse: '隐藏、压抑、忽视直觉', element: '水', emoji: '🌙' },
  { name: '皇后', number: 3, meaning: '丰饶、创造、关爱、滋养', reverse: '依赖、过度保护、不育', element: '土', emoji: '👑' },
  { name: '皇帝', number: 4, meaning: '权威、结构、稳定、控制', reverse: '专横、僵化、缺乏弹性', element: '火', emoji: '⚔️' },
  { name: '教皇', number: 5, meaning: '传统、教导、信仰、价值观', reverse: '反叛、打破传统、个人信仰', element: '土', emoji: '⛪' },
  { name: '恋人', number: 6, meaning: '选择、关系、和谐、结合', reverse: '失衡、分离、错误选择', element: '风', emoji: '💕' },
  { name: '战车', number: 7, meaning: '意志力、胜利、决心、控制', reverse: '失控、挫败、缺乏方向', element: '水', emoji: '🏎️' },
  { name: '力量', number: 8, meaning: '勇气、耐心、内在力量、温柔', reverse: '软弱、失控、滥用力量', element: '火', emoji: '🦁' },
  { name: '隐者', number: 9, meaning: ' introspection、独处、智慧、引导', reverse: '孤独、孤立、拒绝帮助', element: '土', emoji: '🕯️' },
  { name: '命运之轮', number: 10, meaning: '变化、命运、转折点、周期', reverse: '逆境、不顺、抗拒变化', element: '火', emoji: '☸️' },
  { name: '正义', number: 11, meaning: '公平、真理、因果、平衡', reverse: '不公、偏见、逃避责任', element: '风', emoji: '⚖️' },
  { name: '倒吊人', number: 12, meaning: '牺牲、新视角、放手、等待', reverse: '抗拒、拖延、无谓牺牲', element: '水', emoji: '🙃' },
  { name: '死神', number: 13, meaning: '结束、转变、重生、释放', reverse: '抗拒改变、停滞、恐惧', element: '水', emoji: '💀' },
  { name: '节制', number: 14, meaning: '平衡、融合、节制、耐心', reverse: '极端、失衡、过度放纵', element: '火', emoji: '🍶' },
  { name: '恶魔', number: 15, meaning: '束缚、物质、欲望、成瘾', reverse: '解放、挣脱、意识到枷锁', element: '土', emoji: '👿' },
  { name: '高塔', number: 16, meaning: '突变、觉醒、打破旧有结构', reverse: '灾难避免、内省、拖延改变', element: '火', emoji: '🗼' },
  { name: '星星', number: 17, meaning: '希望、灵感、宁静、信心', reverse: '绝望、失去信心、迷茫', element: '风', emoji: '⭐' },
  { name: '月亮', number: 18, meaning: '幻觉、潜意识、恐惧、直觉', reverse: '恐惧消退、真相大白、平静', element: '水', emoji: '🌕' },
  { name: '太阳', number: 19, meaning: '快乐、成功、活力、清晰', reverse: '暂时阴霾、过度乐观、缺乏', element: '火', emoji: '☀️' },
  { name: '审判', number: 20, meaning: '重生、觉醒、评价、召唤', reverse: '自责、逃避、拒绝改变', element: '火', emoji: '📯' },
  { name: '世界', number: 21, meaning: '完成、圆满、成就、整合', reverse: '未完成、缺乏 closure、拖延', element: '土', emoji: '🌍' },
]

const SPREADS = [
  {
    name: '单张牌',
    desc: '快速指引，回答当下问题',
    count: 1,
    positions: ['当前指引'],
  },
  {
    name: '三张牌',
    desc: '过去、现在、未来',
    count: 3,
    positions: ['过去', '现在', '未来'],
  },
  {
    name: '凯尔特十字',
    desc: '深入分析问题的十个维度',
    count: 10,
    positions: ['当前状况', '挑战', '基础', '过去', '未来', '自我', '环境', '希望', '结果', '指引'],
  },
]

interface DrawnCard {
  card: typeof MAJOR_ARCANA[0]
  reversed: boolean
}

export default function TarotPage() {
  const [selectedSpread, setSelectedSpread] = useState(SPREADS[0])
  const [cards, setCards] = useState<DrawnCard[]>([])
  const [revealed, setRevealed] = useState<number[]>([])
  const [question, setQuestion] = useState('')
  const [shuffling, setShuffling] = useState(false)

  const shuffle = () => {
    setShuffling(true)
    setCards([])
    setRevealed([])
    
    setTimeout(() => {
      const drawn: DrawnCard[] = []
      const used = new Set<number>()
      
      while (drawn.length < selectedSpread.count) {
        const idx = Math.floor(Math.random() * MAJOR_ARCANA.length)
        if (used.has(idx)) continue
        used.add(idx)
        drawn.push({
          card: MAJOR_ARCANA[idx],
          reversed: Math.random() > 0.7,
        })
      }
      
      setCards(drawn)
      setShuffling(false)
    }, 1500)
  }

  const revealCard = (index: number) => {
    if (revealed.includes(index)) return
    setRevealed([...revealed, index])
  }

  const reset = () => {
    setCards([])
    setRevealed([])
    setQuestion('')
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
          <h1 className="text-gold-gradient text-xl font-bold">塔罗占卜</h1>
          <p className="text-moonly-text-muted text-xs">大阿卡纳指引，探寻内心答案</p>
        </div>
      </div>

      {/* 问题输入 */}
      <div className="moonly-card p-4 mb-6">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="心中默念你的问题..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-moonly-text-muted focus:outline-none focus:border-moonly-gold/30"
        />
      </div>

      {/* 牌阵选择 */}
      {!cards.length && (
        <div className="space-y-3 mb-6">
          {SPREADS.map(spread => (
            <button
              key={spread.name}
              onClick={() => setSelectedSpread(spread)}
              className={`w-full text-left moonly-card p-4 transition ${selectedSpread.name === spread.name ? 'border-moonly-gold/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${selectedSpread.name === spread.name ? 'text-gold' : 'text-white'}`}>
                  {spread.name}
                </span>
                <span className="text-[10px] text-moonly-text-muted">{spread.count} 张</span>
              </div>
              <p className="text-xs text-moonly-text-secondary">{spread.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* 洗牌按钮 */}
      {!cards.length && (
        <button
          onClick={shuffle}
          disabled={shuffling}
          className="w-full py-3.5 rounded-xl bg-moonly-gold/15 text-gold border border-moonly-gold/20 font-medium hover:bg-moonly-gold/20 transition disabled:opacity-50"
        >
          {shuffling ? '洗牌中...' : '开始抽牌'}
        </button>
      )}

      {/* 洗牌动画 */}
      {shuffling && (
        <div className="flex justify-center py-12">
          <div className="w-24 h-36 rounded-xl bg-gradient-to-br from-moonly-gold/20 to-moonly-purple/20 border border-white/10 flex items-center justify-center animate-pulse">
            <span className="text-3xl">🃏</span>
          </div>
        </div>
      )}

      {/* 牌阵展示 */}
      {cards.length > 0 && !shuffling && (
        <div className="space-y-6">
          {/* 牌阵 */}
          <div className={`grid gap-3 ${cards.length === 1 ? 'grid-cols-1 max-w-[140px] mx-auto' : cards.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {cards.map((drawn, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-moonly-text-muted mb-2">{selectedSpread.positions[i]}</div>
                <button
                  onClick={() => revealCard(i)}
                  className={`w-full aspect-[2/3] rounded-xl border transition-all duration-500 relative overflow-hidden ${
                    revealed.includes(i)
                      ? 'bg-gradient-to-br from-moonly-gold/10 to-moonly-purple/10 border-moonly-gold/30'
                      : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-white/10 hover:border-white/20'
                  }`}
                >
                  {revealed.includes(i) ? (
                    <div className="p-3 h-full flex flex-col">
                      <div className={`text-center mb-2 ${drawn.reversed ? 'rotate-180' : ''}`}>
                        <div className="text-3xl mb-1">{drawn.card.emoji}</div>
                        <div className="text-xs font-bold text-white">{drawn.card.name}</div>
                        <div className="text-[10px] text-moonly-gold">{drawn.card.number} · {drawn.card.element}</div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        <div className="text-[10px] text-moonly-text-muted mb-1">
                          {drawn.reversed ? '逆位' : '正位'}
                        </div>
                        <div className="text-xs text-moonly-text-secondary leading-relaxed">
                          {drawn.reversed ? drawn.card.reverse : drawn.card.meaning}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-16 rounded border border-moonly-gold/20 flex items-center justify-center">
                        <span className="text-moonly-gold text-lg">?</span>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* 综合解读 */}
          {revealed.length === cards.length && (
            <div className="moonly-card p-5">
              <h3 className="text-gold text-sm font-semibold mb-3">综合解读</h3>
              <p className="text-sm text-moonly-text-secondary leading-relaxed">
                {question ? `关于「${question}」：\n` : ''}
                {cards.map((d, i) => `${selectedSpread.positions[i]} — ${d.card.name}（${d.reversed ? '逆位' : '正位'}）`).join('，')}
                。这组牌阵提示你当前{question ? '所问之事' : '面临的情况'}的关键在于
                {cards.find(c => !c.reversed)?.card?.name || cards[0]?.card?.name}的能量，
                {cards.some(c => c.reversed) ? '其中逆位牌提醒你需要注意调整的方向。' : '整体能量积极向上，建议顺势而为。'}
              </p>
            </div>
          )}

          {/* 重新抽牌 */}
          <button
            onClick={reset}
            className="w-full py-3 rounded-xl bg-white/5 text-moonly-text-secondary border border-white/10 hover:bg-white/10 transition"
          >
            重新抽牌
          </button>
        </div>
      )}

      {/* 牌义速查 */}
      {!cards.length && !shuffling && (
        <div className="mt-8">
          <h3 className="text-gold text-sm font-semibold mb-3">牌义速查</h3>
          <div className="grid grid-cols-2 gap-2">
            {MAJOR_ARCANA.slice(0, 6).map(card => (
              <div key={card.number} className="moonly-card p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{card.emoji}</span>
                  <span className="text-sm text-white font-medium">{card.name}</span>
                </div>
                <p className="text-[10px] text-moonly-text-muted">{card.meaning}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
