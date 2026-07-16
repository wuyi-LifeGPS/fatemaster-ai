'use client'

import { useMemo, useState, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from '@/components/Toast'

const TAROT_CARDS = [
  { name: '愚者', emoji: '🃏', meaning: '新的开始，冒险精神', advice: '勇敢踏出第一步，相信直觉' },
  { name: '魔术师', emoji: '🎩', meaning: '创造力，资源整合', advice: '发挥才能，把握现有资源' },
  { name: '女祭司', emoji: '🔮', meaning: '直觉，内在智慧', advice: '倾听内心，相信直觉指引' },
  { name: '皇后', emoji: '👑', meaning: '丰饶，滋养，母性', advice: '关爱自己，享受生活美好' },
  { name: '皇帝', emoji: '🏛️', meaning: '权威，结构，掌控', advice: '建立秩序，承担责任' },
  { name: '教皇', emoji: '⛪', meaning: '传统，精神指引', advice: '寻求指导，尊重传统' },
  { name: '恋人', emoji: '💕', meaning: '爱情，选择，和谐', advice: '用心选择，珍惜感情' },
  { name: '战车', emoji: '🏎️', meaning: '意志力，胜利，前进', advice: '坚定目标，勇往直前' },
  { name: '力量', emoji: '🦁', meaning: '勇气，耐心，内在力量', advice: '以柔克刚，用耐心化解' },
  { name: '隐士', emoji: '🕯️', meaning: '内省，独处，寻找答案', advice: '静心思考，独自探索' },
  { name: '命运之轮', emoji: '☸️', meaning: '变化，周期，命运', advice: '顺应变化，把握机遇' },
  { name: '正义', emoji: '⚖️', meaning: '公正，平衡，因果', advice: '公平待人，承担后果' },
  { name: '倒吊人', emoji: '🙃', meaning: '牺牲，等待，新视角', advice: '换个角度，暂时忍耐' },
  { name: '死神', emoji: '💀', meaning: '结束，转变，重生', advice: '放下过去，迎接新生' },
  { name: '节制', emoji: '🏺', meaning: '平衡，调和，耐心', advice: '保持平衡，循序渐进' },
  { name: '恶魔', emoji: '😈', meaning: '欲望，束缚，物质', advice: '审视欲望，摆脱束缚' },
  { name: '塔', emoji: '🗼', meaning: '突变，觉醒，破坏', advice: '接受变化，重建基础' },
  { name: '星星', emoji: '⭐', meaning: '希望，灵感，宁静', advice: '保持希望，追随梦想' },
  { name: '月亮', emoji: '🌙', meaning: '潜意识，幻象，恐惧', advice: '面对恐惧，厘清真相' },
  { name: '太阳', emoji: '☀️', meaning: '成功，活力，喜悦', advice: '拥抱快乐，展现自我' },
  { name: '审判', emoji: '📯', meaning: '觉醒，重生，评价', advice: '反思过去，重新开始' },
  { name: '世界', emoji: '🌍', meaning: '完成，圆满，成就', advice: '庆祝成就，圆满收官' },
]

const POSITIONS = ['今日主题', '挑战', '建议']

interface TarotRecord {
  date: string
  cards: { name: string; emoji: string; position: string; isReversed: boolean; advice: string }[]
}

const STORAGE_KEY = 'lifegps_tarot_records'

function loadRecords(): TarotRecord[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveRecord(record: TarotRecord) {
  if (typeof window === 'undefined') return
  const records = loadRecords()
  const filtered = records.filter(r => r.date !== record.date)
  filtered.unshift(record)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered.slice(0, 30)))
}

function getTodayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getDailyTarot(date: Date): { card: typeof TAROT_CARDS[0]; position: string; isReversed: boolean }[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return POSITIONS.map((position, i) => {
    const cardIndex = (dayOfYear * 7 + i * 13) % TAROT_CARDS.length
    const isReversed = ((dayOfYear * 3 + i * 11) % 100) < 30
    return {
      card: TAROT_CARDS[cardIndex],
      position,
      isReversed,
    }
  })
}

export default function TarotDaily() {
  const [records, setRecords] = useState<TarotRecord[]>(() => loadRecords())
  const [revealed, setRevealed] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const todayStr = getTodayStr()
  const todayRecord = records.find(r => r.date === todayStr)

  const tarot = useMemo(() => getDailyTarot(new Date()), [])

  const handleReveal = useCallback(() => {
    if (todayRecord) {
      setRevealed(true)
      return
    }
    hapticLight()
    setRevealed(true)

    const record: TarotRecord = {
      date: todayStr,
      cards: tarot.map(t => ({
        name: t.card.name,
        emoji: t.card.emoji,
        position: t.position,
        isReversed: t.isReversed,
        advice: t.isReversed ? `挑战：${t.card.meaning}，需谨慎对待` : t.card.advice,
      })),
    }
    saveRecord(record)
    setRecords(prev => [record, ...prev.filter(r => r.date !== todayStr)])
    showToast('今日塔罗已抽取', 'success')
  }, [todayRecord, tarot, todayStr])

  const displayCards = todayRecord ? todayRecord.cards : tarot.map(t => ({
    name: t.card.name,
    emoji: t.card.emoji,
    position: t.position,
    isReversed: t.isReversed,
    advice: t.isReversed ? `挑战：${t.card.meaning}，需谨慎对待` : t.card.advice,
  }))

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎴</span>
          <h3 className="text-gold text-sm font-semibold">塔罗日运</h3>
        </div>
        <div className="flex items-center gap-2">
          {records.length > 0 && (
            <button
              onClick={() => setShowHistory(v => !v)}
              className="text-[10px] text-moonly-muted hover:text-white/60 px-2 py-1 rounded bg-white/5 transition-colors"
            >
              {showHistory ? '收起' : '历史'}
            </button>
          )}
          {!revealed && (
            <button
              onClick={handleReveal}
              className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition"
            >
              {todayRecord ? '查看' : '抽牌'}
            </button>
          )}
        </div>
      </div>

      {revealed || todayRecord ? (
        <div className="space-y-3">
          {displayCards.map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/5 animate-fade-in">
              <div className={`w-10 h-14 rounded-lg border-2 flex items-center justify-center text-lg flex-shrink-0 ${
                item.isReversed ? 'border-red-500/30 bg-red-500/5 rotate-180' : 'border-gold/30 bg-gold/5'
              }`}>
                {item.emoji}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-white text-xs font-medium">{item.name}</span>
                  <span className="text-[10px] text-moonly-muted">{item.position}</span>
                  {item.isReversed && (
                    <span className="text-[10px] text-red-400 bg-red-500/10 px-1 rounded">逆位</span>
                  )}
                </div>
                <p className="text-moonly-muted text-[10px] leading-relaxed">{item.advice}</p>
              </div>
            </div>
          ))}
          {todayRecord && !revealed && (
            <p className="text-[10px] text-moonly-muted text-center">今日已抽牌，明日再来吧～</p>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="w-16 h-20 rounded-xl border-2 border-dashed border-white/10 mx-auto mb-3 flex items-center justify-center">
            <span className="text-2xl">🎴</span>
          </div>
          <p className="text-moonly-muted text-xs">点击抽牌，获取今日塔罗指引</p>
        </div>
      )}

      {/* History */}
      {showHistory && records.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
          <p className="text-[10px] text-moonly-muted mb-2">最近抽牌记录</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {records.slice(0, 7).map(r => (
              <div key={r.date} className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
                <span className="text-lg">{r.cards[0]?.emoji || '🎴'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80">{r.cards[0]?.name || ''} · {r.cards.length}张牌</p>
                </div>
                <span className="text-[10px] text-moonly-muted shrink-0">{r.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
