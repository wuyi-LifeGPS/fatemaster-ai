'use client'

import { useState, useEffect, useCallback, useRef, memo } from 'react'
import { hapticLight } from '@/lib/haptic'

const BREATH_CYCLES = [
  { name: '放松呼吸', inhale: 4, hold: 4, exhale: 4, hold2: 0, desc: '4-4-4 平衡呼吸' },
  { name: '箱式呼吸', inhale: 4, hold: 4, exhale: 4, hold2: 4, desc: '4-4-4-4 箱式呼吸' },
  { name: '深度放松', inhale: 4, hold: 7, exhale: 8, hold2: 0, desc: '4-7-8 助眠呼吸' },
]

function MeditationTimer() {
  const [selectedCycle, setSelectedCycle] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale' | 'hold2'>('idle')
  const [progress, setProgress] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const cycle = BREATH_CYCLES[selectedCycle]

  const runCycle = useCallback(() => {
    const phases: { name: typeof phase; duration: number }[] = [
      { name: 'inhale', duration: cycle.inhale },
      { name: 'hold', duration: cycle.hold },
      { name: 'exhale', duration: cycle.exhale },
    ]
    if (cycle.hold2 > 0) {
      phases.push({ name: 'hold2', duration: cycle.hold2 })
    }

    let currentPhase = 0
    let elapsed = 0

    const tick = () => {
      const p = phases[currentPhase]
      elapsed += 0.1
      setProgress(Math.min(100, (elapsed / p.duration) * 100))

      if (elapsed >= p.duration) {
        elapsed = 0
        currentPhase = (currentPhase + 1) % phases.length
        setPhase(phases[currentPhase].name as typeof phase)
        setTotalTime(prev => prev + p.duration)
      }
    }

    setPhase('inhale')
    timerRef.current = setInterval(tick, 100)
  }, [cycle])

  const start = () => {
    hapticLight()
    setIsRunning(true)
    setTotalTime(0)
    runCycle()
  }

  const stop = () => {
    hapticLight()
    setIsRunning(false)
    setPhase('idle')
    setProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const phaseText = {
    idle: '准备开始',
    inhale: '吸气',
    hold: '屏息',
    exhale: '呼气',
    hold2: '屏息',
  }

  const phaseEmoji = {
    idle: '🧘',
    inhale: '👃',
    hold: '⏸️',
    exhale: '💨',
    hold2: '⏸️',
  }

  return (
    <div className="moonly-card p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">🧘</span>
        <h3 className="text-gold text-sm font-semibold">呼吸冥想</h3>
      </div>

      {!isRunning ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            {BREATH_CYCLES.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setSelectedCycle(i)}
                className={`flex-1 p-2 rounded-xl text-center transition ${
                  selectedCycle === i
                    ? 'bg-gold/10 border border-gold/20'
                    : 'bg-white/5 border border-transparent hover:bg-white/10'
                }`}
              >
                <div className="text-white text-xs font-medium">{c.name}</div>
                <div className="text-[10px] text-moonly-muted">{c.desc}</div>
              </button>
            ))}
          </div>
          <button
            onClick={start}
            className="w-full py-3 rounded-xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition"
          >
            开始练习
          </button>
        </div>
      ) : (
        <div className="text-center py-4">
          <div className="text-4xl mb-2 animate-pulse">{phaseEmoji[phase]}</div>
          <div className="text-white text-lg font-medium mb-1">{phaseText[phase]}</div>
          <div className="w-32 h-1 rounded-full bg-white/10 mx-auto mb-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-moonly-muted text-xs mb-3">
            已练习 {Math.floor(totalTime / 60)}分{totalTime % 60}秒
          </div>
          <button
            onClick={stop}
            className="px-6 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition"
          >
            结束练习
          </button>
        </div>
      )}
    </div>
  )
}

export default memo(MeditationTimer)
