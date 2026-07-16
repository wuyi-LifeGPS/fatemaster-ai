'use client'

import { useState, useEffect, useCallback } from 'react'
import { hapticLight } from '@/lib/haptic'
import { showToast } from './Toast'

const STORAGE_KEY = 'lifegps_dream_entries'

const DREAM_SYMBOLS = [
  { symbol: '水', meaning: '情感、潜意识、变化' },
  { symbol: '火', meaning: '激情、愤怒、转化' },
  { symbol: '飞', meaning: '自由、超越、渴望' },
  { symbol: '坠落', meaning: '失控、焦虑、不安全感' },
  { symbol: '追逐', meaning: '逃避、压力、未解决问题' },
  { symbol: '考试', meaning: '自我评价、准备不足、焦虑' },
  { symbol: '迷路', meaning: '迷茫、方向感缺失、探索' },
  { symbol: '死亡', meaning: '结束、转变、新生' },
  { symbol: '金钱', meaning: '价值感、安全感、欲望' },
  { symbol: '动物', meaning: '本能、直觉、原始欲望' },
  { symbol: '房屋', meaning: '自我、安全感、内心世界' },
  { symbol: '交通工具', meaning: '人生方向、控制感、进展' },
]

interface DreamEntry {
  id: string
  text: string
  date: string
  symbols: string[]
}

function getEntries(): DreamEntry[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveEntries(entries: DreamEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

function analyzeDream(text: string): string[] {
  const symbols: string[] = []
  DREAM_SYMBOLS.forEach(s => {
    if (text.includes(s.symbol)) {
      symbols.push(s.symbol)
    }
  })
  return symbols
}

export default function DreamJournal() {
  const [entries, setEntries] = useState<DreamEntry[]>([])
  const [newEntry, setNewEntry] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<DreamEntry | null>(null)

  useEffect(() => {
    setEntries(getEntries())
  }, [])

  const handleAdd = useCallback(() => {
    if (!newEntry.trim()) return
    hapticLight()
    const symbols = analyzeDream(newEntry.trim())
    const entry: DreamEntry = {
      id: Date.now().toString(),
      text: newEntry.trim(),
      date: new Date().toISOString(),
      symbols,
    }
    const updated = [entry, ...entries].slice(0, 30)
    setEntries(updated)
    saveEntries(updated)
    setNewEntry('')
    setShowForm(false)
    showToast('梦境已记录', 'success')
  }, [newEntry, entries])

  const handleDelete = useCallback((id: string) => {
    hapticLight()
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    saveEntries(updated)
    setSelectedEntry(null)
    showToast('已删除', 'info')
  }, [entries])

  const recentEntries = entries.slice(0, 5)

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌙</span>
          <h3 className="text-gold text-sm font-semibold">梦境日记</h3>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold hover:bg-gold/20 transition"
        >
          {showForm ? '✕' : '+'}
        </button>
      </div>

      {showForm && (
        <div className="mb-3 animate-fade-in">
          <textarea
            value={newEntry}
            onChange={e => setNewEntry(e.target.value)}
            placeholder="昨晚梦见了什么？"
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm placeholder:text-moonly-muted focus:outline-none focus:border-gold/30 resize-none"
            rows={3}
          />
          <div className="flex justify-between mt-2">
            <div className="flex flex-wrap gap-1">
              {DREAM_SYMBOLS.slice(0, 6).map((s) => (
                <button
                  key={s.symbol}
                  onClick={() => setNewEntry(prev => prev + s.symbol)}
                  className="px-2 py-0.5 rounded bg-white/5 text-moonly-muted text-[10px] hover:bg-white/10 transition"
                >
                  {s.symbol}
                </button>
              ))}
            </div>
            <button
              onClick={handleAdd}
              disabled={!newEntry.trim()}
              className="px-4 py-1.5 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition disabled:opacity-30"
            >
              记录
            </button>
          </div>
        </div>
      )}

      {recentEntries.length > 0 ? (
        <div className="space-y-2">
          {recentEntries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-white/80 text-xs truncate flex-1 mr-2">{entry.text}</p>
                <span className="text-[10px] text-moonly-muted">
                  {new Date(entry.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {entry.symbols.length > 0 && (
                <div className="flex gap-1 mt-1">
                  {entry.symbols.map((s) => (
                    <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-moonly-muted text-xs text-center py-2">
          {showForm ? '' : '还没有梦境记录，点击 + 开始'}
        </p>
      )}

      {/* 详情弹窗 */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEntry(null)}
        >
          <div
            className="w-full max-w-sm bg-[#1a1a2e] rounded-2xl border border-white/10 p-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-moonly-muted text-xs">
                {new Date(selectedEntry.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <button
                onClick={() => handleDelete(selectedEntry.id)}
                className="text-white/20 hover:text-red-400 transition text-xs"
              >
                删除
              </button>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3">{selectedEntry.text}</p>
            {selectedEntry.symbols.length > 0 && (
              <div className="space-y-2">
                <p className="text-moonly-muted text-xs">梦境解析</p>
                {selectedEntry.symbols.map((s) => {
                  const symbol = DREAM_SYMBOLS.find(ds => ds.symbol === s)
                  return symbol ? (
                    <div key={s} className="p-2 rounded-lg bg-white/5">
                      <span className="text-purple-300 text-xs font-medium">{symbol.symbol}</span>
                      <span className="text-moonly-muted text-xs ml-2">{symbol.meaning}</span>
                    </div>
                  ) : null
                })}
              </div>
            )}
            <button
              onClick={() => setSelectedEntry(null)}
              className="w-full mt-3 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
