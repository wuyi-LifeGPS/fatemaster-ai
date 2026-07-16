'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const BREATH_TECHNIQUES = [
  {
    id: '478',
    name: '4-7-8 呼吸法',
    desc: '吸气4秒，屏息7秒，呼气8秒。快速缓解焦虑，帮助入睡。',
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 4,
    color: 'from-blue-400/30 to-indigo-400/20',
  },
  {
    id: 'box',
    name: '箱式呼吸',
    desc: '吸气4秒，屏息4秒，呼气4秒，屏息4秒。提升专注力，平复情绪。',
    inhale: 4,
    hold: 4,
    exhale: 4,
    hold2: 4,
    cycles: 5,
    color: 'from-teal-400/30 to-cyan-400/20',
  },
  {
    id: 'coherent',
    name: '共振呼吸',
    desc: '吸气5秒，呼气5秒。与心率共振，进入平衡状态。',
    inhale: 5,
    hold: 0,
    exhale: 5,
    cycles: 6,
    color: 'from-emerald-400/30 to-green-400/20',
  },
]

type Phase = 'inhale' | 'hold' | 'exhale' | 'hold2' | 'idle'

export default function BreathPage() {
  const [selected, setSelected] = useState(BREATH_TECHNIQUES[0])
  const [phase, setPhase] = useState<Phase>('idle')
  const [cycle, setCycle] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef(0)
  const isRunningRef = useRef(false)

  // 清理 timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const start = () => {
    setIsRunning(true)
    isRunningRef.current = true
    setCycle(0)
    runPhase('inhale')
  }

  const stop = () => {
    setIsRunning(false)
    isRunningRef.current = false
    setPhase('idle')
    setProgress(0)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const runPhase = (p: Phase) => {
    setPhase(p)
    setProgress(0)

    let duration = 0
    if (p === 'inhale') duration = selected.inhale
    else if (p === 'hold') duration = selected.hold
    else if (p === 'exhale') duration = selected.exhale
    else if (p === 'hold2') duration = selected.hold2 || 0

    if (duration <= 0) {
      nextPhase(p)
      return
    }

    startTimeRef.current = Date.now()
    timerRef.current = setInterval(() => {
      if (!isRunningRef.current) {
        if (timerRef.current) clearInterval(timerRef.current)
        return
      }
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const pct = Math.min(elapsed / duration, 1)
      setProgress(pct)
      if (pct >= 1) {
        if (timerRef.current) clearInterval(timerRef.current)
        nextPhase(p)
      }
    }, 50)
  }

  const nextPhase = (current: Phase) => {
    if (!isRunningRef.current) return
    if (current === 'inhale') {
      if (selected.hold > 0) runPhase('hold')
      else runPhase('exhale')
    } else if (current === 'hold') {
      runPhase('exhale')
    } else if (current === 'exhale') {
      if ((selected as any).hold2 > 0) runPhase('hold2')
      else {
        setCycle(prev => {
          const newCycle = prev + 1
          if (newCycle >= selected.cycles) {
            stop()
            return prev
          }
          return newCycle
        })
        runPhase('inhale')
      }
    } else if (current === 'hold2') {
      setCycle(prev => {
        const newCycle = prev + 1
        if (newCycle >= selected.cycles) {
          stop()
          return prev
        }
        return newCycle
      })
      runPhase('inhale')
    }
  }

  const phaseText = {
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    hold2: '屏息',
    idle: '准备',
  }

  const phaseSubtext = {
    inhale: '让空气充满肺部',
    hold: '保持自然放松',
    exhale: '缓缓释放所有气息',
    hold2: '保持自然放松',
    idle: '选择一种呼吸法开始',
  }

  return (
    <div className="min-h-screen moonly-bg moonly-content px-4 pt-4 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/xiu" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-gold-gradient text-xl font-bold">呼吸练习</h1>
          <p className="text-moonly-text-muted text-xs">调整呼吸，回归平静</p>
        </div>
      </div>

      {/* 呼吸可视化 */}
      <div className="moonly-card p-8 mb-6 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${selected.color} transition-all duration-1000 flex items-center justify-center border border-white/10`}
            style={{
              transform: phase === 'inhale' ? 'scale(1.3)' : phase === 'exhale' ? 'scale(0.7)' : phase === 'idle' ? 'scale(1)' : 'scale(1.15)',
              opacity: 0.3 + progress * 0.4,
            }}
          >
            <div className="text-4xl font-bold text-white">
              {isRunning ? Math.ceil((1 - progress) * (phase === 'inhale' ? selected.inhale : phase === 'hold' ? selected.hold : phase === 'exhale' ? selected.exhale : selected.hold2 || 0)) : '🌬️'}
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="text-xl font-bold text-white mb-1">{phaseText[phase]}</div>
          <div className="text-sm text-moonly-text-secondary">{phaseSubtext[phase]}</div>
          {isRunning && (
            <div className="mt-3 text-xs text-moonly-text-muted">
              第 {cycle + 1} / {selected.cycles} 轮
            </div>
          )}
        </div>

        <div className="mt-6">
          {!isRunning ? (
            <button
              onClick={start}
              className="px-8 py-3 rounded-full bg-moonly-gold/15 text-gold border border-moonly-gold/20 font-medium hover:bg-moonly-gold/20 transition"
            >
              开始练习
            </button>
          ) : (
            <button
              onClick={stop}
              className="px-8 py-3 rounded-full bg-white/5 text-moonly-text-secondary border border-white/10 font-medium hover:bg-white/10 transition"
            >
              停止
            </button>
          )}
        </div>
      </div>

      {/* 选择呼吸法 */}
      <div className="space-y-3">
        {BREATH_TECHNIQUES.map(tech => (
          <button
            key={tech.id}
            onClick={() => {
              stop()
              setSelected(tech)
            }}
            className={`w-full text-left moonly-card p-4 transition ${selected.id === tech.id ? 'border-moonly-gold/30' : ''}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-medium ${selected.id === tech.id ? 'text-gold' : 'text-white'}`}>
                {tech.name}
              </span>
              <span className="text-[10px] text-moonly-text-muted">
                {tech.inhale}-{tech.hold || 0}-{tech.exhale} 秒
              </span>
            </div>
            <p className="text-xs text-moonly-text-secondary">{tech.desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
