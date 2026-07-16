'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CHAKRAS = [
  { id: 'root', name: '海底轮', color: '#ef4444', colorClass: 'from-red-500/40 to-red-600/20', emoji: '🔴', location: '脊柱底部', desc: ' grounding、安全感、生存本能' },
  { id: 'sacral', name: '生殖轮', color: '#f97316', colorClass: 'from-orange-500/40 to-orange-600/20', emoji: '🟠', location: '下腹部', desc: '情感、创造力、性能量' },
  { id: 'solar', name: '太阳轮', color: '#eab308', colorClass: 'from-yellow-500/40 to-yellow-600/20', emoji: '🟡', location: '胃部上方', desc: '意志力、自信、个人力量' },
  { id: 'heart', name: '心轮', color: '#22c55e', colorClass: 'from-green-500/40 to-green-600/20', emoji: '🟢', location: '胸部中央', desc: '爱、慈悲、宽恕' },
  { id: 'throat', name: '喉轮', color: '#06b6d4', colorClass: 'from-cyan-500/40 to-cyan-600/20', emoji: '🔵', location: '喉咙', desc: '表达、沟通、真实' },
  { id: 'third-eye', name: '眉心轮', color: '#6366f1', colorClass: 'from-indigo-500/40 to-indigo-600/20', emoji: '🔮', location: '两眉之间', desc: '直觉、洞察、智慧' },
  { id: 'crown', name: '顶轮', color: '#a855f7', colorClass: 'from-purple-500/40 to-purple-600/20', emoji: '🟣', location: '头顶', desc: '灵性连接、宇宙意识' },
]

type Phase = 'intro' | 'chakra' | 'complete'

export default function ChakraPage() {
  const [phase, setPhase] = useState<Phase>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const CHAKRA_DURATION = 60 // 每个脉轮60秒

  const start = () => {
    setPhase('chakra')
    setCurrentIdx(0)
    setProgress(0)
    setIsRunning(true)
    runChakra(0)
  }

  const runChakra = (idx: number) => {
    setCurrentIdx(idx)
    setProgress(0)

    const startTime = Date.now()
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const pct = Math.min(elapsed / CHAKRA_DURATION, 1)
      setProgress(pct)
      if (pct >= 1) {
        if (timerRef.current) clearInterval(timerRef.current)
        if (idx + 1 < CHAKRAS.length) {
          runChakra(idx + 1)
        } else {
          complete()
        }
      }
    }, 100)
  }

  const complete = () => {
    setIsRunning(false)
    setPhase('complete')
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const stop = () => {
    setIsRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const reset = () => {
    stop()
    setPhase('intro')
    setCurrentIdx(0)
    setProgress(0)
  }

  const currentChakra = CHAKRAS[currentIdx]

  return (
    <div className="px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/xiu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">脉轮清理</h1>
          <p className="text-moonly-text-muted text-xs">七轮净化，能量平衡</p>
        </div>
      </div>

      {/* 七脉轮可视化 */}
      <div className="moonly-card p-6 mb-6">
        <div className="flex justify-center gap-3 mb-6">
          {CHAKRAS.map((c, i) => (
            <div
              key={c.id}
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                i === currentIdx && isRunning
                  ? 'scale-150 shadow-lg'
                  : i < currentIdx
                  ? 'opacity-100'
                  : 'opacity-30'
              }`}
              style={{
                backgroundColor: c.color,
                boxShadow: i === currentIdx && isRunning ? `0 0 12px ${c.color}` : 'none',
              }}
            />
          ))}
        </div>

        {phase === 'intro' && (
          <div className="text-center">
            <div className="text-4xl mb-3">💫</div>
            <div className="text-lg font-bold text-white mb-2">七脉轮净化冥想</div>
            <p className="text-sm text-moonly-text-secondary mb-4">
              从海底轮到顶轮，逐个净化和激活七个脉轮。每个脉轮约60秒。
            </p>
            <button
              onClick={start}
              className="px-8 py-3 rounded-full bg-moonly-gold/15 text-gold border border-moonly-gold/20 font-medium hover:bg-moonly-gold/20 transition"
            >
              开始净化
            </button>
          </div>
        )}

        {phase === 'chakra' && currentChakra && (
          <div className="text-center">
            <div
              className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${currentChakra.colorClass} flex items-center justify-center border border-white/10 transition-all duration-1000`}
              style={{
                transform: `scale(${0.8 + progress * 0.5})`,
                boxShadow: `0 0 ${30 + progress * 40}px ${currentChakra.color}40`,
              }}
            >
              <span className="text-4xl">{currentChakra.emoji}</span>
            </div>

            <div className="text-xl font-bold text-white mb-1">{currentChakra.name}</div>
            <div className="text-sm text-moonly-text-secondary mb-1">{currentChakra.location}</div>
            <p className="text-xs text-moonly-text-muted mb-4">{currentChakra.desc}</p>

            {/* 进度 */}
            <div className="w-full bg-white/10 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: currentChakra.color,
                }}
              />
            </div>
            <div className="text-xs text-moonly-text-muted">
              脉轮 {currentIdx + 1} / {CHAKRAS.length} · {Math.ceil(CHAKRA_DURATION - progress * CHAKRA_DURATION)}秒
            </div>

            <button
              onClick={stop}
              className="mt-4 px-6 py-2 rounded-full bg-white/5 text-moonly-text-secondary border border-white/10 text-sm hover:bg-white/10 transition"
            >
              暂停
            </button>
          </div>
        )}

        {phase === 'complete' && (
          <div className="text-center">
            <div className="text-4xl mb-3">✨</div>
            <div className="text-lg font-bold text-white mb-2">净化完成</div>
            <p className="text-sm text-moonly-text-secondary mb-4">
              七个脉轮已全部净化，能量场已恢复平衡。
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={start}
                className="px-6 py-2 rounded-full bg-moonly-gold/15 text-gold border border-moonly-gold/20 text-sm font-medium hover:bg-moonly-gold/20 transition"
              >
                再来一次
              </button>
              <button
                onClick={reset}
                className="px-6 py-2 rounded-full bg-white/5 text-moonly-text-secondary border border-white/10 text-sm hover:bg-white/10 transition"
              >
                返回
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 脉轮说明 */}
      <div className="space-y-2">
        {CHAKRAS.map(c => (
          <div key={c.id} className="moonly-card p-3 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ backgroundColor: `${c.color}20` }}
            >
              {c.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium">{c.name}</div>
              <div className="text-moonly-text-muted text-xs">{c.location} · {c.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
